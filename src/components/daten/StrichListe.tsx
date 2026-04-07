/**
 * Strichlisten-Vorlage: zeigt Buchstaben-Zeilen als Zählhilfe.
 * Klassische 5er-Bündel als Beispiel.
 */

interface StrichListeProps {
  buchstaben?: string[];
}

const DEFAULT_BUCHSTABEN = ['A', 'E', 'I', 'O', 'U'];

/** Rendert Striche als 5er-Bündel: IIII mit Querstrich */
function StrichSymbol({ anzahl }: { anzahl: number }) {
  if (anzahl === 0) return <span className="text-muted/30">—</span>;

  const buendel = Math.floor(anzahl / 5);
  const rest = anzahl % 5;
  const parts: string[] = [];

  for (let i = 0; i < buendel; i++) parts.push('𝍸');
  for (let i = 0; i < rest; i++) parts.push('|');

  return <span className="font-mono tracking-wider">{parts.join(' ')}</span>;
}

export function StrichListe({ buchstaben = DEFAULT_BUCHSTABEN }: StrichListeProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] text-muted mb-1">
        <span className="w-8 text-center font-bold">Buchst.</span>
        <span className="flex-1">Strichliste</span>
        <span className="w-10 text-center font-bold">Anzahl</span>
      </div>
      {buchstaben.map((b) => (
        <div key={b} className="flex items-center gap-2 border-b border-border/30 pb-1">
          <span className="w-8 text-center text-sm font-bold text-primary">{b}</span>
          <div className="flex-1 h-6 border border-dashed border-border/50 rounded px-2 flex items-center">
            {b === buchstaben[0] && (
              <span className="text-muted/40 text-xs">
                <StrichSymbol anzahl={3} /> ← Beispiel
              </span>
            )}
          </div>
          <div className="w-10 h-6 border border-dashed border-border/50 rounded text-center" />
        </div>
      ))}
    </div>
  );
}
