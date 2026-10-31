# App Flow

## Information architecture

Public: Indonesia Top 20 city-champion leaderboard → Province → Kabupaten/Kota → Category → future UMKM detail.

Future owner area: dashboard, listing management, ownership verification and stake/payment history.
Future admin area: listing review, geography/category management, payment reconciliation and audit.

## Initial visit

1. Open the leaderboard immediately on the Indonesia scope.
2. Do not request browser location permission.
3. Keep the DATA SIMULASI label visible while the preview uses synthetic names, stake and clicks.
4. Show the rules plainly: one champion per city; confirmed stake determines rank; clicks are statistics only.

## Explore and leaderboard scopes

The public experience has three scopes:
- **Indonesia** — national Top 20 city champions, one representative per Kabupaten/Kota.
- **Provinsi** — the city champions in the selected province, ordered by their stake.
- **Kab/Kota** — exactly one champion for the selected city/regency, with its national rank visible.

Province is navigation/grouping only. No map is used in the public experience. Kecamatan, Kelurahan and Desa are not exposed as filters or navigation levels.

Selecting a province opens its province board and resets the selected city. Selecting a city opens the single-champion city board. Returning to Indonesia restores the national board. Search only filters the currently displayed board; it never changes rank.

## Categories and periods

- Category pills filter the champion set.
- **All Time** ranks by cumulative confirmed stake.
- **Hari Ini** ranks by current-day confirmed stake.
- **Harian** ranks by confirmed stake for the selected calendar date.
- Click counts are shown as secondary metadata and never influence rank.
- The national rank for a city champion is computed from the full national set for the same category and period.

Daily timezone/day cutoff remains subject to approval. Weekly/monthly boards are not part of the current MVP.

## Top ranks and list hierarchy

- Indonesia and province boards present ranks 1–3 in a dedicated podium.
- Rank 1 uses a light gold treatment, rank 2 a light sky/silver treatment, and rank 3 a light peach/bronze treatment.
- The remaining ranks stay in a neutral scannable list.
- Business name and stake are the strongest row signals; city and national rank are supporting metadata; clicks are muted secondary statistics.
- City scope features exactly one local champion and displays its national rank.

## Registration CTA (preview only)

1. Clicking **Daftarkan UMKM** opens an informational dialog titled “Saatnya usaha lo ikut dikenal.”
2. The dialog shows a conceptual sequence: introduce the business, choose category and Kabupaten/Kota, data review, and eventual appearance on the city board.
3. The dialog explicitly says registration is not open, the preview is not an active form, no data is submitted, and no payment is taken.
4. The dialog can be closed with its close button or Escape.
5. Do not implement a real registration form, data collection, verification requirements or payment until their rules and fields are separately approved.

## Demo data

Preview rows are generated synthetic city champions so that the scopes, categories, periods and leaderboard density can be reviewed. The DATA SIMULASI label stays visible. Demo city/business pairings, stake and click counts are not real registered businesses, payments, traffic or live rankings.

The sample set currently represents 20 cities to demonstrate the interaction. Provinces without sample city champions show an explicit empty state. Do not invent additional real-looking locations to fill the board.

## Participation and payment

Registration preview is informational only. Real registration and participation remain inactive until ownership/claim, minimum stake, tie-break, payment, expiry, fee and refund rules are approved. Do not implement a pay-to-rank checkout or import Outbid.lol's payment mechanics.

## Future business detail

Show only verified business name, category, Kabupaten/Kota, province, physical address, supplied description/contact links, current rank, confirmed stake and click count. Do not invent hours, photos, verification or contact details.

## Future stake/payment (not enabled)

Create pending payment intent server-side → show transfer instructions → receive provider event → verify account/amount/reference/currency/freshness/duplicate → append ledger entry exactly once → update derived total/rank → show status. Client never writes rank or ledger. Do not implement until minimums, expiry, fees, refund, tie-break and provider permission are approved.
