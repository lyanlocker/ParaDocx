// Read-only service checks against the isolated ParaDocx preview.
// Install the reviewed, deny-by-default realtime rules only when the database
// has no existing rules beyond the default deny-all policy.
import { readFile } from 'node:fs/promises';
import { firebaseSettings } from '../server/neon-auth.js';
import { rows } from '../server/neon-db.js';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const production = process.env.VERCEL_ENV === 'production';
const preview = process.env.VERCEL_ENV === 'preview' &&
  process.env.VERCEL_GIT_COMMIT_REF === 'migration/neon-firebase-staging';
if ((!preview && !production) || process.env.PARADOCX_BACKEND !== 'neon') {
  console.log('PARADOCX_VALIDATION: skipped outside migration targets');
  process.exit(0);
}
const results = {};
const limit = (promise) => Promise.race([
  promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))
]);
async function check(name, action) {
  try { results[name] = Boolean(await limit(action())); }
  catch { results[name] = false; }
}
const normalize = (value) => value && typeof value === 'object' && !Array.isArray(value)
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, normalize(value[k])]))
  : value;
const equivalent = (a, b) => JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));

let identity;
await check('neon', async () => {
  const [connection] = await rows('SELECT current_user AS role');
  if (connection.role !== (production ? 'paradocx_production_runtime' : 'paradocx_preview_runtime')) return false;
  [identity] = await rows("SELECT user_id,email FROM public.master_identity WHERE singleton=true AND username='mestre01'");
  return !!identity?.user_id && !!identity?.email;
});
await Promise.all([
  check('firebaseAuth', async () => {
    let credential, config;
    try { credential = JSON.parse(process.env.PARADOCX_FIREBASE_SERVICE_ACCOUNT || 'null'); }
    catch { results.firebaseAuthReason = 'service_account_json_invalid'; return false; }
    try { config = JSON.parse(process.env.PARADOCX_FIREBASE_WEB_CONFIG || 'null'); }
    catch { results.firebaseAuthReason = 'web_config_json_invalid'; return false; }
    if (!credential?.project_id || !credential?.private_key || !credential?.client_email) {
      results.firebaseAuthReason = 'service_account_fields_missing'; return false;
    }
    if (!config?.projectId || !config?.apiKey) {
      results.firebaseAuthReason = 'web_config_fields_missing'; return false;
    }
    if (config.projectId !== credential.project_id) {
      results.firebaseAuthReason = 'firebase_project_mismatch'; return false;
    }
    if (!process.env.PARADOCX_MASTER_FIREBASE_UID) {
      results.firebaseAuthReason = 'master_uid_missing'; return false;
    }
    let settings;
    try { settings = firebaseSettings(); }
    catch { results.firebaseAuthReason = 'firebase_admin_init_failed'; return false; }
    try {
      const user = await getAuth(settings.app).getUser(settings.uid);
      if (user.disabled) { results.firebaseAuthReason = 'master_user_disabled'; return false; }
      if (!identity || user.email?.toLowerCase() !== identity.email.toLowerCase()) {
        results.firebaseAuthReason = 'master_email_mismatch'; return false;
      }
      results.firebaseAuthReason = 'ok';
      return true;
    } catch (error) {
      const safeCodes = ['auth/user-not-found', 'auth/invalid-uid', 'auth/invalid-credential', 'auth/insufficient-permission', 'auth/project-not-found'];
      results.firebaseAuthReason = safeCodes.includes(error?.code) ? error.code : 'firebase_admin_lookup_failed';
      return false;
    }
  }),
  check('storage', async () => {
    const client = new S3Client({
      endpoint: process.env.PARADOCX_S3_ENDPOINT, region: process.env.PARADOCX_S3_REGION,
      forcePathStyle: true, credentials: {
        accessKeyId: process.env.PARADOCX_S3_KEY, secretAccessKey: process.env.PARADOCX_S3_SECRET
      }
    });
    try {
      await client.send(new ListObjectsV2Command({ Bucket: 'handout-assets', MaxKeys: 1 }));
      return true;
    } finally { client.destroy(); }
  })
]);
if (results.neon && results.firebaseAuth && results.storage) {
  await check('firebaseRealtimeRules', async () => {
    const { app, config } = firebaseSettings();
    if (!config.databaseURL) return false;
    const expected = JSON.parse(await readFile('firebase.database.rules.json', 'utf8'));
    const db = getDatabase(app);
    const current = await db.getRulesJSON();
    if (equivalent(current, expected)) return true;
    // Never replace a customized ruleset or an already-open database.
    if (!preview || !equivalent(current, { rules: { '.read': false, '.write': false } })) return false;
    await db.setRules(expected);
    return equivalent(await db.getRulesJSON(), expected);
  });
} else {
  results.firebaseRealtimeRules = false;
}
if (production && process.env.PARADOCX_CUTOVER_SYNC === '1') {
  results.originalAssets = false;
  if (results.neon && results.firebaseAuth && results.storage && results.firebaseRealtimeRules) {
    try {
      const { syncOriginalAssets } = await import('./cutover-sync-assets.mjs');
      const counts = await syncOriginalAssets();
      results.originalAssets = true;
      console.log('PARADOCX_ASSET_COPY ' + JSON.stringify(counts));
    } catch { /* fail closed; no errors containing credentials are emitted */ }
  }
}
// Log only fixed boolean outcomes: no configuration values or user records.
console.log('PARADOCX_VALIDATION ' + JSON.stringify(results));
const ready = results.neon && results.firebaseAuth && results.storage &&
  (!production || results.firebaseRealtimeRules) &&
  (results.originalAssets !== false);
process.exit(ready ? 0 : 1);
