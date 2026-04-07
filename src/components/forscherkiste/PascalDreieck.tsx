/**
 * Pascalsches Dreieck: 6 Zeilen, jede Zahl ist die Summe der zwei darüber.
 */

function berechneZeilen(n: number): number[][] {
  const zeilen: number[][] = [[1]];
  for (let i = 1; i < n; i++) {
    const prev = zeilen[i - 1];
    const row = [1];
    for (let j = 1; j < prev.length; j++) {
      row.push(prev[j - 1] + prev[j]);
    }
    row.push(1);
    zeilen.push(row);
  }
  return zeilen;
}

export function PascalDreieck() {
  const zeilen = berechneZeilen(6);

  return (
    <div className="flex flex-col items-center gap-1">
      {zeilen.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1">
          {row.map((val, cIdx) => (
            <div
              key={cIdx}
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
            >
              {val}
            </div>
          ))}
        </div>
      ))}
      <p className="text-[10px] text-muted mt-1">
        Jede Zahl = Summe der zwei darueber
      </p>
    </div>
  );
}
