
-- Single-master ParaDocx: one privileged identity, activated with an out-of-band one-time token.
-- Actual token hash is created only in the connected production database, not in GitHub.
create table public.master_identity (
 singleton boolean primary key default true check(singleton),
 user_id uuid not null unique references auth.users(id) on delete restrict,
 username text not null default 'mestre01' unique check(username='mestre01'),
 email text not null,
 initialized_at timestamptz not null default now()
);
create table public.master_setup_token (
 singleton boolean primary key default true check(singleton),
 token_hash text not null,
 consumed_at timestamptz
);
alter table public.master_identity enable row level security;
alter table public.master_setup_token enable row level security;
revoke all on table public.master_identity,public.master_setup_token from anon,authenticated;
create function private.is_app_master(p_user uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists (select 1 from public.master_identity where user_id=p_user and singleton)
$$;
revoke all on function private.is_app_master(uuid) from public,anon;
grant execute on function private.is_app_master(uuid) to authenticated;
drop policy if exists "Owner creates campaign" on public.campaigns;
create policy "Only appointed master creates campaign" on public.campaigns for insert to authenticated
 with check(owner_id=(select auth.uid()) and private.is_app_master((select auth.uid())));
