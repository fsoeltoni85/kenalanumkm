-- Serialize owner submissions before checking the pending profile cap.
-- The profile RPC remains SECURITY INVOKER; only its per-owner concurrency guard changes.

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
  v_purchase_count integer;
  v_order_count integer;
  v_link_count integer;
  v_pending_count integer;
begin
  v_user_id := (select auth.uid());
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  -- Serialize submissions for this owner so concurrent requests cannot bypass the three-pending-profile limit.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));

  if p_profile is null or jsonb_typeof(p_profile) <> 'object' then
    raise exception 'invalid_profile_payload' using errcode = '22023';
  end if;

  if p_links is null or jsonb_typeof(p_links) <> 'array' then
    raise exception 'invalid_links_payload' using errcode = '22023';
  end if;

  v_link_count := jsonb_array_length(p_links);
  if v_link_count < 3 or v_link_count > 8 then
    raise exception 'profile_requires_3_to_8_links' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_links) as elements(value)
    where jsonb_typeof(elements.value) <> 'object'
  ) then
    raise exception 'invalid_link_entry' using errcode = '22023';
  end if;

  select
    count(*) filter (where elements.value ->> 'link_type' = 'primary'),
    count(*) filter (where elements.value ->> 'link_type' = 'purchase'),
    count(*) filter (where elements.value ->> 'link_type' = 'order')
  into v_primary_count, v_purchase_count, v_order_count
  from jsonb_array_elements(p_links) as elements(value);

  if v_primary_count <> 1 or v_purchase_count <> 1 or v_order_count <> 1 then
    raise exception 'profile_requires_primary_purchase_and_order_links' using errcode = '22023';
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
    owner_user_id, slug, name, description, category_id,
    province_name, regency_name, address_text, status
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

  for v_link in
    select elements.value
    from jsonb_array_elements(p_links) as elements(value)
  loop
    insert into public.business_profile_links (
      business_id, link_type, platform, url, handle
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
