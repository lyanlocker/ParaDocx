import React, {useId} from 'react';
import {elements,getElement} from './lib/elements.js';
import symbolReference from './assets/element-symbols-reference.png';

// Exact silhouettes from the master's reference, displayed through SVG viewports.
// Keep the source untouched: no approximated paths or invented Knowledge glyphs.
const symbolBounds={
 morte:[46,73,69,94], sangue:[138,81,75,72], conhecimento:[238,75,94,94],
 medo:[365,78,54,87], energia:[450,78,72,85],
};
export function ElementSigil({element='none',className=''}) {
 const maskId='element-symbol-'+useId().replace(/:/g,'');
 const bounds=Object.hasOwn(symbolBounds,element)?symbolBounds[element]:null;
 if(!bounds)return <svg className={'element-sigil '+className} viewBox="0 0 160 180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="80" cy="90" r="48"/><path d="M80 24v132M19 90h122m-92-32 62 64m0-64-62 64"/><path d="m80 60 10 20 20 10-20 10-10 20-10-20-20-10 20-10Z"/></svg>;
 const [x,y,w,h]=bounds;
 return <svg className={'element-sigil '+className} viewBox={bounds.join(' ')} aria-hidden="true" focusable="false">
   <defs><mask id={maskId} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h} style={{maskType:'luminance'}}>
     <image href={symbolReference} x="0" y="0" width="900" height="636" style={{filter:'grayscale(1) brightness(4)'}}/>
   </mask></defs>
   <rect x={x} y={y} width={w} height={h} fill="currentColor" mask={'url(#'+maskId+')'}/>
 </svg>;
}
export function ElementAtmosphere({element='none'}) {
 return <div className="element-atmosphere" aria-hidden="true"><div className="atmosphere-haze"/><div className="atmosphere-lines"/><div className="atmosphere-orbit"/><ElementSigil element={element}/><div className="atmosphere-grain"/></div>;
}
export function ElementHero({element='none',name,preview=false}) {
 const e=getElement(element);
 return <section className="element-hero"><div className="element-hero-copy"><span className="element-kicker">{preview?'SINTONIA DO MESTRE':e.tag} <i/> {e.name.toUpperCase()}</span><h2>{e.title}</h2><p>{e.description}</p><span className="element-signature">{name || 'ARQUIVO PARADOCX'} <b> / </b> {e.id==='none'?'MEMBRANA ESTÁVEL':'AFINIDADE ATIVA'}</span></div><div className="hero-sigil"><div className="sigil-orbit"/><ElementSigil element={element}/></div></section>;
}
export function ElementPicker({value,onChange,disabled=false,label='Afinidade'}) {
 return <label className="element-picker">{label}<select value={value||'none'} onChange={e=>onChange(e.target.value)} disabled={disabled}>{elements.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label>;
}
