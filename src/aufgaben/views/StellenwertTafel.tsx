import { Card } from '@/components/ui/Card';

const STELLEN = [
  { kuerzel: 'M', name: 'Millionen', faktor: 1_000_000 },
  { kuerzel: 'HT', name: 'Hunderttausender', faktor: 100_000 },
  { kuerzel: 'ZT', name: 'Zehntausender', faktor: 10_000 },
  { kuerzel: 'T', name: 'Tausender', faktor: 1_000 },
  { kuerzel: 'H', name: 'Hunderter', faktor: 100 },
  { kuerzel: 'Z', name: 'Zehner', faktor: 10 },
  { kuerzel: 'E', name: 'Einer', faktor: 1 },
];

export interface StellenwertDaten {
  zahl: number;
}

/**
 * Erkennt Aufgaben mit Stellenwert-Bezug und extrahiert die erste grosse Zahl.
 * Gibt null zurueck wenn kein Stellenwert-Kontext erkannt wird.
 */
export function parseStellenwertDaten(text: string): StellenwertDaten | null {
  if (!/Stellenwert/i.test(text)) return null;

  // Grosse Zahl finden (mit oder ohne Punkte als Tausendertrennzeichen)
  const zahlen = text.match(/\b(\d{1,3}(?:\.\d{3})*)\b/g);
  if (!zahlen) return null;

  for (const raw of zahlen) {
    const zahl = parseInt(raw.replace(/\./g, ''), 10);
    if (zahl >= 100 && zahl <= 9_999_999) {
      return { zahl };
    }
  }

  return null;
}

/**
 * Visuelle Stellenwerttafel: zeigt eine Zahl aufgeschluesselt in ihre Stellenwerte.
 * Nur relevante Spalten werden angezeigt (z.B. T|H|Z|E fuer dreistellige Zahlen).
 */
export function StellenwertTafel({ zahl }: StellenwertDaten) {
  // Relevante Stellen bestimmen (ab der hoechsten besetzten Stelle)
  const digits = String(zahl).split('').map(Number);
  const totalStellen = digits.length;
  const startIdx = STELLEN.length - totalStellen;
  const relevantStellen = STELLEN.slice(Math.max(0, startIdx));

  // Ziffern linksbündig auf die Stellen verteilen
  const ziffern: number[] = [];
  for (let i = 0; i < relevantStellen.length; i++) {
    const digitIdx = i - (relevantStellen.length - digits.length);
    ziffern.push(digitIdx >= 0 ? digits[digitIdx] : 0);
  }

  return (
    <Card className="py-2 px-3">
      <div className="flex justify-center">
        <div className="inline-flex flex-col">
          {/* Header */}
          <div className="flex">
            {relevantStellen.map((stelle) => (
              <div
                key={stelle.kuerzel}
                className="flex-1 min-w-[36px] text-center px-1 py-1 border border-border/50 bg-card"
              >
                <span className="text-[10px] font-bold text-muted">
                  {stelle.kuerzel}
                </span>
              </div>
            ))}
          </div>
          {/* Ziffern */}
          <div className="flex">
            {ziffern.map((ziffer, i) => {
              const isActive = ziffer !== 0;
              return (
                <div
                  key={i}
                  className={`flex-1 min-w-[36px] min-h-[36px] text-center px-1 py-1.5 border border-border/50 ${
                    isActive ? 'bg-primary text-white' : 'bg-white text-muted'
                  }`}
                >
                  <span className="text-lg font-bold">{ziffer}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted text-center mt-1">
        {zahl.toLocaleString('de-DE')}
      </p>
    </Card>
  );
}
