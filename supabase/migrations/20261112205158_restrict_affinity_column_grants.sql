-- Supabase's default table grants include UPDATE. Narrow them before exposing the
-- new RLS update policy; only the affinity field may be changed via the Data API.
revoke update on public.player_seats from anon,authenticated;
grant update(affinity) on public.player_seats to authenticated;
