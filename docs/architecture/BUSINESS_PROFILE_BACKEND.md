# Business Profile Backend Foundation

## Purpose

This foundation stores real UMKM listings and their public profile links. It replaces no existing leaderboard behavior yet: the current leaderboard is still marked as demo data until the next integration part switches its read model.

## Profile fields

- Business name and short description (20–280 characters).
- Curated category slug.
- Province and Kabupaten/Kota names.
- Optional address text.
- One primary link, one purchase link, one order/contact link, plus up to five social links.
- Owner-managed avatar (JPEG, PNG or WebP, maximum 5 MB).
- Moderation lifecycle: `pending_review`, `approved`, `rejected`, `suspended`.

The profile model intentionally stores province and Kabupaten/Kota names rather than importing unverified administrative codes. An authoritative licensed reference dataset can be added separately.

## Link detection

Accepted social profile hosts are Instagram, Threads, X/Twitter, TikTok and Facebook. The API normalizes the platform from the hostname and extracts a handle only for recognizable profile URL shapes. It does not scrape arbitrary profile pages or make server-side requests to user-supplied URLs.

Primary links may be websites or supported social profiles. Purchase links identify supported marketplaces when recognized. Order links identify WhatsApp, GoFood and Grab/other ordering channels when recognized. Unknown valid HTTPS destinations are stored as `other` where allowed.

Social avatar/profile metadata columns are server-managed: the authenticated profile submission RPC does not allow callers to set remote profile image URLs or provider IDs.

## API

- `GET /api/business-profiles`: approved public profiles, with optional `province`, `regency`, `category`, and `limit` query parameters.
- `GET /api/business-profiles/:slug`: one approved public profile.
- `POST /api/business-profiles`: requires a verified Supabase user bearer token; creates the profile and its links atomically as `pending_review`.
- `GET /api/me/business-profiles`: authenticated owner's own profiles, including moderation status.
- `POST /api/business-profiles/:id/avatar`: authenticated owner upload, file-signature validation, private Storage object and signed response URL.

The API uses only the project's publishable key plus each caller's access token. It does not use a service-role or secret key. Database access is subject to RLS.

## Security model

- Anonymous users can read approved profiles and their approved links only.
- Authenticated owners can read their own pending/rejected/approved profiles and manage their own avatar.
- Submission is atomic through `submit_business_profile(jsonb,jsonb)`, with a limit of three active pending/draft profiles per owner.
- Exactly one primary, purchase and order link are required. Total links are limited to 3–8.
- Remote social metadata is not client-writable.
- Avatar bucket is private. Storage read policies allow approved profile avatars to anonymous users and allow authenticated owners to read their own.
- Admin moderation permissions are deliberately not granted yet. The review process needs a separate audited admin-role design.

## Environment

Cloudflare Worker bindings:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Both values are project configuration/public API details, not secret credentials. The backend never uses a Supabase secret/service-role key.

For local development, set the same variables in the Worker runtime environment. Do not add Supabase secret keys to `.env`, GitHub, or Cloudflare plaintext variables.

## Verification status

Database migrations are applied to the currently empty KenalanUMKM Supabase project. CI/preview validation is required before treating the Worker routes as deployed. The leaderboard still uses simulated champion rows until a separate integration part changes its read source.
