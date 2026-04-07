/**
 * Isometrische Würfel-Darstellung für Schrägbilder und Rauminhalt.
 * Rendert 3D-Würfelgebäude als SVG mit 30°-Projektion.
 */

interface Cube {
  x: number;
  y: number;
  z: number;
}

interface IsometricGridProps {
  wuerfel: Cube[];
  size?: number;
}

// Isometrische Projektion: 30° Winkel
const COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
const SIN30 = 0.5;

function toIso(x: number, y: number, z: number, s: number): { sx: number; sy: number } {
  return {
    sx: (x - y) * s * COS30,
    sy: (x + y) * s * SIN30 - z * s,
  };
}

function cubePolygons(x: number, y: number, z: number, s: number) {
  // 8 Eckpunkte des Würfels in Iso-Koordinaten
  const p = (dx: number, dy: number, dz: number) => toIso(x + dx, y + dy, z + dz, s);

  return {
    top: [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)],
    left: [p(0, 0, 0), p(0, 0, 1), p(0, 1, 1), p(0, 1, 0)],
    right: [p(0, 1, 0), p(0, 1, 1), p(1, 1, 1), p(1, 1, 0)],
  };
}

function pointsToSvg(pts: { sx: number; sy: number }[]): string {
  return pts.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
}

export function IsometricGrid({ wuerfel, size = 28 }: IsometricGridProps) {
  if (wuerfel.length === 0) return null;

  // Sortiere: hinten→vorne, unten→oben (painter's algorithm)
  const sorted = [...wuerfel].sort((a, b) => {
    const sumA = a.x + a.y;
    const sumB = b.x + b.y;
    if (sumA !== sumB) return sumA - sumB;
    return a.z - b.z;
  });

  // ViewBox berechnen
  const allPoints = wuerfel.flatMap((c) => {
    const faces = cubePolygons(c.x, c.y, c.z, size);
    return [...faces.top, ...faces.left, ...faces.right];
  });
  const xs = allPoints.map((p) => p.sx);
  const ys = allPoints.map((p) => p.sy);
  const pad = 8;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;

  return (
    <svg
      viewBox={`${minX} ${minY} ${w} ${h}`}
      className="w-full max-h-40"
      role="img"
      aria-label={`Würfelgebäude mit ${wuerfel.length} Würfeln`}
    >
      {sorted.map((cube, i) => {
        const faces = cubePolygons(cube.x, cube.y, cube.z, size);
        return (
          <g key={i}>
            {/* Rechte Seite (dunkel) */}
            <polygon
              points={pointsToSvg(faces.right)}
              fill="#0d9488"
              stroke="#0a7a70"
              strokeWidth={0.8}
            />
            {/* Linke Seite (mittel) */}
            <polygon
              points={pointsToSvg(faces.left)}
              fill="#14b8a6"
              stroke="#0a7a70"
              strokeWidth={0.8}
            />
            {/* Oberseite (hell) */}
            <polygon
              points={pointsToSvg(faces.top)}
              fill="#5eead4"
              stroke="#0a7a70"
              strokeWidth={0.8}
            />
          </g>
        );
      })}
    </svg>
  );
}
