# Agent Instructions

## Source of truth
Read these references before coding:
- docs/product/PRODUCT.md
- docs/product/APP_FLOW.md
- docs/architecture/TECHNICAL_REQUIREMENTS.md
- docs/architecture/BACKEND_SCHEMA.md
- docs/design/DESIGN_BRIEF.md
- docs/delivery/IMPLEMENTATION_PLAN.md

If documents conflict, stop and report the conflict; never silently resolve it.

## Product boundaries
- Preserve Indonesia-only, map-first, physical-location UMKM concept and cumulative-stake ranking.
- Province is grouping/navigation; Kabupaten/Kota is the only geographic competition unit. Never add Kecamatan/Kelurahan/Desa as navigation, filters, leaderboard or competition levels.
- Do not expand into generic directory, Google Maps clone, reviews/ratings, marketplace, booking/POS/CRM, pay-per-lead, subscription-led SaaS, territory ownership, prizes or virtual listings.
- Click counts and other engagement metrics must never influence rank.

## Working rules
- Work in feature branches and PRs. Never merge or deploy production without explicit user approval.
- Keep milestones small and reviewable. Share preview only after deployment and health check are verified.
- Do not add unapproved product, legal, ranking, payment, refund or moderation rules.
- Prioritize free tier. Do not provision paid resources or enable paid features without explaining cost and receiving approval.
- Never commit secrets. Never expose Supabase secret/service-role credentials to browser code.
- All exposed Supabase tables require deliberate RLS. Prefer SECURITY INVOKER; SECURITY DEFINER requires documented justification and security review.
- All DDL belongs in supabase/migrations. Do not mutate production schema manually.
- Moota is not approved for production until written commercial permission and pricing/limits are confirmed.
- Do not use public OSM standard raster tiles for commercial production; choose and document a licensed map provider.

## Quality gates
- Run lint, typecheck, tests and build. Add migration/security checks when schema changes.
- Never claim a test or deployment passed unless its result was observed.
- Report the changed files, actual test results, preview URL (if deployed), and unresolved blockers.
