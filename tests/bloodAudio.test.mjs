import test from 'node:test';
import assert from 'node:assert/strict';
import {bloodCue,makeCue,cueDuration,playCue} from '../src/lib/bloodAudio.js';

test('three suspense cues produce distinct finite audio buffers and neutral test sound',()=>{
 const sampleRate=24000;
 const context={sampleRate,createBuffer:(_,length)=>{const data=new Float32Array(length);return {getChannelData:()=>data};}};
 const signatures=[];
 for(const cue of [...Object.values(bloodCue),'test']){
  const data=makeCue(context,cue).getChannelData(0);assert.equal(data.length,Math.ceil(sampleRate*cueDuration[cue]));
  assert.ok(data.every(Number.isFinite));assert.ok(data.some(x=>Math.abs(x)>.12));assert.ok(data.every(x=>Math.abs(x)<=1));
  signatures.push(data.slice(0,14000).reduce((acc,x,i)=>acc+x*x*(i+1),0));
 }
 assert.equal(new Set(signatures).size,4);
});
test('playback connects buffer and gain to a single running audio context',async()=>{
 const samples=new Float32Array(13200);let started=false,connected=0;
 const source={connect(){connected++;},disconnect(){},start(){started=true;queueMicrotask(()=>this.onended());},stop(){}};
 const gain={gain:{value:0},connect(){connected++;},disconnect(){}};
 const ctx={sampleRate:24000,createBuffer:()=>({getChannelData:()=>samples}),createBufferSource:()=>source,createGain:()=>gain,destination:{}};
 const cue=playCue(ctx,'test',.5);await cue.done;
 assert.ok(started);assert.equal(connected,2);assert.equal(gain.gain.value,.5);
});
