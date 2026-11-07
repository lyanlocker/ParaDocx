/**
 * Modelos de artefatos físicos do ParaDocx.
 * Coordenadas em percentuais (0-100), como no restante da biblioteca.
 */

const S = (text, x, y, width, fontSize, style = 'body', kind = 'normal') => ({
  text, x, y, width, fontSize, style, kind
});

export const craftedTemplates = [
  {
    id: 'notebook',
    name: 'Caderno de Campo',
    type: 'Objetos',
    icon: '▣',
    paper: 'notebook',
    description: 'Caderno de couro com elástico. Frente e verso são páginas reais do caderno.',
    layers: [
      S('C A D E R N O  D E  C A M P O', 24, 30, 60, 22, 'masthead'),
      S('Investigador: ______________', 22, 40, 70, 14, 'label'),
      S('Caderno de bolso — propriedade do autor', 22, 45, 70, 12, 'date'),
      S('Nove de novembro. Encontrei o porão. Não estava no inventário da casa, e mesmo assim havia poeira sobre ele — poeira de dentro.', 22, 56, 68, 15, 'script'),
      S('Anotar antes de esquecer: o símbolo no batente estava invertido.', 22, 74, 68, 15, 'script')
    ],
    backLayers: [
      S('Página 47', 78, 8, 18, 11, 'label'),
      S('Lista de nomes', 22, 14, 60, 20, 'heading'),
      S('H. Blackwood — registrado em 1911, sem certidão de nascimento.\nDr. V. Ames — [ilegível]\nA testemunha do cais.', 22, 24, 68, 14, 'body'),
      S('Se alguém ler isto: procure a terceira tábua.', 22, 60, 68, 16, 'script')
    ],
    secrets: [
      S('NÃO CONFIE NO CARTÓGRAFO', 20, 84, 68, 16, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'computer',
    name: 'Terminal do Arquivo',
    type: 'Objetos',
    icon: '▤',
    paper: 'terminal',
    description: 'Saída de terminal de um mainframe dos anos 80 com arquivo corrompido.',
    layers: [
      S('ARQUIVO CENTRAL // ACESSO 04', 12, 20, 76, 13, 'mono'),
      S('> busca: NOMES AUSENTES', 12, 26, 76, 15, 'mono'),
      S('> resultado 1/3\nSUJEITO: H. BLACKWOOD\nSTATUS: SEM REGISTRO CIVIL\nOBS.: consta em 3 certidões distintas', 12, 34, 76, 13, 'mono'),
      S('> resultado 2/3\nARQUIVO: CASA / SUBSOLO\nCONTEUDO: 1 OBJETO NAO IDENTIFICADO', 12, 56, 76, 13, 'mono'),
      S('> resultado 3/3\nACESSO BLOQUEADO', 12, 72, 76, 13, 'mono'),
      S('> _', 12, 80, 76, 18, 'mono')
    ],
    backLayers: [
      S('DIAGNÓSTICO DE FALHA', 12, 16, 76, 16, 'mono'),
      S('leitura de fita recuperada — 62% dos setores íntegros\nsetor 09: índice corrompido\nsetor 31: conteúdo substituído em 03/11', 12, 26, 76, 13, 'mono')
    ],
    secrets: [
      S('SETOR 31 → CASA / SUBSOLO / PÁTIO', 14, 86, 72, 13, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'bottle',
    name: 'Garrafa de Vinho',
    type: 'Objetos',
    icon: '◍',
    paper: 'bottle',
    description: 'Rótulo de vinho com mensagem escrita a lápis sob a margem do papel.',
    layers: [
      S('VINO DELLE TENEBRE', 30, 46, 50, 18, 'masthead'),
      S('Riserva del Custode — 1924', 30, 52, 50, 12, 'label'),
      S('PRODUZIDO NA CASA DE QUEM NÃO DORME', 28, 72, 54, 11, 'smallcaps'),
      S('A garrafa cheira a cânfora e sal.', 30, 80, 50, 13, 'script')
    ],
    backLayers: [
      S('Contramarca', 22, 20, 60, 16, 'heading'),
      S('A marca de fábrica nasce de um homem que voltou de Arkham sem lembrar do próprio nome.', 22, 30, 62, 15, 'body')
    ],
    secrets: [
      S('ÀS 3 DA MANHÃ, TERRA NOVIDO', 16, 86, 70, 13, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    type: 'Objetos',
    icon: '▣',
    paper: 'polaroid',
    description: 'Fotografia instantânea com legenda a lápis na borda branca.',
    layers: [
      S('Casa Blackwood — janela do sótão', 16, 74, 60, 14, 'script'),
      S('23:40', 16, 79, 60, 12, 'label')
    ],
    backLayers: [
      S('Revelada em casa própria', 16, 12, 68, 14, 'script'),
      S('A revelação mostra uma janela acesa no andar superior. A planta do prédio não tem terceiro andar.', 16, 20, 68, 14, 'body')
    ],
    secrets: [
      S('HÁ UMA FIGURA NO VIDRO', 18, 88, 64, 16, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'cassette',
    name: 'Fita K-7',
    type: 'Objetos',
    icon: '▤',
    paper: 'cassette',
    description: 'Fita cassete com etiqueta manuscrita e uma faixa em branco.',
    layers: [
      S('LADO A — ARQUIVO', 14, 38, 60, 14, 'mono'),
      S('Seção 4: "o porão"', 14, 42, 60, 13, 'script'),
      S('LADO B — NÃO OUVIR', 14, 52, 60, 14, 'mono')
    ],
    backLayers: [
      S('Playlist', 14, 78, 60, 13, 'label'),
      S('1. Tecido\n2. Chuva\n3. A contagem ao contrário\n4. (corte)', 14, 82, 60, 13, 'body')
    ],
    secrets: [
      S('A CONTAGEM VAI ATÉ 13', 16, 88, 68, 15, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'microfiche',
    name: 'Microficha',
    type: 'Objetos',
    icon: '▩',
    paper: 'microfiche',
    description: 'Ficha de microfilme com quadros de imagem e código de indexação.',
    layers: [
      S('MF-0417-A', 12, 92, 40, 13, 'mono'),
      S('SISTEMA DE CARTÓGRAFO DO ARQUIVO', 12, 16, 76, 13, 'mono'),
      S('Quadros 01–42 reproduzidos em miniatura', 12, 22, 76, 11, 'label')
    ],
    backLayers: [
      S('Instruções de leitura', 12, 82, 60, 12, 'label'),
      S('Ampliar 12×. A imagem do quadro 31 só aparece com luz ultravioleta.', 12, 86, 76, 12, 'body')
    ],
    secrets: [
      S('QUADRO 31: A MARCA DE ÁGUA', 14, 96, 72, 12, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'tarot',
    name: 'Carta de Tarot',
    type: 'Objetos',
    icon: '✦',
    paper: 'tarot',
    description: 'Carta de tarot com moldura dourada; o selo central substitui a figura.',
    layers: [
      S('XII — A PORTA NO PARQUE', 22, 13, 56, 16, 'smallcaps'),
      S('Nenhuma casa recorda esta porta.', 22, 78, 56, 14, 'script')
    ],
    backLayers: [
      S('Posição XII — invertida', 22, 10, 56, 13, 'label'),
      S('A carta foi virada para baixo na última consulta. Alguém a consultou recentemente.', 22, 18, 56, 13, 'body')
    ],
    secrets: [
      S('XII → XII → XII → IX', 24, 88, 52, 15, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'badge',
    name: 'Crachá de Visitante',
    type: 'Objetos',
    icon: '▭',
    paper: 'badge',
    description: 'Crachá de acesso temporário com faixa de visitante e área carimbada.',
    layers: [
      S('VISITANTE', 30, 22, 40, 20, 'masthead'),
      S('Nome: A. Moretti', 46, 46, 40, 13, 'label'),
      S('Validade: 1 noite', 46, 52, 40, 13, 'label'),
      S('Setor 4 — Subsolo', 46, 58, 40, 13, 'body')
    ],
    backLayers: [
      S('Instrução de acesso', 14, 78, 72, 13, 'label'),
      S('Não retire o crachá. O guarda lembra o rosto, não o nome.', 14, 83, 72, 13, 'body')
    ],
    secrets: [
      S('O GUARDA NÃO É HUMANO', 16, 94, 68, 13, 'secret', 'uv')
    ],
    premiumArtwork: true
  }
];
