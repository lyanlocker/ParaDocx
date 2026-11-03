
import React, { useEffect, useRef, useState } from 'react';
import { supabase as db } from './lib/supabase';
import { templates, newPages } from './data/templates';

const id = () => Math.random().toString(36).slice(2, 11);
const getTemplate = (key) => templates.find(t => t.id === key) || templates[0];

function Sheet({ pages, side, paper, editable, selected, onSelect, onDrag }) {
  const [uv, setUV] = useState(false);
  const [point, setPoint] = useState({ x: -100, y: -100 });
  const sheet = useRef(null);
  const dragging = useRef(null);
  const list = Array.isArray(pages?.[side]) ? pages[side] : [];
  function down(e, layer) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(layer.id);
    dragging.current = { id: layer.id, x: layer.x, y: layer.y, startX: e.clientX, startY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e) {
    const b = sheet.current?.getBoundingClientRect();
    if (!b) return;
    const x = Math.round((e.clientX - b.left) / b.width * 100);
    const y = Math.round((e.clientY - b.top) / b.height * 100);
    setPoint({ x, y });
    if (editable && dragging.current) {
      const d = dragging.current;
      const nx = Math.min(96, Math.max(0, Math.round(d.x + (e.clientX - d.startX) / b.width * 100)));
      const ny = Math.min(96, Math.max(0, Math.round(d.y + (e.clientY - d.startY) / b.height * 100)));
      onDrag(d.id, nx, ny);
    }
  }
  const uvMask = uv ? 'radial-gradient(circle 110px at ' + point.x + '% ' + point.y + '%, black 12%, transparent 100%)' : 'linear-gradient(transparent,transparent)';
  const renderLayer = layer => <div
    key={layer.id}
    className={'document-layer ' + (layer.kind === 'uv' ? 'secret-text ' : '') + (editable && selected === layer.id ? 'is-selected' : '')}
    style={{ left: layer.x + '%', top: layer.y + '%', width: layer.width + '%', fontSize: layer.fontSize + 'px' }}
    onPointerDown={editable ? e => down(e, layer) : undefined}
  >{layer.text}</div>;
  return <div className="document-frame">
    <div className="sheet-toolbar">
      <span>☷ DOCUMENTO / {side === 'front' ? 'FRENTE' : 'VERSO'}</span>
      {!editable && <button className={'uv-toggle ' + (uv ? 'illuminated' : '')} onClick={() => setUV(v => !v)}>{uv ? '☼ Desligar UV' : '☼ Luz negra'}</button>}
      {editable && <span className="editor-indicator">CAMADAS SECRETAS VISÍVEIS NO EDITOR</span>}
    </div>
    <div className={'document-sheet sheet-' + paper} ref={sheet} onPointerMove={move} onPointerUp={() => dragging.current = null} onPointerCancel={() => dragging.current = null} onPointerLeave={() => { if (!editable) setPoint({x: -100,y:-100}); }}>
      <div className="paper-grain" />
      <div className="sheet-ornament">ARQUIVO DE EVIDÊNCIAS • PARADOCX</div>
      {list.filter(l => l.kind !== 'uv').map(renderLayer)}
      <div className={'uv-content ' + (editable ? 'uv-editable' : '')} style={editable ? undefined : { WebkitMaskImage: uvMask, maskImage: uvMask }}>
        {list.filter(l => l.kind === 'uv').map(renderLayer)}
      </div>
      {!editable && uv && <div className="torch" style={{ left: point.x + '%', top: point.y + '%' }} />}
    </div>
    <small className="paper-help">{editable ? 'Arraste os textos para reposicionar · mensagens ocultas aparecem em dourado' : 'Mova o mouse ou o dedo sobre a folha para investigar com a luz negra'}</small>
  </div>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [register, setRegister] = useState(false);
  const [notice, setNotice] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [screen, setScreen] = useState('home');
  const [campaignName, setCampaignName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('5');
  const [joinCode, setJoinCode] = useState('');
  const [investigator, setInvestigator] = useState('Investigador');
  const [transferTargets, setTransferTargets] = useState({});
  const [working, setWorking] = useState(false);
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('letter');
  const [pages, setPages] = useState({front:[],back:[]});
  const [side, setSide] = useState('front');
  const [mode, setMode] = useState('quick');
  const [selected, setSelected] = useState(null);
  const isMaster = !!campaign && campaign.owner_id === session?.user?.id;
  const players = members.filter(m => m.role === 'player');
  const selectedLayer = (pages?.[side] || []).find(l => l.id === selected);

  useEffect(() => {
    if (!db) { setChecking(false); return; }
    db.auth.getSession().then(({data,error}) => { if(error)setNotice(error.message);setSession(data?.session || null);setChecking(false); });
    const {data:{subscription}} = db.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setCampaigns([]); setCampaign(null);setScreen('home');return; }
    loadCampaigns();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!campaign || !session || !db) return;
    refreshCampaign(campaign.id);
    const channel = db.channel('camp-' + campaign.id)
      .on('postgres_changes',{event:'*',schema:'public',table:'documents',filter:'campaign_id=eq.'+campaign.id},()=>refreshCampaign(campaign.id))
      .on('postgres_changes',{event:'*',schema:'public',table:'members',filter:'campaign_id=eq.'+campaign.id},()=>refreshCampaign(campaign.id))
      .subscribe();
    return () => { db.removeChannel(channel); };
  }, [campaign?.id, session?.user?.id]);

  async function loadCampaigns() {
    const {data,error} = await db.from('campaigns').select('*').order('created_at',{ascending:false});
    if (error) setNotice(error.message); else setCampaigns(data || []);
  }
  async function refreshCampaign(cid) {
    const [a,b] = await Promise.all([
      db.from('members').select('*').eq('campaign_id',cid),
      db.from('documents').select('*').eq('campaign_id',cid).order('created_at',{ascending:false})
    ]);
    if (a.error || b.error) setNotice((a.error || b.error).message);
    else {setMembers(a.data || []);setDocuments(b.data || []);}
  }
  async function login(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    setWorking(true);
    const r = register ? await db.auth.signUp({email,password}) : await db.auth.signInWithPassword({email,password});
    setWorking(false);
    if (r.error) setNotice(r.error.message);
    else setNotice(register ? 'Conta criada! Verifique seu e-mail para confirmar o cadastro, se solicitado.' : 'Bem-vindo ao ParaDocx.');
  }
  async function createCampaign(e) {
    e.preventDefault();setWorking(true);
    const {data,error} = await db.from('campaigns').insert({name:campaignName.trim(),owner_id:session.user.id,max_players:Number(maxPlayers)}).select().single();
    setWorking(false);
    if(error)return setNotice(error.message);
    await loadCampaigns();setCampaignName('');setCampaign(data);setScreen('campaign');setNotice('Campanha criada.');
  }
  async function joinCampaign(e) {
    e.preventDefault();setWorking(true);
    const {data,error} = await db.rpc('join_campaign',{p_code:joinCode.trim(),p_display_name:investigator.trim()});
    setWorking(false);
    if(error)return setNotice(error.message);
    const r = await db.from('campaigns').select('*').eq('id',data).single();
    if(r.error)return setNotice(r.error.message);
    setCampaign(r.data);setJoinCode('');setScreen('campaign');await loadCampaigns();setNotice('Você entrou na campanha!');
  }
  function startEditor(item, preset) {
    const p = preset || getTemplate(item?.template);
    setDocument(item || null);
    setTemplate(p.id);
    setTitle(item?.title || p.name);
    setPages(item ? JSON.parse(JSON.stringify(item.pages)) : newPages(p));
    setSide('front');setMode('quick');setSelected(null);setScreen('editor');
  }
  function openViewer(item) {
    setDocument(item);setTitle(item.title);setTemplate(item.template);
    setPages(item.pages);setSide('front');setScreen('viewer');
  }
  function updateLayer(layerId, field) {
    setPages(prev => ({...prev,[side]:(prev[side] || []).map(l=>l.id===layerId?{...l,...field}:l)}));
  }
  function addLayer(kind) {
    const l = {id:id(),kind,text:kind==='uv'?'Mensagem invisível':'Novo texto',x:14,y:25,width:74,fontSize:20};
    setPages(p=>({...p,[side]:[...(p[side]||[]),l]}));setSelected(l.id);setMode('advanced');
  }
  function deleteLayer() {
    setPages(p=>({...p,[side]:p[side].filter(l=>l.id!==selected)}));setSelected(null);
  }
  function chooseTemplate(key) {
    const p = getTemplate(key);
    if ((pages.front.length || pages.back.length) && !window.confirm('Trocar o modelo vai substituir os textos atuais. Continuar?')) return;
    setTemplate(key);setPages(newPages(p));setSelected(null);
  }
  async function saveDocument() {
    if(!title.trim())return setNotice('Informe um título.');
    setWorking(true);
    const body = {title:title.trim(),template,pages};
    const result = document ? await db.from('documents').update(body).eq('id',document.id).select().single() :
      await db.from('documents').insert({...body,campaign_id:campaign.id,created_by:session.user.id}).select().single();
    setWorking(false);
    if(result.error)return setNotice(result.error.message);
    await refreshCampaign(campaign.id);setScreen('campaign');setNotice('Documento salvo!');
  }
  async function assignDocument(doc, uid) {
    const {error} = await db.from('documents').update({holder_id:uid || null,is_published:!!uid}).eq('id',doc.id);
    if(error)return setNotice(error.message);
    await refreshCampaign(campaign.id);setNotice(uid?'Documento entregue.':'Documento recolhido pelo mestre.');
  }
  async function transferDocument(doc) {
    const target = transferTargets[doc.id];
    if(!target)return setNotice('Selecione um jogador para receber o documento.');
    const {error} = await db.rpc('transfer_document',{p_document:doc.id,p_recipient:target});
    if(error)return setNotice(error.message);
    await refreshCampaign(campaign.id);setNotice('Documento transferido.');
  }
  async function deleteDocument(doc) {
    if(!window.confirm('Excluir este documento definitivamente?'))return;
    const {error}=await db.from('documents').delete().eq('id',doc.id);
    if(error)return setNotice(error.message);
    await refreshCampaign(campaign.id);
  }

  if(checking)return <div className="splash">✦ Carregando o arquivo...</div>;
  if(!db)return <div className="splash"><h1>ParaDocx</h1><p>Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY na Vercel.</p></div>;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-emblem">P<sup>✦</sup></span><div><strong>ParaDocx</strong><small>O arquivo do inexplicável</small></div></div>
      <div className="side-label">NAVEGAÇÃO</div>
      <button className={'side-link '+(screen==='home'?'current':'')} onClick={()=>{setCampaign(null);setScreen('home');if(session)loadCampaigns()}}>⌂ <span>Minhas campanhas</span></button>
      {campaign&&<><button className={'side-link '+(['campaign','viewer','editor'].includes(screen)?'current':'')} onClick={()=>setScreen('campaign')}>▣ <span>Documentos</span></button><button className={'side-link '+(screen==='mechanics'?'current':'')} onClick={()=>setScreen('mechanics')}>♧ <span>Mecânicas</span></button></>}
      <div className="side-bottom"><div className="profile-icon">{session?.user?.email?.slice(0,1).toUpperCase()||'?'}</div><div className="profile-text"><strong>{session?.user?.email?.split('@')[0]||'Visitante'}</strong><small>{session?'Sessão conectada':'Acesso reservado'}</small>{session&&<button onClick={()=>db.auth.signOut()}>Sair ↗</button>}</div></div>
    </aside>
    <main className="main">
      <header className="top-bar"><span>PARADOCX / {campaign?.name?.toUpperCase()||'ARQUIVO'} / {screen.toUpperCase()}</span><span className="top-label">◉ AMBIENTE DE INVESTIGAÇÃO</span></header>
      {notice&&<div className="toast" role="status"><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="Fechar aviso">×</button></div>}
      {!session ? <div className="auth-screen"><div className="eyebrow">O SEGREDO ESTÁ NOS DETALHES</div><h1>Todo mistério começa<br/><em>com um documento.</em></h1><p>Crie pistas, revele mensagens invisíveis e entregue evidências aos seus investigadores.</p><div className="auth-card"><h2>{register?'Criar acesso':'Acessar o arquivo'}</h2><form onSubmit={login}><label>E-mail<input type="email" name="email" required placeholder="investigador@exemplo.com"/></label><label>Senha<input type="password" name="password" required minLength="6" placeholder="Sua senha"/></label><button disabled={working} className="primary full">{register?'Criar conta':'Entrar no ParaDocx'} →</button></form><button className="text-button" onClick={()=>setRegister(v=>!v)}>{register?'Já tenho uma conta':'Não tenho conta. Criar acesso'}</button></div></div> :
      screen==='home' ? <section className="page"><div className="eyebrow">SEU UNIVERSO DE INVESTIGAÇÃO</div><div className="page-heading"><div><h1>Suas campanhas<span className="period">.</span></h1><p>Organize suas histórias, pistas e jogadores em um só lugar.</p></div></div>
        <div className="home-grid"><div className="panel"><span className="eyebrow">01 / CRIAR HISTÓRIA</span><h2>Nova campanha</h2><p>Assuma o papel de mestre de uma investigação.</p><form onSubmit={createCampaign}><label>Nome<input required maxLength="120" placeholder="Ex.: O legado de Blackwood" value={campaignName} onChange={e=>setCampaignName(e.target.value)}/></label><label>Jogadores<select value={maxPlayers} onChange={e=>setMaxPlayers(e.target.value)}>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label><button className="primary full" disabled={working}>Criar campanha →</button></form></div>
        <div className="panel"><span className="eyebrow">02 / SEGUIR UMA PISTA</span><h2>Entrar em campanha</h2><p>Recebeu um código do mestre? Entre no arquivo.</p><form onSubmit={joinCampaign}><label>Código de convite<input required value={joinCode} maxLength="8" placeholder="EX.: 6A2C8B91" onChange={e=>setJoinCode(e.target.value.toUpperCase())}/></label><label>Nome do investigador<input required maxLength="60" value={investigator} onChange={e=>setInvestigator(e.target.value)}/></label><button disabled={working} className="outline full">Entrar na campanha ↗</button></form></div></div>
        <div className="section-heading"><h2>Campanhas disponíveis</h2><small>{campaigns.length} ARQUIVOS</small></div><div className="campaign-grid">{campaigns.map(c=><button key={c.id} className="campaign-card" onClick={()=>{setCampaign(c);setScreen('campaign')}}><span className="case-symbol">✧</span><small>{c.owner_id===session.user.id?'MESTRE':'INVESTIGADOR'}</small><h3>{c.name}</h3><span className="card-footer">ABRIR ARQUIVO ↗</span></button>)}{campaigns.length===0&&<div className="empty">Você ainda não participa de nenhuma campanha.</div>}</div>
      </section> :
      screen==='campaign' ? <section className="page"><div className="eyebrow">ARQUIVO DE CAMPANHA / {isMaster?'CONTROLE DO MESTRE':'INVESTIGAÇÃO'}</div><div className="page-heading"><div><h1>{campaign.name}<span className="period">.</span></h1><p>{isMaster?'Organize e distribua suas pistas.':'Investigue os documentos recebidos do mestre.'}</p></div>{isMaster&&<button className="primary" onClick={()=>startEditor(null,templates[0])}>+ Criar documento</button>}</div>
        <div className="stats"><div><small>DOCUMENTOS VISÍVEIS</small><strong>{documents.length}</strong></div><div><small>INVESTIGADORES</small><strong>{players.length}/{campaign.max_players}</strong></div><div><small>ACESSO</small><strong>{isMaster?'Mestre':'Jogador'}</strong></div></div>
        {isMaster&&<div className="invite"><small>✦ CÓDIGO DE CONVITE</small><strong>{campaign.join_code}</strong><button onClick={()=>navigator.clipboard?.writeText(campaign.join_code).then(()=>setNotice('Código copiado.')).catch(()=>setNotice('Copie o código manualmente.'))}>Copiar</button><span>Compartilhe com os jogadores desta campanha.</span></div>}
        {isMaster&&<><div className="section-heading"><h2>Biblioteca de modelos</h2><small>ESCOLHA O PONTO DE PARTIDA</small></div><div className="templates">{templates.map(t=><button key={t.id} className={'template-preview '+t.paper} onClick={()=>startEditor(null,t)}><span>{t.icon}</span><strong>{t.name}</strong><small>{t.type}</small></button>)}</div></>}
        <div className="section-heading"><h2>{isMaster?'Documentos da campanha':'Meu inventário'}</h2><small>{documents.length} ITENS</small></div><div className="doc-list">{documents.map(d=><div className="doc-row" key={d.id}><div className="doc-sign">▤</div><div className="doc-detail"><strong>{d.title}</strong><small>{getTemplate(d.template).name} • {d.is_published?'Entregue a '+(members.find(m=>m.user_id===d.holder_id)?.display_name||'jogador'):'No arquivo do mestre'}</small></div><div className="doc-controls"><button className="outline compact" onClick={()=>openViewer(d)}>Examinar</button>{isMaster?<><button className="outline compact" onClick={()=>startEditor(d)}>Editar</button><select className="compact-select" value={d.holder_id||''} onChange={e=>assignDocument(d,e.target.value)}><option value="">Recolher</option>{players.map(m=><option key={m.user_id} value={m.user_id}>{m.display_name}</option>)}</select><button className="danger" aria-label="Excluir documento" onClick={()=>deleteDocument(d)}>×</button></>:players.length>1&&<><select className="compact-select" value={transferTargets[d.id]||''} onChange={e=>setTransferTargets(p=>({...p,[d.id]:e.target.value}))}><option value="">Transferir para...</option>{players.filter(m=>m.user_id!==session.user.id).map(m=><option key={m.user_id} value={m.user_id}>{m.display_name}</option>)}</select><button className="outline compact" onClick={()=>transferDocument(d)}>Entregar →</button></>}</div></div>)}{documents.length===0&&<div className="empty">{isMaster?'Escolha um modelo e crie seu primeiro documento.':'Você ainda não recebeu documentos do mestre.'}</div>}</div>
        {isMaster&&<><div className="section-heading"><h2>Investigadores</h2><small>{players.length} PARTICIPANTES</small></div><div className="player-list">{players.length?players.map(m=><span key={m.user_id}><span className="profile-icon">{m.display_name[0]?.toUpperCase()}</span>{m.display_name}</span>):<p>Convide jogadores com o código acima.</p>}</div></>}
      </section> :
      screen==='mechanics' ? <section className="mechanics"><span className="eyebrow">MÓDULO EXPERIMENTAL</span><div className="mystery-icon">✧</div><h1>A próxima peça<br/><em>do mistério.</em></h1><p>Espaço reservado para enigmas e mecanismos interativos que criaremos juntos.</p><div className="coming">◈ MÓDULO INATIVO</div><button className="outline" onClick={()=>setScreen('campaign')}>← Voltar aos documentos</button></section> :
      ['editor','viewer'].includes(screen) ? <section className="workspace"><div className="workspace-heading"><button className="back-link" onClick={()=>setScreen('campaign')}>← Arquivo</button><div><span className="eyebrow">{screen==='editor'?'ESTÚDIO DE DOCUMENTOS':'LEITOR DE EVIDÊNCIAS'}</span><h2>{title}</h2></div>{screen==='editor'&&<button className="primary" onClick={saveDocument} disabled={working}>{working?'Salvando...':'Salvar documento ↗'}</button>}</div>
        <div className={'workspace-grid '+(screen==='viewer'?'view-only':'')}>
          {screen==='editor'&&<aside className="editor-panel"><div className="editor-title">EDITOR HÍBRIDO <span>✧</span></div><label>Título<input maxLength="150" value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Modelo<select value={template} onChange={e=>chooseTemplate(e.target.value)}>{templates.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label>
            <div className="mode-switch"><button className={mode==='quick'?'active':''} onClick={()=>setMode('quick')}>Campos rápidos</button><button className={mode==='advanced'?'active':''} onClick={()=>setMode('advanced')}>Camadas livres</button></div>
            {mode==='quick'?<div className="field-list">{(pages[side]||[]).map((l,i)=><label key={l.id}>{l.kind==='uv'?'✧ Mensagem secreta':'Texto '+(i+1)}<textarea rows="3" value={l.text} onChange={e=>updateLayer(l.id,{text:e.target.value})}/></label>)}<button className="outline" onClick={()=>addLayer('normal')}>+ Adicionar texto</button><button className="outline" onClick={()=>addLayer('uv')}>+ Adicionar segredo UV</button></div>:<><div className="layer-actions"><button onClick={()=>addLayer('normal')}>+ Texto</button><button onClick={()=>addLayer('uv')}>+ Luz negra</button></div><div className="layer-list">{(pages[side]||[]).map(l=><button className={selected===l.id?'selected':''} key={l.id} onClick={()=>setSelected(l.id)}>{l.kind==='uv'?'✧':'☰'} {l.text.slice(0,27)||'Texto vazio'}</button>)}</div>{selectedLayer&&<div className="layer-properties"><strong>Configurar camada</strong><textarea rows="4" value={selectedLayer.text} onChange={e=>updateLayer(selected,{text:e.target.value})}/><label>Tamanho da fonte: {selectedLayer.fontSize}<input type="range" min="10" max="44" value={selectedLayer.fontSize} onChange={e=>updateLayer(selected,{fontSize:Number(e.target.value)})}/></label><label>Largura: {selectedLayer.width}%<input type="range" min="20" max="95" value={selectedLayer.width} onChange={e=>updateLayer(selected,{width:Number(e.target.value)})}/></label><button className="danger" onClick={deleteLayer}>Excluir camada ×</button></div>}</>}
            <p className="editor-hint">Modo rápido para preencher. Modo livre para mover textos, redimensionar e inserir segredos.</p>
          </aside>}
          <div className="editor-stage"><div className="page-switch"><button className={side==='front'?'chosen':''} onClick={()=>{setSide('front');setSelected(null)}}>Frente</button><button className={side==='back'?'chosen':''} onClick={()=>{setSide('back');setSelected(null)}}>Verso</button></div>
            <Sheet key={screen+side+document?.id} pages={pages} side={side} paper={getTemplate(template).paper} editable={screen==='editor'} selected={selected} onSelect={setSelected} onDrag={(layerId,x,y)=>updateLayer(layerId,{x,y})}/>
          </div>
        </div>
      </section> : null}
    </main>
  </div>;
}
