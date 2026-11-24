# ParaDocx — Neon + Firebase (staging)

The source Supabase is preserved. Neither this branch nor the application
defaults change production until both server and build-time flags are set.

## Database

Restore the original schema, IDs, hashed player links, documents, puzzle states,
and functions. Keep RLS enabled and `auth.uid()` fail-closed. Apply
`neon-seat-rpcs.sql` to the isolated validation branch. Create a dedicated
server-only login with `NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS`.
Grant CONNECT to the database, USAGE on public, and only the following table
privileges and corresponding RLS policies scoped to that role:

| Table | Privileges |
|---|---|
| campaigns | SELECT INSERT UPDATE |
| documents | SELECT INSERT UPDATE DELETE |
| player_seats | SELECT UPDATE |
| members, master_identity | SELECT |
| mechanic_sessions, mechanic_presence | SELECT INSERT UPDATE |
| player_transfers | INSERT |

Grant EXECUTE only for `paradocx_create_seat`, `paradocx_rotate_seat`,
`paradocx_remove_seat`, `transfer_document_by_player`,
`activate_mechanic_session`, `touch_mechanic_presence`, `commit_mechanic_action`.
The role must not access the setup token, auth schema or migration archive.
All authorization is performed on the server using validated master identity
or the original hashed player link. No database credentials reach the client.

## Environment configuration (Preview first)

| Variable | Meaning |
|---|---|
| `VITE_PARADOCX_BACKEND`, `PARADOCX_BACKEND` | `neon` |
| `PARADOCX_DATABASE_URL` | Secret, restricted role for this environment |
| `PARADOCX_FIREBASE_SERVICE_ACCOUNT` | Secret JSON, project's service credential |
| `PARADOCX_FIREBASE_WEB_CONFIG` | JSON from Firebase Web app registration |
| `PARADOCX_MASTER_FIREBASE_UID` | Exact Firebase Auth UID of the migrated master |
| `PARADOCX_S3_ENDPOINT`, `PARADOCX_S3_REGION` | Branch's Neon S3 endpoint/region |
| `PARADOCX_S3_KEY`, `PARADOCX_S3_SECRET` | Secrets, branch-scoped storage read/write only |
| `VITE_PARADOCX_REALTIME`, `PARADOCX_REALTIME` | `firebase` only after validating rules |
| `PARADOCX_FIREBASE_ENV` | `preview` or `production` matching Vercel |

Do not commit environment values or private files. The original master UUID is
preserved; the existing master must create an account privately in Firebase
Authentication using the same email and set its exact UID in the Vercel secret.
The old password hash is not available from Supabase. The old activation link
does not enable public signup in the migrated backend. Player URLs remain unchanged.

The `handout-assets` bucket is private and restored paths remain unchanged.
Player assets are streamed only after checking ownership, affinity and publication.
The master can obtain a signed URL only for a campaign they own. The new raw
image upload route accepts up to 4 MiB after the existing client conversion.
All currently referenced migrated images are below this limit.

Publish `firebase.database.rules.json`: clients can only read a signal channel
for the verified campaign with a short-lived claim. No private state is copied
to Firebase. A disconnect falls back to visible polling. Preview and production
use separate signal namespaces and independent Neon and S3 credentials.

Run `npm test`, `VITE_PARADOCX_BACKEND=neon VITE_PARADOCX_REALTIME=firebase npm run build`.
Run `scripts/neon-validation.mjs` only with the named validation branch and
`PARADOCX_VALIDATION=isolated`. Then verify master login, player access, document
transfer, hidden layers, storage, and puzzle updates in a protected Vercel preview
using synthetic fixtures. Do not activate production before these checks pass.
