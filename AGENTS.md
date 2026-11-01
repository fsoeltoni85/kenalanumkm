# Agent Instructions

## Source of truth

Read these references before coding:
- docs/product/PRODUCT.md
- docs/product/BUSINESS_RULES.md
- docs/product/APP_FLOW.md
- docs/architecture/TECHNICAL_REQUIREMENTS.md
- docs/architecture/BACKEND_SCHEMA.md
- docs/design/DESIGN_BRIEF.md
- docs/delivery/IMPLEMENTATION_PLAN.md

If documents conflict, BUSINESS_RULES.md is authoritative for price, claim, champion and leaderboard behavior. Report and resolve any other conflicts before coding; never silently invent a product rule.

## Product boundaries

- Indonesia only; the product is a pay-to-rank competition for physical UMKM.
- Every Kabupaten/Kota has exactly one #1 Wilayah position across all categories.
- Every Kabupaten/Kota/category pair has exactly one #1 Kategori position.
- Those positions are independent; one paid claim changes only its selected position.
- Every claim costs exactly Rp20.000. No auction, bidding, outbid increment, dynamic pricing or cumulative payment/stake ranking.
- The latest successfully confirmed payment for a position becomes champion. A previous champion must pay Rp20.000 again to reclaim.
- A first claim is Claim #1 → choose city and position → fill UMKM form → pay → verified payment → immediate live champion.
- No standalone signup/registration, no manual review queue and no pending_review/approved activation workflow in the approved product flow.
- Indonesia Top 20 is the regional #1 Wilayah champion board; category boards show category champions. Province groups its city/regency champions.
- Kabupaten/Kota is the only geographic competition unit. Province is grouping/navigation only.
- Do not reintroduce maps, public map pins, map-based discovery, device geolocation or coordinate-based leaderboard visualization.
- Do not add Kecamatan/Kelurahan/Desa as navigation, filters or competition levels.
- Clicks and engagement never affect champion status.
- Do not expand into reviews/ratings/voting, marketplace, booking/POS/CRM, pay-per-lead, subscription-led SaaS, territory ownership, prizes or payout to winners.
- Do not invent refund, expiry, fee or failed-payment rules; they require separate approval.

## Working rules

- Work in feature branches and PRs. Never merge or deploy production without explicit user approval.
- Keep milestones small and reviewable. Share preview only after GitHub CI/deployment and health check are verified.
- Do not provision paid resources or enable paid features without explaining cost and receiving approval.
- Never commit secrets. Never expose Supabase secret/service-role credentials to browser code.
- All exposed Supabase tables require deliberate RLS. Prefer SECURITY INVOKER; SECURITY DEFINER requires documented justification and security review.
- All DDL belongs in supabase/migrations. Preserve already-applied migration history; correct the legacy owner/moderation model through additive migrations.
- Moota is not approved for production until current API behavior, commercial permission, pricing and limits are verified.

## Quality gates

- Run lint, typecheck, tests and build. Add migration/security tests when schema changes.
- Never claim a test or deployment passed unless its result was observed.
- Report changed files, actual test results, commit, PR and verified preview URL where deployed.