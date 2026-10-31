# Cloudflare Preview Deployment

## Purpose
This runbook describes the isolated Cloudflare Workers preview used to review KenalanUMKM's map-first product UI. It is not the production deployment procedure.

## Current preview status

The current preview has been deployed directly through the authenticated Cloudflare connection:

- Worker: `kenalanumkm-pr-1`
- URL: https://kenalanumkm-pr-1.kenalanumkm-preview.workers.dev
- Root page: HTTP 200; map-first KenalanUMKM interface.
- `/api/health`: HTTP 200 with `{"status":"ok","app":"kenalanumkm","preview":true,"kind":"map-competition-preview"}`.
- `/data/indonesia-38-provinces.geojson`: HTTP 200, served from the upstream province GeoJSON dataset.
- This standalone Worker preview is **not** the compiled vinext/Next.js bundle. The source implementation is in the PR branch and CI checks the application build separately.

The revised interface keeps the Indonesia map as the main surface and frames the leaderboard around Kabupaten/Kota + category. The compact leaderboard has All Time, Hari Ini and Harian (date archive) views, category pills, rank, stake and clicks. Its clearly labelled synthetic examples are for UI review only; they are not registered businesses, real payments or traffic.

## Geography data

The preview uses the 38-province GeoJSON from:

- Repository: https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces
- Dataset license declared by the repository: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- Attribution is shown in the interface and recorded in `public/data/README.md`.

The preview Worker proxies this dataset from the upstream GitHub raw URL. MapLibre renders it when WebGL is available; a GeoJSON-driven SVG fallback keeps province selection working when WebGL is unavailable. The dataset provides provincial shapes only; it does not include Kabupaten/Kota competition polygons or UMKM locations. The upstream provenance/source terms could not be verified from the repository's referenced source file during implementation. Review those terms and validate the boundary dataset before production/commercial use. Do not treat these polygons as authoritative cadastral or legal boundaries.

No third-party raster basemap tiles are used. A production tile/style provider has not been selected.

## Worker hostname

The account workers.dev subdomain configured for this project is:

`kenalanumkm-preview.workers.dev`

For PR number N, the expected preview URL is:

`https://kenalanumkm-pr-N.kenalanumkm-preview.workers.dev`

## Direct Cloudflare deployment

The current preview was uploaded directly through the authenticated Cloudflare connection. This path does not require storing a Cloudflare API token in GitHub Actions.

The direct upload is suitable for this standalone visual prototype. It does not turn the standalone Worker into a vinext/Next.js deployment and does not establish continuous deployment for later commits.

## GitHub environment setup for automated PR previews

The repository workflow's automated preview deployment and cleanup jobs use a GitHub Actions environment named `preview`. Add one secret there:

- `CLOUDFLARE_API_TOKEN`: create a scoped Cloudflare API token using the official **Edit Cloudflare Workers** template, limited to the KenalanUMKM account. Do not paste it into this repository, a workflow file, or a chat message.

The account ID is configured in `cloudflare.config.ts` and the workflow; it is an identifier, not a secret.

When the secret is absent, lint/typecheck/tests/build still run, but the workflow's automated preview deployment step is skipped. This secret is only needed by GitHub Actions automation, not by the direct Cloudflare deployment described above.

## Workflow behavior

1. GitHub Actions installs dependencies and runs lint, typecheck, tests and production build.
2. Only after all checks pass, a same-repository PR can deploy to a dedicated Worker named `kenalanumkm-pr-N`, subject to the GitHub environment secret.
3. The workflow polls `/api/health`. It posts/updates a PR comment only after the health check succeeds.
4. Closing the PR deletes that dedicated preview Worker.
5. Production Worker name `kenalanumkm` is not used by this PR preview job.

## Data and cost safeguards

- No production Supabase credentials are configured by this preview.
- No payment provider or real payment flow is enabled.
- No paid Cloudflare product add-on is provisioned by this preview. Worker requests and resource quotas remain subject to the account's current plan limits.
- Do not add a custom domain or deploy to production as part of PR preview.
- Never display sample values as real-time listings, clicks, verified businesses, addresses, or stake totals.

## Troubleshooting

- If automated preview deployment is skipped, check that `CLOUDFLARE_API_TOKEN` exists in the GitHub `preview` environment.
- If the map geometry endpoint fails, check upstream GeoJSON availability and Worker logs.
- If the map itself fails to initialize, inspect browser console/network requests for the MapLibre CDN and GeoJSON endpoint.
- If deployment succeeds but health polling fails, inspect the GitHub Actions deploy and health-check logs before sharing the URL.
- If the account workers.dev domain changes, update the expected hostname in this workflow and this runbook.
