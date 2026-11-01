# Business Profile Backend

## Status

The initial profile backend exists, but its signup/moderation behavior predates the current product rules. Preserve already-applied migrations and transition through reviewed additive migrations.

Google Login through Supabase Auth is the only account sign-in method. In addition, the UMKM profile's business contact number must pass OTP verification through phone/SMS or WhatsApp before it is used for a claim. This is contact-channel verification, not legal ownership or representative-authority verification. Whether verification is reused, how long it remains valid and when re-verification is required remain open. No standalone username/password or email OTP sign-in is part of the product.

## User journey

1. A visitor can browse leaderboards without login.
2. The visitor clicks Claim #1.
3. If signed out, the visitor completes Google Login and returns to the intended claim flow.
4. The user selects one saved UMKM profile or creates a profile and completes the business-contact OTP challenge.
5. The user chooses one board scope: Kabupaten/Kota, Provinsi or Indonesia. Any city/regency or province board may be selected regardless of the profile's address or operating area.
6. The user pays exactly Rp20.000 all-in for that one board using a unique provider payment reference.
7. After an authenticated provider webhook is received and validated, the server-recorded webhook receipt time determines ranking order and the profile moves to #1. The payment intent expires after 15 minutes.

The interface header shows Login dengan Google when signed out, and the account plus Logout when signed in. Logging out does not delete profiles, payment history or board entries.

## Profile/account relationship

Each saved UMKM profile belongs to a Supabase Auth user ID. The same authenticated account can select a saved profile for a later claim rather than typing the business details again.

A profile's descriptive information may include business name, short description, optional category, province and Kabupaten/Kota, optional address, avatar, website/social links, purchase link and order/contact link.

Category is descriptive only. It does not create a category leaderboard or affect price or rank.

Google Login identifies the account in KenalanUMKM. It does not prove the person is the legal owner or authorized representative of the UMKM. Do not display an owner-verified badge based on Google authentication alone.

Each Google account may save an unlimited number of UMKM profiles. Duplicate profiles are allowed, including multiple profiles for the same brand, branch or physical outlet across different accounts. Do not reject, merge or deduplicate based on matching business details.

## Profile reuse and editing

When the authenticated user returns, load the profiles belonging to that same Supabase user ID. Let the user choose one before creating a new profile.

Profile edits must not automatically move the profile on any board. Only a separately paid, successfully confirmed claim can change the board order.

Changing profile details must not alter ranking. Profile province/Kabupaten/Kota are descriptive fields only; they do not restrict which city/regency or province board can be claimed. No address-to-board matching is required.

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
Multiple distinct profile IDs that describe the same business may each have their own board entry. The no-duplicate rule applies only when the exact same profile ID claims the same board again.

Customer price is exactly Rp20.000 inclusive of provider fees; the platform absorbs provider/bank fees. No refund is due solely because a profile is displaced. Refund exceptions are duplicate charges, system/provider errors or legal requirements; the detailed exception workflow is open. Late payments after the 15-minute expiry, chargebacks, reversals and mistaken payments remain open.


## Security requirements

The browser cannot set payment amount, paid status, board order or ranking position. Server verifies that the selected profile belongs to the authenticated user. Public profile responses must not expose personal contact or payment metadata.

All claim and payment records remain private until the profile is intentionally published after valid confirmation. Webhook processing is server-only, authenticated, idempotent and auditable.
