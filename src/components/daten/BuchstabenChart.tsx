/**
 * BuchstabenChart — Vergleichendes Balkendiagramm der Buchstabenhäufigkeit
 * in deutschen und englischen Texten (pro 1000 Buchstaben).
 * Daten aus dem Fredo-4-Schulbuch, S.77.
 */

// Häufigkeiten pro 1000 Buchstaben (aus dem Fredo-Diagramm abgelesen)
export const BUCHSTABEN_DE: Record<string, number> = {
  A: 55, B: 20, C: 32, D: 50, E: 169, F: 15, G: 30, H: 50, I: 80,
  J: 2, K: 13, L: 70, M: 28, N: 105, O: 23, P: 8, Q: 1, R: 68,
  S: 65, T: 60, U: 38, V: 8, W: 18, X: 1, Y: 1, Z: 12,
  'Ä': 3, 'Ö': 1, 'Ü': 5, 'ß': 3,
};

export const BUCHSTABEN_EN: Record<string, number> = {
  A: 83, B: 15, C: 27, D: 41, E: 126, F: 20, G: 19, H: 62, I: 68,
  J: 1, K: 11, L: 42, M: 25, N: 70, O: 77, P: 1, Q: 1, R: 55,
  S: 62, T: 93, U: 12, V: 10, W: 20, X: 1, Y: 20, Z: 0,
  'Ä': 0, 'Ö': 0, 'Ü': 0, 'ß': 0,
};

const ALLE_BUCHSTABEN = Object.keys(BUCHSTABEN_DE);

export function BuchstabenChart() {
  const maxWert = 180;
  const barH = 16;
  const gap = 2;
  const groupH = barH * 2 + gap;
  const labelW = 22;
  const chartW = 300;
  const chartH = ALLE_BUCHSTABEN.length * (groupH + 4) + 30;

  return (
    <div className="overflow-x-auto">
      <p className="text-xs font-bold text-heading text-center mb-1">Buchstabenhäufigkeit</p>
      <p className="text-[9px] text-muted text-center mb-2">pro 1.000 Buchstaben in deutschen und englischen Texten</p>

      <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} className="mx-auto max-w-full">
        {/* Y-Achse Labels + Balken */}
        {ALLE_BUCHSTABEN.map((buchstabe, i) => {
          const y = i * (groupH + 4) + 20;
          const de = BUCHSTABEN_DE[buchstabe];
          const en = BUCHSTABEN_EN[buchstabe];
          const deW = (de / maxWert) * (chartW - labelW - 30);
          const enW = (en / maxWert) * (chartW - labelW - 30);

          return (
            <g key={buchstabe}>
              {/* Buchstaben-Label */}
              <text x={labelW - 4} y={y + groupH / 2 + 1} textAnchor="end" dominantBaseline="central" fontSize={9} fontWeight="bold" fill="#334155">
                {buchstabe}
              </text>

              {/* Deutsch (blau) */}
              <rect x={labelW} y={y} width={Math.max(deW, 0.5)} height={barH} rx={2} fill="#3b82f6" />
              {de > 10 && (
                <text x={labelW + deW - 3} y={y + barH / 2} textAnchor="end" dominantBaseline="central" fontSize={7} fill="white" fontWeight="bold">
                  {de}
                </text>
              )}

              {/* Englisch (rot/orange) */}
              <rect x={labelW} y={y + barH + gap} width={Math.max(enW, 0.5)} height={barH} rx={2} fill="#ef4444" />
              {en > 10 && (
                <text x={labelW + enW - 3} y={y + barH + gap + barH / 2} textAnchor="end" dominantBaseline="central" fontSize={7} fill="white" fontWeight="bold">
                  {en}
                </text>
              )}
            </g>
          );
        })}

        {/* Legende */}
        <g transform={`translate(${labelW}, ${chartH - 14})`}>
          <rect width={10} height={8} rx={2} fill="#3b82f6" />
          <text x={14} y={7} fontSize={8} fill="#334155">in deutschen Texten</text>
          <rect x={130} width={10} height={8} rx={2} fill="#ef4444" />
          <text x={144} y={7} fontSize={8} fill="#334155">in englischen Texten</text>
        </g>
      </svg>
    </div>
  );
}
