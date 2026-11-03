# Supabase - ParaDocx

O Supabase conectado à aplicação já recebeu a estrutura inicial e as políticas de acesso. O arquivo `schema.sql` documenta o esquema para **um banco Supabase novo**, e não deve ser executado novamente no banco atual.

## Modelo de acesso

- `campaigns`: cada campanha possui um mestre (`owner_id`) e código de convite único.
- `members`: participantes e papéis de mestre/jogador. Entrada por chamada autenticada `join_campaign`.
- `documents`: cada registro é **uma instância única**. O mestre vê todos os documentos; um jogador só lê os publicados de que é proprietário (`holder_id`).
- `transfers`: histórico das trocas. A função autenticada `transfer_document` bloqueia a linha antes de atualizar o proprietário, impedindo transferências concorrentes.
- `private`: funções auxiliares de RLS e triggers; esquema fora da API pública.

## Segurança

- Todas as tabelas públicas possuem RLS.
- O frontend utiliza somente a chave publishable. Nunca envie uma chave de service role para Vite.
- As funções `join_campaign` e `transfer_document` são `SECURITY DEFINER` intencionalmente, limitadas ao papel `authenticated` e com verificações explícitas de identidade, campanha e posse. Devem ser auditadas em toda mudança.
- Documentos secretos não ficam visíveis aos jogadores antes de sua entrega.
- Não compartilhar URL de Storage público para arquivos secretos; preferir bucket privado com políticas específicas.

## Testes pendentes

- Criar contas reais separadas de mestre e dois jogadores.
- Validar entrada por convite, limite de membros, isolamento entre campanhas e RLS.
- Entregar um documento e garantir que o jogador anterior perde acesso após transferi-lo.
- Testar simultaneidade das transferências e atualizações via Realtime.

Não executamos esses testes ponta a ponta com contas reais ainda.
