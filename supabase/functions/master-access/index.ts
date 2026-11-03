
import {createClient} from 'npm:@supabase/supabase-js@2.57.0';
const url=Deno.env.get('SUPABASE_URL');
const adminKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const publicKey=Deno.env.get('SUPABASE_ANON_KEY');
if(!url||!adminKey||!publicKey)throw new Error('Supabase credentials missing');
const admin=createClient(url,adminKey,{auth:{persistSession:false,autoRefreshToken:false}});
const allow=new Set(['https://paradocx-ten.vercel.app','https://paradocx-pinklockers-projects.vercel.app','http://localhost:5173','http://127.0.0.1:5173']);
const allowedOrigin=(o)=>allow.has(o)||/^https:\/\/paradocx-[a-z0-9-]+-pinklockers-projects\.vercel\.app$/.test(o||'');
const hdr=o=>({'content-type':'application/json','cache-control':'no-store','vary':'Origin',
 ...(allowedOrigin(o)?{'Access-Control-Allow-Origin':o}:{}),
 'Access-Control-Allow-Headers':'content-type, apikey, x-client-info',
 'Access-Control-Allow-Methods':'POST, OPTIONS'});
const response=(body,status,o)=>new Response(JSON.stringify(body),{status,headers:hdr(o)});
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');
Deno.serve(async req=>{
 const origin=req.headers.get('Origin');
 if(origin&&!allowedOrigin(origin))return response({error:'Origem inválida'},403,origin);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:hdr(origin)});
 if(req.method!=='POST')return response({error:'Método inválido'},405,origin);
 try{
 const body=await req.json();
 if(body.action==='setup'){
  const token=body.token;
  const email=String(body.email||'').trim().toLowerCase();
  const password=String(body.password||'');
  if(!/^[0-9a-f]{64}$/.test(token||''))return response({error:'Ativação inválida'},401,origin);
  if(!/^\S+@\S+\.\S+$/.test(email)||password.length<12||password.length>128)return response({error:'Informe um e-mail válido e uma senha de pelo menos 12 caracteres'},400,origin);
  const [identity,setup]=await Promise.all([
   admin.from('master_identity').select('user_id').limit(1).maybeSingle(),
   admin.from('master_setup_token').select('token_hash,consumed_at').eq('singleton',true).maybeSingle(),
  ]);
  if(identity.error||setup.error)throw new Error('Setup lookup');
  if(identity.data||!setup.data||setup.data.consumed_at||(await hash(token))!==setup.data.token_hash)
   return response({error:'A ativação foi utilizada ou não é válida'},401,origin);
  const created=await admin.auth.admin.createUser({email,password,email_confirm:true});
  if(created.error||!created.data?.user)return response({error:'Não foi possível criar a conta do mestre. Confira o e-mail utilizado.'},400,origin);
  const userId=created.data.user.id;
  const inserted=await admin.from('master_identity').insert({singleton:true,user_id:userId,username:'mestre01',email});
  if(inserted.error){
   await admin.auth.admin.deleteUser(userId);
   return response({error:'O acesso do mestre já foi configurado'},409,origin);
  }
  await admin.from('master_setup_token').update({consumed_at:new Date().toISOString()}).eq('singleton',true);
  return response({ok:true,username:'mestre01'},200,origin);
 }
 if(body.action==='login'){
  if(body.username!=='mestre01'||typeof body.password!=='string'||body.password.length<1)
    return response({error:'Usuário ou senha incorretos'},401,origin);
  const account=await admin.from('master_identity').select('email').eq('singleton',true).maybeSingle();
  if(account.error)throw new Error('Missing account');
  if(!account.data)return response({error:'O acesso do mestre ainda não foi ativado'},403,origin);
  const auth=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await auth.auth.signInWithPassword({email:account.data.email,password:body.password});
  if(error||!data?.session)return response({error:'Usuário ou senha incorretos'},401,origin);
  return response({access_token:data.session.access_token,refresh_token:data.session.refresh_token},200,origin);
 }
 return response({error:'Ação inválida'},400,origin);
 }catch(_e){return response({error:'Não foi possível completar o acesso neste momento'},500,origin);}
});
