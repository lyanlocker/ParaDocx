import React, {useId} from 'react';

/** Original vector printing plates for ParaDocx handouts.
 * Decorative artwork only. All campaign-specific writing stays in the editable text layers.
 * Shared by the template browser, master editor, and player reader.
 */
const C = {
  ink:'#433526', faded:'#907350', sienna:'#914d36', rust:'#a8573d', gold:'#957741',
  blue:'#325a65', violet:'#614167', olive:'#56614a', paper:'#e6d8b8', cream:'#efe4c7'
};
const G = ({children,x=0,y=0,rotate=0,opacity=1}) => <g transform={'translate('+x+' '+y+') rotate('+rotate+')'} opacity={opacity}>{children}</g>;
const rule=(x,y,w,color=C.ink,opacity=.55)=> <line x1={x} y1={y} x2={x+w} y2={y} stroke={color} strokeWidth="1.5" opacity={opacity}/>;
const Script = ({x,y,children,size=18,color=C.ink,spacing=2,weight=500})=><text x={x} y={y} fontFamily="Georgia,Times New Roman,serif" fontSize={size} letterSpacing={spacing} fontWeight={weight} fill={color}>{children}</text>;
const Mono = ({x,y,children,size=13,color=C.ink})=><text x={x} y={y} fontFamily="Courier New,monospace" fontSize={size} fill={color}>{children}</text>;
const corners=(stroke=C.ink)=><g fill="none" stroke={stroke} strokeWidth="2" opacity=".53"><path d="M28 90 V33 H93 M707 33 H772 V90 M28 1040 V1101 H93 M707 1101 H772 V1040"/><path d="M36 98 V41 H100 M700 41 H764 V98 M36 1034 V1093 H100 M700 1093 H764 V1034"/></g>;
function Stars({x=0,y=0,n=12,color=C.ink}) {return <G x={x} y={y} opacity={.5}><g stroke={color} fill="none" strokeWidth="1.6">{Array.from({length:n},(_,i)=>{const a=i*137.508*Math.PI/180,r=36+((i*27)%75),px= Math.cos(a)*r,py=Math.sin(a)*r;return <g key={i}><circle cx={px} cy={py} r={i%4===0?3:1.2}/>{i%3===0&&<path d={'M'+(px-7)+' '+py+'h14 M'+px+' '+(py-7)+'v14'}/>}</g>})}<circle r="25"/><circle r="17" strokeDasharray="3 7"/><path d="M-21 -21 L21 21 M21 -21 L-21 21" opacity=".3"/></g></G>}
function MoonSeal({x=400,y=180,r=78,color=C.ink}) {return <G x={x} y={y}><g fill="none" stroke={color} strokeWidth="2" opacity=".8"><circle r={r}/><circle r={r-13} strokeDasharray="5 9"/><circle r={r-26}/><path d={'M0 '+(-r-30)+' V'+(r+30)+' M'+(-r-30)+' 0 H'+(r+30)} strokeWidth="1"/><path d={'M'+(-r*.75)+' '+(-r*.75)+'L'+(r*.75)+' '+(r*.75)+'M'+(r*.75)+' '+(-r*.75)+'L'+(-r*.75)+' '+(r*.75)} opacity=".35"/><path d={'M0 '+(-r*.55)+'L'+(r*.56)+' '+(r*.4)+'H'+(-r*.56)+'Z'}/><path d="M-29 4 Q-10 -18 0 0 Q10 18 29 4 Q12 29 0 15 Q-13 29 -29 4Z" fill={color} opacity=".4"/></g><circle r="7" fill={color}/></G>}
function MoonPhases({y=65,color=C.ink}) {return <g transform={'translate(175 '+y+')'} stroke={color} fill="none" opacity=".78"><path d="M0 0 H450" strokeWidth="1"/><g>{[0,1,2,3,4,5,6].map(i=>{const x=48+i*59;return <g key={i}><circle cx={x} cy="0" r="17" strokeWidth="1.6"/>{i===3?<circle cx={x} cy="0" r="13" fill={color} opacity=".42"/>:<path d={'M'+(x-6+i*2)+' -13 Q'+(x+22-i*2)+' 0 '+(x-6+i*2)+' 13'} strokeWidth="1.8"/>}</g>})}</g></g>}
function Compass({x=625,y=730,size=85,color=C.ink}){return <G x={x} y={y}><g stroke={color} fill="none" opacity=".75"><circle r={size} strokeWidth="2"/><circle r={size*.78} strokeDasharray="3 7"/><circle r={size*.3}/><path d={'M0 '+(-size)+'V'+size+' M'+(-size)+' 0 H'+size} strokeWidth="1.2"/><path d={'M0 '+(-size*.75)+' L'+(size*.12)+' 0 L0 '+(size*.75)+' L'+(-size*.12)+' 0 Z'} fill={color} opacity=".4"/><path d={'M'+(-size*.67)+' '+(-size*.67)+' L'+(size*.67)+' '+(size*.67)+'M'+(size*.67)+' '+(-size*.67)+' L'+(-size*.67)+' '+(size*.67)} strokeWidth="1"/></g><Script x={-6} y={-size-13} size={14} color={color}>N</Script></G>}
function Wax({x=100,y=960,r=43,color=C.rust}){return <G x={x} y={y}><circle r={r+7} fill={color} opacity=".15"/><circle r={r} fill={color} opacity=".78" stroke="#552b1f" strokeWidth="3"/><circle r={r-8} fill="none" stroke="#f0c08e" strokeWidth="3" opacity=".7"/><path d="M0 -20 L6 -6 L20 0 L6 7 L0 20 L-6 7 L-20 0 L-6 -7Z" stroke="#edc28f" fill="none" strokeWidth="2"/></G>}
function Stain({x=600,y=370,r=100,color='#a27751'}){return <G x={x} y={y} opacity={.22}><circle r={r} stroke={color} strokeWidth="18" fill="none" strokeDasharray={'110 6 130 34 70 25'}/><circle r={r-9} stroke={color} strokeWidth="3" fill="none"/>{Array.from({length:11},(_,i)=>{const t=(i*39)*Math.PI/180;return <circle key={i} cx={Math.cos(t)*(r+10)} cy={Math.sin(t)*(r+7)} r={1+(i%3)*2} fill={color}/>})}</G>}
function Torn({color='#a87651'}){return <g fill="none" stroke={color} strokeWidth="3" opacity=".35"><path d="M0 24 l23 6 24 -11 25 8 26 -4 25 9 22 -7 30 6 25 -8 29 8 31 -6 23 6 23 -7 29 5 37 -8 38 10 36 -6 33 6 26 -7 35 4 29 -6 29 6 31 -7 21 4 26 -7 38 7 25 -6 29 6 18 -7"/><path d="M0 1109 l26 -6 31 8 31 -11 32 6 32 -6 30 7 36 -6 36 9 39 -7 44 7 27 -7 43 7 34 -7 34 8 36 -6 33 6 36 -8 36 8 33 -6 31 5 33 -6 35 7 25 -5"/></g>}
function Flourish({x=400,y=190,color=C.ink}){return <G x={x} y={y} opacity={.75}><g fill="none" stroke={color} strokeWidth="2"><path d="M-244 0 H-40 Q-12 -32 0 -12 Q12 -32 40 0 H244 M-247 9 H-74 Q-44 18 -17 1 Q0 -8 17 1 Q44 18 74 9 H247"/><path d="M-35 -6 Q-53 -40 -79 -34 Q-89 -22 -70 -16 Q-58 -16 -63 -28 M35 -6 Q53 -40 79 -34 Q89 -22 70 -16 Q58 -16 63 -28"/><circle r="7"/><circle cx="-257" r="3"/><circle cx="257" r="3"/></g></G>}
function Raven({x=110,y=150,scale=1,color=C.ink}){return <g transform={'translate('+x+' '+y+') scale('+scale+')'} stroke={color} strokeWidth="2" fill="none" opacity=".83"><path d="M-43 8 Q-23 -30 10 -20 Q40 -44 48 -19 Q69 -11 79 4 L45 7 Q47 55 19 80 Q-9 104 -35 75 Q-59 35 -43 8Z" fill={color} opacity=".16"/><path d="M12 -18 Q-21 2 -8 40 Q4 62 31 57 M-24 54 Q2 47 31 57 M-31 70 Q-3 62 32 63 M44 -9 L86 1 L46 9"/><circle cx="36" cy="-15" r="3" fill={color}/><path d="M7 73 L-4 110 M29 72 L22 105 M-5 103 L-24 111 M22 102 L39 112"/></g>}
function Botany({x=120,y=700,scale=1,color=C.ink}){return <G x={x} y={y} opacity={.58}><g transform={'scale('+scale+')'} stroke={color} fill="none" strokeWidth="2"><path d="M0 156 Q10 60 -8 -80 M0 60 Q-70 -18 -79 -67 M9 24 Q65 -19 64 -80 M-1 100 Q-54 57 -75 37"/><path d="M-11 -66 Q-68 -72 -61 -106 Q-30 -122 -11 -66 M-11 -66 Q-7 -132 16 -127 Q32 -100 -11 -66 M-68 -61 Q-107 -74 -105 -104 Q-72 -107 -68 -61 M63 -78 Q39 -98 54 -132 Q90 -112 63 -78 M61 -82 Q96 -100 111 -82 Q106 -49 61 -82 M-73 37 Q-107 13 -100 -7 Q-65 -6 -73 37 M-73 37 Q-129 32 -121 65 Q-88 79 -73 37"/></g></G>}
function EngravedBuilding({x=220,y=540,scale=1,color=C.ink}){return <G x={x} y={y} opacity={.66}><g transform={'scale('+scale+')'} stroke={color} fill="none" strokeWidth="2"><path d="M-150 160 L-120 -20 L-90 -90 L-16 -140 L60 -90 L89 -20 L115 160Z M-168 160H136 M-142 120H113 M-129 40H97 M-105 -25H76"/><path d="M-14 -140V-172 H10V-140 M-57 -111H40 M-41 -110V-145H27V-111 M-15 -145V-185H8V-145 M-75 90V120 H-25V90Z M42 90V120H90V90Z M-15 120V160H42V120Z M-72 -50V-17H-28V-50Z M16 -50V-17H62V-50Z"/><path d="M-165 160 Q-194 120 -208 147 M122 160 Q159 127 180 153 M-107 -20l18 -70 M67 -75l22 55 M-140 40l23 18 M91 37l20 15"/></g></G>}
function Lighthouse({x=408,y=550,scale=1,color=C.ink}){return <G x={x} y={y}><g transform={'scale('+scale+')'} stroke={color} strokeWidth="2" fill="none" opacity=".77"><path d="M-65 180 L-43 -130 H42 L66 180Z M-73 180 H74 M-62 -110 H62 M-58 55 H58 M-50 -80H50 M-57 -130 H57 V-158 H-57Z M-48 -157 L-33 -198 H32 L47 -157Z M-17 -198V-223H17V-198 M0 -223V-246"/><path d="M-40 -157V-193 M-20 -157V-197 M0 -157V-200 M20 -157V-197 M40 -157V-193 M-32 -190V-158 M-15 -90V-46H16V-90Z M-13 -4V33H16V-4Z M-12 94V139H19V94Z"/><path d="M-75 -130H75 M-80 -160H80 M-92 -146H92 M-30 -223H30"/><path d="M-63 180 Q-122 166 -139 188 M69 180 Q111 153 135 188"/></g></G>}
function Microscope({x=620,y=470,scale=1,color=C.blue}){return <G x={x} y={y} opacity={.83}><g transform={'scale('+scale+')'} stroke={color} fill="none" strokeWidth="6" strokeLinecap="round"><path d="M-70 170H98 M-49 155 Q-34 91 11 71 Q58 25 24 -46 L-15 -96 M-67 -113L-36 -155L11 -110L-15 -72Z M-74 143Q-112 79 -54 53 M-17 66 H76 M-15 82 H65"/><path d="M14 -47L54 -70L72 -23L32 0Z M-44 53H99 M-32 37V64 M57 51V70" strokeWidth="4"/><circle cx="16" cy="22" r="15"/><circle cx="16" cy="22" r="6"/><path d="M-80 159V170H107 M-69 156Q-99 139 -88 100" strokeWidth="3"/></g></G>}
function Fingerprint({x=445,y=400,color=C.violet}){return <G x={x} y={y}><g fill="none" stroke={color} strokeWidth="2" opacity=".6">{Array.from({length:13},(_,i)=>{const rx=14+i*6,ry=19+i*8;return <path key={i} d={'M'+(-rx)+' '+(ry*.9)+' C'+(-rx*1.8)+' '+(-ry*.68)+' '+(-rx*.9)+' '+(-ry)+' 0 '+(-ry)+' C'+(rx*.9)+' '+(-ry)+' '+(rx*1.8)+' '+(-ry*.68)+' '+rx+' '+(ry*.9)}/>})}<path d="M0 -18 Q-30 -50 -31 -10 Q-15 15 0 0 Q14 -14 12 24"/></g></G>}
function Tarot({x=640,y=650,color=C.ink}){return <G x={x} y={y}><g stroke={color} fill="none" opacity=".72" strokeWidth="3"><rect x="-105" y="-160" width="210" height="320" rx="5"/><rect x="-93" y="-147" width="186" height="294"/><circle r="70"/><path d="M0 -115 V115 M-95 0H95 M-65 -65L65 65M65 -65L-65 65 M0 -83L75 40H-75Z"/><circle r="16" fill={color} opacity=".27"/></g></G>}
function Ship({x=410,y=735,color=C.ink}){return <G x={x} y={y} opacity={.65}><g stroke={color} strokeWidth="3" fill="none"><path d="M-200 105 Q-170 170 160 130 L230 70 H-210Z M-180 70H170 M-70 65V-140 M78 65V-92 M-70 -135 L55 35H-70Z M77 -85L153 18H77Z M-70 -145H-84"/><path d="M-250 165 Q-203 147 -164 165 Q-125 181 -83 165 Q-43 148 0 164 Q50 181 100 164 Q148 144 195 163 Q228 174 260 159"/></g></G>}
function EnvelopeFold({color=C.ink}){return <g stroke={color} strokeWidth="3" fill="none" opacity=".5"><path d="M65 350 L400 680 L735 350 M65 350 L65 890 H735 V350 M65 890 L286 680 M735 890 L520 680"/><path d="M75 355 L400 666 L725 355"/></g>}
function RecordForm({x=62,y=330,w=672,h=275,color=C.ink,rows=6}){return <G x={x} y={y} opacity={.48}><g stroke={color} fill="none" strokeWidth="2"><rect width={w} height={h}/><line x1={w*.31} x2={w*.31} y1="0" y2={h}/>{Array.from({length:rows-1},(_,i)=><line key={i} x1="0" y1={(i+1)*h/rows} x2={w} y2={(i+1)*h/rows}/>)}</g></G>}
function ClipPhoto({x=84,y=430,w=330,h=245,color=C.ink}){return <g><rect x={x+5} y={y+7} width={w} height={h} fill="#c6ad86" opacity=".6"/><rect x={x} y={y} width={w} height={h} fill="#e5d6b5" stroke={color} strokeWidth="4" opacity=".95"/><path d={'M'+(x+12)+' '+(y+12)+'h35v35 M'+(x+w-12)+' '+(y+12)+'h-35v35 M'+(x+12)+' '+(y+h-12)+'h35v-35 M'+(x+w-12)+' '+(y+h-12)+'h-35v-35'} stroke={color} strokeWidth="3" fill="none"/><path d={'M'+(x+w/2-25)+' '+(y+h/2)+'h50 M'+(x+w/2)+' '+(y+h/2-25)+'v50'} stroke={color} strokeWidth="2" opacity=".48"/><rect x={x+w*.29} y={y-14} width={w*.42} height="31" transform={'rotate(4 '+(x+w/2)+' '+y+')'} fill="#b19c75" opacity=".57"/></g>}
function LineField({x=80,y=400,w=630,rows=8,color=C.ink}){return <g opacity=".36" stroke={color} strokeWidth="1.5">{Array.from({length:rows},(_,i)=> <line key={i} x1={x} y1={y+i*37} x2={x+w} y2={y+i*37}/>)}</g>}
function Barcode({x=97,y=425,w=340,color=C.ink}){return <G x={x} y={y}><g fill={color} opacity=".64">{Array.from({length:48},(_,i)=>{const step=w/48;return <rect key={i} x={i*step} width={i%6===0?step*.9:step*((i*17)%3===0?.7:.42)} height={30+((i*11)%3)*12}/>})}</g></G>}
function Crosswords({x=95,y=440,size=36,color=C.ink}){return <G x={x} y={y}><g fill="none" stroke={color} strokeWidth="2" opacity=".6">{Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=><rect key={i+'-'+j} x={i*size} y={j*size} width={size} height={size} fill={(i*7+j*13)%5===0?color:'none'} fillOpacity=".3"/>))}</g></G>}
function RailStamp({x=400,y=955,color=C.ink,main='CLASSIFICADO',sub='PARADOCX • ARQUIVO'}){return <G x={x} y={y}><g opacity=".42" stroke={color} fill="none" strokeWidth="2"><rect x="-232" y="-42" width="464" height="88" rx="4"/><rect x="-222" y="-34" width="444" height="72"/></g><Script x={-171} y={-1} size={29} color={color} spacing={4}>{main}</Script><Mono x={-155} y={24} size={12} color={color}>{sub}</Mono></G>}
const paperColors={letter:'#ead6b1',report:'#e0d1b5',news:'#ded0ac',occult:'#d8b892',blueprint:'#d5c9a9',medical:'#e0dcc6',photo:'#ede7d6',passport:'#d3d3b4'};
const schemes={
  letter:{ink:C.ink,accent:C.sienna},report:{ink:C.ink,accent:C.rust},news:{ink:'#372f25',accent:C.sienna},occult:{ink:'#4b2b29',accent:C.rust},
  blueprint:{ink:'#41524e',accent:C.blue},lab:{ink:'#44334c',accent:C.violet},medical:{ink:'#42514b',accent:C.blue},
  photo:{ink:C.ink,accent:C.gold},diary:{ink:C.ink,accent:C.olive}
};
const heroThemes={letter:'letter',report:'report',dossier:'report',news:'news',occult:'occult',research:'lab',lab:'lab',blueprint:'blueprint',map:'blueprint',photo:'photo'};
const customTheme={
  telegram:'telegram',diary:'diary',postcard:'postcard',missing:'poster',wanted:'poster',medical:'medical',autopsy:'medical',certificate:'certificate',passport:'passport',library:'library',ticket:'ticket',boarding:'ticket',ship:'ship',invoice:'invoice',receipt:'receipt',envelope:'envelope',classified:'news',radio:'telegram',death:'certificate',evidence:'report',menu:'menu',invitation:'invitation',cryptogram:'occult',obituary:'news',blank:'blank'
};

