/**
 * Rechenketten-Visualisierung: Zeigt eine Rechenkette als Pfeildiagramm.
 * Beispiel: 120 → +180 → [300] → :5 → [60]
 *
 * Gelöste Schritte zeigen das Ergebnis, offene zeigen ▢.
 * Der aktuelle Schritt wird hervorgehoben.
 */

interface RechenketteVizProps {
  /** Komplette Kette als String: "120 → + 180 → 300 → : 5 → 60" */
  kette: string;
  /** Wie viele Ergebnis-Felder bereits gelöst (0 = keins) */
  geloestBis: number;
  /** Index des aktuell aktiven Ergebnis-Feldes (0-basiert) */
  aktiverSchritt: number;
}

interface KettenElement {
  typ: 'zahl' | 'operation';
  text: string;
  istErgebnis: boolean; // true = muss vom Kind ausgefüllt werden
  index: number; // Index unter den Ergebnis-Feldern
}

function parseKette(kette: string): KettenElement[] {
  const teile = kette.split('→').map((s) => s.trim());
  const elemente: KettenElement[] = [];
  let ergebnisIdx = 0;

  for (let i = 0; i < teile.length; i++) {
    const teil = teile[i];
    const istOperation = /^[+\-·:×÷]/.test(teil);

    if (istOperation) {
      // Operation: "+ 180"
      elemente.push({ typ: 'operation', text: teil, istErgebnis: false, index: -1 });
    } else if (i === 0) {
      // Startzahl
      elemente.push({ typ: 'zahl', text: teil, istErgebnis: false, index: -1 });
    } else {
      // Ergebnis-Zahl (muss gelöst werden)
      elemente.push({ typ: 'zahl', text: teil, istErgebnis: true, index: ergebnisIdx++ });
    }
  }

  return elemente;
}

export function RechenketteViz({ kette, geloestBis, aktiverSchritt }: RechenketteVizProps) {
  const elemente = parseKette(kette);

  return (
    <div className="flex flex-wrap items-center gap-1.5 justify-center py-2">
      {elemente.map((el, i) => {
        if (el.typ === 'operation') {
          return (
            <div key={i} className="flex items-center gap-1">
              <span className="text-muted text-lg">→</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-sm font-bold text-heading tabular-nums">
                {el.text}
              </span>
              <span className="text-muted text-lg">→</span>
            </div>
          );
        }

        // Zahl (Start oder Ergebnis)
        if (!el.istErgebnis) {
          // Startzahl — immer sichtbar
          return (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-sm font-bold text-primary tabular-nums">
              {el.text}
            </span>
          );
        }

        // Ergebnis-Feld
        const istGeloest = el.index < geloestBis;
        const istAktiv = el.index === aktiverSchritt;

        return (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold tabular-nums min-w-[48px] text-center transition-all ${
              istGeloest
                ? 'bg-success/10 text-success border-2 border-success/30'
                : istAktiv
                  ? 'bg-primary/10 text-primary border-2 border-primary animate-pulse'
                  : 'bg-gray-100 text-muted border-2 border-border'
            }`}
          >
            {istGeloest ? el.text : '▢'}
          </span>
        );
      })}
    </div>
  );
}
