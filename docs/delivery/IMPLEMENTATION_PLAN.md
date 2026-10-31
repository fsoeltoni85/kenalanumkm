# Implementation Plan

## Delivery rules

Small reviewable milestones. Every milestone ends with CI results and a reachable Cloudflare preview URL where applicable. User reviews preview and approves before next major milestone / production. No paid resources or production deploy without explicit approval. Preview uses non-production data and no real payment processing.

## Phase 0 — Foundation

- Core product, technical, flow, design, backend and implementation documents.
- AGENTS.md and repository workflow.
- Initialize Next.js + vinext + TypeScript + Tailwind.
- Responsive leaderboard-first UI shell and health endpoint.
- GitHub Actions checks and Cloudflare preview workflow.
- Supabase migrations folder and environment example.
- No production tables, payment integration or production deploy.

Acceptance: docs present; scaffold starts/builds; CI valid; preview reachable and health endpoint returns ok; no secrets committed.

## Phase 1 — Leaderboard-first UI

Build the Indonesia Top 20 city-champion board, province grouping view and single-champion city view. Add category, All Time/Hari Ini/Harian controls, search and a clear stake/click hierarchy using clearly labelled synthetic data.

Acceptance: national board contains at most one champion per city; province view contains only its city champions; city view contains exactly one champion; stake alone determines ordering; mobile and desktop review passes.

## Phase 2 — Geography and listings

Verify the authoritative Kabupaten/Kota identity dataset and licensing. Add migrations, categories, physical listing model, address verification workflow, duplicate review, RLS and public read model. Location attributes are stored for validation; no public map is required.

Acceptance: every listing references one valid Kabupaten/Kota; city/region labels are consistent; public fields restricted; RLS tests pass.

## Phase 3 — Ranking and ledger

Owner approves ranking/payment rules. Implement append-only stake ledger, idempotent aggregation, one champion per city/category/period, national ordering, concurrency and duplicate/reversal tests.

Acceptance: rank only from confirmed stake; client cannot modify ledger/rank; unapproved tie-break/outbid rules are not assumed.

## Phase 4 — Ownership and moderation

Finalize claim/verification rules; implement owner dashboard, review/audit and RLS.

Acceptance: unverified users cannot change protected fields; sensitive decisions audited.

## Phase 5 — Payment verification

Get written Moota approval for commercial SaaS use; confirm API/webhook access, plan, limits, prices and bank support. Implement adapter, payment intents, webhook verification, reconciliation and ledger posting.

Acceptance: authenticated/idempotent events; safe reconciliation; no stake counted before backend verification.

## Phase 6 — Production readiness

Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval.
