# Product Requirements — KenalanUMKM

**Market:** Indonesia only · **Domain:** https://kenalanumkm.biz.id

## Product

KenalanUMKM is an Indonesia-only pay-to-rank platform for real, location-based UMKM. A business claims a specific #1 position in its Kabupaten/Kota by completing the Claim #1 flow and paying the fixed price. The concept takes inspiration from the clarity and competitive simplicity of Outbid.lol, but KenalanUMKM uses its own rules for Indonesia.

This is not a conventional business directory with a signup queue, editorial ranking or manual approval process.

## Non-negotiable product principles

1. Indonesia-only. Every competing UMKM has a physical business location in one Kabupaten/Kota.
2. There are two separate #1 position types in each Kabupaten/Kota:
   - **#1 Wilayah:** one overall champion for the city/regency, across all business categories.
   - **#1 Kategori:** one champion for each category within that same city/regency.
3. The overall position and category positions are independent. Winning one does not automatically grant the other.
4. One confirmed payment of **Rp20.000** claims one selected position. The price is fixed and equal for every city, category, challenger and previous champion.
5. The latest successfully confirmed payment for a position becomes its current champion. Previous payments do not accumulate into ranking points.
6. A champion who loses the position may claim it again by paying Rp20.000 again.
7. Province and Indonesia are leaderboard aggregation/navigation scopes, not additional claimable competition units.
8. Clicks are secondary statistics only. They never determine or change rank.
9. A Claim is part of the payment flow. There is no separate signup/registration, no manual listing review and no approval queue.
10. Financial and champion changes must be auditable.

## Geography and leaderboard hierarchy

Indonesia → Province → Kabupaten/Kota → Position type → Leaderboard.

- Kabupaten/Kota is the only geographic competition unit.
- Province groups its Kabupaten/Kota champions.
- The Indonesia regional board shows the Top 20 #1 Wilayah champions, one per represented Kabupaten/Kota.
- Category boards show the #1 Kategori champion for the selected category in each Kabupaten/Kota.
- A city/regency view can show its #1 Wilayah champion and its category champions.
- Kecamatan, Kelurahan and Desa are never competition, filter or navigation levels.
- No map, map pins, public coordinates, browser geolocation or map-based leaderboard is part of the product.

Physical address details may be collected when needed for business context or operational verification, but do not turn them into a map experience or a lower-level competition hierarchy.

## Claim #1 experience

1. Visitor chooses a Kabupaten/Kota.
2. Visitor chooses the target position: #1 Wilayah or #1 Kategori. A category must also be selected for a category claim.
3. Visitor fills in the UMKM profile as part of that claim: business name, category, short description, location, avatar and relevant public links/contact details.
4. The server creates the claim and payment intent for exactly Rp20.000.
5. The visitor pays using the enabled payment instructions.
6. The server verifies a trusted payment confirmation. Only then does the selected position change and the profile become publicly live.
7. There is no standalone account signup and no manual review stage.

A single Rp20.000 payment applies to one selected position. Claiming both #1 Wilayah and #1 Kategori requires two separate claims and payments. Reclaiming a position also costs Rp20.000.

## Ranking and payment rules

- Price: Rp20.000 per successful claim of one position.
- No outbid increment, minimum increase, auction, bid, variable price or special price for the current champion.
- The current champion is the business associated with the latest successfully confirmed payment for that exact position.
- A pending, failed, expired or client-reported payment never changes the champion.
- A verified payment is applied once only. Duplicate provider events cannot create duplicate claims.
- The previous champion remains the champion until another valid payment is confirmed.
- No automatic daily, weekly or monthly reset is part of the current ranking rules.
- Historical payments and champion changes remain auditable, but old payment totals do not affect the current champion.
- Clicks do not affect eligibility, price or rank.

## Out of scope

Maps and map-based discovery; browser/device geolocation; Kecamatan/Kelurahan/Desa competitions; signup-first registration; manual listing review or editorial approval; auctions and variable bids; cumulative paid-stake ranking; daily/weekly/monthly rank resets; reviews, ratings and voting; generic directory as the primary experience; marketplace checkout; booking, POS, CRM, inventory or delivery; pay-per-lead; subscription-led monetization; territory ownership; prizes or payouts to leaderboard winners; virtual listings.

## MVP direction

Keep the public experience leaderboard-first and clearly label all synthetic rows as DATA SIMULASI. Build two explicitly distinct leaderboard modes: regional overall champions and category champions. Keep Claim #1 disabled in the preview until the claim-first flow and payment confirmation are implemented and tested end to end. Do not show a fake live payment or real champion.

## Success criteria

Visitors can distinguish #1 Wilayah from #1 Kategori; understand that each costs Rp20.000 per claim; see that the latest confirmed payment determines the current holder; understand that claim details are submitted inside the claim flow; and never encounter a map, signup-first process or manual-review promise.