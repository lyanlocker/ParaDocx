import React from 'react';
import {Scuffs, Crease, CastShadow, Dirt, Sheen} from './craftedCore.jsx';

/** Costura de couro com linhaContrastante. */
function Stitch({x1, y1, x2, y2, color = '#e0c08a', dash = '10 9'}) {
  return (
    <path d={'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2} stroke={color} strokeOpacity="0.5"
      strokeWidth="2.4" strokeDasharray={dash} fill="none" strokeLinecap="round"/>
  );
}

/**
 * Caderno de campo de couro.
 * Frente: capa com costura, bolso, elástico e placa de identificação.
 * Verso: o caderno virado, com páginas pautadas e costura exposta.
 */
export function Notebook({ids, side}) {
  const front = (
    <g>
      <CastShadow x={402} y={1024} rx={266} ry={40}/>
      <g transform="rotate(-1.6 400 566)">
        {/* lombada */}
        <rect x="112" y="112" width="580" height="892" rx="24" fill={'url(#'+ids.leatherDark+')'}
          stroke="#170c07" strokeWidth="6"/>
        {/* capa */}
        <rect x="124" y="118" width="566" height="882" rx="20" fill={'url(#'+ids.leather+')'}
          stroke="#1d100a" strokeWidth="4"/>
        {/* brilho do couro na diagonal */}
        <path d="M124 118 h566 v300 q-283 150 -566 0 z" fill="#c98f57" opacity="0.09"/>
        <path d="M124 1000 h566 v-260 q-283 130 -566 0 z" fill="#000" opacity="0.16"/>
        {/* costura interna */}
        <rect x="142" y="136" width="530" height="846" rx="14" fill="none" stroke="#c49a68"
          strokeOpacity="0.4" strokeWidth="1.6" strokeDasharray="8 9"/>
        <Stitch x1={142} y1={136} x2={142} y2={982}/>
        <Stitch x1={672} y1={136} x2={672} y2={982}/>
        <Stitch x1={142} y1={136} x2={672} y2={136}/>
        <Stitch x1={142} y1={982} x2={672} y2={982}/>
        {/* vincos e desgaste natural */}
        <g opacity="0.32">
          <ellipse cx="556" cy="320" rx="132" ry="76" fill="#8b5533" transform="rotate(-18 556 320)"/>
          <ellipse cx="298" cy="846" rx="164" ry="60" fill="#150906" transform="rotate(-5 298 846)"/>
          <ellipse cx="470" cy="640" rx="94" ry="42" fill="#7d4c2c" opacity="0.55"/>
        </g>
        {/* furos e argolas */}
        {Array.from({length: 8}, (_, i) => (
          <g key={i}>
            <circle cx="168" cy={232 + i * 92} r="17" fill="#241208" stroke="#c9a06a"
              strokeOpacity="0.45" strokeWidth="4"/>
            <circle cx="168" cy={232 + i * 92} r="6" fill="#0e0704" opacity="0.85"/>
            <path d={'M190 ' + (232 + i * 92) + ' h26'} stroke="#c9a06a" strokeOpacity="0.24" strokeWidth="2.4"/>
          </g>
        ))}
        {/* placa de identificação gravada */}
        <g>
          <rect x="238" y="286" width="416" height="96" rx="8" fill="#2a170e" opacity="0.55"/>
          <rect x="238" y="286" width="416" height="96" rx="8" fill="none" stroke="#d3ab74"
            strokeOpacity="0.72" strokeWidth="3.2"/>
          <rect x="248" y="296" width="396" height="76" rx="5" fill="none" stroke="#d3ab74"
            strokeOpacity="0.26" strokeWidth="1.4"/>
          <path d="M262 322 h44 M262 338 h30" stroke="#d3ab74" strokeOpacity="0.55" strokeWidth="3"/>
          <path d="M562 402 l14 26 l28 4 l-20 19 l5 28 l-27 -14 l-26 14 l5 -28 l-20 -19 l28 -4 z"
            fill="#d3ab74" fillOpacity="0.8"/>
        </g>
        {/* bolso com botao */}
        <g>
          <path d="M244 428 h404 v76 h-404 z" fill="#3a2013" opacity="0.5"/>
          <path d="M244 428 h404 v14 h-404 z" fill="#7a4a2c" opacity="0.7"/>
          <path d="M244 428 h404 v76 h-404 z" fill="none" stroke="#d3ab74" strokeOpacity="0.3" strokeWidth="2"/>
          <circle cx="612" cy="466" r="9" fill="#c9a06a" opacity="0.6"/>
        </g>
        {/* etiqueta de bolso */}
        <g opacity="0.62">
          <rect x="248" y="874" width="396" height="70" rx="6" fill="#1d100a"/>
          <rect x="248" y="874" width="396" height="70" rx="6" fill="none" stroke="#c9a06a"
            strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="6 7"/>
          <path d="M268 906 h128 M268 922 h84" stroke="#c9a06a" strokeOpacity="0.55" strokeWidth="2.6"/>
        </g>
        {/* elástico vertical */}
        <g>
          <rect x="640" y="586" width="46" height="128" rx="14" fill="#1c0f08" opacity="0.9"/>
          <rect x="640" y="586" width="46" height="128" rx="14" fill="none" stroke="#a8764a"
            strokeOpacity="0.45" strokeWidth="2"/>
          <path d="M663 596 v108" stroke="#e0b884" strokeOpacity="0.22" strokeWidth="5"/>
        </g>
        <Dirt x={130} y={120} w={560} h={880} count={26} opacity={0.24}/>
        <Sheen x={150} y={140} w={140} h={700} rotate={-24} opacity={0.045}/>
        <Crease x1={124} y1={420} x2={690} y2={404}/>
        <Crease x1={124} y1={790} x2={690} y2={806}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={404} y={1026} rx={268} ry={40}/>
      <g transform="rotate(1.2 400 566)">
        <rect x="112" y="112" width="580" height="892" rx="24" fill={'url(#'+ids.leatherDark+')'}
          stroke="#170c07" strokeWidth="6"/>
        {/* bloco de páginas */}
        <rect x="124" y="122" width="566" height="874" rx="16" fill={'url(#'+ids.paper+')'}
          stroke="#b7ab8e" strokeWidth="3"/>
        {/* borda do bloco, com linhas de folhas */}
        <g opacity="0.5">
          {Array.from({length: 26}, (_, i) => (
            <line key={i} x1={690} y1={140 + i * 33} x2={690 - (i % 3) * 5} y2={140 + i * 33}
              stroke="#a79a7c" strokeWidth="1"/>
          ))}
        </g>
        {/* faixa de papelão na lombada */}
        <rect x="124" y="122" width="96" height="874" fill="#cbbd99"/>
        <rect x="124" y="122" width="96" height="874" fill={'url(#'+ids.paperEdge+')'} opacity="0.5"/>
        <path d="M220 122 V996" stroke="#a8573d" strokeOpacity="0.4" strokeWidth="2.6"/>
        {/* pauta */}
        <g stroke="#9fb0c9" strokeOpacity="0.45" strokeWidth="1.5">
          {Array.from({length: 25}, (_, i) => (
            <line key={'h' + i} x1="236" y1={150 + i * 33} x2="672" y2={150 + i * 33}/>
          ))}
          {Array.from({length: 12}, (_, i) => (
            <line key={'v' + i} x1={252 + i * 34} y1="122" x2={252 + i * 34} y2="996"/>
          ))}
        </g>
        {/* margem */}
        <path d="M240 122 V996" stroke="#c46a52" strokeOpacity="0.22" strokeWidth="2"/>
        {/* papelão da capa visto por trás */}
        <path d="M124 122 H690" stroke="#000" strokeOpacity="0.22" strokeWidth="9"/>
        {/* anotação a lápis */}
        <g opacity="0.5">
          <rect x="252" y="150" width="238" height="60" rx="5" fill="#d6c49c"/>
          <path d="M266 174 h186 M266 192 h126" stroke="#6f5c3c" strokeOpacity="0.6" strokeWidth="2.6"/>
        </g>
        {/* manchas e desgaste */}
        <g opacity="0.28">
          <ellipse cx="602" cy="884" rx="126" ry="72" fill="#b8a077"/>
          <ellipse cx="336" cy="624" rx="94" ry="52" fill="#fff" opacity="0.55"/>
          <ellipse cx="470" cy="330" rx="80" ry="44" fill="#a98f62"/>
        </g>
        {/* furos costurados */}
        <g opacity="0.45">
          {Array.from({length: 9}, (_, i) => (
            <circle key={i} cx="168" cy={232 + i * 92} r="15" fill="#f7f0da" stroke="#8d7a55" strokeWidth="2"/>
          ))}
        </g>
        <Scuffs x={230} y={140} w={460} h={840} count={36} opacity={0.13}/>
        <Dirt x={124} y={122} w={566} h={874} count={22} opacity={0.18}/>
        <Crease x1={124} y1={420} x2={690} y2={404}/>
        <Crease x1={124} y1={790} x2={690} y2={806}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}

/**
 * Terminal de mainframe dos anos 80.
 * Frente: CRT com vidro curvado, brilho de fósforo, teclado e botões.
 * Verso: gabinete com ventilação, cabos e etiqueta de manutenção.
 */
export function Computer({ids, side}) {
  const front = (
    <g>
      <CastShadow x={400} y={1014} rx={300} ry={40}/>
      {/* pedestal */}
      <path d="M300 880 h200 l40 118 h-280 z" fill={'url(#'+ids.metalDark+')'} stroke="#0d0b09" strokeWidth="5"/>
      <rect x="196" y="986" width="408" height="34" rx="16" fill={'url(#'+ids.metalDark+')'}
        stroke="#0d0b09" strokeWidth="5"/>
      {/* gabinete */}
      <rect x="86" y="146" width="628" height="752" rx="34" fill={'url(#'+ids.plastic+')'}
        stroke="#0c0a08" strokeWidth="7"/>
      <rect x="86" y="146" width="628" height="752" rx="34" fill="#fff" opacity="0.06"/>
      {/* fresta de ventilação no topo */}
      <g opacity="0.4">
        {Array.from({length: 9}, (_, i) => (
          <rect key={i} x={330 + i * 18} y="166" width="9" height="16" rx="4" fill="#2b2621"/>
        ))}
      </g>
      {/* moldura do CRT */}
      <rect x="110" y="174" width="580" height="572" rx="30" fill="#1d1916" stroke="#000" strokeWidth="9"/>
      {/* vidro */}
      <rect x="118" y="182" width="564" height="556" rx="26" fill={'url(#'+ids.ink+')'}
        stroke="#000" strokeWidth="8"/>
      {/* brilho do fósforo */}
      <g filter={'url(#' + ids.glow + ')'} opacity="0.72">
        {Array.from({length: 15}, (_, i) => (
          <rect key={i} x={156 + (i % 3 === 0 ? 0 : 26)} y={224 + i * 34}
            width={i % 5 === 4 ? 200 : 330 - (i % 3) * 62} height="11" rx="3"
            fill="#7dfab0" opacity={0.35 + (i % 4) * 0.15}/>
        ))}
      </g>
      <rect x="118" y="182" width="564" height="556" rx="26" fill="#2f7f4d" opacity="0.05"/>
      {/* varredura horizontal */}
      <g opacity="0.12" fill="#d8f5e4">
        {Array.from({length: 26}, (_, i) => (
          <rect key={i} x={140 + i * 21} y="196" width="1.6" height="520"/>
        ))}
      </g>
      <g opacity="0.1">
        {Array.from({length: 12}, (_, i) => (
          <rect key={i} x="118" y={200 + i * 46} width="564" height="3" fill="#9ff3bd"/>
        ))}
      </g>
      {/* reflexo do vidro */}
      <path d="M150 214 q120 -26 250 -12 l-40 320 q-110 40 -220 -10 z" fill="#dfffe9" opacity="0.06"/>
      {/* moldura inferior, teclado */}
      <rect x="130" y="770" width="540" height="86" rx="14" fill={'url(#'+ids.metalDark+')'}/>
      <g fill="#3f3833" stroke="#6b6259" strokeWidth="1.6">
        <rect x="152" y="796" width="104" height="26" rx="6"/>
        <rect x="272" y="796" width="76" height="26" rx="6"/>
        <rect x="364" y="796" width="60" height="26" rx="6"/>
      </g>
      <circle cx="628" cy="809" r="17" fill="#7a2f24" stroke="#4a1a14" strokeWidth="3"/>
      <circle cx="628" cy="805" r="6" fill="#c9584a" opacity="0.85"/>
      <g opacity="0.35">
        <rect x="150" y="840" width="180" height="5" rx="2.5" fill="#5c524a"/>
        <rect x="470" y="840" width="60" height="5" rx="2.5" fill="#5c524a"/>
      </g>
      <Dirt x={90} y={150} w={620} h={740} count={24} opacity={0.22}/>
      <Scuffs x={110} y={170} w={580} h={700} count={26} opacity={0.14}/>
      <Sheen x={140} y={200} w={110} h={480} rotate={-26} opacity={0.05}/>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={1014} rx={300} ry={40}/>
      <path d="M300 880 h200 l40 118 h-280 z" fill="#1d1a17" stroke="#0c0a08" strokeWidth="5"/>
      <rect x="196" y="986" width="408" height="34" rx="16" fill="#1d1a17" stroke="#0c0a08" strokeWidth="5"/>
      <rect x="86" y="146" width="628" height="752" rx="34" fill={'url(#'+ids.metalDark+')'}
        stroke="#0c0a08" strokeWidth="7"/>
      {/* tampa com parafusos */}
      <g fill="#454b50" stroke="#24292c" strokeWidth="2">
        {[[130, 190], [670, 190], [130, 854], [670, 854], [400, 190], [400, 854]].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="11"/>
        ))}
      </g>
      {/* grelha de ventilação */}
      <rect x="130" y="196" width="540" height="420" rx="12" fill="#141211"/>
      <g stroke="#3d3733" strokeWidth="5" opacity="0.85">
        {Array.from({length: 9}, (_, i) => (
          <line key={i} x1="160" y1={230 + i * 42} x2="640" y2={230 + i * 42}/>
        ))}
      </g>
      <rect x="130" y="196" width="540" height="420" rx="12" fill="none" stroke="#4e4640" strokeWidth="3"/>
      {/* etiquetas e etiqueta de manutenção */}
      <g>
        <rect x="150" y="650" width="240" height="126" rx="6" fill="#cdc6b4"/>
        <rect x="150" y="650" width="240" height="126" rx="6" fill="none" stroke="#7d7461" strokeWidth="2"/>
        <g opacity="0.55" stroke="#3b352c" strokeWidth="2">
          {Array.from({length: 6}, (_, i) => (
            <line key={i} x1="168" y1={672 + i * 14} x2={168 + (i % 3) * 60} y2={672 + i * 14}/>
          ))}
        </g>
      </g>
      <g>
        <rect x="410" y="650" width="240" height="70" rx="6" fill="#8d949a"/>
        <rect x="410" y="740" width="240" height="36" rx="6" fill="#3f454a"/>
      </g>
      {/* conectores */}
      <g fill="#5b524a" opacity="0.55">
        {Array.from({length: 6}, (_, i) => (
          <circle key={i} cx={180 + i * 90} cy="812" r="8"/>
        ))}
      </g>
      {/* cabos */}
      <path d="M520 812 q120 40 180 8 q90 -50 60 -140" fill="none" stroke="#1a1614" strokeWidth="10"
        strokeLinecap="round" opacity="0.8"/>
      <path d="M520 812 q120 40 180 8 q90 -50 60 -140" fill="none" stroke="#4a423a" strokeWidth="3"
        strokeLinecap="round" opacity="0.5"/>
      <Scuffs x={100} y={160} w={600} h={720} count={30} opacity={0.2}/>
      <Dirt x={90} y={150} w={620} h={740} count={30} opacity={0.3}/>
    </g>
  );

  return side === 'back' ? back : front;
}
