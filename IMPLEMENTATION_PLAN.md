# Implementation Plan

## Delivery rules
Small reviewable milestones. Every milestone ends with CI results and a reachable Cloudflare preview URL where applicable. User reviews preview and approves before next major milestone / production. No paid resources or production deploy without explicit approval. Preview uses non-production data and no real payment processing.

## Phase 0 — Foundation (current)
- Core product, technical, flow, design, backend and implementation documents.
- AGENTS.md and repository workflow.
- Initialize Next.js + vinext + TypeScript + Tailwind.
- Responsive map-first UI shell and health endpoint.
- GitHub Actions checks and preview deployment template.
- Supabase migrations folder and environment example.
- No production tables, payment integration or production deploy.

Acceptance: docs present; scaffold starts/builds; CI valid; preview reachable and health endpoint returns ok; no secrets committed.

## Phase 1 — Map-first UI
Refine Indonesia map, mobile layout, province → Kabupaten/Kota navigation, category selection, city/category leaderboard and detail shell using clearly labelled sample data. Select licensed map tile/style provider before live map.

Acceptance: desktop/mobile visual review; map remains primary; no subdistrict competition hierarchy; sample data labelled.

## Phase 2 — Geography and listings
Verify authoritative province/Kabupaten/Kota dataset and licensing. Add migrations, categories, physical listing model, geocoding and duplicate review, RLS and public read model.

Acceptance: valid geography; one listing = one real location; public fields restricted; RLS tests pass.

## Phase 3 — Ranking and ledger
Owner approves ranking/payment rules. Implement append-only stake ledger, idempotent aggregation, city/category leaderboard, concurrency and duplicate/reversal tests.

Acceptance: rank only from confirmed stake; client cannot modify ledger/rank; approved tie-break/outbid rules tested.

## Phase 4 — Ownership and moderation
Finalize claim/verification rules; implement owner dashboard, review/audit and RLS.

Acceptance: unverified users cannot change protected fields; sensitive decisions audited.

## Phase 5 — Payment verification
Get written Moota approval for commercial SaaS use; confirm API/webhook access, plan, limits, prices and bank support. Implement adapter, payment intents, webhook verification, reconciliation and ledger posting.

Acceptance: authenticated/idempotent events; safe reconciliation; no stake counted before backend verification.

## Phase 6 — Production readiness
Security/performance/privacy/legal review, backup/restore, monitoring, domain, production secrets, rollback and explicit release approval.
