# Supabase

Project: kenalanumkm.

## Existing applied foundation — legacy parts remain

The first profile foundation has already been applied to this Supabase project. It includes:
- public.business_categories: nine descriptive categories;
- public.business_profiles: UMKM profiles with an owner user reference and legacy moderation lifecycle;
- public.business_profile_links: primary, social, purchase and order URLs plus server-managed metadata;
- private business-avatars Storage bucket with policies built around legacy owner and moderation assumptions.

Preserve all already-applied migration history. Do not edit or delete applied migration files.

The legacy manual review lifecycle does not match the current product. Replace its activation gates and conflicting policies through reviewed additive migrations. Existing tables may be adapted where appropriate; do not treat their old workflow as approved.

## Approved target model

- Supabase Auth with Google OAuth is the only user sign-in method.
- Public leaderboard browsing works without login.
- Claim #1 and private profile management require a Google-authenticated Supabase user.
- Profiles are linked to the authenticated auth.users ID so the same account can reuse them.
- Google Login plus OTP to the UMKM phone/SMS or WhatsApp contact verifies account and contact-channel access only; it does not prove legal ownership or representative authority.
- Any city/regency or province board may be selected regardless of profile address or operating location.
- Each Google account may save unlimited profiles. Duplicate profiles are permitted across accounts and branches; do not implement duplicate business-name/address/contact constraints.
- The exact same profile ID can have only one row per board; a new profile ID describing the same business is not deduplicated.
- Three independently claimable boards exist: one Kabupaten/Kota, one Provinsi and one Indonesia.
- Each successful claim costs exactly Rp20.000 and affects one board only.
- All UMKM compete together; categories are descriptive metadata and not leaderboard dimensions.
- A new profile is inserted at #1 and all existing entries shift down. If the profile already has an entry on that board, update and move that row to #1; entries that were above it shift down while entries below it keep their positions.
- The same exact profile ID can have only one row per board; reclaim updates that row rather than inserting a duplicate. Distinct profile IDs may represent the same business and are allowed to have separate rows on the same board.
- To appear on another board, the business must make another separate Rp20.000 claim.

## Target database model

Use authenticated profile ownership, explicit board scopes, unique profile-board entries, private claim/payment intents, authenticated/deduplicated provider events, immutable payment history and leaderboard-movement history.

A leaderboard scope is one of:
- Kabupaten/Kota with one canonical city/regency ID;
- Provinsi with one canonical province ID;
- Indonesia with no lower-level geography ID.

Do not derive province or national entries by summing smaller boards.

The server creates each payment intent for exactly IDR 20.000 and binds it to one profile and one board.

No refund is due solely because a profile is displaced. Refund exceptions are duplicate charges, system/provider errors or legal requirements; the detailed workflow remains open. Late payments after expiry, chargebacks, reversals and mistaken payments remain open. Business-contact OTP proves access to a phone/WhatsApp channel only. Exact OTP provider, OTP lifetime, resend/attempt limits, verified-state validity and re-verification frequency remain undecided.
 The customer price is all-in; the platform absorbs provider/bank fees. Every intent expires 15 minutes after server creation. A provider must issue a unique invoice/QRIS/VA/payment reference and authenticate a webhook that maps each same-amount payment to its own claim. Amount-only matching is insufficient. Ranking order uses the server-recorded receipt time of the valid webhook, not provider paid_at.

## Migration discipline

The initial five migration versions have already been applied. Preserve their history. Implement the new board model, Google account ownership and replacement of moderation gates through reviewed additive migrations. Keep DDL in supabase/migrations.

All exposed tables require RLS and explicit grants. Provider events cannot be written by browser clients. The browser must never choose price, paid status or board order. No Supabase secret/service-role key may be exposed to the browser or public Worker configuration.

## Validation

After schema changes, run migration tests, public/private access checks, one-entry-per-profile-per-board tests, payment idempotency checks, relative-order tests and Supabase Security and Performance Advisors.

Do not claim Google OAuth is configured or the new claim/board model is active until provider settings, migration, API routes and end-to-end tests have passed.

The current leaderboard preview remains synthetic. No real claims or payments are processed in preview.
