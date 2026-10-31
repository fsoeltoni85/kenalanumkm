# Design Brief — KenalanUMKM

## Product experience
KenalanUMKM is an Indonesia-only public competition for real, fixed-location UMKM. The interface pairs a prominent interactive map of Indonesia with a live-feeling geographic leaderboard. The map and the ranking board are co-primary: neither is a small decorative widget.

## Primary visual hierarchy
1. Large, immediately visible map of Indonesia and its 38 selectable provinces.
2. Prominent location context: the visitor's device location (only after browser permission) and selected province/city.
3. Three clear competition scopes: Indonesia, selected province, selected Kabupaten/Kota.
4. A Top 20 board for the currently selected scope.
5. Stake amounts as the primary metric; click counts as secondary.

The visual language is playful and competition-led, not a corporate SaaS dashboard, company website or generic business directory.

## Geography and competition
Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.
- Province is a navigation/grouping layer, not a competition unit.
- Competition scopes are Indonesia overall, one province, or one Kabupaten/Kota + category.
- Kecamatan, Kelurahan and Desa must not appear as competition levels or filters.
- A listing represents a real fixed physical UMKM location. Exact address and coordinates are for pin placement/geocoding only.
- Businesses in different subdistricts but in the same Kabupaten/Kota and category compete on the same board.

## Map and visitor location
- Keep the whole Indonesia map large and visible beside the leaderboard on desktop.
- On mobile, place the map above the leaderboard while keeping the location strip and three scope controls accessible.
- All 38 province shapes are selectable and the selected province receives strong orange emphasis.
- Request device location permission on the initial visit. When granted, show a distinct blue device marker on the map and identify the province by testing the point against the local province GeoJSON.
- Do not infer a city/regency from province-only boundaries. The visitor selects Kabupaten/Kota from the selector.
- If permission is denied or unavailable, retain manual province/city selection and offer a retry control.
- Coordinates remain in client-side state for map display in this prototype; do not send exact coordinates to a reverse-geocoding API or store them.
- The current GeoJSON contains province boundaries only. Do not draw fabricated city boundaries or UMKM pins.

## Leaderboard interaction and layout
The leaderboard provides three scope tabs:
- **Indonesia** — national Top 20.
- **Provinsi** — Top 20 in the selected province.
- **Kota/Kab** — Top 20 in the selected Kabupaten/Kota.

Each scope displays 20 ranked entries. Controls remain on the same board:
- Category pills.
- **All Time** — cumulative confirmed stake.
- **Hari Ini** — current-day stake.
- **Harian** — selectable calendar-day archive.

Rows show rank, business name, stake and clicks. Stake is the primary visual number and the sole ranking basis. Clicks are secondary and never affect rank. The board total is the sum of the rows displayed for the current selection.

Do not add weekly/monthly periods in this iteration. Production timezone/day cutoff must be approved separately. The period figures currently shown are illustrative UI data only.

## Ranking and money
- Ranking is determined only by cumulative confirmed stake for All Time.
- Hari Ini and Harian show stake within their corresponding period.
- Clicks are statistics only and never affect rank.
- Do not imply voting, reviews, stars, editorial scoring, popularity or a winner prize.
- Do not invent minimums, outbid increments, tie-breaks, expiry, refunds or payment terms; those rules remain pending approval.

## Visual system
- Warm off-white canvas, orange/peach competition accent, charcoal text and restrained neutral UI.
- Map ocean is light blue; provinces use warm pale fills; selected province uses orange; device location is marked with a distinct blue dot.
- Map and board share the main horizontal area at near-equal visual weight.
- Top 3 rows get medals and soft tints; later ranks stay compact and scannable.
- Use playful pills, short labels and minimal copy.
- On smaller screens the map comes first, followed by the board.
- Do not use large corporate marketing hero text, generic dashboard cards or long explanations.

## Demo integrity
The preview uses generated synthetic names, stake and click values to exercise 20-row lists and the three geographic scopes. The "Data simulasi" badge must remain visible. These are not real businesses, payments, click traffic, live rankings or national totals. Keep the participation action disabled until the stake and payment terms are approved.

## Map implementation
The preview uses a GeoJSON outline/fill for Indonesia's 38 provinces with MapLibre GL JS and an interactive SVG fallback when WebGL is unavailable. The user device pin is an overlay marker. The current dataset has provincial shapes only; it does not provide Kabupaten/Kota competition polygons or business locations.
Dataset: denyherianto/indonesia-geojson-topojson-maps-with-38-provinces, declared CC BY 4.0. Attribution/license must remain visible. Verify the upstream provenance and terms before production/commercial use. Do not present these polygons as authoritative legal boundaries.
