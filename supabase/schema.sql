-- ParaDocx schema snapshot (fresh Supabase project only).
-- The connected ParaDocx database already has these objects.
-- Do NOT run this file again on the existing project without a migration plan.

create extension if not exists pgcrypto;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '',
  owner_id uuid not null references auth.users(id) on delete cascade,
  join_code text not null unique default upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 8)),
  max_players integer not null default 5 check (max_players between 1 and 30),
  created_at timestamptz not null default now()
);

create table public.members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null default 'Investigador' check (char_length(display_name) between 1 and 60),
  role text not null default 'player' check (role in ('master', 'player')),
  joined_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  template text not null default 'letter',
  pages jsonb not null default '{"front":[],"back":[]}'::jsonb check (jsonb_typeof(pages) = 'object'),
  holder_id uuid references auth.users(id) on delete set null,
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  from_user uuid not null references auth.users(id),
  to_user uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index documents_campaign_idx on public.documents(campaign_id);
create index documents_holder_idx on public.documents(holder_id);
create index members_user_idx on public.members(user_id);
create index transfers_campaign_idx on public.transfers(campaign_id);

create schema if not exists private;

create function private.is_campaign_member(p_campaign uuid,p_user uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.members where campaign_id=p_campaign and user_id=p_user)
$$;

create function private.is_campaign_master(p_campaign uuid,p_user uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.campaigns where id=p_campaign and owner_id=p_user)
$$;

create function private.add_master_membership()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.members(campaign_id,user_id,display_name,role)
  values(new.id,new.owner_id,'Mestre','master');
  return new;
end
$$;

create trigger campaign_owner_member after insert on public.campaigns
for each row execute function private.add_master_membership();

create function private.set_document_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin
  new.updated_at=now();
  return new;
end
$$;

create trigger doc_updated_at before update on public.documents
for each row execute function private.set_document_updated_at();

alter table public.campaigns enable row level security;
alter table public.members enable row level security;
alter table public.documents enable row level security;
alter table public.transfers enable row level security;

create policy "Campaign members read" on public.campaigns for select
to authenticated using(private.is_campaign_member(id,(select auth.uid())));
create policy "Owner creates campaign" on public.campaigns for insert
to authenticated with check(owner_id=(select auth.uid()));
create policy "Master updates campaign" on public.campaigns for update
to authenticated using(owner_id=(select auth.uid()))
with check(owner_id=(select auth.uid()));

create policy "Members read roster" on public.members for select
to authenticated using(private.is_campaign_member(campaign_id,(select auth.uid())));

create policy "Master reads and holder reads" on public.documents for select
to authenticated using(
  private.is_campaign_master(campaign_id,(select auth.uid())) or
  (is_published and holder_id=(select auth.uid()) and private.is_campaign_member(campaign_id,(select auth.uid())))
);
create policy "Master inserts documents" on public.documents for insert
to authenticated with check(
  private.is_campaign_master(campaign_id,(select auth.uid()))
  and created_by=(select auth.uid())
  and (holder_id is null or private.is_campaign_member(campaign_id,holder_id))
);
create policy "Master updates documents" on public.documents for update
to authenticated using(private.is_campaign_master(campaign_id,(select auth.uid())))
with check(
  private.is_campaign_master(campaign_id,(select auth.uid()))
  and (holder_id is null or private.is_campaign_member(campaign_id,holder_id))
);
create policy "Master removes documents" on public.documents for delete
to authenticated using(private.is_campaign_master(campaign_id,(select auth.uid())));

create policy "Master reads transfers" on public.transfers for select
to authenticated using(
  private.is_campaign_master(campaign_id,(select auth.uid()))
  or from_user=(select auth.uid())
  or to_user=(select auth.uid())
);

create function public.join_campaign(p_code text,p_display_name text default 'Investigador')
returns uuid language plpgsql security definer set search_path='' as $$
declare c public.campaigns%rowtype;
declare n integer;
begin
  if auth.uid() is null then raise exception 'É necessário entrar na sua conta'; end if;
  select * into c from public.campaigns where join_code=upper(trim(p_code)) for update;
  if not found then raise exception 'Código de campanha inválido'; end if;
  if exists(select 1 from public.members where campaign_id=c.id and user_id=auth.uid()) then return c.id; end if;
  select count(*) into n from public.members where campaign_id=c.id and role='player';
  if n>=c.max_players then raise exception 'A campanha já atingiu o limite de jogadores'; end if;
  insert into public.members(campaign_id,user_id,display_name,role)
  values(c.id,auth.uid(),left(coalesce(nullif(trim(p_display_name),''),'Investigador'),60),'player');
  return c.id;
end
$$;

create function public.transfer_document(p_document uuid,p_recipient uuid)
returns void language plpgsql security definer set search_path='' as $$
declare d public.documents%rowtype;
begin
  if auth.uid() is null then raise exception 'Faça login primeiro'; end if;
  select * into d from public.documents where id=p_document for update;
  if not found or d.holder_id is distinct from auth.uid() or not d.is_published then
    raise exception 'Você não possui este documento';
  end if;
  if p_recipient=auth.uid() or not private.is_campaign_member(d.campaign_id,p_recipient) then
    raise exception 'Destinatário inválido';
  end if;
  if private.is_campaign_master(d.campaign_id,p_recipient) then raise exception 'Escolha outro jogador'; end if;
  update public.documents set holder_id=p_recipient where id=d.id;
  insert into public.transfers(document_id,campaign_id,from_user,to_user)
  values(d.id,d.campaign_id,auth.uid(),p_recipient);
end
$$;

revoke all on function public.join_campaign(text,text) from public,anon;
revoke all on function public.transfer_document(uuid,uuid) from public,anon;
grant execute on function public.join_campaign(text,text) to authenticated;
grant execute on function public.transfer_document(uuid,uuid) to authenticated;
grant usage on schema private to authenticated;
revoke all on function private.add_master_membership() from public,anon,authenticated;
revoke all on function private.set_document_updated_at() from public,anon,authenticated;
revoke all on function private.is_campaign_member(uuid,uuid) from public,anon;
revoke all on function private.is_campaign_master(uuid,uuid) from public,anon;
grant execute on function private.is_campaign_member(uuid,uuid) to authenticated;
grant execute on function private.is_campaign_master(uuid,uuid) to authenticated;
grant usage on schema public to authenticated;
grant select,insert,update,delete on public.campaigns,public.members,public.documents,public.transfers to authenticated;
revoke insert,update,delete on public.members from authenticated;
revoke insert,update,delete on public.transfers from authenticated;

alter publication supabase_realtime add table public.documents;
alter publication supabase_realtime add table public.members;
