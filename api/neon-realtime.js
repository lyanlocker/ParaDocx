import {authorizeMaster,fail} from '../server/neon-auth.js';
import {sameOrigin,readJson,json,errorResponse} from '../server/neon-http.js';
import {makeDb} from '../server/neon-db.js';
import {authorizeSeat} from './neon-player.js';
import {ownedCampaign} from '../server/neon-master.js';
import {realtimeSession,enabled} from '../server/neon-realtime.js';

export default {async fetch(req){
 try{sameOrigin(req);if(!enabled())throw fail('Sincronização indisponível',503);const b=await readJson(req,2048);
  if(b.token){const {seat,tokenHash}=await authorizeSeat(makeDb(null),b.token);return json(await realtimeSession(seat.campaign_id,tokenHash));}
  const master=await authorizeMaster(req),campaign=await ownedCampaign(b.campaign_id,master);return json(await realtimeSession(campaign.id,master.user_id));
 }catch(e){return errorResponse(e);}
}};
