# Supabase no ParaDocx

## Esquema atual
O projeto Supabase conectado já recebeu a migração inicial e as migrações incrementais. `schema.sql` é um retrato da base original para banco novo; o modelo de acesso sem cadastro de jogadores é adicionado em `migrations/20261103101306_player_seat_private_links.sql`.

O modelo atual tem:
- `campaigns`: mestre autenticado, nome e limite de vagas.
- `members`: legado de autenticação; apenas o mestre usa Auth no fluxo novo.
- `player_seats`: vagas dos jogadores. Nomes e hashes de tokens; nunca guardar os links em claro.
- `documents.holder_seat_id`: possuidor atual; somente mestre pode consultar pelo Data API, e o jogador consulta pelo serviço autenticado com token.
- `player_transfers`: histórico de posse entre jogadores.
- `player-access`: Supabase Edge Function com `verify_jwt=false`, autenticação manual por token forte e checagem de posse. Chave service role exclusivamente no ambiente da função.

## Segurança e uso
- O banco tem RLS para as tabelas expostas. RPCs de criação/reemissão/desativação verificam o dono da campanha.
- O mestre distribui documentos pela `holder_seat_id`; não usar o campo legado `holder_id`.
- O link de cada jogador é um segredo de 256 bits, em URL fragment (`#/player/<token>`) e não é transmitido ao servidor de páginas. A Edge Function recebe o token em POST.
- Tokens de jogadores são rotacionáveis e revogáveis; a troca de dono ocorre em transação PostgreSQL com lock.
- A autorização de leitura do jogador ocorre no backend; nunca buscar todos os documentos com a chave publishable do frontend.
- Funções `SECURITY DEFINER` são de privilégio elevado e devem manter verificações rigorosas.
- As funções legadas `join_campaign` e `transfer_document` tiveram execução revogada de `authenticated`.

## Pendências
- Configurar a identidade real do mestre e revisar a política de registro público no Supabase Auth.
- Testar com contas de mestre e múltiplos links de jogadores.
- Verificar o fluxo de links revogados, transferência simultânea e atualizações periódicas.
- Revisar os avisos do Supabase Database Linter de funções elevadas: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
