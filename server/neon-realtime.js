import {createHash,randomUUID} from 'node:crypto';
import {getAuth} from 'firebase-admin/auth';
import {getDatabase} from 'firebase-admin/database';
import {firebaseSettings,fail} from './neon-auth.js';
import {uuid} from './neon-http.js';
const hash=value=>createHash('sha256').update(value).digest('hex');
export function enabled(){return process.env.PARADOCX_REALTIME==='firebase'&&process.env.PARADOCX_BACKEND==='neon';}
function environment(){const env=process.env.PARADOCX_FIREBASE_ENV;if(!['preview','production'].includes(env)||(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!==env))throw fail('Sincronização indisponível',503);return env;}
export async function realtimeSession(campaign,proof){
 if(!enabled()||!uuid.test(campaign))throw fail('Sincronização indisponível',503);
 const {app,config}=firebaseSettings(),env=environment(),channel=hash(`campaign:${campaign}`),until=Date.now()+15*60_000;
 const uid=`pd_live_${hash(`${env}:${campaign}:${proof}`)}`;
 const token=await getAuth(app).createCustomToken(uid,{environment:env,campaign:channel,until});
 return {token,config:{projectId:config.projectId,apiKey:config.apiKey,appId:config.appId,authDomain:config.authDomain,databaseURL:config.databaseURL},path:`signals/${env}/${channel}`,expiresAt:until};
}
export async function signalCampaign(campaign){
 if(!enabled()||!uuid.test(campaign||''))return;
 try{const {app}=firebaseSettings(),env=environment();await Promise.race([getDatabase(app).ref(`signals/${env}/${hash(`campaign:${campaign}`)}`).set(randomUUID()),new Promise((_,reject)=>setTimeout(()=>reject(Error('Timeout')),1500))]);}catch{/* Neon is authoritative; polling remains active on failure. */}
}
