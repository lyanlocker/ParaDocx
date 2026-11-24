import {authorizeMaster,loginMaster,firebaseSettings,fail} from '../server/neon-auth.js';
import {sameOrigin,readJson,json,errorResponse} from '../server/neon-http.js';
import {masterOperation} from '../server/neon-master.js';
import {signalCampaign} from '../server/neon-realtime.js';
import {rows} from '../server/neon-db.js';
import {uuid} from '../server/neon-http.js';

export default {async fetch(req){
  try{
    sameOrigin(req);const body=await readJson(req);
    if(body.action==='config'){
      const {config}=firebaseSettings();
      return json({config:{projectId:config.projectId,apiKey:config.apiKey,appId:config.appId,authDomain:config.authDomain,databaseURL:config.databaseURL}});
    }
    if(body.action==='login')return json(await loginMaster(body.username,body.password));
    if(body.action==='setup')throw fail('O mestre existente precisa ser vinculado ao Firebase pela administração.',403);
    const actor=await authorizeMaster(req);
    if(body.action==='session')return json({user:{id:actor.user_id,email:actor.email}});
    if(body.action!=='data')throw fail('Operação inválida');
    // Derive the campaign exclusively from server-confirmed records/ownership.
    let campaign;
    if(['document-assign','document-update','document-delete'].includes(body.op)&&uuid.test(body.id||'')){
      const [doc]=await rows('SELECT d.campaign_id FROM public.documents d JOIN public.campaigns c ON c.id=d.campaign_id WHERE d.id=$1::uuid AND c.owner_id=$2::uuid',[body.id,actor.user_id]);campaign=doc?.campaign_id;
    }else if(['seat-affinity','seat-rotate','seat-remove'].includes(body.op)){
      const seat=body.id||body.data?.p_seat;
      if(uuid.test(seat||'')){const [row]=await rows('SELECT p.campaign_id FROM public.player_seats p JOIN public.campaigns c ON c.id=p.campaign_id WHERE p.id=$1::uuid AND c.owner_id=$2::uuid',[seat,actor.user_id]);campaign=row?.campaign_id;}
    }
    const result=await masterOperation(body,actor);
    if(body.op==='document-create')campaign=result?.campaign_id;
    if(body.op==='seat-create')campaign=body.data?.p_campaign;
    if(body.op==='campaign-limit')campaign=result?.id;
    if(campaign)await signalCampaign(campaign);
    return json({data:result});
  }catch(e){return errorResponse(e);}
}};
