# ParaDocx

Plataforma para criar documentos investigativos de RPG e gerenciar inventários individuais de jogadores.

## Acesso

- **Mestre:** o usuário de login é **`mestre01`** e usa uma senha privada definida em um link de ativação de uso único. O e-mail só é solicitado na ativação para recuperação/identidade Supabase Auth. O aplicativo usa a Edge Function `master-access` para autenticar o nome de usuário.
- **Jogadores:** não criam conta, não entram com e-mail nem senha. O mestre cria uma vaga com nome e copia um link individual secreto.
- **Links:** cada link contém um segredo aleatório de 256 bits no fragmento da URL (`#/player/<token>`). O banco armazena apenas SHA-256 do token. O mestre pode reemitir/revogar links.
- **Posse:** documentos pertencem a uma única vaga de jogador; a entrega para outro jogador atualiza a posse atomicamente e remove o acesso anterior.
- **Mecânicas:** módulo Dilema das Seis Portas, com sessões persistentes, cinco enigmas e inventário de recompensas.

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

### Elemental affinities and image clues (November 2026)

In a campaign, the master selects each player's affinity beside their name. The
player portal receives the saved affinity on its next refresh (up to 12 seconds),
including while reading a document. Existing players default to **Sem afinidade**.
Sangue, Energia, Medo, Morte and Conhecimento each have a reference-faithful sigil, palette,
background composition, frames and restrained animation; reduced-motion is honored.
The master's atmosphere selector is cosmetic and never changes a player's affinity.

The editor's **Adicionar imagem como camada** accepts PNG/JPEG/WEBP, preserving
transparency. Images can be moved, resized, rotated and set to contain/cover. In
**Camadas livres → Condições de revelação**, both text and images support independent
UV and affinity requirements. Combining them requires the matching affinity AND the
UV beam. **Simular visão de** previews each affinity without changing saved data.
Original document backdrops keep their original colors.

Layer schema: `{kind:'image', assetPath, alt, x,y,width,height,rotation,fit,opacity,
uv:boolean, affinity:'none'|'sangue'|'energia'|'medo'|'morte'|'conhecimento'}`.
Text layers retain their old schema; `kind:'uv'` remains supported. Paths refer to
private `handout-assets` objects. The player endpoint filters both sides by the
server's seat affinity before returning JSON and independently checks ownership,
publication, campaign and affinity before serving image bytes. No signed storage
URLs are returned to players. UV is an exploration effect, not encryption of
content a player is authorized to receive. Previously viewed clues cannot be erased
from a player's memory or screenshots.

Deployment: apply the two `20261112*` affinity migrations, then deploy
`player-access` with both `index.ts` and `visibility.js`, preserving `verify_jwt=false`
(the function authenticates private player tokens itself), then deploy the frontend.
The column-grants migration is required: direct updates may change only `affinity`,
not player names, token hashes, campaign IDs or enabled flags. The storage policies
also explicitly qualify `objects.name` to fix the original correlated-name bug.

Validation: `npm ci && npm run check` covers template integrity, legacy UV,
affinity combinations, both sides and asset authorization. Database verification
uses a rolled-back fixture to test master updates and outsider rejection. Browser
component QA covers atmospheric changes, image visibility and UV. Full production
login/upload/transfer with real player accounts still requires a session test.

### Reference symbols and automatic affinity clues

The five elemental silhouettes are displayed from the master's original reference
in `src/assets/element-symbols-reference.png`. SVG viewports and luminance masks
preserve the original strokes; only their UI tint changes. The source stays intact.

Choosing an element under **Afinidade necessária** clears the layer's UV requirement,
including legacy `kind:uv` text. Matching players see the text or image immediately.
The master can separately enable **Exigir também luz UV (opcional)** afterward.
Existing saved combinations remain intact until edited. Affinity text uses the
corresponding elemental ink in the editor and reader, including UV mode. Image
colors are preserved. A subtle light halo keeps dark ink legible on dark documents.

Validation: browser component checks verified the five source silhouettes, legacy
UV-to-affinity selection, automatic red text and images with UV off, disappearance
on mismatched affinity, and purple text with UV explicitly enabled. Production
account login and upload flows were not changed or exercised in this patch.

