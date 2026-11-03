# ParaDocx

Plataforma para criar documentos investigativos de RPG e gerenciar inventários individuais de jogadores.

## Acesso

- **Mestre (mestre01):** área de administração protegida por conta Supabase Auth com e-mail e senha. `mestre01` é o identificador exibido na interface; ainda é necessário configurar a conta real do mestre.
- **Jogadores:** não criam conta, não entram com e-mail nem senha. O mestre cria uma vaga com nome e copia um link individual secreto.
- **Links:** cada link contém um segredo aleatório de 256 bits no fragmento da URL (`#/player/<token>`). O banco armazena apenas SHA-256 do token. O mestre pode reemitir/revogar links.
- **Posse:** documentos pertencem a uma única vaga de jogador; a entrega para outro jogador atualiza a posse atomicamente e remove o acesso anterior.
- **Mecânicas:** área reservada, sem funcionalidade ativa.

## Editor
Modelos com campos rápidos e edição livre por camadas, frente e verso, mensagens reveladas pela luz negra.

## Tecnologias
React + Vite, Supabase Auth/Postgres/RLS/Edge Functions e Vercel.

## Desenvolvimento local
1. Copie `.env.example` para `.env.local` e configure as chaves públicas (nunca use service role no browser).
2. Execute `npm install` e `npm run dev`.
3. Para banco novo, siga `supabase/schema.sql` e as migrações em `supabase/migrations/`.
4. Para link de jogador, implante a função `supabase/functions/player-access/index.ts` com `verify_jwt=false`. A função autentica internamente cada chamada pelo token privado; sua credencial service role permanece somente no servidor.

## Status
A primeira implementação está publicada. Testes de uso real entre dois jogadores, contas de mestre e revisão de segurança/UX ainda são necessários.

**Importante:** o link é uma chave de acesso. Quem obtiver o link poderá acessar aquele jogador; reemitir o link revoga o anterior. URLs individuais não devem aparecer em repositórios, capturas de tela ou logs.
