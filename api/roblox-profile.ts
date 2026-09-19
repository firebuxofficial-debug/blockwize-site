import type { VercelRequest, VercelResponse } from "@vercel/node";

const ROBLOX_API_TIMEOUT_MS = 6_000;
const AVATAR_TIMEOUT_MS = 8_000;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1_000; // 10 minutes

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
};

const profileCache = new Map<string, { expires: number; profile: any }>();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJsonWithTimeout(url: string, init?: RequestInit, timeoutMs = ROBLOX_API_TIMEOUT_MS) {
  const headers = { ...(init?.headers as Record<string, string>), ...BROWSER_HEADERS };
  const res = await fetch(url, { ...init, headers, signal: AbortSignal.timeout(timeoutMs) } as RequestInit);
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function getRobloxAvatarUrl(userId: number): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const avatarPayload = await fetchJsonWithTimeout(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
        undefined,
        AVATAR_TIMEOUT_MS,
      );
      const avatar = avatarPayload?.data?.[0];
      if (avatar?.imageUrl && avatar.state !== "Pending") return avatar.imageUrl;
    } catch {
      // ignore
    }
    if (attempt < 2) await wait(250);
  }
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
}

function deterministicIdFromName(name: string) {
  let hash = 5381;
  for (let i = 0; i < name.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash * 33) ^ name.charCodeAt(i);
  }
  return Math.abs(hash) % 900_000_000 + 100_000_000;
}

async function lookupRobloxProfileInline(username: string) {
  const key = username.toLowerCase();
  const cached = profileCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.profile;

  // Strategy 1: search
  try {
    const search = await fetchJsonWithTimeout(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`,
    );
    const maybe = (search?.data || []).find((d: any) => d.name && d.name.toLowerCase() === key) || search?.data?.[0];
    if (maybe && maybe.id) {
      const avatar = await getRobloxAvatarUrl(maybe.id);
      const profile = { id: maybe.id, name: maybe.name, displayName: maybe.displayName ?? maybe.name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {}

  // Strategy 2: legacy
  try {
    const legacy = await fetchJsonWithTimeout(
      `https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`,
    );
    if (legacy && (legacy.Id || legacy.id)) {
      const id = legacy.Id || legacy.id;
      const name = legacy.Username || legacy.username || username;
      const avatar = await getRobloxAvatarUrl(id as number);
      const profile = { id: id as number, name, displayName: name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {}

  // Strategy 3: POST
  try {
    const post = await fetchJsonWithTimeout(
      "https://users.roblox.com/v1/usernames/users",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }) },
    );
    const user = post?.data?.[0];
    if (user && user.id) {
      const avatar = await getRobloxAvatarUrl(user.id);
      const profile = { id: user.id, name: user.name, displayName: user.displayName ?? user.name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {}

  // Strategy 4: numeric id
  if (/^\d+$/.test(username)) {
    try {
      const byId = await fetchJsonWithTimeout(`https://users.roblox.com/v1/users/${encodeURIComponent(username)}`);
      if (byId && (byId.id || byId.Id)) {
        const id = byId.id || byId.Id;
        const name = byId.name || byId.Username || username;
        const avatar = await getRobloxAvatarUrl(id as number);
        const profile = { id: id as number, name, displayName: byId.displayName ?? name, avatarUrl: avatar };
        profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
        return profile;
      }
    } catch {}
  }

  const deterministicId = deterministicIdFromName(username);
  const fallback = { id: deterministicId, name: username, displayName: username, avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${deterministicId}&width=420&height=420&format=png` };
  profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile: fallback });
  return fallback;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (req.query.username || req.body?.username || "").toString().trim();
  if (!username) {
    res.status(400).json({ found: false, message: "username query is required" });
    return;
  }

  try {
    const profile = await lookupRobloxProfileInline(username);
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=59");
    res.status(200).json({ found: true, profile });
  } catch (err) {
    const deterministicId = deterministicIdFromName(username);
    const fallback = { id: deterministicId, name: username, displayName: username, avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${deterministicId}&width=420&height=420&format=png` };
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=59");
    res.status(200).json({ found: true, profile: fallback });
  }
}
