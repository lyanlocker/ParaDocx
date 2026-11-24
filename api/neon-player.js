import {createHash} from 'node:crypto';
import {makeDb} from '../server/neon-db.js';
import {storage} from '../server/neon-storage.js';
import {authorizeMaster,fail} from '../server/neon-auth.js';
import {sameOrigin,readJson,json,errorResponse,uuid,shaToken} from '../server/neon-http.js';
import {filterPages,resolveAssetPath} from '../supabase/functions/player-access/visibility.js';
import {handleMechanics} from '../supabase/functions/player-access/mechanics-api.js';
import {signalCampaign} from '../server/neon-realtime.js';

const checked=({data,error})=>{if(error)throw error;return data;};
async function trainingDocumentAllowed(admin,doc,seat){
  if(!doc.mechanic_session_id)return true;
  const data=checked(await admin.from('mechanic_sessions').select('training,active,participants').eq('id',doc.mechanic_session_id).eq('campaign_id',seat.campaign_id).maybeSingle());
  return !!data&&(!data.training||(data.active&&data.participants.includes(seat.id)));
}
export async function authorizeSeat(admin,token){
  if(typeof token!=='string'||!shaToken.test(token))throw fail('Link de jogador inválido',401);
  const tokenHash=createHash('sha256').update(token).digest('hex');
  const seat=checked(await admin.from('player_seats').select('id,campaign_id,display_name,affinity').eq('token_hash',tokenHash).eq('enabled',true).maybeSingle());
  if(!seat)throw fail('Este link foi revogado ou é inválido',401);
  return {seat,tokenHash};
}
export default {async fetch(req){
  try{
    sameOrigin(req);const body=await readJson(req),admin=makeDb(storage);
    if(body.action==='mechanics-master'){
      const master=await authorizeMaster(req);
      if(!uuid.test(body.campaign_id||''))throw fail('Campanha inválida');
      const owned=checked(await admin.from('campaigns').select('id').eq('id',body.campaign_id).eq('owner_id',master.user_id).maybeSingle());
      if(!owned)throw fail('Campanha indisponível',403);
      const result=await handleMechanics(admin,body,{master:true,id:master.user_id,campaign:owned.id});
      if(['create','activate','act'].includes(body.op))await signalCampaign(owned.id);
      return json(result);
    }
    const {seat,tokenHash}=await authorizeSeat(admin,body.token);
    if(body.action==='mechanics'){
      const result=await handleMechanics(admin,body,{master:false,id:seat.id,campaign:seat.campaign_id,tokenHash});
      if(body.op==='act')await signalCampaign(seat.campaign_id);
      return json(result);
    }
    if(body.action==='asset'){
      if(!uuid.test(body.document_id||'')||!['front','back'].includes(body.side))throw fail('Documento ou lado inválido');
      const doc=checked(await admin.from('documents').select('id,campaign_id,holder_seat_id,is_published,pages,mechanic_session_id').eq('id',body.document_id).eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).maybeSingle());
      if(!doc||!await trainingDocumentAllowed(admin,doc,seat))throw fail('Documento indisponível para este jogador',403);
      const path=resolveAssetPath(doc,seat,body.side,body.layer_id);
      if(!path)throw fail('Imagem indisponível',404);
      const {data,error}=await storage.from('handout-assets').download(path);
      if(error||!data)throw fail('Imagem indisponível',404);
      return new Response(data,{headers:{'Content-Type':data.type,'X-Content-Type-Options':'nosniff','Content-Disposition':'inline','Cache-Control':'private, no-store'}});
    }
    if(body.action==='transfer'){
      if(!uuid.test(body.document_id||'')||!uuid.test(body.recipient_id||''))throw fail('Documento ou destinatário inválido');
      const doc=checked(await admin.from('documents').select('mechanic_session_id').eq('id',body.document_id).eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).maybeSingle());
      if(!doc||!await trainingDocumentAllowed(admin,doc,seat))throw fail('Documento indisponível',403);
      const result=await admin.rpc('transfer_document_by_player',{p_token_hash:tokenHash,p_document:body.document_id,p_recipient:body.recipient_id});
      if(result.error||!result.data)throw fail('Não foi possível transferir este documento',403);
      await signalCampaign(seat.campaign_id);
      return json({ok:true});
    }
    if(body.action!=='panel')throw fail('Ação não reconhecida');
    const [campaign,players,documents]=await Promise.all([
      admin.from('campaigns').select('name,id').eq('id',seat.campaign_id).single(),
      admin.from('player_seats').select('id,display_name').eq('campaign_id',seat.campaign_id).eq('enabled',true).order('created_at'),
      admin.from('documents').select('id,title,template,pages,updated_at,mechanic_session_id').eq('campaign_id',seat.campaign_id).eq('holder_seat_id',seat.id).eq('is_published',true).order('created_at',{ascending:false}),
    ]);
    const visible=(await Promise.all(checked(documents).map(async doc=>{
      if(!await trainingDocumentAllowed(admin,doc,seat))return null;
      const {mechanic_session_id,...safe}=doc;return {...safe,pages:filterPages(doc.pages,seat.affinity)};
    }))).filter(Boolean);
    return json({campaign:{name:checked(campaign).name},player:{id:seat.id,name:seat.display_name,affinity:seat.affinity},players:checked(players).filter(p=>p.id!==seat.id),documents:visible});
  }catch(e){return errorResponse(e);}
}};
