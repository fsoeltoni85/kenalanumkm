# Product Requirements — KenalanUMKM

**Market:** Indonesia only · **Domain:** https://kenalanumkm.biz.id

## Product

KenalanUMKM is an Indonesia-only public leaderboard of UMKM city champions. The experience is a clear, competition-led ranking board. It takes inspiration from the simple presentation of Outbid.lol, but keeps KenalanUMKM's own ranking rules and Indonesian geography.

## Non-negotiable principles

1. Indonesia-only businesses and geography.
2. Every listing represents a real UMKM with a fixed physical location.
3. Each Kabupaten/Kota contributes exactly one champion per category and selected period: the business with the highest confirmed stake in that city.
4. The Indonesia board ranks city champions nationally by confirmed stake.
5. Province is a grouping/navigation layer, not a competition unit.
6. City scope shows one local champion and its national rank. Province scope lists its city champions. Indonesia scope lists the national Top 20 city champions.
7. Clicks are statistics only and never affect rank.
8. Financial changes must be auditable.

## Geography

Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.

Kecamatan, Kelurahan and Desa must not become navigation, filter, leaderboard or competition levels. Full physical address and coordinates may remain in listing data for later verification and operational purposes, but they are not displayed as map pins and are not used to infer a city champion in the public UI.

## Core experiences

- Open the Indonesia Top 20 city-champion board immediately.
- Switch between Indonesia, a selected province, and a selected Kabupaten/Kota.
- Select a category and a period: All Time, Hari Ini or a date-based Harian archive.
- See the one city champion for each represented city, its confirmed stake, rank and click count.
- Search the visible board by UMKM name or city.
- Open a future UMKM detail page when that route is implemented.
- Future: owner listing claim, verification, stake top-up and payment reconciliation after rules are approved.

## Ranking and money

Confirmed stake is the only ranking metric. All Time uses cumulative confirmed stake; Hari Ini and Harian use confirmed stake in their respective period. The national board ranks the city champion for the selected category/period. Province scope filters that same set of city champions to one province; city scope returns exactly one local champion.

Backend ledger is authoritative. Use append-only events; reversals are compensating entries, not history edits. Tie-breaking, minimum top-up, outbid increment, expiry, refunds, fees and claim mechanics are not yet specified. Do not implement assumptions until a separate rules document is approved.

The model is competitive placement, not a prize or payout to a leaderboard winner. The interface must not imply that clicks, reviews, ratings or votes alter the rank.

## Out of scope

Maps and map-based discovery in the public experience; subdistrict-level competition; generic business directory as the primary product; reviews/ratings/voting; marketplace; booking, POS, CRM, inventory or delivery; pay-per-lead; subscription-led monetization; territory ownership; rewards/payouts to winners; virtual listings.

## MVP

First milestone: responsive leaderboard-first shell, Indonesia/province/city scopes, category selection, All Time/Hari Ini/Harian views, Top 20 city champions and clearly labelled simulated data. No claim that sample data, payments, backend ranking or participation are live.

## Success criteria

Visitors understand that every city has one champion; national positions are ordered by confirmed stake; a province board contains only its city champions; a city board contains exactly one champion; and click totals are clearly secondary.
