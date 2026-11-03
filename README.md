# ParaDocx

Plataforma de documentos investigativos interativos para RPG.

## Recursos
- Campanhas separadas por mestre, jogadores e código de convite
- Biblioteca inicial de modelos
- Editor híbrido: preenchimento rápido e edição livre de camadas
- Frente e verso, além de mensagens reveladas por lanterna UV
- Inventário individual e transferência de posse
- Área reservada para mecânicas futuras

## Stack
React, Vite, Supabase (Auth, Postgres, Realtime) e Vercel.

## Desenvolvimento
Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em `.env.local` (exemplo em `.env.example`), execute `npm install` e `npm run dev`.

**Observação:** a versão inicial ainda precisa de testes ponta a ponta com mais de um jogador, revisão de segurança e aperfeiçoamento do editor.
