export type CommunityTask = "discord" | "roblox";
export type CommunityTaskStatus = "idle" | "waiting" | "ready" | "retry";

export const COMMUNITY_CHECK_DELAY_MS = 45_000;

export function getCommunityTaskCompletionStatus(task: CommunityTask): CommunityTaskStatus {
  return task === "discord" ? "ready" : "retry";
}

export function getCommunityTaskMessage(task: CommunityTask, status: CommunityTaskStatus) {
  if (status === "waiting") {
    return task === "discord"
      ? "Keep Discord open for a moment, then come back here."
      : "Keep the Roblox group open for a moment, then come back here.";
  }

  if (status === "ready") {
    return "Discord step ready for review. We will verify participation during reward review.";
  }

  if (status === "retry") {
    return "We could not check the Roblox group from this page. Make sure you joined, then try again.";
  }

  return "Open the community, join it, then return here for the next check-in.";
}
