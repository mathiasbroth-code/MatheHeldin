/**
 * Primzahl-Sieb: 10×10 Grid (1-100) mit hervorgehobenen Primzahlen.
 */

function istPrim(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function PrimzahlSieb() {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-10 gap-[2px]">
        {Array.from({ length: 100 }, (_, i) => {
          const n = i + 1;
          const prim = istPrim(n);
          return (
            <div
              key={n}
              className={`h-6 flex items-center justify-center text-[10px] font-bold rounded
                ${prim ? 'bg-primary text-white' : ''}
                ${n === 1 ? 'bg-border/50 text-muted' : ''}
                ${!prim && n > 1 ? 'bg-card text-muted/60 border border-border/30' : ''}
              `}
            >
              {n}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-3 text-[9px] text-muted">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary" /> Primzahl
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-card border border-border/30" /> zusammengesetzt
        </span>
      </div>
    </div>
  );
}
