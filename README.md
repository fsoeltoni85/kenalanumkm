# KenalanUMKM

KenalanUMKM is an Indonesia-only pay-to-rank leaderboard for UMKM. A business pays a fixed **Rp20.000** to move its profile to #1 on one selected leaderboard.

## Approved product rules

- Users choose one of three independent boards: Kabupaten/Kota, Provinsi or Indonesia.
- All UMKM compete together, regardless of business category.
- Every successful claim costs exactly Rp20.000 at every scope.
- A claim affects only the selected board. It does not automatically enter a province or national board.
- A new profile is inserted at #1 and existing entries move down one place. If a profile already on that board claims again, move its existing row to #1; entries above its old position shift down and entries below it keep their positions.
- If the same profile claims the same board again, it moves to #1 instead of appearing twice.
- A separate claim and Rp20.000 payment are required for each additional board.
- Public browsing does not require login. Claim #1 requires Google Login.
- Claim flow also requires OTP verification of the UMKM phone/SMS or WhatsApp contact channel; this does not prove legal business ownership.
- Users may choose any city/regency or province board without matching the UMKM's physical location.
- Duplicate profiles for the same business/branch are permitted, including across Google accounts; exact same profile ID still has one row per board.
- Each Google account may save unlimited profiles.
- Every claim costs Rp20.000 all-in; the platform absorbs provider fees.
- Payment intents expire after 15 minutes; late-payment handling remains open.
- Ranking order follows server-recorded receipt time of valid authenticated provider webhooks, not provider paid_at.
- No refund solely because a profile is displaced; exceptions are duplicate charges, system/provider errors or legal requirements.
- The header shows Login dengan Google when signed out and the account plus Logout when signed in.
- Saved UMKM profiles are connected to the Google account and can be reused.
- Google Login identifies the KenalanUMKM account, not legal ownership of the business.
- Category is descriptive profile data only; there are no category competitions.
- Clicks are secondary statistics and never affect rank.
- No map or browser geolocation.

See [Business Rules](docs/product/BUSINESS_RULES.md) for the full source of truth.

## Technology

- Next.js API surface via vinext + Vite + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage and Edge Functions
- Google OAuth via Supabase Auth
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

The current application is an earlier leaderboard/foundation UI prototype. Demo business names, stake values, category modes and sample rankings are synthetic and visibly labelled DATA SIMULASI. They do not implement the approved three-board model, Google Login or real claims. Claim and live payment actions remain disabled until the new flow is implemented and tested.

The isolated Cloudflare preview Worker kenalanumkm-preview is deployed from the pull request branch by GitHub Actions after required CI checks pass. The older kenalanumkm-pr-1 Worker is a legacy prototype and remains untouched. GitHub and the PR branch remain the source of truth; preview is not production.

## Delivery

Changes are made in feature branches and reviewed through pull requests. Automated Cloudflare PR deployment is gated behind passing CI and repository environment configuration. Production deployment is not automated until an explicit release workflow is approved.
