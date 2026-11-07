import React from 'react';

/**
 * Artefatos físicos do ParaDocx.
 * Diferente das folhas avulsas de HandoutArt, aqui cada modelo é um objeto
 * desenhado em vetor: caderno, terminal, garrafa, polaroid, cassete, microficha,
 * carta de tarot e crachá. Tudo em código, sem imagens externas.
 */

export const craftedTemplateIds = {
  notebook: 'Notebook',
  computer: 'Computer',
  bottle: 'Bottle',
  polaroid: 'Polaroid',
  cassette: 'Cassette',
  microfiche: 'Microfiche',
  tarot: 'Tarot',
  badge: 'Badge'
};

const Wrap = ({children, side}) => (
  <g transform={side === 'back' ? 'rotate(180 400 566)' : undefined}>{children}</g>
);

function Notebook({side}) {
  const cover = (
    <g>
      <rect x="86" y="70" width="628" height="985" rx="16" fill="#40261a" opacity=".45"/>
      <rect x="96" y="60" width="628" height="985" rx="16" fill="#5d3b2a"/>
      <rect x="96" y="60" width="86" height="985" fill="#40261a" opacity=".55"/>
      <rect x="96" y="60" width="628" height="985" rx="16" fill="none" stroke="#2a180f" strokeWidth="4"/>
      {Array.from({length: 12}, (_, i) => (
        <g key={i}>
          <circle cx="139" cy={140 + i * 72} r="17" fill="none" stroke="#cbb489" strokeWidth="5"/>
          <circle cx="139" cy={140 + i * 72} r="7" fill="#efe6cd" opacity=".8"/>
          <path d={'M156 ' + (140 + i * 72) + ' H206'} stroke="#2a180f" strokeWidth="3" opacity=".45"/>
        </g>
      ))}
      <rect x="236" y="286" width="418" height="238" rx="8" fill="#cbb489" opacity=".22" stroke="#e2cfa6" strokeWidth="3"/>
      <path d="M262 470 H628 M262 494 H560" stroke="#e2cfa6" strokeWidth="3" opacity=".45"/>
      <rect x="600" y="905" width="98" height="44" rx="4" fill="#2a180f" opacity=".35"/>
    </g>
  );
  const pages = (
    <g>
      <rect x="96" y="60" width="628" height="985" rx="16" fill="#efe7d2" stroke="#c3b291" strokeWidth="4"/>
      <rect x="96" y="60" width="86" height="985" fill="#e0d5ba"/>
      <g stroke="#9fb0c9" strokeWidth="1.4" opacity=".55">
        {Array.from({length: 26}, (_, i) => <line key={i} x1="120" y1={92 + i * 36} x2="700" y2={92 + i * 36}/>)}
        {Array.from({length: 15}, (_, i) => <line key={i} x1={210 + i * 34} y1="60" x2={210 + i * 34} y2="1045"/>)}
      </g>
      <path d="M188 60 V1045" stroke="#a8573d" strokeWidth="2" opacity=".45"/>
      <rect x="560" y="70" width="140" height="60" rx="4" fill="#d8c9a6" opacity=".5"/>
    </g>
  );
  return <Wrap side={side}>{side === 'back' ? pages : cover}</Wrap>;
}

function Computer() {
  return (
    <g>
      <rect x="86" y="150" width="628" height="740" rx="28" fill="#241f1c" stroke="#100c0a" strokeWidth="6"/>
      <rect x="126" y="192" width="548" height="560" rx="18" fill="#0b1a11"/>
      <rect x="126" y="192" width="548" height="560" rx="18" fill="none" stroke="#3d6b4f" strokeWidth="3" opacity=".7"/>
      <g fill="#7dfab0" opacity=".85">
        {Array.from({length: 13}, (_, i) => (
          <rect key={i} x={162 + (i % 3 === 0 ? 0 : 24)} y={232 + i * 38}
            width={i % 5 === 4 ? 210 : 320 - (i % 3) * 60} height="13" rx="3" opacity={.45 + (i % 4) * .13}/>
        ))}
      </g>
      <g fill="#5e6a63">
        <rect x="150" y="782" width="120" height="26" rx="4"/>
        <rect x="290" y="782" width="86" height="26" rx="4"/>
        <circle cx="628" cy="795" r="16" fill="#7a2f24"/>
      </g>
      <rect x="352" y="890" width="96" height="70" fill="#2c2622"/>
      <rect x="250" y="952" width="300" height="42" rx="10" fill="#241f1c" stroke="#100c0a" strokeWidth="4"/>
    </g>
  );
}

