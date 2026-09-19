import { describe, expect, it } from "vitest";
import { getDeliveryConfirmation } from "./delivery";

describe("getDeliveryConfirmation", () => {
  it("describes the saved Roblox Plus preference", () => {
    expect(getDeliveryConfirmation("plus")).toEqual({
      title: "Roblox Plus selected.",
      body: "Your delivery preference is recorded while final eligibility is reviewed.",
    });
  });

  it("describes the saved Group payout preference", () => {
    expect(getDeliveryConfirmation("group")).toEqual({
      title: "Group payout selected.",
      body: "Your delivery preference is recorded while final eligibility is reviewed.",
    });
  });
});
