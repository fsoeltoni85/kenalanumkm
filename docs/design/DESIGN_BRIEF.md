# Design Brief — KenalanUMKM

## Product experience

KenalanUMKM is an Indonesia-only public competition for UMKM city champions. The public interface is a leaderboard-first experience inspired by the clarity and compactness of Outbid.lol. It is not a map, a directory or a corporate analytics dashboard.

## Primary visual hierarchy

1. The competition headline and a short explanation of the one-city-one-champion rule.
2. Three scopes: Indonesia, selected province and selected Kabupaten/Kota.
3. Category controls and All Time / Hari Ini / Harian period controls.
4. A clear current leader/spotlight and a scannable Top 20 city-champion list.
5. Stake as the primary number; clicks as secondary metadata.

## Geography and competition

Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.
- Province is a grouping/navigation layer, not a competition unit.
- Each Kabupaten/Kota contributes one #1 champion per category and selected period.
- Indonesia ranks those city champions nationally by confirmed stake.
- Province scope lists only the champions from that province.
- City scope shows exactly one local champion and its national rank.
- Kecamatan, Kelurahan and Desa are not filters or competition levels.

## Interface behavior

- Open the Indonesia Top 20 immediately; do not request device location.
- Keep a persistent DATA SIMULASI badge while content is synthetic.
- Use compact scope tabs, selectors, horizontally scrollable category chips and simple period controls.
- Show a leader spotlight with city/province and stake, followed by rows with rank, business name, city/province, stake and clicks.
- Search filters the visible list only; it does not recalculate or alter ranking.
- Use a lightweight top-three treatment; the other positions should be neutral and easy to scan.
- The participation CTA remains visibly disabled until rules are approved.
- Desktop uses one centered board; mobile keeps the same order in a single column without a map panel.

## Ranking and money

Stake is the sole ranking metric. Clicks are secondary statistics only. Do not imply votes, reviews, ratings, editorial scoring, popularity or prizes. Do not invent minimum stake, outbid increment, tie-break, expiry, refunds, fees or payment terms. The KenalanUMKM experience does not adopt Outbid.lol's payment flow.

## Visual system

- Warm off-white canvas, orange competition accent, charcoal text and restrained neutral surfaces.
- Playful but restrained badges, compact typography, clear numeric alignment and generous readable row height.
- Use a single primary board surface with thin dividers; avoid excessive cards or dashboard KPI grids.
- Top three receive subtle medal/tint treatment; later ranks remain compact and scannable.
- Mobile rows preserve readable names, location and stake without horizontal page overflow.

## Demo integrity

The preview uses generated synthetic business names, stake and click values. DATA SIMULASI must remain visible. These are not real UMKM, payments, traffic or verified rankings. Keep participation disabled until stake/payment rules are approved.
