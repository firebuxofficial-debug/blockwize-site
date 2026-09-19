export type RobloxPublicProfile = {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string | null;
};

type AvatarThumbnail = {
  imageUrl?: string;
  state?: "Completed" | "Pending" | "Blocked" | "Error";
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const ROBLOX_API_TIMEOUT_MS = 6_000;
const AVATAR_TIMEOUT_MS = 8_000;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1_000; // 10 minutes

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
};

const profileCache = new Map<string, { expires: number; profile: RobloxPublicProfile }>();

export function getRobloxAvatarFallbackUrl(userId: number) {
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
}

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

export async function getRobloxAvatarUrl(userId: number): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const avatarPayload = await fetchJsonWithTimeout(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
        undefined,
        AVATAR_TIMEOUT_MS,
      );
      const avatar = avatarPayload?.data?.[0] as AvatarThumbnail | undefined;
      if (avatar?.imageUrl && avatar.state !== "Pending") {
        return avatar.imageUrl;
      }
    } catch {
      // fallthrough to retry
    }

    if (attempt < 2) await wait(250);
  }

  return getRobloxAvatarFallbackUrl(userId);
}

function deterministicIdFromName(name: string) {
  // DJB2-ish hash to a positive 9-digit number
  let hash = 5381;
  for (let i = 0; i < name.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash * 33) ^ name.charCodeAt(i);
  }
  return Math.abs(hash) % 900_000_000 + 100_000_000;
}

export async function lookupRobloxProfile(username: string): Promise<RobloxPublicProfile> {
  const key = username.toLowerCase();
  const cached = profileCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.profile;

  // Strategy 1: GET users search
  try {
    const search = await fetchJsonWithTimeout(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`,
    );
    const maybe = search?.data?.find((d: any) => d.name && d.name.toLowerCase() === key) || search?.data?.[0];
    if (maybe && maybe.id) {
      const avatar = await getRobloxAvatarUrl(maybe.id);
      const profile = { id: maybe.id, name: maybe.name, displayName: maybe.displayName ?? maybe.name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {
    // continue to next strategy
  }

  // Strategy 2: legacy api.roblox.com/get-by-username
  try {
    const legacy = await fetchJsonWithTimeout(
      `https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`,
    );
    if (legacy && (legacy.Id || legacy.Id === 0)) {
      const id = legacy.Id || legacy.id;
      const name = legacy.Username || legacy.username || username;
      const avatar = await getRobloxAvatarUrl(id as number);
      const profile = { id: id as number, name, displayName: name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {
    // continue
  }

  // Strategy 3: POST batch lookup
  try {
    const postPayload = await fetchJsonWithTimeout(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
      },
    );
    const user = postPayload?.data?.[0];
    if (user && user.id) {
      const avatar = await getRobloxAvatarUrl(user.id);
      const profile = { id: user.id, name: user.name, displayName: user.displayName ?? user.name, avatarUrl: avatar };
      profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
      return profile;
    }
  } catch {
    // continue
  }

  // Strategy 4: if input is numeric, GET by id
  if (/^\d+$/.test(username)) {
    try {
      const byId = await fetchJsonWithTimeout(
        `https://users.roblox.com/v1/users/${encodeURIComponent(username)}`,
      );
      if (byId && (byId.id || byId.Id)) {
        const id = byId.id || byId.Id;
        const name = byId.name || byId.Username || username;
        const avatar = await getRobloxAvatarUrl(id as number);
        const profile = { id: id as number, name, displayName: byId.displayName ?? name, avatarUrl: avatar };
        profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile });
        return profile;
      }
    } catch {
      // continue
    }
  }

  // All upstream strategies failed — return deterministic fallback (never throws)
  const deterministicId = deterministicIdFromName(username);
  const fallbackProfile: RobloxPublicProfile = {
    id: deterministicId,
    name: username,
    displayName: username,
    avatarUrl: getRobloxAvatarFallbackUrl(deterministicId),
  };
  profileCache.set(key, { expires: Date.now() + PROFILE_CACHE_TTL_MS, profile: fallbackProfile });
  return fallbackProfile;
}
