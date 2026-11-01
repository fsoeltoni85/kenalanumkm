# Design Brief — KenalanUMKM

## Product experience

KenalanUMKM is an Indonesia-only pay-to-rank competition for physical UMKM. The public interface is a bright, compact leaderboard-first experience inspired by the clarity of Outbid.lol, while using KenalanUMKM's own fixed-price Claim #1 rules and Indonesian geography. It is not a map, generic directory or corporate analytics dashboard.

## Primary visual hierarchy

1. Competition headline and clear explanation of the two position types.
2. Three geographic scopes: Indonesia, selected province and selected Kabupaten/Kota.
3. Clear switch between #1 Wilayah and #1 Kategori; category selection appears for category positions.
4. Current champion and fixed claim price Rp20.000.
5. A scannable list of current champions. Do not use cross-city rank numbers or a Top 3 podium until the national/province display-order rule is approved.
6. Payment history only as secondary history where useful; do not use cumulative payment totals as ranking values.
7. Clicks as muted secondary statistics only.

## Geography and competition

Information hierarchy: Indonesia → Province → Kabupaten/Kota → position type → leaderboard.

- Each Kabupaten/Kota has one #1 Wilayah position across all categories.
- Each category in each Kabupaten/Kota has one separate #1 Kategori position.
- The two position types are independent; winning one does not grant the other.
- Indonesia list displays current #1 Wilayah champions, one per represented Kabupaten/Kota.
- A category list displays the #1 Kategori champion for that category in each represented Kabupaten/Kota.
- Province scope groups the corresponding champions from its Kabupaten/Kota.
- Kabupaten/Kota is the only geographic competition unit.
- Province is a grouping/navigation layer.
- Kecamatan, Kelurahan and Desa are not navigation, filter or competition levels.
- No maps, public map pins, location-dot backgrounds, coordinates as visual leaderboard objects or browser geolocation.

## Interface behavior

- Open the Indonesia regional champion list immediately; do not request device location.
- Keep a persistent DATA SIMULASI label while data is synthetic.
- Use compact scope tabs, position-type switch, category chips and concise location selectors.
- Show the fixed price Rp20.000 beside the Claim #1 action.
- Explain that each payment claims one position and the last confirmed payment becomes its current champion.
- The active action label is **Claim #1**, not Daftarkan UMKM or Sign up.
- Claim opens the claim form as part of the payment flow. Do not show standalone registration or manual-review messaging.
- A claim form must clearly identify whether the user is claiming #1 Wilayah or #1 Kategori.
- No public map, map search, pin, route, distance-based ranking or browser geolocation prompt.
- Desktop uses one centered board; mobile keeps the same information order in a single column without horizontal page overflow.

## Ranking and money

- Fixed price: Rp20.000 for one selected position.
- Current champion is the latest successfully confirmed payment for that exact position.
- Reclaiming after displacement costs Rp20.000 again.
- One payment cannot claim both the regional and category positions.
- Previous payments are historical records and never accumulate into ranking points.
- No outbid increment, bidding, auction, dynamic pricing or special champion price.
- No automatic daily, weekly or monthly rank reset.
- Clicks are secondary statistics and never influence position ownership.
- Relative ordering between different Kabupaten/Kota is not defined by the local claim rule. Do not invent a national ranking metric, cross-city rank numbers or podium until separately approved.

## Visual system

- Bright, airy canvas with pale mint, white, sky, peach and butter-yellow surfaces.
- Plus Jakarta Sans typography with friendly, rounded display headings and strong readable numeric hierarchy.
- Fresh green as the primary action/accent; coral, sky blue, lilac and warm yellow as supporting accents.
- Keep backgrounds light; do not use dark-mode surfaces or large dark panels.
- Use restrained borders, soft shadows and generous row spacing.
- Top 3 cards should not be displayed as a competitive podium until its ordering rule is approved.
- Mobile rows preserve readable names, location and the fixed price without horizontal page overflow.

## Demo integrity

The current preview is still the earlier leaderboard/foundation prototype. Its generated businesses and sample values are synthetic; it does not yet implement the two approved position types end to end. DATA SIMULASI must remain visible. These are not real UMKM, paid claims, transactions, traffic or verified rankings. Claim #1 and real payment actions stay disabled until the claim-first flow and payment verification are implemented and tested.