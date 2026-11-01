# Cloudflare Preview Deployment

## Purpose

This runbook describes isolated Cloudflare Workers previews for reviewing the compiled vinext application. It is not the production deployment procedure.

## Approved target behavior and current prototype status

The target product rules are:
- One #1 Wilayah position per Kabupaten/Kota across all categories.
- One independent #1 Kategori position per Kabupaten/Kota/category.
- Fixed claim price Rp20.000 for one selected position; the latest successfully confirmed payment becomes champion.
- Province and Indonesia are grouping/display scopes; Kabupaten/Kota is the only competition geography.
- Clicks are secondary statistics only.
- No public map, map pins or browser location permission request.

The current preview remains the earlier leaderboard/foundation prototype. It uses synthetic sample businesses and values labelled DATA SIMULASI, and does not yet implement the two approved claim positions or real payment flow end to end. Do not interpret the current demo ranking/order or period controls as the approved production rules.

## Current standalone Worker preview

The pre-existing Worker kenalanumkm-pr-1 is a legacy standalone prototype uploaded through the Script API; it is left untouched. GitHub Actions manages a separate Worker named kenalanumkm-preview at https://kenalanumkm-preview.kenalanumkm-preview.workers.dev. The compiled vinext/Next.js application is deployed there from the PR branch.

## Automated GitHub PR preview

The repository workflow .github/workflows/ci.yml runs lint, typecheck, tests and production build for PRs targeting main. When CLOUDFLARE_API_TOKEN is configured in the GitHub preview environment, it deploys the configured Worker kenalanumkm-preview and checks /api/health. The current setup uses one shared preview Worker for this PR; do not use it for concurrent PR previews.

When the secret is absent, code checks still run but the preview deployment is intentionally skipped. Do not deploy manually through the Cloudflare API as a workaround; GitHub remains the source of truth.

To enable preview deployment, add CLOUDFLARE_API_TOKEN scoped to the KenalanUMKM Cloudflare account using the official Edit Cloudflare Workers template. Never paste the token into the repository, workflow file or chat.

## Data and cost safeguards

- Preview must use synthetic/demo data only.
- No production Supabase credentials or production records.
- No real payment processing or live champion updates.
- No paid Cloudflare add-on is provisioned by this preview.
- Do not add a custom domain or deploy production as part of PR preview.
- Never present synthetic champions or clicks as real activity.
- Never claim preview is updated unless the workflow deploy and /api/health check succeed.