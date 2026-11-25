import { cert,getApps,initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { rows } from './neon-db.js';

export const fail=(message,status=400)=>Object.assign(new Error(message),{status});
export function firebaseSettings(){
  const credential=JSON.parse(process.env.PARADOCX_FIREBASE_SERVICE_ACCOUNT||'null');
  const config=JSON.parse(process.env.PARADOCX_FIREBASE_WEB_CONFIG||'null');
  const uid=process.env.PARADOCX_MASTER_FIREBASE_UID;
  if(!credential?.project_id||config?.projectId!==credential.project_id||!config?.apiKey||!uid)throw fail('Autenticação ainda não configurada.',503);
  const name='paradocx-admin';
  const app=getApps().find(x=>x.name===name)||initializeApp({credential:cert(credential),projectId:config.projectId,databaseURL:config.databaseURL},name);
  return {app,config,uid};
}
async function masterIdentity(){
  const [identity]=await rows('SELECT user_id,email FROM public.master_identity WHERE singleton=true AND username=$1',['mestre01']);
  if(!identity)throw fail('O acesso do mestre ainda não foi migrado.',503);
  return identity;
}
export async function authorizeMaster(req){
  const token=req.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if(!token||token.length>8192)throw fail('Acesso não autorizado',401);
  const {app,uid}=firebaseSettings();
  let decoded;try{decoded=await getAuth(app).verifyIdToken(token,true);}catch{throw fail('Acesso não autorizado',401);}
  if(decoded.uid!==uid)throw fail('Acesso não autorizado',403);
  return masterIdentity();
}
// The migrated UUID is preserved. Only the preconfigured Firebase identity
// can be used to access it; there is no public signup or email-only matching.
export async function loginMaster(username,password){
  if(username!=='mestre01'||typeof password!=='string'||password.length<1||password.length>128)throw fail('Usuário ou senha incorretos',401);
  const {app,config,uid}=firebaseSettings(),identity=await masterIdentity();
  const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(config.apiKey)}`,{
    method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(12000),
    body:JSON.stringify({email:identity.email,password,returnSecureToken:true}),
  });
  if(!response.ok)throw fail('Usuário ou senha incorretos',401);
  const result=await response.json();
  if(result.localId!==uid||!result.idToken)throw fail('Usuário ou senha incorretos',401);
  const verified=await getAuth(app).verifyIdToken(result.idToken,true);
  if(verified.uid!==uid)throw fail('Usuário ou senha incorretos',401);
  const customToken=await getAuth(app).createCustomToken(uid);
  return {customToken,config:{projectId:config.projectId,apiKey:config.apiKey,appId:config.appId,authDomain:config.authDomain,databaseURL:config.databaseURL},user:{id:identity.user_id,email:identity.email}};
}
