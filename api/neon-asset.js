import {authorizeMaster,fail} from '../server/neon-auth.js';
import {sameOrigin,readBytes,json,errorResponse} from '../server/neon-http.js';
import {ownedAsset} from '../server/neon-master.js';
import {uploadAsset,assetLimit,imageTypes} from '../server/neon-storage.js';

export default {async fetch(req){
  try{
    sameOrigin(req);const master=await authorizeMaster(req);const path=await ownedAsset(req.headers.get('x-asset-path'),master);
    const mime=req.headers.get('content-type');if(!imageTypes.has(mime))throw fail('Formato inválido',415);
    const bytes=await readBytes(req,assetLimit);
    const realMime=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'?'image/webp':null;
    if(mime!==realMime)throw fail('Formato inválido',415);
    await uploadAsset(path,bytes,mime);return json({ok:true});
  }catch(e){return errorResponse(e);}
}};
