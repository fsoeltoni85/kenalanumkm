# Cloudflare Preview Deployment

## Purpose

This runbook describes isolated Cloudflare Workers previews for reviewing the compiled vinext application. It is not the production deployment procedure.

## Current repository UI

The public product is leaderboard-first:
- Indonesia Top 20 of #1 Wilayah champions, one per represented Kabupaten/Kota.
- Category leaderboard shows the #1 Kategori champion for the selected category in each Kabupaten/Kota.
- Province is a grouping view of its city/regency champions.
- Kabupaten/Kota scope presents the regional champion and category champions.
- Fixed claim price is Rp20.000 per selected position; the latest successfully confirmed payment becomes champion.
- Clicks are secondary statistics only.
- Synthetic sample businesses and champion assignments are visibly labelled DATA SIMULASI.
- There is no public map and no browser location permission request.

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