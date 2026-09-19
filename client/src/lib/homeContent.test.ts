import { describe, expect, it } from "vitest";
import { homeContent } from "./homeContent";

describe("home page content", () => {
  it("explains the sponsor-supported model without illegal reward claims", () => {
    expect(homeContent.en.sponsorStatement).toContain("Sponsors");
    expect(homeContent.en.safetyStatement).toContain("never use hacks");
    expect(homeContent.en.safetyStatement).toContain("illegal methods");
  });

  it("states the current 500–1,000 Robux range and explains that sponsorship is still growing", () => {
    expect(homeContent.en.rewardLimitStatement).toContain("500 and 1,000 Robux");
    expect(homeContent.en.rewardLimitStatement).toContain("few sponsors");
    expect(homeContent.en.sponsorInvite).toContain("Discord");
  });

  it("keeps the child-friendly participation journey to three simple steps", () => {
    expect(homeContent.en.participationSteps).toHaveLength(3);
    expect(homeContent.pt.participationSteps.map((step) => step.number)).toEqual(["01", "02", "03"]);
  });
});
