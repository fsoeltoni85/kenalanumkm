# Cloudflare Preview Deployment

## Purpose
This runbook describes the isolated Cloudflare Workers preview used to review KenalanUMKM's geographic leaderboard interface. It is not the production deployment procedure.

## Current preview status
The preview Worker is deployed directly through the authenticated Cloudflare connection:

- Worker: \`kenalanumkm-pr-1\`
- URL: https://kenalanumkm-pr-1.kenalanumkm-preview.workers.dev
- Root page: HTTP 200.
- \`/api/health\`: HTTP 200. Current preview kind is \`geo-scoped-top20-map\`.
- \`/data/indonesia-38-provinces.geojson\`: serves the 38-province GeoJSON.
- This standalone Worker preview is **not** the compiled vinext/Next.js bundle. The app source is on the PR branch and CI checks its build separately.

## Interface
- The Indonesia map and leaderboard have balanced, co-primary space.
- The three leaderboard scopes are Indonesia, selected Province, and selected Kabupaten/Kota.
- Each scope has 20 synthetic rows. Categories and All Time / Hari Ini / Harian controls apply to the active scope.
- The browser asks permission to read device location on initial visit. When allowed, the map shows the device point and matches it to a province using the local GeoJSON. Manual province/city selection continues to work when permission is refused or unavailable.
- Province boundaries do not identify a city/regency. The visitor must choose the city/regency.
- If geolocation is denied, manual province/city selection remains available.
- The simulation label stays visible. Synthetic names, stakes, and clicks are not real businesses, transactions, or traffic. Participation remains disabled.
- No exact device coordinates are sent to a third-party reverse-geocoding service or stored by this preview.

## Geography data
The preview uses the 38-province GeoJSON from:
- Repository: https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces
- Dataset license declared by repository: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- Attribution is shown in the interface and recorded in \`public/data/README.md\`.

The Worker proxies the dataset from the upstream GitHub raw URL. MapLibre renders it when WebGL is available; a GeoJSON-driven interactive SVG fallback operates when WebGL is unavailable. It contains provincial shapes only, not Kabupaten/Kota polygons or UMKM locations. Review upstream provenance/terms before production/commercial use; do not treat these polygons as authoritative legal boundaries.

No third-party raster basemap is used. Production map tile/style provider has not been selected.

## Direct Cloudflare deployment
Direct Worker upload does not require the GitHub Actions Cloudflare token, but it is a standalone visual prototype. It does not establish continuous deployment for later commits or turn the Worker into the compiled vinext bundle.

## GitHub environment setup for automated PR previews
The repository workflow uses a GitHub Actions environment named \`preview\`. To enable automated preview deployments, add:
- \`CLOUDFLARE_API_TOKEN\`: scoped using the official **Edit Cloudflare Workers** template and limited to the KenalanUMKM account. Do not paste the token into the repository, workflow, or chat.

When absent, code checks can still pass while the automatic deploy job is skipped.

## Data and cost safeguards
- No production Supabase credentials are configured.
- No payment provider or real payment flow is enabled.
- No paid Cloudflare add-on is provisioned by this preview.
- Do not add a custom domain or deploy production as part of PR preview.
- Never present synthetic rows or device-location preview as real activity.
