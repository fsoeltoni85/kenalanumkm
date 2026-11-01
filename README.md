# KenalanUMKM

KenalanUMKM is an Indonesia-only pay-to-rank platform for UMKM. A business claims one specific #1 position in its Kabupaten/Kota by paying a fixed Rp20.000 after completing the Claim #1 form.

## Approved product rules

- Each Kabupaten/Kota has one **#1 Wilayah** champion across all business categories.
- Each category in that Kabupaten/Kota has one separate **#1 Kategori** champion.
- Those positions are independent. Winning one does not automatically win the other.
- Every claim costs exactly Rp20.000. One payment claims one selected position.
- The latest successfully confirmed payment for a position becomes its current champion.
- Reclaiming a lost position costs Rp20.000 again. There is no outbid increment, bidding or cumulative payment score.
- The Indonesia Top 20 regional board lists #1 Wilayah champions; category boards list the champion for the selected category.
- Province groups its city/regency champions. Kabupaten/Kota is the only competition geography.
- There is no public map, map pin or browser geolocation.
- There is no standalone signup/registration or manual review. User clicks Claim #1, fills the UMKM profile, pays, and the profile/position go live immediately after trusted payment confirmation.
- Clicks are secondary statistics only and never affect rank.

See [Business Rules](docs/product/BUSINESS_RULES.md) for the full source of truth.

## Technology

- Next.js API surface via vinext + Vite + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage and Edge Functions
- Cloudflare Workers
- GitHub Actions CI/CD

## Local development

Requires Node.js 22 or later.

    npm install
    npm run dev

Checks:

    npm run lint
    npm run typecheck
    npm run test
    npm run build

Copy .env.example to .env.local only when ready to connect a Supabase environment. Do not use production credentials for preview/test work.

## Current preview

The current application is a leaderboard-first UI prototype. Demo business names and champion assignments are synthetic and visibly labelled DATA SIMULASI. They are not real registered UMKM, claims, payments, traffic or verified rankings. Claim and live payment actions remain disabled until the claim-first flow is implemented.

There is no map or browser location collection in the public experience.

The isolated Cloudflare preview Worker kenalanumkm-preview is deployed from the pull request branch by GitHub Actions after all CI checks pass. The older kenalanumkm-pr-1 Worker is a legacy prototype and remains untouched. GitHub and the PR branch remain the source of truth; the preview is not production.

## Delivery

Changes are made in feature branches and reviewed through pull requests. Automated Cloudflare PR deployment is gated behind passing CI and repository environment configuration. Production deployment is not automated until an explicit release workflow is approved.