-- Enforce submission invariants even when a client attempts direct table inserts.
-- Profiles must be created with all required links in the same transaction.

create or replace function public.guard_business_profile_owner_insert()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_pending_count integer;
begin
  if new.owner_user_id is distinct from (select auth.uid()) then
    raise exception 'profile_owner_must_match_authenticated_user' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.owner_user_id::text, 0));

  select count(*)
    into v_pending_count
  from public.business_profiles
  where owner_user_id = new.owner_user_id
    and status in ('draft', 'pending_review');

  if v_pending_count >= 3 then
    raise exception 'business_submission_limit_reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_business_profile_owner_insert() from public, anon, authenticated;

create trigger guard_business_profile_owner_insert
before insert on public.business_profiles
for each row execute function public.guard_business_profile_owner_insert();

create or replace function public.ensure_business_profile_required_links()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_primary_count integer;
  v_purchase_count integer;
  v_order_count integer;
begin
  if new.status in ('draft', 'pending_review') then
    select
      count(*) filter (where link_type = 'primary'),
      count(*) filter (where link_type = 'purchase'),
      count(*) filter (where link_type = 'order')
    into v_primary_count, v_purchase_count, v_order_count
    from public.business_profile_links
    where business_id = new.id;

    if v_primary_count <> 1 or v_purchase_count <> 1 or v_order_count <> 1 then
      raise exception 'profile_requires_primary_purchase_and_order_links' using errcode = '23514';
    end if;
  end if;

  return null;
end;
$$;

revoke all on function public.ensure_business_profile_required_links() from public, anon, authenticated;

create constraint trigger ensure_business_profile_required_links
after insert on public.business_profiles
deferrable initially deferred
for each row execute function public.ensure_business_profile_required_links();
