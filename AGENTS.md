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
- A new profile is inserted at #1 and all existing entries move down one place. If the profile already exists on the board, move that same row to #1; entries above its old position shift down one place and entries below it keep their positions. All other profiles keep their relative order.
- If the same profile claims the same board again, move its existing entry to #1; do not create a duplicate.
- A separate Rp20.000 payment is required to enter another board.
- Public leaderboard browsing is available without login. Claim #1 requires Google Login through Supabase Auth plus OTP verification of the UMKM business phone/SMS or WhatsApp contact channel. Contact OTP proves channel access only, not legal ownership.
- Header shows Login dengan Google when signed out; signed-in account and Logout when signed in.
- Saved profiles are connected to the authenticated Google/Supabase account and can be reused without a profile-count limit. Duplicate profiles for the same business/branch are permitted, including across accounts; do not deduplicate or reject them. Google Login plus contact OTP is not proof of legal business ownership.
- Category-specific boards, category ranking filters, auction, bidding, outbid increment, dynamic pricing and cumulative payment scores are not approved.
- Clicks and engagement never affect board order.
- No daily, weekly or monthly leaderboard reset.
- Do not reintroduce public maps, map pins, map-based discovery or device geolocation.
- Do not add Kecamatan, Kelurahan or Desa boards.
- Customer price is exactly Rp20.000 all-in; platform absorbs provider fees. Payment intents expire after 15 minutes. No refund solely because displaced; exceptions are duplicate charges, system/provider errors or legal requirements. Late payments, chargebacks, reversals, mistaken payments and refund-exception workflow remain open; do not invent their handling.
- Ranking uses server-recorded receipt time of a valid authenticated provider webhook, not provider paid_at or browser time; identical receipt-time tie-breaking remains open.
- Every claim requires a unique provider-issued payment reference/invoice/QRIS/VA plus authenticated webhook; amount-only matching is forbidden.
- Users may claim any city/regency or province board without physical-location matching.
- Google Login is account sign-in; phone/SMS or WhatsApp OTP is a separate business-contact verification step, not account login.
- Do not assume the contact verification lasts forever or must be repeated on every claim. OTP validity and re-verification frequency are still open product decisions.
- Moota is a candidate only, not approved for production until matching, webhook authenticity, account requirements, commercial permission, pricing and limits are verified.

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
