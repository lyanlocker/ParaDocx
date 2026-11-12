import React from 'react';
import {requiresUV} from './lib/elements.js';
import {ElementPicker} from './ElementAtmosphere.jsx';

const styles=[
  ['body','Texto comum'],['script','Manuscrito'],['heading','Cabeçalho'],
  ['headline','Manchete'],['mono','Máquina de escrever'],['stamp','Carimbo'],
  ['symbol','Símbolos'],['smallcaps','Letras pequenas']
];
export default function LayerProperties({layer,onChange,onDelete}){
  const isImage=layer.kind==='image';
  const isCover=layer.kind==='cover';
  return <div className="layer-properties">
    <strong>{isCover?'▧ Tarja para substituir texto':isImage?'▧ Editar imagem':'Editar texto'}</strong>
    {isCover?<p className="layer-explanation">Cubra uma informação da imagem original. Depois crie uma camada de texto por cima para substituí-la.</p>
      :isImage?<><label>Descrição da imagem<input maxLength="140" value={layer.alt||''} onChange={e=>onChange({alt:e.target.value})}/></label><label>Ajuste<select value={layer.fit||'contain'} onChange={e=>onChange({fit:e.target.value})}><option value="contain">Imagem inteira</option><option value="cover">Preencher e recortar</option></select></label><label>Rotação: {layer.rotation||0}°<input type="range" min="-180" max="180" value={layer.rotation||0} onChange={e=>onChange({rotation:Number(e.target.value)})}/></label></>:<><label>Conteúdo<textarea rows="4" value={layer.text||''} onChange={e=>onChange({text:e.target.value})}/></label>
        <label>Tamanho da fonte: {layer.fontSize||18}
          <input type="range" min="10" max="44" value={layer.fontSize||18}
            onChange={e=>onChange({fontSize:Number(e.target.value)})}/></label>
        <label>Estilo<select value={layer.style||'body'} onChange={e=>onChange({style:e.target.value})}>
          {styles.map(([value,label])=><option value={value} key={value}>{label}</option>)}
        </select></label></>}
    <label>Largura: {layer.width||74}%
      <input type="range" min="5" max="95" value={layer.width||74}
        onChange={e=>onChange({width:Number(e.target.value)})}/></label>
    {(isCover||isImage)&&<><label>Altura: {layer.height||10}%
      <input type="range" min="2" max="70" value={layer.height||10}
        onChange={e=>onChange({height:Number(e.target.value)})}/></label>
      {isCover&&<label>Cor do papel para cobrir
        <input type="color" value={layer.color||'#eee1c7'} onChange={e=>onChange({color:e.target.value})}/></label>}
      <label>Opacidade: {Math.round((layer.opacity??1)*100)}%
        <input type="range" min="0.35" max="1" step="0.05" value={layer.opacity??1}
          onChange={e=>onChange({opacity:Number(e.target.value)})}/></label></>}
    {!isCover&&<fieldset className="reveal-rules"><legend>Condições de revelação</legend>
      <label className="checkbox-label"><input type="checkbox" checked={requiresUV(layer)} onChange={e=>onChange({uv:e.target.checked,...(layer.kind==='uv'?{kind:'normal'}:{})})}/> Exigir luz UV</label>
      <ElementPicker label="Afinidade necessária" value={layer.affinity} onChange={affinity=>onChange({affinity})}/>
      <small>{requiresUV(layer)?'Só aparece dentro do feixe UV. ': 'Visível sem lanterna. '}{layer.affinity&&layer.affinity!=='none'?'Apenas jogadores com a afinidade escolhida.':'Disponível para qualquer afinidade.'}</small>
    </fieldset>}
    <div className="position-row">
      <label>Horizontal (%)<input type="number" min="0" max="94" value={Math.round(layer.x||0)}
        onChange={e=>onChange({x:Math.max(0,Math.min(94,Number(e.target.value)||0))})}/></label>
      <label>Vertical (%)<input type="number" min="0" max="94" value={Math.round(layer.y||0)}
        onChange={e=>onChange({y:Math.max(0,Math.min(94,Number(e.target.value)||0))})}/></label>
    </div>
    <button type="button" className="danger" onClick={onDelete}>Excluir camada ×</button>
  </div>;
}
