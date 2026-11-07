
import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const url = Deno.env.get('SUPABASE_URL');
const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!url || !secret) throw new Error('Missing Supabase runtime configuration');
const admin = createClient(url, secret, {auth:{persistSession:false,autoRefreshToken:false}});
const permittedOrigins = new Set([
  'https://paradocx-ten.vercel.app',
  'https://paradocx-pinklockers-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);
const originAllowed = (origin) => permittedOrigins.has(origin) || /^https:\/\/paradocx-[a-z0-9-]+-pinklockers-projects\.vercel\.app$/.test(origin);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const tokenPattern = /^[a-f0-9]{64}$/;

function headers(origin) {
  const allowed = origin && originAllowed(origin);
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
    ...(allowed ? {'Access-Control-Allow-Origin':origin} : {}),
    'Access-Control-Allow-Headers': 'content-type, apikey, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
function json(payload, status=200, origin) { return new Response(JSON.stringify(payload),{status,headers:headers(origin)}); }
async function hashToken(token) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (origin && !originAllowed(origin)) return json({error:'Origem não autorizada'},403,origin);
  if (req.method==='OPTIONS') return new Response(null,{status:204,headers:headers(origin)});
  if (req.method!=='POST') return json({error:'Método não permitido'},405,origin);
  try {
    const body = await req.json();
    const token = typeof body?.token==='string' ? body.token : '';
    if (!tokenPattern.test(token)) return json({error:'Link de jogador inválido'},401,origin);
    const tokenHash = await hashToken(token);
    const {data:seat,error:seatErr} = await admin.from('player_seats')
      .select('id,campaign_id,display_name')
      .eq('token_hash',tokenHash).eq('enabled',true).maybeSingle();
    if (seatErr) throw seatErr;
    if (!seat) return json({error:'Este link foi revogado ou é inválido'},401,origin);
    if (body.action==='asset') {
      if (typeof body.document_id !== 'string' || !uuid.test(body.document_id) ||
          (body.side !== 'front' && body.side !== 'back')) {
        return json({error:'Documento ou lado inválido'},400,origin);
      }
      const {data:doc,error:docError}=await admin.from('documents')
        .select('id,campaign_id,holder_seat_id,is_published,pages')
        .eq('id',body.document_id).eq('campaign_id',seat.campaign_id)
        .eq('holder_seat_id',seat.id).eq('is_published',true).maybeSingle();
      if (docError) throw docError;
      if (!doc) return json({error:'Documento indisponível para este jogador'},403,origin);
      const path=doc.pages?.backgrounds?.[body.side];
      if (typeof path !== 'string' || !path.startsWith(seat.campaign_id+'/') ||
          !/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(webp|png|jpg)$/i.test(path)) {
        return json({error:'Esta face não tem arquivo importado'},404,origin);
      }
      const downloaded=await admin.storage.from('handout-assets').download(path);
      if (downloaded.error || !downloaded.data) return json({error:'Imagem indisponível'},404,origin);
      const type=downloaded.data.type;
      if(!['image/webp','image/jpeg','image/png'].includes(type))
        return json({error:'Formato de imagem inválido'},415,origin);
      return new Response(downloaded.data,{status:200,headers:{
        ...headers(origin),'Content-Type':type,'X-Content-Type-Options':'nosniff',
        'Content-Disposition':'inline','Cache-Control':'no-store, private'
      }});
    }
    if (body.action==='transfer') {
      if (typeof body.document_id!=='string'||!uuid.test(body.document_id)||
          typeof body.recipient_id!=='string'||!uuid.test(body.recipient_id)) {
        return json({error:'Documento ou destinatário inválido'},400,origin);
      }
      const {error} = await admin.rpc('transfer_document_by_player',{
        p_token_hash:tokenHash,
        p_document:body.document_id,
        p_recipient:body.recipient_id,
      });
      if(error) return json({error:'Não foi possível transferir este documento'},403,origin);
      return json({ok:true},200,origin);
    }
    if (body.action !== 'panel') return json({error:'Ação não reconhecida'},400,origin);
    const [campaign,players,documents] = await Promise.all([
      admin.from('campaigns').select('name,id').eq('id',seat.campaign_id).single(),
      admin.from('player_seats').select('id,display_name').eq('campaign_id',seat.campaign_id).eq('enabled',true).order('created_at'),
      admin.from('documents').select('id,title,template,pages,updated_at').eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).order('created_at',{ascending:false}),
    ]);
    if (campaign.error || players.error || documents.error) throw (campaign.error||players.error||documents.error);
    return json({
      campaign:{name:campaign.data.name},
      player:{id:seat.id,name:seat.display_name},
      players:players.data.filter(p=>p.id!==seat.id),
      documents:documents.data,
    },200,origin);
  } catch (_error) {
    return json({error:'Não foi possível abrir o arquivo agora'},500,origin);
  }
});
