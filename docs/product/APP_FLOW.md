# App Flow

## Information architecture
Public: Indonesia map + Top 20 board → Province → Kabupaten/Kota → Category → UMKM detail.
Future owner area: dashboard, listing management, ownership verification, stake/payment history.
Future admin area: listing review, geography/category management, payment reconciliation and audit.

## Initial visit and location
1. Open the home page; show the Indonesia map and Indonesia Top 20 board immediately.
2. Request browser location permission to identify the visitor's approximate province and show a blue position marker on the map.
3. If permission is granted, match the point against the local 38-province GeoJSON and highlight the matching province.
4. If permission is denied/unavailable, keep manual province selection and provide a retry action.
5. Do not infer Kabupaten/Kota from provincial polygons; the visitor selects the city/regency.

Exact device coordinates stay in client-side state for map display in this prototype. They are not submitted to a reverse-geocoding provider or stored.

## Explore and leaderboard scopes
The page keeps the map and leaderboard prominent together. The leaderboard has three scopes, each with 20 rows:
- **Indonesia** — national Top 20.
- **Provinsi** — Top 20 for the selected province.
- **Kota/Kab** — Top 20 for the selected Kabupaten/Kota.

Map clicks select a province and switch to its board. The province and city/regency selectors remain available. Select a city/regency to open its board.

## Leaderboard
- Period tabs: **All Time**, **Hari Ini**, **Harian** (date archive).
- All Time ranks by cumulative confirmed stake.
- Hari Ini shows current-day confirmed stake.
- Harian opens a past calendar-day board.
- Each row shows rank, business identity, stake and click count.
- Clicks are secondary metadata; they never affect ranking.
- The total shown above the rows is the sum for the selected displayed board, not a nationwide amount unless Indonesia scope is active.
- Top three receive a lightweight medal/tint treatment.
- Weekly/monthly boards are not part of the current MVP.

Daily timezone/day cutoff remains subject to approval. All preview amounts, names and clicks are synthetic UI data.

## Demo data
Preview rows are generated synthetic entries to verify the three scopes, categories, periods and 20-row density. The "Data simulasi" label stays visible. Never present these as real registered businesses, payments, traffic or live rankings. Production empty states should use actual data only.

## Business detail
Show name, category, province/city, physical address and pin, supplied description/contact links, rank, cumulative confirmed stake and click count. Do not invent hours, photos, verification or contact details. Stake action remains disabled until payment rules and disclosures are finalized.

## Stake/payment (future, not enabled)
Create pending payment intent server-side → show transfer instructions → receive provider event → verify account/amount/reference/currency/freshness/duplicate → append ledger entry exactly once → update derived total/rank → show status. Client never writes rank or ledger. Do not implement until minimums, expiry, fees, refund, tie-break, outbid and provider permission are approved.

## Owner claim (future)
Sign in → find/propose physical listing → submit claim → verification/review → record decision/audit → grant only approved listing permissions. Do not invent verification methods or auto-verify.
