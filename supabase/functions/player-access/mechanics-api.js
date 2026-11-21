import {createState,validateConfig,transition,playerView,reconcile,stages} from './mechanics.js';

const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const checked=({data,error})=>{if(error)throw fail('Não foi possível sincronizar a sessão.',503);return data;};
async function papers(db,row){
 const ids=Object.values(row.state.papers);
 return ids.length?checked(await db.from('documents').select('id,holder_seat_id,is_published').eq('campaign_id',row.campaign_id).eq('mechanic_session_id',row.id).in('id',ids)):[];
}
async function getRow(db,campaign,id){
 let q=db.from('mechanic_sessions').select('*').eq('campaign_id',campaign);
 q=id?q.eq('id',id):q.eq('active',true);
 return checked(await q.maybeSingle());
}
async function masterView(db,row,seats){
 if(!row)return {session:null};
 const docs=await papers(db,row);const valid=row.participants.filter(id=>seats.some(s=>s.id===id));
 const p=checked(await db.from('mechanic_presence').select('seat_id,last_seen').eq('session_id',row.id));
 return {session:{id:row.id,name:row.name,training:row.training,isActive:row.active,participants:row.participants,version:row.version,state:reconcile(structuredClone(row.state),docs,valid),docs,presence:p,answers:{blood:row.config.blood,path:row.config.path,phrase:row.config.phrase,words:row.config.glyphs.map(g=>({id:g.id,letter:g.letter,image:g.image})),fear:row.config.fear}}};
}
export async function handleMechanics(db,body,actor){
 const campaign=actor.campaign;const master=actor.master;
 if(!uuid.test(campaign))throw fail('Campanha inválida.');
 const {op='read',session_id}=body;
 const seats=checked(await db.from('player_seats').select('id,display_name').eq('campaign_id',campaign).eq('enabled',true));
 if(master&&op==='list')return {sessions:checked(await db.from('mechanic_sessions').select('id,name,training,active,created_at').eq('campaign_id',campaign).order('created_at',{ascending:false}))};
 if(master&&op==='create'){
  const selected=body.participants;
  if(!Array.isArray(selected)||selected.length!==6||new Set(selected).size!==6||!selected.every(id=>seats.some(s=>s.id===id)))throw fail('Selecione exatamente seis investigadores ativos.');
  let config;try{config=validateConfig(body.config);}catch(e){throw fail(e.message);}
  const name=String(body.name||'Dilema das Seis Portas').trim().slice(0,120)||'Dilema das Seis Portas';
  const row=checked(await db.from('mechanic_sessions').insert({campaign_id:campaign,master_id:actor.id,name,training:!!body.training,participants:selected,config,state:createState(selected,config)}).select('id').single());
  return {id:row.id};
 }
 if(master&&op==='activate'){
  if(!uuid.test(session_id||''))throw fail('Sessão inválida.');
  checked(await db.rpc('activate_mechanic_session',{p_session:session_id,p_campaign:campaign,p_master:actor.id}));return {ok:true};
 }
 if(!['read','act'].includes(op))throw fail('Ação inválida.');
 if(master&&session_id&&!uuid.test(session_id))throw fail('Sessão inválida.');
 const row=await getRow(db,campaign,master?session_id:null);
 if(!row)return {session:null};
 if(!master&&!row.participants.includes(actor.id))return {session:null};
 const valid=row.participants.filter(id=>seats.some(s=>s.id===id));
 const docs=await papers(db,row);
 if(!master){
  if(!valid.includes(actor.id))throw fail('Acesso indisponível.',403);
  // Presence is separate from the puzzle's version so polling never consumes chances.
  await db.rpc('touch_mechanic_presence',{p_session:row.id,p_seat:actor.id,p_token_hash:actor.tokenHash});
 }
 if(op==='read')return master?masterView(db,row,seats):{session:playerView(row,row.config,actor.id,docs,row.participants,valid)};
 if(!master&&session_id!==row.id)throw fail('A sessão mudou. Atualize o painel.',409);
 if(!master&&body.command?.stage!==row.state.active)throw fail('A etapa mudou. Atualize o painel.',409);
 const action=body.command;
 if(!action||typeof action.type!=='string')throw fail('Ação inválida.');
 const payload={...action.payload};
 // Document IDs are assigned here, not accepted from player or master clients.
 if(master&&action.type==='issue')payload.newDocumentId=crypto.randomUUID();
 let result;
 try{result=transition(row.state,row.config,row.participants,actor,{...action,payload},docs);}catch(e){throw fail(e.message);}
 if(!result.duplicate){
  let docAction=result.documentAction;
  if(docAction){
   if(docAction.recipient&&!valid.includes(docAction.recipient))throw fail('Participante indisponível.');
   if(docAction.recipient){
    const path=`${campaign}/${docAction.id}.png`;
    const binary=Uint8Array.from(atob(row.config.symbols[docAction.stage].split(',')[1]),c=>c.charCodeAt(0));
    // The deterministic path makes retries safe. Access stays gated by the existing document endpoint.
    const stored=await db.storage.from('handout-assets').upload(path,binary,{contentType:'image/png',upsert:true});
    if(stored.error)throw fail('Não foi possível preparar o papel.',503);
    docAction={...docAction,assetPath:path};
   }
  }
  const success=checked(await db.rpc('commit_mechanic_action',{p_session:row.id,p_campaign:campaign,p_version:row.version,p_state:result.state,p_master:master?actor.id:null,p_seat:master?null:actor.id,p_token_hash:master?null:actor.tokenHash,p_docs:docs,p_document:docAction}));
  if(!success)throw fail('Outra ação atualizou a atividade. Tente novamente.',409);
 }
 const latest=await getRow(db,campaign,row.id);
 return master?masterView(db,latest,seats):{session:playerView(latest,latest.config,actor.id,await papers(db,latest),latest.participants,valid)};
}
