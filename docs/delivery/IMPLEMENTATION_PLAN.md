# Implementation Plan

## Delivery rules

Small reviewable milestones. Every completed milestone ends with CI results and, where applicable, a reachable Cloudflare preview URL deployed from GitHub and verified. User reviews the preview before the next major milestone. No production deployment or PR merge without explicit approval. Preview uses synthetic data and no real payment processing.

## Phase 0 — Foundation

- Approved product definition and business rules.
- App flow, technical requirements, backend schema, design and delivery documents.
- AGENTS.md and repository workflow.
- Initialize Next.js + vinext + TypeScript + Tailwind.
- Responsive leaderboard-first UI shell and health endpoint.
- GitHub Actions checks and Cloudflare preview workflow.
- Supabase migrations folder and environment example.
- No real claim or payment processing.

Acceptance: docs agree on two position types and fixed Rp20.000 claim price; scaffold starts/builds; CI valid; preview reachable and health endpoint returns ok; no secrets committed.

## Phase 1 — Leaderboard-first UI

Build the Indonesia Top 20 #1 Wilayah board, province grouping view and Kabupaten/Kota view. Add a clear switch to #1 Kategori and category-specific champion lists. Use synthetic examples that demonstrate the independent positions.

Acceptance:
- One #1 Wilayah champion per Kabupaten/Kota.
- One #1 Kategori champion per Kabupaten/Kota/category.
- A business in one position does not automatically occupy the other.
- Indonesia Top 20 regional board contains at most one #1 Wilayah row per city/regency.
- Province view groups champions for the selected board.
- City view presents its overall and category champions.
- No map, pins or browser geolocation.
- Payment totals and clicks do not determine rank.
- Responsive review passes; DATA SIMULASI remains visible.

## Phase 2 — Geography and claim-first profile

Verify the authoritative Kabupaten/Kota identity dataset and licensing. Add the canonical geography/category references required by the product. Design the Claim #1 experience: select city/regency, choose #1 Wilayah or #1 Kategori, fill the UMKM profile inside the claim, and create a private claim intent.

Replace the legacy signup/owner/moderation assumptions using additive migrations. Do not rewrite already-applied migrations. Do not create a standalone registration route, owner account prerequisite or manual review queue.

Acceptance: a claim targets exactly one valid position; category is required for a category claim; profile/claim data remains private before payment; the browser cannot assign champion status.

## Phase 3 — Fixed-price payment and champion ledger

Implement server-priced payment intents at exactly Rp20.000 per selected position. Verify the provider's current API, webhook/notification authenticity, supported banks/accounts, commercial permission, plan, pricing and limits before choosing the production adapter. Moota remains a candidate pending that verification.

On valid payment confirmation, atomically mark payment paid, store immutable payment/provider-event history, serialize access to the target position, replace its current champion, append a champion-transition record and publish the profile immediately.

Acceptance: exact amount and destination validation; idempotent provider events; duplicate/replay rejection; one payment updates only one slot; separate regional/category positions; reclaim at Rp20.000; concurrent claims serialize deterministically; pending/failed payments do not alter champion; no manual review.

## Phase 4 — Public profile and safe management

Expose only live claimed profiles and their intended public links. Design future profile editing or recovery separately, without converting first claim into signup-first onboarding. Secure claim-scoped avatar upload and private contact data.

Acceptance: public privacy tests; capability tokens scoped and protected; no cross-claim access; owner recovery does not permit rank/payment mutation.

## Phase 5 — Payment and operational hardening

Add reconciliation, provider event monitoring, alerting, support procedures and immutable audit inspection. Refund, fee, expiry and failure-resolution behavior must remain disabled until separately approved.

Acceptance: recovery from duplicate, delayed, malformed and out-of-order provider events is tested; no secret or personal payment data leaks to logs.

## Phase 6 — Production readiness

Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval. Do not deploy production or activate real payments without owner approval.