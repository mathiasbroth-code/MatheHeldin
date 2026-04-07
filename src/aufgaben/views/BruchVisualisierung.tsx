import { Card } from '@/components/ui/Card';

export interface BruchDaten {
  form: 'rechteck' | 'kreis';
  nenner: number;
  zaehler: number;
}

/**
 * Extrahiert Nenner und Zaehler aus dem Teilaufgabe-Text.
 * Patterns:
 *   "4 gleiche Teile, davon 1 gefärbt"
 *   "Kreis in 4 Teile, 3 gefärbt"
 *   "Pizza wird an 4 Kinder verteilt"
 */
function extractBruch(text: string): { nenner: number; zaehler: number } | null {
  // Pattern 1: "N gleiche Teile, davon Z gefärbt" oder "N gleiche Teile … Z Teil(e) … gefärbt"
  const rechteckMatch = text.match(/(\d+)\s*gleiche?\s*Teile?[^.]*?(\d+)\s*(?:Teil(?:e)?|davon\s+\d+)?\s*gefärbt/i);
  if (rechteckMatch) {
    return { nenner: parseInt(rechteckMatch[1], 10), zaehler: parseInt(rechteckMatch[2], 10) };
  }

  // Pattern 1b: "N gleiche Teile, davon Z gefärbt" (kompaktere Variante)
  const davonMatch = text.match(/(\d+)\s*gleiche?\s*Teile?.*?davon\s+(\d+)\s*gefärbt/i);
  if (davonMatch) {
    return { nenner: parseInt(davonMatch[1], 10), zaehler: parseInt(davonMatch[2], 10) };
  }

  // Pattern 2: "Kreis in N Teile, Z gefärbt"
  const kreisMatch = text.match(/(?:Kreis|kreis)\s+in\s+(\d+)\s+Teile?.*?(\d+)\s*(?:Teile?\s*(?:sind?\s*)?)?gefärbt/i);
  if (kreisMatch) {
    return { nenner: parseInt(kreisMatch[1], 10), zaehler: parseInt(kreisMatch[2], 10) };
  }

  // Pattern 3: "Pizza wird an N Kinder verteilt" (zaehler immer 1)
  const pizzaMatch = text.match(/Pizza\s+wird\s+an\s+(\d+)\s+Kinder/i);
  if (pizzaMatch) {
    return { nenner: parseInt(pizzaMatch[1], 10), zaehler: 1 };
  }

  return null;
}

/**
 * Erkennt ob eine Aufgabe eine Bruch-Visualisierung braucht und extrahiert die Daten.
 * Nutzt teilFrage fuer pro-Teilaufgabe-Updates, faellt auf aufgabenstellung zurueck.
 */
export function parseBruchDaten(
  stageId: string,
  aufgabenstellung: string,
  teilFrage?: string,
): BruchDaten | null {
  if (stageId !== 'einfache-brueche') return null;

  // Form aus dem Gesamttext bestimmen
  let form: 'rechteck' | 'kreis';
  if (/Rechteck/i.test(aufgabenstellung)) {
    form = 'rechteck';
  } else if (/Kreis|Pizza/i.test(aufgabenstellung)) {
    form = 'kreis';
  } else {
    return null;
  }

  // Zaehler/Nenner aus der aktiven Teilfrage extrahieren
  const source = teilFrage || aufgabenstellung;
  const bruch = extractBruch(source);
  if (!bruch || bruch.nenner <= 0 || bruch.zaehler < 0 || bruch.zaehler > bruch.nenner) {
    return null;
  }

  return { form, ...bruch };
}

// --- SVG Helpers ---

function sectorPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle >= Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

const FILL_COLORED = '#0d9488';
const FILL_EMPTY = '#f0fdfa';
const STROKE = '#0d9488';

function BruchKreis({ nenner, zaehler }: { nenner: number; zaehler: number }) {
  const cx = 100;
  const cy = 100;
  const r = 85;
  const angleStep = (2 * Math.PI) / nenner;

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
      {Array.from({ length: nenner }).map((_, i) => {
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = (i + 1) * angleStep - Math.PI / 2;
        return (
          <path
            key={i}
            d={sectorPath(cx, cy, r, startAngle, endAngle)}
            fill={i < zaehler ? FILL_COLORED : FILL_EMPTY}
            stroke={STROKE}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

function BruchRechteck({ nenner, zaehler }: { nenner: number; zaehler: number }) {
  const cols = nenner <= 4 ? nenner : Math.ceil(nenner / 2);
  const rows = nenner <= 4 ? 1 : 2;
  const gap = 3;
  const svgW = 200;
  const svgH = rows === 1 ? 60 : 120;
  const cellW = (svgW - gap * (cols + 1)) / cols;
  const cellH = (svgH - gap * (rows + 1)) / rows;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[220px] mx-auto">
      {Array.from({ length: nenner }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gap + col * (cellW + gap);
        const y = gap + row * (cellH + gap);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellW}
            height={cellH}
            rx={4}
            fill={i < zaehler ? FILL_COLORED : FILL_EMPTY}
            stroke={STROKE}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

/**
 * Zeigt einen Bruch als gefaerbtes Rechteck oder Kreisdiagramm.
 * Wird im AufgabeWrapper pro Teilaufgabe aktualisiert.
 */
export function BruchVisualisierung({ form, nenner, zaehler }: BruchDaten) {
  return (
    <Card className="py-2 px-3">
      <p className="text-[10px] font-semibold text-muted text-center mb-2">
        Welcher Anteil ist gefärbt?
      </p>
      {form === 'kreis' ? (
        <BruchKreis nenner={nenner} zaehler={zaehler} />
      ) : (
        <BruchRechteck nenner={nenner} zaehler={zaehler} />
      )}
    </Card>
  );
}
