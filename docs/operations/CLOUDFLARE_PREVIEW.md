# Cloudflare Preview Deployment

## Purpose

This runbook describes isolated Cloudflare Workers previews for reviewing the compiled vinext application. It is not the production deployment procedure.

## Approved product rules and current prototype status

The approved target product rules are:
- Three independent claimable leaderboard scopes: Kabupaten/Kota, Provinsi and Indonesia.
- Every successful claim costs exactly Rp20.000, regardless of scope.
- All UMKM compete together; category is descriptive profile information only.
- Each claim affects one selected board only. Province and Indonesia boards are not totals or roll-ups of smaller boards.
- The latest successfully confirmed claim moves the selected profile to #1; other entries shift down while keeping their relative order.
- Reclaiming the same board moves the existing profile entry to #1 instead of creating a duplicate.
- Public browsing does not require login; Claim #1 requires Google Login.
- Claim flow additionally requires OTP to the UMKM business phone/SMS or WhatsApp contact; this proves channel access only, not legal ownership.
- Any city/regency or province board may be selected without matching the business's actual location.
- Distinct duplicate profiles for the same brand/branch/business are allowed; only repeated claims by the exact same profile ID reuse its single board row.
- Each Google account may save unlimited profiles.
- Customer price is exactly Rp20.000 all-in; the platform absorbs payment-provider fees.
- Each payment intent expires after 15 minutes; late-payment handling remains open.
- Ranking order uses server-recorded receipt time of valid authenticated provider webhooks, not provider paid_at.
- No refund solely because a profile is displaced; defined exceptions are duplicate charges, system/provider errors or legal requirements.
- No public map, map pins or browser location permission request.

The current preview remains the earlier leaderboard/foundation prototype. It uses synthetic sample businesses, stake values, category modes and ranking order labelled DATA SIMULASI. It does not yet implement the three approved board scopes, Google Login or the real payment flow end to end. Do not interpret the current demo ranking/order or period controls as the approved production rules.

## Current standalone Worker preview

The pre-existing Worker kenalanumkm-pr-1 is a legacy standalone prototype uploaded through the Script API; it is left untouched. GitHub Actions manages a separate Worker named kenalanumkm-preview at https://kenalanumkm-preview.kenalanumkm-preview.workers.dev. The compiled vinext/Next.js application is deployed there from the PR branch.

## Automated GitHub PR preview

The repository workflow .github/workflows/ci.yml runs lint, typecheck, tests and production build for PRs targeting main and pushes to the configured feature branches. When CLOUDFLARE_API_TOKEN is configured in the GitHub preview environment, it deploys the configured Worker kenalanumkm-preview and checks its health endpoint.

The current setup uses one shared preview Worker for this PR; do not use it for concurrent PR previews.

When the secret is absent, code checks still run but the preview deployment is intentionally skipped. Do not deploy manually through the Cloudflare API as a workaround; GitHub remains the source of truth.

To enable preview deployment, add CLOUDFLARE_API_TOKEN scoped to the KenalanUMKM Cloudflare account using the official Edit Cloudflare Workers template. Never paste the token into the repository, workflow file or chat.

## Data and cost safeguards

- Preview must use synthetic/demo data only.
- No production Supabase credentials or production records.
- No real payment processing or live leaderboard movements.
- No paid Cloudflare add-on is provisioned by this preview.
- Do not add a custom domain or deploy production as part of PR preview.
- Never present synthetic ranking or clicks as real activity.
- Never claim preview is updated unless the workflow deploy and health check succeed.
