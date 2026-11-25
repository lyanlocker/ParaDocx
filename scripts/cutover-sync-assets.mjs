// One-time cutover: restore exact original private files, never delete objects.
// Only a Production build with the explicit migration flag may invoke this.
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const bucket = 'handout-assets';
const assetPath = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:png|jpe?g|webp)$/i;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const mimeFor = path => /\.png$/i.test(path) ? 'image/png' : /\.webp$/i.test(path) ? 'image/webp' : 'image/jpeg';

export async function syncOriginalAssets() {
  if (process.env.VERCEL_ENV !== 'production' ||
      process.env.PARADOCX_CUTOVER_SYNC !== '1' ||
      process.env.PARADOCX_BACKEND !== 'neon') throw new Error('Cutover scope not authorized');
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Original storage unavailable');
  const endpoint = new URL(process.env.SUPABASE_URL);
  if (endpoint.origin !== 'https://eymrckpudysvmlymrlix.supabase.co') throw new Error('Original storage project mismatch');
  let sourceStatus = 'unknown';
  const source = createClient(endpoint.origin, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: async (input, init) => {
      try {
        const response = await fetch(input, init);
        sourceStatus = String(response.status);
        return response;
      } catch (error) {
        sourceStatus = 'network';
        throw error;
      }
    } }
  }).storage.from(bucket);
  const destination = new S3Client({
    endpoint: process.env.PARADOCX_S3_ENDPOINT, region: process.env.PARADOCX_S3_REGION,
    forcePathStyle: true, credentials: {
      accessKeyId: process.env.PARADOCX_S3_KEY,
      secretAccessKey: process.env.PARADOCX_S3_SECRET
    }
  });
  try {
    let all;
    try { all = JSON.parse(process.env.PARADOCX_CUTOVER_ASSET_MANIFEST || 'null'); }
    catch { throw new Error('Original asset manifest invalid'); }
    if (!Array.isArray(all)) throw new Error('Original asset manifest invalid');
    if (!all.length || all.some(o => !assetPath.test(o.path))) throw new Error('Unexpected source assets');
    let copied = 0;
    for (const { path, size } of all) {
      const { data, error } = await source.download(path);
      if (error || !data) {
        const status = ['200','400','401','403','404','429','500','502','503','network'].includes(sourceStatus) ? sourceStatus : 'unknown';
        throw new Error('Original download failed: ' + status);
      }
      const bytes = Buffer.from(await data.arrayBuffer());
      if (!bytes.length || (size != null && bytes.length !== Number(size))) throw new Error('Original asset size mismatch');
      const digest = hash(bytes);
      let same = false;
      try {
        const current = await destination.send(new GetObjectCommand({ Bucket: bucket, Key: path }));
        same = hash(await current.Body.transformToByteArray()) === digest;
      } catch (error) {
        if (![404].includes(error.$metadata?.httpStatusCode) && !['NoSuchKey','NoSuchObject','NotFound'].includes(error.name)) throw error;
      }
      if (!same) {
        await destination.send(new PutObjectCommand({ Bucket: bucket, Key: path, Body: bytes, ContentType: mimeFor(path), CacheControl: 'private, no-store' }));
        copied++;
      }
      const verified = await destination.send(new GetObjectCommand({ Bucket: bucket, Key: path }));
      if (hash(await verified.Body.transformToByteArray()) !== digest) throw new Error('Asset verification failed');
    }
    return { verified: all.length, copied };
  } finally { destination.destroy(); }
}
