import React, {useEffect, useRef, useState} from 'react';
import {canSeeLayer,requiresUV,getAffinityInk} from './lib/elements.js';
import HandoutArt from './HandoutArt.jsx';

/**
 * The same document surface is used in the master's editor and in the player's inventory.
 * Text stays editable, imported scans stay as backgrounds, and UV secrets are revealed
 * only where the blue flashlight passes. No background asset URL is public by default.
 */
export default function DocumentCanvas({
  pages, side='front', paper='letter', templateId='letter',
  backgroundUrl='', imageUrls={}, affinity='none', preview=false, masterView=false, editable=false, selected=null, onSelect=()=>{}, onDrag=()=>{}
}) {
  const [uv,setUV]=useState(false);
  const [point,setPoint]=useState({x:50,y:50});
  const sheetRef=useRef(null);
  const dragRef=useRef(null);
  const layers=(Array.isArray(pages?.[side])?pages[side]:[]).filter(l=>masterView||editable&&!preview||canSeeLayer(l,affinity));
  const isEditing=editable&&!preview&&!uv;

  useEffect(()=>{
    if (!uv) return;
    document.body.classList.add('paradocx-uv-mode');
    return ()=>document.body.classList.remove('paradocx-uv-mode');
  },[uv]);
  useEffect(()=>{setUV(false);setPoint({x:50,y:50});},[side,templateId]);

  function updatePoint(e) {
    const rect=sheetRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPoint({
      x:Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100)),
      y:Math.max(0,Math.min(100,(e.clientY-rect.top)/rect.height*100))
    });
    if (!dragRef.current||!isEditing) return;
    const d=dragRef.current;
    const x=Math.max(0,Math.min(96,Math.round(d.x+(e.clientX-d.startX)/rect.width*100)));
    const y=Math.max(0,Math.min(96,Math.round(d.y+(e.clientY-d.startY)/rect.height*100)));
    onDrag(d.id,x,y);
  }
  function startDrag(e,layer){
    if(!isEditing)return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(layer.id);
    dragRef.current={id:layer.id,x:layer.x,y:layer.y,startX:e.clientX,startY:e.clientY};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function endInteraction(){dragRef.current=null;}
  const layerNode=layer=>{
    if(layer.kind==='image')return <div key={layer.id} className={'document-image-layer '+(isEditing&&selected===layer.id?'is-selected':'')+(requiresUV(layer)?' secret-image':'')}
      onPointerDown={isEditing?e=>startDrag(e,layer):undefined}
      style={{left:(Number(layer.x)||0)+'%',top:(Number(layer.y)||0)+'%',width:(Number(layer.width)||35)+'%',height:(Number(layer.height)||25)+'%',opacity:layer.opacity??1,transform:'rotate('+(Number(layer.rotation)||0)+'deg)'}}>
      {imageUrls[layer.id]?<img src={imageUrls[layer.id]} alt={layer.alt||'Imagem do documento'} draggable="false" style={{objectFit:layer.fit||'contain'}}/>:<span className="image-layer-placeholder">{isEditing?'▧ Imagem': 'Carregando imagem…'}</span>}
    </div>;
    if(layer.kind==='cover')return <div key={layer.id}
      className={'document-cover '+(isEditing&&selected===layer.id?'is-selected':'')}
      onPointerDown={isEditing?e=>startDrag(e,layer):undefined}
      style={{left:(Number(layer.x)||0)+'%',top:(Number(layer.y)||0)+'%',
        width:(Number(layer.width)||74)+'%',height:(Number(layer.height)||10)+'%',
        background:layer.color||'#eee1c7',opacity:Number.isFinite(layer.opacity)?layer.opacity:1}}
      title={isEditing?'Tarja para substituir partes do documento':'Área editada'}/>;
    const styleName=String(layer.style||'body').replace(/[^a-z]/g,'');
    const fontSize=Math.max(10,Math.min(44,Number(layer.fontSize)||18));
    return <div key={layer.id} className={'document-layer layer-'+styleName+
      (requiresUV(layer)?' secret-text':'')+(getAffinityInk(layer)?' affinity-text':'')+
      (isEditing&&selected===layer.id?' is-selected':'')}
      onPointerDown={isEditing?e=>startDrag(e,layer):undefined}
      style={{left:(Number(layer.x)||0)+'%',top:(Number(layer.y)||0)+'%',
        width:(Number(layer.width)||74)+'%', '--affinity-ink':getAffinityInk(layer),
        fontSize:'clamp(10px,'+(fontSize/5).toFixed(2)+'vw,'+fontSize+'px)'}}
    >{layer.text}</div>;
  };
  const position=point.x+'% '+point.y+'%';
  const secretMask=uv
    ?'radial-gradient(circle 130px at '+position+', black 0%, black 36%, transparent 98%)'
    :'linear-gradient(transparent,transparent)';
  const darkness=uv?'radial-gradient(circle 190px at '+position+
    ',rgba(13,24,55,.36) 0%,rgba(3,11,31,.62) 42%,rgba(1,5,17,.97) 100%)':undefined;
  return <div className={'document-frame '+(uv?'uv-running':'')}>
    <div className="sheet-toolbar">
      <span>☷ {side==='front'?'FRENTE':'VERSO'} {backgroundUrl?'· DOCUMENTO IMPORTADO':''}</span>
      <button type="button" className={'uv-toggle '+(uv?'illuminated':'')}
        aria-pressed={uv} onClick={()=>{endInteraction();setUV(v=>!v);setPoint({x:50,y:50});}}>
        {uv?'◉ Desligar lanterna UV':editable?'◉ Testar luz UV':'◉ Ativar lanterna UV'}
      </button>
    </div>
    <div className={'document-sheet sheet-'+paper+' side-'+side+' '+(backgroundUrl?'has-imported-background':'')}
      ref={sheetRef}
      onPointerDown={e=>{if(uv){e.currentTarget.setPointerCapture(e.pointerId);updatePoint(e);}}}
      onPointerMove={updatePoint} onPointerUp={endInteraction} onPointerCancel={endInteraction}
      onPointerLeave={()=>{if(uv&&!dragRef.current)setPoint({x:-100,y:-100});}}>
      <div className="paper-grain"/>
      {backgroundUrl
        ?<img className="document-imported-image" src={backgroundUrl}
          alt={'Documento importado — '+(side==='front'?'frente':'verso')} draggable="false"/>
        :pages?.backgrounds?.[side]
          ?<div className="document-background-placeholder" aria-hidden="true"/>
          :<HandoutArt templateId={templateId} side={side}/>}
      {layers.filter(l=>!requiresUV(l)).map(layerNode)}
      {uv && <><div className="uv-darkness" style={{background:darkness}}/>
        <div className="uv-blue-light" style={{left:point.x+'%',top:point.y+'%'}}/></>}
      <div aria-hidden={!isEditing&&!uv} className={'uv-content '+(isEditing?'uv-editable':'')+(uv?' uv-revealed':'')}
        style={isEditing?undefined:{WebkitMaskImage:secretMask,maskImage:secretMask}}>
        {layers.filter(l=>requiresUV(l)).map(layerNode)}
      </div>
      {uv&&<div className="uv-lens-ring" style={{left:point.x+'%',top:point.y+'%'}}/>}
    </div>
    <small className="paper-help">{uv?'Arraste o dedo ou mova o mouse para revelar as pistas sob a luz azul.':
      editable?'Arraste os textos para reposicionar. Ative a lanterna para testar as pistas ocultas.':
      'Examine o documento e use a lanterna UV para descobrir mensagens invisíveis.'}</small>
  </div>;
}
