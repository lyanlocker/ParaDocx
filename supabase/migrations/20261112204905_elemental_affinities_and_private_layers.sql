-- Player affinities are controlled only by the campaign master.
alter table public.player_seats add column affinity text not null default 'none'
  check (affinity in ('none','sangue','energia','medo','morte','conhecimento'));
grant update(affinity) on public.player_seats to authenticated;
create policy "Master sets player affinity" on public.player_seats for update to authenticated
  using (private.is_campaign_master(campaign_id,(select auth.uid())))
  with check (private.is_campaign_master(campaign_id,(select auth.uid())));

-- Explicitly qualify objects.name: otherwise the correlated query resolves c.name,
-- the campaign's display name, instead of the uploaded asset's storage path.
alter policy "ParaDocx master uploads handout backgrounds" on storage.objects
with check (bucket_id='handout-assets' and storage.extension(objects.name) in ('webp','png','jpg','jpeg')
 and exists(select 1 from public.campaigns c where c.id::text=(storage.foldername(objects.name))[1]
 and c.owner_id=(select auth.uid()) and private.is_app_master((select auth.uid()))));
alter policy "ParaDocx master previews own handout backgrounds" on storage.objects
using (bucket_id='handout-assets' and exists(select 1 from public.campaigns c
 where c.id::text=(storage.foldername(objects.name))[1] and c.owner_id=(select auth.uid())
 and private.is_app_master((select auth.uid()))));
alter policy "ParaDocx master cleans uploaded backgrounds" on storage.objects
using (bucket_id='handout-assets' and exists(select 1 from public.campaigns c
 where c.id::text=(storage.foldername(objects.name))[1] and c.owner_id=(select auth.uid())
 and private.is_app_master((select auth.uid()))));
