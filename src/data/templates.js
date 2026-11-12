import {craftedTemplates} from './craftedTemplates.js';

/** Modelos originais ParaDocx. Coordenadas em percentuais (0-100). */
const baseTemplates = [
  {
    "id": "letter",
    "name": "Carta do Crepúsculo",
    "type": "Correspondência",
    "icon": "✉",
    "paper": "letter",
    "description": "Correspondência envelhecida com assinatura e marcas de dobra.",
    "layers": [
      {
        "text": "Arkham, 17 de outubro de 1928",
        "x": 12,
        "y": 28,
        "width": 66,
        "fontSize": 15,
        "style": "date",
        "kind": "normal"
      },
      {
        "text": "Meu estimado investigador,",
        "x": 12,
        "y": 36,
        "width": 78,
        "fontSize": 22,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Encontrei algo perturbador nos arquivos da família Blackwood. Preciso que venha antes do anoitecer. Não confie nos registros oficiais.",
        "x": 12,
        "y": 45,
        "width": 76,
        "fontSize": 19,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "A. Moretti",
        "x": 16,
        "y": 78,
        "width": 65,
        "fontSize": 19,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "P.S. Evite a entrada principal. Há alguém observando a casa.",
        "x": 11,
        "y": 25,
        "width": 76,
        "fontSize": 19,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "A CHAVE ESTÁ SOB O ASSOALHO",
        "x": 15,
        "y": 87,
        "width": 70,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "report",
    "name": "Relatório de Ocorrência • 1928",
    "type": "Investigação",
    "icon": "▤",
    "paper": "report",
    "description": "Relatório oficial com ocorrência, protocolo e assinatura.",
    "layers": [
      {
        "text": "O ÚLTIMO PECADO",
        "x": 26,
        "y": 21,
        "width": 67,
        "fontSize": 16,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "ARQUIVO Nº 0417",
        "x": 23,
        "y": 25,
        "width": 62,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Aberto em: 13/10/1928",
        "x": 60,
        "y": 29,
        "width": 32,
        "fontSize": 12,
        "style": "label",
        "kind": "normal"
      },
      {
        "text": "Vistoria na residência Blackwood: foram identificados sinais de entrada clandestina durante a madrugada.",
        "x": 45,
        "y": 40,
        "width": 43,
        "fontSize": 13,
        "style": "body",
        "kind": "normal"
      },
      {
        "text": "Inspetor responsável: A. Moretti",
        "x": 10,
        "y": 74,
        "width": 80,
        "fontSize": 14,
        "style": "signature",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ANEXO • DEPOIMENTO",
        "x": 10,
        "y": 12,
        "width": 80,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "A testemunha afirma ter visto uma figura junto à janela do sótão, embora a propriedade esteja vazia há meses.",
        "x": 10,
        "y": 32,
        "width": 79,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "DOCUMENTO ALTERADO EM 14/10",
        "x": 15,
        "y": 72,
        "width": 73,
        "fontSize": 18,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "news",
    "name": "Gazeta de Arkham",
    "type": "Imprensa",
    "icon": "▥",
    "paper": "news",
    "description": "Jornal clássico com manchete, subtítulo e notícia.",
    "layers": [
      {
        "text": "THE ARKHAM TIMES",
        "x": 16,
        "y": 9,
        "width": 70,
        "fontSize": 33,
        "style": "masthead",
        "kind": "normal"
      },
      {
        "text": "EDIÇÃO ESPECIAL · 18 OUT 1928 · 5 CENTAVOS",
        "x": 12,
        "y": 20,
        "width": 76,
        "fontSize": 12,
        "style": "smallcaps",
        "kind": "normal"
      },
      {
        "text": "DESAPARECIMENTOS ASSOMBRAM A REGIÃO",
        "x": 9,
        "y": 24,
        "width": 82,
        "fontSize": 24,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "Moradores relatam luzes inexplicáveis na antiga propriedade. Autoridades investigam relatos contraditórios.",
        "x": 8,
        "y": 80,
        "width": 84,
        "fontSize": 16,
        "style": "news",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CONTINUAÇÃO DA REPORTAGEM",
        "x": 9,
        "y": 11,
        "width": 82,
        "fontSize": 22,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "Os registros do cartório foram recolhidos para perícia. Testemunhas afirmam que há uma segunda entrada no terreno.",
        "x": 9,
        "y": 34,
        "width": 80,
        "fontSize": 18,
        "style": "news",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "NÃO ACREDITE NA MANCHETE",
        "x": 13,
        "y": 79,
        "width": 77,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "occult",
    "name": "Folha do Grimório Lunar",
    "type": "Ocultismo",
    "icon": "☽",
    "paper": "occult",
    "description": "Manuscrito místico com símbolos arcanos.",
    "layers": [
      {
        "text": "O LIVRO DAS SOMBRAS",
        "x": 29,
        "y": 27,
        "width": 47,
        "fontSize": 19,
        "style": "ritual",
        "kind": "normal"
      },
      {
        "text": "☽  ✧  ⟁  ☉",
        "x": 31,
        "y": 40,
        "width": 41,
        "fontSize": 18,
        "style": "symbol",
        "kind": "normal"
      },
      {
        "text": "Quando o último sino despertar, a passagem se abrirá. Nenhum nome poderá ser pronunciado diante do espelho.",
        "x": 29,
        "y": 48,
        "width": 45,
        "fontSize": 16,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "O SELO QUEBRADO",
        "x": 15,
        "y": 18,
        "width": 70,
        "fontSize": 27,
        "style": "ritual",
        "kind": "normal"
      },
      {
        "text": "◈  ⟁  ☿  ✶  ☽",
        "x": 17,
        "y": 39,
        "width": 66,
        "fontSize": 30,
        "style": "symbol",
        "kind": "normal"
      },
      {
        "text": "O juramento exige três testemunhas e um círculo de sal.",
        "x": 14,
        "y": 67,
        "width": 72,
        "fontSize": 19,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ᚺ ᚨ ᛚ ᛚ  ᚹ ᚨ ᚺ",
        "x": 20,
        "y": 83,
        "width": 60,
        "fontSize": 22,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "blank",
    "name": "Documento em branco",
    "type": "Personalizado",
    "icon": "▯",
    "paper": "letter",
    "description": "Folha limpa para escrever do zero.",
    "layers": [],
    "backLayers": [],
    "secrets": []
  },
  {
    "id": "telegram",
    "name": "Telegrama urgente",
    "type": "Correspondência",
    "icon": "⚡",
    "paper": "telegram",
    "description": "Papel de comunicação telegráfica com texto monoespaçado.",
    "layers": [
      {
        "text": "SERVIÇO TELEGRÁFICO NACIONAL",
        "x": 10,
        "y": 10,
        "width": 80,
        "fontSize": 21,
        "style": "masthead",
        "kind": "normal"
      },
      {
        "text": "PRIORIDADE: URGENTE     REF. 0931",
        "x": 9,
        "y": 23,
        "width": 82,
        "fontSize": 15,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "DESTINO: DELEGACIA DE ARKHAM",
        "x": 9,
        "y": 38,
        "width": 81,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "PAREM INVESTIGAÇÃO IMEDIATAMENTE STOP NÃO ABRAM A CAIXA STOP AGUARDEM MINHAS ORDENS STOP",
        "x": 9,
        "y": 53,
        "width": 81,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "OPERADOR 17 · 04H22",
        "x": 9,
        "y": 84,
        "width": 75,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "REGISTRO DE TRANSMISSÃO",
        "x": 9,
        "y": 13,
        "width": 81,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Origem: Estação Norte\nHora: 04h22\nRepetições: 02",
        "x": 11,
        "y": 34,
        "width": 78,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "O REMETENTE ESTÁ MORTO",
        "x": 12,
        "y": 73,
        "width": 75,
        "fontSize": 19,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "diary",
    "name": "Diário pessoal",
    "type": "Correspondência",
    "icon": "✎",
    "paper": "diary",
    "description": "Página de diário com caligrafia e linhas de caderno.",
    "layers": [
      {
        "text": "Quinta-feira, 21 de outubro",
        "x": 11,
        "y": 11,
        "width": 80,
        "fontSize": 24,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Não consegui dormir outra vez. Os passos no corredor começam sempre à mesma hora. Esta noite encontrei terra molhada sobre a mesa.",
        "x": 11,
        "y": 29,
        "width": 78,
        "fontSize": 21,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Se alguém ler isto, procure a fotografia atrás do armário.",
        "x": 11,
        "y": 66,
        "width": 78,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "22 de outubro",
        "x": 12,
        "y": 11,
        "width": 75,
        "fontSize": 24,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "A porta estava trancada por dentro. Mesmo assim, encontrei pegadas...",
        "x": 12,
        "y": 33,
        "width": 76,
        "fontSize": 22,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "03:17 — NÃO OLHE PARA TRÁS",
        "x": 14,
        "y": 86,
        "width": 76,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "postcard",
    "name": "Cartão-postal",
    "type": "Correspondência",
    "icon": "✈",
    "paper": "postcard",
    "description": "Cartão enviado de uma cidade distante.",
    "layers": [
      {
        "text": "SAUDAÇÕES DE INNSMOUTH",
        "x": 10,
        "y": 11,
        "width": 80,
        "fontSize": 25,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "Marés, neblina e velhas histórias do litoral.",
        "x": 12,
        "y": 30,
        "width": 76,
        "fontSize": 16,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "✦  ✦  ✦",
        "x": 28,
        "y": 55,
        "width": 44,
        "fontSize": 27,
        "style": "symbol",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "Para: Elias Ward\nRua do Farol, nº 12\nArkham",
        "x": 12,
        "y": 18,
        "width": 54,
        "fontSize": 18,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Não venha sozinho. O porto não é seguro.",
        "x": 12,
        "y": 63,
        "width": 76,
        "fontSize": 18,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ENCONTRE-ME NO CAIS À MEIA-NOITE",
        "x": 12,
        "y": 82,
        "width": 77,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "missing",
    "name": "Cartaz de desaparecido",
    "type": "Investigação",
    "icon": "☷",
    "paper": "poster",
    "description": "Cartaz de pessoa desaparecida para murais de investigação.",
    "layers": [
      {
        "text": "DESAPARECIDO",
        "x": 8,
        "y": 9,
        "width": 84,
        "fontSize": 36,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "ÚLTIMA VEZ VISTO: 12/10/1928",
        "x": 9,
        "y": 24,
        "width": 82,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "NOME: EDWARD BLACKWOOD",
        "x": 11,
        "y": 70,
        "width": 78,
        "fontSize": 19,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Idade: 43 anos\nAltura: 1,78 m\nTraje: sobretudo cinza",
        "x": 11,
        "y": 79,
        "width": 78,
        "fontSize": 15,
        "style": "label",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "INFORMAÇÕES",
        "x": 10,
        "y": 14,
        "width": 80,
        "fontSize": 27,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Qualquer informação deve ser entregue ao posto policial. Não tente abordar a pessoa desaparecida.",
        "x": 11,
        "y": 37,
        "width": 77,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ENCONTRE-O NO VELHO TÚNEL",
        "x": 13,
        "y": 88,
        "width": 75,
        "fontSize": 14,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "wanted",
    "name": "Cartaz de procurado",
    "type": "Investigação",
    "icon": "⚖",
    "paper": "poster",
    "description": "Aviso oficial de busca com descrição de suspeito.",
    "layers": [
      {
        "text": "PROCURA-SE",
        "x": 8,
        "y": 9,
        "width": 84,
        "fontSize": 38,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "RECOMPENSA: 500 DÓLARES",
        "x": 8,
        "y": 25,
        "width": 85,
        "fontSize": 24,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "SUSPEITO: HOMEM NÃO IDENTIFICADO",
        "x": 11,
        "y": 69,
        "width": 79,
        "fontSize": 18,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Visto nas proximidades da ferrovia. Não aproxime-se sem reforços.",
        "x": 11,
        "y": 79,
        "width": 78,
        "fontSize": 15,
        "style": "body",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "AVISO À POPULAÇÃO",
        "x": 12,
        "y": 15,
        "width": 76,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Relatos e pistas devem ser enviados ao escritório do xerife.",
        "x": 12,
        "y": 36,
        "width": 76,
        "fontSize": 20,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "A RECOMPENSA É UMA ARMADILHA",
        "x": 11,
        "y": 87,
        "width": 79,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "medical",
    "name": "Ficha médica",
    "type": "Medicina",
    "icon": "✚",
    "paper": "medical",
    "description": "Registro clínico com campos de exame e observação.",
    "layers": [
      {
        "text": "HOSPITAL SAINT MARY",
        "x": 9,
        "y": 10,
        "width": 82,
        "fontSize": 26,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "REGISTRO DO PACIENTE • 00691",
        "x": 9,
        "y": 24,
        "width": 82,
        "fontSize": 15,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Nome: Thomas Vale\nData da admissão: 16/10/1928\nIdade: 31 anos",
        "x": 10,
        "y": 37,
        "width": 79,
        "fontSize": 18,
        "style": "label",
        "kind": "normal"
      },
      {
        "text": "Observações: Paciente apresenta desorientação severa e repete frases em idioma desconhecido.",
        "x": 10,
        "y": 67,
        "width": 80,
        "fontSize": 17,
        "style": "body",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ANOTAÇÃO DO MÉDICO",
        "x": 10,
        "y": 13,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Às 03h17 o paciente começou a desenhar o mesmo símbolo em todos os exames.",
        "x": 11,
        "y": 35,
        "width": 78,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "NÃO REALIZAR ALTA",
        "x": 11,
        "y": 83,
        "width": 77,
        "fontSize": 20,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "autopsy",
    "name": "Laudo de autópsia",
    "type": "Medicina",
    "icon": "✚",
    "paper": "medical",
    "description": "Modelo de laudo pericial com achados e conclusão.",
    "layers": [
      {
        "text": "INSTITUTO MÉDICO LEGAL",
        "x": 10,
        "y": 10,
        "width": 81,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "LAUDO Nº 318 - ARKHAM",
        "x": 10,
        "y": 24,
        "width": 81,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Identificação: Desconhecida\nData do exame: 19/10/1928",
        "x": 10,
        "y": 39,
        "width": 79,
        "fontSize": 17,
        "style": "label",
        "kind": "normal"
      },
      {
        "text": "Achados: ausência de lesões externas; temperatura corporal incompatível com o horário informado.",
        "x": 10,
        "y": 61,
        "width": 79,
        "fontSize": 17,
        "style": "body",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CONCLUSÃO PRELIMINAR",
        "x": 10,
        "y": 13,
        "width": 82,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "A causa da morte permanece indeterminada. Solicitar nova análise de tecidos.",
        "x": 11,
        "y": 33,
        "width": 76,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "NÃO É UM CORPO HUMANO",
        "x": 14,
        "y": 82,
        "width": 72,
        "fontSize": 19,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "lab",
    "name": "Análise da Amostra 77-B",
    "type": "Pesquisa",
    "icon": "⚗",
    "paper": "research",
    "description": "Ficha de análise química com valores experimentais.",
    "layers": [
      {
        "text": "AMOSTRA 77-B",
        "x": 17,
        "y": 18,
        "width": 39,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Registro: 18/10/1928",
        "x": 48,
        "y": 20,
        "width": 43,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Material desconhecido\nOrigem: escavação norte",
        "x": 40,
        "y": 52,
        "width": 36,
        "fontSize": 13,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Luminescência incomum após exposição a baixas temperaturas.",
        "x": 11,
        "y": 73,
        "width": 55,
        "fontSize": 14,
        "style": "body",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "OBSERVAÇÕES DO PESQUISADOR",
        "x": 10,
        "y": 14,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "O material reage a baixas temperaturas com luminosidade azulada.",
        "x": 11,
        "y": 34,
        "width": 79,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "MANTER LONGE DA LUZ SOLAR",
        "x": 11,
        "y": 85,
        "width": 81,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "certificate",
    "name": "Certidão antiga",
    "type": "Documentos pessoais",
    "icon": "✥",
    "paper": "certificate",
    "description": "Certidão solene com selo e assinatura.",
    "layers": [
      {
        "text": "CARTÓRIO DE ARKHAM",
        "x": 9,
        "y": 10,
        "width": 82,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "CERTIDÃO DE NASCIMENTO",
        "x": 11,
        "y": 27,
        "width": 78,
        "fontSize": 27,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "Certifico que, aos sete dias do mês de abril de mil oitocentos e noventa e oito, nasceu nesta cidade Eleanor Ward.",
        "x": 11,
        "y": 46,
        "width": 78,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      },
      {
        "text": "Registrador: Henry Collins",
        "x": 11,
        "y": 81,
        "width": 78,
        "fontSize": 18,
        "style": "signature",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "AVERBAÇÃO",
        "x": 11,
        "y": 14,
        "width": 78,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Registro retificado em 16 de março de 1924 por ordem judicial.",
        "x": 12,
        "y": 40,
        "width": 77,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "A DATA FOI ALTERADA",
        "x": 13,
        "y": 88,
        "width": 73,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "passport",
    "name": "Passaporte",
    "type": "Documentos pessoais",
    "icon": "✦",
    "paper": "passport",
    "description": "Identificação de viagem com carimbos e validade.",
    "layers": [
      {
        "text": "PASSPORT • UNITED STATES",
        "x": 8,
        "y": 10,
        "width": 84,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "◈   ID 00841-93   ◈",
        "x": 13,
        "y": 25,
        "width": 75,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "NOME: CLARA WHITMORE\nORIGEM: BOSTON\nEMISSÃO: 04 MAI 1926",
        "x": 10,
        "y": 52,
        "width": 80,
        "fontSize": 19,
        "style": "label",
        "kind": "normal"
      },
      {
        "text": "DOCUMENTO OFICIAL",
        "x": 11,
        "y": 85,
        "width": 78,
        "fontSize": 14,
        "style": "smallcaps",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CARIMBOS DE ENTRADA",
        "x": 10,
        "y": 13,
        "width": 82,
        "fontSize": 21,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "INNSMOUTH  ·  OUT 1928\nARKHAM  ·  OUT 1928",
        "x": 11,
        "y": 38,
        "width": 79,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "PASSAGEIRA NÃO REGISTRADA",
        "x": 13,
        "y": 85,
        "width": 77,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "library",
    "name": "Ficha de biblioteca",
    "type": "Administração",
    "icon": "▦",
    "paper": "library",
    "description": "Cartão de empréstimo com data e nome do leitor.",
    "layers": [
      {
        "text": "BIBLIOTECA UNIVERSITÁRIA",
        "x": 9,
        "y": 10,
        "width": 83,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "FICHA DE EMPRÉSTIMO",
        "x": 10,
        "y": 25,
        "width": 79,
        "fontSize": 25,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "Livro: Compêndio das Marés\nAutor: Desconhecido\nTombo: 006-17",
        "x": 10,
        "y": 47,
        "width": 81,
        "fontSize": 19,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Devolver até 31/10/1928",
        "x": 10,
        "y": 81,
        "width": 78,
        "fontSize": 17,
        "style": "label",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "HISTÓRICO DE EMPRÉSTIMOS",
        "x": 9,
        "y": 14,
        "width": 82,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "E. Ward          03/06/1928\nC. Whitmore      17/08/1928\nE. Blackwood     12/10/1928",
        "x": 11,
        "y": 37,
        "width": 78,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "PROCURE O LIVRO SEM CAPA",
        "x": 12,
        "y": 86,
        "width": 76,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "ticket",
    "name": "Bilhete de trem",
    "type": "Transporte",
    "icon": "➟",
    "paper": "ticket",
    "description": "Bilhete com estação, número de vagão e embarque.",
    "layers": [
      {
        "text": "ARKHAM RAILWAYS",
        "x": 8,
        "y": 10,
        "width": 84,
        "fontSize": 27,
        "style": "masthead",
        "kind": "normal"
      },
      {
        "text": "BILHETE DE PASSAGEM Nº 009281",
        "x": 8,
        "y": 28,
        "width": 84,
        "fontSize": 15,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "ORIGEM: ARKHAM\nDESTINO: INNSMOUTH",
        "x": 10,
        "y": 45,
        "width": 80,
        "fontSize": 21,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "PARTIDA 23:45  ·  VAGÃO 07",
        "x": 9,
        "y": 74,
        "width": 82,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CONDIÇÕES DA PASSAGEM",
        "x": 10,
        "y": 14,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Apresente este bilhete ao condutor antes do embarque.",
        "x": 10,
        "y": 38,
        "width": 80,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "PLATAFORMA SECRETA: 13",
        "x": 14,
        "y": 87,
        "width": 76,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "boarding",
    "name": "Cartão de embarque",
    "type": "Transporte",
    "icon": "⚓",
    "paper": "ticket",
    "description": "Passagem de navio com destino e cabine.",
    "layers": [
      {
        "text": "COMPANHIA MARÍTIMA NORTH ATLANTIC",
        "x": 8,
        "y": 10,
        "width": 84,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "CARTÃO DE EMBARQUE",
        "x": 9,
        "y": 27,
        "width": 82,
        "fontSize": 27,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "NOME: E. BLACKWOOD\nDESTINO: PORTO NORTE\nCABINE: C-13",
        "x": 10,
        "y": 48,
        "width": 80,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "PARTIDA: 22 DE OUTUBRO",
        "x": 10,
        "y": 81,
        "width": 80,
        "fontSize": 17,
        "style": "label",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "BAGAGEM DECLARADA",
        "x": 9,
        "y": 15,
        "width": 82,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "1 mala de couro\n1 caixa de madeira lacrada\nPeso total: 18 kg",
        "x": 11,
        "y": 35,
        "width": 79,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "CABINE C-13 NÃO EXISTE",
        "x": 15,
        "y": 88,
        "width": 72,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "ship",
    "name": "Diário de bordo",
    "type": "Transporte",
    "icon": "⚓",
    "paper": "diary",
    "description": "Registro de viagem marítima e eventos estranhos.",
    "layers": [
      {
        "text": "DIÁRIO DE BORDO - NAVIO ÉREBUS",
        "x": 10,
        "y": 12,
        "width": 80,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "22 OUT 1928 • MAR CALMO",
        "x": 10,
        "y": 29,
        "width": 80,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Às 02h10, o vigia relatou luzes na superfície. Nenhuma embarcação foi encontrada no horizonte.",
        "x": 11,
        "y": 46,
        "width": 78,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Capitão J. Ashford",
        "x": 11,
        "y": 81,
        "width": 77,
        "fontSize": 18,
        "style": "signature",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "REGISTRO DO CAPITÃO",
        "x": 10,
        "y": 14,
        "width": 80,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Todos os relógios pararam às 03h17. A bússola aponta para o sul desde então.",
        "x": 11,
        "y": 38,
        "width": 76,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "NÃO ATRACAR NO FAROL",
        "x": 13,
        "y": 85,
        "width": 74,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "invoice",
    "name": "Fatura comercial",
    "type": "Financeiro",
    "icon": "＄",
    "paper": "invoice",
    "description": "Fatura com itens, valores e campo de pagamento.",
    "layers": [
      {
        "text": "BLACKWOOD & FILHOS",
        "x": 10,
        "y": 9,
        "width": 80,
        "fontSize": 27,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "FATURA Nº 0068 · 18/10/1928",
        "x": 9,
        "y": 27,
        "width": 83,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "1 CAIXA LACRADA    $ 18,00\n2 LANTERNAS        $  6,50\n1 MAPA COSTEIRO    $  2,00",
        "x": 10,
        "y": 43,
        "width": 82,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "TOTAL: $ 26,50",
        "x": 12,
        "y": 74,
        "width": 75,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "DADOS DA ENTREGA",
        "x": 10,
        "y": 13,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Entregar no depósito do porto, portão lateral. Não solicitar assinatura.",
        "x": 11,
        "y": 38,
        "width": 76,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ITENS NÃO DECLARADOS",
        "x": 13,
        "y": 89,
        "width": 74,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "receipt",
    "name": "Recibo de compra",
    "type": "Financeiro",
    "icon": "＄",
    "paper": "receipt",
    "description": "Comprovante estreito de uma transação suspeita.",
    "layers": [
      {
        "text": "LOJA DE ANTIGUIDADES",
        "x": 12,
        "y": 9,
        "width": 78,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "ARQUIVO Nº 191",
        "x": 12,
        "y": 22,
        "width": 76,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "RELÓGIO DE BOLSO  $ 4,50\nCHAVE ENFERRUJADA $ 1,75\nCAIXA DE FÓSFOROS $ 0,20",
        "x": 12,
        "y": 43,
        "width": 76,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "PAGO: $ 6,45",
        "x": 14,
        "y": 77,
        "width": 73,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "REGISTRO DO CAIXA",
        "x": 12,
        "y": 15,
        "width": 75,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Cliente recusou-se a informar nome.",
        "x": 12,
        "y": 39,
        "width": 76,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "GUARDAR A CHAVE",
        "x": 18,
        "y": 89,
        "width": 64,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "envelope",
    "name": "Envelope lacrado",
    "type": "Correspondência",
    "icon": "✉",
    "paper": "envelope",
    "description": "Endereçamento e selo de correspondência.",
    "layers": [
      {
        "text": "CONFIDENCIAL",
        "x": 15,
        "y": 12,
        "width": 70,
        "fontSize": 23,
        "style": "stamp",
        "kind": "normal"
      },
      {
        "text": "A/C: DIRETOR DO MUSEU",
        "x": 13,
        "y": 38,
        "width": 75,
        "fontSize": 22,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Rua University, 17\nArkham, Massachusetts",
        "x": 14,
        "y": 53,
        "width": 74,
        "fontSize": 18,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "✉",
        "x": 38,
        "y": 77,
        "width": 23,
        "fontSize": 31,
        "style": "symbol",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "LACRE VIOLADO EM 24/10/1928",
        "x": 12,
        "y": 17,
        "width": 76,
        "fontSize": 18,
        "style": "stamp",
        "kind": "normal"
      },
      {
        "text": "A abertura deste envelope não foi autorizada.",
        "x": 14,
        "y": 43,
        "width": 72,
        "fontSize": 18,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "LEIA A CARTA AO CONTRÁRIO",
        "x": 14,
        "y": 87,
        "width": 75,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "photo",
    "name": "Fotografia de Arquivo",
    "type": "Fotografia",
    "icon": "▧",
    "paper": "photo",
    "description": "Montagem de fotografia com legenda manuscrita.",
    "layers": [
      {
        "text": "Mansão Blackwood, fachada norte",
        "x": 13,
        "y": 87,
        "width": 76,
        "fontSize": 17,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "Anotação no verso: a terceira janela não existia antes.",
        "x": 13,
        "y": 28,
        "width": 74,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "OUTUBRO DE 1928",
        "x": 20,
        "y": 77,
        "width": 60,
        "fontSize": 18,
        "style": "stamp",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "HÁ ALGUÉM NA JANELA",
        "x": 15,
        "y": 66,
        "width": 72,
        "fontSize": 19,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "map",
    "name": "Mapa de investigação",
    "type": "Mapas",
    "icon": "⌖",
    "paper": "map",
    "description": "Mapa esquemático com coordenadas e indicações.",
    "layers": [
      {
        "text": "MAPA DOS ARREDORES DE ARKHAM",
        "x": 8,
        "y": 9,
        "width": 84,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "N ↑",
        "x": 43,
        "y": 22,
        "width": 20,
        "fontSize": 25,
        "style": "symbol",
        "kind": "normal"
      },
      {
        "text": "◯ ───── △ ───── ◯",
        "x": 14,
        "y": 43,
        "width": 75,
        "fontSize": 23,
        "style": "symbol",
        "kind": "normal"
      },
      {
        "text": "MANSÃO       FAROL       CAIS",
        "x": 12,
        "y": 61,
        "width": 78,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "ESCALA 1:25000",
        "x": 10,
        "y": 84,
        "width": 76,
        "fontSize": 14,
        "style": "smallcaps",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "LEGENDA",
        "x": 11,
        "y": 12,
        "width": 78,
        "fontSize": 24,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "◯ Construção\n△ Entrada oculta\n── Caminho conhecido",
        "x": 13,
        "y": 31,
        "width": 72,
        "fontSize": 20,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "X: 13°47′ Y: 45°20′",
        "x": 18,
        "y": 79,
        "width": 65,
        "fontSize": 18,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "blueprint",
    "name": "Planta do Farol",
    "type": "Mapas",
    "icon": "▥",
    "paper": "blueprint",
    "description": "Esboço técnico de uma construção com cômodos.",
    "layers": [
      {
        "text": "OBSERVAÇÕES / FAROL",
        "x": 6,
        "y": 11,
        "width": 26,
        "fontSize": 13,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Escada interior alterada. Verificar o piso de baixo.",
        "x": 6,
        "y": 17,
        "width": 24,
        "fontSize": 13,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Marca vermelha: possível entrada desconhecida.",
        "x": 5,
        "y": 89,
        "width": 38,
        "fontSize": 13,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "PLANTA 1:100",
        "x": 51,
        "y": 92,
        "width": 42,
        "fontSize": 13,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ANOTAÇÕES DO ENGENHEIRO",
        "x": 9,
        "y": 14,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "O muro leste tem espessura maior que o previsto. Verificar compartimento oculto.",
        "x": 11,
        "y": 38,
        "width": 78,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "A PORTA ESTÁ ATRÁS DA PAREDE",
        "x": 10,
        "y": 86,
        "width": 83,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "research",
    "name": "Caderno do Pesquisador",
    "type": "Pesquisa",
    "icon": "⌕",
    "paper": "research",
    "description": "Caderno de estudos com hipóteses e resultados.",
    "layers": [
      {
        "text": "AMOSTRA R-027",
        "x": 17,
        "y": 19,
        "width": 42,
        "fontSize": 15,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Diário do pesquisador",
        "x": 46,
        "y": 20,
        "width": 44,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "A amostra reage à ausência de luz. Foram registradas alterações impossíveis de classificar.",
        "x": 11,
        "y": 72,
        "width": 55,
        "fontSize": 13,
        "style": "body",
        "kind": "normal"
      },
      {
        "text": "Observação nº 17",
        "x": 12,
        "y": 88,
        "width": 59,
        "fontSize": 13,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "NOTAS ADICIONAIS",
        "x": 10,
        "y": 13,
        "width": 80,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "A amostra emite um zumbido de baixa frequência sempre que o relógio marca 03h17.",
        "x": 11,
        "y": 37,
        "width": 76,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ELES CONSEGUEM OUVIR O SOM",
        "x": 12,
        "y": 87,
        "width": 78,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "dossier",
    "name": "Dossiê de Investigação • 27-B",
    "type": "Investigação",
    "icon": "▣",
    "paper": "dossier",
    "description": "Capa de arquivo reservado com marcações sigilosas.",
    "layers": [
      {
        "text": "INCIDENTE DO FAROL",
        "x": 27,
        "y": 21,
        "width": 65,
        "fontSize": 16,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "ARQUIVO 27-Β",
        "x": 25,
        "y": 25,
        "width": 59,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Registro de luzes no antigo farol. Testemunhas e horários não coincidem.",
        "x": 47,
        "y": 40,
        "width": 42,
        "fontSize": 14,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Anexo classificado: relatório em revisão.",
        "x": 11,
        "y": 75,
        "width": 75,
        "fontSize": 13,
        "style": "body",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ANEXO B • OBSERVAÇÕES",
        "x": 10,
        "y": 13,
        "width": 81,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Trechos do testemunho foram censurados por ordem da diretoria.",
        "x": 11,
        "y": 34,
        "width": 77,
        "fontSize": 18,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "O RELATÓRIO OFICIAL É FALSO",
        "x": 10,
        "y": 86,
        "width": 84,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ],
    "premiumArtwork": true
  },
  {
    "id": "classified",
    "name": "Classificados de jornal",
    "type": "Imprensa",
    "icon": "☷",
    "paper": "news",
    "description": "Página de anúncios com mensagens codificadas.",
    "layers": [
      {
        "text": "ARKHAM • CLASSIFICADOS",
        "x": 8,
        "y": 10,
        "width": 84,
        "fontSize": 28,
        "style": "masthead",
        "kind": "normal"
      },
      {
        "text": "PROCURA-SE: relógio de bolso com gravação lunar. Pagamento em dinheiro.",
        "x": 9,
        "y": 34,
        "width": 81,
        "fontSize": 18,
        "style": "news",
        "kind": "normal"
      },
      {
        "text": "ALUGA-SE: quarto com vista para o porto. Visitas somente à noite.",
        "x": 9,
        "y": 54,
        "width": 81,
        "fontSize": 18,
        "style": "news",
        "kind": "normal"
      },
      {
        "text": "AVISO: reunião às 23h no prédio dos correios.",
        "x": 9,
        "y": 75,
        "width": 81,
        "fontSize": 17,
        "style": "news",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ANÚNCIOS CONTINUADOS",
        "x": 10,
        "y": 13,
        "width": 81,
        "fontSize": 24,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "A sociedade de estudos noturnos convida novos integrantes.",
        "x": 12,
        "y": 38,
        "width": 76,
        "fontSize": 18,
        "style": "news",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "LEIA A PRIMEIRA LETRA DE CADA LINHA",
        "x": 9,
        "y": 89,
        "width": 85,
        "fontSize": 13,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "radio",
    "name": "Transcrição de rádio",
    "type": "Investigação",
    "icon": "◉",
    "paper": "telegram",
    "description": "Transcrição da comunicação de uma patrulha.",
    "layers": [
      {
        "text": "ESTAÇÃO DE RÁDIO K-17",
        "x": 8,
        "y": 11,
        "width": 84,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "TRANSCRIÇÃO · 23:18:04",
        "x": 9,
        "y": 25,
        "width": 80,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "[23:18] BASE: CONFIRME POSIÇÃO\n[23:19] VIGIA: PORTO NORTE\n[23:20] BASE: IDENTIFIQUE A LUZ\n[23:20] VIGIA: ELA SE MOVE...",
        "x": 9,
        "y": 42,
        "width": 83,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "REGISTRO INTERROMPIDO",
        "x": 10,
        "y": 12,
        "width": 80,
        "fontSize": 25,
        "style": "stamp",
        "kind": "normal"
      },
      {
        "text": "Fim da transmissão em 23:21. Equipamento encontrado abandonado.",
        "x": 11,
        "y": 38,
        "width": 80,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "O ÚLTIMO SINAL VEIO DO FAROL",
        "x": 11,
        "y": 86,
        "width": 81,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "death",
    "name": "Certidão de óbito",
    "type": "Documentos pessoais",
    "icon": "✥",
    "paper": "certificate",
    "description": "Registro formal de falecimento com averbação.",
    "layers": [
      {
        "text": "CARTÓRIO DO CONDADO",
        "x": 10,
        "y": 10,
        "width": 80,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "CERTIDÃO DE ÓBITO",
        "x": 11,
        "y": 26,
        "width": 79,
        "fontSize": 30,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "Nome: Arthur L. Ward\nData: 16 de outubro de 1928\nLocal: Arkham",
        "x": 12,
        "y": 49,
        "width": 75,
        "fontSize": 19,
        "style": "label",
        "kind": "normal"
      },
      {
        "text": "Assinatura do oficial",
        "x": 12,
        "y": 82,
        "width": 76,
        "fontSize": 18,
        "style": "signature",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "AVERBAÇÃO POSTERIOR",
        "x": 10,
        "y": 14,
        "width": 80,
        "fontSize": 23,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "A identidade do falecido não foi comprovada. O registro encontra-se sob revisão.",
        "x": 12,
        "y": 37,
        "width": 77,
        "fontSize": 19,
        "style": "body",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "REGISTRO DE PESSOA VIVA",
        "x": 14,
        "y": 86,
        "width": 74,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "evidence",
    "name": "Etiqueta de evidência",
    "type": "Investigação",
    "icon": "▧",
    "paper": "evidence",
    "description": "Etiqueta de material recolhido com número de cadeia de custódia.",
    "layers": [
      {
        "text": "DEPARTAMENTO DE EVIDÊNCIAS",
        "x": 9,
        "y": 10,
        "width": 82,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "ITEM Nº 037-A",
        "x": 10,
        "y": 29,
        "width": 81,
        "fontSize": 30,
        "style": "stamp",
        "kind": "normal"
      },
      {
        "text": "RECOLHIDO: 21/10/1928\nLOCAL: PORÃO / CASA BLACKWOOD",
        "x": 10,
        "y": 52,
        "width": 80,
        "fontSize": 17,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "DESCRIÇÃO: CHAVE DE METAL OXIDADO",
        "x": 10,
        "y": 77,
        "width": 81,
        "fontSize": 16,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CUSTÓDIA",
        "x": 10,
        "y": 13,
        "width": 80,
        "fontSize": 25,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "Entregue por: Inspetor Moretti\nRecebido por: Laboratório Central",
        "x": 10,
        "y": 36,
        "width": 80,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "NÃO DEVOLVER AO PROPRIETÁRIO",
        "x": 11,
        "y": 88,
        "width": 80,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "menu",
    "name": "Cardápio de café",
    "type": "Administração",
    "icon": "☕",
    "paper": "menu",
    "description": "Cardápio de estabelecimento com um recado escondido.",
    "layers": [
      {
        "text": "CAFÉ DO FAROL",
        "x": 13,
        "y": 10,
        "width": 74,
        "fontSize": 31,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "DESDE 1892",
        "x": 30,
        "y": 23,
        "width": 43,
        "fontSize": 15,
        "style": "smallcaps",
        "kind": "normal"
      },
      {
        "text": "CAFÉ PRETO             10¢\nCHÁ DE ERVAS           15¢\nPÃO DE MEL             12¢\nSOPA DO DIA            25¢",
        "x": 13,
        "y": 41,
        "width": 76,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "Aberto até a meia-noite",
        "x": 17,
        "y": 82,
        "width": 69,
        "fontSize": 17,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "RECADO DO GERENTE",
        "x": 13,
        "y": 18,
        "width": 73,
        "fontSize": 24,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Seu pedido está reservado na mesa dos fundos.",
        "x": 13,
        "y": 40,
        "width": 73,
        "fontSize": 19,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "PERGUNTE PELA MESA 7",
        "x": 16,
        "y": 87,
        "width": 68,
        "fontSize": 17,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "invitation",
    "name": "Convite elegante",
    "type": "Correspondência",
    "icon": "✧",
    "paper": "invitation",
    "description": "Convite com ornamentos e horário de um evento.",
    "layers": [
      {
        "text": "VOCÊ ESTÁ CONVIDADO",
        "x": 13,
        "y": 13,
        "width": 74,
        "fontSize": 24,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "✦  BAILE DE OUTONO  ✦",
        "x": 12,
        "y": 33,
        "width": 78,
        "fontSize": 25,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Residência Whitmore\nSábado, 23 de outubro\nÀs vinte e três horas",
        "x": 14,
        "y": 51,
        "width": 73,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      },
      {
        "text": "Traje de gala obrigatório",
        "x": 14,
        "y": 84,
        "width": 74,
        "fontSize": 17,
        "style": "smallcaps",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CONVITE PESSOAL E INTRANSFERÍVEL",
        "x": 10,
        "y": 16,
        "width": 82,
        "fontSize": 20,
        "style": "stamp",
        "kind": "normal"
      },
      {
        "text": "Apresente este cartão à entrada leste.",
        "x": 13,
        "y": 38,
        "width": 74,
        "fontSize": 20,
        "style": "script",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "ENTRE PELO JARDIM ÀS 23:17",
        "x": 14,
        "y": 88,
        "width": 74,
        "fontSize": 15,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "cryptogram",
    "name": "Mensagem cifrada",
    "type": "Ocultismo",
    "icon": "⌘",
    "paper": "coded",
    "description": "Mensagem com símbolos e espaços para decifração.",
    "layers": [
      {
        "text": "MENSAGEM INTERCEPTADA",
        "x": 10,
        "y": 12,
        "width": 81,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "⟁ ☽ ⊕ ⟁ ◈  ✧ ∴ ☉ ✶",
        "x": 12,
        "y": 32,
        "width": 78,
        "fontSize": 27,
        "style": "symbol",
        "kind": "normal"
      },
      {
        "text": "XQK - 0317 - XQK\n17 / 04 / 23 / 11",
        "x": 13,
        "y": 52,
        "width": 72,
        "fontSize": 20,
        "style": "mono",
        "kind": "normal"
      },
      {
        "text": "A chave não está no alfabeto.",
        "x": 11,
        "y": 80,
        "width": 79,
        "fontSize": 17,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "ALFABETO DE REFERÊNCIA",
        "x": 9,
        "y": 14,
        "width": 80,
        "fontSize": 22,
        "style": "heading",
        "kind": "normal"
      },
      {
        "text": "A=✧ B=◈ C=⊕ D=☽ E=⟁",
        "x": 11,
        "y": 40,
        "width": 80,
        "fontSize": 18,
        "style": "mono",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "O QUARTO SÍMBOLO É O PRIMEIRO",
        "x": 10,
        "y": 87,
        "width": 83,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  },
  {
    "id": "obituary",
    "name": "Nota de falecimento",
    "type": "Imprensa",
    "icon": "✥",
    "paper": "news",
    "description": "Pequena notícia emoldurada em jornal.",
    "layers": [
      {
        "text": "NOTAS DA CIDADE",
        "x": 9,
        "y": 12,
        "width": 82,
        "fontSize": 26,
        "style": "masthead",
        "kind": "normal"
      },
      {
        "text": "IN MEMORIAM",
        "x": 15,
        "y": 31,
        "width": 70,
        "fontSize": 28,
        "style": "display",
        "kind": "normal"
      },
      {
        "text": "A família Ward comunica o falecimento de Arthur Lionel Ward, ocorrido na última quinta-feira.",
        "x": 11,
        "y": 52,
        "width": 78,
        "fontSize": 18,
        "style": "news",
        "kind": "normal"
      },
      {
        "text": "Cerimônia reservada.",
        "x": 12,
        "y": 82,
        "width": 76,
        "fontSize": 16,
        "style": "script",
        "kind": "normal"
      }
    ],
    "backLayers": [
      {
        "text": "CORREÇÃO DO EDITOR",
        "x": 12,
        "y": 16,
        "width": 76,
        "fontSize": 24,
        "style": "headline",
        "kind": "normal"
      },
      {
        "text": "O anúncio foi publicado antes do registro oficial da morte.",
        "x": 12,
        "y": 43,
        "width": 77,
        "fontSize": 19,
        "style": "news",
        "kind": "normal"
      }
    ],
    "secrets": [
      {
        "text": "O ENTERRO NÃO ACONTECEU",
        "x": 12,
        "y": 87,
        "width": 78,
        "fontSize": 16,
        "style": "secret",
        "kind": "uv"
      }
    ]
  }
];

/** Cria cópias independentes para edição; o modelo em branco começa completamente vazio. */
export const templates = [...baseTemplates, ...craftedTemplates];

export function newPages(template) {
  const duplicate = (layers,side) => layers.map((layer,index)=>({...layer,id:`${template.id}-${side}-${index}-${Math.random().toString(36).slice(2,10)}`}));
  return {front:duplicate([...(template.layers||[]),...(template.secrets||[])],'front'),back:duplicate(template.backLayers||[],'back')};
}

export const templateCategories = ['Todos',...new Set(templates.map(template=>template.type))];
