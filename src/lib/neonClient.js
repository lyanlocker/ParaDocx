import {watchRefresh} from './realtime.js';
let authInstance,setupPromise;
async function masterRequest(body,accessToken){
 const res=await fetch('/api/neon-master',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',...(accessToken?{Authorization:`Bearer ${accessToken}`}:{})},body:JSON.stringify(body)});
 const result=await res.json();if(!res.ok)throw Error(result.error||'Não foi possível acessar o arquivo.');return result;
}
async function getFirebase(config){
 if(authInstance)return authInstance;
 if(!setupPromise)setupPromise=(async()=>{
  const [app,auth]=await Promise.all([import('firebase/app'),import('firebase/auth')]);
  const settings=config||(await masterRequest({action:'config'})).config;
  const instance=app.getApps().find(x=>x.name==='paradocx-master')||app.initializeApp(settings,'paradocx-master');
  authInstance=auth.getAuth(instance);await authInstance.authStateReady();return authInstance;
 })().catch(error=>{setupPromise=null;throw error;});
 return setupPromise;
}
async function sessionFor(auth){
 if(!auth.currentUser)return null;
 const token=await auth.currentUser.getIdToken();const {user}=await masterRequest({action:'session'},token);return {user,access_token:token};
}
async function getSession(){try{return {data:{session:await sessionFor(await getFirebase())},error:null};}catch(error){return {data:{session:null},error};}}
async function token(){const auth=await getFirebase();if(!auth.currentUser)throw Error('Entre como mestre primeiro.');return auth.currentUser.getIdToken();}
async function op(name,id,data){try{const result=await masterRequest({action:'data',op:name,id,data},await token());return {data:result.data,error:null};}catch(error){return {data:null,error};}}
function from(table){
 let mode='select',data,id;
 const q={select(){return q;},order(){return q;},single(){return q;},eq(_column,value){id=value;return q;},insert(value){mode='insert';data=value;return q;},update(value){mode='update';data=value;return q;},delete(){mode='delete';return q;},
  then(resolve){
   const name=({campaigns:{select:'campaign-list',insert:'campaign-create',update:'campaign-limit'},members:{select:'members-list'},documents:{select:'documents-list',insert:'document-create',update:data&&Object.hasOwn(data,'holder_seat_id')?'document-assign':'document-update',delete:'document-delete'},player_seats:{select:'seats-list',update:'seat-affinity'}})[table]?.[mode];
   return (name?op(name,id,data):Promise.resolve({data:null,error:Error('Operação inválida.')})).then(resolve);
  },
 };return q;
}
const auth={getSession,
 onAuthStateChange(callback){let alive=true,unsubscribe;void getFirebase().then(async instance=>{const sdk=await import('firebase/auth');if(alive)unsubscribe=sdk.onAuthStateChanged(instance,async()=>{if(alive){try{callback('AUTH',await sessionFor(instance));}catch{callback('AUTH',null);}}});}).catch(()=>{if(alive)callback('AUTH',null);});return {data:{subscription:{unsubscribe(){alive=false;unsubscribe?.();}}}};},
 async setSession(credentials){try{const instance=await getFirebase(credentials.config);const sdk=await import('firebase/auth');await sdk.signInWithCustomToken(instance,credentials.customToken);return {data:{session:await sessionFor(instance)},error:null};}catch(error){return {error};}},
 async signOut(){const sdk=await import('firebase/auth');await sdk.signOut(await getFirebase());},
};
const storage={from(bucket){if(bucket!=='handout-assets')throw Error('Repositório inválido.');return {
 createSignedUrl(path){return op('asset-url',undefined,{path});},remove(paths){return op('asset-cleanup',undefined,{paths});},
 async upload(path,blob,{contentType}={}){try{const result=await fetch('/api/neon-asset',{method:'POST',headers:{Authorization:`Bearer ${await token()}`,'Content-Type':contentType||blob.type,'X-Asset-Path':path},body:blob,cache:'no-store'});const data=await result.json();if(!result.ok)throw Error(data.error||'Não foi possível armazenar a imagem.');return {data,error:null};}catch(error){return {error};}},
};}};
function channel(name){let callback,dispose;const c={on(_type,_filter,cb){callback=cb;return c;},subscribe(){dispose=watchRefresh(()=>callback?.(),6000,{campaign:name.replace(/^camp-/,''),getToken:token},{initial:false});return c;},stop(){dispose?.();}};return c;}
export const neonClient={auth,storage,from,channel,removeChannel(c){c.stop();},rpc(name,data){const opName={create_player_seat:'seat-create',rotate_player_link:'seat-rotate',remove_player_seat:'seat-remove'}[name];return opName?op(opName,undefined,data):Promise.resolve({error:Error('Operação inválida.')});}};
