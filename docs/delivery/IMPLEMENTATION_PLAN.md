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

## Phase 1 — Database schema draft and ranking engine

Translate the approved business rules into a reviewable relational schema and server-side ranking logic before building UI or payment-provider integration.

- Draft independent board, entry, claim, payment-intent, webhook-event, payment-transaction, business-contact-verification and movement-history tables.
- Preserve the five applied legacy migrations. Any eventual schema change must be a new additive migration.
- Remove the legacy maximum-three-pending-profile assumption in the target schema; retain ownership checks and concurrency protection.
- Do not add any duplicate business/branch/account constraints across distinct profile IDs.
- Model arbitrary city/province board selection; do not check the selected board against profile location.
- Implement fixed IDR 20.000 price and 15-minute claim/payment-intent expiry as server-controlled values.
- Build a pure ranking engine that processes one verified claim on one board, deduplicates events/transactions, and maintains one row per exact profile ID per board.
- Rank by server-captured webhook-received timestamp at microsecond precision. Do not rank by provider paid_at or callback-processing order.
- Surface identical webhook receipt timestamps as unresolved; do not invent a tie-break.
- Record late payments after expiry as unresolved; do not rank or automatically refund them.
- Add automated tests for insert, reclaim, board independence, duplicate profile IDs, webhook idempotency, unique-reference matching, amount/currency/signature checks, ownership, OTP state, out-of-order processing, microsecond ties and expiry.

Acceptance:
- Public board scopes are modelled independently: Kabupaten/Kota, Provinsi and Indonesia.
- A claim can mutate exactly one selected board.
- A new profile is inserted according to the valid webhook receipt-time order.
- A later-received claim for an existing profile updates the same row and moves it to #1.
- An earlier-received webhook processed later cannot incorrectly jump ahead of a later-received webhook.
- No duplicate row exists for the same profile ID on the same board; separate profile IDs are allowed even when they describe the same business.
- Any city/province board may be selected regardless of descriptive profile location.
- IDR 20.000 is fixed and intent expiry is 15 minutes.
- Equal timestamp and late-payment cases remain unresolved and do not mutate rank.
- Ranking tests, lint, typecheck and build pass.
- The schema remains a draft until reviewed; no migration is applied to the linked Supabase project.
- No live provider adapter, OTP delivery, real payment or production deployment is enabled.

## Phase 2 — Public leaderboard UI

Build three independent leaderboard scopes: Kabupaten/Kota, Provinsi and Indonesia.

Use synthetic data to demonstrate the ordered-list behavior implemented in Phase 1. Remove stake-based ranking, period selectors, category competition and one-winner-per-city assumptions.

Acceptance:
- Visitors can browse all boards without login.
- Correct location selectors appear for each scope.
- All business types compete together.
- No category-specific board or category ranking filter.
- Rank numbers reflect order within the selected board only.
- No payment total, points, clicks or profile views determine rank.
- No map, pins or browser geolocation.
- Responsive review passes; DATA SIMULASI remains visible until real data is intentionally enabled.

## Phase 3 — Google Login and saved UMKM profiles

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

## Phase 4 — Claim creation and fixed-price payment

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

## Phase 5 — Ordered board ledger

Connect the reviewed schema and ranking engine to authenticated payment events. Apply payment and ranking changes atomically.

Acceptance:
- A new profile enters at the correct place according to webhook receipt time.
- A profile already on the board can become #1 after a later valid webhook receipt; other profiles preserve relative order.
- Reclaim never creates a duplicate row.
- One profile can hold entries on multiple boards only through separate claims/payments.
- Concurrent claims are serialized and ordered by server-recorded webhook receipt time.
- Identical receipt-time ties remain unresolved until a separate rule is approved.
- Late payments after expiry remain unresolved and do not rank.
- No time-based reset.

## Phase 6 — Public profile and safe management

Expose only intentionally public business information and board entries. Implement safe profile editing and avatar handling. Profile edits must not modify leaderboard order. Keep account ownership and private contact/payment data protected.

Acceptance: public privacy tests; account-level RLS; no cross-account profile access; no profile edit can alter payment or rank; no sensitive data leaks.

## Phase 7 — Operational and payment hardening

Add reconciliation, provider event monitoring, alerting, support procedures and immutable audit inspection. No refund is due solely because a profile is displaced; exceptions are duplicate charges, system/provider errors or legal requirements. The exception workflow, late payments after 15-minute expiry, chargebacks, reversals and mistaken payments remain open and must not be implemented by assumption.

Acceptance: recovery from duplicate, delayed, malformed and out-of-order provider webhooks is tested using receipt-time ordering; unique-reference payment matching and idempotency are proven; expiry behavior is tested without inventing late-payment handling; approved refund cases are auditable; no secret or personal payment data leaks to logs.

## Phase 8 — Production readiness

Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval. Do not deploy production or activate real payments without owner approval.
