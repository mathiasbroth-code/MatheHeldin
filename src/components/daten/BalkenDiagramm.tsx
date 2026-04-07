/**
 * Einfaches horizontales Balkendiagramm für Daten-Aufgaben.
 */

interface Balken {
  label: string;
  wert: number;
}

interface BalkenDiagrammProps {
  balken: Balken[];
  einheit?: string;
}

export function BalkenDiagramm({ balken, einheit }: BalkenDiagrammProps) {
  if (balken.length === 0) return null;

  const maxWert = Math.max(...balken.map((b) => b.wert));

  return (
    <div className="space-y-1.5">
      {balken.map((b, i) => {
        const pct = maxWert > 0 ? (b.wert / maxWert) * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-muted w-16 text-right shrink-0 truncate">
              {b.label}
            </span>
            <div className="flex-1 bg-border/30 rounded h-5 relative">
              <div
                className="bg-primary rounded h-5 transition-all"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-heading w-12 tabular-nums">
              {b.wert}{einheit ? ` ${einheit}` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