## Dilema das Seis Portas (Jianghu)

O mestre abre **Mecânicas** dentro de uma campanha, cria uma sessão, seleciona
seis investigadores por ordem (três para cada lado da prova Morte), importando o
arquivo JSON **privado** fornecido ao mestre com as respostas e os recortes
originais dos sigilos. O arquivo não pertence ao repositório público, ao bundle
Vite nem a arquivos de configuração públicos. A importação é enviada somente
ao endpoint autenticado do mestre e armazenada em uma tabela não acessível aos
clientes. Selecione a sessão e clique em **Tornar esta sessão ativa**; abra cada
prova pelo painel. Jogadores acessam **Mecânicas** usando seus links individuais.

- Sangue: quatro válvulas, validação individual e fila de sinais acionada pelo mestre.
- Morte: cinco fileiras digitais de cartas e frase cooperativa de quinze posições;
  ambas as partes funcionam no site, sem mapa físico.
- Conhecimento: 26 sigilos recortados do alfabeto e conferência por posição.
- Energia: painel independente de seis esferas, intertravamentos e três cliques.
- Medo: quatro documentos de recompensa entregues pelo mestre, tabuleiro compartilhado.

O backend usa o mesmo serviço `player-access` para autenticar o token individual
ou JWT válido do proprietário da campanha. O cliente recebe uma projeção da
atividade, nunca a configuração completa. O estado e as recompensas são gravados
atomicamente com uma versão para detectar concorrência. A sessão de treinamento
tem seu próprio estado e os papéis de teste ficam ocultos fora dela. O áudio usa
três WAV originais e deve ser habilitado pelo jogador. Não modifica fichas de
combate nem requer integração com Roblox.

### Controle de rodadas e sinais

- Sangue: os três sinais de suspense são sintetizados no navegador. Cada jogador
  deve clicar em **Ativar e testar áudio** uma vez. O resultado textual é exclusivo
  do mestre; a conclusão da prova é manual.
- Morte: o mestre revela ou oculta cada posição (esquerda, centro, direita) para
  um investigador do lado A ou todo o grupo, designa quem pode selecionar uma
  carta revelada e confere a escolha. Cada carta pode ser ampliada. O lado B recebe um número de conferências por pessoa em
  cada rodada; abrir uma nova rodada preserva as palavras confirmadas.
- Conhecimento: libere uma palavra por vez e escolha os participantes autorizados.
  Cada participante tem três conferências por rodada; os sigilos já confirmados
  permanecem válidos. Libere a palavra seguinte após concluir a atual. Os sigilos
  liberados podem ser ampliados mesmo por quem não está autorizado a jogar.
- Energia: autorize os investigadores que podem usar o painel; retirar autorização
  preserva o estado individual. Os intertravamentos não têm explicações no botão.

Os controles começam bloqueados, inclusive em sessões anteriores à revisão.
O mestre escolhe os participantes. A configuração privada v2 mantém o mesmo
formato de respostas e acrescenta as cinco fileiras de três cartas (imagens WebP)
e as inscrições revisadas. As imagens só são entregues a cada investigador do
lado A quando reveladas para ele. Sessões anteriores preservam fileiras já abertas.

### Publicação e testes

1. Aplique a migration `20261121190639_dilema_seis_portas.sql` ao banco ParaDocx
   antes de implantar a Edge Function, pois a função consulta as novas tabelas e
   coluna de documentos.
2. Implante `player-access` com `index.ts`, `visibility.js`, `mechanics.js` e
   `mechanics-api.js`, mantendo `verify_jwt=false` (a função autentica tanto o
   token individual quanto o JWT do mestre internamente). Não exponha a service role.
3. Publique o frontend Vercel e teste em uma sessão de treinamento com dois links
   de jogador. Valide sons, reconexão, transferência, pausa, reset e precedência
   entre sessão real e treinamento. Confirme que jogadores não recebem gabaritos.

`npm test` inclui testes com dados artificiais para cada prova, as 216 sequências
de Energia, controle de acesso, duplicação de envios e reset isolado. Para validar
o bundle completo, execute `npm run build` com as variáveis públicas configuradas.
