
import React, {useEffect,useState} from 'react';
import {templates} from './data/templates';

function PlayerSheet({document,side}) {
  const [uv,setUV]=useState(false);
  const [point,setPoint]=useState({x:-100,y:-100});
  const layout=templates.find(t=>t.id===document.template)||templates[0];
  const layers=Array.isArray(document.pages?.[side])?document.pages[side]:[];
  const mask=uv?'radial-gradient(circle 110px at '+point.x+'% '+point.y+'%, black 12%,transparent 100%)':'linear-gradient(transparent,transparent)';
  const draw=l=><div key={l.id} className={'document-layer '+(l.kind==='uv'?'secret-text':'')} style={{left:l.x+'%',top:l.y+'%',width:(l.width||70)+'%',fontSize:(l.fontSize||18)+'px'}}>{l.text}</div>;
  return <div className="document-frame">
    <div className="sheet-toolbar"><span>DOCUMENTO / {side==='front'?'FRENTE':'VERSO'}</span><button className={'uv-toggle '+(uv?'illuminated':'')} onClick={()=>setUV(v=>!v)}>{uv?'☼ Apagar luz negra':'☼ Ligar luz negra'}</button></div>
    <div className={'document-sheet sheet-'+layout.paper} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect();setPoint({x:(e.clientX-b.left)/b.width*100,y:(e.clientY-b.top)/b.height*100})}} onPointerLeave={()=>setPoint({x:-100,y:-100})}>
      <div className="paper-grain"/><div className="sheet-ornament">ARQUIVO DE EVIDÊNCIAS • PARADOCX</div>
      {layers.filter(l=>l.kind!=='uv').map(draw)}
      <div className="uv-content" style={{WebkitMaskImage:mask,maskImage:mask}}>{layers.filter(l=>l.kind==='uv').map(draw)}</div>
      {uv&&<div className="torch" style={{left:point.x+'%',top:point.y+'%'}}/>}
    </div>
    <small className="paper-help">Mova a lanterna sobre a folha para investigar mensagens escondidas.</small>
  </div>;
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
    const interval=setInterval(reload,8000);
    return ()=>{alive=false;clearInterval(interval)};
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
      {error ? <div className="player-message"><h1>Acesso não autorizado.</h1><p>{error}</p><p>Peça ao mestre para gerar um novo link exclusivo.</p></div> :
      !state ? <div className="splash">✦ Abrindo seu arquivo de investigação...</div> :
      <>
        <div className="eyebrow">CAMPANHA / {state.campaign.name.toUpperCase()}</div>
        <div className="player-heading"><div><h1>Olá, {state.player.name}<span className="period">.</span></h1><p>{document?'Examine todas as pistas deste documento.':'Aqui estão os documentos que o mestre entregou a você.'}</p></div><span className="player-count">▤ {state.documents.length} DOCUMENTO(S)</span></div>
        {notice&&<div className="portal-notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
        {document ? <div className="player-reader">
          <div className="reader-nav"><button className="outline" onClick={()=>{setSelected(null);setTarget('')}}>← Meu inventário</button><h2>{document.title}</h2></div>
          <div className="page-switch"><button className={side==='front'?'chosen':''} onClick={()=>setSide('front')}>Frente</button><button className={side==='back'?'chosen':''} onClick={()=>setSide('back')}>Verso</button></div>
          <PlayerSheet document={document} side={side}/>
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
