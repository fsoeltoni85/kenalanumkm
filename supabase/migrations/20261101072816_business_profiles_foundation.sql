-- KenalanUMKM business profile foundation.
-- Additive migration: no existing application data is modified or deleted.

create table public.business_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default '✨',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint business_categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint business_categories_name_length check (char_length(name) between 2 and 80)
);

insert into public.business_categories (slug, name, icon, sort_order)
values
  ('makanan-minuman', 'Makanan & Minuman', '🍜', 10),
  ('fashion', 'Fashion', '👕', 20),
  ('retail', 'Retail', '🛍️', 30),
  ('jasa', 'Jasa', '🧰', 40),
  ('kecantikan', 'Kecantikan', '💅', 50),
  ('kesehatan', 'Kesehatan', '💊', 60),
  ('otomotif', 'Otomotif', '🛵', 70),
  ('pendidikan', 'Pendidikan', '📚', 80),
  ('lainnya', 'Lainnya', '✨', 90)
on conflict (slug) do update
set name = excluded.name,
    icon = excluded.icon,
    sort_order = excluded.sort_order;

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null,
  category_id uuid not null references public.business_categories(id) on delete restrict,
  province_name text not null,
  regency_name text not null,
  address_text text,
  avatar_path text,
  status text not null default 'pending_review',
  rejection_reason text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_profiles_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint business_profiles_name_length check (char_length(btrim(name)) between 2 and 100),
  constraint business_profiles_description_length check (char_length(btrim(description)) between 20 and 280),
  constraint business_profiles_province_length check (char_length(btrim(province_name)) between 2 and 80),
  constraint business_profiles_regency_length check (char_length(btrim(regency_name)) between 2 and 100),
  constraint business_profiles_address_length check (address_text is null or char_length(address_text) <= 240),
  constraint business_profiles_status check (status in ('draft', 'pending_review', 'approved', 'rejected', 'suspended')),
  constraint business_profiles_avatar_owner_path check (
    avatar_path is null or avatar_path like owner_user_id::text || '/%'
  )
);

create index business_profiles_public_listing_idx
  on public.business_profiles (category_id, province_name, regency_name, approved_at desc)
  where status = 'approved';

create index business_profiles_owner_status_idx
  on public.business_profiles (owner_user_id, status, created_at desc);

create table public.business_profile_links (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business_profiles(id) on delete cascade,
  link_type text not null,
  platform text not null,
  url text not null,
  handle text,
  platform_user_id text,
  profile_display_name text,
  profile_image_url text,
  resolution_status text not null default 'not_started',
  resolution_error_code text,
  resolution_attempted_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_profile_links_type check (link_type in ('primary', 'social', 'purchase', 'order')),
  constraint business_profile_links_platform check (
    platform in (
      'website', 'instagram', 'threads', 'x', 'tiktok', 'facebook',
      'whatsapp', 'shopee', 'tokopedia', 'lazada', 'tiktok_shop',
      'gofood', 'grabfood', 'shopeefood', 'other'
    )
  ),
  constraint business_profile_links_url check (
    char_length(url) between 9 and 2048
    and url ~ '^https://[^[:space:]]+$'
  ),
  constraint business_profile_links_handle_length check (handle is null or char_length(handle) <= 80),
  constraint business_profile_links_display_name_length check (
    profile_display_name is null or char_length(profile_display_name) <= 120
  ),
  constraint business_profile_links_avatar_url check (
    profile_image_url is null or (
      char_length(profile_image_url) <= 2048
      and profile_image_url ~ '^https://[^[:space:]]+$'
    )
  ),
  constraint business_profile_links_resolution_status check (
    resolution_status in ('not_started', 'pending', 'resolved', 'needs_authorization', 'unsupported', 'failed')
  ),
  constraint business_profile_links_social_platform check (
    link_type <> 'social' or platform in ('instagram', 'threads', 'x', 'tiktok', 'facebook')
  ),
  constraint business_profile_links_purchase_platform check (
    link_type <> 'purchase' or platform in ('website', 'shopee', 'tokopedia', 'lazada', 'tiktok_shop', 'other')
  ),
  constraint business_profile_links_order_platform check (
    link_type <> 'order' or platform in ('website', 'whatsapp', 'gofood', 'grabfood', 'shopeefood', 'other')
  )
);

-- Each profile has one main link, one buy link and one order link at most.
create unique index business_profile_links_one_primary_idx
  on public.business_profile_links (business_id)
  where link_type = 'primary';

create unique index business_profile_links_one_purchase_idx
  on public.business_profile_links (business_id)
  where link_type = 'purchase';

create unique index business_profile_links_one_order_idx
  on public.business_profile_links (business_id)
  where link_type = 'order';

create unique index business_profile_links_social_platform_idx
  on public.business_profile_links (business_id, platform)
  where link_type in ('primary', 'social')
    and platform in ('instagram', 'threads', 'x', 'tiktok', 'facebook');

create index business_profile_links_business_idx
  on public.business_profile_links (business_id, link_type, created_at);

comment on table public.business_categories is
  'Curated public category list used by UMKM business profiles.';
comment on table public.business_profiles is
  'One physical UMKM listing. Public visibility begins only after moderation approval.';
