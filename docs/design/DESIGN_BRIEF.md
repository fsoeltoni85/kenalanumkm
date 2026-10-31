# Design Brief — KenalanUMKM

## Product experience
KenalanUMKM is a map-first public competition for real, fixed-location Indonesian UMKM. The map is the main way visitors explore Indonesia; the leaderboard is the competitive mechanic. Do not turn the experience into a generic business directory, CRM, review site or a decorative dashboard.

## Primary visual hierarchy
1. A real Indonesia map occupies the main canvas and remains the dominant element on desktop and mobile.
2. Province selection is the map's navigation/grouping interaction.
3. The selected Kabupaten/Kota and category define the leaderboard shown beside or below the map.
4. Each leaderboard row, when real listing data exists, presents the business identity, rank, cumulative confirmed stake and click statistics.
5. Business detail is a separate drill-down showing the fixed physical location and business identity.

## Geography and competition
Information hierarchy: Indonesia → Province → Kabupaten/Kota → Category → Leaderboard.
- Province is a navigation/grouping layer, not a competition unit.
- The competition unit is Kabupaten/Kota + category.
- Kecamatan, Kelurahan and Desa must not appear as competition levels or filters.
- A listing represents a real fixed physical UMKM location. Exact address and coordinates are for pin placement/geocoding only.
- Businesses in different subdistricts but in the same Kabupaten/Kota and category compete on the same board.

## Ranking communication
- Ranking is determined only by cumulative confirmed stake.
- Clicks are visible statistics and never affect rank.
- Do not imply voting, reviews, stars, editorial scoring, popularity or a winner prize.
- Do not invent minimums, outbid increments, tie-breaks, expiry, refunds or payment terms; those rules remain pending approval.

## Homepage layout
- Compact navigation and clear product statement: “Peta kompetisi UMKM Indonesia”.
- Large interactive Indonesia map as the primary surface.
- Province selection/search and selected province context.
- A focused panel showing Kabupaten/Kota, category and the matching leaderboard.
- An honest empty state when there is no real participant data.
- Short explanation of how rank works and a clearly secondary owner-registration entry point.

## Map implementation
The current preview uses a GeoJSON outline/fill of Indonesia's 38 provinces with MapLibre GL JS, without third-party raster tiles. Province polygons are selectable. It intentionally does not show fabricated business pins or fabricated ranking amounts.
Dataset: denyherianto/indonesia-geojson-topojson-maps-with-38-provinces, GeoJSON file under CC BY 4.0. Attribution and license must remain visible. Upstream provenance/terms must be reviewed before production use. This geographic dataset does not provide Kabupaten/Kota competition polygons or business locations.

## Demo integrity
The preview must be clearly labelled as a prototype. City selector options are illustrative only. Do not display invented live UMKM counts, active listings, stake totals, clicks, verified badges, addresses, or payment details. Empty ranking states are preferred to fake financial data.

## Responsive design
Desktop: map dominates with the selected city/category leaderboard in a right-side panel. Mobile: map remains first and full-width; filters and leaderboard follow in a scrollable panel. Provide accessible controls and keyboard-operable selects.

## Visual system
Bright, clean, local, confident. Deep green accents, light neutral canvas, soft sea background, white surfaces, strong charcoal type, restrained shadows and thin borders. Avoid generic SaaS gradients, generic map-illustration blobs and oversized marketing panels.
