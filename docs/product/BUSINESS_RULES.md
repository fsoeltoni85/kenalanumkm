# Business Rules — KenalanUMKM

**Status:** Approved product rules  
**Market:** Indonesia only  
**Fixed claim price:** Rp20.000

This document is the source of truth for claim, pricing, champion ownership and leaderboard behavior. Product, UI, API, database, payment and operational changes must follow it.

## 1. Competition unit

The only geographic competition unit is Kabupaten/Kota. The same rules apply across Indonesia.

Each Kabupaten/Kota has two kinds of claimable #1 position:

### #1 Wilayah

One overall champion for the Kabupaten/Kota, competing across all business categories.

### #1 Kategori

One champion per category within the same Kabupaten/Kota. Each category is its own independent position.

The two position types do not imply each other. A business that wins #1 Kategori does not automatically become #1 Wilayah, and the reverse is also true. A business may hold both positions, but each position must be claimed separately.

Province and Indonesia are display, grouping and navigation scopes. They are not additional claimable positions.

## 2. Fixed price

Every successful claim costs exactly **Rp20.000**.

The price is the same in every Kabupaten/Kota, for #1 Wilayah and #1 Kategori, for a first-time challenger and for a previous champion reclaiming the position.

One payment applies to one selected position. A claim for #1 Wilayah and a claim for a category position are separate transactions. A single payment must never activate two positions.

There is no outbid increment or minimum increase, auction, bidding, offer calculation, dynamic pricing based on the previous payment, special price for the current champion, or cumulative stake score used to determine the champion.

## 3. Champion replacement rule

The current champion of a position is the business attached to the latest successfully confirmed payment for that exact position.

Example for one position:

| Confirmed event | Current champion |
|---|---|
| A pays Rp20.000 | A |
| B pays Rp20.000 | B |
| A pays Rp20.000 again | A |
| C pays Rp20.000 | C |
| B pays Rp20.000 again | B |

The same sequence applies independently to a #1 Wilayah position or a #1 Kategori position.

The current champion keeps the position until a later valid claim payment is confirmed. A previous champion has no priority and must pay Rp20.000 again to reclaim the position.

## 4. What counts as a successful claim

Only a payment confirmation validated by the server from the configured payment provider can change a champion.

A claim form submission, payment instruction display, screenshot, browser callback, user assertion or pending transfer is not proof of payment.

Before applying a payment, the backend must validate provider identity and trusted event authenticity, transaction/reference identity, receiving account or destination configured for the claim, exact amount Rp20.000, expected currency IDR, relation to the pending claim/payment intent, event freshness and duplicate status.

The provider adapter and exact validation method must follow the provider's current official documentation and approved account configuration. Moota is a candidate integration, not an automatically approved production dependency.

## 5. Atomicity and duplicate protection

A verified payment must have one atomic effect:
1. mark the related payment as paid;
2. record the provider event and immutable payment history;
3. attach the claiming business to the selected position as current champion;
4. record the champion transition;
5. make the profile publicly live, if this is its first successful claim.

The transaction must be idempotent. Replaying the same provider event cannot charge, record or apply the claim a second time.

Claims for the same position arriving near-simultaneously must be serialized by the database. The champion is the latest payment confirmation successfully committed for that position. One position cannot have two current champions.

A pending or failed later payment does not displace the current champion.

## 6. Claim flow — no standalone registration

There is no separate signup or registration step before Claim #1.

1. User clicks Claim #1.
2. User chooses Kabupaten/Kota.
3. User chooses #1 Wilayah or #1 Kategori; category is required for a category claim.
4. User fills in the UMKM profile.
5. Backend creates a claim and payment intent for Rp20.000.
6. User follows payment instructions.
7. Trusted provider confirmation is verified server-side.
8. The profile becomes live and the selected #1 position changes immediately.

There is no manual review, editorial approval, moderation queue or pending-review publication gate in this flow.

The first claim flow does not require a standalone account. Any future profile editing/owner recovery mechanism must be designed separately and must not introduce signup or manual review into the initial claim path.

## 7. Leaderboard display rules

- Every Kabupaten/Kota has at most one current #1 Wilayah champion.
- Every Kabupaten/Kota/category combination has at most one current #1 Kategori champion.
- The Indonesia Top 20 is a display of current #1 Wilayah champions, one per represented Kabupaten/Kota.
- A selected-category board displays the #1 Kategori champion for that category in each represented Kabupaten/Kota.
- A province view groups the corresponding city/regency champions for the selected board.
- A city/regency view can present its #1 Wilayah champion and its #1 Kategori positions.
- Current champions persist until replaced by a later successful payment; no automatic period reset applies.
- Historical claims and champion transitions may be shown separately, but they do not accumulate into a score.
- Click counts are informational only and never affect ranking.
- **Relative ordering across different Kabupaten/Kota has not been approved yet.** These rules determine the champion within each local position; they do not define a national or province-wide score. Do not sort or label cities by cumulative payment, click count or payment recency, and do not show a Top 3 podium or numbered national ranks, until a separate cross-city display-order rule is approved.

## 8. Geography and presentation boundaries

- Indonesia only.
- Kabupaten/Kota is the smallest and only geographic competition level.
- Province is a grouping/navigation layer.
- No Kecamatan, Kelurahan or Desa competitions, filters or navigation.
- No public leaderboard map, map pins, map-based ranking, browser geolocation or city-centroid coordinates.

## 9. Data and audit requirements

Keep immutable payment records, provider-event records and champion-transition history. A correction or refund, if such a policy is approved later, must be represented with an auditable compensating event and must not silently rewrite historical payment or champion records.

Refunds, failed-transfer recovery, payment expiry, fees, cancellation and disputes are not approved by this document and must not be invented in implementation. They require a separately approved rule before being exposed to users.

## 10. Examples that must remain true

- A at #1 pays Rp20.000; A remains #1 until another valid claim is confirmed.
- B pays Rp20.000 for the same position; B becomes #1 immediately after confirmation.
- A pays Rp20.000 again; A becomes #1 again.
- Paying Rp20.000 for a category position does not change the #1 Wilayah champion.
- Paying Rp20.000 for #1 Wilayah does not change any category champion.
- One Rp20.000 payment cannot claim both a regional and a category position.
- Clicks, profile views and social engagement never replace a champion.