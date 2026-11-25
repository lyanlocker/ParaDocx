import { rows } from './neon-db.js';
import { fail } from './neon-auth.js';
import { validId,uuid } from './neon-http.js';
import { assetPath,signedAsset,removeAsset } from './neon-storage.js';

const affinities=new Set(['none','sangue','energia','medo','morte','conhecimento']);
const name=(value,min,max)=>{if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw fail('Nome inválido');return value.trim();};
const limit=value=>{if(!Number.isInteger(value)||value<1||value>30)throw fail('Limite inválido');return value;};
const first=records=>{if(!records[0])throw fail('Registro indisponível',403);return records[0];};
export async function ownedCampaign(id,actor){return first(await rows('SELECT id FROM public.campaigns WHERE id=$1::uuid AND owner_id=$2::uuid',[validId(id),actor.user_id]));}
async function ownedDocument(id,actor){return first(await rows('SELECT d.id,d.campaign_id FROM public.documents d JOIN public.campaigns c ON c.id=d.campaign_id WHERE d.id=$1::uuid AND c.owner_id=$2::uuid',[validId(id),actor.user_id]));}
export async function ownedAsset(path,actor){if(typeof path!=='string'||!assetPath.test(path))throw fail('Imagem inválida');await ownedCampaign(path.split('/')[0],actor);return path;}
function checkedPages(pages,cid){
  if(!pages||typeof pages!=='object'||!Array.isArray(pages.front)||!Array.isArray(pages.back)||pages.front.length>1000||pages.back.length>1000)throw fail('Páginas inválidas');
  const paths=[...Object.values(pages.backgrounds||{}),...pages.front.filter(l=>l?.kind==='image').map(l=>l.assetPath),...pages.back.filter(l=>l?.kind==='image').map(l=>l.assetPath)].filter(Boolean);
  if(paths.some(path=>typeof path!=='string'||!assetPath.test(path)||!path.startsWith(cid+'/')))throw fail('Imagem de outra campanha');
  return JSON.stringify(pages);
}
export async function masterOperation(body,actor){
  const id=actor.user_id, data=body.data||{};
  switch(body.op){
    case 'campaign-list':return rows('SELECT * FROM public.campaigns WHERE owner_id=$1::uuid ORDER BY created_at DESC',[id]);
    case 'campaign-create':return first(await rows('INSERT INTO public.campaigns(name,owner_id,max_players) VALUES ($1,$2::uuid,$3) RETURNING *',[name(data.name,2,120),id,limit(data.max_players)]));
    case 'campaign-limit':return first(await rows('UPDATE public.campaigns c SET max_players=$1 WHERE id=$2::uuid AND owner_id=$3::uuid AND $1 >= (SELECT count(*) FROM public.player_seats p WHERE p.campaign_id=c.id AND p.enabled) RETURNING *',[limit(data.max_players),validId(body.id),id]));
    case 'members-list':await ownedCampaign(body.id,actor);return rows('SELECT * FROM public.members WHERE campaign_id=$1::uuid',[body.id]);
    case 'documents-list':await ownedCampaign(body.id,actor);return rows('SELECT * FROM public.documents WHERE campaign_id=$1::uuid ORDER BY created_at DESC',[body.id]);
    case 'seats-list':await ownedCampaign(body.id,actor);return rows('SELECT id,campaign_id,display_name,enabled,created_at,affinity FROM public.player_seats WHERE campaign_id=$1::uuid ORDER BY created_at',[body.id]);
    case 'seat-create':return first(await rows('SELECT public.paradocx_create_seat($1::uuid,$2::uuid,$3::text) AS result',[id,validId(data.p_campaign),name(data.p_name,1,60)])).result;
    case 'seat-rotate':return first(await rows('SELECT public.paradocx_rotate_seat($1::uuid,$2::uuid) AS result',[id,validId(data.p_seat)])).result;
    case 'seat-remove':await rows('SELECT public.paradocx_remove_seat($1::uuid,$2::uuid)',[id,validId(data.p_seat)]);return null;
    case 'seat-affinity':if(!affinities.has(data.affinity))throw fail('Afinidade inválida');return first(await rows('UPDATE public.player_seats p SET affinity=$1 FROM public.campaigns c WHERE p.id=$2::uuid AND p.campaign_id=c.id AND p.enabled AND c.owner_id=$3::uuid RETURNING p.id',[data.affinity,validId(body.id),id]));
    case 'document-create':{
      const cid=validId(data.campaign_id);await ownedCampaign(cid,actor);
      return first(await rows('INSERT INTO public.documents(campaign_id,title,template,pages,created_by) VALUES ($1::uuid,$2,$3,$4::jsonb,$5::uuid) RETURNING *',[cid,name(data.title,1,150),name(data.template,1,100),checkedPages(data.pages,cid),id]));
    }
    case 'document-update':{
      const doc=await ownedDocument(body.id,actor);
      return first(await rows('UPDATE public.documents d SET title=$1,template=$2,pages=$3::jsonb FROM public.campaigns c WHERE d.id=$4::uuid AND d.campaign_id=c.id AND c.owner_id=$5::uuid RETURNING d.*',[name(data.title,1,150),name(data.template,1,100),checkedPages(data.pages,doc.campaign_id),doc.id,id]));
    }
    case 'document-assign':{
      const seat=data.holder_seat_id===null?null:validId(data.holder_seat_id);
      return first(await rows('UPDATE public.documents d SET holder_seat_id=$1::uuid,holder_id=NULL,is_published=($1::uuid IS NOT NULL) FROM public.campaigns c WHERE d.id=$2::uuid AND d.campaign_id=c.id AND c.owner_id=$3::uuid AND ($1::uuid IS NULL OR EXISTS(SELECT 1 FROM public.player_seats p WHERE p.id=$1::uuid AND p.campaign_id=d.campaign_id AND p.enabled)) RETURNING d.id',[seat,validId(body.id),id]));
    }
    case 'document-delete':return first(await rows('DELETE FROM public.documents d USING public.campaigns c WHERE d.id=$1::uuid AND d.campaign_id=c.id AND c.owner_id=$2::uuid RETURNING d.id',[validId(body.id),id]));
    case 'asset-url':return {signedUrl:await signedAsset(await ownedAsset(data.path,actor))};
    case 'asset-cleanup':{
      if(!Array.isArray(data.paths)||data.paths.length>100)throw fail('Arquivos inválidos');
      for(const path of data.paths){await ownedAsset(path,actor);
        // Only unreferenced staged uploads may be cleaned up; existing files
        // remain untouched even if a document save failed.
        const [used]=await rows('SELECT EXISTS(SELECT 1 FROM public.documents WHERE campaign_id=$1::uuid AND pages::text LIKE $2) AS used',[path.split('/')[0],`%${path}%`]);
        if(!used.used)await removeAsset(path);
      }return null;
    }
    default:throw fail('Operação inválida',404);
  }
}
