# KenalanUMKM

KenalanUMKM is an Indonesia-only, map-first discovery and geographic leaderboard for UMKM with real physical locations.

## Project references
All product, technical, design, backend and delivery reference documents live in [docs/](docs/README.md). Start with [docs/README.md](docs/README.md) and follow the repository rules in [AGENTS.md](AGENTS.md).

## Technology
- Next.js API surface via vinext + Vite + TypeScript
- Tailwind CSS
- MapLibre GL JS (live tile/style provider pending licensing review)
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

## Delivery
Changes are made in feature branches and reviewed through pull requests. Cloudflare preview deployment is gated behind passing CI and repository environment configuration. Production deployment is not automated until an explicit release workflow is approved.
