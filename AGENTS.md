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

- Preserve the Indonesia-only, leaderboard-first UMKM competition.
- Every national row represents exactly one #1 city champion for the selected category and period.
- Province is a grouping/navigation layer. Kabupaten/Kota is the only geographic competition unit.
- Indonesia ranks city champions by cumulative confirmed stake. Click counts and other engagement metrics are secondary metadata and never affect rank.
- City scope shows one champion only; province scope lists its city champions; Indonesia scope lists the national Top 20 city champions.
- Do not reintroduce maps, browser location collection, fabricated pins or city-centroid locations into the public leaderboard experience.
- Do not add Kecamatan/Kelurahan/Desa as navigation, filters or competition levels.
- Do not expand into reviews/ratings/voting, generic directory, marketplace, booking/POS/CRM, pay-per-lead, subscription-led SaaS, territory ownership, prizes or payout to winners.
- Do not invent tie-break, outbid increments, minimum stake, expiry, refund, fee or payment rules. Participation remains disabled until those rules are approved.

## Working rules

- Work in feature branches and PRs. Never merge or deploy production without explicit user approval.
- Keep milestones small and reviewable. Share preview only after deployment and health check are verified.
- Do not add unapproved product, legal, ranking, payment, refund or moderation rules.
- Prioritize free tier. Do not provision paid resources or enable paid features without explaining cost and receiving approval.
- Never commit secrets. Never expose Supabase secret/service-role credentials to browser code.
- All exposed Supabase tables require deliberate RLS. Prefer SECURITY INVOKER; SECURITY DEFINER requires documented justification and security review.
- All DDL belongs in supabase/migrations. Do not mutate production schema manually.
- Moota is not approved for production until written commercial permission and pricing/limits are confirmed.

## Quality gates

- Run lint, typecheck, tests and build. Add migration/security checks when schema changes.
- Never claim a test or deployment passed unless its result was observed.
- Report changed files, actual test results, preview URL (if deployed), and unresolved blockers.