comment on table public.business_profile_links is
  'Primary, social, purchase and order links belonging to a business profile. Social metadata is server-resolved only.';

create or replace function public.set_business_profile_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_business_profile_updated_at() from public, anon, authenticated;

create trigger set_business_profiles_updated_at
before update on public.business_profiles
for each row execute function public.set_business_profile_updated_at();

create trigger set_business_profile_links_updated_at
before update on public.business_profile_links
for each row execute function public.set_business_profile_updated_at();

alter table public.business_categories enable row level security;
alter table public.business_profiles enable row level security;
alter table public.business_profile_links enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.business_categories to anon, authenticated;
grant select on public.business_profiles to anon, authenticated;
grant insert (owner_user_id, slug, name, description, category_id, province_name, regency_name, address_text, status)
  on public.business_profiles to authenticated;
grant update (avatar_path)
  on public.business_profiles to authenticated;
grant select on public.business_profile_links to anon, authenticated;
grant insert (business_id, link_type, platform, url, handle)
  on public.business_profile_links to authenticated;

create policy "Active business categories are public"
  on public.business_categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Approved business profiles are public"
  on public.business_profiles
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "Owners can submit their own pending business profiles"
  on public.business_profiles
  for insert
  to authenticated
  with check (
    owner_user_id = (select auth.uid())
    and status = 'pending_review'
  );

create policy "Owners can read their own business profiles"
  on public.business_profiles
  for select
  to authenticated
  using (owner_user_id = (select auth.uid()));

create policy "Owners can set their own avatar path"
  on public.business_profiles
  for update
  to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

create policy "Approved profile links are public"
  on public.business_profile_links
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.business_profiles p
      where p.id = business_profile_links.business_id
        and p.status = 'approved'
    )
  );

create policy "Owners can read their own profile links"
  on public.business_profile_links
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles p
      where p.id = business_profile_links.business_id
        and p.owner_user_id = (select auth.uid())
    )
  );

create policy "Owners can add links to their pending profile"
  on public.business_profile_links
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_profiles p
      where p.id = business_profile_links.business_id
        and p.owner_user_id = (select auth.uid())
        and p.status = 'pending_review'
    )
  );

create or replace function public.submit_business_profile(
  p_profile jsonb,
  p_links jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_category_id uuid;
  v_business_id uuid;
  v_link jsonb;
  v_primary_count integer;
  v_link_count integer;
  v_pending_count integer;
begin
  v_user_id := (select auth.uid());
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_profile is null or jsonb_typeof(p_profile) <> 'object' then
    raise exception 'invalid_profile_payload' using errcode = '22023';
  end if;

  if p_links is null or jsonb_typeof(p_links) <> 'array' then
    raise exception 'invalid_links_payload' using errcode = '22023';
  end if;

  v_link_count := jsonb_array_length(p_links);
  if v_link_count < 1 or v_link_count > 8 then
    raise exception 'profile_requires_between_1_and_8_links' using errcode = '22023';
  end if;

  select count(*)
    into v_primary_count
  from jsonb_array_elements(p_links) as item
  where item ->> 'link_type' = 'primary';

  if v_primary_count <> 1 then
    raise exception 'profile_requires_exactly_one_primary_link' using errcode = '22023';
  end if;

  select id
    into v_category_id
  from public.business_categories
  where slug = p_profile ->> 'category_slug'
    and is_active = true;

  if v_category_id is null then
    raise exception 'invalid_business_category' using errcode = '22023';
  end if;

  select count(*)
    into v_pending_count
  from public.business_profiles
  where owner_user_id = v_user_id
    and status in ('draft', 'pending_review');

  if v_pending_count >= 3 then
    raise exception 'business_submission_limit_reached' using errcode = 'P0001';
  end if;

  insert into public.business_profiles (
    owner_user_id,
    slug,
    name,
    description,
    category_id,
    province_name,
    regency_name,
    address_text,
    status
  )
  values (
    v_user_id,
    p_profile ->> 'slug',
    btrim(p_profile ->> 'name'),
    btrim(p_profile ->> 'description'),
    v_category_id,
    btrim(p_profile ->> 'province_name'),
    btrim(p_profile ->> 'regency_name'),
    nullif(btrim(p_profile ->> 'address_text'), ''),
    'pending_review'
  )
  returning id into v_business_id;

  for v_link in select value from jsonb_array_elements(p_links)
  loop
    insert into public.business_profile_links (
      business_id,
      link_type,
      platform,
      url,
      handle
    )
    values (
      v_business_id,
      v_link ->> 'link_type',
      v_link ->> 'platform',
      v_link ->> 'url',
      nullif(v_link ->> 'handle', '')
    );
  end loop;

  return v_business_id;
end;
$$;

revoke all on function public.submit_business_profile(jsonb, jsonb) from public, anon;
grant execute on function public.submit_business_profile(jsonb, jsonb) to authenticated;

-- Public avatar reads; uploads are restricted to a folder named with the caller's auth user ID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-avatars',
  'business-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Business avatars are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'business-avatars');

create policy "Users can upload their own business avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'business-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can replace their own business avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'business-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'business-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own business avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'business-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
