# Implementation Plan

## Delivery rules

Keep milestones small and reviewable. Each completed milestone ends with CI results and, where applicable, a reachable Cloudflare preview URL deployed from GitHub and verified. User reviews the preview before the next major milestone. No production deployment or PR merge without explicit approval. Preview uses synthetic data and no real payment processing.

## Phase 0 — Foundation and approved rules

- Product definition and authoritative business rules.
- App flow, technical requirements, backend schema, design and delivery documents.
- AGENTS.md and repository workflow.
- Next.js + vinext + TypeScript + Tailwind foundation.
- Responsive leaderboard-first UI shell and health endpoint.
- GitHub Actions checks and Cloudflare preview workflow.
- Supabase migrations folder and environment example.
- No real claim or payment processing.

Acceptance: documents describe exactly three independent board scopes, one Rp20.000 price, latest confirmed claim moves a profile to #1, Google Login required for claims, and no category competition. Scaffold builds; CI passes; preview is reachable and health endpoint returns ok; no secrets committed.

## Phase 1 — Public leaderboard UI

Build three independent leaderboard scopes: Kabupaten/Kota, Provinsi and Indonesia.

Use synthetic data to demonstrate ordered-list behavior: a new profile is inserted at #1 and all existing rows move down one place. When a profile already on the board claims again, move its existing row to #1; rows above its old position move down one place and rows below it keep their positions. Other profiles keep their relative order. A profile cannot appear twice on one board. A claim on one board does not create or change an entry on another board.

Acceptance:
- Visitors can browse all boards without login.
- Correct location selectors appear for each scope.
- All business types compete together.
- No category-specific board or category ranking filter.
- Rank numbers reflect order within the selected board only.
- No payment total, points, clicks or profile views determine rank.
- No map, pins or browser geolocation.
- Responsive review passes; DATA SIMULASI remains visible.

## Phase 2 — Google Login and saved UMKM profiles

Configure Google OAuth through Supabase Auth. Implement the header states, sign-in callback, logout and return-to-claim behavior. Require a valid Google session before Claim #1. Associate profiles with the authenticated Supabase user ID. Let returning users select a saved profile or create a new one.

Acceptance:
- Public leaderboard reads work signed out.
- Claim #1 redirects signed-out visitors to Google Login and resumes the intended claim afterward.
- Signed-in header shows account identity and Logout.
- Logout does not delete profiles or paid leaderboard entries.
- Same account can reuse saved profiles.
- RLS prevents access to another account's private profiles.
- UI does not claim Google Login proves legal business ownership.

## Phase 3 — Claim creation and fixed-price payment

Implement server-priced claim/payment intents for exactly Rp20.000 per selected board. A claim binds one profile and one board. Verify provider API, webhook/notification authenticity, supported accounts, commercial permission, fees/limits and unique payment matching before choosing the production adapter. Moota remains a candidate only pending that verification.

Acceptance:
- One unique payment intent per claim.
- Exact amount and destination validation.
- Every identical Rp20.000 payment can be reliably matched to one exact claim.
- Browser cannot modify price, payment state, target board or profile owner.
- Duplicate/replayed provider events are ignored safely.
- Pending/failed/unverified payment does not change a board.
- Payment records are immutable and auditable.

## Phase 4 — Ordered board ledger

On a valid payment confirmation, atomically update the selected board entry and movement history. Move the selected profile to #1; preserve the relative order of all other profiles. Update an existing entry instead of adding a duplicate when the same profile reclaims the same board. Other boards stay unchanged.

Acceptance:
- A new profile enters at #1 and all existing entries shift down one place.
- A profile already at #5 can become #1; prior #1 through #4 move down one place, while prior #6 and later keep their positions.
- Reclaim never creates a duplicate row.
- Repeat claim never creates a duplicate row on the same board.
- One profile can hold entries on multiple boards only through separate claims/payments.
- Concurrent claims for one board get deterministic ordering.
- Trusted provider payment time or an explicitly approved server confirmation order is used; never a browser timestamp.
- No time-based reset.

## Phase 5 — Public profile and safe management

Expose only intentionally public business information and board entries. Implement safe profile editing and avatar handling. Profile edits must not modify leaderboard order. Keep account ownership and private contact/payment data protected.

Acceptance: public privacy tests; account-level RLS; no cross-account profile access; no profile edit can alter payment or rank; no sensitive data leaks.

## Phase 6 — Operational and payment hardening

Add reconciliation, provider event monitoring, alerting, support procedures and immutable audit inspection. Refund, chargeback, expiry, provider fees and mistaken-payment behavior remain disabled until separately approved.

Acceptance: recovery from duplicate, delayed, malformed and out-of-order provider events is tested; payment matching and ranking chronology are proven; no secret or personal payment data leaks to logs.

## Phase 7 — Production readiness

Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval. Do not deploy production or activate real payments without owner approval.
