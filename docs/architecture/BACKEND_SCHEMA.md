# Backend Schema — Legacy Foundation and Approved Claim-First Model

## Important status

The first backend foundation has already been applied to the linked Supabase project. It was created before the Claim #1 business rules were finalized and contains an owner-account and manual-moderation model. That model is **legacy scaffolding, not the approved product workflow**.

Do not build new product behavior on the legacy signup, owner-only submission or moderation lifecycle. Do not rewrite migration files already applied to Supabase. Replace or disable conflicting paths through reviewed additive migrations. No production payment processing is enabled.

## Existing implemented tables and storage

### Categories — business_categories

Curated taxonomy with slug, display name, icon, sort order and active flag. Nine categories are seeded: Makanan & Minuman, Fashion, Retail, Jasa, Kecantikan, Kesehatan, Otomotif, Pendidikan and Lainnya.

### UMKM profiles — business_profiles

The current table stores one physical UMKM profile with owner user ID, public slug, business name, short description, category, province and Kabupaten/Kota names, optional address, private avatar object path, moderation status and review timestamps.

The owner_user_id and moderation lifecycle are part of the legacy scaffold. They must not define the new first-claim flow. The first implementation stores province and Kabupaten/Kota names rather than canonical geography IDs; an authoritative licensed geography dataset remains a prerequisite before relying on IDs or automated normalization.

### Profile links — business_profile_links

Stores primary, purchase, order/contact and social links, plus server-managed provider metadata. Link parsing may normalize known platform hosts, but must not scrape arbitrary URLs or issue server-side requests to untrusted destinations.

### Avatar Storage

The existing business-avatars bucket is private and its policies were built around authenticated owners and approved profiles. Review and replace those assumptions for the claim-first model before enabling public paid claims. A claim-specific upload capability must be scoped to one pending claim and must not expose private personal/contact data.

## Approved logical model

The following is the target design. Implement it through new reviewed migrations and tests.

### Claim intents

A claim intent stores the submitted UMKM profile data and the exact position being claimed before payment. It has a short-lived, unguessable capability for safely resuming the same claim without requiring a standalone signup. Do not expose this capability in public APIs or logs.

The claim target is exactly one slot:
- #1 Wilayah: one Kabupaten/Kota, with no category target;
- #1 Kategori: one Kabupaten/Kota and one category.

The selected profile still has its business category even when the requested target is #1 Wilayah.

### Payment intents and provider events

A payment intent is server-created and bound to one claim intent. Its amount is exactly IDR 20.000, stored as an integer. The client cannot choose or modify the amount, recipient, target slot or paid state.

Provider events are stored with a unique provider event/transaction identity and enough normalized metadata to validate recipient, amount, currency, reference and claim binding. Secrets and raw authentication material are not returned to clients.

### Leaderboard positions and champion history

Model each contestable target as one unique leaderboard position:
- one regional position per Kabupaten/Kota;
- one category position per Kabupaten/Kota/category.

A position can have only one current champion. The current champion is the business associated with the latest successfully confirmed payment for that position. Store an immutable champion-transition record for each successful replacement, including the associated payment and claim reference.

Do not sum old payments into a cumulative stake score. Old payments are history, not ranking weight. The same business may independently hold #1 Wilayah and #1 Kategori, but each requires its own Rp20.000 payment and claim. Reclaim after losing also requires a new Rp20.000 payment.

## Required payment transaction

A trusted provider event must be validated and applied atomically:
1. authenticate and deduplicate the provider event;
2. find the exact pending payment intent and claim;
3. validate destination, currency, amount (IDR 20.000), reference, freshness and claim state;
4. mark the payment as paid;
5. append immutable payment history;
6. lock/serialize the target leaderboard position;
7. replace its current champion with the claimant;
8. append the champion-transition record;
9. publish the claimed profile immediately.

If any step fails, the transaction must roll back. Duplicate provider events must not apply the claim twice. A pending, failed, expired or client-reported payment cannot change the champion.

## API direction

The new claim-first API should replace the legacy public profile submission path:
- POST /api/claims — validate claim target and profile data, create private claim/payment intent and return payment instructions or the next payment step.
- GET /api/claims/:id — return only safe status data for the holder of the claim capability.
- POST /api/webhooks/{provider} — authenticate and process provider events server-side.
- GET /api/business-profiles — expose only publicly live profiles/champions.
- GET /api/business-profiles/:slug — expose a live public profile.

The current POST /api/business-profiles auth-required submission route and /api/me/business-profiles owner account route are legacy and must be disabled or replaced before the Claim #1 experience is enabled. Do not add a signup step to make those routes fit.

## Security, RLS and privacy

- Anonymous public reads are limited to fields intentionally published after successful payment.
- Unpaid claim and payment records are private.
- Claim capability tokens are high entropy, hashed at rest where feasible, scoped to a single claim and rate-limited.
- Contact and payment metadata are private; do not leak them in public profile data.
- Provider event ingestion cannot be performed by a browser client.
- Any privileged database routine must have a documented justification, fixed search_path, narrow execute grants and a security review.
- Keep immutable audit records; do not silently rewrite payment or champion history.
- Storage upload rights for an anonymous claim must be restricted to that exact claim and only before it is paid/expired.

## Migration and validation rules

- Preserve the five already-applied legacy migration versions.
- Add new versioned migrations to transition the schema and remove the legacy workflow from active APIs/policies without destructively rewriting migration history.
- Add tests for duplicate provider event, exact amount mismatch, wrong recipient, replay, pending/failed payment, separate regional/category slots, independent champions, reclaim, concurrent payments to one slot and public privacy.
- Run Supabase Security Advisor and performance checks after migration changes.