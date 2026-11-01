# Supabase

Project: `kenalanumkm`.

The first backend profile foundation is applied to the linked project. Current application schema:

- `public.business_categories`: curated categories (9 seeded categories).
- `public.business_profiles`: one physical UMKM profile, owner and moderation lifecycle.
- `public.business_profile_links`: primary, social, purchase and order URLs plus server-managed profile metadata.
- Storage bucket `business-avatars`: private JPEG/PNG/WebP files with owner/approved-profile access rules.

All three application tables have RLS enabled. Public callers can read approved profiles; authenticated owners can read their own profiles. The public Data API grants are explicit. Profile submission is atomic through `submit_business_profile(jsonb,jsonb)`, which runs as SECURITY INVOKER.

Migrations in this folder are versioned to match the migration versions applied to Supabase. Apply future DDL using reviewed migrations, then run Supabase security and performance advisors. Do not bypass RLS or expose a secret/service-role key in the browser or Worker.

The leaderboard still reads demo rows. Replacing the demo read model with approved database-backed champions is a separate integration task. Admin moderation workflow, social provider OAuth resolution, payments and stake ledger are not implemented in this foundation.
