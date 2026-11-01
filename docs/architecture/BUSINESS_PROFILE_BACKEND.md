# Business Profile Backend — Legacy Scaffold and Claim-First Direction

## Status

This document originally described a signup-first profile submission flow with owner authentication and manual moderation. That implementation exists in the initial backend foundation, but it does not match the approved KenalanUMKM business rules.

Treat the current owner/moderation routes, RLS policies and avatar ownership model as **legacy scaffolding**. Do not extend them as the primary product workflow. Do not rewrite migrations that have already been applied; transition through additive, reviewed migrations.

## Approved first-claim flow

There is no standalone account signup, business registration queue or manual review.

1. User clicks Claim #1.
2. User selects a Kabupaten/Kota and a target position: #1 Wilayah or #1 Kategori.
3. Category is required for a #1 Kategori claim. The UMKM's own category is stored on its profile for both claim types.
4. User fills in the UMKM profile inside the claim flow.
5. Server creates one claim/payment intent at exactly Rp20.000.
6. User completes payment.
7. Trusted provider confirmation is validated server-side.
8. The profile is published and the selected position is assigned immediately in the same database transaction.

A #1 Wilayah position is the overall champion across all categories for one Kabupaten/Kota. A #1 Kategori position is one champion for one category in that same Kabupaten/Kota. They are independent positions. One Rp20.000 payment claims only one position; holding both requires two claims/payments. Reclaiming a lost position costs Rp20.000 again.

## Business profile fields

The claim form collects the public business profile: business name, short description, one primary category, province and Kabupaten/Kota, optional address, avatar, website/social links, purchase link and order/contact link.

Personal contact details, claim capability and payment references must be separated from public profile fields. Collect only what is needed for claim confirmation and later owner recovery.

The first claim must not require a standalone account. A future profile-management or recovery mechanism is a separate design task and must not delay automatic activation.

## Links and avatar handling

The existing link parser recognizes common social, marketplace and ordering hosts and extracts handles only from known URL shapes. It must not scrape arbitrary profile pages or make server-side requests to untrusted user-provided URLs.

The existing private avatar bucket was designed for authenticated owners and approved profiles. Before claim-first activation, replace that access model with a narrow claim-scoped upload capability. An unpaid claim must never grant public profile visibility.

## Legacy API routes to replace

- POST /api/business-profiles currently requires a verified Supabase bearer token and creates a pending_review profile. This is not the approved Claim #1 flow.
- GET /api/me/business-profiles is based on standalone owner authentication and is not part of the first-claim journey.
- Existing avatar upload route relies on authenticated owner identity and must be replaced with claim-scoped upload authorization.

Target API direction:
- POST /api/claims — creates one claim for one position and a server-priced Rp20.000 payment intent.
- GET /api/claims/:id — reads safe claim status using a scoped capability.
- POST /api/webhooks/{provider} — processes authenticated provider events, idempotently.
- Public business-profile GET endpoints expose only profiles activated by a successful verified claim.

## Security and correctness requirements

The browser cannot set payment amount, paid status, rank or current champion. The server must bind the claim to one unique position and one payment intent. A trusted provider event must match exact destination, amount, currency, reference and claim.

Apply verified events atomically and serialize concurrent claims for the same position. Duplicate events must not duplicate payment or champion transitions. Store payment and champion history append-only.

## Payment provider

Moota remains a candidate only. Verify current official API and webhook behavior, bank coverage, account requirements, pricing/limits and written commercial permission before production integration. Do not invent endpoint, signature or notification semantics.