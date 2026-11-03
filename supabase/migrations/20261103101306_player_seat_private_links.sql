
-- Recorded migration on Supabase project Paradocx (2026-11-03).
-- Run after supabase/schema.sql when initializing a fresh database.
-- Player links are 256-bit bearer tokens; never store raw tokens.
create table public.player_seats (
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 display_name text not null check (char_length(trim(display_name)) between 1 and 60),
 token_hash text not null unique,
 enabled boolean not null default true,
 created_at timestamptz not null default now()
);
create index player_seats_campaign_idx on public.player_seats(campaign_id);
alter table public.documents add column holder_seat_id uuid references public.player_seats(id) on delete set null;
create index documents_holder_seat_idx on public.documents(holder_seat_id);
create table public.player_transfers (
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 document_id uuid not null references public.documents(id) on delete cascade,
 from_seat uuid not null references public.player_seats(id),
 to_seat uuid not null references public.player_seats(id),
 created_at timestamptz not null default now()
);
alter table public.player_seats enable row level security;
alter table public.player_transfers enable row level security;
create policy "Master reads player seats" on public.player_seats for select to authenticated
 using(private.is_campaign_master(campaign_id,(select auth.uid())));
create policy "Master reads player transfers" on public.player_transfers for select to authenticated
 using(private.is_campaign_master(campaign_id,(select auth.uid())));
grant select on public.player_seats,public.player_transfers to authenticated;

drop policy if exists "Master reads and holder reads" on public.documents;
create policy "Only master reads documents via Data API" on public.documents for select to authenticated
 using(private.is_campaign_master(campaign_id,(select auth.uid())));
drop policy if exists "Master inserts documents" on public.documents;
create policy "Only master inserts valid documents" on public.documents for insert to authenticated
 with check (
 private.is_campaign_master(campaign_id,(select auth.uid())) and created_by=(select auth.uid())
 and holder_id is null and (holder_seat_id is null or exists(
 select 1 from public.player_seats p where p.id=holder_seat_id and p.campaign_id=campaign_id and p.enabled))
 );
drop policy if exists "Master updates documents" on public.documents;
create policy "Only master updates valid documents" on public.documents for update to authenticated
 using(private.is_campaign_master(campaign_id,(select auth.uid())))
 with check (
 private.is_campaign_master(campaign_id,(select auth.uid())) and holder_id is null
 and (holder_seat_id is null or exists(select 1 from public.player_seats p
 where p.id=holder_seat_id and p.campaign_id=campaign_id and p.enabled))
 );

create function public.create_player_seat(p_campaign uuid,p_name text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare c public.campaigns%rowtype; s public.player_seats%rowtype; token text; count_seats int;
begin
 if auth.uid() is null then raise exception 'Não autenticado'; end if;
 select * into c from public.campaigns where id=p_campaign and owner_id=auth.uid() for update;
 if not found then raise exception 'Somente o mestre pode criar jogadores'; end if;
 select count(*) into count_seats from public.player_seats where campaign_id=p_campaign and enabled;
 if count_seats>=c.max_players then raise exception 'Limite de jogadores atingido'; end if;
 if p_name is null or length(trim(p_name))<1 or length(trim(p_name))>60 then raise exception 'Nome inválido'; end if;
 token := encode(extensions.gen_random_bytes(32),'hex');
 insert into public.player_seats(campaign_id,display_name,token_hash)
 values(p_campaign,trim(p_name),encode(extensions.digest(token,'sha256'),'hex')) returning * into s;
 return jsonb_build_object('id',s.id,'name',s.display_name,'token',token);
end
$$;

create function public.rotate_player_link(p_seat uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s public.player_seats%rowtype; token text;
begin
 select * into s from public.player_seats where id=p_seat for update;
 if not found or not private.is_campaign_master(s.campaign_id,auth.uid()) then raise exception 'Acesso negado'; end if;
 if not s.enabled then raise exception 'Jogador desativado'; end if;
 token := encode(extensions.gen_random_bytes(32),'hex');
 update public.player_seats set token_hash=encode(extensions.digest(token,'sha256'),'hex') where id=s.id;
 return jsonb_build_object('id',s.id,'name',s.display_name,'token',token);
end
$$;

create function public.remove_player_seat(p_seat uuid) returns void
language plpgsql security definer set search_path='' as $$
declare s public.player_seats%rowtype;
begin
 select * into s from public.player_seats where id=p_seat for update;
 if not found or not private.is_campaign_master(s.campaign_id,auth.uid()) then raise exception 'Acesso negado'; end if;
 update public.player_seats set enabled=false,
 token_hash=encode(extensions.digest(encode(extensions.gen_random_bytes(32),'hex'),'sha256'),'hex')
 where id=p_seat;
 update public.documents set holder_seat_id=null,is_published=false where holder_seat_id=p_seat;
end
$$;

create function public.transfer_document_by_player(p_token_hash text,p_document uuid,p_recipient uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare actor public.player_seats%rowtype; receiver public.player_seats%rowtype; d public.documents%rowtype;
begin
 select * into actor from public.player_seats where token_hash=p_token_hash and enabled;
 if not found then raise exception 'Link inválido'; end if;
 select * into d from public.documents where id=p_document for update;
 if not found or d.holder_seat_id is distinct from actor.id or
 d.campaign_id is distinct from actor.campaign_id or not d.is_published
 then raise exception 'Documento indisponível'; end if;
 select * into receiver from public.player_seats where id=p_recipient and
 campaign_id=actor.campaign_id and enabled;
 if not found or receiver.id=actor.id then raise exception 'Destinatário inválido'; end if;
 update public.documents set holder_seat_id=receiver.id where id=d.id;
 insert into public.player_transfers(campaign_id,document_id,from_seat,to_seat)
 values(d.campaign_id,d.id,actor.id,receiver.id);
 return true;
end
$$;

revoke all on function public.create_player_seat(uuid,text) from public,anon;
revoke all on function public.rotate_player_link(uuid) from public,anon;
revoke all on function public.remove_player_seat(uuid) from public,anon;
grant execute on function public.create_player_seat(uuid,text),public.rotate_player_link(uuid),
 public.remove_player_seat(uuid) to authenticated;
revoke all on function public.transfer_document_by_player(text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.transfer_document_by_player(text,uuid,uuid) to service_role;

-- The old player login/invite-code flow is no longer available.
revoke execute on function public.join_campaign(text,text) from authenticated;
revoke execute on function public.transfer_document(uuid,uuid) from authenticated;
