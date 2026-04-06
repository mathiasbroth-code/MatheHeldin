import { Card } from '@/components/ui/Card';

export interface ZerlegungsDaten {
  dividend: number;
  divisor: number;
  teile: number[]; // z.B. [40, 8] fuer 48:4
  ergebnisse: number[]; // z.B. [10, 2]
}

/**
 * Berechnet die halbschriftliche Zerlegung eines Dividenden.
 * Strategie: groessten Zehnerwert finden, der durch den Divisor teilbar ist.
 */
function zerlege(dividend: number, divisor: number): ZerlegungsDaten | null {
  if (divisor === 0 || dividend <= 0) return null;
  if (dividend % divisor !== 0) return null;

  // Groessten "runden" Teil finden: floor(dividend / (divisor*10)) * divisor * 10
  const ersteTeil = Math.floor(dividend / (divisor * 10)) * divisor * 10;

  if (ersteTeil <= 0 || ersteTeil >= dividend) {
    // Kein sinnvoller Split moeglich
    return null;
  }

  const rest = dividend - ersteTeil;
  if (rest % divisor !== 0) return null;

  return {
    dividend,
    divisor,
    teile: [ersteTeil, rest],
    ergebnisse: [ersteTeil / divisor, rest / divisor],
  };
}

/**
 * Parst eine Division ("48 : 4") aus dem Aufgabentext.
 * Gibt die Zerlegungsdaten zurueck wenn eine sinnvolle Zerlegung moeglich ist.
 */
export function parseDivisionsDaten(
  stageId: string,
  text: string,
): ZerlegungsDaten | null {
  if (!stageId.includes('halbschriftlich-dividieren')) return null;

  // Erste Division im Text finden: "48 : 4" oder "48:4"
  const match = text.match(/(\d+)\s*:\s*(\d+)/);
  if (!match) return null;

  const dividend = parseInt(match[1], 10);
  const divisor = parseInt(match[2], 10);

  return zerlege(dividend, divisor);
}

/**
 * Visuelle Zerlegung fuer halbschriftliches Dividieren.
 * Zeigt den Dividenden als proportionalen Balken, der in Teile zerfaellt.
 */
export function DivisionsZerlegung({
  dividend,
  divisor,
  teile,
  ergebnisse,
}: ZerlegungsDaten) {
  const pct1 = (teile[0] / dividend) * 100;
  const pct2 = (teile[1] / dividend) * 100;

  return (
    <Card className="py-2 px-3">
      {/* Titel */}
      <p className="text-[10px] font-semibold text-muted text-center mb-2">
        Zerlegung von {dividend} : {divisor}
      </p>

      {/* Gesamtbalken */}
      <div className="relative mb-1">
        <div className="w-full h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{dividend}</span>
        </div>
      </div>

      {/* Zerlegter Balken */}
      <div className="flex gap-1 mb-1">
        <div
          className="h-8 rounded-lg bg-primary flex items-center justify-center"
          style={{ width: `${pct1}%` }}
        >
          <span className="text-sm font-bold text-white">{teile[0]}</span>
        </div>
        <div
          className="h-8 rounded-lg bg-warning flex items-center justify-center"
          style={{ width: `${pct2}%` }}
        >
          <span className="text-sm font-bold text-white">{teile[1]}</span>
        </div>
      </div>

      {/* Teilergebnisse */}
      <div className="flex gap-1">
        <div
          className="text-center"
          style={{ width: `${pct1}%` }}
        >
          <span className="text-[10px] text-primary font-semibold">
            {teile[0]}:{divisor}={ergebnisse[0]}
          </span>
        </div>
        <div
          className="text-center"
          style={{ width: `${pct2}%` }}
        >
          <span className="text-[10px] text-warning font-semibold">
            {teile[1]}:{divisor}={ergebnisse[1]}
          </span>
        </div>
      </div>

      {/* Ergebnis */}
      <p className="text-xs font-bold text-heading text-center mt-1">
        {ergebnisse[0]} + {ergebnisse[1]} = {ergebnisse[0] + ergebnisse[1]}
      </p>
    </Card>
  );
}
