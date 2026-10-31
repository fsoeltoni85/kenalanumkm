# KenalanUMKM

KenalanUMKM is an Indonesia-only, map-first public competition for real UMKM with fixed physical locations. Visitors explore Indonesia by province, then open a leaderboard for a Kabupaten/Kota + category. Rank is based only on cumulative confirmed stake; clicks are statistics and never affect rank.

## Product boundaries
- The map is the primary exploration surface, not a decorative illustration.
- Province is a navigation/grouping layer.
- The competition unit is Kabupaten/Kota + category.
- Every listing represents a real, fixed physical business location.
- Kecamatan, Kelurahan and Desa are not competition or navigation levels.
- This is not a general business directory, review/rating service, marketplace, booking, CRM or POS product.
- Payment rules are not final; no stake or payment flow is enabled in the current preview.

## Project references
All product, technical, design, backend and delivery reference documents live in [docs/](docs/README.md). Start with [docs/README.md](docs/README.md) and follow the repository rules in [AGENTS.md](AGENTS.md).

## Technology
- Next.js API surface via vinext + Vite + TypeScript
- Tailwind CSS
- MapLibre GL JS with local GeoJSON province geometry; production basemap provider pending licensing review
- Supabase PostgreSQL + PostGIS, Auth, Storage and Edge Functions
- Cloudflare Workers
- GitHub Actions CI/CD

## Local development
Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Copy .env.example to .env.local only when ready to connect a Supabase environment. Do not use production credentials for preview/test work.

## Current preview
The current preview is a UI prototype. It uses GeoJSON boundaries for 38 provinces, but city selection is illustrative and the leaderboard is intentionally empty because there is no real listing/stake dataset yet. It displays no fabricated business locations, click totals, stake amounts or active leaderboard rankings.

Live preview: https://kenalanumkm-pr-1.kenalanumkm-preview.workers.dev

The standalone Worker preview is not the compiled vinext bundle. See [the Cloudflare preview runbook](docs/operations/CLOUDFLARE_PREVIEW.md) for deployment details, GeoJSON attribution and safeguards.

## Delivery
Changes are made in feature branches and reviewed through pull requests. Automated Cloudflare PR deployment is gated behind passing CI and repository environment configuration. Production deployment is not automated until an explicit release workflow is approved.
