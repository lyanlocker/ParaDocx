# ParaDocx

Plataforma para criar documentos investigativos de RPG e gerenciar inventários individuais de jogadores.

## Acesso

- **Mestre:** o usuário de login é **`mestre01`** e usa uma senha privada definida em um link de ativação de uso único. O e-mail só é solicitado na ativação para recuperação/identidade Supabase Auth. O aplicativo usa a Edge Function `master-access` para autenticar o nome de usuário.
- **Jogadores:** não criam conta, não entram com e-mail nem senha. O mestre cria uma vaga com nome e copia um link individual secreto.
- **Links:** cada link contém um segredo aleatório de 256 bits no fragmento da URL (`#/player/<token>`). O banco armazena apenas SHA-256 do token. O mestre pode reemitir/revogar links.
- **Posse:** documentos pertencem a uma única vaga de jogador; a entrega para outro jogador atualiza a posse atomicamente e remove o acesso anterior.
- **Mecânicas:** área reservada, sem funcionalidade ativa.

## Editor
Modelos com campos rápidos e edição livre por camadas, frente e verso, mensagens reveladas pela luz negra. Ao ativar a lanterna, a interface fica escura e um feixe azul-violeta acompanha mouse e toque, iluminando apenas a região examinada.

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

## Importação de arquivos

Na campanha, o mestre usa **Importar documento** ou abre qualquer documento no editor e encontra a ferramenta de importação.

- **PNG/JPG/WEBP:** a imagem é convertida em fundo privado da frente ou do verso selecionado.
- **PDF:** as primeiras duas páginas são convertidas no navegador para os fundos de frente e verso. Se o PDF possuir texto digital selecionável, é possível extrair esse texto para uma camada editável por cima. PDFs digitalizados não têm OCR automático.
- **TXT/MD:** o conteúdo é convertido diretamente em uma ou duas camadas de texto totalmente editáveis.
- **Tarja:** bloqueio visual editável (posição, tamanho, cor, opacidade) para cobrir palavras já impressas em scans e escrever texto novo por cima; não altera os pixels originais.
- Todas as importações aceitam até 15 MB de arquivo original; imagens convertidas devem ter até 5 MB cada. O arquivo permanece local até o mestre salvar o documento.

### Privacidade dos fundos importados

Os arquivos convertidos ficam no bucket **privado** `handout-assets`, em um caminho de campanha. Políticas do Storage permitem apenas ao mestre daquela campanha enviar, visualizar ou remover arquivos. A página do jogador nunca recebe uma URL pública de Storage: busca cada imagem via `player-access` usando `POST` e o token individual. A função verifica o documento, a campanha, a posse atual e a publicação **antes** de devolver os bytes da imagem. Ao transferir o documento, a próxima requisição do antigo jogador é negada.

**Limite:** um jogador pode guardar um arquivo que já tenha visualizado (assim como uma captura de tela); a revogação impede novos acessos, não apaga arquivos que a pessoa salvou.

## Testes

Use `npm test` para verificar modelos e tipos de importação; `npm run build` valida a compilação do site. Fluxos completos com mestre e dois jogadores devem ser testados também no navegador.
