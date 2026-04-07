/**
 * UngleichungenMerkkasten — Nachbau des Fredo-Merkkastens „Ungleichungen" (S. 47).
 * Roter Rahmen, Regeltext, zwei Waagen (3·70 > 3·60 und 3·60 < 3·70).
 * Ersetzt das Buchscan-Bild „s47-regel-ungleichungen.webp".
 */

// ── Waage-SVG ───────────────────────────────────────────

interface WaageProps {
  links: string;
  rechts: string;
  /** 'links' = linke Seite schwerer (hängt tiefer) */
  schwerer: 'links' | 'rechts';
}

function Waage({ links, rechts, schwerer }: WaageProps) {
  const w = 150;
  const h = 90;
  // Achse
  const mx = w / 2;
  const achseY = 20;
  const balkenLen = 56;
  const neigung = 8; // px Höhenunterschied
  const linksY = schwerer === 'links' ? achseY + neigung : achseY - neigung;
  const rechtsY = schwerer === 'rechts' ? achseY + neigung : achseY - neigung;

  // Schalen
  const schalenW = 48;
  const schalenH = 16;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Fuß */}
      <line x1={mx} y1={achseY} x2={mx} y2={h - 4} stroke="#334155" strokeWidth={3} />
      <ellipse cx={mx} cy={h - 3} rx={14} ry={4} fill="#334155" />

      {/* Drehpunkt */}
      <circle cx={mx} cy={achseY} r={3} fill="#334155" />

      {/* Balken (geneigt) */}
      <line x1={mx - balkenLen} y1={linksY} x2={mx + balkenLen} y2={rechtsY} stroke="#475569" strokeWidth={2.5} strokeLinecap="round" />

      {/* Aufhängungen */}
      <line x1={mx - balkenLen} y1={linksY} x2={mx - balkenLen - 6} y2={linksY + 18} stroke="#64748b" strokeWidth={1} />
      <line x1={mx - balkenLen} y1={linksY} x2={mx - balkenLen + 6} y2={linksY + 18} stroke="#64748b" strokeWidth={1} />

      <line x1={mx + balkenLen} y1={rechtsY} x2={mx + balkenLen - 6} y2={rechtsY + 18} stroke="#64748b" strokeWidth={1} />
      <line x1={mx + balkenLen} y1={rechtsY} x2={mx + balkenLen + 6} y2={rechtsY + 18} stroke="#64748b" strokeWidth={1} />

      {/* Linke Schale */}
      <ellipse cx={mx - balkenLen} cy={linksY + 20} rx={schalenW / 2} ry={schalenH / 2} fill="#d9f99d" stroke="#65a30d" strokeWidth={1} />
      <text x={mx - balkenLen} y={linksY + 24} textAnchor="middle" fontSize={11} fontWeight="bold" fontStyle="italic" fill="#1e293b">
        {links}
      </text>

      {/* Rechte Schale */}
      <ellipse cx={mx + balkenLen} cy={rechtsY + 20} rx={schalenW / 2} ry={schalenH / 2} fill="#d9f99d" stroke="#65a30d" strokeWidth={1} />
      <text x={mx + balkenLen} y={rechtsY + 24} textAnchor="middle" fontSize={11} fontWeight="bold" fontStyle="italic" fill="#1e293b">
        {rechts}
      </text>
    </svg>
  );
}

// ── Hauptkomponente ──────────────────────────────────────

export function UngleichungenMerkkasten() {
  return (
    <div className="border-2 border-red-500 rounded-lg overflow-hidden">
      {/* Regeltext */}
      <div className="p-4 pb-2">
        <p className="text-sm text-heading leading-relaxed">
          Bei Ungleichungen ist der Wert auf beiden Seiten unterschiedlich groß.
        </p>
        <p className="text-sm text-heading leading-relaxed mt-1">
          Wir verwenden die Zeichen{' '}
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-800 text-sm font-bold">&gt;</span>
          {' '}und{' '}
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-800 text-sm font-bold">&lt;</span>
          .
        </p>
      </div>

      {/* Waagen */}
      <div className="flex justify-center gap-2 px-3 pb-3">
        <Waage links="3 · 70" rechts="3 · 60" schwerer="links" />
        <Waage links="3 · 60" rechts="3 · 70" schwerer="rechts" />
      </div>
    </div>
  );
}
