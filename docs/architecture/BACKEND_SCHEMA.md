# Backend Schema — Existing Legacy Foundation and New Board Model

## Important status

The first backend foundation has already been applied to the linked Supabase project. It predates the current product rules and contains profile submission and moderation behavior that does not match the approved flow.

Preserve every already-applied migration. Do not rewrite or delete applied migration files. Transition through reviewed additive migrations. No real paid claims or production payment processing are enabled by this documentation change.

**Phase 1 status:** the proposed relational schema is documented in [PHASE_1_DATABASE_DRAFT.md](./PHASE_1_DATABASE_DRAFT.md), and a pure TypeScript ranking engine with unit tests is being added on the work branch. The schema document is a design draft, not a formal Supabase migration; no migration has been applied to Supabase.

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

Every UMKM profile is associated with the Supabase authenticated user ID that manages it. The authenticated user can reuse the profile on multiple boards and may save an unlimited number of profiles.

Duplicate business profiles are allowed. Do not add unique constraints or deduplication logic across profile names, addresses, contact numbers, brands, branches or accounts. The authenticated owner relation still protects each profile's private management access. Require the profile's business-contact channel to pass OTP verification before it is used for a claim; store verification status and verified contact-channel metadata privately. This proves access to that phone/WhatsApp channel only, not legal ownership or representative authority. Whether the verified state is reused for later claims, its validity period and re-verification frequency remain undecided. The selected board need not match the profile's physical or descriptive location.

### Leaderboard boards

Model the three board scopes explicitly:
- City/regency: one board per canonical Kabupaten/Kota.
- Province: one board per canonical province.
- Indonesia: one national board.

The scope identity must be unambiguous. Use stable province and Kabupaten/Kota keys derived from an approved geography dataset after verifying its source and licence. The dataset and identifier format are not yet selected; do not invent or seed canonical production IDs. The Indonesia board has no province or city key.

No board is created for a business category. Category is descriptive profile metadata only.

### Leaderboard entries

Each entry links one UMKM profile to one board.

Enforce one entry per (board ID, exact business profile ID). A profile can have entries on more than one board, but each board requires its own paid claim. Different profile IDs may represent the same business and may each have their own entry on the same board; no cross-profile duplicate check is permitted.

Store the latest successful claim/payment reference and the server-recorded receipt timestamp of its authenticated valid provider webhook on the entry. Derive rank by sorting valid webhook receipt times newest-first. Do not use provider paid_at or any browser timestamp. Do not store or accept a rank number from the browser. Equal receipt-time tie-breaking is still undecided.

When the same profile makes another valid claim on the same board:
1. update its latest claim/payment reference;
2. update its trusted ordering timestamp/sequence;
3. move that existing entry to #1;
4. Keep the relative order of every other profile; profiles above the moved entry shift down, while profiles below it keep their positions.

Do not create duplicate entries for the same profile on the same board. A claim on another board must not modify this entry.

### Claims and payment intents

A claim intent stores:
- authenticated user ID;
- selected UMKM profile ID;
- exactly one board ID;
- fixed amount IDR 20.000 (all-in customer price);
- currency IDR;
- status and timestamps;
- server-created expiry timestamp 15 minutes after intent creation;
- unique internal reference mapped to a provider-issued unique invoice/QRIS/VA/payment reference.

A payment intent is created by the server and bound to one claim intent. The client cannot change its amount, destination, board, profile or paid status.

### Provider events and payment history

Store unique provider event and transaction identities, plus a server-recorded webhook_received_at timestamp. Keep enough normalized data to verify recipient, amount, currency, unique payment reference and claim binding. webhook_received_at is the ranking source; provider paid_at is not. Never return provider secrets or raw authentication material to the browser. Record provider fees separately while keeping the customer claim amount at exactly Rp20.000.

A payment provider must reliably map identical Rp20.000 payments to unique claims. Amount-only matching is not acceptable. Moota remains a candidate until its current capabilities and commercial conditions are checked.

## Required payment transaction

For a trusted provider event:

1. authenticate the provider event and reject duplicates;
2. locate the exact pending payment intent and claim;
3. validate unique reference, receiving destination, amount (IDR 20.000), currency, webhook authentication, server-recorded webhook receipt time and claim state;
4. mark the payment paid;
5. append immutable payment history;
6. lock or serialize the target board entry/order;
7. insert the profile's board entry if it does not exist, or update the existing entry;
8. assign the newest trusted order value so the profile becomes #1;
9. append a leaderboard-movement record.

The transaction must roll back if any step fails. A pending, failed, expired or client-reported payment cannot change the board. A payment intent expires after 15 minutes; a webhook received at or after expiry is recorded as late/unresolved and does not rank. Any refund or reconciliation for that late payment remains open and must not be invented.

The selected ordering source is the server-recorded receipt time of a valid, authenticated provider webhook. Do not use provider paid_at or browser timestamps. A delayed webhook may rank after a later-made payment if its webhook is received later. A tie-break rule for identical webhook receipt times remains open.

## API direction
## Business-contact verification

Google OAuth is the only account sign-in mechanism. Claim flow also requires OTP delivery to the UMKM phone/SMS or WhatsApp contact number. Store verification state and the verified destination privately; this is proof of channel access only, not legal ownership. Exact OTP provider, validity, resend/attempt limits and re-verification frequency remain undecided. The selected city/province board does not need to match the profile's location fields.

## Fixed price, fees and refunds

The customer pays exactly Rp20.000 all-in for each claim; the platform absorbs provider/bank fees and records provider fees separately. No refund is due solely because a profile is displaced. Refund exceptions are duplicate charges, system/provider errors or legal requirements. Detailed exception workflow, late payments, chargebacks, reversals and mistaken payments remain open.


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
- The Phase 1 schema proposal is documented separately; create the formal versioned migration only after review, using the Supabase CLI migration workflow.
- The additive migration must introduce board scopes, unique profile-board entries, claim/payment linkage and the new access rules.
- Replace the old maximum-three-pending-profile check with an ownership-only guard, retaining serialization if useful.
- Disable or replace conflicting moderation gates through additive migrations.
- Add tests for: Google-auth-required claim; business-contact OTP verification; public unauthenticated reads; one entry per exact profile ID per board; distinct duplicate profiles are allowed; no location-to-board matching; exact all-in Rp20.000 customer price; provider fees absorbed by platform; 15-minute intent expiry; one claim affects one board only; separate claims for each scope; moving an existing #5 entry to #1; keeping other entries in relative order; repeat claim with same profile ID without duplicate row; webhook-receipt-time ordering including delayed webhook behavior; equal-timestamp tie handling tracked as a release blocker; payment idempotency; unique-reference matching for identical-amount payments; concurrent claims; refund exception audit and public privacy.
