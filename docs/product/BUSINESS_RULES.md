# Business Rules — KenalanUMKM

**Status:** Approved core product rules and decisions through 1 November 2026  
**Market:** Indonesia only  
**Fixed claim price:** Rp20.000 per successful claim, all-in for the customer

This document is the source of truth for claim price, geography, account access, business-contact verification, board scopes, payment handling and ranking behavior. Decisions explicitly marked open must not be implemented by assumption.

## 1. The simple rule

An UMKM pays **Rp20.000** to move one saved business profile to the top of one selected leaderboard. All UMKM compete together, regardless of what they sell. There are no separate category competitions.

## 2. Three independent leaderboard choices

A user chooses exactly one board for each claim:

1. **Kabupaten/Kota** — one selected city or regency.
2. **Provinsi** — one selected province.
3. **Indonesia** — the national leaderboard.

Each board can be claimed directly and is independent.

- A Kabupaten/Kota claim does not automatically enter its province board.
- A province claim does not automatically enter the Indonesia board.
- Province and Indonesia boards are not calculated by adding up lower-level results.
- To appear on more than one board, the business makes a separate Rp20.000 claim for each board.

For a Kabupaten/Kota claim, select the province and then the city/regency. For a province claim, select one province. For an Indonesia claim, no smaller location is selected.

## 3. Geographic selection — confirmed decision B

The user may select **any available Kabupaten/Kota or Provinsi board**. The selected board does not need to match the UMKM's registered address, physical outlet, or operating area.

- Do not require address-to-board matching.
- Do not require proof that the business operates, has a branch, or is registered in the selected area.
- Do not block a claim because the profile's descriptive province/city differs from the selected board.
- The selected board is the user's chosen leaderboard destination, not a verified statement about the business's physical location.

The profile may still store descriptive location information, but it does not restrict which board can be claimed.

## 4. Fixed price and transaction fees

Every successful claim costs the customer exactly **Rp20.000**, regardless of the selected board.

- Rp20.000 is the all-in customer price.
- The platform absorbs payment-provider/bank transaction fees; do not add them on top of Rp20.000.
- One payment applies to one board only.
- Any provider fee must be accounted for separately from the customer's fixed claim price.

There is no auction, bid, outbid increment, minimum increase, dynamic price, special price for the current #1 or cumulative-payment score.

## 5. How the ranking moves

The order is based on the server-recorded receipt time of a valid, authenticated payment-provider webhook. The most recently received valid webhook moves the relevant profile to #1 on its selected board. This is intentionally **webhook-receipt ordering**, not provider `paid_at` chronology.

If the profile is new to that board, insert it at #1 and move every existing entry down one place. If the profile is already on that board, remove its old row and move it to #1; entries that were above it move down one place, while entries below it keep their positions. In both cases, all other businesses preserve their relative order.

A repeat claim using the same saved profile on the same board updates and moves that existing entry. It must not create a second row for that same profile on that same board.

A profile can appear on several boards only by paying separately for each one. A claim on one board never changes its position on another board.

No daily, weekly or monthly reset applies. Clicks, views, ratings and category do not affect rank.

**Important consequence:** if payment A was made before payment B but A's valid webhook reaches the server after B's valid webhook, A is ordered after B and becomes #1. The platform does not reorder by provider `paid_at`.

The server must record the webhook receipt time. Browser timestamps and provider timestamps must not replace this chosen ranking basis. Exact tie-breaking when two valid webhook receipt timestamps are identical remains open; do not invent a tie-break rule.

## 6. Business category and duplicate profiles

Category may be stored as descriptive information on a business profile. It does not affect eligibility, leaderboard position, ordering, claim price or which businesses compete together. There are no #1 Kategori boards or category-based ranking filters.

**Duplicate restriction decision C:** KenalanUMKM does not impose duplicate-profile, duplicate-branch, or same-business-across-accounts restrictions.

- Multiple profiles may describe the same brand, branch or physical UMKM.
- The same business may be created or managed by different Google accounts.
- Do not reject, merge, hide or deduplicate profiles solely because their names, contact details, addresses, links or other fields look alike.
- Each saved profile is a separate profile identity and may have its own paid entry on a board.
- The existing same-profile rule still applies: one exact profile ID has at most one row on a given board; claiming again moves that row to #1 rather than adding another row for that same profile ID.

No automatic brand grouping or branch policy is implied.

## 7. Google Login and business-contact OTP

Public visitors can browse all leaderboards without logging in. Google Login through Supabase Auth is required before continuing with Claim #1.

- Signed out: the header shows **Login dengan Google**.
- Signed in: the header shows the signed-in account and a **Logout** button.
- If a signed-out visitor clicks Claim #1, send them through Google Login and then return them to the claim they started.
- UMKM profiles are linked to the Google account that manages them. Returning users can select saved profiles instead of re-entering their details.
- Logging out does not delete profiles, payment history or leaderboard positions.
- Logging in again with the same Google account restores access to that account's saved profiles.
- Each Google account may save an unlimited number of UMKM profiles. This does not create any duplicate-profile restrictions.

