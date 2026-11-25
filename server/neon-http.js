import { fail } from './neon-auth.js';

export const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const shaToken=/^[a-f0-9]{64}$/;
export const validId=v=>{if(typeof v!=='string'||!uuid.test(v))throw fail('Identificador inválido');return v;};
export function sameOrigin(req){
  if(process.env.PARADOCX_BACKEND!=='neon')throw fail('Backend indisponível',503);
  if(req.method!=='POST')throw fail('Método inválido',405);
  const origin=req.headers.get('origin');
  if(origin&&origin!==new URL(req.url).origin)throw fail('Origem inválida',403);
  if(req.headers.get('sec-fetch-site')==='cross-site')throw fail('Origem inválida',403);
}
export async function readBytes(req,limit){
  if(Number(req.headers.get('content-length'))>limit)throw fail('Envio muito grande',413);
  if(!req.body)throw fail('Envio inválido');
  const reader=req.body.getReader();const chunks=[];let size=0;
  try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw fail('Envio muito grande',413);}chunks.push(value);}}
  finally{reader.releaseLock();}
  return Buffer.concat(chunks,size);
}
export async function readJson(req,limit=4*1024*1024){
  let result;try{result=JSON.parse((await readBytes(req,limit)).toString('utf8'));}catch(error){if(error.status)throw error;throw fail('Envio inválido');}
  if(!result||typeof result!=='object'||Array.isArray(result))throw fail('Envio inválido');return result;
}
export function json(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
export function errorResponse(e){return json({error:e.status?e.message:'Não foi possível completar a operação.'},e.status||503);}
