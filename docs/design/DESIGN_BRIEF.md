# Design Brief — KenalanUMKM

## Product experience

KenalanUMKM is an Indonesia-only public competition for UMKM city champions. The public interface is a bright, compact, leaderboard-first experience inspired by the clarity of Outbid.lol, while keeping KenalanUMKM's own geography and ranking rules. It is not a map, a directory or a corporate analytics dashboard.

## Primary visual hierarchy

1. The competition headline and one-city-one-champion explanation.
2. Three scopes: Indonesia, selected province and selected Kabupaten/Kota.
3. Category controls and All Time / Hari Ini / Harian period controls.
4. A celebratory Top 3 podium on Indonesia/province boards; one featured city champion on city scope.
5. A scannable list for the remaining ranks.
6. Stake as the primary numeric signal; clicks are secondary metadata.

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
- Use compact scope tabs, selectors, horizontally scrollable category chips and clear period controls.
- The Top 3 use distinct light gold, sky/silver and peach/bronze podium cards; do not change their rank or stake values.
- Other ranks remain neutral and easy to scan. Business name and stake are visually prominent; city and national rank are supporting metadata; clicks remain muted.
- Search filters the visible list only; it does not recalculate or alter ranking.
- The active “Daftarkan UMKM” CTA opens an informational registration-flow preview. It does not collect user data, submit a registration or initiate payment. Label the preview as not yet open.
- Desktop uses one centered board; mobile keeps the same information order in a single column without horizontal page overflow.
- The registration dialog is dismissible by close button and Escape.

## Ranking and money

Stake is the sole ranking metric. Clicks are secondary statistics only. Do not imply votes, reviews, ratings, editorial scoring, popularity or prizes. Do not invent minimum stake, outbid increment, tie-break, expiry, refunds, fees or payment terms. The KenalanUMKM experience does not adopt Outbid.lol's payment flow.

## Visual system

- Bright, airy canvas with pale mint, white, sky, peach and butter-yellow surfaces.
- Plus Jakarta Sans typography with friendly, rounded display headings and strong readable numeric hierarchy.
- Fresh green as the primary action/accent; coral, sky blue, lilac and warm yellow as supporting accents.
- Keep backgrounds light; do not use dark-mode surfaces or large dark panels.
- Use restrained borders, soft shadows and generous row spacing.
- Top 3 cards should feel celebratory without using heavy dark gradients or altering ranking semantics.
- Mobile rows preserve readable names, location and stake without horizontal page overflow.

## Demo integrity

The preview uses generated synthetic business names, stake and click values. DATA SIMULASI must remain visible. These are not real UMKM, payments, traffic or verified rankings. Registration and participation remain inactive until product and payment rules are approved.
