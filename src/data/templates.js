export const templates = [
  {id:'letter',name:'Carta antiga',type:'Correspondência',icon:'✉',paper:'letter',layers:[
    {id:'l1',kind:'normal',text:'Prezado investigador,',x:12,y:17,width:76,fontSize:26},
    {id:'l2',kind:'normal',text:'Encontramos algo estranho na propriedade Blackwood. Preciso que venha antes do anoitecer. Não confie nos registros da cidade.',x:12,y:32,width:74,fontSize:19},
    {id:'l3',kind:'normal',text:'Atenciosamente,\nA. Moretti',x:12,y:76,width:72,fontSize:19}
  ]},
  {id:'report',name:'Relatório policial',type:'Investigação',icon:'▤',paper:'report',layers:[
    {id:'r1',kind:'normal',text:'RELATÓRIO CONFIDENCIAL',x:10,y:13,width:80,fontSize:26},
    {id:'r2',kind:'normal',text:'ARQUIVO Nº 0417 · ARKHAM, 1928',x:10,y:27,width:80,fontSize:15},
    {id:'r3',kind:'normal',text:'Durante a vistoria, foram identificadas evidências de atividades não registradas no porão da residência.',x:10,y:44,width:79,fontSize:18}
  ]},
  {id:'news',name:'Recorte de jornal',type:'Imprensa',icon:'▥',paper:'news',layers:[
    {id:'n1',kind:'normal',text:'THE ARKHAM TIMES',x:8,y:10,width:85,fontSize:35},
    {id:'n2',kind:'normal',text:'DESAPARECIMENTOS NA CIDADE',x:8,y:30,width:84,fontSize:26},
    {id:'n3',kind:'normal',text:'Moradores relatam luzes inexplicáveis e movimentações noturnas. Autoridades negam qualquer ligação com os eventos recentes.',x:9,y:49,width:80,fontSize:17}
  ]},
  {id:'occult',name:'Página de grimório',type:'Ocultismo',icon:'☽',paper:'occult',layers:[
    {id:'o1',kind:'normal',text:'LIBER NOCTIS',x:14,y:14,width:72,fontSize:29},
    {id:'o2',kind:'normal',text:'☽   ✧   ⟁   ☉   ✦',x:16,y:37,width:69,fontSize:26},
    {id:'o3',kind:'normal',text:'Que a passagem permaneça fechada até que a última estrela desperte.',x:14,y:61,width:72,fontSize:19}
  ]},
  {id:'blank',name:'Documento em branco',type:'Personalizado',icon:'▯',paper:'letter',layers:[]}
];
export const newPages = (template) => ({
  front: [...template.layers.map(layer=>({...layer})), {id:'uv-'+Math.random().toString(36).slice(2),kind:'uv',text:'A CHAVE ESTÁ SOB O ASSOALHO',x:13,y:87,width:75,fontSize:18}],
  back:[]
});
