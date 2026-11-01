# Backend Schema — Existing Legacy Foundation and New Board Model

## Important status

The first backend foundation has already been applied to the linked Supabase project. It predates the current product rules and contains profile submission and moderation behavior that does not match the approved flow.

Preserve every already-applied migration. Do not rewrite or delete applied migration files. Transition through reviewed additive migrations. No real paid claims or production payment processing are enabled by this documentation change.

## Existing tables

### Categories — business_categories

The existing taxonomy contains nine descriptive categories. Category may remain on a profile as descriptive information, but it is not used to create separate leaderboards, determine eligibility or calculate rank.

### UMKM profiles — business_profiles

The existing table stores one UMKM profile with an owner user ID, public slug, business name, description, category, province/city names, optional address, avatar and legacy moderation fields.

The authenticated Google account's Supabase user ID should own the profile. The old pending_review / approved workflow is legacy and must not block a valid paid claim. Review and replace any RLS policies, route handlers and storage policies that depend on that old moderation lifecycle.

### Profile links — business_profile_links

Stores public website, social, purchase and order/contact links plus server-managed parsing metadata. Do not scrape arbitrary URLs or issue server-side requests to untrusted destinations.

### Avatar storage

The existing avatar bucket and policies were designed around legacy owner and moderation behavior. Review them before enabling saved-profile uploads and public profile display. A private profile image must not become public merely because a claim is pending.

## Target logical model

Implement the target through new reviewed migrations and tests.

### User identity

Use Supabase Auth with Google OAuth. Public browsing does not require a session, but creating a claim or managing saved UMKM profiles requires an authenticated user.

Every UMKM profile is associated with the Supabase authenticated user ID that manages it. The authenticated user can reuse the profile on multiple boards. This relation proves which KenalanUMKM account controls the profile; it does not prove legal ownership of the business.

### Leaderboard boards

Model the three board scopes explicitly:
- City/regency: one board per canonical Kabupaten/Kota.
- Province: one board per canonical province.
- Indonesia: one national board.

The scope identity must be unambiguous. Use canonical stable geography IDs for province and Kabupaten/Kota after verifying the source dataset and licence. The Indonesia board has no province or city ID.

No board is created for a business category. Category is descriptive profile metadata only.

### Leaderboard entries

Each entry links one UMKM profile to one board.

Enforce one entry per (board ID, business profile ID). A profile can have entries on more than one board, but each board requires its own paid claim.

Store the latest successful claim/payment reference and a trusted ordering timestamp or server-assigned sequence on the entry. Derive rank by sorting the board's entries newest-first. Do not store or accept a rank number from the browser.

When the same profile makes another valid claim on the same board:
1. update its latest claim/payment reference;
2. update its trusted ordering timestamp/sequence;
3. move that existing entry to #1;
4. keep all other entries in their relative order.

Do not create duplicate entries for the same profile on the same board. A claim on another board must not modify this entry.

### Claims and payment intents

A claim intent stores:
- authenticated user ID;
- selected UMKM profile ID;
- exactly one board ID;
- fixed amount IDR 20.000;
- currency IDR;
- status and timestamps;
- unique internal reference.

A payment intent is created by the server and bound to one claim intent. The client cannot change its amount, destination, board, profile or paid status.

### Provider events and payment history

Store unique provider event and transaction identities. Keep enough normalized data to verify recipient, amount, currency, payment reference, authoritative paid time and claim binding. Never return provider secrets or raw authentication material to the browser.

A payment provider must reliably map identical Rp20.000 payments to unique claims. Amount-only matching is not acceptable. Moota remains a candidate until its current capabilities and commercial conditions are checked.

## Required payment transaction

For a trusted provider event:

1. authenticate the provider event and reject duplicates;
2. locate the exact pending payment intent and claim;
3. validate reference, receiving destination, amount (IDR 20.000), currency, trusted payment time and claim state;
4. mark the payment paid;
5. append immutable payment history;
6. lock or serialize the target board entry/order;
7. insert the profile's board entry if it does not exist, or update the existing entry;
8. assign the newest trusted order value so the profile becomes #1;
9. append a leaderboard-movement record.

The transaction must roll back if any step fails. A pending, failed, expired or client-reported payment cannot change the board.

The ordering source must be defined before production. Prefer a trusted provider paid_at timestamp when authoritative and reliable. If the provider cannot supply one, use a documented server-side confirmation sequence and describe the public rule as “pembayaran terkonfirmasi terakhir”. Never trust a browser timestamp.

## API direction

- GET /api/leaderboards — public board list and ranking rows by scope.
- GET /api/leaderboards/:scope — public ranking rows for one board.
- POST /api/claims — authenticated; create one claim/payment intent for one board and one saved profile.
- GET /api/claims/:id — authenticated; return safe claim status to its owner.
- POST /api/webhooks/{provider} — authenticate and process provider events server-side.
- GET /api/business-profiles — authenticated user's saved profiles.
- POST /api/business-profiles — authenticated; create a saved profile owned by the current Supabase user.
- PATCH /api/business-profiles/:id — authenticated; edit the user's profile without changing ranking order.
- GET /api/business-profiles/:slug — public live profile.

The existing auth-required profile submission route may be adapted, but remove the old assumption that new profiles must enter a manual review queue before they can appear. Keep profile management separate from payment and ranking mutation.

## Security, RLS and privacy

- Public reads expose only fields intentionally published on a profile and leaderboard.
- Saved profiles are readable and editable only by their authenticated owner, apart from explicitly public fields.
- Claims and payment records are private to the relevant authenticated user and server-side processing.
- Provider events cannot be inserted or changed by browser clients.
- Google Login proves the signed-in account, not legal business ownership.
- Contact and payment metadata remain private.
- Privileged routines require a documented justification, fixed search_path, narrow execute grants and security review.
- Keep audit history append-only; do not silently rewrite payment or movement history.

## Migration and validation rules

- Preserve the five already-applied legacy migration versions.
- Add versioned migrations to introduce board scopes, unique profile-board entries, claim/payment linkage and the new access rules.
- Disable or replace conflicting moderation gates through additive migrations.
- Add tests for: Google-auth-required claim; public unauthenticated reads; one entry per profile per board; exact Rp20.000 price; one claim affects one board only; separate claims for each scope; moving an existing #5 entry to #1; keeping other entries in relative order; repeat claim without duplicate row; independent profile entries across boards; payment idempotency; identical-amount transaction matching; concurrent claims; and public privacy.
