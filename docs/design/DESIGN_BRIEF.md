# Design Brief — KenalanUMKM

## Product experience

KenalanUMKM is an Indonesia-only pay-to-rank leaderboard for UMKM. The core interaction should be understood immediately: choose one area board, pay Rp20.000 and move the selected UMKM profile to #1.

There are three independent scopes: Kabupaten/Kota, Provinsi and Indonesia. They are not cumulative levels. Every UMKM competes together regardless of category.

## Primary visual hierarchy

1. Clear headline explaining “Bayar Rp20.000 untuk naik ke #1”.
2. Three scope tabs: Kabupaten/Kota, Provinsi and Indonesia.
3. Location selector appropriate to the selected scope.
4. A readable ordered leaderboard with #1, #2, #3 and later positions.
5. Claim #1 action with the fixed price Rp20.000.
6. Business profile details; category may appear only as descriptive metadata.
7. Clicks/views as muted secondary statistics only.
8. Header: Login dengan Google when signed out; account identity and Logout when signed in.

## Geography and boards

- Kabupaten/Kota: select a province and a city/regency.
- Provinsi: select one province.
- Indonesia: no lower-level location selection.
- Each scope is an independent board.
- Paying for one board never enters or moves the business on another board.
- A separate Rp20.000 claim is required for every board the business wants to enter.
- No category-specific leaderboard, category competition filter or #1 Kategori badge.
- No maps, map pins, public coordinates or browser geolocation.
- No Kecamatan, Kelurahan or Desa boards or navigation.
- Users may select any city/regency or province board; the selected area does not need to match the business's descriptive or physical location.

## Ranking behavior

- The most recently received valid, authenticated payment-provider webhook appears at #1; provider paid_at does not determine order.
- A new profile is inserted at #1 and all existing entries move down one place. If the profile is already listed, move that existing row to #1; entries above its old position move down one place and entries below it keep their positions. Other profiles always keep their relative order.
- A profile already on that board moves to #1 rather than appearing twice under the same saved profile ID. Separate saved profiles may describe the same business, branch or outlet and are not deduplicated.
- A separate claim can place the same profile on another board.
- No payment total, score, points, category, click count, rating or profile view affects order.
- No automatic daily, weekly or monthly reset.
- The ordered list is a paid-placement ranking, not a statement that the highest-ranked UMKM has the best quality.

## Login and claim behavior

- Public leaderboard browsing requires no login.
- Claim #1 requires Google Login.
- A signed-out visitor who clicks Claim #1 is sent to Google Login and returned to the intended claim flow.
- The header shows Login dengan Google when signed out.
- When signed in, show the account and a Logout button.
- Users can select a previously saved UMKM profile or create one. Avoid asking for the same business information on every claim.
- Google Login identifies the KenalanUMKM account, not legal ownership of the business.
- After choosing or creating a profile, the claim flow verifies access to the supplied business phone number through phone/SMS or WhatsApp OTP. This is contact-channel verification, not legal ownership verification.

## Fixed price and payment states

Show Rp20.000 as the same fixed price for Kabupaten/Kota, Provinsi and Indonesia. Never show a bidding calculator, current stake, minimum increase or dynamic claim price.
Rp20.000 is all-in for the customer; the platform absorbs provider fees. The claim payment intent expires after 15 minutes. Do not show a customer-facing processing-fee surcharge. No refund is due solely because a profile is displaced; the defined exceptions are duplicate charges, system/provider errors or legal requirements.


Make pending payment distinct from success. Only trusted server-verified payment moves the profile to #1. Show a clear success state with the updated position and payment reference.

## Visual system

- Bright, airy canvas with pale mint, white, sky, peach and butter-yellow surfaces.
- Plus Jakarta Sans typography with friendly, rounded display headings and readable numeric hierarchy.
- Fresh green as primary action/accent; coral, sky blue, lilac and warm yellow as supporting accents.
- Keep backgrounds light; no large dark panels.
- Use restrained borders, soft shadows and generous row spacing.
- Desktop uses one centered board; mobile keeps the same information order in a single column without horizontal page overflow.
- Distinguish selected board scope from descriptive business information.

## Demo integrity

The current preview remains the earlier leaderboard/foundation prototype. Its generated businesses, stake values, category modes and ordering are synthetic and do not implement the approved three-board model. DATA SIMULASI must remain visible. They are not real UMKM, paid claims, transactions or verified rankings. Google login and real Claim #1 actions remain disabled until implemented and tested end to end.
