// Run only on a disposable Neon validation branch; never on production.
// Use a restricted runtime role and synthetic data. Original campaign is untouched.
import assert from 'node:assert/strict';
import {rows,makeDb} from '../server/neon-db.js';
import {masterOperation} from '../server/neon-master.js';
import {authorizeSeat} from '../api/neon-player.js';
import {handleMechanics} from '../supabase/functions/player-access/mechanics-api.js';
import {validateConfig,stages} from '../supabase/functions/player-access/mechanics.js';
import {randomUUID} from 'node:crypto';

if(process.env.PARADOCX_VALIDATION!=='isolated')throw Error('Validation branch required.');
const [role]=await rows('SELECT current_user AS role');assert.equal(role.role,'paradocx_preview_runtime');
const [actor]=await rows('SELECT user_id FROM public.master_identity WHERE singleton=true');assert.ok(actor?.user_id);
const call=(op,data,id)=>masterOperation({op,data,id},actor);
const camp=await call('campaign-create',{name:`Migração sintética ${randomUUID()}`,max_players:6});
const seats=[];
for(let i=1;i<=6;i++)seats.push(await call('seat-create',{p_campaign:camp.id,p_name:`Investigador sintético ${i}`}));
assert.equal((await call('seats-list',{},camp.id)).length,6);
const doc=await call('document-create',{campaign_id:camp.id,title:'Documento sintético',template:'blank',pages:{front:[],back:[]}});
await call('document-assign',{holder_seat_id:seats[0].id},doc.id);
const db=makeDb(null);const {seat,tokenHash}=await authorizeSeat(db,seats[0].token);
assert.equal(seat.id,seats[0].id);
const transfer=await db.rpc('transfer_document_by_player',{p_token_hash:tokenHash,p_document:doc.id,p_recipient:seats[1].id});assert.equal(transfer.error,null);assert.equal(transfer.data,true);
const [saved]=await rows('SELECT holder_seat_id FROM public.documents WHERE id=$1::uuid',[doc.id]);assert.equal(saved.holder_seat_id,seats[1].id);
const image='data:image/png;base64,AA==',bank=Array.from({length:45},(_,i)=>`word${i}`);
const config=validateConfig({version:1,blood:[2,4,6,8],path:['E','D','E','D','C'],phrase:bank.slice(15,30),bank,glyphs:Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ',(letter,i)=>({id:`g${String(i+1).padStart(2,'0')}`,letter,image})),symbols:Object.fromEntries(stages.slice(0,4).map(s=>[s,image])),fear:stages.slice(0,4).map(element=>({element,clue:`Synthetic ${element} clue`}))});
const master={master:true,id:actor.user_id,campaign:camp.id};
const {id:session}=await handleMechanics(db,{op:'create',participants:seats.map(s=>s.id),config,name:'Sessão sintética',training:true},master);
await handleMechanics(db,{op:'activate',session_id:session},master);
const masterView=await handleMechanics(db,{op:'read',session_id:session},master);assert.ok(masterView.session?.isActive);
const playerView=await handleMechanics(db,{op:'read'},{master:false,id:seat.id,campaign:camp.id,tokenHash});assert.ok(playerView.session);assert.equal(Object.hasOwn(playerView.session,'answers'),false);
console.log('PASS: campanha, seis acessos, documento, transferência, ativação da mecânica e visão privada do jogador.');
