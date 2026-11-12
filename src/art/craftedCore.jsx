import React, {useId} from 'react';

/**
 * Base visual dos artefatos do ParaDocx.
 * Materiais, textura, luz e sombra reutilizados por todos os objetos,
 * para que caderno, terminal, garrafa ou crachá pareçam objetos
 * fotografados e não desenhos genéricos.
 */

export function useArtIds() {
  const uid = useId().replaceAll(':', '');
  return {
    grain: uid + 'gr',
    coarse: uid + 'co',
    soft: uid + 'sf',
    glow: uid + 'gl',
    vig: uid + 'vg',
    desk: uid + 'dk',
    key: uid + 'kl',
    leather: uid + 'lt',
    leatherDark: uid + 'ld',
    paper: uid + 'pp',
    paperEdge: uid + 'pe',
    glass: uid + 'gs',
    greenGlass: uid + 'gg',
    plastic: uid + 'pl',
    metal: uid + 'mt',
    metalDark: uid + 'md',
    gold: uid + 'gd',
    ink: uid + 'ik',
    blue: uid + 'bl'
  };
}

export function ArtDefs({ids}) {
  return (
    <defs>
      <filter id={ids.grain} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="11" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0"/>
      </filter>
      <filter id={ids.coarse} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="5" seed="3" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0"/>
      </filter>
      <filter id={ids.soft} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="7" dy="26" stdDeviation="20" floodColor="#000" floodOpacity="0.66"/>
      </filter>
      <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id={ids.vig} cx="50%" cy="40%" r="78%">
        <stop offset="0" stopColor="#000" stopOpacity="0"/>
        <stop offset="0.58" stopColor="#000" stopOpacity="0.2"/>
        <stop offset="1" stopColor="#000" stopOpacity="0.82"/>
      </radialGradient>
      <linearGradient id={ids.desk} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#4a3628"/>
        <stop offset="0.45" stopColor="#33251b"/>
        <stop offset="1" stopColor="#1b130e"/>
      </linearGradient>
      <radialGradient id={ids.key} cx="30%" cy="6%" r="82%">
        <stop offset="0" stopColor="#ffe6b8" stopOpacity="0.18"/>
        <stop offset="0.5" stopColor="#ffe6b8" stopOpacity="0.04"/>
        <stop offset="1" stopColor="#000" stopOpacity="0.34"/>
      </radialGradient>

      {/* couro */}
      <linearGradient id={ids.leather} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#7a4a2e"/>
        <stop offset="0.28" stopColor="#5c3420"/>
        <stop offset="0.62" stopColor="#3d2214"/>
        <stop offset="1" stopColor="#25130c"/>
      </linearGradient>
      <linearGradient id={ids.leatherDark} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b2215"/>
        <stop offset="1" stopColor="#150a06"/>
      </linearGradient>
      {/* papel */}
      <linearGradient id={ids.paper} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#f7f2e4"/>
        <stop offset="0.5" stopColor="#efe8d6"/>
        <stop offset="1" stopColor="#ded4bd"/>
      </linearGradient>
      <linearGradient id={ids.paperEdge} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55"/>
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.05"/>
        <stop offset="1" stopColor="#000" stopOpacity="0.16"/>
      </linearGradient>
      {/* vidro */}
      <linearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e9f3f2" stopOpacity="0.5"/>
        <stop offset="0.25" stopColor="#9fb8b6" stopOpacity="0.16"/>
        <stop offset="0.6" stopColor="#5b6f70" stopOpacity="0.1"/>
        <stop offset="1" stopColor="#26302f" stopOpacity="0.34"/>
      </linearGradient>
      <linearGradient id={ids.greenGlass} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b7e6c9" stopOpacity="0.42"/>
        <stop offset="0.4" stopColor="#2d7a4f" stopOpacity="0.34"/>
        <stop offset="1" stopColor="#0d2c1e" stopOpacity="0.62"/>
      </linearGradient>
      {/* plástico */}
      <linearGradient id={ids.plastic} x1="0.05" y1="0" x2="0.95" y2="1">
        <stop offset="0" stopColor="#e6e0d6"/>
        <stop offset="0.3" stopColor="#c9c1b4"/>
        <stop offset="0.68" stopColor="#9d958a"/>
        <stop offset="1" stopColor="#6f6960"/>
      </linearGradient>
      {/* metal */}
      <linearGradient id={ids.metal} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d9dee2"/>
        <stop offset="0.22" stopColor="#9aa3aa"/>
        <stop offset="0.48" stopColor="#6e767d"/>
        <stop offset="0.72" stopColor="#aab2b8"/>
        <stop offset="1" stopColor="#4d5459"/>
      </linearGradient>
      <linearGradient id={ids.metalDark} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5b6166"/>
        <stop offset="0.5" stopColor="#33383c"/>
        <stop offset="1" stopColor="#1d2124"/>
      </linearGradient>
      {/* dourado */}
      <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f6e3a4"/>
        <stop offset="0.28" stopColor="#d4af52"/>
        <stop offset="0.52" stopColor="#8f6d22"/>
        <stop offset="0.75" stopColor="#e2c56f"/>
        <stop offset="1" stopColor="#6d5018"/>
      </linearGradient>
      {/* tinta */}
      <linearGradient id={ids.ink} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2f3a46"/>
        <stop offset="0.55" stopColor="#1b232c"/>
        <stop offset="1" stopColor="#0d1218"/>
      </linearGradient>
      <linearGradient id={ids.blue} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3d6088"/>
        <stop offset="0.5" stopColor="#27405d"/>
        <stop offset="1" stopColor="#16273c"/>
      </linearGradient>
    </defs>
  );
}

