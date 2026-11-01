# Backend Schema — Current Foundation and Next Stages

## Current implemented schema

The first database/backend foundation is applied to the KenalanUMKM Supabase project.

### Categories — `business_categories`

Curated taxonomy with slug, display name, icon, sort order and active flag. Nine categories are seeded: Makanan & Minuman, Fashion, Retail, Jasa, Kecantikan, Kesehatan, Otomotif, Pendidikan and Lainnya.

### UMKM profiles — `business_profiles`

One row represents one physical UMKM listing. Fields include owner user ID, public slug, business name, short description, category, province and Kabupaten/Kota names, optional address, private avatar object path, moderation status and review timestamps.

The first implementation stores province and Kabupaten/Kota names, not administrative codes. We will import an authoritative licensed geography dataset before relying on codes or automated normalization. No Kecamatan/Kelurahan/Desa hierarchy is part of the product navigation.

### Profile links — `business_profile_links`

One primary link, one purchase link and one order/contact link are required. Up to five additional social links are accepted. Supported social hosts include Instagram, Threads, X/Twitter, TikTok and Facebook. Purchase/order destinations cover supported marketplaces, WhatsApp and delivery platforms, with an `other` fallback.

The API normalizes the platform and extracts recognizable handles. It does not scrape arbitrary URLs or issue server-side requests to user-supplied URLs. Social provider IDs, display names and remote avatar URLs are server-managed fields, not caller-writable fields.

### Avatar Storage

The `business-avatars` bucket is private. Objects use the path `{auth-user-id}/{business-profile-id}/{random-file-name}`. Uploads are restricted to the authenticated owner's folder; anonymous signed URL creation is permitted only when the owning profile is approved. Owners can access their own pending profile avatar.

## API surface

- `GET /api/business-profiles`: approved public profiles, optional province, regency, category and limit filters.
- `GET /api/business-profiles/:slug`: one approved public profile.
- `POST /api/business-profiles`: verified Supabase user bearer token required; creates profile and links atomically as `pending_review`.
- `GET /api/me/business-profiles`: verified owner-only list with moderation status.
- `POST /api/business-profiles/:id/avatar`: verified owner upload, MIME signature validation, private object storage and signed URL response.

Only the project URL and Supabase publishable key are used by the Worker. Every authenticated database request carries the caller's Supabase access token. No service-role/secret key is used.

## RLS and lifecycle

- Anonymous read: approved profiles and their links only.
- Authenticated read: approved profiles plus the caller's own profile(s).
- Profile creation: owner must equal `auth.uid()`; new status is always `pending_review`.
- Link creation: profile must belong to caller and still be pending.
- Profile update: owner may only update the avatar path at this stage.
- Moderation fields and social resolution metadata are not owner-writable.
- Maximum three pending/draft profiles per owner; an advisory transaction lock serializes submissions to prevent concurrent requests bypassing the cap.
- Submission function is SECURITY INVOKER with a fixed search path. EXECUTE is granted only to authenticated users.

Admin moderation permissions are intentionally not granted yet. The review process needs an explicit admin-role model and audit trail before status changes can be made through an API.

## Not implemented yet

- Admin review dashboard and moderation API.
- Official social provider OAuth/profile lookups and automatic avatar discovery. Threads discovery needs the relevant Meta permission; X needs API access; Instagram public arbitrary-handle avatar lookup is not universally available. Manual avatar upload is the supported fallback.
- Geography master data and canonical location IDs.
- Payment intents, webhook verification, confirmed-stake ledger and rank calculations.
- Database-backed leaderboard read model. The current leaderboard remains demo data until a separate integration part.

## Migrations

Migration filenames match the versions recorded in the Supabase project. Future schema changes must be additive where possible, reviewed through GitHub, applied to the linked project, and followed by security/performance advisor checks.
