-- Fix: POST /campaigns with .insert(...).select().single() failed with 42501.
-- INSERT checks already restrict ownership to the appointed, authenticated master.
-- However, the old SELECT policy only allowed membership in public.members, whose
-- AFTER INSERT trigger runs too late for the SELECT visibility check on RETURNING.
-- Permit the appointed owner to read their own campaign immediately.
-- Members of existing campaigns retain the prior read privileges.
drop policy if exists "Campaign members read" on public.campaigns;
drop policy if exists "Campaign master or members read" on public.campaigns;

create policy "Campaign master or members read"
on public.campaigns
for select to authenticated
using (
  (
    owner_id = (select auth.uid())
    and private.is_app_master((select auth.uid()))
  )
  or private.is_campaign_member(id, (select auth.uid()))
);

-- Tested on connected Supabase project with authenticated master's JWT claims:
-- INSERT ... RETURNING succeeds; transaction rolled back, leaving no test data.
-- Do not remove the existing strict INSERT policy.
