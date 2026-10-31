# Cloudflare Preview Deployment

## Purpose

This runbook describes isolated Cloudflare Workers previews for reviewing the compiled vinext application. It is not the production deployment procedure.

## Current repository UI

The public product is leaderboard-first:
- Indonesia Top 20 city champions.
- Province is a grouping view of its city champions.
- Kabupaten/Kota scope shows exactly one local champion and its national rank.
- Category and All Time / Hari Ini / Harian controls apply to the same city-champion ranking model.
- Stake is the sole ranking metric; clicks are secondary statistics.
- Synthetic names, stakes and clicks are visibly labelled DATA SIMULASI.
- There is no public map and no browser location permission request.

## Current standalone Worker preview

The old standalone Worker kenalanumkm-pr-1 was created directly for visual review before the GitHub application was ready. It is not the compiled vinext/Next.js bundle and is not automatically synchronized with this repository. Treat it as a legacy preview only; do not use it to verify the current leaderboard-first source.

## Automated GitHub PR preview

The repository workflow .github/workflows/ci.yml runs lint, typecheck, tests and production build for PRs targeting main. When a CLOUDFLARE_API_TOKEN secret is configured in the GitHub preview environment, it deploys an isolated Worker named kenalanumkm-pr-{number} and checks /api/health.

When the secret is absent, code checks still run but the preview deployment is intentionally skipped. Do not deploy manually through the Cloudflare API as a workaround; GitHub remains the source of truth.

To enable preview deployment, add:
- CLOUDFLARE_API_TOKEN: scoped to the KenalanUMKM Cloudflare account using the official Edit Cloudflare Workers template. Never paste the token into the repository, workflow file or chat.

## Data and cost safeguards

- Preview must use synthetic/demo data only.
- No production Supabase credentials or production records.
- No real payment processing or live stake updates.
- No paid Cloudflare add-on is provisioned by this preview.
- Do not add a custom domain or deploy production as part of PR preview.
- Never present synthetic rows, stakes or clicks as real activity.
- Never claim preview is updated unless the workflow deploy and /api/health check succeed.
