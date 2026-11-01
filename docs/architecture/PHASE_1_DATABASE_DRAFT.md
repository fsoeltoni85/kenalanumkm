# Phase 1 — Database schema draft

**Status:** Design draft on `feat/independent-leaderboards-foundation`.  
**Not an executable migration. Not applied to Supabase.**

This draft translates the approved business rules into a proposed relational model. It deliberately leaves provider-specific fields, geography-source identifiers and unresolved exception policies open. Once the schema is reviewed, create the formal migration with the Supabase CLI (`supabase migration new ...`) and validate it on a disposable/local database before any production migration is considered.

## Design constraints

1. Three independent scopes: `kabupaten_kota`, `province`, `indonesia`.
2. Every claim targets exactly one board and one saved profile.
3. Each successful claim is exactly IDR 20,000, all-in to the customer.
4. A payment intent expires 15 minutes after server creation.
5. Each claim payment needs its own unique provider invoice/payment reference and authenticated webhook.
6. Ranking uses the server-received webhook timestamp, serialized at PostgreSQL microsecond precision.
7. Equal webhook-receipt timestamps have no approved tie-break. The payment event must be recorded as unresolved and must not silently change rank.
8. A late payment after expiry is recorded as unresolved; it is not ranked and is not automatically refunded.
9. The same exact profile ID can have one entry per board. Different profile IDs may describe the same business and are not deduplicated.
10. A profile may claim any available city/regency or province board regardless of its descriptive address.
11. A claim requires a Google-authenticated managing account and a verified business phone/WhatsApp contact channel. This is channel-access verification only, not legal ownership verification.
12. Provider selection, OTP provider and OTP re-verification cadence remain open.

## Proposed tables

| Table | Responsibility | Important constraints |
|---|---|---|
| `leaderboard_boards` | Registry of independent leaderboard destinations | Scope-specific nullable geography keys; one national board; unique province board; unique city/regency-within-province board |
| `leaderboard_entries` | Current position of a profile on one board | Unique (`board_id`, `profile_id`); positive position; deferrable unique (`board_id`, `position`); latest claim and webhook-received timestamp |
| `leaderboard_claims` | A user's request to move one profile on one board | Profile owner and claimant must match; one board; fixed amount 20,000 IDR; server timestamps; 15-minute expiry |
| `claim_payment_intents` | Provider-facing payment instruction | One intent per claim; unique internal reference; unique provider reference once issued; fixed amount and expiry |
| `payment_webhook_events` | Immutable, idempotent record of provider notifications | Unique (`provider`, `provider_event_id`); signature-verification result; receipt timestamp; payload hash, not raw secret material |
| `claim_payment_transactions` | Normalized provider transaction records | Unique (`provider`, `provider_transaction_id`); claim/payment-intent link; amount/currency; provider fee; receipt timestamp; informational provider paid_at |
| `business_contact_verifications` | Private record that a profile's phone/SMS or WhatsApp channel passed OTP | Profile, channel, E.164 contact, verification state and verified_at; no assumption about OTP lifetime or reuse |
| `leaderboard_movement_history` | Append-only record of position changes | Claim, board, profile, prior/new position and webhook-received timestamp |

### Board identity

Use a typed scope plus normalized board keys:

- Indonesia: no province or regency key.
- Province: a province key and label; no regency key.
- Kabupaten/Kota: province key plus regency key and labels.

The keys are stable identifiers supplied by the eventual approved geography dataset. This draft does not pick a dataset, API or licensing model. Until that source is selected, do not populate production board identifiers from free-form profile text. The profile's own location remains descriptive and is not used to authorize a claim.

### Entry ordering

A board's entries are maintained by the latest successful claim's server-recorded webhook-received timestamp, newest first. The service must serialize operations for a board, then re-evaluate the board order from these timestamps:

- a new profile is inserted at the chronological position implied by its valid webhook receipt time;
- a later-received claim for an existing profile updates that same entry and moves it to #1;
- an earlier-received webhook that is processed later must not incorrectly jump ahead of a later-received event;
- all other entries preserve their relative order;
- one profile-board row is maintained.

