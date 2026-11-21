import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,transition,energyStep,playerView,validateConfig,stages,wiring} from '../supabase/functions/player-access/mechanics.js';

// Synthetic fixtures, not the campaign's private answer key.
const ids=['p1','p2','p3','p4','p5','p6'];
const image='data:image/png;base64,AA==';
const bank=Array.from({length:45},(_,i)=>`word${i}`);
const config=validateConfig({version:1,blood:[2,4,6,8],path:['E','D','E','D','C'],phrase:bank.slice(15,30),bank,glyphs:Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ',(letter,i)=>({id:`g${String(i+1).padStart(2,'0')}`,letter,image})),symbols:Object.fromEntries(stages.slice(0,4).map(s=>[s,image])),fear:stages.slice(0,4).reverse().map(element=>({element,clue:`Synthetic ${element} clue`}))});
const master={master:true,id:'master'};
const player=id=>({master:false,id});
const fresh=()=>createState(ids,config);
const move=(state,who,type,stage,payload={},docs=[],actionId=crypto.randomUUID())=>transition(state,config,ids,who,{type,stage,payload,actionId,generation:state.stages[stage]?.generation},docs);
const open=(state,stage)=>move(state,master,'open',stage).state;
const view=(state,who,docs=[])=>playerView({id:'session',state},config,who,docs,ids);

test('sangue: rejects invalid inputs, compares each valve, deduplicates, caps attempts and broadcasts only on master action',()=>{
 let s=open(fresh(),'sangue');
 for(const values of [[0,4,6,8],[13,4,6,8],[null,4,6,8],[2.5,4,6,8]])assert.throws(()=>move(s,player('p1'),'blood-submit','sangue',{values}));
 assert.equal(s.stages.sangue.players.p1.used,0);
 const id=crypto.randomUUID();s=move(s,player('p1'),'blood-submit','sangue',{values:[1,4,8,8]},[],id).state;
 assert.deepEqual(s.stages.sangue.submissions[0].feedback,['BAIXO','CERTO','ALTO','CERTO']);
 assert.equal(view(s,'p1').audio.length,0);assert.equal(view(s,'p2').mine.used,0);assert.equal(view(s,'p1').submissions,undefined);
 assert.equal(move(s,player('p1'),'blood-submit','sangue',{values:[1,4,8,8]},[],id).state.stages.sangue.players.p1.used,1);
 s=move(s,master,'audio','sangue',{submission:id}).state;assert.equal(view(s,'p2').audio[0].signals.length,4);
 s=move(s,player('p1'),'blood-submit','sangue',{values:[1,4,8,8]}).state;s=move(s,player('p1'),'blood-submit','sangue',{values:[1,4,8,8]}).state;
 assert.throws(()=>move(s,player('p1'),'blood-submit','sangue',{values:config.blood}));
 s=move(s,master,'restore','sangue',{player:'p1'}).state;s=move(s,player('p1'),'blood-submit','sangue',{values:config.blood}).state;assert.equal(s.stages.sangue.status,'concluído');
});
test('morte: independent paths, unique word slots, wrong choices, order enforcement and collective completion',()=>{
 let s=open(fresh(),'morte');assert.equal(new Set(s.stages.morte.bank).size,45);assert.equal(view(s,'p1').slots,undefined);
 assert.throws(()=>move(s,player('p1'),'death-place','morte',{index:0,value:config.phrase[0]}));
 s=move(s,master,'death-row','morte',{choice:'C'}).state;assert.equal(s.stages.morte.rows,0);
 s=move(s,player('p4'),'death-place','morte',{index:0,value:bank[0]}).state;s=move(s,player('p5'),'death-check','morte').state;assert.equal(s.stages.morte.confirmed,0);assert.equal(s.stages.morte.slots[0],null);
 s=move(s,player('p4'),'death-place','morte',{index:2,value:config.phrase[0]}).state;s=move(s,player('p4'),'death-place','morte',{index:0,value:config.phrase[0]}).state;assert.equal(s.stages.morte.slots[2],null);
 for(let i=0;i<15;i++){s=move(s,player('p4'),'death-place','morte',{index:i,value:config.phrase[i]}).state;s=move(s,player('p5'),'death-check','morte').state;}
 assert.equal(s.stages.morte.status,'em andamento');
 for(const choice of config.path)s=move(s,master,'death-row','morte',{choice}).state;
 assert.equal(s.stages.morte.status,'concluído');
});
test('conhecimento: glyph mapping stays private; repeated glyphs, accents and collective completion',()=>{
 let s=open(fresh(),'conhecimento');const v=view(s,'p1');assert.equal(v.glyphs.length,26);assert.ok(v.glyphs.every(g=>!('letter' in g)));assert.deepEqual(v.words.map(w=>w.length),[6,5,10,8]);
 for(const [w,word] of v.words.entries()){
  const base=word.normalize('NFD').replace(/\p{Diacritic}/gu,'');const actor=player(ids[w]);
  for(const [index,letter] of [...base].entries())s=move(s,actor,'glyph-input','conhecimento',{word:w,index,value:config.glyphs.find(g=>g.letter===letter).id}).state;
  s=move(s,actor,'glyph-check','conhecimento',{word:w}).state;
 }
 assert.equal(s.stages.conhecimento.status,'concluído');assert.equal(s.stages.conhecimento.confirmed[1][1],s.stages.conhecimento.confirmed[1][4]);
});
test('energia: exactly one solution across all 216 sequences; blocked actions consume a click',()=>{
 const wins=[];for(const a of Object.keys(wiring))for(const b of Object.keys(wiring))for(const c of Object.keys(wiring)){
  const lights=[a,b,c].reduce((l,key)=>energyStep(l,key).lights,Array(6).fill(false));if(lights.every(Boolean))wins.push([a,b,c]);
 }
 assert.equal(wins.length,1);let s=open(fresh(),'energia');
 s=move(s,player('p1'),'energy-click','energia',{button:'C'}).state;assert.equal(s.stages.energia.players.p1.clicks[0].blocked,true);assert.ok(s.stages.energia.players.p1.lights.every(x=>!x));
 for(const key of ['C','C'])s=move(s,player('p1'),'energy-click','energia',{button:key}).state;
 assert.equal(s.stages.energia.players.p1.used,1);s=move(s,player('p1'),'energy-next','energia').state;assert.equal(s.stages.energia.players.p1.clicks.length,0);
 for(const key of wins[0])s=move(s,player('p1'),'energy-click','energia',{button:key}).state;assert.equal(s.stages.energia.status,'concluído');
});
test('medo: only issued papers, no duplicates, private ownership, transfer invalidates placement, reset leaves papers',()=>{
 let s=fresh(),docs=[];assert.throws(()=>move(s,master,'open','medo'));
 for(const [i,stage] of stages.slice(0,4).entries()){
  s=move(s,master,'complete',stage).state;
  const id=`paper${i}`;const r=move(s,master,'issue',stage,{newDocumentId:id,player:ids[i]},docs);s=r.state;docs.push({id,holder_seat_id:ids[i],is_published:true});
  const retry=move(s,master,'issue',stage,{newDocumentId:`different${i}`,player:ids[i]},docs);assert.equal(retry.documentAction.id,id);
 }
 s=move(s,master,'open','medo',{},docs).state;assert.equal(view(s,'p1',docs).papers.length,1);
 assert.throws(()=>move(s,player('p1'),'fear-place','medo',{index:0,id:'paper1'},docs));
 assert.throws(()=>move(s,player('p1'),'fear-place','medo',{index:0,id:'unissued'},docs));
 s=move(s,player('p1'),'fear-place','medo',{index:0,id:'paper0'},docs).state;s=move(s,player('p1'),'fear-place','medo',{index:1,id:'paper0'},docs).state;assert.equal(s.stages.medo.slots[0],null);
 const changed=docs.map(d=>d.id==='paper0'?{...d,holder_seat_id:'p6'}:d);assert.equal(view(s,'p1',changed).slots[1],null);
 for(const [index,clue] of config.fear.entries()){const id=s.papers[clue.element],doc=docs.find(d=>d.id===id);s=move(s,player(doc.holder_seat_id),'fear-place','medo',{index,id},docs).state;}
 assert.throws(()=>move(s,player('p1'),'fear-check','medo',{},docs));s=move(s,master,'verify-enabled','medo',{enabled:true},docs).state;s=move(s,player('p1'),'fear-check','medo',{},docs).state;assert.equal(s.stages.medo.status,'concluído');
 s=move(s,master,'reset','medo',{},docs).state;assert.equal(Object.keys(s.papers).length,4);assert.equal(s.stages.medo.slots.filter(Boolean).length,0);
});
test('players cannot administer sessions, act while paused, or act on a reset generation',()=>{
 let s=open(fresh(),'sangue');assert.throws(()=>move(s,player('p1'),'restore','sangue',{player:'p1'}));
 s=move(s,master,'pause','sangue',{paused:true}).state;assert.throws(()=>move(s,player('p1'),'blood-submit','sangue',{values:config.blood}));
 const old=s.stages.sangue.generation;s=move(s,master,'reset','sangue').state;s=open(s,'sangue');
 assert.throws(()=>transition(s,config,ids,player('p1'),{generation:old,type:'blood-submit',stage:'sangue',actionId:crypto.randomUUID(),payload:{values:config.blood}}));
});
