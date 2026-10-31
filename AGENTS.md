# Agent Instructions

- Read PRODUCT.md, TECHNICAL_REQUIREMENTS.md, APP_FLOW.md, DESIGN_BRIEF.md, BACKEND_SCHEMA.md and IMPLEMENTATION_PLAN.md before coding.
- These files are source of truth. If they conflict, stop and ask; never silently resolve.
- Preserve Indonesia-only, map-first, physical-location UMKM concept and cumulative-stake ranking.
- Province is grouping/navigation; Kabupaten/Kota is the only geographic competition unit. Never add Kecamatan/Kelurahan/Desa as navigation, filters, leaderboard or competition levels.
- Do not expand into generic directory, Google Maps clone, reviews/ratings, marketplace, booking/POS/CRM, pay-per-lead, subscription-led SaaS, territory ownership, prizes or virtual listings.
- Work in feature branches and PRs. Never merge or deploy production without explicit user approval.
- One milestone per PR where practical. Share preview only after deployment and health check are verified.
- Do not add unapproved product, legal, ranking, payment, refund or moderation rules.
- Prioritize free tier. Do not provision paid resources or enable paid features without explaining cost and receiving approval.
- Never commit secrets. Never expose Supabase secret/service-role credentials to browser code.
- All exposed Supabase tables require deliberate RLS. Prefer SECURITY INVOKER; SECURITY DEFINER requires documented justification and security review.
- All DDL belongs in supabase/migrations. Do not mutate production schema manually.
- Moota is not approved for production until written commercial permission and pricing/limits are confirmed.
- Do not use public OSM standard raster tiles for commercial production; choose and document a licensed map provider.
- Run lint, typecheck, tests, build and security/migration checks appropriate to the change.
- Report actual test/deploy results; never claim a command passed unless its result was observed.