export default function HandoutArt({templateId='letter',side='front',preview=false}) {
  const uid=useId().replaceAll(':','');
  const kind=heroThemes[templateId]||customTheme[templateId]||'letter';
  const front=side!=='back';
  const sc=schemes[kind]||schemes.letter;
  const ink=sc.ink, accent=sc.accent;
  const p=paperColors[kind]||'#e7d7b6';
  const isBlank=templateId==='blank';
  return <svg className={'handout-art handout-'+kind+' '+(preview?'handout-art-preview':'')} viewBox="0 0 800 1132" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={uid+'paper'} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff5db" offset="0"/><stop stopColor={p} offset=".48"/><stop stopColor="#b9a07f" offset="1"/></linearGradient>
      <radialGradient id={uid+'fade'}><stop offset="0" stopColor="#fff2d3" stopOpacity=".08"/><stop offset=".65" stopColor="#aa7751" stopOpacity=".1"/><stop offset="1" stopColor="#4e301f" stopOpacity=".25"/></radialGradient>
      <pattern id={uid+'fleck'} width="61" height="73" patternUnits="userSpaceOnUse"><circle cx="5" cy="27" r="1.4" fill={ink} opacity=".13"/><circle cx="54" cy="12" r=".9" fill={accent} opacity=".2"/><circle cx="32" cy="59" r="1.7" fill={ink} opacity=".08"/><path d="M0 10 L12 9 M44 48L58 47" stroke={ink} strokeWidth=".7" opacity=".08"/></pattern>
      <pattern id={uid+'lines'} width="32" height="33" patternUnits="userSpaceOnUse"><path d="M0 32.5H32" stroke={ink} opacity=".12" strokeWidth="1"/></pattern>
      <pattern id={uid+'grid'} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke={ink} strokeWidth="1" opacity=".28"/></pattern>
    </defs>
    <rect width="800" height="1132" fill={'url(#'+uid+'paper)'}/>
    <rect width="800" height="1132" fill={'url(#'+uid+'fleck)'}/>
    <rect width="800" height="1132" fill={'url(#'+uid+'fade)'}/>
    <path d="M405 17V1116" stroke="#906f51" opacity=".13" strokeWidth="4"/>
    <path d="M12 561 H785" stroke="#906f51" opacity=".09" strokeWidth="3"/>
    {Torn({color:ink})}
    {!isBlank&&corners(ink)}
    {front && kind==='letter' && <g>
      <Flourish x={400} y={105} color={ink}/><MoonSeal x={400} y={160} r={32} color={ink}/>
      <Stain x={657} y={630} r={115}/><Stars x={682} y={325} n={15} color={accent}/>
      <Raven x={113} y={938} scale={.72} color={ink}/><EngravedBuilding x={653} y={960} scale={.62} color={ink}/><Wax x={113} y={1034} r={31} color={accent}/>
      <G x={0} y={0} opacity={.45}><path d="M65 327 Q75 314 83 329 Q90 344 97 324 M73 349 Q88 335 101 346" fill="none" stroke={ink} strokeWidth="2"/></G>
      <LineField x={100} y={427} w={588} rows={9} color={ink}/>
    </g>}
    {front && kind==='report' && <g>
      <path d="M57 151H739 M57 164H739 M57 245H739" fill="none" stroke={ink} strokeWidth="3" opacity=".7"/>
      <MoonSeal x={690} y={110} r={42} color={accent}/><Raven x={113} y={116} scale={.6} color={ink}/>
      <G x={0} y={0}><RecordForm x={64} y={286} w={674} h={128} rows={3} color={ink}/></G>
      <ClipPhoto x={74} y={507} w={250} h={248} color={ink}/><LineField x={377} y={526} w={330} rows={7} color={ink}/>
      <Stain x={612} y={590} r={73}/><G x={664} y={755} rotate={-11}><rect x="-86" y="-28" width="172" height="54" stroke={accent} fill="none" strokeWidth="4"/><Script x={-73} y={7} color={accent} size={24} spacing={1}>RESERVADO</Script></G>
      <RecordForm x={64} y={834} w={674} h={155} rows={4} color={ink}/><Wax x={112} y={1034} r={42} color={accent}/>
    </g>}
    {front && kind==='news' && <g>
      <MoonPhases y={67} color={ink}/>{rule(55,203,692,ink,.7)}{rule(55,216,692,ink,.6)}{rule(55,320,692,ink,.55)}
      <Raven x={94} y={133} scale={.54} color={ink}/><EngravedBuilding x={701} y={139} scale={.37} color={ink}/>
      <ClipPhoto x={202} y={480} w={343} h={247} color={ink}/><EngravedBuilding x={382} y={578} scale={.45} color={ink}/>
      <G opacity={.65}><rect x="55" y="393" width="125" height="532" fill="none" stroke={ink} strokeWidth="2"/><rect x="571" y="393" width="174" height="535" fill="none" stroke={ink} strokeWidth="2"/><LineField x={591} y={472} w={130} rows={10} color={ink}/><LineField x={69} y={479} w={97} rows={11} color={ink}/></G>
      <Stain x={644} y={920} r={89}/>{rule(56,965,689,ink,.58)}<Flourish x={400} y={1035} color={ink}/>
    </g>}
    {front && kind==='occult' && <g>
      <MoonPhases y={86} color={ink}/><MoonSeal x={400} y={260} r={109} color={accent}/>
      <Raven x={140} y={196} scale={.55} color={ink}/><Stars x={665} y={227} n={19} color={accent}/>
      <path d="M175 403 H622 V969H175Z M191 416H605V954H191" fill="none" stroke={ink} strokeWidth="3" opacity=".72"/>
      <LineField x={213} y={494} w={366} rows={12} color={ink}/><Botany x={102} y={695} scale={.64} color={ink}/><G x={673} y={695}><Botany scale={.6} color={ink}/></G>
      <Wax x={105} y={1003} r={44} color={accent}/><MoonSeal x={650} y={1011} r={47} color={ink}/>
    </g>}
    {front && kind==='lab' && <g>
      <rect x="0" width="800" height="206" fill={accent} opacity=".86"/><path d="M52 206H748 M52 221H748" stroke={ink} strokeWidth="4"/>
      <Microscope x={91} y={132} scale={.31} color="#f0e0b5"/><MoonSeal x={684} y={109} r={38} color="#f0e0b5"/>
      <RecordForm x={57} y={260} w={684} h={125} rows={3} color={ink}/><Barcode x={78} y={397} w={220} color={ink}/>
      <ClipPhoto x={58} y={514} w={285} h={257} color={accent}/><Fingerprint x={476} y={632} color={accent}/><Microscope x={665} y={659} scale={.43} color={ink}/>
      <rect x="54" y="824" width="692" height="201" fill={'url(#'+uid+'grid)'} stroke={accent} strokeWidth="3" opacity=".65"/>
      <LineField x={65} y={853} w={664} rows={5} color={ink}/>
      <Stain x={704} y={985} r={56} color={accent}/>
    </g>}
    {front && kind==='blueprint' && <g>
      <rect x="36" y="145" width="728" height="923" fill={'url(#'+uid+'grid)'} opacity=".5"/>
      <path d="M51 198H750 M51 770 H750 M51 947 H750" stroke={ink} strokeWidth="3" opacity=".7"/>
      <Lighthouse x={341} y={560} scale={1.06} color={ink}/><Lighthouse x={620} y={550} scale={.78} color={ink}/>
      <Compass x={667} y={223} size={55} color={accent}/><G x={137} y={766} opacity={.7}><MoonSeal x={0} y={0} r={78} color={ink}/></G>
      <G x={366} y={830}><MoonSeal x={0} y={0} r={70} color={ink}/></G><G x={600} y={832}><MoonSeal x={0} y={0} r={65} color={ink}/></G>
      <RecordForm x={61} y={967} w={675} h={106} rows={3} color={ink}/>
    </g>}
    {front && kind==='photo' && <g><rect x="54" y="75" width="691" height="780" fill="#cfc9b8" stroke={ink} strokeWidth="3" opacity=".96"/>
      <rect x="77" y="102" width="645" height="707" fill="#364340" opacity=".82"/><circle cx="566" cy="285" r="118" fill="#d7d4b1" opacity=".35"/>
      <EngravedBuilding x={370} y={497} scale={1.4} color="#c9c5b2"/><Raven x={582} y={343} scale={1.2} color="#d2d1b8"/><Stars x={150} y={226} color="#e0d9b5"/>
      <G x={95} y={869}><rect width="603" height="170" fill="#f0e8d9" opacity=".8"/></G><Wax x={681} y={992} r={39} color={accent}/></g>}
    {front && kind==='diary' && <g><rect x="0" y="0" width="800" height="1132" fill={'url(#'+uid+'lines)'} opacity=".9"/>
      <path d="M112 46V1086" stroke={accent} strokeWidth="3" opacity=".5"/><G x={72} y={100}>{Array.from({length:13},(_,i)=><circle key={i} cx="0" cy={i*70} r="10" fill="#fff4d9" stroke={ink} strokeWidth="2" opacity=".7"/>)}</G>
      <Botany x={682} y={902} scale={.9} color={ink}/><Stain x={630} y={368} r={68}/>
    </g>}
    {front && kind==='telegram' && <g><path d="M46 180H755 M46 202H755 M46 890H755" stroke={ink} strokeWidth="4" opacity=".72"/>
      <rect x="61" y="255" width="677" height="560" fill={'url(#'+uid+'lines)'} opacity=".8" stroke={ink} strokeWidth="3"/>
      <G x={645} y={980} rotate={-12}><rect x="-112" y="-45" width="225" height="92" stroke={accent} strokeWidth="6" fill="none"/><Script x={-92} y={12} size={29} color={accent}>URGENTE</Script></G>
      <Barcode x={80} y={922} w={245} color={ink}/>
    </g>}
    {front && kind==='poster' && <g><path d="M58 190H745 M58 210H745 M58 985H745" stroke={ink} strokeWidth="6"/>
      <ClipPhoto x={195} y={350} w={405} h={360} color={ink}/><Raven x={400} y={535} scale={.94} color={ink}/>
      <Wax x={118} y={902} r={54} color={accent}/><Stain x={635} y={840} r={69}/>
    </g>}
    {front && kind==='medical' && <g><path d="M50 185H748 M50 208H748" stroke={ink} strokeWidth="5" opacity=".7"/><G x={106} y={111}><path d="M-29 -5H-6V-30H11V-5H34V14H11V40H-6V14H-29Z" fill={accent} opacity=".74"/></G>
      <RecordForm x={62} y={290} w={674} h={540} rows={9} color={ink}/><Mono x={85} y={908} color={ink}>REGISTRO CLÍNICO / OBSERVAÇÕES</Mono><LineField x={84} y={939} w={625} rows={4} color={ink}/><Stain x={667} y={850} r={52} color={accent}/>
    </g>}
    {front && kind==='ticket' && <g><rect x="53" y="263" width="694" height="577" stroke={ink} strokeWidth="5" fill="none"/><path d="M543 263V840 M557 263V840" stroke={ink} strokeDasharray="12 14" strokeWidth="4" opacity=".6"/>
      <RailStamp x={400} y={960} color={ink} main="VALIDADO" sub="USO EXCLUSIVO DO PORTADOR"/><Compass x={646} y={525} size={70} color={ink}/></g>}
    {front && kind==='receipt' && <g><path d="M102 155 H700 M102 185 H700 M102 918 H700" stroke={ink} strokeWidth="2"/><LineField x={125} y={352} w={550} rows={12} color={ink}/><Barcode x={205} y={1000} w={392} color={ink}/></g>}
    {front && kind==='envelope' && <g><EnvelopeFold color={ink}/><G x={662} y={235} rotate={11}><rect x="-68" y="-68" width="137" height="136" stroke={ink} strokeDasharray="9 6" strokeWidth="4" fill="none"/><Raven x={0} y={0} scale={.38} color={ink}/></G><Wax x={409} y={681} r={55} color={accent}/></g>}
    {front && kind==='certificate' && <g><Flourish x={400} y={160} color={ink}/><Raven x={110} y={147} scale={.38} color={ink}/><Raven x={690} y={147} scale={.38} color={ink}/><MoonSeal x={404} y={607} r={151} color={ink}/><Stain x={647} y={872} r={70}/><Wax x={410} y={943} r={60} color={accent}/></g>}
    {front && kind==='passport' && <g><rect x="55" y="204" width="689" height="658" fill="none" stroke={ink} strokeWidth="4"/><ClipPhoto x={80} y={350} w={264} h={352} color={ink}/><MoonSeal x={610} y={502} r={110} color={accent}/><Barcode x={183} y={894} w={433} color={ink}/></g>}
    {front && kind==='map' && <g><path d="M110 363 Q215 308 330 372 Q450 442 557 323 Q630 250 724 357 M113 500 Q213 457 348 524 Q489 597 720 439 M109 652 Q261 633 347 711 Q472 800 706 677" stroke={ink} strokeWidth="4" strokeDasharray="12 14" opacity=".43" fill="none"/><Compass x={651} y={201} color={ink}/><MoonSeal x={353} y={555} r={86} color={accent}/><G x={0} y={0}><path d="M213 882L251 824L305 850L349 793L398 816" stroke={accent} strokeWidth="6" fill="none"/></G></g>}
    {front && kind==='ship' && <g><Ship x={420} y={620} color={ink}/><MoonSeal x={674} y={206} r={60} color={ink}/><Stain x={196} y={870} r={78}/><LineField x={93} y={889} w={600} rows={5} color={ink}/></g>}
    {front && kind==='invitation' && <g><Flourish x={400} y={227} color={ink}/><MoonSeal x={401} y={420} r={76} color={accent}/><Flourish x={400} y={915} color={ink}/><Wax x={403} y={1002} r={48} color={accent}/></g>}
    {front && kind==='menu' && <g><Flourish x={400} y={215} color={ink}/><LineField x={160} y={432} w={490} rows={10} color={ink}/><Botany x={110} y={879} scale={.55} color={accent}/><Botany x={687} y={860} scale={.55} color={accent}/></g>}
    {front && kind==='library' && <g><RecordForm x={78} y={301} w={646} h={537} rows={9} color={ink}/><Raven x={672} y={212} scale={.37} color={ink}/><RailStamp x={400} y={980} color={ink} main="DEVOLUÇÃO" sub="CONTROLE DO ARQUIVO"/></g>}
    {front && kind==='invoice' && <g><RecordForm x={74} y={310} w={660} h={496} rows={8} color={ink}/><RailStamp x={422} y={967} color={accent} main="QUITADO" sub="ARQUIVO COMERCIAL"/></g>}
    {front && kind==='coded' && <g><MoonSeal x={395} y={387} r={100} color={ink}/><Stars x={190} y={730} n={25} color={accent}/><Tarot x={590} y={713} color={ink}/><LineField x={90} y={889} w={610} rows={5} color={ink}/></g>}
    {front && kind==='evidence' && <g><ClipPhoto x={107} y={360} w={490} h={420} color={ink}/><RailStamp x={400} y={982} color={accent} main="EVIDÊNCIA" sub="CUSTÓDIA CONTROLADA"/></g>}
    {front && kind==='postcard' && <g><G x={0} y={0}><path d="M77 570H720" stroke={ink} strokeWidth="2" strokeDasharray="10 11" opacity=".35"/></G><EngravedBuilding x={412} y={450} scale={1.05} color={ink}/><G x={640} y={960} rotate={-12}><rect x="-76" y="-55" width="154" height="110" stroke={ink} fill="none" strokeWidth="4"/><Script x={-48} y={9} color={ink} size={26}>POSTAL</Script></G></g>}
    {front && kind==='classified' && <g><Crosswords x={110} y={421} size={48} color={ink}/><LineField x={115} y={864} w={572} rows={5} color={ink}/></g>}
    {front && kind==='blank' && <g><Stain x={641} y={930} r={100} color={ink}/></g>}
    {!front && !isBlank && <g>
      <Stain x={600} y={270} r={88} color={accent}/><Flourish x={400} y={126} color={ink}/><LineField x={100} y={400} w={600} rows={12} color={ink}/>
      <Wax x={673} y={985} r={47} color={accent}/><MoonSeal x={125} y={955} r={55} color={ink}/>
      <Mono x={84} y={1058} size={13} color={ink}>ANOTAÇÕES // VERSO</Mono>
    </g>}
    <rect width="800" height="1132" fill="none" stroke={ink} strokeWidth="14" opacity=".18"/>
    <rect x="17" y="19" width="766" height="1095" fill="none" stroke={ink} strokeWidth="2" opacity=".34"/>
  </svg>;
}