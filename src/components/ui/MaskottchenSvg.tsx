/** Renders any of the 5 mascots as inline SVG with dynamic colors and emotions. */

export type MaskottchenTier = 'fuchs' | 'eule' | 'katze' | 'hase' | 'drache';
export type MaskottchenFarbe = 'teal' | 'rose' | 'violet' | 'sky' | 'amber' | 'emerald';
export type MaskottchenEmotion = 'default' | 'happy' | 'thinking' | 'encouraging';

interface Palette {
  dark: string;
  main: string;
  light: string;
  face: string;
  star: string;
}

const PALETTES: Record<MaskottchenFarbe, Palette> = {
  teal:    { dark: '#0d9488', main: '#14b8a6', light: '#5eead4', face: '#99f6e4', star: '#fbbf24' },
  rose:    { dark: '#e11d48', main: '#fb7185', light: '#fda4af', face: '#ffe4e6', star: '#fbbf24' },
  violet:  { dark: '#7c3aed', main: '#a78bfa', light: '#c4b5fd', face: '#ede9fe', star: '#fbbf24' },
  sky:     { dark: '#0284c7', main: '#38bdf8', light: '#7dd3fc', face: '#e0f2fe', star: '#fbbf24' },
  amber:   { dark: '#d97706', main: '#fbbf24', light: '#fcd34d', face: '#fef3c7', star: '#a78bfa' },
  emerald: { dark: '#059669', main: '#34d399', light: '#6ee7b7', face: '#d1fae5', star: '#fbbf24' },
};

interface Props {
  tier: MaskottchenTier;
  farbe?: MaskottchenFarbe;
  emotion?: MaskottchenEmotion;
  size?: number;
  className?: string;
}

export function MaskottchenSvg({
  tier,
  farbe = 'teal',
  emotion = 'default',
  size = 120,
  className = '',
}: Props) {
  const p = PALETTES[farbe];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {tier === 'fuchs' && <Fuchs p={p} emotion={emotion} />}
      {tier === 'eule' && <Eule p={p} emotion={emotion} />}
      {tier === 'katze' && <Katze p={p} emotion={emotion} />}
      {tier === 'hase' && <Hase p={p} emotion={emotion} />}
      {tier === 'drache' && <Drache p={p} emotion={emotion} />}
    </svg>
  );
}

/* ── Shared parts ── */

function Stern({ fill }: { fill: string }) {
  return (
    <polygon
      points="60,42 62.5,48 69,48 63.5,52 65.5,58 60,54 54.5,58 56.5,52 51,48 57.5,48"
      fill={fill}
      opacity={0.9}
    />
  );
}

function HappyExtras() {
  return (
    <>
      <circle cx="34" cy="78" r="6" fill="#f0abfc" opacity={0.3} />
      <circle cx="86" cy="78" r="6" fill="#f0abfc" opacity={0.3} />
      <polygon points="16,22 17.5,26 21,26 18,28.5 19,32 16,30 13,32 14,28.5 11,26 14.5,26" fill="#fbbf24" opacity={0.7} />
      <circle cx="104" cy="28" r="2.5" fill="#5eead4" opacity={0.6} />
    </>
  );
}

function ThinkingBubbles() {
  return (
    <>
      <circle cx="105" cy="30" r="8" fill="#e2e8f0" opacity={0.7} />
      <circle cx="96" cy="42" r="4.5" fill="#e2e8f0" opacity={0.5} />
      <circle cx="92" cy="50" r="2.5" fill="#e2e8f0" opacity={0.4} />
    </>
  );
}