In addition to Google Login, the UMKM business contact number must be OTP-verified through **phone/SMS or WhatsApp** before that profile is used for a claim. A successful OTP demonstrates access to the contact channel only. Whether verification is reused for later claims, how long it remains valid, and when re-verification is required remain open; do not assume either one-time-only or every-claim verification.

This OTP confirms access to the supplied phone/WhatsApp channel only. It does **not** prove legal ownership of the business, legal authority to represent it, or that the business operates in the selected leaderboard area. Do not show an owner-verified or legally-verified badge based on Google Login and contact OTP.

Google OAuth remains the only account sign-in method. Phone/SMS/WhatsApp OTP is business-contact verification, not a login method.

## 8. Claim and payment flow

1. Visitor clicks **Claim #1**.
2. If signed out, they log in with Google and return to the claim flow.
3. User selects exactly one board: Kabupaten/Kota, Provinsi or Indonesia.
4. User selects an existing saved UMKM profile or creates a new profile.
5. Ensure the UMKM business contact number is OTP-verified through phone/SMS or WhatsApp before using the profile for a claim. If it is not yet verified, complete the OTP challenge. Re-verification timing and frequency remain open.
6. The server creates one claim and one payment intent for exactly Rp20.000.
7. The user pays using the configured provider method.
8. The payment intent is valid for **15 minutes** from its server-created time.
9. The server validates an authenticated provider webhook and its unique payment reference.
10. The server records the webhook receipt time and applies the ranking movement to exactly the selected board.
11. The user sees the updated board and a claim/payment reference.

The exact OTP provider, OTP lifetime, resend limit, attempt limit, verified-state validity period and re-verification frequency have not been decided and must not be invented.

A claim does not change a leaderboard merely because the user submitted a form, opened a payment page, uploaded a screenshot or returned to the browser. Only a valid authenticated provider webhook matched to the unique claim/payment reference can trigger a ranking movement.

## 9. Payment verification, expiry and provider choice

The selected payment approach is **one unique payment reference/invoice/QRIS/VA per claim**, with an authenticated provider webhook that can be reliably mapped to exactly one claim.

- The customer amount is exactly IDR 20.000, inclusive of provider fees from the customer's perspective.
- The server creates the claim and payment intent and binds the target board and profile.
- Amount-only matching is insufficient because every claim has the same fixed amount.
- The provider must supply a unique identifier/reference for every separate payment and a webhook mechanism whose authenticity can be verified.
- Duplicate webhook deliveries must be idempotent and must not create duplicate ranking movements.
- A unique provider transaction identity must not be reused for another claim.

The payment intent expires after **15 minutes**. An expired intent must not be treated as a normal pending intent. What to do when the user pays after the 15-minute expiry is still open; do not automatically rank a late payment or promise a refund until the late-payment handling rule is approved.

Moota is a candidate provider only. It is not approved for production until its official API, account requirements, commercial permission, fees/limits, webhook authenticity and ability to match each identical Rp20.000 payment to a unique claim are verified. The unique-reference + trusted-webhook requirement applies regardless of provider.

## 10. Refunds and reversals

**Refund decision A:**
- No refund is given merely because a later claim moves the UMKM down from #1.
- Refund exceptions are limited to duplicate charges, a system/provider error, or a legal requirement.

The exact request, review, authorization, processing-time and accounting workflow for those exceptions has not been decided. Chargebacks, reversals, mistaken user payments and late payments must not be assigned an invented policy. Keep those cases visible for operational handling until a separate rule is approved.

## 11. Audit requirements

Keep immutable claim, payment, provider-event and leaderboard-movement history. A repeat claim moves the profile on the selected board but does not erase earlier payment history.

- Authenticate provider webhooks before using them.
- Record the server-side webhook receipt timestamp for every event.
- Duplicate provider notifications must not create duplicate ranking movements.
- Genuine separate payments must have separate transaction identities and valid claim intents.
- Rank by valid webhook receipt time, not provider `paid_at`, browser time or client-reported time.
- Equal webhook receipt timestamps need a deterministic tie-break rule before production; that rule remains open.
- Keep provider fees separate from the fixed Rp20.000 customer claim amount.

## 12. Decisions still open

Do not invent these rules:
- exact payment provider and verification that it supports unique per-claim references and authenticated webhooks; Moota remains only a candidate;
- late payments received after the 15-minute payment-intent expiry, including whether to reject, refund, hold or otherwise reconcile them;
- chargebacks, reversals and mistaken user payments;
- the detailed workflow and service levels for approved refund exceptions;
- tie-breaking when valid webhook receipt timestamps are identical;
- exact OTP vendor, delivery configuration, OTP lifetime, resend/attempt limits and re-verification frequency;
- maximum leaderboard rows, pagination and archival/display policy;
- provider-specific reconciliation, fee accounting and exception operations beyond the fixed all-in customer price.

The following are **decided and must not be reopened as undecided**: arbitrary city/province board selection without physical-location matching; Google Login plus business phone/WhatsApp OTP; no duplicate-profile restrictions; webhook-receipt-time ranking; unique per-claim payment reference with trusted webhook; Rp20.000 all-in customer price with platform absorbing fees; 15-minute payment-intent expiry; refund policy A; and unlimited saved profiles per Google account.
