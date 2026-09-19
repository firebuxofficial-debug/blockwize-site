import { describe, expect, it } from "vitest";
import {
  COMMUNITY_CHECK_DELAY_MS,
  getCommunityTaskCompletionStatus,
  getCommunityTaskMessage,
} from "./communityProgress";

describe("community verification progress", () => {
  it("uses a forty-five second check-in window", () => {
    expect(COMMUNITY_CHECK_DELAY_MS).toBe(45_000);
  });

  it("does not claim that a Discord entry was automatically verified", () => {
    expect(getCommunityTaskMessage("discord", "ready")).toContain("ready for review");
    expect(getCommunityTaskMessage("discord", "ready")).toContain("verify participation");
    expect(getCommunityTaskCompletionStatus("discord")).toBe("ready");
  });

  it("asks the player to retry the Roblox group check when no confirmation is available", () => {
    expect(getCommunityTaskMessage("roblox", "retry")).toContain("could not check");
    expect(getCommunityTaskMessage("roblox", "retry")).toContain("try again");
    expect(getCommunityTaskCompletionStatus("roblox")).toBe("retry");
  });
});
