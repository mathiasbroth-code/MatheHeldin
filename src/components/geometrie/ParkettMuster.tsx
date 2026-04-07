/**
 * Einfache Parkettierung: zeigt ein wiederholendes Muster aus Grundformen.
 * Für Parkettierungs-Aufgaben als visuelle Hilfe.
 */

type FormTyp = 'quadrat' | 'dreieck' | 'sechseck' | 'rechteck';

interface ParkettMusterProps {
  form: FormTyp;
  cols?: number;
  rows?: number;
}

function QuadratGrid({ cols, rows }: { cols: number; rows: number }) {
  const s = 32;
  const w = cols * s;
  const h = rows * s;
  const cells: React.ReactElement[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const even = (r + c) % 2 === 0;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * s}
          y={r * s}
          width={s}
          height={s}
          fill={even ? '#ccfbf1' : '#99f6e4'}
          stroke="#0d9488"
          strokeWidth={0.8}
        />,
      );
    }
  }

  return (
    <svg viewBox={`-1 -1 ${w + 2} ${h + 2}`} className="w-full max-h-32">
      {cells}
    </svg>
  );
}

function DreieckGrid({ cols, rows }: { cols: number; rows: number }) {
  const s = 32;
  const h = s * Math.sin(Math.PI / 3);
  const triangles: React.ReactElement[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const up = (r + c) % 2 === 0;
      const x0 = c * (s / 2);
      const y0 = r * h;
      const points = up
        ? `${x0},${y0 + h} ${x0 + s / 2},${y0} ${x0 + s},${y0 + h}`
        : `${x0},${y0} ${x0 + s / 2},${y0 + h} ${x0 + s},${y0}`;
      triangles.push(
        <polygon
          key={`${r}-${c}`}
          points={points}
          fill={up ? '#ccfbf1' : '#99f6e4'}
          stroke="#0d9488"
          strokeWidth={0.8}
        />,
      );
    }
  }

  const w = cols * (s / 2) + s / 2;
  const totalH = rows * h + h;

  return (
    <svg viewBox={`-1 -1 ${w + 2} ${totalH + 2}`} className="w-full max-h-32">
      {triangles}
    </svg>
  );
}

function SechseckGrid({ cols, rows }: { cols: number; rows: number }) {
  const s = 18;
  const hexes: React.ReactElement[] = [];
  const w = s * 2;
  const h = s * Math.sqrt(3);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * w * 0.75 + s;
      const cy = r * h + (c % 2 === 1 ? h / 2 : 0) + s;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${cx + s * Math.cos(angle)},${cy + s * Math.sin(angle)}`;
      }).join(' ');
      hexes.push(
        <polygon
          key={`${r}-${c}`}
          points={pts}
          fill={(r + c) % 2 === 0 ? '#ccfbf1' : '#99f6e4'}
          stroke="#0d9488"
          strokeWidth={0.8}
        />,
      );
    }
  }

  const totalW = cols * w * 0.75 + s + 4;
  const totalH = rows * h + h / 2 + s + 4;

  return (
    <svg viewBox={`-1 -1 ${totalW} ${totalH}`} className="w-full max-h-32">
      {hexes}
    </svg>
  );
}

export function ParkettMuster({ form, cols = 5, rows = 3 }: ParkettMusterProps) {
  switch (form) {
    case 'quadrat':
    case 'rechteck':
      return <QuadratGrid cols={cols} rows={rows} />;
    case 'dreieck':
      return <DreieckGrid cols={cols * 2} rows={rows} />;
    case 'sechseck':
      return <SechseckGrid cols={cols} rows={rows} />;
    default:
      return <QuadratGrid cols={cols} rows={rows} />;
  }
}
