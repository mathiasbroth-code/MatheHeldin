/**
 * Einfache Körpernetz-Darstellung: zeigt das aufgefaltete Netz eines Quaders/Würfels.
 * Für Körpernetz-Aufgaben als visuelle Hilfe.
 */

type NetzTyp = 'wuerfel' | 'quader';

interface KoerperNetzProps {
  typ: NetzTyp;
}

function WuerfelNetz() {
  const s = 36;
  // Kreuz-Form: 4 in einer Spalte, je 1 links und rechts von der 2. Zeile
  const faces = [
    { x: 1, y: 0, label: 'oben' },
    { x: 0, y: 1, label: 'links' },
    { x: 1, y: 1, label: 'vorne' },
    { x: 2, y: 1, label: 'rechts' },
    { x: 3, y: 1, label: 'hinten' },
    { x: 1, y: 2, label: 'unten' },
  ];

  const colors = ['#ccfbf1', '#99f6e4', '#5eead4', '#99f6e4', '#ccfbf1', '#5eead4'];
  const w = 4 * s + 4;
  const h = 3 * s + 4;

  return (
    <svg viewBox={`-2 -2 ${w} ${h}`} className="w-full max-h-36" role="img" aria-label="Würfelnetz">
      {faces.map((f, i) => (
        <g key={i}>
          <rect
            x={f.x * s}
            y={f.y * s}
            width={s}
            height={s}
            fill={colors[i]}
            stroke="#0d9488"
            strokeWidth={1}
          />
          <text
            x={f.x * s + s / 2}
            y={f.y * s + s / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[8px] fill-primary font-semibold"
          >
            {f.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function QuaderNetz() {
  // Quader: verschiedene Seitenlängen (breit × hoch × tief)
  const bx = 48;
  const by = 32;
  const bz = 24;

  const faces: { x: number; y: number; w: number; h: number; label: string }[] = [
    { x: bz, y: 0, w: bx, h: bz, label: 'oben' },
    { x: 0, y: bz, w: bz, h: by, label: 'links' },
    { x: bz, y: bz, w: bx, h: by, label: 'vorne' },
    { x: bz + bx, y: bz, w: bz, h: by, label: 'rechts' },
    { x: bz + bx + bz, y: bz, w: bx, h: by, label: 'hinten' },
    { x: bz, y: bz + by, w: bx, h: bz, label: 'unten' },
  ];

  const colors = ['#ccfbf1', '#99f6e4', '#5eead4', '#99f6e4', '#ccfbf1', '#5eead4'];
  const totalW = 2 * bz + 2 * bx + 4;
  const totalH = 2 * bz + by + 4;

  return (
    <svg viewBox={`-2 -2 ${totalW} ${totalH}`} className="w-full max-h-36" role="img" aria-label="Quadernetz">
      {faces.map((f, i) => (
        <g key={i}>
          <rect
            x={f.x}
            y={f.y}
            width={f.w}
            height={f.h}
            fill={colors[i]}
            stroke="#0d9488"
            strokeWidth={1}
          />
          <text
            x={f.x + f.w / 2}
            y={f.y + f.h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[8px] fill-primary font-semibold"
          >
            {f.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function KoerperNetz({ typ }: KoerperNetzProps) {
  return typ === 'wuerfel' ? <WuerfelNetz /> : <QuaderNetz />;
}
