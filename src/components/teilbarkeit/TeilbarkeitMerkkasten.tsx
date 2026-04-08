/**
 * SVG-Merkkästen für die Teilbarkeitsregeln (Fredo S.84–85).
 * Drei Varianten: durch 4, durch 9, durch 3.
 */

/** Merkkasten: Teilbarkeit durch 4 — letzte zwei Ziffern. */
export function TeilbarkeitMerkkasten4() {
  return (
    <div className="space-y-3">
      {/* Regel-Box */}
      <div className="flex gap-2 items-start p-3 rounded-xl border-2 border-red-300 bg-red-50">
        <span className="text-red-500 text-lg shrink-0 mt-0.5">❗</span>
        <p className="text-sm font-medium text-heading leading-relaxed">
          Eine Zahl ist ohne Rest durch <strong className="text-red-600">4</strong> teilbar,
          wenn die Zahl, die aus den <strong>letzten beiden Ziffern</strong> gebildet wird,
          durch 4 teilbar ist.
        </p>
      </div>
      {/* Visuelles Beispiel als SVG */}
      <svg viewBox="0 0 260 56" className="w-full max-w-[280px] mx-auto" aria-label="Beispiel: 3212 : 4">
        {/* Zahl 3212 — erste Ziffern grau, letzte zwei hervorgehoben */}
        <text x="20" y="32" fontSize="26" fontFamily="monospace" fill="#94a3b8" fontWeight="bold">32</text>
        <text x="52" y="32" fontSize="26" fontFamily="monospace" fill="#0d9488" fontWeight="bold">12</text>
        {/* Unterstreichung der letzten beiden Ziffern */}
        <line x1="52" y1="38" x2="83" y2="38" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pfeil */}
        <line x1="95" y1="22" x2="115" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="115,17 125,22 115,27" fill="#94a3b8" />
        {/* Nebenrechnung */}
        <text x="132" y="20" fontSize="14" fontFamily="system-ui" fill="#64748b">12 : 4 = 3</text>
        <text x="132" y="40" fontSize="13" fontFamily="system-ui" fill="#0d9488" fontWeight="bold">✓ teilbar!</text>
      </svg>
    </div>
  );
}

/** Merkkasten: Quersumme und Teilbarkeit durch 9 — mit Plättchen-Visualisierung. */
export function QuersummeMerkkasten9() {
  const dots = (count: number, cx: number) => {
    const positions: [number, number][] = [];
    // Plättchen von unten nach oben anordnen, max 2 Spalten bei >5
    for (let i = 0; i < count; i++) {
      const col = count > 5 ? i % 2 : 0;
      const row = count > 5 ? Math.floor(i / 2) : i;
      positions.push([cx + col * 16 - (count > 5 ? 8 : 0), 100 - row * 18]);
    }
    return positions;
  };

  return (
    <div className="space-y-3">
      {/* Plättchen-Visualisierung */}
      <div className="p-3 rounded-xl border border-border bg-card">
        <p className="text-xs text-muted mb-2 text-center">
          Die Anzahl der Plättchen gibt die <strong className="text-heading">Quersumme</strong> einer Zahl an.
        </p>
        <svg viewBox="0 0 220 130" className="w-full max-w-[240px] mx-auto" aria-label="Quersumme von 423 = 9">
          {/* Spaltenüberschriften */}
          <text x="50" y="18" fontSize="13" fontFamily="system-ui" fill="#64748b" textAnchor="middle" fontWeight="bold">H</text>
          <text x="110" y="18" fontSize="13" fontFamily="system-ui" fill="#64748b" textAnchor="middle" fontWeight="bold">Z</text>
          <text x="170" y="18" fontSize="13" fontFamily="system-ui" fill="#64748b" textAnchor="middle" fontWeight="bold">E</text>
          {/* Trennlinien */}
          <line x1="20" y1="24" x2="200" y2="24" stroke="#e2e8f0" strokeWidth="1" />
          {/* H-Spalte: 4 Plättchen */}
          {dots(4, 50).map(([cx, cy], i) => (
            <circle key={`h${i}`} cx={cx} cy={cy} r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          ))}
          {/* Z-Spalte: 2 Plättchen */}
          {dots(2, 110).map(([cx, cy], i) => (
            <circle key={`z${i}`} cx={cx} cy={cy} r="7" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
          ))}
          {/* E-Spalte: 3 Plättchen */}
          {dots(3, 170).map(([cx, cy], i) => (
            <circle key={`e${i}`} cx={cx} cy={cy} r="7" fill="#10b981" stroke="#059669" strokeWidth="1" />
          ))}
          {/* Ziffern unterhalb */}
          <text x="50" y="122" fontSize="16" fontFamily="monospace" fill="#1e293b" textAnchor="middle" fontWeight="bold">4</text>
          <text x="110" y="122" fontSize="16" fontFamily="monospace" fill="#1e293b" textAnchor="middle" fontWeight="bold">2</text>
          <text x="170" y="122" fontSize="16" fontFamily="monospace" fill="#1e293b" textAnchor="middle" fontWeight="bold">3</text>
        </svg>
        <p className="text-sm text-center mt-1">
          <span className="font-mono font-bold">4 + 2 + 3 = 9</span>
          <span className="text-muted ml-2">→ 423 hat die Quersumme 9.</span>
        </p>
      </div>
      {/* Regel-Box */}
      <div className="flex gap-2 items-start p-3 rounded-xl border-2 border-red-300 bg-red-50">
        <span className="text-red-500 text-lg shrink-0 mt-0.5">❗</span>
        <p className="text-sm font-medium text-heading leading-relaxed">
          Eine Zahl ist ohne Rest durch <strong className="text-red-600">9</strong> teilbar,
          wenn ihre <strong>Quersumme</strong> durch 9 teilbar ist.
        </p>
      </div>
      {/* Beispiel */}
      <p className="text-xs text-muted text-center italic">
        18 ist durch 9 teilbar → also ist auch 3.645 durch 9 teilbar (3+6+4+5 = 18).
      </p>
    </div>
  );
}

/** Merkkasten: Teilbarkeit durch 3 — Quersumme. */
export function TeilbarkeitMerkkasten3() {
  return (
    <div className="flex gap-2 items-start p-3 rounded-xl border-2 border-red-300 bg-red-50">
      <span className="text-red-500 text-lg shrink-0 mt-0.5">❗</span>
      <p className="text-sm font-medium text-heading leading-relaxed">
        Eine Zahl ist ohne Rest durch <strong className="text-red-600">3</strong> teilbar,
        wenn ihre <strong>Quersumme</strong> durch 3 teilbar ist.
      </p>
    </div>
  );
}
