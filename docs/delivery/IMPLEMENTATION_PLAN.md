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

Acceptance: documents describe three independent board scopes; users may claim any city/regency or province without physical-location matching; customer price is all-in Rp20.000; ranking follows valid webhook receipt time; Google Login plus business phone/SMS or WhatsApp OTP is required; duplicate profiles are permitted; no category competition. Scaffold builds; CI passes; preview is reachable and health endpoint returns ok; no secrets committed.

## Phase 1 — Public leaderboard UI

Build three independent leaderboard scopes: Kabupaten/Kota, Provinsi and Indonesia.

Use synthetic data to demonstrate ordered-list behavior: a new profile is inserted at #1 and all existing rows move down one place. When a profile already on the board claims again, move its existing row to #1; rows above its old position move down one place and rows below it keep their positions. Other profiles keep their relative order. The exact same profile ID cannot appear twice on one board; distinct profile IDs may duplicate the same business and may each appear. No cross-account or branch-level duplicate detection is implemented. A claim on one board does not create or change an entry on another board.

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

Configure Google OAuth through Supabase Auth. Implement the header states, sign-in callback, logout and return-to-claim behavior. Require a valid Google session before Claim #1. Also implement OTP verification of the UMKM business contact number through phone/SMS or WhatsApp; this proves access to the channel only, not legal ownership. Associate profiles with the authenticated Supabase user ID. Allow unlimited saved profiles per account and do not deduplicate same-business profiles.

Acceptance:
- Public leaderboard reads work signed out.
- Claim #1 redirects signed-out visitors to Google Login and resumes the intended claim afterward.
- Signed-in header shows account identity and Logout.
- Logout does not delete profiles or paid leaderboard entries.
- Same account can reuse saved profiles.
- RLS prevents access to another account's private profiles.
- UI does not claim Google Login proves legal business ownership.
- UI does not claim Google Login plus business-contact OTP proves legal business ownership.
- Do not assume the verified contact state is permanent or require OTP on every claim; verification validity and re-verification timing remain undecided until approved.
- User may choose a city/regency/province board regardless of the profile's descriptive location.
- Same-business duplicate profiles are not blocked or merged.

## Phase 3 — Claim creation and fixed-price payment

Implement server-priced claim/payment intents for exactly Rp20.000 all-in per selected board; platform absorbs provider/bank fees. Each intent expires 15 minutes after server creation. A claim binds one profile and one board. Require a provider-issued unique invoice/QRIS/VA/reference and an authenticated webhook for exact payment matching. Verify provider API, webhook authenticity, supported accounts, commercial permission, fees/limits and unique-reference matching before choosing the production adapter. Moota remains a candidate only pending that verification.

Acceptance:
- One unique payment intent per claim.
- Exact amount and destination validation.
- Every identical Rp20.000 payment can be reliably matched to one exact claim by a unique provider reference, not amount alone.
- Customer sees exactly Rp20.000; provider fees are absorbed by the platform.
- Payment intent expires after 15 minutes; late-payment handling remains a separate unresolved decision.
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
- Concurrent claims are applied according to server-recorded receipt time of valid authenticated webhooks. Identical receipt-time tie-breaking remains an open decision and must be resolved before production ranking is enabled.
- Server-recorded receipt time of the valid authenticated provider webhook determines rank; provider paid_at and browser timestamps are ignored.
- Out-of-order webhook delivery affects rank by design.
- Equal webhook receipt-time tie-break remains an open release decision.
- No time-based reset.

## Phase 5 — Public profile and safe management

Expose only intentionally public business information and board entries. Implement safe profile editing and avatar handling. Profile edits must not modify leaderboard order. Keep account ownership and private contact/payment data protected.

Acceptance: public privacy tests; account-level RLS; no cross-account profile access; no profile edit can alter payment or rank; no sensitive data leaks.

## Phase 6 — Operational and payment hardening

Add reconciliation, provider event monitoring, alerting, support procedures and immutable audit inspection. No refund is due solely because a profile is displaced; exceptions are duplicate charges, system/provider errors or legal requirements. The exception workflow, late payments after 15-minute expiry, chargebacks, reversals and mistaken payments remain open and must not be implemented by assumption.

Acceptance: recovery from duplicate, delayed, malformed and out-of-order provider webhooks is tested using receipt-time ordering; unique-reference payment matching and idempotency are proven; expiry behavior is tested without inventing late-payment handling; approved refund cases are auditable; no secret or personal payment data leaks to logs.

## Phase 7 — Production readiness

Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval. Do not deploy production or activate real payments without owner approval.
