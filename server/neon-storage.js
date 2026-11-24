import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const imageTypes=new Set(['image/png','image/jpeg','image/webp']);
export const assetLimit=4*1024*1024;
export const assetPath=/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:png|jpe?g|webp)$/i;
const bucket='handout-assets';
function client(){
  const endpoint=process.env.PARADOCX_S3_ENDPOINT,accessKeyId=process.env.PARADOCX_S3_KEY,secretAccessKey=process.env.PARADOCX_S3_SECRET,region=process.env.PARADOCX_S3_REGION;
  if(!endpoint||!accessKeyId||!secretAccessKey||!region)throw new Error('Armazenamento indisponível');
  return new S3Client({endpoint,region,forcePathStyle:true,credentials:{accessKeyId,secretAccessKey}});
}
function key(path){if(typeof path!=='string'||!assetPath.test(path))throw new Error('Caminho inválido');return {Bucket:bucket,Key:path};}
export async function uploadAsset(path,bytes,type,{upsert=false}={}){
  if(!imageTypes.has(type)||bytes.byteLength>assetLimit||!bytes.byteLength)throw new Error('Imagem inválida');
  await client().send(new PutObjectCommand({...key(path),Body:bytes,ContentType:type,CacheControl:'private, no-store',...(upsert?{}:{IfNoneMatch:'*'})}));
}
export async function downloadAsset(path){
  const r=await client().send(new GetObjectCommand(key(path)));
  if(!imageTypes.has(r.ContentType)||!r.Body||Number(r.ContentLength)>assetLimit)throw new Error('Imagem indisponível');
  const bytes=await r.Body.transformToByteArray();
  if(bytes.byteLength>assetLimit)throw new Error('Imagem excede o limite');
  return new Blob([bytes],{type:r.ContentType});
}
export async function signedAsset(path){
  const s3=client();const details=await s3.send(new HeadObjectCommand(key(path)));
  if(!imageTypes.has(details.ContentType))throw new Error('Imagem inválida');
  return getSignedUrl(s3,new GetObjectCommand(key(path)),{expiresIn:300});
}
export async function removeAsset(path){await client().send(new DeleteObjectCommand(key(path)));}
export const storage={from(name){
  if(name!==bucket)throw new Error('Repositório inválido');
  return {
    async upload(path,bytes,options={}){try{await uploadAsset(path,bytes,options.contentType,{upsert:options.upsert});return {error:null};}catch(error){return {error};}},
    async download(path){try{return {data:await downloadAsset(path),error:null};}catch(error){return {data:null,error};}},
  };
}};
