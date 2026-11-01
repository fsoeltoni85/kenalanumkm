# App Flow

## Information architecture

Public leaderboard: Indonesia → Province → Kabupaten/Kota → position type → leaderboard/profile.

Position types:
- **#1 Wilayah:** the overall champion of one Kabupaten/Kota, across all categories.
- **#1 Kategori:** the champion of one category inside one Kabupaten/Kota.

The Indonesia regional Top 20 contains #1 Wilayah champions. Category leaderboards show the #1 Kategori champion for the selected category in each Kabupaten/Kota. Province is a grouping/navigation layer. Kabupaten/Kota is the only competition geography.

## Initial visit

1. Open the leaderboard immediately on Indonesia scope.
2. Do not request browser location permission or show a map.
3. Keep DATA SIMULASI visible while the preview uses synthetic names and sample champion data.
4. Explain that the two position types are independent, each claim costs Rp20.000, and the latest confirmed payment takes the selected position.

## Explore and leaderboard scopes

The public experience has three geographic scopes:
- **Indonesia** — a display of current #1 Wilayah champions, one per represented Kabupaten/Kota.
- **Provinsi** — the #1 Wilayah champions in that province.
- **Kab/Kota** — the current #1 Wilayah champion plus the #1 Kategori positions for the city's available categories.

A category leaderboard is a separate view: it shows the current #1 Kategori champion for that category in each represented Kabupaten/Kota. Selecting a province groups those category champions by province.

Selecting a province opens its board and resets the selected city. Selecting a city opens its regional champion and category champion information. Returning to Indonesia restores the regional champion list. Search only filters the visible results; it never changes rank.

The relative ordering between champions from different Kabupaten/Kota is not yet approved. Until a separate rule is approved, do not assign cross-city rank numbers, show a Top 3 podium, or sort by cumulative payment, click count or payment recency. Local #1 labels remain valid because they describe each city's or category's own position.

There is no map, no map pin, no city-centroid visualization and no browser geolocation flow. Kecamatan, Kelurahan and Desa are not exposed as filters or navigation.

## Current champion and history

- A position has one current champion at a time.
- The champion remains in place until a later valid payment is confirmed for that exact position.
- No automatic daily, weekly or monthly reset applies.
- Historical payment and champion-change activity may be shown separately from the current leaderboard; history does not determine the current champion.
- Do not present All Time, Hari Ini or date-based periods as separate ranking modes in the active leaderboard.

## Claim #1 flow

There is no standalone registration or signup screen.

1. Visitor clicks **Claim #1**.
2. Visitor chooses the Kabupaten/Kota to compete in.
3. Visitor chooses **#1 Wilayah** or **#1 Kategori**. If #1 Kategori is selected, the visitor must choose one category.
4. Show the fixed price of **Rp20.000** for the selected position and explain that one payment only claims that position.
5. Open the UMKM form as part of this claim. Collect business name, primary category, short description, Kabupaten/Kota, province, optional address, avatar, main website/social link, purchase link and order/contact link.
6. The backend validates the data and creates a claim intent plus payment intent for exactly Rp20.000.
7. Show payment instructions from the configured provider.
8. Show a pending state while waiting for a trusted provider confirmation. Do not let the browser declare the payment successful.
9. After server-side verification and one atomic commit, publish the profile and immediately assign the selected #1 position to that business.
10. Show the new champion state and a receipt/reference for the successful claim.

A single payment applies to one slot only. To claim both #1 Wilayah and #1 Kategori, the user completes and pays for two separate claims of Rp20.000 each. Reclaiming a position after losing it also costs Rp20.000.

The first claim does not require creating an account. There is no manual listing review or approval stage between payment confirmation and publication.

## Payment pending and confirmation

- A pending claim is not public and does not change a champion.
- The backend creates and stores the amount and target position; the client cannot set either to an arbitrary value.
- Provider notification must be authenticated and matched to the exact pending payment intent.
- Validate reference, recipient/destination, currency, amount, freshness and duplicate status.
- Process provider events idempotently.
- Serialize competing confirmations for the same position so there is exactly one champion.
- Client redirects, screenshots and client-side status values are never authoritative payment proof.

Moota is a candidate provider only. Do not claim it is approved or implement an assumed webhook/signature format until the current official API, account requirements, commercial permission, pricing and limits are verified.

## Profile content

Profile content is collected inside Claim #1, not through separate registration. Keep public details limited to the business information and links needed for discovery. Personal contact data and claim/payment capability tokens must not be exposed in public profile responses.

## Demo data

The preview uses synthetic businesses and champion assignments to demonstrate both position types and the geographic views. DATA SIMULASI remains visible. Demo businesses, payments and claim confirmations are not real. Claim #1 and real payment actions remain disabled until the end-to-end claim/payment milestone is implemented and explicitly enabled.

## Future profile management

A way to edit or recover a claimed profile may be designed later. It must not change the approved first-claim flow into a signup-first experience or add manual review to champion activation.