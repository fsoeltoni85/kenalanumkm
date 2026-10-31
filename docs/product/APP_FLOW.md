# App Flow

## Information architecture
Public: Home/Indonesia map → Province grouping → Kabupaten/Kota → Category leaderboard → UMKM detail; About/How it works; Sign in/up.
Future owner area: dashboard, listing management, ownership verification, stake/payment history.
Future admin area: listing review, geography/category management, payment reconciliation and audit.

## Explore
1. Open home; Indonesia map is dominant.
2. Search province, Kabupaten/Kota, business name or category.
3. Select province as navigation/grouping.
4. Select Kabupaten/Kota.
5. Select category.
6. Show leaderboard scoped to city/regency + category, optionally with same listings pinned on map.
7. Open a listing detail.

## Leaderboard
Resolve city/regency + category; order by cumulative confirmed stake; show rank, business, category/location context, total stake, clicks and detail link. Support map/list switch and pagination. Clicks never affect rank.

## Business detail
Show name, category, province/city, physical address and pin, supplied description/contact links, rank, cumulative confirmed stake and click count. Do not invent hours, photos, verification or contact details. Stake action stays disabled until payment rules and disclosures are finalized.

## Stake/payment (future, not enabled)
Create pending payment intent server-side → show transfer instructions → receive provider event → verify account/amount/reference/currency/freshness/duplicate → append ledger entry exactly once → update derived total/rank → show status. Client never writes rank or ledger. Do not implement until minimums, expiry, fees, refund, tie-break, outbid and provider permission are approved.

## Owner claim (future)
Sign in → find/propose physical listing → submit claim → verification/review → record decision/audit → grant only approved listing permissions. Do not invent verification methods or auto-verify.

## States
Every route needs loading, empty, recoverable error/retry, invalid location, mobile layout, and map-failure fallback. If map tiles fail, search and leaderboard/list must remain usable.