Timestamps are normalized to UTC and preserve microseconds end-to-end. A tie is not resolved by UUID, provider paid_at, database row order or arrival of the SQL worker. It is stored as unresolved until a separate tie-break decision is approved.

## Proposed constraints and indexes

- `leaderboard_boards.scope` check in (`kabupaten_kota`, `province`, `indonesia`).
- Shape check: Indonesia has no geography keys; province has only province key; city/regency has both province and regency keys.
- Partial unique indexes for one Indonesia board, one board per province key, and one per (province key, regency key).
- `leaderboard_entries`: unique (`board_id`, `profile_id`); unique (`board_id`, `position`) deferrable initially deferred; positive position.
- `leaderboard_claims.amount_idr = 20000`, `currency = 'IDR'`; expiry must be 15 minutes after server-created time.
- `claim_payment_intents.claim_id` unique; internal reference unique; provider reference unique per provider.
- `payment_webhook_events(provider, provider_event_id)` unique.
- `claim_payment_transactions(provider, provider_transaction_id)` unique.
- RLS on every exposed application table. Public reads are restricted to published profile/board data; claim, intent, provider-event, transaction, contact-verification and movement-audit records are private.
- Browser roles receive no insert/update grants on claim payments, provider events or ranking positions.
- Provider webhook processing is server-only and authenticated; the SQL operation must be idempotent and atomic.

## Additive transition from the existing profile foundation

The five already-applied migrations must remain unchanged. The future formal migration needs to:

1. Keep `business_categories`, `business_profiles` and `business_profile_links`.
2. Replace the `submit_business_profile` RPC with a version that does not enforce the old maximum of three pending profiles.
3. Replace `guard_business_profile_owner_insert` with an ownership-only guard; remove its pending-count limit while retaining per-owner serialization if useful.
4. Add a public profile state that does not depend on mandatory manual moderation, while retaining legacy statuses for existing records. New submissions use the public state; old pending/rejected/suspended records are not silently rewritten.
5. Update public profile/link/avatar policies and API queries to recognize the new public state.
6. Keep owner RLS and private contact metadata separate from public profile data.
7. Do not add unique constraints or dedupe logic across business names, addresses, phone numbers, links, branches or Google accounts.
8. Do not remove the legacy descriptive category column, but do not use category as a leaderboard dimension.

The current production project had zero profile rows during the Phase 0 audit. Still, preserve migration history and write the transition so it safely handles legacy records if any are added before the migration is approved.

## Atomic payment-to-ranking operation

A server-only database function/service transaction should:

1. Record or deduplicate the authenticated provider event.
2. Lock the selected board.
3. Find the exact payment intent by its provider-issued unique reference.
4. Validate event authenticity, provider transaction identity, exact IDR 20,000 amount, currency and claim binding.
5. Capture/retain the server webhook-received timestamp; do not trust browser or provider paid_at for rank.
6. If the event arrived at/after expiry, record `late_payment_unresolved` and do not rank.
7. If the intent has already produced a distinct paid transaction, preserve the extra transaction for duplicate-charge review; do not apply another rank movement automatically.
8. If its receipt timestamp equals another entry's latest timestamp, record `ambiguous_order` and do not apply rank.
9. Otherwise mark the claim paid, insert or update exactly one profile-board entry, recalculate positions in receipt-time order, and append movement history atomically.

No provider adapter, real payment, refund, chargeback or late-payment policy is activated in this phase.

## Explicitly unresolved

- Geography dataset, canonical identifiers and licence.
- Payment provider, provider-specific webhook signature contract, invoice/QRIS/VA reference format and fee reconciliation.
- OTP vendor, OTP lifetime, resend/attempt limits and whether verification is reused or repeated.
- Tie-break for identical webhook receipt timestamps.
- Late-payment policy after 15-minute expiry.
- Chargeback, reversal and mistaken-payment handling.
- Detailed refund-exception workflow.
- Pagination/archive policy for very large boards.
- Whether an operational support role may resolve ambiguous/late events, and the permitted review/audit procedure.

Do not fill in these decisions implicitly in SQL defaults or application behavior.
