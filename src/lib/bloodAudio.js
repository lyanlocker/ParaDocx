// Original sound design. One reusable Web Audio context, unlocked by a user gesture.
export const bloodCue={CERTO:'pulse-01',BAIXO:'pulse-02',ALTO:'pulse-03'};
export const cueDuration={'pulse-01':2.1,'pulse-02':2.3,'pulse-03':2.0,'test':.55};
const tau=2*Math.PI;
const shape=(t,at,decay=.12)=>{const x=t-at;return x<0?0:Math.min(1,x/.013)*Math.exp(-x/decay);};
export function makeCue(context,cue){
 const seconds=cueDuration[cue];if(!seconds)throw new Error('Sinal indisponível.');
 const rate=context.sampleRate,buffer=context.createBuffer(1,Math.ceil(seconds*rate),rate),data=buffer.getChannelData(0);
 const beats=cue==='pulse-01'?[.20,.43,1.10,1.31]:cue==='pulse-02'?[.22,.69,1.38]:cue==='pulse-03'?[.14,.32,.51,.86,1.08,1.32]:[.1,.25];
 let seed=0x2f43c281,low=0,prior=0;
 for(let i=0;i<data.length;i++){
  const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const raw=seed/2147483648-1;low+=.022*(raw-low);const edge=raw-prior;prior=raw;
  let heart=0;for(const at of beats){const x=t-at;if(x<0)continue;const env=shape(t,at,.105);heart+=env*(Math.sin(tau*(65*x-12*x*x))+.36*Math.sin(tau*130*x)+.18*Math.sin(tau*219*x));}
  const fade=Math.min(1,t/.11,(seconds-t)/.28);
  const drone=cue==='pulse-02'?Math.sin(tau*(78*t-8*t*t))+.55*Math.sin(tau*(118*t-12*t*t)):cue==='pulse-03'?Math.sin(tau*(108*t+18*t*t))+.55*Math.sin(tau*(155*t+26*t*t)):Math.sin(tau*73*t)+.45*Math.sin(tau*111*t);
  const swell=cue==='pulse-03'?Math.pow(Math.min(1,t/1.3),1.6):cue==='pulse-02'?.7:.38;
  const texture=(low*.65+edge*.045)*swell;
  const accent=cue==='pulse-03'?shape(t,1.3,.22)*Math.sin(tau*(420*t+22*t*t))*.18:cue==='pulse-01'?shape(t,1.42,.30)*Math.sin(tau*196*t)*.11:0;
  data[i]=Math.tanh((heart*.51+drone*.12*swell+texture+accent)*1.3)*Math.max(0,fade)*.91;
 }
 return buffer;
}
export function playCue(context,cue,volume=.7){
 const source=context.createBufferSource(),gain=context.createGain();source.buffer=makeCue(context,cue);source.connect(gain);gain.connect(context.destination);gain.gain.value=volume;
 let finish;const done=new Promise(resolve=>{finish=resolve;source.onended=()=>{source.disconnect();gain.disconnect();resolve();};});source.start();
 return {done,stop:()=>{try{source.stop();}catch{}finish();}};
}
