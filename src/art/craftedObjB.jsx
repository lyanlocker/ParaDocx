import React from 'react';
import {Scuffs, CastShadow, Dirt, Sheen, Crease} from './craftedCore.jsx';

/**
 * Garrafa de vinho com rótulo envelhecido.
 * Frente: garrafa de vidro escuro, gargalo, cápsula e rótulo de papel amarelado.
 * Verso: o rótulo visto pelo avesso, rasgado, com marca d'água.
 */
export function Bottle({ids, side}) {
  const glass = (
    <g>
      {/* corpo */}
      <path d="M300 340 q-64 26 -64 96 v420 q0 96 64 118 h200 q64 -22 64 -118 v-420 q0 -70 -64 -96 z"
        fill="url(#" + ids.greenGlass + ')" stroke="#0a1a12" strokeWidth="6"/>
      {/* ombro */}
      <path d="M300 340 q100 -34 200 0 q-14 60 -40 96 h-120 q-26 -36 -40 -96 z"
        fill="url(#" + ids.greenGlass + ')" stroke="#0a1a12" strokeWidth="6"/>
      {/* gargalo */}
      <path d="M352 176 q0 -46 48 -46 q48 0 48 46 v170 q0 34 -48 40 q-48 -6 -48 -40 z"
        fill="url(#" + ids.greenGlass + ')" stroke="#0a1a12" strokeWidth="6"/>
      {/* reflexos verticais */}
      <path d="M286 470 q-8 190 14 330" fill="none" stroke="#dfffe9" strokeOpacity="0.34" strokeWidth="16"
        strokeLinecap="round"/>
      <path d="M520 460 q10 200 -12 344" fill="none" stroke="#bfe9d2" strokeOpacity="0.14" strokeWidth="8"
        strokeLinecap="round"/>
      {/*Capsula */}
      <path d="M346 158 q0 -40 54 -40 q54 0 54 40 v34 h-108 z" fill="url(#" + ids.gold + ')"
        stroke="#3b2c0d" strokeWidth="4"/>
      <path d="M346 176 h108 v16 h-108 z" fill="#000" opacity="0.22"/>
      {/* gargalheira */}
      <path d="M340 214 q60 26 120 0 v20 q-60 26 -120 0 z" fill="#1a1f1c" stroke="#0a0d0b" strokeWidth="3"/>
      {/* gargalo */}
      <path d="M336 214 q-10 26 -6 46" stroke="#0a0d0b" strokeWidth="5" fill="none"/>
      {/* luz na borda */}
      <path d="M236 500 v360" stroke="#eafff0" strokeOpacity="0.12" strokeWidth="5" fill="none"/>
    </g>
  );

  const front = (
    <g>
      <CastShadow x={400} y={1012} rx={210} ry={44}/>
      <g transform="rotate(-1.2 400 600)">
        {glass}
        {/* rótulo */}
        <g>
          <path d="M258 560 q142 -18 284 0 v268 q-142 18 -284 0 z" fill="url(#" + ids.paper + ')"
            stroke="#a89a78" strokeWidth="3"/>
          <path d="M258 560 q142 -18 284 0 v268 q-142 18 -284 0 z" fill="#d8c89a" opacity="0.35"/>
          {/* borda dupla */}
          <path d="M274 584 q126 -14 252 0 v220 q-126 14 -252 0 z" fill="none" stroke="#4b3b22"
            strokeOpacity="0.55" strokeWidth="2.4"/>
          {/* vinco e rasgo */}
          <path d="M300 700 q60 -22 118 6 q54 26 106 -8" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="3"/>
          <path d="M430 830 q34 8 70 -6 l8 22 q-40 16 -76 4 z" fill="#e8e0c8" stroke="#a89a78" strokeWidth="2"/>
          {/* mancha de vinho */}
          <ellipse cx="330" cy="770" rx="46" ry="34" fill="#6b1f2a" opacity="0.22"/>
          <ellipse cx="500" cy="640" rx="34" ry="26" fill="#6b1f2a" opacity="0.14"/>
          {/* vinco vertical do vidro */}
          <path d="M400 560 v268" stroke="#000" strokeOpacity="0.1" strokeWidth="14"/>
          <path d="M406 560 v268" stroke="#fff" strokeOpacity="0.16" strokeWidth="4"/>
        </g>
        <Dirt x={250} y={550} w={300} h={290} count={20} opacity={0.18}/>
      </g>
      <Sheen x={250} y={420} w={90} h={420} rotate={-8} opacity={0.06}/>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={1012} rx={210} ry={44}/>
      <g transform="rotate(1 400 600)">
        {glass}
        {/* contramarca de papel cru, com furo do gargalo */}
        <g>
          <path d="M262 566 q138 -16 276 0 v258 q-138 16 -276 0 z" fill="#e6dfc9"
            stroke="#b3a888" strokeWidth="3"/>
          <path d="M262 566 q138 -16 276 0 v258 q-138 16 -276 0 z" fill="#fff" opacity="0.14"/>
          <path d="M280 590 q120 -12 240 0 v210 q-120 12 -240 0 z" fill="none" stroke="#6b5c3c"
            strokeOpacity="0.4" strokeWidth="2" strokeDasharray="7 6"/>
          {/* furo do gargalo */}
          <path d="M352 570 h96 v56 q-48 18 -96 0 z" fill="#0d2c1e" opacity="0.9"/>
          {/* lote e destino */}
          <g opacity="0.5" stroke="#3f3524" strokeWidth="2.4">
            <path d="M300 700 h200 M300 720 h150 M300 742 h196"/>
          </g>
          {/* manchas e fibras */}
          <g opacity="0.2">
            <ellipse cx="360" cy="790" rx="70" ry="42" fill="#a08f68"/>
            <ellipse cx="470" cy="640" rx="50" ry="30" fill="#b8a97f"/>
          </g>
          {/* rasgo no canto */}
          <path d="M538 566 l-46 40 l30 22 z" fill="#000" opacity="0.14"/>
          <path d="M262 566 q138 -16 276 0" stroke="#000" strokeOpacity="0.12" strokeWidth="6" fill="none"/>
        </g>
        <Dirt x={250} y={550} w={300} h={290} count={26} opacity={0.24}/>
        <Crease x1={262} y1={700} x2={538} y2={706}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}

/**
 * Fotografia instantânea (Polaroid).
 * Frente: moldura branca, imagem revelada em tom sépia e legenda a lápis.
 * Verso: verso do papel fotográfico com marca do fabricante e anotações.
 */
export function Polaroid({ids, side}) {
  const front = (
    <g>
      <CastShadow x={402} y={966} rx={252} ry={38}/>
      <g transform="rotate(-2.2 400 566)">
        {/* moldura */}
        <rect x="146" y="150" width="508" height="620" rx="6" fill="url(#" + ids.paper + ')"
          stroke="#b9ae95" strokeWidth="3"/>
        <rect x="146" y="150" width="508" height="620" rx="6" fill="#fff" opacity="0.2"/>
        {/* área da imagem */}
        <rect x="176" y="180" width="448" height="430" fill="#1a1512"/>
        {/* cena: casa à noite */}
        <g>
          <rect x="176" y="180" width="448" height="430" fill="#241a13"/>
          <rect x="176" y="470" width="448" height="140" fill="#120d0a"/>
          {/* céu com névoa */}
          <ellipse cx="300" cy="250" rx="150" ry="90" fill="#4a3a2c" opacity="0.6"/>
          <ellipse cx="520" cy="300" rx="120" ry="80" fill="#3a2c21" opacity="0.5"/>
          {/* casa */}
          <path d="M290 470 V300 l110 -70 l110 70 V470 z" fill="#100c09"/>
          <path d="M278 300 l122 -78 l122 78 l-10 16 l-112 -72 l-112 72 z" fill="#0b0806"/>
          {/* janela acesa */}
          <rect x="392" y="330" width="46" height="58" fill="#e8c67a" opacity="0.92"/>
          <rect x="392" y="330" width="46" height="58" fill="#ffdf9a" opacity="0.4"/>
          <path d="M415 330 v58 M392 359 h46" stroke="#100c09" strokeWidth="4"/>
          {/* silhueta na janela */}
          <path d="M404 388 q0 -18 11 -18 q11 0 11 18 z" fill="#241a13" opacity="0.85"/>
          {/* outras janelas */}
          <rect x="316" y="366" width="34" height="42" fill="#5a4a2c" opacity="0.5"/>
          <rect x="452" y="366" width="34" height="42" fill="#5a4a2c" opacity="0.35"/>
          {/* arbustos */}
          <path d="M176 520 q60 -34 110 -6 q40 -26 96 4 q50 -22 100 8 q70 -20 142 4 V610 H176 z"
            fill="#0d0907"/>
          {/* grão fotográfico */}
          <rect x="176" y="180" width="448" height="430" fill="#c99a5e" opacity="0.1"/>
        </g>
        {/* brilho da foto */}
        <path d="M176 180 h448 v120 q-220 90 -448 0 z" fill="#ffdca8" opacity="0.08"/>
        {/* faixa inferior para a legenda */}
        <rect x="176" y="632" width="448" height="110" fill="#f4efe2"/>
        <rect x="176" y="632" width="448" height="110" fill="url(#" + ids.paperEdge + ')" opacity="0.5"/>
        <path d="M176 632 h448" stroke="#c4b89c" strokeWidth="2"/>
        {/* cantos curvos e desgaste */}
        <path d="M146 770 q0 -4 6 -6 M654 150 q-4 0 -6 6" stroke="#000" strokeOpacity="0.16" strokeWidth="4" fill="none"/>
        <Scuffs x={150} y={160} w={500} h={600} count={26} opacity={0.12}/>
        <Dirt x={150} y={155} w={500} h={610} count={20} opacity={0.16}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={402} y={966} rx={252} ry={38}/>
      <g transform="rotate(1.6 400 566)">
        <rect x="146" y="150" width="508" height="620" rx="6" fill="url(#" + ids.paper + ')"
          stroke="#b9ae95" strokeWidth="3"/>
        <rect x="146" y="150" width="508" height="620" rx="6" fill="#fdfaf0" opacity="0.35"/>
        {/* sulcos de revelação */}
        <g opacity="0.22" stroke="#b7ac92" strokeWidth="2">
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1="176" y1={190 + i * 44} x2="624" y2={190 + i * 44}/>
          ))}
        </g>
        {/* marca do fabricante */}
        <g>
          <rect x="300" y="330" width="200" height="70" rx="4" fill="#e8e0cb"/>
          <text x="400" y="376" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26"
            fill="#6b5c3c" opacity="0.75" letterSpacing="2">POLAROID</text>
        </g>
        {/* anotações a lápis */}
        <g opacity="0.55">
          <path d="M200 480 h180 M200 506 h120" stroke="#5c5138" strokeWidth="3" strokeLinecap="round"/>
          <path d="M420 470 h170 M420 496 h110" stroke="#5c5138" strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* código de lote */}
        <g opacity="0.45">
          <path d="M200 600 h120 M200 622 h90" stroke="#6b5c3c" strokeWidth="2.4"/>
        </g>
        <Scuffs x={150} y={160} w={500} h={600} count={22} opacity={0.14}/>
        <Dirt x={150} y={155} w={500} h={610} count={18} opacity={0.14}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}

