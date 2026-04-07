import { Card } from '@/components/ui/Card';

interface Punkt {
  label: string;
  wert: number;
}

export interface ZahlenstrahlDaten {
  von: number;
  bis: number;
  punkte: Punkt[];
}

/**
 * Erkennt "Zahlenstrahl von X bis Y" mit beschrifteten Punkten (A, B, C...).
 */
export function parseZahlenstrahlDaten(text: string): ZahlenstrahlDaten | null {
  // "Zahlenstrahl von 520.000 bis 530.000"
  const rangeMatch = text.match(
    /Zahlenstrahl\s+von\s+([\d.]+)\s+bis\s+([\d.]+)/i,
  );
  if (!rangeMatch) return null;

  const von = parseInt(rangeMatch[1].replace(/\./g, ''), 10);
  const bis = parseInt(rangeMatch[2].replace(/\./g, ''), 10);
  if (isNaN(von) || isNaN(bis) || von >= bis) return null;

  // Punkte: "A liegt bei 521.000" oder "A: 521.000"
  const punkte: Punkt[] = [];
  const punktPattern = /([A-Z])\s+(?:liegt\s+bei|:)\s+([\d.]+)/g;
  let m: RegExpExecArray | null;
  while ((m = punktPattern.exec(text)) !== null) {
    const wert = parseInt(m[2].replace(/\./g, ''), 10);
    if (!isNaN(wert)) {
      punkte.push({ label: m[1], wert });
    }
  }

  if (punkte.length === 0) return null;
  return { von, bis, punkte };
}

/**
 * Horizontaler Zahlenstrahl mit beschrifteten Punkten.
 */
export function ZahlenstrahlDiagramm({ von, bis, punkte }: ZahlenstrahlDaten) {
  const range = bis - von;
  const pad = 6; // % links/rechts

  function pos(wert: number): number {
    return pad + ((wert - von) / range) * (100 - 2 * pad);
  }

  // Tick-Intervall berechnen (5 oder 10 Striche)
  const tickCount = 10;
  const tickStep = range / tickCount;

  return (
    <Card className="py-2 px-3">
      <div className="relative" style={{ height: 72 }}>
        {/* Linie */}
        <div
          className="absolute h-1 bg-border rounded"
          style={{ top: 28, left: `${pad}%`, right: `${pad}%` }}
        />

        {/* Tick-Marks + Labels */}
        {Array.from({ length: tickCount + 1 }, (_, i) => {
          const wert = von + i * tickStep;
          const x = pos(wert);
          const isMajor = i === 0 || i === tickCount || i === tickCount / 2;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, top: 20, transform: 'translateX(-50%)' }}
            >
              <div
                className={`bg-border ${isMajor ? 'w-0.5 h-4' : 'w-px h-3'}`}
              />
              {isMajor && (
                <span className="text-[8px] text-muted mt-0.5 whitespace-nowrap">
                  {wert.toLocaleString('de-DE')}
                </span>
              )}
            </div>
          );
        })}

        {/* Punkte */}
        {punkte.map((punkt) => {
          const x = pos(punkt.wert);
          return (
            <div
              key={punkt.label}
              className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, top: 4, transform: 'translateX(-50%)' }}
            >
              <span className="text-[10px] font-bold text-primary bg-primary-light px-1 rounded">
                {punkt.label}
              </span>
              <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm mt-0.5" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
