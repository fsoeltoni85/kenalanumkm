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

## Login state and navigation

**Signed out**
- Show a **Login dengan Google** button in the header.
- Public boards remain usable.
- Claim #1 cannot continue until Google Login succeeds.

**Signed in**
- Show the signed-in account identity (name/email/avatar where available) and a **Logout** button.
- Provide access to the user's saved UMKM profiles.
- Logout must not delete profiles, payment history or board entries.

Google Login through Supabase Auth is the only user sign-in method. Do not add anonymous sign-in, email OTP, SMS/WhatsApp OTP or a separate password form.

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
7. Show a review step with the selected profile, target board and fixed price Rp20.000.
8. Backend creates one claim and payment intent for exactly Rp20.000.
9. Show payment instructions from the configured provider.
10. Show a pending state while waiting for trusted provider confirmation. The browser cannot declare payment successful.
11. After server-side validation, apply the claim to exactly one board.
12. Move the selected profile to #1, move other entries down while preserving their relative order, and show the updated leaderboard.
13. Show a receipt/reference for the successful claim.

If the same profile already appears on the selected board, move that existing entry to #1 instead of creating a second row. A claim for another board is separate and does not change earlier boards.

There is no manual admin approval between valid payment confirmation and ranking update.

## Profile reuse

A first-time user creates an UMKM profile after Google Login. Store the profile against the authenticated Supabase user ID.

On a later claim, the same Google account sees its saved profiles and can select one without typing the business details again. Profile edits must not change ranking order. The maximum number of profiles per account has not been decided.

Google Login identifies the account controlling the profile within KenalanUMKM; it does not prove legal ownership of the business. Avoid verified-owner wording unless a separate ownership check is approved and completed.

## Payment and confirmation

- Server creates a claim and payment intent for exactly IDR 20.000.
- The target board and profile are fixed by the server-side claim record.
- Payment matching must use a unique provider transaction/reference or equivalent provider-supported mechanism; amount-only matching is insufficient.
- Provider notification must be authenticated, matched to one pending payment intent and processed idempotently.
- Validate provider identity, reference, destination, amount, currency, claim binding, trusted payment time and duplicate status.
- Pending, failed, client-reported or unverified payments never change a board.
- Claims for the same board must be applied deterministically so each profile has only one entry on that board.
- Never use a browser-provided timestamp to determine order.

Moota is only a candidate provider. Do not implement assumed webhook or signature behavior until its current official documentation, account requirements, commercial permission, pricing/limits and ability to match identical Rp20.000 payments are verified.

## Demo data

The current preview is still the earlier leaderboard/foundation prototype. Its generated business names, stake values, category modes and ranking order are synthetic and do not implement the approved three-board model. DATA SIMULASI must remain visible. Do not represent demo ranks or payments as real claims, real transactions or verified UMKM.

## Not part of the flow

No map, map pin, browser geolocation, Kecamatan/Kelurahan/Desa board, anonymous claim session, phone/SMS/WhatsApp OTP, email OTP, category competition, manual listing review, auction, bid increment, cumulative payment score or automatic ranking reset.
