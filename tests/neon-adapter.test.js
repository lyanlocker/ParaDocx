import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeDb} from '../server/neon-db.js';
import {authorizeSeat} from '../api/neon-player.js';
import {createHash} from 'node:crypto';

test('server adapter maps the mechanics operations to a fixed query and bound values',async()=>{
 const calls=[];const db=makeDb(null,async(query,params)=>{calls.push({query,params});return [{id:'fixture'}];});
 const value=await db.from('documents').select('id,holder_seat_id').eq('campaign_id','campaign-fixture').in('id',['a','b']).order('created_at',{ascending:false});
 assert.equal(value.error,null);assert.deepEqual(value.data,[{id:'fixture'}]);
 assert.match(calls[0].query,/SELECT "id","holder_seat_id" FROM public\."documents" WHERE "campaign_id" = \$1 AND "id" IN \(\$2,\$3\)/);
 assert.deepEqual(calls[0].params,['campaign-fixture','a','b']);
 assert.throws(()=>db.from('master_setup_token'));
 assert.throws(()=>db.from('player_seats').select('unrecognized_field'));
 assert.ok((await db.rpc('unrecognized_operation',{})).error);
});

test('player seat lookup preserves hashed link authorization',async()=>{
 const token='e'.repeat(64),hash=createHash('sha256').update(token).digest('hex');
 const expected={id:'seat-fixture',campaign_id:'campaign-fixture',display_name:'Fixture',affinity:'none'};
 const db=makeDb(null,async (query,params)=>{assert.match(query,/"token_hash" = \$1 AND "enabled" = \$2/);assert.deepEqual(params,[hash,true]);return [expected];});
 assert.deepEqual(await authorizeSeat(db,token),{seat:expected,tokenHash:hash});
 await assert.rejects(()=>authorizeSeat(db,'invalid'),/Link de jogador inválido/);
});
