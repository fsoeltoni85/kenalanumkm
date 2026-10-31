# App Flow

## Information architecture
Public: Home/Leaderboard board → Province map navigation → Kabupaten/Kota → Category leaderboard → UMKM detail.
Future owner area: dashboard, listing management, ownership verification, stake/payment history.
Future admin area: listing review, geography/category management, payment reconciliation and audit.

## Explore
1. Open home; the current competition board is immediately visible.
2. Select province from the interactive Indonesia map or province selector.
3. Select Kabupaten/Kota.
4. Select a category.
5. Show the leaderboard for that Kabupaten/Kota + category.
6. Open a real physical business listing.

## Leaderboard
Keep it immediately understandable and dominant on the page:
- Period tabs: **All Time**, **Hari Ini**, **Harian** (date archive).
- All Time ranks by cumulative confirmed stake.
- Hari Ini shows the current day's confirmed stake.
- Harian lets visitors open a past calendar-day board.
- The selected date is visible only while the Harian archive is selected.
- Each row shows rank, business identity, stake total and click count.
- Clicks are secondary metadata; they never affect ranking.
- Total stake shown above the rows is the sum of the visible sample/real rows for the current selection, not a nationwide amount.
- Top three positions receive distinct, lightweight visual emphasis.
- Weekly/monthly boards are not part of the current reference-aligned MVP.

The reference products use UTC day boundaries for their daily boards. KenalanUMKM's production timezone/cutoff policy is not yet approved; the current preview period values are illustrative UI data only.

## Demo data
Leaderboard preview rows may use clearly labelled synthetic examples so the density, ordering and period switching can be reviewed. The label must remain visible. Never present them as actual registered businesses, payments, clicks or live rankings. Production empty state is used when no real listing/stake data exists.

## Business detail
Show name, category, province/city, physical address and pin, supplied description/contact links, rank, cumulative confirmed stake and click count. Do not invent hours, photos, verification or contact details. Stake action stays disabled until payment rules and disclosures are finalized.

## Stake/payment (future, not enabled)
Create pending payment intent server-side → show transfer instructions → receive provider event → verify account/amount/reference/currency/freshness/duplicate → append ledger entry exactly once → update derived total/rank → show status. Client never writes rank or ledger. Do not implement until minimums, expiry, fees, refund, tie-break, outbid and provider permission are approved.

## Owner claim (future)
Sign in → find/propose physical listing → submit claim → verification/review → record decision/audit → grant only approved listing permissions. Do not invent verification methods or auto-verify.

## States
Every route needs loading, empty, recoverable error/retry, invalid location, mobile layout and map-failure fallback. If map tiles fail, the leaderboard/list must remain usable.
