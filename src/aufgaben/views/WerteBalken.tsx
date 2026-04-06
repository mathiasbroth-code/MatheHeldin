import { Card } from '@/components/ui/Card';

export interface WerteBalkenDaten {
  werte: number[];
  einheit: string;
  mitteIdx: number | null; // Index des Medians (null wenn gerade Anzahl)
}

/**
 * Erkennt eine sortierte Zahlenreihe mit Einheit im Aufgabentext.
 * Pattern: "129 cm, 137 cm, 140 cm, 142 cm, 152 cm"
 * Gibt null zurueck wenn keine Reihe mit min. 3 Werten erkannt wird.
 */
export function parseWerteBalken(text: string): WerteBalkenDaten | null {
  // Suche nach einer Komma-getrennten Zahlenreihe mit gleicher Einheit
  const match = text.match(
    /(\d[\d.,]*)\s*(cm|kg|g|km|m|mm|ml|l|min|h|s)(?:\s*,\s*(\d[\d.,]*)\s*\2)+/,
  );
  if (!match) return null;

  const einheit = match[2];
  // Alle "Zahl Einheit" Paare extrahieren
  const pattern = new RegExp(`(\\d[\\d.,]*)\\s*${einheit}`, 'g');
  const werte: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    const val = parseFloat(m[1].replace('.', '').replace(',', '.'));
    if (!isNaN(val)) werte.push(val);
  }

  if (werte.length < 3) return null;

  // Median berechnen (nur bei ungerader Anzahl)
  const mitteIdx = werte.length % 2 === 1 ? Math.floor(werte.length / 2) : null;

  return { werte, einheit, mitteIdx };
}

/**
 * Proportionale Balken-Darstellung fuer sortierte Zahlenreihen.
 * Der mittlere Wert (Median) wird hervorgehoben.
 * Inspiriert vom Fredo-4 Buch S.122: Kinder stehen der Groesse nach.
 */
export function WerteBalken({ werte, einheit, mitteIdx }: WerteBalkenDaten) {
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const range = max - min || 1;

  // Balkenhoehe: 30% Basis + 70% proportional
  const hoehe = (val: number) => 30 + ((val - min) / range) * 70;

  return (
    <Card className="py-2 px-3">
      <div className="flex items-end justify-center gap-1.5" style={{ height: 120 }}>
        {werte.map((val, i) => {
          const isMitte = i === mitteIdx;
          const h = hoehe(val);

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end flex-1"
              style={{ height: '100%' }}
            >
              {/* Balken */}
              <div
                className={`w-full rounded-t-md transition-all ${
                  isMitte
                    ? 'bg-primary ring-2 ring-primary/30'
                    : 'bg-primary/25'
                }`}
                style={{ height: `${h}%`, minWidth: 28 }}
              />
              {/* Wert-Label */}
              <span
                className={`text-[10px] mt-1 whitespace-nowrap ${
                  isMitte
                    ? 'font-bold text-primary'
                    : 'font-semibold text-muted'
                }`}
              >
                {val} {einheit}
              </span>
            </div>
          );
        })}
      </div>

      {/* Median-Hinweis */}
      {mitteIdx !== null && (
        <p className="text-[10px] text-center text-primary font-semibold mt-1">
          Mitte
        </p>
      )}
    </Card>
  );
}
