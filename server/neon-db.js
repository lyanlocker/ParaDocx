import { neon } from '@neondatabase/serverless';

// This adapter is server-only and is used by the reviewed mechanics engine.
// Browser input is never passed to from(), select(), order(), or rpc().
const tables = {
  campaigns: 'id name description owner_id join_code max_players created_at',
  documents: 'id campaign_id title template pages holder_id is_published created_by created_at updated_at holder_seat_id mechanic_session_id',
  player_seats: 'id campaign_id display_name token_hash enabled created_at affinity',
  members: 'campaign_id user_id display_name role joined_at',
  mechanic_sessions: 'id campaign_id master_id name training active participants config state version created_at updated_at',
  mechanic_presence: 'session_id seat_id last_seen',
};
const jsonFields = new Set(['pages','config','state']);
const uuidArrayFields = new Set(['participants']);
const rpcSignatures = {
  transfer_document_by_player: [['p_token_hash','text'],['p_document','uuid'],['p_recipient','uuid']],
  activate_mechanic_session: [['p_session','uuid'],['p_campaign','uuid'],['p_master','uuid']],
  touch_mechanic_presence: [['p_session','uuid'],['p_seat','uuid'],['p_token_hash','text']],
  commit_mechanic_action: [['p_session','uuid'],['p_campaign','uuid'],['p_version','bigint'],['p_state','jsonb'],['p_master','uuid'],['p_seat','uuid'],['p_token_hash','text'],['p_docs','jsonb'],['p_document','jsonb']],
};
export function sqlClient(){
  if(process.env.PARADOCX_BACKEND!=='neon'||!process.env.PARADOCX_DATABASE_URL)throw new Error('Backend indisponível');
  return neon(process.env.PARADOCX_DATABASE_URL);
}
export async function rows(query,params=[]){return sqlClient().query(query,params,{fetchOptions:{cache:'no-store',signal:AbortSignal.timeout(18000)}});}
export function makeDb(storage,execute=rows){
  function from(table){
    if(!Object.hasOwn(tables,table))throw new Error('Tabela não permitida');
    const allowed=new Set(tables[table].split(' '));
    const col=key=>{if(!allowed.has(key))throw new Error('Campo não permitido');return `"${key}"`;};
    let projection='*',filters=[],params=[],sorting='',insert=null,cardinality='many';
    const value=(v,field)=>{params.push(jsonFields.has(field)&&v!==null?JSON.stringify(v):v);return `$${params.length}${jsonFields.has(field)?'::jsonb':uuidArrayFields.has(field)?'::uuid[]':''}`;};
    const q={
      select(cols='*'){projection=cols==='*'?'*':cols.split(',').map(s=>col(s.trim())).join(',');return q;},
      eq(field,v){filters.push(`${col(field)} = ${value(v,field)}`);return q;},
      in(field,vs){if(!Array.isArray(vs)||!vs.length)throw new Error('Filtro inválido');filters.push(`${col(field)} IN (${vs.map(v=>value(v,field)).join(',')})`);return q;},
      order(field,{ascending=true}={}){sorting=` ORDER BY ${col(field)} ${ascending?'ASC':'DESC'}`;return q;},
      insert(v){if(table!=='mechanic_sessions'||!v||typeof v!=='object')throw new Error('Inserção não permitida');insert=v;return q;},
      single(){cardinality='single';return q;},
      maybeSingle(){cardinality='maybe';return q;},
      async then(resolve,reject){
        try{
          const where=filters.length?' WHERE '+filters.join(' AND '):'';
          let sql;
          if(insert){const keys=Object.keys(insert);sql=`INSERT INTO public."${table}" (${keys.map(col).join(',')}) VALUES (${keys.map(k=>value(insert[k],k)).join(',')}) RETURNING ${projection}`;}
          else sql=`SELECT ${projection} FROM public."${table}"${where}${sorting}`;
          const data=await execute(sql,params);
          if(cardinality==='single'&&data.length!==1 || cardinality==='maybe'&&data.length>1)throw new Error('Resultado inválido');
          return resolve({data:cardinality==='many'?data:data[0]||null,error:null});
        }catch(e){return resolve({data:null,error:e});}
      },
    };
    return q;
  }
  async function rpc(name,args){
    try{
      if(!Object.hasOwn(rpcSignatures,name))throw new Error('Operação não permitida');
      const signature=rpcSignatures[name];
      if(!args||Object.keys(args).length!==signature.length||signature.some(([key])=>!Object.hasOwn(args,key)))throw new Error('Argumentos inválidos');
      const data=await execute(`SELECT public.${name}(${signature.map(([,type],i)=>`$${i+1}::${type}`).join(',')}) AS result`,signature.map(([key,type])=>type==='jsonb'&&args[key]!==null?JSON.stringify(args[key]):args[key]));
      return {data:data[0]?.result,error:null};
    }catch(e){return {data:null,error:e};}
  }
  return {from,rpc,storage};
}