function Bottle() {
  return (
    <g>
      <path d="M352 120 h96 v120 q0 40 34 78 q70 80 70 190 v430 q0 70 -60 70 h-184 q-60 0 -60 -70 v-430 q0 -110 70 -190 q34 -38 34 -78 z"
        fill="#20301f" stroke="#121b12" strokeWidth="6"/>
      <path d="M362 130 h76 v96 h-76 z" fill="#7c1f26"/>
      <path d="M370 142 h60 v10 h-60 z M370 174 h60 v8 h-60 z" fill="#e6d3a8" opacity=".8"/>
      <rect x="228" y="452" width="344" height="392" rx="6" fill="#efe3c4" stroke="#c6b189" strokeWidth="3"/>
      <rect x="252" y="486" width="296" height="324" fill="none" stroke="#7c1f26" strokeWidth="3" opacity=".75"/>
      <path d="M400 520 C356 570 380 610 400 640 C424 610 444 570 400 520 Z" fill="#7c1f26" opacity=".8"/>
      <g stroke="#8d7a55" strokeWidth="3" opacity=".6">
        <path d="M280 700 H520 M280 726 H470 M280 752 H500"/>
      </g>
      <path d="M262 520 q40 90 10 190" stroke="#ffffff" strokeWidth="10" opacity=".1" fill="none"/>
    </g>
  );
}

function Polaroid() {
  return (
    <g>
      <defs>
        <linearGradient id="pdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa39c" stopOpacity=".55"/>
          <stop offset="1" stopColor="#101613" stopOpacity=".9"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-2 400 495)">
        <rect x="132" y="150" width="536" height="690" fill="#f4efe2" stroke="#cfc4ab" strokeWidth="4"/>
        <rect x="168" y="186" width="464" height="530" fill="url(#pdSky)"/>
        <path d="M168 560 L280 400 L360 520 L440 430 L632 620 V716 H168 Z" fill="#1d241f" opacity=".9"/>
        <circle cx="520" cy="268" r="46" fill="#e8e2c4" opacity=".75"/>
        <path d="M168 640 q120 -50 240 -10 q120 40 224 -6 v92 H168 Z" fill="#0f1411" opacity=".8"/>
        <path d="M200 762 H520" stroke="#5c5344" strokeWidth="6" opacity=".8" strokeLinecap="round"/>
        <path d="M200 794 H440" stroke="#5c5344" strokeWidth="5" opacity=".6" strokeLinecap="round"/>
      </g>
    </g>
  );
}

function Cassette() {
  const spool = (cx) => (
    <g>
      <circle cx={cx} cy="672" r="86" fill="#1a1715" stroke="#4a4239" strokeWidth="5"/>
      <circle cx={cx} cy="672" r="26" fill="#0d0b0a"/>
      {Array.from({length: 6}, (_, i) => (
        <rect key={i} x={cx + Math.cos(i * 1.047) * 66 - 9} y={672 + Math.sin(i * 1.047) * 66 - 9}
          width="18" height="18" fill="#3b342d" transform={'rotate(' + (i * 60) + ' ' + cx + ' 672)'}/>
      ))}
    </g>
  );
  return (
    <g>
      <rect x="86" y="316" width="628" height="500" rx="18" fill="#2b2724" stroke="#15120f" strokeWidth="6"/>
      <rect x="120" y="352" width="560" height="160" rx="6" fill="#e8dcbc"/>
      <g stroke="#9a8a67" strokeWidth="3" opacity=".7">
        <path d="M150 400 H650 M150 442 H650 M150 486 H650"/>
      </g>
      {spool(286)}
      {spool(514)}
      <g fill="#7a7268">
        <rect x="330" y="800" width="140" height="16" rx="8"/>
      </g>
      <path d="M120 300 h560" stroke="#3a342e" strokeWidth="8" opacity=".6"/>
    </g>
  );
}

