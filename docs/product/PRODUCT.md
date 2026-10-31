# Product Requirements — KenalanUMKM

**Market:** Indonesia only · **Domain:** https://kenalanumkm.biz.id

## Product
KenalanUMKM is a map-first discovery and geographic leaderboard for Indonesian UMKM with real, fixed physical business locations. Its core interaction model is inspired by WorldMap.lol and localized to Indonesia. The map is the primary interface, not a decorative header or ordinary directory.

## Non-negotiable principles
1. Indonesia-only geography and businesses.
2. Every listing represents a real physical business location; no fictional/virtual pins.
3. Province is a grouping/navigation layer.
4. Competition unit is Kabupaten/Kota only.
5. Leaderboard scope is Kabupaten/Kota + category.
6. Ranking is determined by cumulative confirmed stake, not reviews, stars, clicks, revenue, popularity, or an editorial score.
7. Public listing pages expose business information, rank/stake and click statistics.
8. Financial changes must be auditable.

## Geography
Hierarchy: Indonesia map → Province → Kabupaten/Kota → Category → Leaderboard.
Kecamatan, Kelurahan, and Desa must not become navigation, filter, leaderboard, or competition levels. Full address and coordinates are stored only for physical pin placement/geocoding. Businesses in the same city/regency and category compete together regardless of subdistrict.

## Core experiences
- Explore the Indonesia map.
- Search province, Kabupaten/Kota, business name or category.
- Select a city/regency and category to see its leaderboard.
- Open a physical business detail page.
- View current rank, cumulative confirmed stake, click count, address and owner-supplied contact links.
- Future: listing claim/ownership verification, owner dashboard, stake top-up and payment reconciliation, after rules are approved.

## Ranking and money
Cumulative confirmed stake is the only ranking metric. Backend ledger is authoritative. Use append-only events; reversals are compensating entries, not history edits. Tie-breaking, minimum top-up, outbid increment, expiry, refunds, fees and claim mechanics are not yet specified. Do not implement assumptions until the owner approves a separate rules document. The model is advertising placement, not prize/payout to a leaderboard winner.

Moota is only a candidate for bank mutation reconciliation. Do not enable production integration until commercial SaaS use is confirmed in writing and API/webhook scope, bank support, pricing and limits are verified.

## Out of scope
Global/world map; subdistrict-level competition; generic directory as primary product; Google Maps clone; reviews/ratings; booking, POS, CRM, inventory, delivery or marketplace; pay-per-lead; subscription-led monetization; territory ownership; rewards/payouts to winners; virtual listings.

## MVP
First milestone: responsive map-first shell, Indonesia-focused navigation, category selection, city/category leaderboard with clearly labelled sample data, and detail-page shell. No claim that sample data, live map tiles, payment or backend ranking are live.

## Success criteria
Visitors understand the map-first product; navigate Indonesia → province → Kabupaten/Kota → category; see correct city/category scope; every listing is a physical location; ranking is explainable from confirmed stake; financial changes are traceable.
