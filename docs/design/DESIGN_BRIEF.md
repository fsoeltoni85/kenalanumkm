# Design Brief — KenalanUMKM

## Product experience
KenalanUMKM is a public competition board for real, fixed-location Indonesian UMKM. The leaderboard is the product and the main visual surface: visitors should immediately see the selected city, the current ranking and the stake behind each position. The Indonesia map is the geographic way to move between competition areas, not a decorative hero or a larger competing panel.

## Primary visual hierarchy
1. Selected Kabupaten/Kota and category.
2. The board's total stake, period tabs and ranked UMKM rows.
3. Top-three positions, with stake values visually dominant.
4. Indonesia province map as a compact, interactive area selector.
5. Click counts as secondary information only.

The page must feel like a playful public scoreboard, not a corporate SaaS dashboard, company website, marketplace or business directory.

## Geography and competition
Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.
- Province is a navigation/grouping layer, not a competition unit.
- The competition unit is Kabupaten/Kota + category.
- Kecamatan, Kelurahan and Desa must not appear as competition levels or filters.
- A listing represents a real fixed physical UMKM location. Exact address and coordinates are for pin placement/geocoding only.
- Businesses in different subdistricts but in the same Kabupaten/Kota and category compete on the same board.

## Leaderboard interaction and layout
Reference patterns: Outbid.lol treats price and rank as the headline, exposes the leaderboard immediately, uses playful pills, top-three emphasis and public click counts. WorldMap.lol makes geographic competition legible through a map.

KenalanUMKM preview uses three views:
- **All Time** — cumulative confirmed stake.
- **Hari Ini** — current-day stake.
- **Harian** — a selectable calendar-day archive.

Leaderboard rows show rank, business name, stake and clicks. Stake is the primary visual number and the sole ranking basis. Clicks are a smaller secondary metric and never affect rank. The board total is the sum of the visible rows in the selected city/category/period.

Keep the controls close to the board heading. Use dense rows, tabular numbers, playful top-three treatment, category pills, and compact activity/secondary-stat treatment. Do not add explanatory product paragraphs, feature cards or marketing hero copy.

Do not add weekly/monthly periods in this iteration; they are not present in the two reference patterns. The timezone/day cutoff for production must be approved separately. Reference sites use UTC boundaries; preview values are illustrative only.

## Ranking and money
- Ranking is determined only by cumulative confirmed stake for All Time.
- Hari Ini and Harian show stake within their corresponding period.
- Clicks are statistics only and never affect rank.
- Do not imply voting, reviews, stars, editorial scoring, popularity or a winner prize.
- Do not invent minimums, outbid increments, tie-breaks, expiry, refunds or payment terms; those rules remain pending approval.

## Homepage layout
- Thin playful header: wordmark, visible simulation label, one concise participation action.
- Compact location breadcrumb and Kabupaten/Kota selector.
- Desktop: wide leaderboard (roughly two-thirds of the main grid) beside a smaller interactive province map.
- Mobile: leaderboard appears first; map follows as a geographic exploration panel.
- Total stake summary is part of the board, not a marketing statistic.
- Category pills and All Time / Hari Ini / Harian controls sit directly above the rows.
- Top 3 use distinct soft tints/medal marks; later ranks remain dense and easy to scan.
- Warm off-white canvas, orange money/action accent, restrained supporting neutrals, quick hover feedback.
- Avoid corporate green dashboards, large explanatory panels, generic SaaS gradients and decorative illustrations.

## Map implementation
The current preview uses a GeoJSON outline/fill of Indonesia's 38 provinces with MapLibre GL JS, without third-party raster tiles. Province polygons are selectable. When WebGL is unavailable, the same GeoJSON is rendered as an interactive SVG fallback with selectable province shapes.
Dataset: denyherianto/indonesia-geojson-topojson-maps-with-38-provinces, GeoJSON file under CC BY 4.0. Attribution and license must remain visible. Upstream provenance/terms must be reviewed before production use. This geographic dataset does not provide Kabupaten/Kota competition polygons or business locations.

## Demo integrity
The current visual preview uses synthetic sample rows so the period tabs and leaderboard density can be reviewed. "Data simulasi" / "Contoh UI" must remain visible. The displayed board total is computed from the sample rows currently visible; it is not a national total. Sample names, stake and clicks are not real businesses, payments or traffic. Never display fabricated live UMKM counts, verified badges, addresses or payment details.

## Responsive design
Desktop: leaderboard is the dominant, wider panel and map is the smaller side panel. Mobile: leaderboard comes first and remains readable without horizontal scrolling; map follows. Provide accessible controls and keyboard-operable selects. If the map fails, the leaderboard remains usable.
