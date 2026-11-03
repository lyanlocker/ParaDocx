export async function masterAuth(action, values) {
  const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/master-access', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type':'application/json',
      'apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body:JSON.stringify({action,...values})
  });
  const payload=await response.json();
  if(!response.ok)throw new Error(payload.error||'Falha ao acessar o mestre');
  return payload;
}
