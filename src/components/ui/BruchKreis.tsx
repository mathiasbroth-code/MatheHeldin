/**
 * BruchKreis — SVG-Visualisierung eines Bruchs als Kreisdiagramm.
 * Zeigt einen Kreis, der in `nenner` gleiche Teile geteilt ist,
 * von denen `zaehler` eingefärbt sind.
 */

interface BruchKreisProps {
  zaehler: number;
  nenner: number;
  /** Durchmesser in px (default: 56) */
  size?: number;
  /** Farbe der eingefärbten Sektoren */
  farbe?: string;
}

/** Erzeugt einen SVG-Pfad für einen Kreissektor. */
function sektorPfad(cx: number, cy: number, r: number, startWinkel: number, endWinkel: number): string {
  const start = (startWinkel - 90) * (Math.PI / 180);
  const end = (endWinkel - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = endWinkel - startWinkel > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
}

export function BruchKreis({ zaehler, nenner, size = 56, farbe = '#f87171' }: BruchKreisProps) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const winkelProTeil = 360 / nenner;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${zaehler}/${nenner}`}>
      {/* Hintergrund-Kreis */}
      <circle cx={cx} cy={cy} r={r} fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1.5} />

      {/* Eingefärbte Sektoren */}
      {Array.from({ length: zaehler }, (_, i) => (
        <path
          key={i}
          d={sektorPfad(cx, cy, r, i * winkelProTeil, (i + 1) * winkelProTeil)}
          fill={farbe}
          stroke="#fff"
          strokeWidth={1}
        />
      ))}

      {/* Trennlinien für alle Teile */}
      {Array.from({ length: nenner }, (_, i) => {
        const winkel = (i * winkelProTeil - 90) * (Math.PI / 180);
        return (
          <line
            key={`l${i}`}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(winkel)}
            y2={cy + r * Math.sin(winkel)}
            stroke="#d1d5db"
            strokeWidth={1}
          />
        );
      })}

      {/* Rand */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#9ca3af" strokeWidth={1.5} />
    </svg>
  );
}

// ── Bruch-Rechteck (wie im Buch: Balken mit Anteil) ─────

interface BruchRechteckProps {
  zaehler: number;
  nenner: number;
  breite?: number;
  hoehe?: number;
  farbe?: string;
}

/** Rechteck-Bruch-Darstellung wie im Fredo-Buch: Balken in Teile geteilt, Anteil eingefärbt. */
function BruchRechteck({ zaehler, nenner, breite = 100, hoehe = 40, farbe = '#f87171' }: BruchRechteckProps) {
  const teilBreite = (breite - 2) / nenner;
  return (
    <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`}>
      {/* Hintergrund */}
      <rect x="1" y="1" width={breite - 2} height={hoehe - 2} fill="white" stroke="#1e293b" strokeWidth={1.5} rx={2} />
      {/* Eingefärbte Teile */}
      {Array.from({ length: zaehler }, (_, i) => (
        <rect key={i} x={1 + i * teilBreite} y="1" width={teilBreite} height={hoehe - 2} fill={farbe} />
      ))}
      {/* Trennlinien */}
      {Array.from({ length: nenner - 1 }, (_, i) => (
        <line
          key={`l${i}`}
          x1={1 + (i + 1) * teilBreite}
          y1="1"
          x2={1 + (i + 1) * teilBreite}
          y2={hoehe - 1}
          stroke="#1e293b"
          strokeWidth={1}
        />
      ))}
      {/* Rand nochmal drüber */}
      <rect x="1" y="1" width={breite - 2} height={hoehe - 2} fill="none" stroke="#1e293b" strokeWidth={1.5} rx={2} />
    </svg>
  );
}

// ── Bruch-Merkkasten 1: Brüche mit Rechteck-Visualisierung ──

/**
 * BruchMerkkasten — Nachbau des Fredo-Merkkastens S. 92 (rot umrandet).
 * Zeigt: ein Ganzes, 1/2 (1 von 2), 1/4 (1 von 4) mit Rechteck-Balken.
 */
