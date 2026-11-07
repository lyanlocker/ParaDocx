-- Private scanned document backdrops. Master-only writes via Supabase Storage,
-- player-only reads via the token-validated player-access Edge Function.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('handout-assets','handout-assets',false,5242880,ARRAY['image/webp','image/png','image/jpeg'])
on conflict (id) do update set public=false,file_size_limit=5242880,
  allowed_mime_types=ARRAY['image/webp','image/png','image/jpeg'];

create policy "ParaDocx master uploads handout backgrounds"
on storage.objects for insert to authenticated
with check (
  bucket_id='handout-assets'
  and (storage.extension(name) in ('webp','png','jpg','jpeg'))
  and exists (
    select 1 from public.campaigns c
    where c.id::text = (storage.foldername(name))[1]
      and c.owner_id=(select auth.uid())
      and private.is_app_master((select auth.uid()))
  )
);

create policy "ParaDocx master previews own handout backgrounds"
on storage.objects for select to authenticated
using (
  bucket_id='handout-assets'
  and exists (
    select 1 from public.campaigns c
    where c.id::text = (storage.foldername(name))[1]
      and c.owner_id=(select auth.uid())
      and private.is_app_master((select auth.uid()))
  )
);

create policy "ParaDocx master cleans uploaded backgrounds"
on storage.objects for delete to authenticated
using (
  bucket_id='handout-assets'
  and exists (
    select 1 from public.campaigns c
    where c.id::text = (storage.foldername(name))[1]
      and c.owner_id=(select auth.uid())
      and private.is_app_master((select auth.uid()))
  )
);
