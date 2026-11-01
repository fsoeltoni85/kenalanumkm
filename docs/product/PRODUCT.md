# Product Requirements — KenalanUMKM

**Market:** Indonesia only · **Domain:** https://kenalanumkm.biz.id

## Product

KenalanUMKM is an Indonesia-only pay-to-rank leaderboard for UMKM. A business pays a fixed **Rp20.000** to move its profile to the top of one selected leaderboard.

The user chooses Kabupaten/Kota, Provinsi or Indonesia. All business types compete together on the selected board. The latest successfully confirmed claim appears at #1. A new profile entry is inserted at the top and existing entries move down; an existing profile is moved to the top without creating a duplicate, while everyone else's relative order is preserved.

## Core product rules

1. Every successful claim costs exactly Rp20.000 at every geographic scope.
2. There are three independently claimable boards: one Kabupaten/Kota, one Provinsi or the Indonesia board.
3. Each claim affects exactly one selected board. There is no automatic entry, aggregation or point accumulation between levels.
4. The latest successfully confirmed claim moves that business to #1 on the selected board. If it is a new entry, all existing entries shift down one place. If it is already listed, move that row to #1; entries previously above it shift down one place and entries below it keep their positions.
5. If a profile already appears on the selected board, a new successful claim moves that entry to #1; it does not create a duplicate row.
6. All business types compete together. Category is optional descriptive profile information only, not a separate competition or ranking filter.
7. Public browsing does not require login. Claim #1 requires Google Login.
8. The header shows Login dengan Google when signed out and the signed-in account plus Logout when signed in.
9. Saved UMKM profiles are connected to the Google account so a returning user can reuse a profile.
10. Google Login identifies the account controlling the profile in KenalanUMKM. It does not prove legal ownership of the business.
11. Clicks and views are statistics only; they never determine rank.
12. Ranking and payment changes must be auditable.

## Geography and leaderboard scopes

- **Kabupaten/Kota:** one board for the selected city or regency.
- **Provinsi:** one board for the selected province.
- **Indonesia:** one national board.

These boards are independent, not an aggregation tree. A business that pays Rp20.000 to enter Kota Bekasi appears on that board only. It does not automatically appear on the Jawa Barat board or Indonesia board. Each additional board requires another separate Rp20.000 claim.

There is no #1 Kategori competition. Category may appear as profile information but does not separate the rankings.

No Kecamatan, Kelurahan or Desa boards. No public map, map pins, browser geolocation or coordinate-based leaderboard.

## Ranking and payment rules

- One successful claim costs exactly Rp20.000.
- A claim targets exactly one selected board and one UMKM profile.
- The newest valid, server-confirmed claim is placed at #1.
- For a new profile on a board, insert at #1 and shift all current entries down one place. For an existing profile, move its row to #1; only entries previously above it change position. Other profiles always keep their relative order.
- A profile already on that board is moved to #1 rather than duplicated.
- A business may appear on multiple boards only after separate claims and payments.
- Previous payments are history, not ranking points.
- No auction, bidding, outbid increments, dynamic pricing or cumulative payment score.
- No automatic daily, weekly or monthly reset.
- Pending, failed or unverified payments never change a leaderboard.
- Clicks, page views, ratings and social engagement never affect order.

Use a trusted provider payment time when the provider supports a reliable authoritative timestamp. Otherwise, the server-side confirmation order must be the documented source of truth. Browser timestamps are never trusted.

## Login and saved UMKM profiles

Public visitors can explore every board without logging in. When a visitor selects Claim #1, they must complete Google Login if signed out, then return to the intended claim flow. The user selects a saved UMKM profile or creates one. The profile and claim are associated with the authenticated Supabase user.

The header shows Login dengan Google when signed out; when signed in, it shows the account identity and Logout. Logout does not remove profiles or paid entries.

Google authentication is not legal business-ownership verification. Do not use owner-verified wording based only on Google Login.

## Claim experience

1. Click Claim #1.
2. Complete Google Login if required.
3. Choose a board: Kabupaten/Kota, Provinsi or Indonesia.
4. Select the location required by that board.
5. Choose a saved UMKM profile or create one.
6. Review the selected board, profile and fixed Rp20.000 price.
7. Pay.
8. After trusted payment confirmation, move the profile to #1 and show the updated board.

For a Kabupaten/Kota board, choose a province and then a city/regency. For a province board, choose one province. For Indonesia, no lower-level location is required.

## Out of scope

Category-specific contests; maps and map-based discovery; browser/device geolocation; Kecamatan/Kelurahan/Desa boards; anonymous claim access; password sign-in; phone/SMS/WhatsApp OTP; email OTP; auctions and variable bids; cumulative payment scoring; automatic periodic resets; reviews, ratings and voting as rank factors; manual editorial selection; marketplace checkout; booking, POS, CRM, inventory or delivery; pay-per-lead; subscription-led monetization; prizes or payouts to leaderboard winners; virtual businesses.

## MVP direction

Keep the public experience leaderboard-first. Label synthetic rows and sample payments as **DATA SIMULASI**. Build the three independent boards and the “latest successful claim moves to #1” behavior. Implement Google Login before enabling Claim #1. Keep real payment actions disabled until provider matching and confirmation are verified end to end.

## Success criteria

Visitors understand that any UMKM can claim any of the three board scopes for Rp20.000; each claim affects only one board; the latest confirmed claim moves the profile to #1 and shifts others down; categories do not create separate rankings; Claim #1 requires Google Login; saved profiles can be reused; and public browsing remains available without login.
