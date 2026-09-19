export type DeliveryMethod = "plus" | "group";

export function getDeliveryConfirmation(method: DeliveryMethod) {
  if (method === "plus") {
    return {
      title: "Roblox Plus selected.",
      body: "Your delivery preference is recorded while final eligibility is reviewed.",
    };
  }

  return {
    title: "Group payout selected.",
    body: "Your delivery preference is recorded while final eligibility is reviewed.",
  };
}
