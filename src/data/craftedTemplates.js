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
      S('C A D E R N O  D E  C A M P O', 30, 27, 50, 20, 'masthead'),
      S('Investigador: ______________', 30, 35, 48, 13, 'label'),
      S('Propriedade do autor', 30, 39, 48, 11, 'date'),
      S('Nove de novembro. Encontrei o porão. Não constava no inventário da casa, e mesmo assim havia poeira sobre ele — poeira de dentro.', 24, 52, 68, 15, 'script'),
      S('Anotar antes de esquecer: o símbolo no batente estava invertido.', 24, 70, 68, 15, 'script'),
      S('Página 1', 30, 86, 20, 11, 'label')
    ],
    backLayers: [
      S('Página 47', 79, 13, 18, 11, 'label'),
      S('Lista de nomes', 29, 17, 50, 20, 'heading'),
      S('H. Blackwood — registrado em 1911, sem certidão de nascimento.\nDr. V. Ames — [ilegível]\nA testemunha do cais.', 29, 27, 55, 14, 'body'),
      S('Se alguém ler isto: procure a terceira tábua.', 29, 58, 55, 16, 'script')
    ],
    secrets: [
      S('NÃO CONFIE NO CARTÓGRAFO', 24, 78, 60, 15, 'secret', 'uv')
    ],
    premiumArtwork: true
  },
  {
    id: 'computer',
    name: 'Terminal do Arquivo',
    type: 'Objetos',
    icon: '▤',
    paper: 'computer',
    description: 'Saída de terminal de um mainframe dos anos 80 com arquivo corrompido.',
    layers: [
      S('ARQUIVO CENTRAL // ACESSO 04', 15, 20, 70, 13, 'mono'),
      S('> busca: NOMES AUSENTES', 15, 24, 70, 15, 'mono'),
      S('> resultado 1/3\nSUJEITO: H. BLACKWOOD\nSTATUS: SEM REGISTRO CIVIL\nOBS.: consta em 3 certidões distintas', 15, 30, 70, 13, 'mono'),
      S('> resultado 2/3\nARQUIVO: CASA / SUBSOLO\nCONTEUDO: 1 OBJETO NAO IDENTIFICADO', 15, 47, 70, 13, 'mono'),
      S('> resultado 3/3\nACESSO BLOQUEADO', 15, 60, 70, 13, 'mono'),
      S('> _', 15, 66, 70, 18, 'mono')
    ],
    backLayers: [
      S('DIAGNÓSTICO DE FALHA', 20, 24, 60, 16, 'mono'),
      S('leitura de fita recuperada — 62% dos setores íntegros\nsetor 09: índice corrompido\nsetor 31: conteúdo substituído em 03/11', 20, 33, 60, 13, 'mono')
    ],
    secrets: [
      S('SETOR 31 → CASA / SUBSOLO / PÁTIO', 17, 82, 66, 13, 'secret', 'uv')
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
      S('VINO DELLE TENEBRE', 30, 45, 40, 17, 'masthead'),
      S('Riserva del Custode — 1924', 30, 51, 40, 12, 'label'),
      S('PRODUZIDO NA CASA DE QUEM NÃO DORME', 29, 58, 42, 10, 'smallcaps'),
      S('A garrafa cheira a cânfora e sal.', 29, 64, 42, 13, 'script')
    ],
    backLayers: [
      S('Contramarca', 31, 42, 38, 16, 'heading'),
      S('A marca de fábrica nasce de um homem que voltou de Arkham sem lembrar do próprio nome.', 31, 50, 38, 15, 'body')
    ],
    secrets: [
      S('ÀS 3 DA MANHÃ, TERRA NOVIDO', 18, 84, 64, 13, 'secret', 'uv')
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
      S('Casa Blackwood — janela do sótão', 20, 57, 60, 13, 'script'),
      S('23:40', 20, 61, 60, 11, 'label')
    ],
    backLayers: [
      S('Revelada em casa própria', 20, 20, 60, 14, 'script'),
      S('A revelação mostra uma janela acesa no andar superior. A planta do prédio não tem terceiro andar.', 20, 27, 60, 14, 'body')
    ],
    secrets: [
      S('HÁ UMA FIGURA NO VIDRO', 22, 44, 56, 15, 'secret', 'uv')
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
      S('LADO A — ARQUIVO', 15, 32, 70, 14, 'mono'),
      S('Seção 4: "o porão"', 15, 37, 70, 13, 'script'),
      S('LADO B — NÃO OUVIR', 15, 42, 70, 14, 'mono')
    ],
    backLayers: [
      S('Playlist', 20, 48, 60, 13, 'label'),
      S('1. Tecido\n2. Chuva\n3. A contagem ao contrário\n4. (corte)', 20, 53, 60, 13, 'body')
    ],
    secrets: [
      S('A CONTAGEM VAI ATÉ 13', 20, 44, 60, 15, 'secret', 'uv')
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
      S('MF-0417-A', 20, 80, 40, 13, 'mono'),
      S('SISTEMA DE CARTÓGRAFO DO ARQUIVO', 20, 14, 60, 12, 'mono'),
      S('Quadros 01–42 reproduzidos em miniatura', 20, 17, 60, 11, 'label')
    ],
    backLayers: [
      S('Instruções de leitura', 20, 80, 60, 12, 'label'),
      S('Ampliar 12×. A imagem do quadro 31 só aparece com luz ultravioleta.', 20, 84, 60, 12, 'body')
    ],
    secrets: [
      S('QUADRO 31: A MARCA DE ÁGUA', 20, 95, 60, 12, 'secret', 'uv')
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
      S('XII — A PORTA NO PARQUE', 27, 17, 46, 14, 'smallcaps'),
      S('Nenhuma casa recorda esta porta.', 27, 76, 46, 14, 'script')
    ],
    backLayers: [
      S('Posição XII — invertida', 27, 17, 46, 13, 'label'),
      S('A carta foi virada para baixo na última consulta. Alguém a consultou recentemente.', 27, 24, 46, 13, 'body')
    ],
    secrets: [
      S('XII → XII → XII → IX', 28, 90, 44, 15, 'secret', 'uv')
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
      S('VISITANTE', 33, 31, 34, 19, 'masthead'),
      S('Nome: A. Moretti', 50, 41, 28, 12, 'label'),
      S('Validade: 1 noite', 50, 46, 28, 12, 'label'),
      S('Setor 4 — Subsolo', 50, 51, 28, 12, 'body'),
      S('ACESSO RESTRITO', 30, 68, 40, 13, 'smallcaps')
    ],
    backLayers: [
      S('Instrução de acesso', 20, 40, 60, 13, 'label'),
      S('Não retire o crachá. O guarda lembra o rosto, não o nome.', 20, 45, 60, 13, 'body')
    ],
    secrets: [
      S('O GUARDA NÃO É HUMANO', 22, 52, 56, 13, 'secret', 'uv')
    ],
    premiumArtwork: true
  }
];
