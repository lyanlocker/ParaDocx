-- Private campaign puzzle state. Only the existing token/JWT-authenticated
-- Edge Function may read or mutate it; no direct client or realtime access.
create table public.mechanic_sessions (
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 master_id uuid not null references auth.users(id),
 name text not null check (char_length(name) between 1 and 120),
 training boolean not null default false,
 active boolean not null default false,
 participants uuid[] not null check (cardinality(participants)=6),
 config jsonb not null,
 state jsonb not null,
 version bigint not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index mechanic_sessions_campaign on public.mechanic_sessions(campaign_id, created_at desc);
create unique index mechanic_sessions_one_active on public.mechanic_sessions(campaign_id) where active;
alter table public.documents add column mechanic_session_id uuid references public.mechanic_sessions(id) on delete cascade;
create index documents_mechanic_session on public.documents(mechanic_session_id) where mechanic_session_id is not null;
create table public.mechanic_presence (
 session_id uuid not null references public.mechanic_sessions(id) on delete cascade,
 seat_id uuid not null references public.player_seats(id) on delete cascade,
 last_seen timestamptz not null default now(),
 primary key(session_id,seat_id)
);
alter table public.mechanic_sessions enable row level security;
alter table public.mechanic_presence enable row level security;
revoke all on table public.mechanic_sessions,public.mechanic_presence from public,anon,authenticated;
grant select,insert,update,delete on table public.mechanic_sessions,public.mechanic_presence to service_role;

create function public.activate_mechanic_session(p_session uuid,p_campaign uuid,p_master uuid)
returns void language plpgsql security invoker set search_path='' as $$
begin
 perform 1 from public.campaigns where id=p_campaign and owner_id=p_master for update;
 if not found then raise exception 'Acesso negado'; end if;
 if not exists(select 1 from public.mechanic_sessions where id=p_session and campaign_id=p_campaign and master_id=p_master) then raise exception 'Sessão indisponível'; end if;
 update public.mechanic_sessions set active=false where campaign_id=p_campaign and active and id<>p_session;
 update public.mechanic_sessions set active=true where id=p_session;
end; $$;

create function public.touch_mechanic_presence(p_session uuid,p_seat uuid,p_token_hash text)
returns void language sql security invoker set search_path='' as $$
 insert into public.mechanic_presence(session_id,seat_id)
 select s.id,p.id from public.mechanic_sessions s join public.player_seats p on p.campaign_id=s.campaign_id
 where s.id=p_session and s.active and p.id=p_seat and p.enabled and p.token_hash=p_token_hash and p.id=any(s.participants)
 on conflict(session_id,seat_id) do update set last_seen=now() where mechanic_presence.last_seen<now()-interval '10 seconds'
$$;

-- One transaction for the puzzle's compare-and-swap and its reward document.
-- Lock existing reward documents before comparing ownership to also serialize
-- with the already-existing inventory transfer function.
create function public.commit_mechanic_action(p_session uuid,p_campaign uuid,p_version bigint,p_state jsonb,
 p_master uuid,p_seat uuid,p_token_hash text,p_docs jsonb,p_document jsonb)
returns boolean language plpgsql security invoker set search_path='' as $$
declare s public.mechanic_sessions%rowtype;
declare d public.documents%rowtype;
declare snapshot jsonb;
declare doc_id uuid;
declare recipient uuid;
declare previous uuid;
begin
 select * into s from public.mechanic_sessions where id=p_session and campaign_id=p_campaign for update;
 if not found or s.version<>p_version then return false; end if;
 if p_master is not null then
  if not exists(select 1 from public.campaigns where id=p_campaign and owner_id=p_master) then return false; end if;
 else
  if not s.active or not p_seat=any(s.participants) then return false; end if;
  perform 1 from public.player_seats where id=p_seat and campaign_id=p_campaign and enabled and token_hash=p_token_hash for share;
  if not found or p_document is not null then return false; end if;
 end if;
 for doc_id in select (value #>> '{}')::uuid from jsonb_each(s.state->'papers') order by value::text loop
  select * into d from public.documents where id=doc_id and campaign_id=p_campaign for update;
  select value into snapshot from jsonb_array_elements(p_docs) where value->>'id'=doc_id::text;
  if not found then snapshot:=null; end if;
  if (d.id is null)<>(snapshot is null) then return false; end if;
  if d.id is not null and (d.holder_seat_id::text is distinct from snapshot->>'holder_seat_id' or d.is_published is distinct from (snapshot->>'is_published')::boolean) then return false; end if;
 end loop;
 if p_document is not null then
  doc_id:=(p_document->>'id')::uuid;
  recipient:=(p_document->>'recipient')::uuid;
  if recipient is not null then
   if not recipient=any(s.participants) then return false; end if;
   perform 1 from public.player_seats where id=recipient and campaign_id=p_campaign and enabled for share;
   if not found then return false; end if;
   select holder_seat_id into previous from public.documents where id=doc_id and campaign_id=p_campaign for update;
   insert into public.documents(id,campaign_id,title,template,pages,holder_seat_id,is_published,created_by,mechanic_session_id)
   values(doc_id,p_campaign,case when s.training then 'Papel de inscrição · Treinamento' else 'Papel de inscrição' end,'blank',jsonb_build_object('front',jsonb_build_array(jsonb_build_object(
     'id','inscription','kind','image','assetPath',p_document->>'assetPath','alt','Símbolo inscrito','x',24,'y',30,'width',52,'height',40,'fit','contain','opacity',1,'uv',false,'affinity','none')),'back','[]'::jsonb),recipient,true,p_master,p_session)
   on conflict(id) do update set holder_seat_id=excluded.holder_seat_id,is_published=true,pages=excluded.pages
    where documents.campaign_id=p_campaign and documents.mechanic_session_id=p_session;
   if not found then return false; end if;
   if previous is not null and previous<>recipient then
    insert into public.player_transfers(campaign_id,document_id,from_seat,to_seat) values(p_campaign,doc_id,previous,recipient);
   end if;
  else
   update public.documents set holder_seat_id=null,is_published=false where id=doc_id and campaign_id=p_campaign;
  end if;
 end if;
 update public.mechanic_sessions set state=p_state,version=version+1,updated_at=now() where id=p_session;
 return true;
end; $$;

revoke all on function public.activate_mechanic_session(uuid,uuid,uuid) from public,anon,authenticated;
revoke all on function public.touch_mechanic_presence(uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.commit_mechanic_action(uuid,uuid,bigint,jsonb,uuid,uuid,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.activate_mechanic_session(uuid,uuid,uuid),public.touch_mechanic_presence(uuid,uuid,text),public.commit_mechanic_action(uuid,uuid,bigint,jsonb,uuid,uuid,text,jsonb,jsonb) to service_role;
