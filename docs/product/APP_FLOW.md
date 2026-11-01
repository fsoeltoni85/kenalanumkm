# App Flow

## Public experience

The public experience has three independent leaderboard scopes:

- **Indonesia** — one national board.
- **Provinsi** — one board for each selected province.
- **Kabupaten/Kota** — one board for each selected city or regency.

They are separate boards, not parent/child score aggregations. A claim at one level does not enter another level. Each board entry requires its own Rp20.000 claim.

All UMKM compete together. A business category may appear as profile information, but there is no category leaderboard or category ranking filter.

## Initial visit and browsing

1. Open the Indonesia leaderboard without requiring login.
2. Show entries in order of their latest successful claims.
3. Keep DATA SIMULASI visible while the preview uses synthetic data.
4. Explain the simple rule: each claim costs Rp20.000 and the latest confirmed claim goes to #1.
5. Do not request browser location permission or show a map.

Visitors can browse every board without logging in:
- Province boards contain only businesses that separately claimed that province board.
- Kabupaten/Kota boards contain only businesses that separately claimed that exact city/regency board.
- The Indonesia board contains only businesses that separately claimed the national board.
- These boards are not calculated by adding up smaller boards.
- Search filters visible rows but never changes rank.
- Show #1, #2, #3 and subsequent positions within the selected board.
- No daily/weekly/monthly ranking modes or automatic reset.

For a Kabupaten/Kota board, select a province and then one city/regency. A province board needs one province selection. The Indonesia board needs no lower-level location.
The selected city/regency or province is an unrestricted leaderboard destination. It does not need to match the UMKM profile's descriptive location or verified operating area; do not require local-address proof.


## Login state and navigation

**Signed out**
- Show a **Login dengan Google** button in the header.
- Public boards remain usable.
- Claim #1 cannot continue until Google Login succeeds.

**Signed in**
- Show the signed-in account identity (name/email/avatar where available) and a **Logout** button.
- Provide access to the user's saved UMKM profiles.
- Logout must not delete profiles, payment history or board entries.

Google Login through Supabase Auth is the only account sign-in method. Do not add anonymous sign-in, email OTP, SMS/WhatsApp OTP login or a separate password form. A separate business-contact OTP through phone/SMS or WhatsApp is required during claim verification; it is not a sign-in method.

## Claim #1 flow

1. Visitor clicks **Claim #1**.
2. If signed out, start Google Login. Preserve the intended board and selected location through the OAuth redirect.
3. After successful login, return the user to the claim flow they started.
4. User selects exactly one board: Kabupaten/Kota, Provinsi or Indonesia.
5. Ask only for the location needed by that board:
   - Kabupaten/Kota: select province, then city/regency.
   - Provinsi: select one province.
   - Indonesia: no lower-level location.
6. User selects an existing saved UMKM profile connected to the Google account or creates a new profile.
7. Ensure the UMKM business contact number is OTP-verified through phone/SMS or WhatsApp before proceeding. Complete the challenge if it is not yet verified. This confirms access to that contact channel only, not legal ownership or authority; validity and re-verification timing remain open.
8. Show a review step with the selected profile, target board and fixed all-in price Rp20.000.
9. Backend creates one claim and payment intent for exactly Rp20.000; the intent expires 15 minutes after server creation.
10. Show payment instructions from the configured provider.
11. Show a pending state while waiting for an authenticated provider webhook. The browser cannot declare payment successful.
12. Authenticate and match the webhook using its unique provider payment reference, record the server-side webhook receipt time and apply the claim to exactly one board.
13. If the profile is new to the board, insert it at #1 and shift current entries down one place. If the profile is already listed, move its existing row to #1; entries that were above it move down one place and entries below it keep their positions. Show the updated leaderboard.
14. Show a receipt/reference for the successful claim.

If the same profile already appears on the selected board, move that existing entry to #1 instead of creating a second row. Only entries that were above it move down; entries below it keep their positions. A new profile is inserted at #1 and all existing entries move down one place. A claim for another board is separate and does not change earlier boards.

There is no manual admin approval between a valid authenticated provider webhook and ranking update. The ranking timestamp is the server-recorded webhook receipt time; provider paid_at does not determine order.

## Profile reuse

A first-time user creates an UMKM profile after Google Login. Store the profile against the authenticated Supabase user ID.

On a later claim, the same Google account sees its saved profiles and can select one without typing the business details again. Each account may save an unlimited number of profiles. Profiles may duplicate the same business, branch or physical UMKM, including across accounts; do not detect, block, auto-merge or deduplicate them. Profile edits must not change ranking order.

Google Login identifies the account controlling the profile within KenalanUMKM; it does not prove legal ownership of the business. Avoid verified-owner wording unless a separate ownership check is approved and completed.

## Payment and confirmation

- Server creates a claim and payment intent for exactly IDR 20.000.
- The target board and profile are fixed by the server-side claim record.
- Payment matching must use a unique provider transaction/reference or equivalent provider-supported mechanism; amount-only matching is insufficient.
- Provider notification must be authenticated, matched to one pending payment intent and processed idempotently.
- Validate provider identity, unique payment reference, destination, exact amount, currency, claim binding, payment-intent expiry and duplicate status. Rank using the server-recorded receipt time of the authenticated valid webhook, not provider paid_at.
- Pending, failed, client-reported or unverified payments never change a board.
- Rp20.000 is the all-in customer price; the platform absorbs provider/bank transaction fees.
- Each payment intent expires after 15 minutes. Late-payment handling remains undecided.
- No refund solely because a profile is displaced. Exceptions are duplicate charges, system/provider errors or legal requirements; the exception workflow is not yet defined.
- Claims for the same board must be applied deterministically so each profile has only one entry on that board.
- Never use a browser timestamp or provider paid_at timestamp to determine order. If valid webhook receipt times tie, tie-breaking remains undecided.

Moota is only a candidate provider. Do not implement assumed webhook or signature behavior until its current official documentation, account requirements, commercial permission, pricing/limits and ability to match identical Rp20.000 payments are verified.

## Demo data

The current preview is still the earlier leaderboard/foundation prototype. Its generated business names, stake values, category modes and ranking order are synthetic and do not implement the approved three-board model. DATA SIMULASI must remain visible. Do not represent demo ranks or payments as real claims, real transactions or verified UMKM.

## Not part of the flow

No map, map pin, browser geolocation, Kecamatan/Kelurahan/Desa board, anonymous claim session, phone/SMS/WhatsApp OTP as account login, email OTP, category competition, manual listing review, auction, bid increment, cumulative payment score or automatic ranking reset. Business-contact OTP by phone/SMS or WhatsApp is in scope for claim verification.
