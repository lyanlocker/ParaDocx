// Runs only in the Edge Function. The campaign's answer key is imported privately
// by the master; it must never be committed to this public repository.
export const stages=['sangue','morte','conhecimento','energia','medo'];
export const words=['RITUAL','CRIAR','IMPOSSÍVEL','ELEMENTO'];
export const wiring={A:[1,2,3],B:[1,2,4],C:[2,3,5],D:[2,6],E:[1,3,4],F:[1,5,6]};
const blank=n=>Array(n).fill(null);
const assert=(v,message='Ação inválida.')=>{if(!v)throw new Error(message);};
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const png=v=>typeof v==='string'&&v.length<250000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(v);
const plain=v=>typeof v==='string'&&v.length>0&&v.length<500;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function validateConfig(c){
 assert(c&&c.version===1,'Arquivo de configuração incompatível.');
 assert(Array.isArray(c.blood)&&c.blood.length===4&&c.blood.every(x=>int(x,1,12)));
 assert(Array.isArray(c.path)&&c.path.length===5&&c.path.every(x=>['E','C','D'].includes(x)));
 assert(Array.isArray(c.phrase)&&c.phrase.length===15&&c.phrase.every(plain));
 assert(Array.isArray(c.bank)&&c.bank.length===45&&c.bank.every(plain)&&new Set(c.bank.map(x=>x.toLowerCase())).size===45&&c.phrase.every(x=>c.bank.includes(x))&&new Set(c.phrase).size===15);
 assert(Array.isArray(c.glyphs)&&c.glyphs.length===26&&c.glyphs.every(g=>/^g\d{2}$/.test(g.id)&&/^[A-Z]$/.test(g.letter)&&png(g.image))&&new Set(c.glyphs.map(g=>g.id)).size===26&&new Set(c.glyphs.map(g=>g.letter)).size===26);
 assert(Array.isArray(c.fear)&&c.fear.length===4&&c.fear.every(r=>plain(r.clue)&&stages.slice(0,4).includes(r.element))&&new Set(c.fear.map(r=>r.element)).size===4);
 assert(stages.slice(0,4).every(s=>png(c.symbols?.[s])));
 return c;
}
export function energyStep(lights,button){
 assert(Object.hasOwn(wiring,button));
 const blocked=button==='C'&&!lights[0]||button==='D'&&!(lights[2]&&lights[4]);
 return {blocked,lights:blocked?[...lights]:lights.map((v,i)=>wiring[button].includes(i+1)?!v:v)};
}
function individual(stage,limit){
 if(stage==='sangue')return {used:0,limit,inputs:blank(4)};
 if(stage==='energia')return {used:0,limit,lights:Array(6).fill(false),clicks:[],rounds:[],won:false};
 if(stage==='conhecimento')return {inputs:words.map(w=>blank(w.length)),confirmed:words.map(w=>blank(w.length)),checked:words.map(w=>blank(w.length))};
 return {};
}
function makeStage(stage,ids,config,limit=3){
 const base={status:'bloqueado',players:Object.fromEntries(ids.map(id=>[id,individual(stage,limit)])),completedAt:null,generation:crypto.randomUUID()};
 if(stage==='sangue')return {...base,submissions:[],audio:[]};
 if(stage==='morte')return {...base,rows:0,confirmed:0,slots:blank(15),bank:shuffle(config.bank),choices:[]};
 if(stage==='conhecimento')return {...base,confirmed:words.map(w=>blank(w.length)),bank:shuffle(config.glyphs.map(g=>g.id))};
 if(stage==='medo')return {...base,slots:blank(4),confirmed:blank(4),verify:false};
 return base;
}
export function createState(ids,config,limit=3){
 return {active:null,paused:false,stages:Object.fromEntries(stages.map(s=>[s,makeStage(s,ids,config,limit)])),papers:{},history:[],presence:{}};
}
const open=s=>['aberto','em andamento'].includes(s.status);
const complete=(s,at,actor)=>{s.status='concluído';s.completedAt=at;s.completedBy=actor;};
// A placement records who owned the document when it was placed. A transfer,
// revocation, deletion, or disabled seat invalidates that placement.
export function reconcile(state,docs,ids){
 const board=state.stages.medo;
 for(let i=0;i<4;i++){
  const p=board.slots[i],d=p&&docs.find(d=>d.id===p.id);
  if(p&&(!d||!d.is_published||d.holder_seat_id!==p.owner||!ids.includes(p.owner))){board.slots[i]=null;board.confirmed[i]=null;}
 }
 return state;
}
export function transition(source,config,ids,actor,request,docs=[],now=new Date().toISOString()){
 const state=structuredClone(source);reconcile(state,docs,ids);
 const {type,stage=state.active,actionId,payload={}}=request;
 const master=actor.master,who=actor.id;
 assert(master||ids.includes(who),'Acesso indisponível.');
 assert(typeof actionId==='string'&&/^[a-f0-9-]{36}$/i.test(actionId));
 if(state.history.some(e=>e.id===actionId))return {state,duplicate:true};
 assert(stages.includes(stage)||type==='pause','Etapa indisponível.');
 const s=state.stages[stage];let detail={},documentAction=null;
 if(!master)assert(request.generation===s.generation,'A atividade foi reiniciada. Atualize o painel.');
 if(master){
  if(type==='open'){
   if(stage==='medo')assert(stages.slice(0,4).every(k=>docs.some(d=>d.id===state.papers[k]&&d.is_published&&ids.includes(d.holder_seat_id))),'Entregue os quatro papéis aos participantes antes de abrir.');
   if(state.active&&state.active!==stage&&open(state.stages[state.active]))state.stages[state.active].status='encerrado';
   state.active=stage;state.paused=false;if(s.status!=='concluído')s.status='aberto';
  }else if(type==='pause'){state.paused=!!payload.paused;}
  else if(type==='close'){s.status='encerrado';if(state.active===stage)state.active=null;}
  else if(type==='complete'){complete(s,now,who);}
  else if(type==='reset'){state.stages[stage]=makeStage(stage,ids,config,stage==='energia'?(s.players[ids[0]]?.limit||3):3);if(state.active===stage)state.active=null;}
  else if(type==='restore'){
   assert(['sangue','energia'].includes(stage)&&ids.includes(payload.player));
   const p=s.players[payload.player];p.limit+=1;detail={player:payload.player};
  }else if(type==='limit'){
   assert(stage==='energia'&&int(payload.limit,1,20));for(const p of Object.values(s.players))p.limit=payload.limit;
  }else if(type==='death-row'){
   assert(stage==='morte'&&open(s)&&s.rows<5&&['E','C','D','manual'].includes(payload.choice));
   const correct=payload.choice==='manual'||payload.choice===config.path[s.rows];
   s.choices.push({row:s.rows+1,choice:payload.choice,correct,at:now});if(correct)s.rows++;
   if(s.rows===5&&s.confirmed===15)complete(s,now,who);
  }else if(type==='audio'){
   assert(stage==='sangue');const submission=s.submissions.find(x=>x.id===payload.submission);assert(submission);
   assert(payload.valve===undefined||int(payload.valve,0,3));
   const indices=payload.valve===undefined?[0,1,2,3]:[payload.valve];
   s.audio.push({id:actionId,at:now,player:submission.player,signals:indices.map(i=>({valve:i+1,type:submission.feedback[i]}))});
  }else if(type==='verify-enabled'){assert(stage==='medo');s.verify=!!payload.enabled;}
  else if(type==='issue'||type==='revoke'){
   assert(stages.slice(0,4).includes(stage));
   if(type==='issue')assert(s.status==='concluído'&&ids.includes(payload.player),'Conclua a etapa e escolha um participante.');
   const id=state.papers[stage]||payload.newDocumentId;assert(id);
   assert(type!=='revoke'||state.papers[stage]);state.papers[stage]=id;
   documentAction={id,stage,recipient:type==='issue'?payload.player:null};detail={document:id,recipient:documentAction.recipient};
   const nextDocs=docs.filter(d=>d.id!==id);nextDocs.push({id,holder_seat_id:documentAction.recipient,is_published:!!documentAction.recipient});reconcile(state,nextDocs,ids);
  }else if(!['fear-place','fear-check'].includes(type))assert(false);
 }
 const canPlay=['blood-input','blood-submit','death-place','death-check','glyph-input','glyph-check','energy-click','energy-next','fear-place','fear-check'];
 if(!master||canPlay.includes(type)){
  assert(canPlay.includes(type)&&stage===state.active&&open(s)&&!state.paused,'A atividade não está aberta.');
  if(s.status==='aberto')s.status='em andamento';
  const p=s.players[who];
  if(type==='blood-input'||type==='blood-submit'){
   assert(stage==='sangue'&&p&&p.used<p.limit,'Sem tentativas disponíveis.');
   assert(Array.isArray(payload.values)&&payload.values.length===4&&payload.values.every(v=>v===null||int(v,1,12)),'Use números inteiros de 1 a 12.');p.inputs=payload.values;
   if(type==='blood-submit'){
    assert(p.inputs.every(v=>v!==null),'Preencha as quatro válvulas.');p.used++;
    const feedback=p.inputs.map((v,i)=>v===config.blood[i]?'CERTO':v<config.blood[i]?'BAIXO':'ALTO');
    s.submissions.push({id:actionId,player:who,values:p.inputs,feedback,at:now});if(feedback.every(v=>v==='CERTO'))complete(s,now,who);
   }
  }else if(type==='death-place'||type==='death-check'){
   assert(stage==='morte'&&ids.indexOf(who)>=3&&p,'Somente o lado B resolve a frase.');
   if(type==='death-place'){
    const {index,value}=payload;assert(int(index,s.confirmed,14)&&(value===null||s.bank.includes(value)));
    if(value!==null){const prev=s.slots.indexOf(value);assert(prev<0||prev>=s.confirmed,'Ficha já confirmada.');if(prev>=0)s.slots[prev]=null;}
    s.slots[index]=value;
   }else{
    const i=s.confirmed;assert(i<15&&s.slots[i]!==null,'Selecione a próxima palavra.');
    const correct=s.slots[i].toLowerCase()===config.phrase[i].toLowerCase();detail={index:i,correct};if(correct)s.confirmed++;else s.slots[i]=null;
    if(s.rows===5&&s.confirmed===15)complete(s,now,who);
   }
  }else if(type==='glyph-input'||type==='glyph-check'){
   assert(stage==='conhecimento'&&p&&int(payload.word,0,3));const w=payload.word;
   if(type==='glyph-input'){
    assert(int(payload.index,0,words[w].length-1)&&(payload.value===null||s.bank.includes(payload.value))&&!p.confirmed[w][payload.index]&&!s.confirmed[w][payload.index]);p.inputs[w][payload.index]=payload.value;p.checked[w][payload.index]=null;
   }else{
    const expected=words[w].normalize('NFD').replace(/\p{Diacritic}/gu,'');
    detail={word:w,correct:[]};for(let i=0;i<expected.length;i++){if(!p.inputs[w][i])continue;const correct=config.glyphs.find(g=>g.id===p.inputs[w][i])?.letter===expected[i];p.checked[w][i]=correct;if(correct){p.confirmed[w][i]=p.inputs[w][i];s.confirmed[w][i]=p.inputs[w][i];detail.correct.push(i);}}
    if(s.confirmed.every(row=>row.every(Boolean)))complete(s,now,who);
   }
  }else if(type==='energy-click'||type==='energy-next'){
   assert(stage==='energia'&&p&&!p.won&&p.used<p.limit,'Sem tentativas disponíveis.');
   if(type==='energy-next'){assert(p.clicks.length===3);p.lights=Array(6).fill(false);p.clicks=[];}
   else{
    assert(p.clicks.length<3,'Inicie a próxima tentativa.');const result=energyStep(p.lights,payload.button);p.lights=result.lights;p.clicks.push({button:payload.button,blocked:result.blocked,lights:result.lights});
    if(p.clicks.length===3){p.used++;p.won=p.lights.every(Boolean);p.rounds.push({clicks:p.clicks,won:p.won,at:now});if(p.won)complete(s,now,who);}
   }
  }else if(type==='fear-place'||type==='fear-check'){
   assert(stage==='medo');
   if(type==='fear-place'){
    const {index,id}=payload;assert(int(index,0,3)&&!s.confirmed[index]);
    if(id===null){assert(master||s.slots[index]?.owner===who);s.slots[index]=null;}
    else{
     const d=docs.find(d=>d.id===id);assert(Object.values(state.papers).includes(id)&&d?.is_published&&ids.includes(d.holder_seat_id)&&(master||d.holder_seat_id===who),'Papel indisponível.');
     const prev=s.slots.findIndex(x=>x?.id===id);assert(prev<0||!s.confirmed[prev]);if(prev>=0)s.slots[prev]=null;s.slots[index]={id,owner:d.holder_seat_id};
    }
   }else{
    assert(master||s.verify,'Aguarde autorização do mestre.');assert(s.slots.every(Boolean),'Preencha os quatro espaços.');
    s.confirmed=s.slots.map((slot,i)=>slot.id===state.papers[config.fear[i].element]?slot.id:null);
    if(s.confirmed.every(Boolean))complete(s,now,who);
   }
  }
 }
 state.history.push({id:actionId,actor:who,stage,type,at:now,...detail});return {state,documentAction};
}
export function playerView(row,config,who,docs,ids,validIds=ids){
 const state=reconcile(structuredClone(row.state),docs,validIds),stage=state.active,s=state.stages[stage];
 const view={id:row.id,active:stage,paused:state.paused,stageStatus:s?.status,training:row.training,generation:s?.generation};
 if(!s||!validIds.includes(who))return view;
 view.mine=s.players[who];
 if(stage==='sangue')view.audio=s.audio;
 if(stage==='morte')Object.assign(view,{side:ids.indexOf(who)<3?'A':'B',rows:s.rows,confirmed:s.confirmed,...(ids.indexOf(who)>=3?{slots:s.slots,bank:s.bank}:{})});
 if(stage==='conhecimento')Object.assign(view,{words,confirmed:s.confirmed,glyphs:s.bank.map(id=>{const g=config.glyphs.find(x=>x.id===id);return {id,image:g.image};})});
 if(stage==='energia')view.wiring=wiring;
 if(stage==='medo'){
  const paper=(id)=>{const key=Object.keys(state.papers).find(k=>state.papers[k]===id);return key?{id,image:config.symbols[key]}:null;};
  Object.assign(view,{clues:config.fear.map(x=>x.clue),slots:s.slots.map(x=>x?{...paper(x.id),mine:x.owner===who}:null),confirmed:s.confirmed.map(Boolean),verify:s.verify,papers:docs.filter(d=>Object.values(state.papers).includes(d.id)&&d.is_published&&d.holder_seat_id===who).map(d=>paper(d.id))});
 }
 return view;
}
