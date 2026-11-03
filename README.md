# ParaDocx

Plataforma para criar documentos investigativos de RPG e gerenciar inventários individuais de jogadores.

## Acesso

- **Mestre:** o usuário de login é **`mestre01`** e usa uma senha privada definida em um link de ativação de uso único. O e-mail só é solicitado na ativação para recuperação/identidade Supabase Auth. O aplicativo usa a Edge Function `master-access` para autenticar o nome de usuário.
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
A primeira implementação está publicada. O acesso do mestre exige a ativação única entregue fora do repositório. Testes de uso real com mestre e dois jogadores e revisão de segurança/UX ainda são necessários.

**Importante:** o link é uma chave de acesso. Quem obtiver o link poderá acessar aquele jogador; reemitir o link revoga o anterior. URLs individuais não devem aparecer em repositórios, capturas de tela ou logs.

## Ativação única do mestre

O administrador do projeto gera um token de ativação de 256 bits na tabela `master_setup_token` (o valor em texto puro **não** deve ser salvo no GitHub) e o entrega ao mestre em um link `#/master-setup/<token>`. O mestre preenche e-mail e senha. A função `master-access` cria a única identidade do aplicativo e deixa o token inutilizável. Entradas posteriores usam `mestre01` + senha, sem solicitar e-mail novamente.

A política de criação de campanhas exige essa identidade aprovada; outros usuários de Auth não podem criar campanhas.
