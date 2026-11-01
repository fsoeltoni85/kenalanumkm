# Supabase

Project: kenalanumkm.

## Existing applied foundation — legacy

The first backend profile foundation has been applied to this Supabase project. It includes:
- public.business_categories: curated categories (9 seeded categories);
- public.business_profiles: one physical UMKM profile, legacy owner reference and moderation lifecycle;
- public.business_profile_links: primary, social, purchase and order URLs plus server-managed profile metadata;
- private business-avatars Storage bucket with policies built around authenticated owners and approved profiles.

This foundation predates the approved Claim #1 rules. Its owner signup, auth-required profile submission and manual moderation lifecycle are legacy and must not be extended as the active product journey.

## Approved target model

The approved product uses a claim-first flow with no standalone signup and no manual review:
- one #1 Wilayah position per Kabupaten/Kota;
- one #1 Kategori position per Kabupaten/Kota/category;
- fixed Rp20.000 per selected position;
- one payment claims exactly one selected position;
- latest trusted, successfully confirmed payment becomes the champion for that position;
- profile becomes public/live immediately after successful payment confirmation.

The target database model includes private claim intents, server-created payment intents, authenticated/deduplicated provider events, unique leaderboard positions and immutable champion-transition/payment history.

## Migration discipline

The initial five migration versions have already been applied. Preserve their history. Do not edit or delete already-applied migration files to make the new workflow appear as though it existed earlier. Implement the claim-first model through reviewed additive migrations, then disable or replace legacy owner/moderation routes and policies. Keep all DDL in supabase/migrations.

All exposed tables require RLS and explicit grants. Provider events cannot be written by browser clients. The browser must never choose price, paid status or champion. No Supabase secret/service-role key may be exposed to the browser or public Worker configuration.

## Validation

After schema changes, run database migration tests, public/private access checks, duplicate payment-event tests and Supabase Security and Performance Advisors. Do not claim that the new claim/payment model is active until its migration is applied, API routes are connected and end-to-end validation passes.

The current leaderboard preview remains synthetic. No real claims or payments are processed in preview.