export function BruchMerkkasten() {
  return (
    <div className="space-y-4">
      {/* Merkkasten 1: Brüche erkennen (rot umrandet im Buch) */}
      <div className="border-2 border-red-400 rounded-lg p-4 bg-white space-y-4">
        {/* ein Ganzes */}
        <div className="flex items-center gap-4">
          <BruchRechteck zaehler={1} nenner={1} breite={80} hoehe={36} />
          <span className="text-base font-bold text-heading">ein Ganzes</span>
        </div>

        {/* 1/2 */}
        <div className="flex items-center gap-4">
          <BruchRechteck zaehler={1} nenner={2} breite={80} hoehe={36} />
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-heading tabular-nums leading-none">
              <sup className="text-lg">1</sup>
              <span className="mx-0.5">/</span>
              <sub className="text-lg">2</sub>
            </span>
          </div>
        </div>
        <p className="text-sm text-heading -mt-2 ml-[96px]">
          <span className="text-red-500 font-bold">1</span> von <span className="font-bold">2</span>
          <span className="ml-4 font-bold">ein Halbes</span>
        </p>

        {/* 1/4 */}
        <div className="flex items-center gap-4">
          <BruchRechteck zaehler={1} nenner={4} breite={80} hoehe={36} />
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-heading tabular-nums leading-none">
              <sup className="text-lg">1</sup>
              <span className="mx-0.5">/</span>
              <sub className="text-lg">4</sub>
            </span>
          </div>
        </div>
        <p className="text-sm text-heading -mt-2 ml-[96px]">
          <span className="text-red-500 font-bold">1</span> von <span className="font-bold">4</span>
          <span className="ml-4 font-bold">ein Viertel</span>
        </p>
      </div>

      {/* Merkkasten 2: Begriffe (grau umrandet im Buch) */}
      <div className="border-2 border-gray-400 rounded-lg p-4 bg-white space-y-3">
        {/* das Ganze / der Anteil */}
        <div className="flex items-start gap-4">
          <div className="space-y-1">
            <p className="text-sm">
              das <span className="text-blue-600 font-bold">Ganze</span>
            </p>
            <p className="text-sm">
              der <span className="text-red-500 font-bold">Anteil</span>
            </p>
          </div>
          <div className="shrink-0">
            <svg width={44} height={44} viewBox="0 0 44 44">
              <rect x="2" y="2" width="40" height="40" fill="white" stroke="#2563eb" strokeWidth={2} rx={2} />
              <rect x="2" y="22" width="40" height="20" fill="#f87171" stroke="#2563eb" strokeWidth={2} rx={0} />
            </svg>
          </div>
        </div>

        {/* der Bruch / der Bruchstrich */}
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm">der <span className="font-bold">Bruch</span></p>
            <p className="text-sm">der <span className="font-bold">Bruchstrich</span></p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-muted">→</span>
            <span className="text-2xl font-bold text-heading tabular-nums leading-none">
              <sup className="text-lg">1</sup>
              <span className="mx-0.5">/</span>
              <sub className="text-lg">2</sub>
            </span>
          </div>
        </div>

        {/* Bruch-Namen */}
        <div className="space-y-0.5 pt-1 border-t border-gray-200">
          <p className="text-sm font-bold">ein Halbes</p>
          <p className="text-sm font-bold">ein Viertel</p>
          <p className="text-sm font-bold">ein Achtel</p>
        </div>
      </div>
    </div>
  );
}

// ── Pizza-Bruchkreise (für die Pizza-Aufgabe) ───────────

interface BruchItem {
  zaehler: number;
  nenner: number;
}

const BRUCH_NAMEN: Record<string, string> = {
  '1/2': 'ein Halbes',
  '1/4': 'ein Viertel',
  '2/4': 'zwei Viertel',
  '3/4': 'drei Viertel',
  '4/4': 'vier Viertel',
  '1/8': 'ein Achtel',
  '1/3': 'ein Drittel',
  '2/3': 'zwei Drittel',
};

/**
 * PizzaBruchKreise — Kreisdiagramm-Übersicht für Pizza-Aufgaben.
 * Zeigt 4 Kreise: 1/4, 2/4, 3/4, 4/4.
 */
export function PizzaBruchKreise({ items }: { items?: BruchItem[] }) {
  const brueche = items ?? [
    { zaehler: 1, nenner: 4 },
    { zaehler: 3, nenner: 4 },
    { zaehler: 2, nenner: 4 },
    { zaehler: 4, nenner: 4 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 py-2">
      {brueche.map((b) => {
        const key = `${b.zaehler}/${b.nenner}`;
        const name = BRUCH_NAMEN[key];
        return (
          <div key={key} className="flex items-center gap-2">
            <BruchKreis zaehler={b.zaehler} nenner={b.nenner} size={48} />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-heading tabular-nums">
                <sup>{b.zaehler}</sup>⁄<sub>{b.nenner}</sub>
              </span>
              {name && <span className="text-xs text-muted">{name}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
