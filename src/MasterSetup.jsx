import React,{useState} from 'react';
import {masterAuth} from './lib/masterAuth';

export default function MasterSetup({token,onComplete}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  async function activate(e){
    e.preventDefault();
    if(password!==confirm)return setError('As senhas informadas são diferentes.');
    if(password.length<12)return setError('Use uma senha com pelo menos 12 caracteres.');
    setSaving(true);setError('');
    try{
      await masterAuth('setup',{token,email,password});
      onComplete();
    }catch(err){setError(err.message);}finally{setSaving(false);}
  }
  return <div className="activation-screen"><div className="activation-brand">✦ PARADOCX / ATIVAÇÃO PRIVADA</div>
    <div className="activation-card"><span className="eyebrow">ACESSO INICIAL · MESTRE01</span><h1>Ative seu arquivo<span className="period">.</span></h1><p>Este link configura uma única conta de mestre. Depois, você acessará usando o nome <strong>mestre01</strong> e a senha definida aqui.</p>
      <form onSubmit={activate}>
        <label>E-mail de recuperação<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu e-mail pessoal"/></label>
        <label>Criar senha privada<input required type="password" autoComplete="new-password" minLength="12" maxLength="128" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Pelo menos 12 caracteres"/></label>
        <label>Confirmar senha<input required type="password" autoComplete="new-password" minLength="12" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repita sua senha"/></label>
        {error&&<div className="portal-notice">{error}</div>}
        <button type="submit" disabled={saving} className="primary full">{saving?'Ativando...':'Ativar mestre01 →'}</button>
      </form>
      <small>Este link pode ser usado apenas uma vez. Não compartilhe sua senha nem seu link de ativação.</small>
    </div>
  </div>;
}
