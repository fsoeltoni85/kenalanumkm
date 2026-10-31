# Design Brief — KenalanUMKM

## Product experience
KenalanUMKM is a map-first public competition for real, fixed-location Indonesian UMKM. The map is the main way visitors explore Indonesia; the leaderboard is the competitive mechanic. Do not turn the experience into a generic business directory, CRM, review site or a decorative dashboard.

## Primary visual hierarchy
1. A real Indonesia map occupies the main canvas.
2. Province selection is the map's navigation/grouping interaction.
3. The selected Kabupaten/Kota and category define the leaderboard.
4. The leaderboard is a compact, scannable ranked list.
5. Business detail is a separate drill-down showing the fixed physical location and business identity.

## Geography and competition
Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.
- Province is a navigation/grouping layer, not a competition unit.
- The competition unit is Kabupaten/Kota + category.
- Kecamatan, Kelurahan and Desa must not appear as competition levels or filters.
- A listing represents a real fixed physical UMKM location. Exact address and coordinates are for pin placement/geocoding only.
- Businesses in different subdistricts but in the same Kabupaten/Kota and category compete on the same board.

## Leaderboard interaction and layout
Reference pattern: WorldMap.lol makes the location and current stake leader immediately visible; outbid.lol uses a compact period switch, dense ranking rows, top-three emphasis and an understated secondary activity metric.

KenalanUMKM preview uses three views:
- **All Time** — cumulative confirmed stake.
- **Hari Ini** — current-day stake.
- **Harian** — a selectable calendar-day archive.

Leaderboard rows show rank, business name, stake and clicks. Use tabular numbers, right-aligned stake, thin row separators, subtle top-three tint and a small demo badge. Keep the controls close to the heading; do not add paragraphs explaining obvious UI or cards describing how the leaderboard works. Clicks never affect rank.

Do not add weekly/monthly periods in this iteration; they are not present in the two reference patterns. The timezone/day cutoff for production must be approved separately. Reference sites use UTC boundaries; preview values are illustrative only.

## Ranking and money
- Ranking is determined only by cumulative confirmed stake for All Time.
- Hari Ini and Harian show stake within their corresponding period.
- Clicks are statistics only and never affect rank.
- Do not imply voting, reviews, stars, editorial scoring, popularity or a winner prize.
- Do not invent minimums, outbid increments, tie-breaks, expiry, refunds or payment terms; those rules remain pending approval.

## Homepage layout
- Compact navigation.
- Large interactive Indonesia map.
- Compact province and Kabupaten/Kota selectors.
- Leaderboard beside the map on desktop and below it on mobile.
- Category pills and period tabs directly above the ranked rows.
- Keep wording sparse; the map, category, selected period and ranked rows should explain the product.

## Map implementation
The current preview uses a GeoJSON outline/fill of Indonesia's 38 provinces with MapLibre GL JS, without third-party raster tiles. Province polygons are selectable. When WebGL is unavailable, the same GeoJSON is rendered as an interactive SVG fallback with selectable province shapes.
Dataset: denyherianto/indonesia-geojson-topojson-maps-with-38-provinces, GeoJSON file under CC BY 4.0. Attribution and license must remain visible. Upstream provenance/terms must be reviewed before production use. This geographic dataset does not provide Kabupaten/Kota competition polygons or business locations.

## Demo integrity
The current visual preview uses synthetic sample rows so period tabs and leaderboard density can be reviewed. The badge "Data simulasi" must remain visible. Sample names, stake and clicks are not real businesses, payments or traffic. Never display fabricated live UMKM counts, verified badges, addresses or payment details.

## Responsive design
Desktop: map occupies the main area with the selected city/category leaderboard in a right-side panel. Mobile: map remains first and full-width; controls and leaderboard follow in a compact panel. Provide accessible controls and keyboard-operable selects.

## Visual system
Bright, clean, local and confident. Deep green accent, light neutral canvas, soft sea background, white surfaces, strong charcoal type, restrained shadows and thin borders. Top three rows may use a light green wash. Avoid generic SaaS gradients, oversized marketing panels and explanatory callout cards.
