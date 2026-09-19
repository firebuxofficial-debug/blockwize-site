import { afterEach, describe, expect, it, vi } from "vitest";
import { getRobloxAvatarFallbackUrl, lookupRobloxProfile, RobloxProfileError } from "./robloxProfile";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("lookupRobloxProfile", () => {
  it("resolves the public profile and avatar returned by Roblox", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ id: 1, name: "Roblox", displayName: "Roblox" }] }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ imageUrl: "https://example.com/avatar.png", state: "Completed" }] }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupRobloxProfile("Roblox")).resolves.toEqual({
      id: 1,
      name: "Roblox",
      displayName: "Roblox",
      avatarUrl: "https://example.com/avatar.png",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries a pending avatar thumbnail before returning the profile", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ id: 1, name: "Roblox", displayName: "Roblox" }] }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ state: "Pending" }] }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ imageUrl: "https://example.com/retried-avatar.png", state: "Completed" }] }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupRobloxProfile("Roblox")).resolves.toMatchObject({
      avatarUrl: "https://example.com/retried-avatar.png",
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("returns the public profile with a permanent Roblox avatar fallback when the thumbnail request fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [{ id: 1, name: "Roblox", displayName: "Roblox" }] }), { status: 200 }),
      )
      .mockRejectedValueOnce(new Error("thumbnail service unavailable"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupRobloxProfile("Roblox")).resolves.toEqual({
      id: 1,
      name: "Roblox",
      displayName: "Roblox",
      avatarUrl: getRobloxAvatarFallbackUrl(1),
    });
  });

  it("reports a not-found username without calling the avatar endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupRobloxProfile("missing-player")).rejects.toMatchObject<Partial<RobloxProfileError>>({
      kind: "not_found",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reports an upstream error when the Roblox API is unavailable", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupRobloxProfile("Roblox")).rejects.toMatchObject<Partial<RobloxProfileError>>({
      kind: "upstream",
    });
  });
});
