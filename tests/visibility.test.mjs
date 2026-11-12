import test from 'node:test';
import assert from 'node:assert/strict';
import {canSeeLayer,requiresUV,filterPages,resolveAssetPath,ELEMENT_IDS} from '../supabase/functions/player-access/visibility.js';
const campaign='11111111-1111-4111-8111-111111111111';
const path=campaign+'/22222222-2222-4222-8222-222222222222.webp';
const layers=[{id:'public',text:'public'},{id:'legacyUV',kind:'uv',text:'legacy'},{id:'secret',kind:'image',uv:true,affinity:'sangue',assetPath:path},{id:'text',affinity:'energia',text:'energia'},{id:'invalid',affinity:'made-up',text:'hidden'}];
test('every affinity receives only matching and unrestricted layers, on both sides',()=>{
 for(const affinity of ['none',...ELEMENT_IDS]){
  const pages=filterPages({front:layers,back:layers,backgrounds:{front:path}},affinity);
  assert.deepEqual(pages.front.map(l=>l.id),['public','legacyUV',...(affinity==='sangue'?['secret']:affinity==='energia'?['text']:[])]);
  assert.deepEqual(pages.back,pages.front);assert.equal(pages.backgrounds.front,path);
  if(affinity!=='sangue')assert.ok(!JSON.stringify(pages.front).includes(path));
 }
 assert.equal(layers.length,5);
});
test('UV is independent of affinity and supports old text and new images',()=>{
 assert.ok(requiresUV(layers[1]));assert.ok(requiresUV(layers[2]));
 assert.ok(!requiresUV(layers[3]));assert.ok(!canSeeLayer(layers[2],'medo'));
 assert.ok(canSeeLayer(layers[2],'sangue'));assert.ok(!canSeeLayer(layers[4],'made-up'));
});
test('asset endpoint denies wrong holder, affinity, campaign, unpublication and path traversal',()=>{
 const seat={id:'owner',campaign_id:campaign,affinity:'sangue'};
 const doc={holder_seat_id:'owner',campaign_id:campaign,is_published:true,pages:{front:layers,backgrounds:{front:path}}};
 assert.equal(resolveAssetPath(doc,seat,'front','secret'),path);
 assert.equal(resolveAssetPath(doc,seat,'front'),path);
 assert.equal(resolveAssetPath(doc,{...seat,affinity:'medo'},'front','secret'),null);
 for(const patch of [{holder_seat_id:'other'},{campaign_id:'other'},{is_published:false}])assert.equal(resolveAssetPath({...doc,...patch},seat,'front','secret'),null);
 assert.equal(resolveAssetPath(doc,seat,'back','secret'),null);
 assert.equal(resolveAssetPath(doc,seat,'front','missing'),null);
 assert.equal(resolveAssetPath({...doc,pages:{front:[{...layers[2],assetPath:campaign+'/../secret.png'}]}},seat,'front','secret'),null);
});
test('missing and malformed pages cannot leak extra document metadata',()=>{
 assert.deepEqual(filterPages({front:null,back:{},secret:'leak'},'none'),{front:[],back:[],backgrounds:{}});
});
