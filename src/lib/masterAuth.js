import {functionUrl,functionHeaders} from './backend.js';
export async function masterAuth(action, values) {
  const response = await fetch(functionUrl('master-access'), {
    method: 'POST',
    cache: 'no-store',
    headers: functionHeaders(),
    body:JSON.stringify({action,...values})
  });
  const payload=await response.json();
  if(!response.ok)throw new Error(payload.error||'Falha ao acessar o mestre');
  return payload;
}
