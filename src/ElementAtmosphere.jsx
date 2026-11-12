import React from 'react';
import {elements,getElement} from './lib/elements.js';
// Vector interpretations of the five silhouettes supplied by the campaign master.
export function ElementSigil({element='none',className=''}) {
 return <svg className={'element-sigil '+className} viewBox="0 0 160 180" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 {element==='sangue'?<><path d="M79 17 83 151M29 82 129 78M36 123 126 119M24 150 133 146"/><path d="m76 22 6 50 3 72M32 86l45-5m9 37 40-3M31 154l97-4" strokeWidth="1.2"/></>:
 element==='energia'?<><path d="m44 22 46 50-26 40-15-20 62-60-25 89 11 40-35-53 57-30-27-12 30-52-77 87-17 25-12-3"/><path d="m37 20 47 69 13 46 15-22 24 5M67 106l14 43" strokeWidth="1.4"/></>:
 element==='medo'?<><path d="M51 47c-9-35 39-43 48-14 8 23-18 29-23 45l-2 25 25-45c10-10 17-7 13 4l-13 65-13 35-4-52c-40 4-31 28-9 42L51 100 39 59l32 27 1 19"/><circle cx="44" cy="46" r="7"/><circle cx="101" cy="116" r="5"/><path d="m41 64 29 30 34-37M49 77l11 40m22-18 5 35" strokeWidth="1.5"/></>:
 element==='morte'?<><path d="M83 90c-23-18-39 16-13 25 32 12 47-38 17-50-44-18-68 54-23 74 54 24 87-65 39-95-50-32-97 24-82 70"/><path d="M78 91v69m-5-66 6 71M42 49 22 24l9 34M108 44l24-15-13 31M43 131l-17 26 21-14m53-6 22 23-12-29M79 37V17m-17 12 3 12M22 90l-9 5M124 84l13 5"/><path d="M47 39c29-20 72 1 77 38M30 116c17 43 68 38 83 14" strokeWidth="1.2"/></>:
 element==='conhecimento'?<>{[0,1,2].map(r=><g key={r}>{Array.from({length:12+r*4},(_,i)=><path key={i} transform={'translate(80 90) rotate('+i*360/(12+r*4)+') translate(0 '+(-29-r*20)+')'} d={i%3===0?'m-4 3 0-8 7 4-7 4m0-4 8 0':i%3===1?'m-4 4 7-9m-7 0 7 9M0-5v11':'m-4-4 8 0-8 8 8 0M0-7v14'} strokeWidth="1.7"/>)}</g>)}<path d="M75 87c-8-13 15-15 10-3l-9 11 8 9m-10-13 12-3"/></>:
 <><circle cx="80" cy="90" r="48"/><path d="M80 24v132M19 90h122m-92-32 62 64m0-64-62 64" strokeWidth="1"/><path d="m80 60 10 20 20 10-20 10-10 20-10-20-20-10 20-10Z"/></>}
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