/**
 * Fita cassete (K-7).
 * Frente: carcaça de plástico translúcido, fitas, etiqueta manuscrita.
 * Verso: etiqueta de trás com a trilha gravada.
 */
export function Cassette({ids, side}) {
  const front = (
    <g>
      <CastShadow x={400} y={902} rx={252} ry={34}/>
      <g transform="rotate(-2 400 566)">
        {/* carcaça */}
        <rect x="140" y="320" width="520" height="440" rx="14" fill="url(#" + ids.plastic + ')"
          stroke="#4b463f" strokeWidth="5"/>
        <rect x="140" y="320" width="520" height="440" rx="14" fill="#fff" opacity="0.08"/>
        {/* janela das fitas */}
        <rect x="212" y="372" width="376" height="200" rx="10" fill="#1a1815" opacity="0.9"/>
        <rect x="212" y="372" width="376" height="200" rx="10" fill="none" stroke="#55504a" strokeWidth="3"/>
        {/* fitas */}
        <rect x="248" y="404" width="150" height="136" rx="6" fill="#0e0d0c"/>
        <circle cx="323" cy="472" r="58" fill="#3a342c"/>
        <circle cx="323" cy="472" r="52" fill="#221e1a"/>
        <g stroke="#6a6055" strokeWidth="4" opacity="0.8">
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1="323" y1="472" x2={323 + Math.cos(i * 0.52) * 50} y2={472 + Math.sin(i * 0.52) * 50}/>
          ))}
        </g>
        <circle cx="323" cy="472" r="13" fill="#0d0c0b"/>
        <rect x="404" y="404" width="150" height="136" rx="6" fill="#0e0d0c"/>
        <circle cx="479" cy="472" r="58" fill="#3a342c"/>
        <circle cx="479" cy="472" r="52" fill="#221e1a"/>
        <g stroke="#6a6055" strokeWidth="4" opacity="0.8">
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1="479" y1="472" x2={479 + Math.cos(i * 0.52 + 0.4) * 50} y2={472 + Math.sin(i * 0.52 + 0.4) * 50}/>
          ))}
        </g>
        <circle cx="479" cy="472" r="13" fill="#0d0c0b"/>
        {/* janela do brilho */}
        <rect x="212" y="372" width="376" height="200" rx="10" fill="#cfe4ee" opacity="0.1"/>
        {/* parafusos */}
        <g fill="#4b463f" opacity="0.6">
          {[[168, 348], [632, 348], [168, 732], [632, 732]].map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="8"/>
          ))}
        </g>
        {/* etiqueta manuscrita */}
        <g>
          <rect x="212" y="520" width="376" height="212" rx="4" fill="#f2ead6"
            stroke="#b3a888" strokeWidth="2.4"/>
          <rect x="212" y="520" width="376" height="212" rx="4" fill="#fff" opacity="0.12"/>
          <path d="M228 560 h240" stroke="#2f3a46" strokeOpacity="0.5" strokeWidth="2.4"/>
          <path d="M228 596 h300" stroke="#2f3a46" strokeOpacity="0.35" strokeWidth="2.4"/>
          <path d="M228 632 h180" stroke="#2f3a46" strokeOpacity="0.28" strokeWidth="2.4"/>
          <path d="M228 700 h260" stroke="#2f3a46" strokeOpacity="0.22" strokeWidth="2.4"/>
        </g>
        <Dirt x={145} y={325} w={510} h={430} count={22} opacity={0.2}/>
        <Scuffs x={150} y={330} w={500} h={420} count={24} opacity={0.16}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={902} rx={252} ry={34}/>
      <g transform="rotate(1.4 400 566)">
        <rect x="140" y="320" width="520" height="440" rx="14" fill="url(#" + ids.plastic + ')"
          stroke="#4b463f" strokeWidth="5"/>
        <rect x="140" y="320" width="520" height="440" rx="14" fill="#000" opacity="0.08"/>
        {/* fita exposta */}
        <rect x="212" y="372" width="376" height="200" rx="10" fill="#241f1b" opacity="0.92"/>
        <g stroke="#4a4038" strokeWidth="5" opacity="0.8">
          {Array.from({length: 6}, (_, i) => (
            <line key={i} x1="240" y1={410 + i * 28} x2="560" y2={410 + i * 28}/>
          ))}
        </g>
        {/* etiqueta de trás, com a lista */}
        <g>
          <rect x="212" y="520" width="376" height="212" rx="4" fill="#f4ecda"
            stroke="#b3a888" strokeWidth="2.4"/>
          <rect x="212" y="520" width="376" height="212" rx="4" fill="#fff" opacity="0.1"/>
          <path d="M232 560 h120 M232 596 h250 M232 628 h170 M232 668 h220 M232 704 h140" stroke="#2f3a46" strokeOpacity="0.4" strokeWidth="2.6"/>
        </g>
        <Dirt x={145} y={325} w={510} h={430} count={28} opacity={0.26}/>
        <Scuffs x={150} y={330} w={500} h={420} count={28} opacity={0.2}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}
