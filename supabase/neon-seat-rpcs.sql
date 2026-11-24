-- Explicit legacy master UUID is supplied only by the verified server session.
-- Keep auth.uid() fail-closed; no browser receives database credentials.
create or replace function public.paradocx_create_seat(p_master uuid,p_campaign uuid,p_name text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare c public.campaigns%rowtype; s public.player_seats%rowtype; token text;
begin
 if not exists(select 1 from public.master_identity where singleton and user_id=p_master) then raise exception 'Acesso negado'; end if;
 select * into c from public.campaigns where id=p_campaign and owner_id=p_master for update;
 if not found then raise exception 'Acesso negado'; end if;
 if (select count(*) from public.player_seats where campaign_id=p_campaign and enabled)>=c.max_players then raise exception 'Limite de jogadores atingido'; end if;
 if p_name is null or length(trim(p_name)) not between 1 and 60 then raise exception 'Nome inválido'; end if;
 token:=encode(extensions.gen_random_bytes(32),'hex');
 insert into public.player_seats(campaign_id,display_name,token_hash) values(p_campaign,trim(p_name),encode(extensions.digest(token,'sha256'),'hex')) returning * into s;
 return jsonb_build_object('id',s.id,'name',s.display_name,'token',token);
end $$;
create or replace function public.paradocx_rotate_seat(p_master uuid,p_seat uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s public.player_seats%rowtype; token text;
begin
 if not exists(select 1 from public.master_identity where singleton and user_id=p_master) then raise exception 'Acesso negado'; end if;
 select p.* into s from public.player_seats p join public.campaigns c on c.id=p.campaign_id where p.id=p_seat and c.owner_id=p_master and p.enabled for update of p;
 if not found then raise exception 'Acesso negado'; end if;
 token:=encode(extensions.gen_random_bytes(32),'hex');
 update public.player_seats set token_hash=encode(extensions.digest(token,'sha256'),'hex') where id=s.id;
 return jsonb_build_object('id',s.id,'name',s.display_name,'token',token);
end $$;
create or replace function public.paradocx_remove_seat(p_master uuid,p_seat uuid) returns void
language plpgsql security definer set search_path='' as $$
declare s public.player_seats%rowtype;
begin
 if not exists(select 1 from public.master_identity where singleton and user_id=p_master) then raise exception 'Acesso negado'; end if;
 select p.* into s from public.player_seats p join public.campaigns c on c.id=p.campaign_id where p.id=p_seat and c.owner_id=p_master for update of p;
 if not found then raise exception 'Acesso negado'; end if;
 update public.player_seats set enabled=false,token_hash=encode(extensions.digest(encode(extensions.gen_random_bytes(32),'hex'),'sha256'),'hex') where id=p_seat;
 update public.documents set holder_seat_id=null,is_published=false where holder_seat_id=p_seat;
end $$;
revoke all on function public.paradocx_create_seat(uuid,uuid,text),public.paradocx_rotate_seat(uuid,uuid),public.paradocx_remove_seat(uuid,uuid) from public;
