import {useNeon} from './backend.js';
const liveEnabled=useNeon&&import.meta.env.VITE_PARADOCX_REALTIME==='firebase';
const connections=new Map();
function connect(scope,listener){
 const key=scope.token?`player:${scope.token}`:`master:${scope.campaign}`;
 let entry=connections.get(key);
 if(entry){entry.listeners.add(listener);listener(entry.connected,false);return ()=>release(key,listener);}
 entry={listeners:new Set([listener]),connected:false,stop:()=>{}};connections.set(key,entry);
 let stopped=false,cleanup=()=>{},timer;
 const notify=(connected,changed=false)=>{entry.connected=connected;for(const cb of entry.listeners)cb(connected,changed);};
 async function open(){
  if(stopped)return;cleanup();notify(false);const controller=new AbortController();cleanup=()=>controller.abort();
  try{
   const bearer=scope.token?null:await scope.getToken();
   const response=await fetch('/api/neon-realtime',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',...(bearer?{Authorization:`Bearer ${bearer}`}:{})},body:JSON.stringify(scope.token?{token:scope.token}:{campaign_id:scope.campaign}),signal:controller.signal});
   if(!response.ok)throw Error();const result=await response.json();if(stopped)return;
   const [appSdk,authSdk,dbSdk]=await Promise.all([import('firebase/app'),import('firebase/auth'),import('firebase/database')]);
   if(stopped)return;const app=appSdk.initializeApp(result.config,`paradocx-live-${crypto.randomUUID()}`),subs=[];
   cleanup=()=>{controller.abort();subs.forEach(stop=>stop());void appSdk.deleteApp(app).catch(()=>{});};
   const auth=authSdk.initializeAuth(app,{persistence:authSdk.inMemoryPersistence});await authSdk.signInWithCustomToken(auth,result.token);if(stopped)return;
   const db=dbSdk.getDatabase(app);let online=false,ready=false,denied=false;
   const status=(change=false)=>notify(!stopped&&online&&ready&&!denied,change);
   const failed=()=>{denied=true;status();};
   subs.push(dbSdk.onValue(dbSdk.ref(db,'.info/connected'),snap=>{online=snap.val()===true;status();},failed));
   subs.push(dbSdk.onValue(dbSdk.ref(db,result.path),()=>{ready=true;status(true);},failed));
   timer=setTimeout(()=>void open(),Math.max(60_000,Math.min(12*60_000,result.expiresAt-Date.now()-60_000)));
  }catch{cleanup();notify(false);if(!stopped)timer=setTimeout(()=>void open(),60_000);}
 }
 entry.stop=()=>{stopped=true;clearTimeout(timer);cleanup();};void open();return ()=>release(key,listener);
}
function release(key,listener){const entry=connections.get(key);if(!entry)return;entry.listeners.delete(listener);if(!entry.listeners.size){entry.stop();connections.delete(key);}}

// Fast regular polling is the fallback. A connected private listener triggers
// immediate refreshes while retaining a periodic safety/presence heartbeat.
export function watchRefresh(refresh,interval,scope,{initial=true,safety=15000}={}){
 let stopped=false,running=false,pending=false,connected=false,timer;
 const schedule=()=>{if(!stopped&&!document.hidden)timer=setTimeout(run,connected?safety:interval);};
 async function run(){if(stopped||document.hidden)return;if(running){pending=true;return;}clearTimeout(timer);running=true;try{await refresh();}catch{}finally{running=false;if(pending){pending=false;void run();}else schedule();}}
 const visibility=()=>{clearTimeout(timer);if(!document.hidden)void run();};
 document.addEventListener('visibilitychange',visibility);
 const unsubscribe=liveEnabled&&scope?connect(scope,(live,changed)=>{const lost=connected&&!live;connected=live;if(changed||lost)void run();}):()=>{};
 if(initial)void run();else schedule();
 return ()=>{stopped=true;clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);unsubscribe();};
}
