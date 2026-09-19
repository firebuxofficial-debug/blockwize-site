# Validation notes

- The protected administrator login screen loaded correctly with the upgraded gateway-style composition.
- After authentication, the dashboard loaded real stored metrics and refreshed its timestamp automatically.
- The Links category displayed the Discord and Roblox group URLs supplied by the public configuration endpoint, and saving the official destinations returned a successful publication confirmation.
- The Users category displayed two existing Roblox profile records. The Roblox account avatar rendered; the SonecaLofy avatar did not visibly render, so a browser-level fallback will be added for stored or unreachable image URLs.
- The public sponsor CTA at `/home/en` and both community actions in the `/en` community preview resolved to the persisted official destinations after the save.
- The authenticated dashboard refreshed its live-status timestamp after a five-second polling cycle without a manual refresh action.
- The 375px mobile capture confirmed that the redesigned administrative login remains contained, readable, and touch-friendly on a narrow viewport. The dashboard navigation and cards also include dedicated 720px responsive rules for the same viewport range.
- An authenticated 375px validation exercised Overview, Users, and Links. Overview and Links matched the viewport, while the Users table retained an intentional internal horizontal scroll; the page-level overflow was corrected so the document width now remains 375px in every administrative view.
- A second authenticated 375px pass after the Vercel hardening reconfirmed Overview, Users, and Links without page-level overflow. The Users table keeps its intentional internal scroll and the Links form remains readable and usable.
- The protected metrics query returned JSON with a valid administrative cookie, and the restored OAuth callback route is covered by an integration test.
