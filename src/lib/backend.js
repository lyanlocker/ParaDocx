export const useNeon=import.meta.env.VITE_PARADOCX_BACKEND==='neon';
export function functionUrl(name){return useNeon?`/api/neon-${name==='master-access'?'master':'player'}`:import.meta.env.VITE_SUPABASE_URL+'/functions/v1/'+name;}
export function functionHeaders(){return {'Content-Type':'application/json',...(useNeon?{}:{apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY})};}
