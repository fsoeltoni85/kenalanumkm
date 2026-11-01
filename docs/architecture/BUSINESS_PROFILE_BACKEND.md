# Business Profile Backend

## Status

The initial profile backend exists, but its signup/moderation behavior predates the current product rules. Preserve already-applied migrations and transition through reviewed additive migrations.

The current product uses Google Login to identify the KenalanUMKM account that manages a saved UMKM profile. No standalone username/password, email OTP, phone OTP or WhatsApp OTP flow is part of the product.

## User journey

1. A visitor can browse leaderboards without login.
2. The visitor clicks Claim #1.
3. If signed out, the visitor completes Google Login and returns to the intended claim flow.
4. The user selects one saved UMKM profile or creates a profile.
5. The user chooses one board scope: Kabupaten/Kota, Provinsi or Indonesia.
6. The user pays exactly Rp20.000 for that one board.
7. After trusted payment confirmation, that profile moves to #1 on the selected board.

The interface header shows Login dengan Google when signed out, and the account plus Logout when signed in. Logging out does not delete profiles, payment history or board entries.

## Profile/account relationship

Each saved UMKM profile belongs to a Supabase Auth user ID. The same authenticated account can select a saved profile for a later claim rather than typing the business details again.

A profile's descriptive information may include business name, short description, optional category, province and Kabupaten/Kota, optional address, avatar, website/social links, purchase link and order/contact link.

Category is descriptive only. It does not create a category leaderboard or affect price or rank.

Google Login identifies the account in KenalanUMKM. It does not prove the person is the legal owner or authorized representative of the UMKM. Do not display an owner-verified badge based on Google authentication alone.

The maximum profile count per account has not been decided. Do not hard-code an arbitrary product limit without approval.

## Profile reuse and editing

When the authenticated user returns, load the profiles belonging to that same Supabase user ID. Let the user choose one before creating a new profile.

Profile edits must not automatically move the profile on any board. Only a separately paid, successfully confirmed claim can change the board order.

Changing business name, descriptive category, description, avatar or public links must not alter ranking. Changes to the business's province or Kabupaten/Kota need validation because those details describe the physical business; they must not silently move or create leaderboard entries.

## Links and avatar handling

The existing link parser recognizes common social, marketplace and ordering hosts and extracts handles only from known URL shapes. It must not scrape arbitrary pages or make server-side requests to untrusted user-provided URLs.

Review the existing private avatar bucket and policies before activating profile uploads and public display. Pending/private profile assets must not become public before they are intentionally published.

## Payment and board separation

A claim binds one authenticated user, one saved UMKM profile, one board and one payment intent for exactly Rp20.000.

The three board scopes are independent:
- Kabupaten/Kota: one selected city/regency;
- Provinsi: one selected province;
- Indonesia: the national board.

A paid claim moves the selected profile to #1 on that board. If the profile already exists there, update the existing entry instead of creating a duplicate. A different board requires a new claim and payment. No category-specific board exists.

## Security requirements

The browser cannot set payment amount, paid status, board order or ranking position. Server verifies that the selected profile belongs to the authenticated user. Public profile responses must not expose personal contact or payment metadata.

All claim and payment records remain private until the profile is intentionally published after valid confirmation. Webhook processing is server-only, authenticated, idempotent and auditable.
