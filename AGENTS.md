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

If documents conflict, BUSINESS_RULES.md is authoritative for price, board scope, claim, Google Login and ranking behavior. Report and resolve other conflicts before coding; never silently invent a product rule.

## Product boundaries

- Indonesia only.
- One successful claim costs exactly Rp20.000 at every level.
- There are three independent boards: one Kabupaten/Kota, one Provinsi and one Indonesia board.
- A claim changes exactly one selected board. There is no automatic move, aggregation or point accumulation between levels.
- All UMKM compete together regardless of category. Category is profile metadata only, not a leaderboard dimension.
- The latest valid confirmed claim moves the selected profile to #1. All other entries move down while preserving relative order.
- If the same profile claims the same board again, move its existing entry to #1; do not create a duplicate.
- A separate Rp20.000 payment is required to enter another board.
- Public leaderboard browsing is available without login. Claim #1 requires Google Login through Supabase Auth.
- Header shows Login dengan Google when signed out; signed-in account and Logout when signed in.
- Saved profiles are connected to the authenticated Google/Supabase account and can be reused. Google Login is not proof of legal business ownership.
- Category-specific boards, category ranking filters, auction, bidding, outbid increment, dynamic pricing and cumulative payment scores are not approved.
- Clicks and engagement never affect board order.
- No daily, weekly or monthly leaderboard reset.
- Do not reintroduce public maps, map pins, map-based discovery or device geolocation.
- Do not add Kecamatan, Kelurahan or Desa boards.
- Do not invent refund, chargeback, expiry, fee, duplicate-payment or failed-payment behavior; these require separate approval.
- Moota is a candidate only, not approved for production until matching, account requirements, commercial permission, pricing and limits are verified.

## Working rules

- Work in feature branches and PRs. Never merge or deploy production without explicit user approval.
- Keep milestones small and reviewable. Share preview only after GitHub CI/deployment and health check are verified.
- Do not provision paid resources or enable paid features without explaining cost and receiving approval.
- Never commit secrets. Never expose Supabase secret/service-role credentials to browser code or public Worker variables.
- All exposed Supabase tables require deliberate RLS. Prefer SECURITY INVOKER; SECURITY DEFINER requires documented justification and security review.
- All DDL belongs in supabase/migrations. Preserve already-applied migration history; replace legacy moderation gates through additive migrations.
- Do not claim Google OAuth is configured until callback URLs, provider credentials and end-to-end sign-in are verified.

## Quality gates

- Run lint, typecheck, tests and build. Add migration/security tests when schema changes.
- Never claim a test or deployment passed unless its result was observed.
- Report changed files, actual test results, commit, PR and verified preview URL where deployed.
