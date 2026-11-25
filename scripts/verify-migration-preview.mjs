// Read-only service checks against the isolated ParaDocx preview.
// Install the reviewed, deny-by-default realtime rules only when the database
// has no existing rules beyond the default deny-all policy.
import { readFile } from 'node:fs/promises';
import { firebaseSettings } from '../server/neon-auth.js';
import { rows } from '../server/neon-db.js';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

if (process.env.VERCEL_ENV !== 'preview' ||
    process.env.VERCEL_GIT_COMMIT_REF !== 'migration/neon-firebase-staging' ||
    process.env.PARADOCX_BACKEND !== 'neon') {
  console.log('PARADOCX_VALIDATION: skipped outside isolated preview');
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
  if (connection.role !== 'paradocx_preview_runtime') return false;
  [identity] = await rows("SELECT user_id,email FROM public.master_identity WHERE singleton=true AND username='mestre01'");
  return !!identity?.user_id && !!identity?.email;
});
await Promise.all([
  check('firebaseAuth', async () => {
    const { app, uid } = firebaseSettings();
    const user = await getAuth(app).getUser(uid);
    return !!identity && user.email?.toLowerCase() === identity.email.toLowerCase() && !user.disabled;
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
    if (!equivalent(current, { rules: { '.read': false, '.write': false } })) return false;
    await db.setRules(expected);
    return equivalent(await db.getRulesJSON(), expected);
  });
} else {
  results.firebaseRealtimeRules = false;
}
// Log only fixed boolean outcomes: no configuration values or user records.
console.log('PARADOCX_VALIDATION ' + JSON.stringify(results));
process.exit(results.neon && results.firebaseAuth && results.storage ? 0 : 1);
