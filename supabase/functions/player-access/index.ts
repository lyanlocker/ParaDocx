
import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

import {filterPages,resolveAssetPath} from './visibility.js';
import {handleMechanics} from './mechanics-api.js';

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
    'Access-Control-Allow-Headers': 'content-type, apikey, x-client-info, authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
function json(payload, status=200, origin) { return new Response(JSON.stringify(payload),{status,headers:headers(origin)}); }
async function hashToken(token) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
}
// Training rewards remain hidden outside their training session. Ordinary
// documents and real campaign rewards preserve their original access rules.
async function trainingDocumentAllowed(doc,seat){
  if(!doc.mechanic_session_id)return true;
  const {data,error}=await admin.from('mechanic_sessions').select('training,active,participants').eq('id',doc.mechanic_session_id).eq('campaign_id',seat.campaign_id).maybeSingle();
  return !error&&!!data&&(!data.training||(data.active&&data.participants.includes(seat.id)));
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (origin && !originAllowed(origin)) return json({error:'Origem não autorizada'},403,origin);
  if (req.method==='OPTIONS') return new Response(null,{status:204,headers:headers(origin)});
  if (req.method!=='POST') return json({error:'Método não permitido'},405,origin);
  try {
    const body = await req.json();
    if (body.action==='mechanics-master') {
      const bearer=req.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
      if(!bearer||!uuid.test(body.campaign_id||''))return json({error:'Acesso não autorizado'},401,origin);
      const {data:{user},error}=await admin.auth.getUser(bearer);
      if(error||!user)return json({error:'Acesso não autorizado'},401,origin);
      const {data:owned}=await admin.from('campaigns').select('id').eq('id',body.campaign_id).eq('owner_id',user.id).maybeSingle();
      if(!owned)return json({error:'Campanha indisponível'},403,origin);
      try{return json(await handleMechanics(admin,body,{master:true,id:user.id,campaign:owned.id}),200,origin);}
      catch(e){return json({error:e.status?e.message:'Não foi possível processar a sessão.'},e.status||500,origin);}
    }
    const token = typeof body?.token==='string' ? body.token : '';
    if (!tokenPattern.test(token)) return json({error:'Link de jogador inválido'},401,origin);
    const tokenHash = await hashToken(token);
    const {data:seat,error:seatErr} = await admin.from('player_seats')
      .select('id,campaign_id,display_name,affinity')
      .eq('token_hash',tokenHash).eq('enabled',true).maybeSingle();
    if (seatErr) throw seatErr;
    if (!seat) return json({error:'Este link foi revogado ou é inválido'},401,origin);
    if(body.action==='mechanics'){
      try{return json(await handleMechanics(admin,body,{master:false,id:seat.id,campaign:seat.campaign_id,tokenHash}),200,origin);}
      catch(e){return json({error:e.status?e.message:'Não foi possível processar a sessão.'},e.status||500,origin);}
    }
    if (body.action==='asset') {
      if (typeof body.document_id !== 'string' || !uuid.test(body.document_id) ||
          (body.side !== 'front' && body.side !== 'back')) {
        return json({error:'Documento ou lado inválido'},400,origin);
      }
      const {data:doc,error:docError}=await admin.from('documents')
        .select('id,campaign_id,holder_seat_id,is_published,pages,mechanic_session_id')
        .eq('id',body.document_id).eq('campaign_id',seat.campaign_id)
        .eq('holder_seat_id',seat.id).eq('is_published',true).maybeSingle();
      if (docError) throw docError;
      if (!doc||!await trainingDocumentAllowed(doc,seat)) return json({error:'Documento indisponível para este jogador'},403,origin);
      const path=resolveAssetPath(doc,seat,body.side,body.layer_id);
      if (!path) return json({error:'Imagem indisponível para este jogador'},404,origin);
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
      const {data:doc}=await admin.from('documents').select('mechanic_session_id').eq('id',body.document_id).eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).maybeSingle();
      if(!doc||!await trainingDocumentAllowed(doc,seat))return json({error:'Documento indisponível'},403,origin);
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
      admin.from('documents').select('id,title,template,pages,updated_at,mechanic_session_id').eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).order('created_at',{ascending:false}),
    ]);
    if (campaign.error || players.error || documents.error) throw (campaign.error||players.error||documents.error);
    const visible=(await Promise.all(documents.data.map(async doc=>{if(!await trainingDocumentAllowed(doc,seat))return null;const {mechanic_session_id,...safe}=doc;return {...safe,pages:filterPages(doc.pages,seat.affinity)};}))).filter(Boolean);
    return json({
      campaign:{name:campaign.data.name},
      player:{id:seat.id,name:seat.display_name,affinity:seat.affinity},
      players:players.data.filter(p=>p.id!==seat.id),
      documents:visible,
    },200,origin);
  } catch (_error) {
    return json({error:'Não foi possível abrir o arquivo agora'},500,origin);
  }
});
