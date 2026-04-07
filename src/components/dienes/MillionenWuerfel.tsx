/**
 * MillionenWürfel — Stellenwert-Übersicht von 1 bis 1.000.000.
 * Zeigt die Dienes-Block-Progression: Würfel → Stange → Platte → Würfel (wiederholt).
 * Ersetzt das Buchscan-Bild „s20-millionenwuerfel-intro.webp".
 */

// ── Inline-SVG-Blöcke ───────────────────────────────────

/** Kleiner Würfel (Einer) */
function BlockEiner() {
  return (
    <svg width={18} height={18} viewBox="0 0 20 20">
      <rect x="1" y="1" width="18" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" rx="2" />
    </svg>
  );
}

/** Stange (Zehner / Zehntausender) */
function BlockStange({ breite = 80, hoehe = 16, farbe = '#fcd34d' }: { breite?: number; hoehe?: number; farbe?: string }) {
  const felder = 10;
  const fw = breite / felder;
  return (
    <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`}>
      <rect x="0.5" y="0.5" width={breite - 1} height={hoehe - 1} fill={farbe} stroke="#92400e" strokeWidth="1" rx="1.5" />
      {Array.from({ length: felder - 1 }, (_, i) => (
        <line key={i} x1={fw + i * fw} y1="0.5" x2={fw + i * fw} y2={hoehe - 0.5} stroke="#92400e" strokeWidth="0.6" />
      ))}
    </svg>
  );
}

/** Platte (Hunderter / Hunderttausender) */
function BlockPlatte({ size = 60, farbe = '#fbbf24' }: { size?: number; farbe?: string }) {
  const felder = 10;
  const fw = (size - 2) / felder;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x="1" y="1" width={size - 2} height={size - 2} fill={farbe} stroke="#92400e" strokeWidth="1" rx="1.5" />
      {Array.from({ length: felder - 1 }, (_, i) => (
        <line key={`v${i}`} x1={1 + fw + i * fw} y1="1" x2={1 + fw + i * fw} y2={size - 1} stroke="#92400e" strokeWidth="0.4" />
      ))}
      {Array.from({ length: felder - 1 }, (_, i) => (
        <line key={`h${i}`} x1="1" y1={1 + fw + i * fw} x2={size - 1} y2={1 + fw + i * fw} stroke="#92400e" strokeWidth="0.4" />
      ))}
    </svg>
  );
}

/** 3D-Würfel (Tausender / Million) */
function BlockWuerfel({ size = 70, farbe = '#f59e0b', seite = '#d97706', deckel = '#fcd34d' }: {
  size?: number; farbe?: string; seite?: string; deckel?: string;
}) {
  const s = size;
  const face = s * 0.7;
  const d = s * 0.22;
  const felder = 10;
  const fw = face / felder;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {/* Front */}
      <rect x={0} y={d} width={face} height={face} fill={farbe} stroke="#78350f" strokeWidth="1.2" />
      {Array.from({ length: felder - 1 }, (_, i) => (
        <line key={`fv${i}`} x1={fw + i * fw} y1={d} x2={fw + i * fw} y2={d + face} stroke="#78350f" strokeWidth="0.3" />
      ))}
      {Array.from({ length: felder - 1 }, (_, i) => (
        <line key={`fh${i}`} x1={0} y1={d + fw + i * fw} x2={face} y2={d + fw + i * fw} stroke="#78350f" strokeWidth="0.3" />
      ))}
      {/* Deckel */}
      <polygon points={`0,${d} ${d},0 ${face + d},0 ${face},${d}`} fill={deckel} stroke="#78350f" strokeWidth="1.2" />
      {/* Seite */}
      <polygon points={`${face},${d} ${face + d},0 ${face + d},${face} ${face},${d + face}`} fill={seite} stroke="#78350f" strokeWidth="1.2" />
    </svg>
  );
}

// ── Stellenwert-Daten ────────────────────────────────────

interface Stellenwert {
  zahl: string;
  name: string;
  kuerzel: string;
  block: React.ReactNode;
}

const STELLENWERTE: Stellenwert[] = [
  { zahl: '1', name: 'Einer', kuerzel: '1 E', block: <BlockEiner /> },
  { zahl: '10', name: 'Zehner', kuerzel: '1 Z', block: <BlockStange breite={60} hoehe={12} /> },
  { zahl: '100', name: 'Hunderter', kuerzel: '1 H', block: <BlockPlatte size={44} /> },
  { zahl: '1.000', name: 'Tausender', kuerzel: '1 T', block: <BlockWuerfel size={52} /> },
  { zahl: '10.000', name: 'Zehntausender', kuerzel: '1 ZT', block: <BlockStange breite={80} hoehe={16} farbe="#f59e0b" /> },
  { zahl: '100.000', name: 'Hunderttausender', kuerzel: '1 HT', block: <BlockPlatte size={56} farbe="#f59e0b" /> },
  { zahl: '1.000.000', name: 'Million', kuerzel: '1 M', block: <BlockWuerfel size={72} farbe="#ea580c" seite="#c2410c" deckel="#f59e0b" /> },
];

// ── Komponente ───────────────────────────────────────────

export function MillionenWuerfel() {
  return (
    <div className="space-y-1">
      {/* Kleine Stellenwerte: 1–1.000 */}
      <div className="grid grid-cols-4 gap-2">
        {STELLENWERTE.slice(0, 4).map((sw) => (
          <div key={sw.zahl} className="flex flex-col items-center text-center gap-1 py-2">
            <div className="flex items-center justify-center min-h-[56px]">{sw.block}</div>
            <span className="text-xs font-bold text-heading tabular-nums">{sw.zahl}</span>
            <span className="text-[10px] text-muted leading-tight">{sw.name}</span>
            <span className="text-[10px] font-bold text-primary">{sw.kuerzel}</span>
          </div>
        ))}
      </div>

      {/* Pfeil */}
      <div className="text-center text-muted text-lg">× 10 ↓</div>

      {/* Große Stellenwerte: 10.000–1.000.000 */}
      <div className="grid grid-cols-3 gap-2">
        {STELLENWERTE.slice(4).map((sw) => (
          <div key={sw.zahl} className="flex flex-col items-center text-center gap-1 py-2">
            <div className="flex items-center justify-center min-h-[72px]">{sw.block}</div>
            <span className="text-xs font-bold text-heading tabular-nums">{sw.zahl}</span>
            <span className="text-[10px] text-muted leading-tight">{sw.name}</span>
            <span className="text-[10px] font-bold text-primary">{sw.kuerzel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
