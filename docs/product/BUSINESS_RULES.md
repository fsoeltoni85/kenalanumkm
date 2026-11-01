# Business Rules — KenalanUMKM

**Status:** Approved core product rules  
**Market:** Indonesia only  
**Fixed claim price:** Rp20.000 per successful claim

This document is the source of truth for price, account access, board scopes and ranking behavior.

## 1. The simple rule

An UMKM pays **Rp20.000** to move its business profile to the top of one selected leaderboard. All UMKM compete together, regardless of what they sell. There are no separate category competitions.

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

## 3. Fixed price

Every successful claim costs exactly **Rp20.000**, regardless of the selected board. One payment applies to one board only.

There is no auction, bid, outbid increment, minimum increase, dynamic price, special price for the current #1 or cumulative-payment score.

## 4. How the ranking moves

**The latest successfully confirmed claim is shown at #1.** All other entries move down by one place while keeping their previous order.

Example: if Business E is at #5 and pays Rp20.000, E moves to #1. The previous #1 moves to #2, #2 moves to #3, #3 moves to #4 and #4 moves to #5.

If a business already appears on the same board and pays again, its existing entry moves to #1. It must not appear twice on that board. Other businesses keep their relative order.

A business can appear on several boards only by paying separately for each one. A claim on one board never changes its position on another board.

No daily, weekly or monthly reset applies.

## 5. Business category

Category may be stored as descriptive information on a business profile. It does not affect eligibility, leaderboard position, ordering, claim price or which businesses compete together. There are no #1 Kategori boards or category-based ranking filters.

## 6. Google Login

Public visitors can browse all leaderboards without logging in. Google Login is required before continuing with Claim #1.

- Signed out: the header shows **Login dengan Google**.
- Signed in: the header shows the signed-in account and a **Logout** button.
- If a signed-out visitor clicks Claim #1, send them through Google Login and then return them to the claim they started.
- UMKM profiles are linked to the Google account that manages them. Returning users can select a saved profile instead of typing the same details again.
- Logging out does not delete profiles, payment history or leaderboard positions.
- Logging in again with the same Google account restores access to that account's saved profiles.

Google Login confirms access to a Google account. It does **not** prove that the person is the legal owner or authorized representative of the named UMKM. Do not show an owner-verified badge based only on Google Login.

## 7. Claim and payment flow

1. Visitor clicks **Claim #1**.
2. If signed out, they log in with Google and return to the claim flow.
3. User selects one board: Kabupaten/Kota, Provinsi or Indonesia.
4. User selects an existing saved UMKM profile or creates a new profile.
5. The server creates one claim and one payment intent for exactly Rp20.000.
6. User pays using the enabled payment method.
7. The server validates trusted provider confirmation.
8. The selected profile moves to #1 on that board.
9. Existing entries move down without changing their relative order.

No manual admin approval is required after a valid payment confirmation. Unpaid or unverified claims never change a leaderboard.

## 8. Payment verification

Only a payment confirmation validated by the server from the configured provider can change a leaderboard. A form submission, payment instruction, screenshot, browser redirect or pending transfer is not proof of payment.

Every claim needs a unique payment/claim reference so the system can match a Rp20.000 payment to exactly one board and profile. Matching by amount alone is not sufficient because many users can pay the same fixed amount.

The provider must support a reliable way to identify each payment and determine its trusted payment time or confirmation order. Do not use a timestamp supplied by the browser.

Moota is a candidate only. It is not approved until its official API, account requirements, commercial permission, fees/limits and payment-matching behavior are verified.

## 9. Audit requirements

Keep immutable claim, payment, provider-event and leaderboard-movement history. A repeat claim moves the profile on the selected board but does not erase earlier payment history.

Duplicate provider notifications must not create duplicate ranking movements. Genuine separate payments must have separate transaction identities and valid claim intents.

For close-together payments, ordering must be deterministic. Use a trusted provider payment timestamp when available and reliable. Otherwise, document the exact server-side confirmation order before enabling the provider. Never use browser timestamps.

## 10. Decisions still open

Do not invent these rules:
- refunds, chargebacks, reversals and mistaken payments;
- pending payment expiry and late payments;
- bank/provider fees and whether they are included in Rp20.000;
- final payment provider and proof it can match many identical Rp20.000 payments to separate claims;
- maximum number of rows shown and pagination;
- any separate proof of legal business ownership or authorization;
- maximum UMKM profiles per Google account.

These do not change the approved core rule: one confirmed Rp20.000 claim moves one profile to #1 on one selected board.
