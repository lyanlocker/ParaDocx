import {mkdirSync,writeFileSync} from 'node:fs';
const sampleRate=24000;
mkdirSync(new URL('../public/audio/',import.meta.url),{recursive:true});
for(const [name,duration] of [['certo',.55],['baixo',.50],['alto',.50]]){
 const length=Math.round(sampleRate*duration),buffer=Buffer.alloc(44+length*2);
 buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(length*2,40);
 const pulse=(t,at)=>{const v=t-at;return v<0?0:Math.sin(2*Math.PI*58*v)*Math.exp(-v*26)*Math.min(1,v*180);};
 for(let i=0;i<length;i++){
  const t=i/sampleRate,fade=Math.min(1,t*100,(duration-t)*35),f=name==='alto'?180*t+180*t*t/duration:name==='baixo'?180*t-45*t*t/duration:150*t;
  let v=.56*pulse(t,.025)+(name==='certo'?.43*pulse(t,.22):0)+.12*Math.sin(2*Math.PI*f)*Math.sin(Math.PI*t/duration)**2;
  if(name==='alto')v+=.06*Math.sin(2*Math.PI*3*f)*Math.sin(Math.PI*t/duration)**2;
  buffer.writeInt16LE(Math.round(32767*Math.max(-1,Math.min(1,v*fade))),44+i*2);
 }
 writeFileSync(new URL(`../public/audio/sangue_${name}.wav`,import.meta.url),buffer);
}
