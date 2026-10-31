# Backend Schema — Logical Design

**Important:** logical model only. No application tables have been created in Supabase. Review this model and access rules before applying migrations.

## Geography
`provinces`: authoritative code, name, source metadata, active flag.
`regencies`: authoritative code, province reference, name, type (Kabupaten/Kota), source metadata, active flag.
Only province and Kabupaten/Kota are product navigation/competition levels. No Kecamatan/Kelurahan/Desa hierarchy tables. Store full address text and coordinates only on physical listing for geocoding/pin placement. Verify official boundary data source, license and freshness before import.

## Categories
`categories`: slug, display name, optional parent, sort order, active flag. Curated taxonomy; user text cannot create new leaderboard categories.

## Listings
`business_listings`: id, slug, name, category_id, regency_id, province_id (or derived), description, address_text, PostGIS Point(4326), public contact/site fields, status and timestamps. One row means one real physical business location. Index city/category/status, slug, search fields and spatial location.

## Future ownership
`listing_claims`, `listing_ownership`, `verification_events`. Verification method and permissions are undecided. Do not enable owner edits before policy design.

## Future payments / stake
`payment_intents`: amount_minor, currency, unique reference, status, expiry, provider reference and timestamps.
`stake_ledger_entries`: listing, payment intent, amount_minor, entry type, unique source event, timestamp and redacted metadata.
`payment_provider_events`: provider, unique event_id, received/processed timestamps, status and redacted metadata.
`listing_stats`: derived click counts and non-ranking metrics.
Append-only ledger; reversals as compensating entries; idempotent posting; never trust client totals. Accounting and refund mechanics require approval.

## Ranking
Scope is regency_id + category_id. Rank by sum of confirmed stake ledger entries, descending. Tie-break, minimum increments and outbid rules are open decisions; no ranking function until approved and tested.

## Security
RLS on every exposed table. Public read model exposes only approved fields. Owner write access requires verified ownership. Admin actions require explicit admin authorization and audit. Clients never insert/update/delete ledger or provider event rows. Prefer SECURITY INVOKER. Any SECURITY DEFINER requires separate review, fixed search_path, least privilege and identity checks.

## Migrations
Version every schema change in `supabase/migrations/`; review PR and apply staging before production. No direct production DDL outside migration workflow. Run Supabase security/performance advisors after DDL.
