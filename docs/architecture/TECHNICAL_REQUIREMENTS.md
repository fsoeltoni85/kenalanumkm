# Technical Requirements

## Approved stack

- Next.js API surface powered by Cloudflare vinext on Vite.
- TypeScript strict mode, React, Tailwind CSS, shadcn/ui conventions and Lucide icons.
- Supabase: PostgreSQL 17, Auth, Storage and Edge Functions.
- Google OAuth through Supabase Auth as the only user sign-in method.
- Cloudflare Workers hosting.
- GitHub repository and GitHub Actions CI/CD.
- Moota API v2 is a candidate payment integration only; it is not approved or enabled.

## Product model

The product has three independently claimable leaderboard scopes:
- Kabupaten/Kota: one selected city or regency.
- Provinsi: one selected province.
- Indonesia: one national board.

A claim targets exactly one board. These boards are not aggregated and are not automatically linked. A business must pay separately to appear on multiple boards.

Every successful claim costs exactly Rp20.000, independent of the selected scope. All categories compete together. Category may be saved as descriptive profile data but is not a board key or ranking input.

A valid claim moves the selected profile to #1 on the target board. If it is a new profile-board entry, insert it at the top and shift all existing entries down. If it already exists on that board, update its ordering value and move that same row to the top; because the old row is not duplicated, only entries previously above it change position and entries below it keep their positions. Preserve everyone else's relative order and do not alter the profile's entries on other boards.

No bids, outbid increments, cumulative payment scores or periodic rank resets. Clicks and views are secondary metrics only.

## Authentication and account/profile relationship

- Public leaderboard reads do not require authentication.
- Claim creation requires a valid Supabase Auth session created through Google OAuth.
- Header reflects auth state: Login dengan Google while signed out; account identity and Logout while signed in.
- Preserve the intended claim scope and location through the Google OAuth redirect, then resume the claim flow after callback.
- Link UMKM profiles to the authenticated Supabase user ID.
- A user returning with the same Google account can select and reuse previously saved profiles.
- Logging out must not delete profiles, paid claim records or leaderboard entries.
- Do not implement anonymous auth, password sign-in, email OTP, phone OTP, SMS or WhatsApp OTP.
- Google authentication proves control of the Google account, not legal ownership of a business. Do not label profiles owner-verified based on Google Login alone.

## Architecture

Browser uses only public/publishable credentials. Server routes validate profile, claim and payment state. RLS is mandatory for exposed tables. Database is the source of truth for user-owned profiles, board scopes, claim/payment records, ordered board entries and ranking history.

Represent the board scope explicitly:
- City/regency board with one canonical Kabupaten/Kota identity.
- Province board with one canonical province identity.
- Indonesia board with no province or city identity.

Enforce one leaderboard entry per profile per board, using a unique constraint over board ID and profile ID. Each successful claim updates that entry's trusted order timestamp/sequence and payment reference. Derive visible rank by ordering entries newest first; do not store a client-controlled rank number.

A payment/claim must target exactly one board and one profile. A board claim must never cascade to a parent board.

## Claim and payment processing

- Claim and payment creation require an authenticated user.
- The server verifies that the selected UMKM profile is associated with the authenticated user.
- The server sets the board target, currency and exact amount (IDR 20.000); never trust price, paid state or rank supplied by the client.
- A payment intent must be uniquely identifiable and linked to exactly one claim. Amount-only matching is not acceptable because all claims have the same price.
- Authenticate provider notifications, match each event to the exact payment intent, validate amount, currency, receiving destination and trusted payment time, and process idempotently.
- On valid confirmation, one atomic database transaction marks payment paid, appends immutable payment history, updates the selected board entry to #1 order, records the movement history and leaves all other boards untouched.
- A pending, failed or unverified payment does not change the leaderboard.
- Concurrent claims on the same board must be serialized or assigned a deterministic server-side ordering.
- Use a trusted provider paid timestamp when the provider exposes one that is authoritative and reliable. Otherwise define and document server confirmation order as the source of truth before launch. Never use browser timestamps or webhook delivery order as a substitute for payment chronology without an explicit decision.

The ranking is not a sum of payments. Historical payments are audit data only.

## Geography

Use a canonical geography dataset for provinces and Kabupaten/Kota before production. Verify the exact source, licence and stable IDs. No Kecamatan, Kelurahan or Desa competition levels. No public map, map pins, browser geolocation or coordinate-based rank.

## Cloudflare / vinext

Use the established vinext Cloudflare Vite build path. Run dependency install, compatibility checks and a production build in CI. Workers is the target runtime. Keep preview and production environments isolated.

## GitHub Actions

Preview deployment uses an isolated Worker and runs only after required CI checks pass. Production deploy only from main after explicit owner approval. Use protected GitHub environments and least-privilege secrets. Never expose secrets in logs or NEXT_PUBLIC variables.

## Supabase

All DDL is versioned in supabase/migrations. Preserve already-applied migration history; transition the legacy owner/moderation foundation through reviewed additive migrations rather than rewriting applied migrations. RLS on all exposed tables. Prefer SECURITY INVOKER; any SECURITY DEFINER needs documented justification, fixed search_path, narrow grants and security review. Never expose a secret/service-role key to browser code. Money is stored as integer IDR amounts, never floating point.

Configure Google OAuth client credentials and the exact Supabase callback/redirect URLs in provider settings and environment secrets. Do not commit OAuth secrets.

## Security and privacy

Validate claims and payment state server-side. Enforce ownership of profiles within the authenticated account. Rate-limit claim creation and click tracking; redact logs; deduplicate provider events; authenticate webhooks using the provider's supported trusted mechanism. Keep private payment metadata and personal contact data out of public profile responses. Preview must not access production data or process real payments. Do not request device geolocation for the public leaderboard.

## Performance / UX

Paginate leaderboards; avoid N+1; cache only public non-user-specific responses. Provide keyboard navigation, visible focus, accessible labels and reduced-motion support.

## Environment variable names

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; server-only Supabase secret/service-role credentials only if strictly required; CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID. Google OAuth secrets belong in provider configuration/secrets, never Git.
