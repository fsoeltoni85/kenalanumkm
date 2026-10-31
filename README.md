# KenalanUMKM

KenalanUMKM is an Indonesia-only public leaderboard for UMKM city champions. The experience is a simple, competitive ranking board inspired by the clarity of Outbid.lol, while keeping KenalanUMKM's own rules and geography.

## Product rules

- The leaderboard is Indonesia-only.
- Each Kabupaten/Kota contributes exactly one champion per category and selected period: the business ranked #1 in that city.
- Indonesia ranks those city champions nationally by confirmed stake.
- Province is a grouping/navigation layer; a province board lists its city champions.
- City scope shows that city's single champion and its national rank.
- Click counts are secondary statistics and never affect rank.
- Kecamatan, Kelurahan and Desa are not competition, filter or navigation levels.
- This is not a review/voting service, generic business directory, marketplace, booking, CRM or POS product.
- Payment, claim and participation rules are not finalized; participation remains disabled in the preview.

## Technology

- Next.js API surface via vinext + Vite + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage and Edge Functions
- Cloudflare Workers
- GitHub Actions CI/CD

## Local development

Requires Node.js 22 or later.

\`\`\`bash
npm install
npm run dev
\`\`\`

Checks:

\`\`\`bash
npm run lint
npm run typecheck
npm run test
npm run build
\`\`\`

Copy .env.example to .env.local only when ready to connect a Supabase environment. Do not use production credentials for preview/test work.

## Current preview

The current application is a leaderboard-first UI prototype. Demo business names, stakes and click counts are synthetic and clearly labelled as DATA SIMULASI. They are not real registered UMKM, transactions, traffic or verified rankings. There is no map or browser location collection in the public experience.

The isolated Cloudflare preview Worker `kenalanumkm-pr-1` is deployed from the pull request branch by GitHub Actions after all CI checks pass. GitHub and the PR branch remain the source of truth; the preview is not production.

## Delivery

Changes are made in feature branches and reviewed through pull requests. Automated Cloudflare PR deployment is gated behind passing CI and repository environment configuration. Production deployment is not automated until an explicit release workflow is approved.
