/**
 * SkizzeMerkkasten — Nachbau des Fredo-Bilds „Lösungshilfe: Skizze" (S. 70 / AH S. 45).
 * Layout exakt wie im Original:
 * 1) Titel-Leiste (grün)
 * 2) Aufgabentext
 * 3) Strecken-Skizze (T → L → O → See)
 * 4) Unten zwei getrennte Skizzen:
 *    - Skizze A (links): Teilstrecken + vertikaler Gesamtpfeil Tim↓See
 *    - Skizze B (rechts): 4 Zeilen horizontal (Gesamt + Teilstrecken)
 */

// ── 1) Strecken-Skizze (lineare Route) ──────────────────

function StreckenSkizze() {
  const w = 300;
  const h = 76;
  const y = 32;
  const punkte = [
    { x: 24, label: 'T' },
    { x: 92, label: 'L' },
    { x: 178, label: 'O' },
    { x: 276, label: 'See' },
  ];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="max-w-full">
      <line x1={punkte[0].x} y1={y} x2={punkte[3].x} y2={y} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points={`${punkte[3].x - 5},${y - 4} ${punkte[3].x},${y} ${punkte[3].x - 5},${y + 4}`} fill="#1e293b" />

      <text x={(punkte[0].x + punkte[1].x) / 2} y={y - 14} textAnchor="middle" fontSize={10} fill="#475569">2,8 km</text>
      <text x={(punkte[1].x + punkte[2].x) / 2} y={y - 14} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#475569">?</text>
      <text x={(punkte[2].x + punkte[3].x) / 2} y={y - 14} textAnchor="middle" fontSize={10} fill="#475569">5,2 km</text>

      {punkte.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={y} r={13} fill="white" stroke="#1e293b" strokeWidth={1.5} />
          <text x={p.x} y={y + 4} textAnchor="middle" fontSize={p.label.length > 1 ? 9 : 11} fontWeight="bold" fill="#1e293b">
            {p.label}
          </text>
        </g>
      ))}

      <line x1={punkte[0].x} y1={y + 18} x2={punkte[3].x} y2={y + 18} stroke="#64748b" strokeWidth={0.8} />
      <line x1={punkte[0].x} y1={y + 14} x2={punkte[0].x} y2={y + 22} stroke="#64748b" strokeWidth={0.8} />
      <line x1={punkte[3].x} y1={y + 14} x2={punkte[3].x} y2={y + 22} stroke="#64748b" strokeWidth={0.8} />
      <text x={(punkte[0].x + punkte[3].x) / 2} y={y + 31} textAnchor="middle" fontSize={10} fontStyle="italic" fill="#64748b">10,6 km</text>
    </svg>
  );
}

// ── Hilfs-Komponente: Namensbox ──────────────────────────

function Box({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 border-2 border-gray-700 rounded font-bold text-[11px] text-gray-800 bg-white min-w-[38px] text-center">
      {children}
    </span>
  );
}

// ── 2) Skizze A: Teilstrecken + vertikaler Gesamtpfeil ──
// Links:  Tim —2,8km— Lena
//         Lena —?—— Olli
//         Olli —5,2km— See
// Rechts: Tim ↓ 10,6km ↓ See (vertikal)

function SkizzeA() {
  const zeilen = [
    { von: 'Tim', distanz: '2,8 km', zu: 'Lena' },
    { von: 'Lena', distanz: '?', zu: 'Olli' },
    { von: 'Olli', distanz: '5,2 km', zu: 'See' },
  ];

  return (
    <div className="flex gap-5">
      {/* Links: Teilstrecken */}
      <div className="space-y-3">
        {zeilen.map((z, i) => (
          <div key={i} className="flex items-center gap-1">
            <Box>{z.von}</Box>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-[9px] tabular-nums text-gray-500 leading-none mb-0.5">{z.distanz}</span>
              <div className="w-full border-t border-gray-600" />
            </div>
            <Box>{z.zu}</Box>
          </div>
        ))}
      </div>

      {/* Rechts: Vertikaler Gesamtpfeil Tim → See */}
      <div className="flex flex-col items-center gap-0">
        <Box>Tim</Box>
        <div className="relative" style={{ width: 60, height: 70 }}>
          {/* Vertikale Linie */}
          <div style={{ position: 'absolute', left: 10, top: 0, width: 2, height: 62, backgroundColor: '#1e293b' }} />
          {/* Pfeilspitze */}
          <div style={{ position: 'absolute', left: 4, top: 62, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid #1e293b' }} />
          {/* Label */}
          <span className="absolute text-[9px] tabular-nums text-gray-500 whitespace-nowrap" style={{ left: 20, top: 24 }}>
            10,6 km
          </span>
        </div>
        <Box>See</Box>
      </div>
    </div>
  );
}

// ── 3) Skizze B: 4 Zeilen horizontal ────────────────────
// Tim —10,6km— See
// Tim —2,8km—— Lena
// Lena —?————— Olli
// Olli —5,2km— See

function SkizzeB() {
  const zeilen = [
    { von: 'Tim', distanz: '10,6 km', zu: 'See' },
    { von: 'Tim', distanz: '2,8 km', zu: 'Lena' },
    { von: 'Lena', distanz: '?', zu: 'Olli' },
    { von: 'Olli', distanz: '5,2 km', zu: 'See' },
  ];

  return (
    <div className="space-y-2">
      {zeilen.map((z, i) => (
        <div key={i} className="flex items-center gap-1">
          <Box>{z.von}</Box>
          <div className="flex flex-col items-center min-w-[48px] flex-1">
            <span className="text-[9px] tabular-nums text-gray-500 leading-none mb-0.5">{z.distanz}</span>
            <div className="w-full border-t border-gray-600" />
          </div>
          <Box>{z.zu}</Box>
        </div>
      ))}
    </div>
  );
}

// ── Hauptkomponente ──────────────────────────────────────

export function SkizzeMerkkasten() {
  return (
    <div className="space-y-3">
      {/* Titel */}
      <div className="bg-emerald-100 rounded-lg px-3 py-1.5 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-800 italic">Lösungshilfe: Skizze</p>
        <p className="text-[10px] text-emerald-600">AH S. 45</p>
      </div>

      {/* Aufgabentext */}
      <div className="text-xs text-body leading-relaxed">
        <p>
          Tim, Lena und Olli wollen zum See fahren. Tim wohnt 10,6 km vom See entfernt.
          Auf dem Weg zum See kommt er an Lena vorbei, die 2,8 km von ihm entfernt wohnt.
          Zusammen fahren sie weiter zu Olli. Von dort aus radeln sie gemeinsam die 5,2 km zum See.
        </p>
        <p className="font-semibold text-heading mt-1">
          Wie weit wohnt Olli von Lena entfernt?
        </p>
      </div>

      {/* Strecken-Skizze */}
      <div className="flex justify-center border border-gray-300 rounded-lg py-2 px-3 bg-white">
        <StreckenSkizze />
      </div>

      {/* Zwei Skizzen-Varianten nebeneinander */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <SkizzeA />
        </div>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <SkizzeB />
        </div>
      </div>
    </div>
  );
}
