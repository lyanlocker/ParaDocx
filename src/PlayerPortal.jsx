
import React, {useEffect,useState} from 'react';
import {templates} from './data/templates';
import DocumentCanvas from './DocumentCanvas.jsx';

/** Loads each scan through token-validated POST; never exposes a public Storage URL. */
function PlayerSheet({document,side,token}) {
  const [background,setBackground]=useState('');
  const [loading,setLoading]=useState(false);
  const path=document.pages?.backgrounds?.[side];
  useEffect(()=>{
    let active=true;
    let objectURL='';
    setBackground('');
    if(!path)return;
    setLoading(true);
    fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/player-access',{
      method:'POST',cache:'no-store',
      headers:{'Content-Type':'application/json','apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},
      body:JSON.stringify({action:'asset',token,document_id:document.id,side})
    }).then(async response=>{
      if(!response.ok)throw new Error('Imagem privada indisponível para este jogador.');
      const blob=await response.blob();
      if(!blob.type.startsWith('image/'))throw new Error('Formato não suportado.');
      objectURL=URL.createObjectURL(blob);
      if(active)setBackground(objectURL);
      else URL.revokeObjectURL(objectURL);
    }).catch(()=>{if(active)setBackground('');}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false;if(objectURL)URL.revokeObjectURL(objectURL);};
  },[document.id,path,side,token]);
  const layout=templates.find(t=>t.id===document.template)||templates[0];
  return <>
    {loading&&<p className="asset-loading" role="status">Carregando imagem privada…</p>}
    <DocumentCanvas key={document.id+'-'+side} pages={document.pages} side={side}
      templateId={document.template} paper={layout.paper} backgroundUrl={background}/>
  </>;
}
const call = async (token,action,other={}) => {
  const response=await fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/player-access',{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},
    body:JSON.stringify({token,action,...other}),
    cache:'no-store'
  });
  const data=await response.json();
  if(!response.ok) throw new Error(data.error||'Não foi possível acessar a campanha');
  return data;
};
export default function PlayerPortal({token}){
  const [state,setState]=useState(null),[error,setError]=useState(''),[selected,setSelected]=useState(null),[side,setSide]=useState('front'),[target,setTarget]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
  const document=state?.documents?.find(d=>d.id===selected);
  useEffect(()=>{
    let alive=true;
    async function reload(){
      try {
        const result=await call(token,'panel');
        if(alive){setState(result);setError('');}
      } catch(e){if(alive){setError(e.message);setState(null);}}
    }
    setSelected(null);setState(null);setError('');reload();
    const onVisibility=()=>{if(!window.document.hidden)reload();};
    window.document.addEventListener('visibilitychange',onVisibility);
    const interval=setInterval(()=>{if(!window.document.hidden)reload();},12000);
    return ()=>{alive=false;clearInterval(interval);window.document.removeEventListener('visibilitychange',onVisibility)};
  },[token]);
  async function transfer(d){
    if(!target)return setNotice('Escolha o investigador que receberá o documento.');
    if(!window.confirm('Entregar este documento? Você perderá o acesso a ele.'))return;
    setBusy(true);
    try{
      await call(token,'transfer',{document_id:d.id,recipient_id:target});
      setState(await call(token,'panel'));setSelected(null);setTarget('');
      setNotice('Documento entregue. Ele saiu do seu inventário.');
    }catch(e){setNotice(e.message);}
    finally{setBusy(false);}
  }
  return <div className="player-portal">
    <header className="player-topbar"><div className="player-brand"><span className="brand-emblem">P<sup>✦</sup></span><div><strong>ParaDocx</strong><small>Arquivo do investigador</small></div></div><span className="top-label">◉ ACESSO INDIVIDUAL</span></header>
    <main className="player-main">
      {error ? <div className="player-message"><h1>Não foi possível abrir o arquivo.</h1><p>{error}</p><p>Se seu link foi revogado, peça ao mestre um novo acesso. Se for uma falha de conexão, tente novamente.</p><button className="outline" onClick={()=>window.location.reload()}>Tentar novamente</button></div> :
      !state ? <div className="splash">✦ Abrindo seu arquivo de investigação...</div> :
      <>
        <div className="eyebrow">CAMPANHA / {state.campaign.name.toUpperCase()}</div>
        <div className="player-heading"><div><h1>Olá, {state.player.name}<span className="period">.</span></h1><p>{document?'Examine todas as pistas deste documento.':'Aqui estão os documentos que o mestre entregou a você.'}</p></div><span className="player-count">▤ {state.documents.length} DOCUMENTO(S)</span></div>
        {notice&&<div className="portal-notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
        {document ? <div className="player-reader">
          <div className="reader-nav"><button className="outline" onClick={()=>{setSelected(null);setTarget('')}}>← Meu inventário</button><h2>{document.title}</h2></div>
          <div className="page-switch"><button className={side==='front'?'chosen':''} onClick={()=>setSide('front')}>Frente</button><button className={side==='back'?'chosen':''} onClick={()=>setSide('back')}>Verso</button></div>
          <PlayerSheet document={document} side={side} token={token}/>
          {state.players.length>0&&<div className="reader-transfer"><h3>Entregar documento</h3><p>Ao entregar, este documento sairá do seu inventário e aparecerá para outro investigador.</p><div className="transfer-inputs"><select value={target} onChange={e=>setTarget(e.target.value)}><option value="">Escolher destinatário</option>{state.players.map(p=><option key={p.id} value={p.id}>{p.display_name}</option>)}</select><button className="primary" disabled={busy||!target} onClick={()=>transfer(document)}>{busy?'Entregando...':'Transferir →'}</button></div></div>}
        </div> :
        <>
          <div className="section-heading"><h2>Meu inventário</h2><small>{state.documents.length} EVIDÊNCIAS</small></div>
          <div className="player-doc-grid">{state.documents.map(d=><button className="player-doc-card" key={d.id} onClick={()=>{setSelected(d.id);setSide('front')}}><div className={'player-doc-paper '+(templates.find(t=>t.id===d.template)?.paper||'letter')}><span>{templates.find(t=>t.id===d.template)?.icon||'▤'}</span></div><div className="player-doc-info"><span>DOCUMENTO ENCONTRADO</span><h3>{d.title}</h3><small>EXAMINAR DOCUMENTO ↗</small></div></button>)}</div>
          {state.documents.length===0&&<div className="empty">Seu inventário está vazio. Aguarde o mestre entregar uma pista.</div>}
          <div className="portal-hint">Seu acesso é individual. Guarde este link: ele funciona como a chave do seu arquivo. Se precisar de outro, peça ao mestre para gerar um novo.</div>
        </>}
      </>}
    </main>
  </div>;
}
