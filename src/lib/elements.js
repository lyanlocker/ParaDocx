export {canSeeLayer, requiresUV} from '../../supabase/functions/player-access/visibility.js';
export const elements = [
 {id:'none',name:'Sem afinidade',title:'O arquivo do inexplicável',description:'Toda evidência guarda uma história. Algumas ainda esperam por você.',tag:'REALIDADE',color:'#d7bc85'},
 {id:'sangue',name:'Sangue',title:'O arquivo pulsa.',description:'Há memórias que não foram escritas. Foram sentidas.',tag:'SENTIR É EXISTIR',color:'#ff6677'},
 {id:'energia',name:'Energia',title:'Nada permanece igual.',description:'Entre o ruído e o acaso, a próxima pista muda tudo.',tag:'ACEITE O CAOS',color:'#df8bff'},
 {id:'medo',name:'Medo',title:'Algo observa de volta.',description:'Nem tudo o que se revela deveria ser compreendido.',tag:'ALÉM DA MEMBRANA',color:'#74e6ed'},
 {id:'morte',name:'Morte',title:'O tempo deixa vestígios.',description:'Cada volta da espiral aproxima o que parecia distante.',tag:'TUDO RETORNA',color:'#c1c7cb'},
 {id:'conhecimento',name:'Conhecimento',title:'Nada está aqui por acaso.',description:'Um traço. Uma ausência. Um significado que espera ser decifrado.',tag:'DECIFRE O IMPOSSÍVEL',color:'#f0cd70'},
];
export const getElement=id=>elements.find(e=>e.id===id)||elements[0];

// Ink is distinct from the light UI accent so clues remain legible on paper.
export const affinityInk={sangue:'#c51d35',energia:'#a02cce',medo:'#008fa8',morte:'#17191d',conhecimento:'#a47a00'};
export const getAffinityInk=layer=>Object.hasOwn(affinityInk,layer?.affinity)?affinityInk[layer.affinity]:undefined;

// Selecting an affinity means immediate revelation. UV is a separate opt-in.
export function affinitySelection(layer,affinity){
 return {affinity,...(Object.hasOwn(affinityInk,affinity)?{uv:false,...(layer.kind==='uv'?{kind:'normal'}:{})}:{})};
}
