import React from 'react';
import {Scuffs, CastShadow, Dirt, Sheen} from './craftedCore.jsx';

function Frame({x, y, tone, detail}) {
  return (
    <g>
      <rect x={x} y={y} width="118" height="98" fill={tone} stroke="#0d0f12" strokeWidth="1.6"/>
      {detail}
    </g>
  );
}

/**
 * Microficha de arquivo.
 * Frente: cartolina de microfilme com quadros de imagem em miniatura e tarja de codigo.
 * Verso: ficha de indexacao com tabela de quadros e carimbo.
 */
export function Microfiche({ids, side}) {
  const front = (
    <g>
      <CastShadow x={400} y={1000} rx={262} ry={34}/>
      <g transform="rotate(-0.8 400 566)">
        <rect x="120" y="140" width="560" height="800" rx="6" fill="#20262c" stroke="#0b0d10" strokeWidth="5"/>
        <rect x="120" y="140" width="560" height="800" rx="6" fill="url(#" + ids.metalDark + ')" opacity="0.35"/>
        <rect x="120" y="140" width="560" height="86" fill="#171c21"/>
        <path d="M120 226 h560" stroke="#4a5560" strokeWidth="2"/>
        <g transform="translate(146 246)">
          {Array.from({length: 6}, (_, r) =>
            Array.from({length: 4}, (_, c) => {
              const x = c * 132;
              const y = r * 112;
              const t = (r * 4 + c) % 5;
              const tone = ['#3c4650', '#4a4034', '#2f3a44', '#45403a', '#333d45'][t];
              let detail = null;
              if (t === 0) {
                detail = (
                  <g opacity="0.6">
                    <path d={'M' + (x + 12) + ' ' + (y + 76) + ' q30 -40 54 -14 q22 -26 40 -4 v30 h-94 z'} fill="#1b2126"/>
                  </g>
                );
              } else if (t === 1) {
                detail = (
                  <g opacity="0.55">
                    <circle cx={x + 58} cy={y + 44} r="22" fill="#7a6a4c"/>
                    <rect x={x + 18} y={y + 66} width="80" height="22" fill="#241d16"/>
                  </g>
                );
              } else if (t === 2) {
                detail = (
                  <g opacity="0.5" stroke="#8fa0ad" strokeWidth="3">
                    {Array.from({length: 4}, (_, i) => (
                      <line key={i} x1={x + 16} y1={y + 24 + i * 16} x2={x + 100} y2={y + 24 + i * 16}/>
                    ))}
                  </g>
                );
              } else if (t === 3) {
                detail = (
                  <g opacity="0.55">
                    <rect x={x + 22} y={y + 26} width="72" height="46" fill="#22282c"/>
                    <path d={'M' + (x + 22) + ' ' + (y + 60) + ' h72 v12 h-72 z'} fill="#3d4650"/>
                  </g>
                );
              } else {
                detail = (
                  <g opacity="0.5">
                    <path d={'M' + (x + 16) + ' ' + (y + 80) + ' q22 -54 46 -30 q22 22 40 -12 v52 z'} fill="#2a2f33"/>
                  </g>
                );
              }
              return <Frame key={x + '-' + y} x={x} y={y} tone={tone} detail={detail}/>;
            })
          )}
        </g>
        <rect x="120" y="906" width="560" height="34" fill="#c8cdd3"/>
        <g opacity="0.6" fill="#20262c">
          {Array.from({length: 34}, (_, i) => (
            <rect key={i} x={134 + i * 15} y="914" width={2 + (i % 4) * 3} height="18"/>
          ))}
        </g>
        <g fill="#0b0d10" opacity="0.8">
          <circle cx="140" cy="106" r="8"/>
          <circle cx="660" cy="106" r="8"/>
          <circle cx="140" cy="1024" r="8"/>
          <circle cx="660" cy="1024" r="8"/>
        </g>
        <rect x="140" y="154" width="520" height="56" fill="#0e1215" opacity="0.5"/>
        <rect x="140" y="154" width="520" height="56" fill="none" stroke="#59636d" strokeWidth="1.6"/>
        <Sheen x={150} y={160} w={180} h={760} rotate={-18} opacity={0.05}/>
        <Scuffs x={130} y={150} w={540} h={780} count={30} opacity={0.14}/>
        <Dirt x={125} y={145} w={550} h={790} count={24} opacity={0.24}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={1000} rx={262} ry={34}/>
      <g transform="rotate(0.8 400 566)">
        <rect x="120" y="140" width="560" height="800" rx="6" fill="#232a30" stroke="#0b0d10" strokeWidth="5"/>
        <g opacity="0.35">
          {Array.from({length: 14}, (_, i) => (
            <line key={i} x1="152" y1={420 + i * 32} x2="648" y2={420 + i * 32} stroke="#9fb0c0" strokeWidth="1.6"/>
          ))}
          {Array.from({length: 5}, (_, i) => (
            <line key={'v' + i} x1={152 + i * 124} y1="380" x2={152 + i * 124} y2="836" stroke="#9fb0c0" strokeWidth="1.6"/>
          ))}
        </g>
        <rect x="140" y="160" width="520" height="48" fill="#151a1f"/>
        <rect x="140" y="230" width="520" height="120" fill="#1b2126" opacity="0.7"/>
        <g opacity="0.5" transform="rotate(-8 480 700)">
          <rect x="380" y="646" width="220" height="104" rx="6" fill="none" stroke="#8b3a2c" strokeWidth="5"/>
          <path d="M396 682 h188 M396 706 h140" stroke="#8b3a2c" strokeWidth="5"/>
        </g>
        <g opacity="0.45">
          <path d="M160 260 h300 M160 292 h220" stroke="#c2d0da" strokeWidth="3"/>
        </g>
        <Scuffs x={130} y={150} w={540} h={780} count={28} opacity={0.18}/>
        <Dirt x={125} y={145} w={550} h={790} count={30} opacity={0.3}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}

/**
 * Carta de tarot.
 * Frente: moldura dourada, papel texturizado e selo central no lugar da figura.
 * Verso: carta virada, com numeracao e anotacoes na margem.
 */
export function Tarot({ids, side}) {
  const front = (
    <g>
      <CastShadow x={400} y={1010} rx={230} ry={36}/>
      <g transform="rotate(-1.4 400 566)">
        <rect x="212" y="120" width="376" height="880" rx="10" fill="url(#" + ids.gold + ')"
          stroke="#4a3712" strokeWidth="4"/>
        <rect x="228" y="136" width="344" height="848" rx="6" fill="url(#" + ids.paper + ')"
          stroke="#8f6d22" strokeWidth="2"/>
        <rect x="228" y="136" width="344" height="848" fill="#cbb98f" opacity="0.22"/>
        <rect x="250" y="158" width="300" height="804" fill="none" stroke="#9b7a2c" strokeWidth="2.6"
          strokeOpacity="0.8"/>
        <rect x="262" y="170" width="276" height="780" fill="none" stroke="#9b7a2c" strokeWidth="1.4"
          strokeOpacity="0.5" strokeDasharray="6 6"/>
        <rect x="286" y="188" width="228" height="52" rx="4" fill="#d8cba6" opacity="0.6"/>
        <path d="M286 240 h228" stroke="#9b7a2c" strokeWidth="2" strokeOpacity="0.7"/>
        <g>
          <circle cx="400" cy="500" r="104" fill="none" stroke="#9b7a2c" strokeWidth="3" strokeOpacity="0.8"/>
          <circle cx="400" cy="500" r="88" fill="#2b2318" opacity="0.12"/>
          <circle cx="400" cy="500" r="88" fill="none" stroke="#9b7a2c" strokeWidth="1.6" strokeOpacity="0.55"
            strokeDasharray="8 7"/>
          <path d="M400 428 q54 0 54 54 v96 h-108 v-96 q0 -54 54 -54 z" fill="#241c12" opacity="0.85"/>
          <path d="M400 428 q54 0 54 54 v96 h-108 v-96 q0 -54 54 -54 z" fill="none" stroke="#b8912f"
            strokeWidth="2.4" strokeOpacity="0.8"/>
          <g stroke="#b8912f" strokeWidth="2" strokeOpacity="0.5">
            {Array.from({length: 5}, (_, i) => (
              <line key={i} x1={346 + i * 12} y1={578 - i * 2} x2={454 - i * 12} y2={578 - i * 2}/>
            ))}
          </g>
          <ellipse cx="400" cy="592" rx="60" ry="12" fill="#1a140c" opacity="0.5"/>
          <g>
            <circle cx="400" cy="646" r="30" fill="#7d1f22"/>
            <circle cx="400" cy="646" r="30" fill="none" stroke="#4d0f11" strokeWidth="2.4"/>
            <circle cx="400" cy="646" r="20" fill="#8f262a" opacity="0.8"/>
            <path d="M400 630 l16 16 l-16 16 l-16 -16 z" fill="#c9a15e" opacity="0.55"/>
          </g>
        </g>
        <rect x="286" y="856" width="228" height="52" rx="4" fill="#d8cba6" opacity="0.6"/>
        <path d="M286 856 h228" stroke="#9b7a2c" strokeWidth="2" strokeOpacity="0.7"/>
        <g opacity="0.35">
          <ellipse cx="270" cy="420" rx="26" ry="90" fill="#fff" opacity="0.16"/>
          <ellipse cx="536" cy="700" rx="22" ry="70" fill="#000" opacity="0.2"/>
        </g>
        <Scuffs x={230} y={140} w={340} h={840} count={26} opacity={0.12}/>
        <Dirt x={214} y={122} w={372} h={876} count={26} opacity={0.22}/>
        <Sheen x={250} y={160} w={120} h={760} rotate={-14} opacity={0.05}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={1010} rx={230} ry={36}/>
      <g transform="rotate(1.4 400 566)">
        <rect x="212" y="120" width="376" height="880" rx="10" fill="url(#" + ids.gold + ')"
          stroke="#4a3712" strokeWidth="4"/>
        <rect x="228" y="136" width="344" height="848" rx="6" fill="url(#" + ids.paper + ')"
          stroke="#8f6d22" strokeWidth="2"/>
        <rect x="228" y="136" width="344" height="848" fill="#c9b98f" opacity="0.3"/>
        <rect x="250" y="158" width="300" height="804" fill="none" stroke="#9b7a2c" strokeWidth="2.6"
          strokeOpacity="0.75"/>
        <rect x="286" y="188" width="228" height="52" rx="4" fill="#d8cba6" opacity="0.6"/>
        <path d="M286 240 h228" stroke="#9b7a2c" strokeWidth="2" strokeOpacity="0.7"/>
        <g opacity="0.55">
          <path d="M286 300 h240 M286 332 h180 M286 364 h210" stroke="#4a3b22" strokeWidth="3"
            strokeLinecap="round"/>
          <path d="M286 420 h150" stroke="#6b1f2a" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        </g>
        <g opacity="0.2">
          <ellipse cx="400" cy="520" rx="90" ry="60" fill="#8f6d22"/>
        </g>
        <Scuffs x={230} y={140} w={340} h={840} count={24} opacity={0.14}/>
        <Dirt x={214} y={122} w={372} h={876} count={26} opacity={0.24}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}

/**
 * Cracha de visitante.
 * Frente: cartao laminado, faixa colorida, retrato carimbado e dados.
 * Verso: verso do cracha com as instrucoes de acesso.
 */
export function Badge({ids, side}) {
  const front = (
    <g>
      <CastShadow x={400} y={928} rx={250} ry={32}/>
      <g transform="rotate(-1.8 400 566)">
        <rect x="132" y="300" width="536" height="536" rx="18" fill="url(#" + ids.plastic + ')"
          stroke="#3b3730" strokeWidth="5"/>
        <rect x="132" y="300" width="536" height="536" rx="18" fill="#fff" opacity="0.1"/>
        <path d="M132 318 q0 -18 18 -18 h500 q18 0 18 18 v74 h-536 z" fill="url(#" + ids.blue + ')"
          stroke="#16273c" strokeWidth="3"/>
        <path d="M132 392 h536" stroke="#16273c" strokeWidth="3"/>
        <g opacity="0.85">
          <path d="M168 340 h120 M168 360 h76" stroke="#9fc0e2" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <circle cx="634" cy="348" r="13" fill="#1a1c1f"/>
        <circle cx="634" cy="348" r="13" fill="none" stroke="#6d6a62" strokeWidth="3"/>
        <g>
          <rect x="168" y="440" width="182" height="240" rx="8" fill="#a9a396" stroke="#75725f" strokeWidth="4"/>
          <rect x="168" y="440" width="182" height="240" rx="8" fill="#8f8a7c" opacity="0.35"/>
          <circle cx="259" cy="524" r="46" fill="#6e6b60" opacity="0.85"/>
          <path d="M212 640 q47 -78 94 0 z" fill="#6e6b60" opacity="0.85"/>
          <g opacity="0.25" stroke="#3f3d35" strokeWidth="2">
            {Array.from({length: 9}, (_, i) => (
              <line key={i} x1="168" y1={452 + i * 26} x2="350" y2={452 + i * 26}/>
            ))}
          </g>
        </g>
        <g stroke="#6f6b60" strokeWidth="4" opacity="0.5">
          <path d="M386 470 H616"/>
          <path d="M386 512 H560"/>
          <path d="M386 554 H616"/>
          <path d="M386 596 H520"/>
        </g>
        <path d="M132 762 q0 18 18 18 h500 q18 0 18 -18 v56 h-536 z" fill="url(#" + ids.blue + ')"
          stroke="#16273c" strokeWidth="3"/>
        <path d="M132 762 h536" stroke="#16273c" strokeWidth="3"/>
        <rect x="150" y="792" width="500" height="18" rx="9" fill="#0d1014" opacity="0.75"/>
        <g opacity="0.4">
          <path d="M168 736 h120" stroke="#4a473f" strokeWidth="3"/>
        </g>
        <Scuffs x={140} y={310} w={520} h={520} count={26} opacity={0.18}/>
        <Dirt x={136} y={304} w={528} h={528} count={22} opacity={0.2}/>
        <Sheen x={150} y={330} w={140} h={440} rotate={-22} opacity={0.06}/>
      </g>
    </g>
  );

  const back = (
    <g>
      <CastShadow x={400} y={928} rx={250} ry={32}/>
      <g transform="rotate(1.4 400 566)">
        <rect x="132" y="300" width="536" height="536" rx="18" fill="url(#" + ids.plastic + ')"
          stroke="#3b3730" strokeWidth="5"/>
        <rect x="132" y="300" width="536" height="536" rx="18" fill="#000" opacity="0.06"/>
        <path d="M132 318 q0 -18 18 -18 h500 q18 0 18 18 v40 h-536 z" fill="url(#" + ids.blue + ')"
          stroke="#16273c" strokeWidth="3"/>
        <g opacity="0.45">
          {Array.from({length: 7}, (_, i) => (
            <path key={i} d={'M172 ' + (392 + i * 26) + ' h' + (440 - (i % 3) * 90)} stroke="#4d4a42"
              strokeWidth="4" strokeLinecap="round"/>
          ))}
        </g>
        <g opacity="0.55" fill="#2c2a25">
          {Array.from({length: 26}, (_, i) => (
            <rect key={i} x={172 + i * 17} y="600" width={2 + (i % 4) * 4} height="52"/>
          ))}
        </g>
        <path d="M172 668 h240" stroke="#4d4a42" strokeWidth="3" opacity="0.4"/>
        <Scuffs x={140} y={310} w={520} h={520} count={24} opacity={0.2}/>
        <Dirt x={136} y={304} w={528} h={528} count={26} opacity={0.24}/>
      </g>
    </g>
  );

  return side === 'back' ? back : front;
}
