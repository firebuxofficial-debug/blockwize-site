const VISITOR_STORAGE_KEY = "blockwise-visitor-id";

export function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing) return existing;
    const visitorId = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    return visitorId;
  } catch {
    return crypto.randomUUID();
  }
}