/** Superfície de mesa com veios de madeira. */
export function DeskSurface({ids, tone = 'wood'}) {
  const base = tone === 'metal' ? '#2b2e33' : tone === 'felt' ? '#2d2822' : 'url(#' + ids.desk + ')';
  return (
    <g>
      <rect width="800" height="1132" fill={base}/>
      {tone === 'wood' && (
        <g stroke="#000" strokeOpacity="0.22" fill="none">
          {Array.from({length: 26}, (_, i) => (
            <path key={i}
              d={'M0 ' + (i * 46 + 12) + ' C220 ' + (i * 46 - 8) + ', 520 ' + (i * 46 + 34) + ', 800 ' + (i * 46 + 2)}
              strokeWidth={1 + (i % 3) * 0.9}/>
          ))}
        </g>
      )}
      {tone === 'wood' && (
        <g stroke="#9c7748" strokeOpacity="0.13" fill="none" strokeWidth="8">
          {Array.from({length: 7}, (_, i) => (
            <path key={i}
              d={'M-20 ' + (i * 170 + 60) + ' Q200 ' + (i * 170 + 16) + ', 420 ' + (i * 170 + 84) + ' T820 ' + (i * 170 + 36)}/>
          ))}
        </g>
      )}
      {tone === 'felt' && (
        <g opacity="0.4">
          {Array.from({length: 260}, (_, i) => (
            <circle key={i} cx={(i * 97) % 800} cy={(i * 61) % 1132} r={1 + (i % 3) * 0.7}
              fill="#7b7060" opacity={0.22}/>
          ))}
        </g>
      )}
    </g>
  );
}

/** Grão fotográfico sobreposto. */
export function Grain({ids, opacity = 0.15}) {
  return <rect width="800" height="1132" filter={'url(#' + ids.grain + ')'} opacity={opacity}
    style={{mixBlendMode: 'overlay'}} pointerEvents="none"/>;
}

/** Ruído de superfície grande (couro, papelão, gesso). */
export function SurfaceNoise({ids, opacity = 0.2}) {
  return <rect width="800" height="1132" filter={'url(#' + ids.coarse + ')'} opacity={opacity}
    style={{mixBlendMode: 'soft-light'}} pointerEvents="none"/>;
}

export function Vignette({ids}) {
  return <rect width="800" height="1132" fill={'url(#' + ids.vig + ')'} pointerEvents="none"/>;
}

/** Luz difusa de cima, fonte única de cena. */
export function KeyLight({ids}) {
  return <rect width="800" height="1132" fill={'url(#' + ids.key + ')'} pointerEvents="none"/>;
}

/** Sombra projetada do objeto sobre a mesa. */
export function CastShadow({x, y, rx, ry, opacity = 0.62}) {
  return (
    <g pointerEvents="none">
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#000" opacity={opacity} filter="blur(18px)"/>
      <ellipse cx={x} cy={y} rx={rx * 0.6} ry={ry * 0.55} fill="#000" opacity={opacity * 0.55} filter="blur(9px)"/>
    </g>
  );
}

/** Desgaste genérico: riscos e marcas de uso. */
export function Scuffs({x = 0, y = 0, w = 800, h = 1132, count = 26, color = '#000', opacity = 0.16}) {
  return (
    <g opacity={opacity} pointerEvents="none">
      {Array.from({length: count}, (_, i) => {
        const rx = x + ((i * 137) % Math.max(1, w));
        const ry = y + ((i * 89) % Math.max(1, h));
        const len = 6 + ((i * 31) % 34);
        return <path key={i} d={'M' + rx + ' ' + ry + ' l' + len + ' ' + (len * 0.28)}
          stroke={color} strokeWidth={0.8 + (i % 3) * 0.5} fill="none" strokeLinecap="round"/>;
      })}
    </g>
  );
}

/** Vinco de dobra, com sombra e brilho. */
export function Crease({x1, y1, x2, y2}) {
  return (
    <g pointerEvents="none">
      <path d={'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2} stroke="#000" strokeOpacity="0.2" strokeWidth="3"/>
      <path d={'M' + x1 + ' ' + (y1 + 3) + ' L' + x2 + ' ' + (y2 + 3)} stroke="#fff" strokeOpacity="0.07" strokeWidth="2"/>
    </g>
  );
}

/** Pontos de solda/uso: sujeira acumulada em cantos e frestas. */
export function Dirt({x, y, w, h, count = 18, opacity = 0.3, color = '#000'}) {
  return (
    <g opacity={opacity} pointerEvents="none">
      {Array.from({length: count}, (_, i) => {
        const rx = x + ((i * 173) % Math.max(1, w));
        const ry = y + ((i * 71) % Math.max(1, h));
        return <ellipse key={i} cx={rx} cy={ry} rx={4 + (i % 4) * 3} ry={2 + (i % 3) * 2}
          fill={color} opacity={0.35 + (i % 3) * 0.2}/>;
      })}
    </g>
  );
}

/** Reflexo especular alongado (vidro, plástico, papel lustroso). */
export function Sheen({x, y, w, h, rotate = -20, opacity = 0.3}) {
  return (
    <g pointerEvents="none" opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} fill="#fff"
        transform={'rotate(' + rotate + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')'}/>
    </g>
  );
}
