# Technical Requirements

## Approved stack

- Next.js API surface powered by Cloudflare vinext on Vite.
- TypeScript strict mode, React, Tailwind CSS, shadcn/ui conventions and Lucide icons.
- Supabase: PostgreSQL 17, Auth, Storage and Edge Functions.
- Cloudflare Workers hosting.
- GitHub repository and GitHub Actions CI/CD.
- Moota API v2 is a candidate payment integration only; it is not approved or enabled.

## Product model that the system must enforce

The only competition geography is Kabupaten/Kota. Every city/regency has:
- one **#1 Wilayah** position across all categories; and
- one **#1 Kategori** position for each category.

A category position and the regional overall position are independent. Province and Indonesia are read/navigation aggregations, not claimable positions. Public leaderboard has no map or device-location dependency.

The fixed price is Rp20.000 for one selected position. There is no bid or outbid calculation, price increment, cumulative stake ranking or automatic periodic reset. The champion for a position is the business attached to the latest successfully confirmed payment for that exact position. A previous champion must pay Rp20.000 again to reclaim it.

One confirmed payment can activate only one selected position. If a business claims both #1 Wilayah and #1 Kategori, it completes two separate claims and payments.

## Architecture

Browser uses public/publishable credentials only. Server routes validate claim data and payment state. RLS is mandatory for exposed tables. Database is the source of truth for UMKM profiles, geography, claims, payment records, position ownership and champion history.

Represent the current competition target as a unique leaderboard position/slot:
- scope wilayah with one Kabupaten/Kota and no category; or
- scope kategori with one Kabupaten/Kota and one category.

Use a database uniqueness constraint for the slot identity and serialize payment application for the same slot. Store immutable payment and champion-transition records. A derived current-champion pointer or view may be updated only in the same database transaction that accepts the verified payment.

## Claim and payment processing

- Claim creation is public and does not require prior account signup.
- The server sets the target, currency and exact amount (IDR 20.000); never trust price or champion data supplied by the client.
- Profile fields are submitted inside Claim #1 and remain non-public until payment succeeds.
- A trusted provider event is authenticated, matched to one pending payment intent, validated and processed idempotently.
- Validation includes provider event/reference, receiving destination, amount, currency, claim binding, freshness and duplicate status.
- One atomic transaction marks payment paid, appends immutable payment history, assigns the selected position to the claimant, records the champion transition and publishes the profile when applicable.
- A payment pending, failed or unverified does not change the current champion.
- Near-simultaneous claims for the same slot must be serialized; the last successfully committed verified payment becomes champion.
- Keep provider-specific behavior behind an adapter. Do not assume Moota signatures, webhook availability or account features without verifying current official docs and account approval.

The ranking is not a sum of payments. Historical payments are audit data only. Click counts are secondary metadata and are never a ranking input.

## Cloudflare / vinext

Use the established vinext Cloudflare Vite build path. Run dependency install, compatibility checks and a production build in CI. Workers is the target runtime. Keep preview and production environments isolated.

## GitHub Actions

Preview deployment uses an isolated Worker and runs only after required CI checks pass. Production deploy only from main after explicit owner approval. Use protected GitHub environments and least-privilege secrets. Never expose secrets in logs or NEXT_PUBLIC variables.

## Supabase

All DDL is versioned in supabase/migrations. Preserve already-applied migration history; correct the legacy owner/moderation foundation through reviewed additive migrations rather than rewriting migrations already applied. RLS on all exposed tables. Prefer SECURITY INVOKER; any SECURITY DEFINER needs a documented reason, fixed search_path, narrow grants and security review. Never expose a secret/service-role key to browser code. Money is stored as integer IDR amounts, never floating point.

## Security and privacy

Validate all claim and payment state server-side. Rate-limit claim creation and click tracking; redact logs; deduplicate provider events; authenticate webhooks using the provider's supported trusted mechanism. Keep claim capability tokens and personal contact data private. Preview must not access production data or process real payments. Collect minimum personal data. Do not request device geolocation for the public leaderboard.

## Performance / UX

Paginate leaderboards; avoid N+1; cache only public non-user-specific responses. Provide keyboard navigation, visible focus, accessible labels and reduced-motion support.

## Environment variable names

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; server-only Supabase secret/service-role credentials only if strictly required; CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID. Values belong in encrypted secrets, never Git.