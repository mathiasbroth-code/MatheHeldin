/**
 * Binärsystem-Visualisierung: 8 Bit-Felder mit Stellenwerten.
 */

const STELLEN = [128, 64, 32, 16, 8, 4, 2, 1];

interface BinaerAnzeigeProps {
  dezimalZahl?: number;
}

export function BinaerAnzeige({ dezimalZahl }: BinaerAnzeigeProps) {
  const bits = dezimalZahl !== undefined
    ? STELLEN.map((s) => (dezimalZahl & s) !== 0 ? 1 : 0)
    : new Array(8).fill(-1); // -1 = leer

  return (
    <div className="space-y-1">
      {/* Stellenwerte */}
      <div className="flex justify-center gap-1">
        {STELLEN.map((s) => (
          <div key={s} className="w-9 text-center text-[9px] text-muted font-mono">
            {s}
          </div>
        ))}
      </div>
      {/* Bit-Felder */}
      <div className="flex justify-center gap-1">
        {bits.map((bit, i) => (
          <div
            key={i}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold border
              ${bit === 1 ? 'bg-primary text-white border-primary' : ''}
              ${bit === 0 ? 'bg-white text-muted border-border' : ''}
              ${bit === -1 ? 'bg-card text-muted/30 border-border border-dashed' : ''}
            `}
          >
            {bit >= 0 ? bit : '?'}
          </div>
        ))}
      </div>
      {/* Dezimalwert */}
      {dezimalZahl !== undefined && (
        <p className="text-[10px] text-muted text-center mt-1">
          = {dezimalZahl} (dezimal)
        </p>
      )}
    </div>
  );
}
