/**
 * KreisMerkkasten — SVG-Visualisierung der Kreis-Grundbegriffe.
 * Zeigt einen Kreis mit Mittelpunkt (M), Radius (r), Durchmesser (d)
 * und Kreislinie — beschriftet und farblich hervorgehoben.
 * Ersetzt das Buchscan-Bild „s104-merkkasten-kreis-radius.webp".
 */

export function KreisMerkkasten() {
  const w = 280;
  const h = 200;
  const cx = 130;
  const cy = 105;
  const r = 70;

  return (
    <div className="flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="max-w-full">
        {/* Kreislinie */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="#e0f2fe"
          stroke="#0ea5e9"
          strokeWidth={2.5}
        />

        {/* Durchmesser (horizontale Linie) */}
        <line
          x1={cx - r} y1={cy} x2={cx + r} y2={cy}
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="6 3"
        />

        {/* Radius (vom Mittelpunkt nach oben-rechts) */}
        <line
          x1={cx} y1={cy} x2={cx + r * 0.71} y2={cy - r * 0.71}
          stroke="#ef4444"
          strokeWidth={2.5}
        />

        {/* Mittelpunkt */}
        <circle cx={cx} cy={cy} r={4} fill="#1e293b" />

        {/* Label: M (Mittelpunkt) */}
        <text x={cx - 14} y={cy + 16} fontSize={13} fontWeight="bold" fill="#1e293b">M</text>

        {/* Label: r (Radius) — entlang der roten Linie */}
        <text
          x={cx + r * 0.28} y={cy - r * 0.42}
          fontSize={14} fontWeight="bold" fill="#ef4444"
        >
          r
        </text>

        {/* Label: d (Durchmesser) */}
        <text
          x={cx} y={cy + 22}
          fontSize={13} fontWeight="bold" fill="#f59e0b"
          textAnchor="middle"
        >
          d
        </text>

        {/* Kreislinie-Label */}
        <text
          x={cx + r + 8} y={cy - r * 0.3}
          fontSize={11} fill="#0ea5e9" fontWeight="600"
        >
          Kreis-
        </text>
        <text
          x={cx + r + 8} y={cy - r * 0.3 + 14}
          fontSize={11} fill="#0ea5e9" fontWeight="600"
        >
          linie
        </text>
      </svg>

      {/* Legende */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs mt-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-800" />
          <span className="font-semibold">M</span> = Mittelpunkt
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="font-semibold">r</span> = Radius
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-semibold">d</span> = Durchmesser
        </span>
      </div>
    </div>
  );
}