function Microfiche() {
  return (
    <g>
      <rect x="96" y="120" width="608" height="880" rx="8" fill="#20242c" stroke="#0e1116" strokeWidth="6"/>
      <rect x="140" y="170" width="520" height="700" rx="4" fill="#f2ead2" stroke="#b9ad8c" strokeWidth="3"/>
      <g fill="#2b2a26" opacity=".85">
        {Array.from({length: 42}, (_, i) => (
          <rect key={i} x={168 + (i % 6) * 78} y={200 + Math.floor(i / 6) * 96} width="56" height="72" rx="2" opacity={.5 + ((i * 7) % 5) * .1}/>
        ))}
      </g>
      <g stroke="#5d5645" strokeWidth="2" opacity=".7">
        <path d="M170 884 H630 M170 906 H520"/>
      </g>
      <rect x="560" y="880" width="100" height="60" rx="4" fill="#b03a2e" opacity=".75"/>
      <circle cx="200" cy="980" r="26" fill="#0e1116" stroke="#4d5462" strokeWidth="4"/>
    </g>
  );
}

function Tarot() {
  return (
    <g>
      <rect x="196" y="60" width="408" height="1012" rx="10" fill="#1e1a24" stroke="#0d0b10" strokeWidth="6"/>
      <rect x="222" y="86" width="356" height="960" rx="6" fill="none" stroke="#a78b46" strokeWidth="3" opacity=".8"/>
      <g fill="none" stroke="#c9a961" strokeWidth="3" opacity=".85">
        <circle cx="400" cy="430" r="120"/>
        <circle cx="400" cy="430" r="96" strokeDasharray="8 10"/>
        <path d="M400 250 V610 M220 430 H580 M278 308 L522 552 M522 308 L278 552" opacity=".5"/>
        <path d="M400 330 L462 452 L400 530 L338 452 Z"/>
      </g>
      <g fill="#c9a961" opacity=".9">
        <circle cx="400" cy="140" r="14"/>
        <circle cx="400" cy="992" r="14"/>
        {Array.from({length: 7}, (_, i) => (
          <path key={i}
            d={'M' + (300 + i * 34) + ' 962 l10 20 l22 3 l-16 15 l4 22 l-20 -11 l-20 11 l4 -22 l-16 -15 l22 -3 z'}
            opacity={.5 + (i % 3) * .2}/>
        ))}
      </g>
    </g>
  );
}

function Badge() {
  return (
    <g>
      <rect x="150" y="300" width="500" height="560" rx="26" fill="#e7e3d4" stroke="#9aa0a8" strokeWidth="6"/>
      <rect x="150" y="300" width="500" height="96" rx="26" fill="#2f4a63"/>
      <rect x="150" y="368" width="500" height="28" fill="#2f4a63"/>
      <rect x="186" y="430" width="200" height="250" rx="8" fill="#b9b3a1" stroke="#8c8676" strokeWidth="4"/>
      <circle cx="286" cy="540" r="52" fill="#8c8676" opacity=".8"/>
      <path d="M246 600 q40 -70 80 0 z" fill="#8c8676" opacity=".8"/>
      <g stroke="#8d8a7c" strokeWidth="5" opacity=".7">
        <path d="M420 460 H606 M420 496 H580 M420 532 H606 M420 568 H540 M420 604 H596 M420 640 H560"/>
      </g>
      <rect x="150" y="712" width="500" height="66" fill="#2f4a63" opacity=".9"/>
      <circle cx="400" cy="290" r="26" fill="#8d8a7c" stroke="#6d6a5e" strokeWidth="4"/>
    </g>
  );
}

const builders = {Notebook, Computer, Bottle, Polaroid, Cassette, Microfiche, Tarot, Badge};

/** Renderiza um artefato físico; 'back' vira a peça como um objeto real virado. */
export default function CraftedArt({templateId = 'notebook', side = 'front'}) {
  const Builder = builders[craftedTemplateIds[templateId]];
  if (!Builder) return null;
  return (
    <svg className={'handout-art crafted-art crafted-' + templateId} viewBox="0 0 800 1132"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="800" height="1132" fill="#161310"/>
      <Builder side={side} />
    </svg>
  );
}