function Eyes({ emotion, eyeR = 6.5, lx = 42, rx = 78, ly = 65, ry = 65 }: {
  emotion: MaskottchenEmotion;
  eyeR?: number;
  lx?: number; rx?: number;
  ly?: number; ry?: number;
}) {
  if (emotion === 'happy') {
    return (
      <>
        <path d={`M${lx - 7},${ly} Q${lx},${ly - 8} ${lx + 7},${ly}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <path d={`M${rx - 7},${ry} Q${rx},${ry - 8} ${rx + 7},${ry}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }
  if (emotion === 'encouraging') {
    return (
      <>
        <path d={`M${lx - 7},${ly} Q${lx},${ly - 6} ${lx + 7},${ly}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <circle cx={rx} cy={ry} r={eyeR} fill="#0f172a" />
        <circle cx={rx + 2.5} cy={ry - 2.5} r={eyeR * 0.38} fill="#ffffff" />
      </>
    );
  }
  if (emotion === 'thinking') {
    return (
      <>
        <circle cx={lx} cy={ly} r={eyeR} fill="#0f172a" />
        <circle cx={lx + 2.5} cy={ly - 2.5} r={eyeR * 0.38} fill="#ffffff" />
        <circle cx={rx} cy={ry - 3} r={eyeR} fill="#0f172a" />
        <circle cx={rx + 2} cy={ry - 5.5} r={eyeR * 0.38} fill="#ffffff" />
        <path d={`M${rx - 8},${ry - 12} Q${rx},${ry - 17} ${rx + 8},${ry - 13}`} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }
  // default
  return (
    <>
      <circle cx={lx} cy={ly} r={eyeR} fill="#0f172a" />
      <circle cx={rx} cy={ry} r={eyeR} fill="#0f172a" />
      <circle cx={lx + 2.5} cy={ly - 2.5} r={eyeR * 0.38} fill="#ffffff" />
      <circle cx={rx + 2.5} cy={ry - 2.5} r={eyeR * 0.38} fill="#ffffff" />
    </>
  );
}

function Mouth({ emotion, y = 86, width = 24 }: { emotion: MaskottchenEmotion; y?: number; width?: number }) {
  const cx = 60;
  const half = width / 2;
  if (emotion === 'happy') {
    return <path d={`M${cx - half},${y - 2} Q${cx},${y + 10} ${cx + half},${y - 2}`} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />;
  }
  if (emotion === 'thinking') {
    return <path d={`M${cx - 5},${y + 2} Q${cx + 3},${y} ${cx + 8},${y + 3}`} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />;
  }
  // default + encouraging
  return <path d={`M${cx - half},${y} Q${cx},${y + 10} ${cx + half},${y}`} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />;
}

/* ── Fuchs ── */

function Fuchs({ p, emotion }: { p: Palette; emotion: MaskottchenEmotion }) {
  return (
    <>
      <polygon points="18,52 38,12 58,52" fill={p.dark} />
      <polygon points="25,49 38,20 51,49" fill={p.light} />
      <polygon points="62,52 82,12 102,52" fill={p.dark} />
      <polygon points="69,49 82,20 95,49" fill={p.light} />
      <circle cx={60} cy={72} r={44} fill={p.main} />
      <ellipse cx={60} cy={82} rx={28} ry={24} fill={p.face} />
      <Eyes emotion={emotion} />
      <ellipse cx={60} cy={78} rx={5} ry={3.5} fill="#0f172a" />
      <Mouth emotion={emotion} />
      <Stern fill={p.star} />
      {emotion === 'happy' && <HappyExtras />}
      {emotion === 'thinking' && <ThinkingBubbles />}
      {emotion === 'encouraging' && <circle cx="34" cy="78" r="6" fill="#f0abfc" opacity={0.3} />}
    </>
  );
}

/* ── Eule ── */

function Eule({ p, emotion }: { p: Palette; emotion: MaskottchenEmotion }) {
  return (
    <>
      <polygon points="26,44 18,14 38,36" fill={p.dark} />
      <polygon points="29,42 22,20 36,36" fill={p.light} />
      <polygon points="94,44 102,14 82,36" fill={p.dark} />
      <polygon points="91,42 98,20 84,36" fill={p.light} />
      <ellipse cx={60} cy={74} rx={42} ry={44} fill={p.main} />
      <ellipse cx={60} cy={84} rx={26} ry={28} fill={p.face} />
      <circle cx={42} cy={65} r={14} fill={p.face} stroke={p.dark} strokeWidth={1.5} />
      <circle cx={78} cy={65} r={14} fill={p.face} stroke={p.dark} strokeWidth={1.5} />
      <Eyes emotion={emotion} />
      <polygon points="54,76 60,84 66,76" fill="#f59e0b" stroke="#d97706" strokeWidth={1} />
      <path d="M18,72 Q12,85 20,100" fill="none" stroke={p.dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M102,72 Q108,85 100,100" fill="none" stroke={p.dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M46,114 L42,118 M46,114 L46,119 M46,114 L50,118" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />
      <path d="M74,114 L70,118 M74,114 L74,119 M74,114 L78,118" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />
      <Stern fill={p.star} />
      {emotion === 'happy' && <HappyExtras />}
      {emotion === 'thinking' && <ThinkingBubbles />}
      {emotion === 'encouraging' && <circle cx="28" cy="78" r="6" fill="#f0abfc" opacity={0.25} />}
    </>
  );
}

/* ── Katze ── */

function Katze({ p, emotion }: { p: Palette; emotion: MaskottchenEmotion }) {
  const whiskers = (
    <>
      <line x1="20" y1="74" x2="36" y2="78" stroke="#0f172a" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="18" y1="80" x2="35" y2="82" stroke="#0f172a" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="84" y1="78" x2="100" y2="74" stroke="#0f172a" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="85" y1="82" x2="102" y2="80" stroke="#0f172a" strokeWidth={1.2} strokeLinecap="round" />
    </>
  );

  const catEye = (cx: number, cy: number) => (
    <>
      <ellipse cx={cx} cy={cy} rx={7} ry={8} fill="#0f172a" />
      <ellipse cx={cx} cy={cy} rx={2.5} ry={6} fill="#10b981" />
      <ellipse cx={cx} cy={cy} rx={1} ry={5.5} fill="#0f172a" />
      <circle cx={cx + 2.5} cy={cy - 3} r={2} fill="#ffffff" />
    </>
  );

  return (
    <>
      <polygon points="22,52 30,8 48,48" fill={p.dark} />
      <polygon points="28,48 30,16 44,46" fill={p.light} />
      <polygon points="72,48 90,8 98,52" fill={p.dark} />
      <polygon points="76,46 90,16 92,48" fill={p.light} />
      <ellipse cx={60} cy={72} rx={40} ry={42} fill={p.main} />
      <ellipse cx={60} cy={80} rx={28} ry={24} fill={p.face} />
      {emotion === 'default' && <>{catEye(42, 65)}{catEye(78, 65)}</>}
      {emotion === 'happy' && (
        <>
          <path d="M35,65 Q42,57 49,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
          <path d="M71,65 Q78,57 85,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {emotion === 'thinking' && <>{catEye(42, 65)}{catEye(78, 62)}<path d="M70,50 Q78,45 86,49" fill="none" stroke="#0f172a" strokeWidth={2.5} strokeLinecap="round" /></>}
      {emotion === 'encouraging' && (
        <>
          <path d="M35,65 Q42,59 49,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
          {catEye(78, 65)}
        </>
      )}
      <polygon points="57,77 60,80 63,77" fill={p.dark} />
      {emotion === 'thinking' ? (
        <path d="M55,88 Q63,86 68,89" fill="none" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <>
          <line x1="60" y1="80" x2="60" y2="85" stroke="#0f172a" strokeWidth={1.5} strokeLinecap="round" />
          <path d={`M52,87 Q60,${emotion === 'happy' ? '95' : '83'} 68,87`} fill="none" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {whiskers}
      <Stern fill={p.star} />
      {emotion === 'happy' && <HappyExtras />}
      {emotion === 'thinking' && <ThinkingBubbles />}
      {emotion === 'encouraging' && <circle cx="30" cy="78" r="6" fill="#f0abfc" opacity={0.3} />}
    </>
  );
}

/* ── Hase ── */

function Hase({ p, emotion }: { p: Palette; emotion: MaskottchenEmotion }) {
  return (
    <>
      <ellipse cx={38} cy={24} rx={10} ry={28} fill={p.main} />
      <ellipse cx={38} cy={24} rx={6} ry={24} fill={p.light} />
      <ellipse cx={78} cy={20} rx={10} ry={28} fill={p.main} transform="rotate(8, 78, 20)" />
      <ellipse cx={78} cy={20} rx={6} ry={24} fill={p.light} transform="rotate(8, 78, 20)" />
      <circle cx={60} cy={74} r={42} fill={p.main} />
      <circle cx={30} cy={78} r={14} fill={p.light} />
      <circle cx={90} cy={78} r={14} fill={p.light} />
      <ellipse cx={60} cy={80} rx={24} ry={22} fill={p.face} />
      <Eyes emotion={emotion} eyeR={7.5} />
      <ellipse cx={60} cy={78} rx={4} ry={3} fill="#f9a8d4" />
      {emotion === 'thinking' ? (
        <path d="M55,88 Q63,86 68,89" fill="none" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <>
          <line x1="60" y1="81" x2="60" y2="86" stroke="#0f172a" strokeWidth={1.5} strokeLinecap="round" />
          <path d={`M53,88 Q60,${emotion === 'happy' ? '96' : '84'} 67,88`} fill="none" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      <rect x="56" y="86" width="3.5" height="5" rx="1.5" fill="white" stroke="#cbd5e1" strokeWidth={0.5} />
      <rect x="60.5" y="86" width="3.5" height="5" rx="1.5" fill="white" stroke="#cbd5e1" strokeWidth={0.5} />
      <Stern fill={p.star} />
      {emotion === 'happy' && <><circle cx="30" cy="82" r="6" fill="#f0abfc" opacity={0.25} /><circle cx="90" cy="82" r="6" fill="#f0abfc" opacity={0.25} /><polygon points="16,22 17.5,26 21,26 18,28.5 19,32 16,30 13,32 14,28.5 11,26 14.5,26" fill="#fbbf24" opacity={0.7} /><circle cx="104" cy="28" r="2.5" fill="#5eead4" opacity={0.6} /></>}
      {emotion === 'thinking' && <ThinkingBubbles />}
      {emotion === 'encouraging' && <circle cx="30" cy="82" r="6" fill="#f0abfc" opacity={0.25} />}
    </>
  );
}

/* ── Drache ── */

function Drache({ p, emotion }: { p: Palette; emotion: MaskottchenEmotion }) {
  const spike = (pts: string) => <polygon points={pts} fill={p.dark} />;
  const innerSpike = (pts: string) => <polygon points={pts} fill={p.light} />;

  const dragonEye = (cx: number, cy: number) => (
    <>
      <ellipse cx={cx} cy={cy} rx={7} ry={6.5} fill="#0f172a" />
      <ellipse cx={cx} cy={cy} rx={3} ry={5.5} fill="#fbbf24" />
      <ellipse cx={cx} cy={cy} rx={1.2} ry={5} fill="#0f172a" />
      <circle cx={cx + 2.5} cy={cy - 2.5} r={2} fill="#ffffff" />
    </>
  );

  return (
    <>
      {spike("30,46 22,18 40,40")}{spike("50,38 44,12 56,34")}{spike("70,34 76,12 82,38")}{spike("90,40 98,18 92,46")}
      {innerSpike("33,44 26,24 38,40")}{innerSpike("52,37 47,18 56,34")}{innerSpike("72,34 76,18 80,37")}{innerSpike("88,40 95,24 90,44")}
      <ellipse cx={60} cy={74} rx={42} ry={40} fill={p.main} />
      <ellipse cx={60} cy={86} rx={22} ry={16} fill={p.face} />
      {emotion === 'default' && <>{dragonEye(42, 65)}{dragonEye(78, 65)}</>}
      {emotion === 'happy' && (
        <>
          <path d="M35,65 Q42,57 49,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
          <path d="M71,65 Q78,57 85,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {emotion === 'thinking' && <>{dragonEye(42, 65)}{dragonEye(78, 62)}<path d="M70,52 Q78,47 86,51" fill="none" stroke="#0f172a" strokeWidth={2.5} strokeLinecap="round" /></>}
      {emotion === 'encouraging' && (
        <>
          <path d="M35,65 Q42,59 49,65" fill="none" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
          {dragonEye(78, 65)}
        </>
      )}
      <circle cx={52} cy={82} r={2.5} fill={p.dark} />
      <circle cx={68} cy={82} r={2.5} fill={p.dark} />
      <Mouth emotion={emotion} y={92} />
      <polygon points="70,92 73,97 76,92" fill="white" stroke="#cbd5e1" strokeWidth={0.5} />
      <path d={`M16,68 Q4,56 8,44 Q14,52 18,60`} fill={p.light} stroke={p.main} strokeWidth={1.5} />
      <path d={`M104,68 Q116,56 112,44 Q106,52 102,60`} fill={p.light} stroke={p.main} strokeWidth={1.5} />
      <Stern fill={p.star} />
      {emotion === 'happy' && (
        <>
          <circle cx="30" cy="82" r="6" fill="#f0abfc" opacity={0.2} />
          <circle cx="90" cy="82" r="6" fill="#f0abfc" opacity={0.2} />
          <polygon points="16,22 17.5,26 21,26 18,28.5 19,32 16,30 13,32 14,28.5 11,26 14.5,26" fill="#fbbf24" opacity={0.7} />
          <path d="M58,104 Q56,96 60,92 Q64,96 62,104" fill="#f59e0b" opacity={0.6} />
        </>
      )}
      {emotion === 'thinking' && <ThinkingBubbles />}
      {emotion === 'encouraging' && <circle cx="30" cy="82" r="6" fill="#f0abfc" opacity={0.2} />}
    </>
  );
}
