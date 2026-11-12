
import React, {useEffect,useState} from 'react';
import {templates} from './data/templates';
import DocumentCanvas from './DocumentCanvas.jsx';
import {requiresUV} from './lib/elements.js';
import {ElementAtmosphere,ElementHero} from './ElementAtmosphere.jsx';
import HandoutArt from './HandoutArt.jsx';

/** Miniatura fiel do documento: arte + textos na mesma escala da folha real. */
function DocPreview({document}) {
  const layout=templates.find(t=>t.id===document.template)||templates[0];
  const layers=Array.isArray(document.pages?.front)?document.pages.front:[];
  return <div className={'player-doc-paper sheet-'+(layout.paper||'letter')}>
    <HandoutArt templateId={document.template} side="front"/>
    {layers.filter(l=>!requiresUV(l)&&l.kind!=='cover'&&l.kind!=='image').map(layer=>(
      <span key={layer.id} className={'doc-preview-layer layer-'+String(layer.style||'body').replace(/[^a-z]/g,'')}
        style={{left:(Number(layer.x)||0)+'%',top:(Number(layer.y)||0)+'%',
          width:(Number(layer.width)||74)+'%',
          fontSize:Math.max(4,Math.min(16,(Number(layer.fontSize)||18)*0.32))}}>{layer.text}</span>
    ))}
  </div>;
}

/** Loads each scan through token-validated POST; never exposes a public Storage URL. */
function PlayerSheet({document,side,token,affinity}) {
  const [background,setBackground]=useState('');
  const [imageUrls,setImageUrls]=useState({});
  const imageIds=JSON.stringify((document.pages?.[side]||[]).filter(l=>l.kind==='image'&&l.assetPath).map(l=>[l.id,l.assetPath]));
  const [loading,setLoading]=useState(false);
  const [assetError,setAssetError]=useState('');
  const path=document.pages?.backgrounds?.[side];
  useEffect(()=>{
    let active=true;
    let objectURL='';
    setBackground('');setAssetError('');
    if(!path){setLoading(false);return;}
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
    }).catch(error=>{if(active){setBackground('');setAssetError(error.message||'Imagem não disponível.');}})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false;if(objectURL)URL.revokeObjectURL(objectURL);};
  },[document.id,path,side,token]);
  useEffect(()=>{
    let active=true;const urls=[];setImageUrls({});
    const controller=new AbortController();
    Promise.all(JSON.parse(imageIds).map(async ([id])=>{
      const response=await fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/player-access',{
        method:'POST',cache:'no-store',signal:controller.signal,
        headers:{'Content-Type':'application/json','apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},
        body:JSON.stringify({action:'asset',token,document_id:document.id,side,layer_id:id})
      });
      if(!response.ok)throw new Error('Uma imagem não pôde ser carregada.');
      const blob=await response.blob();if(!blob.type.startsWith('image/'))throw new Error('Imagem inválida.');
      if(!active)return [id,''];
      const url=URL.createObjectURL(blob);urls.push(url);return [id,url];
    })).then(entries=>{if(active)setImageUrls(Object.fromEntries(entries));})
      .catch(error=>{if(active)setAssetError(error.message);});
    return ()=>{active=false;controller.abort();urls.forEach(url=>URL.revokeObjectURL(url));};
  },[document.id,imageIds,side,token,affinity]);
  const layout=templates.find(t=>t.id===document.template)||templates[0];
  return <>
    {loading&&<p className="asset-loading" role="status">Carregando imagem privada…</p>}
    {assetError&&<p className="asset-loading" role="alert">{assetError}</p>}
    <DocumentCanvas key={document.id+'-'+side} pages={document.pages} side={side}
      templateId={document.template} paper={layout.paper} backgroundUrl={background} imageUrls={imageUrls} affinity={affinity}/>
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
  return <div className="player-portal elemental-shell" data-element={state?.player?.affinity||'none'}><ElementAtmosphere element={state?.player?.affinity||'none'}/>
    <header className="player-topbar"><div className="player-brand"><span className="brand-emblem">P<sup>✦</sup></span><div><strong>ParaDocx</strong><small>Arquivo do investigador</small></div></div><span className="top-label">◉ ACESSO INDIVIDUAL</span></header>
    <main className="player-main">
      {error ? <div className="player-message"><h1>Não foi possível abrir o arquivo.</h1><p>{error}</p><p>Se seu link foi revogado, peça ao mestre um novo acesso. Se for uma falha de conexão, tente novamente.</p><button className="outline" onClick={()=>window.location.reload()}>Tentar novamente</button></div> :
      !state ? <div className="splash">✦ Abrindo seu arquivo de investigação...</div> :
      <>
        <div className="eyebrow">CAMPANHA / {state.campaign.name.toUpperCase()}</div>
        <div className="player-heading"><div><h1>Olá, {state.player.name}<span className="period">.</span></h1><p>{document?'Examine todas as pistas deste documento.':'Aqui estão os documentos que o mestre entregou a você.'}</p></div><span className="player-count">▤ {state.documents.length} DOCUMENTO(S)</span></div>
        {!document&&<ElementHero element={state.player.affinity} name={state.player.name}/>}
        {notice&&<div className="portal-notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
        {document ? <div className="player-reader">
          <div className="reader-nav"><button className="outline" onClick={()=>{setSelected(null);setTarget('')}}>← Meu inventário</button><h2>{document.title}</h2></div>
          <div className="page-switch"><button className={side==='front'?'chosen':''} onClick={()=>setSide('front')}>Frente</button><button className={side==='back'?'chosen':''} onClick={()=>setSide('back')}>Verso</button></div>
          <PlayerSheet key={document.id+state.player.affinity} affinity={state.player.affinity} document={document} side={side} token={token}/>
          {state.players.length>0&&<div className="reader-transfer"><h3>Entregar documento</h3><p>Ao entregar, este documento sairá do seu inventário e aparecerá para outro investigador.</p><div className="transfer-inputs"><select value={target} onChange={e=>setTarget(e.target.value)}><option value="">Escolher destinatário</option>{state.players.map(p=><option key={p.id} value={p.id}>{p.display_name}</option>)}</select><button className="primary" disabled={busy||!target} onClick={()=>transfer(document)}>{busy?'Entregando...':'Transferir →'}</button></div></div>}
        </div> :
        <>
          <div className="section-heading"><h2>Meu inventário</h2><small>{state.documents.length} EVIDÊNCIAS</small></div>
          <div className="player-doc-grid">{state.documents.map(d=><button className="player-doc-card" key={d.id} onClick={()=>{setSelected(d.id);setSide('front')}}><DocPreview document={d}/><div className="player-doc-info"><span>DOCUMENTO ENCONTRADO</span><h3>{d.title}</h3><small>EXAMINAR DOCUMENTO ↗</small></div></button>)}</div>
          {state.documents.length===0&&<div className="empty">Seu inventário está vazio. Aguarde o mestre entregar uma pista.</div>}
          <div className="portal-hint">Seu acesso é individual. Guarde este link: ele funciona como a chave do seu arquivo. Se precisar de outro, peça ao mestre para gerar um novo.</div>
        </>}
      </>}
    </main>
  </div>;
}
