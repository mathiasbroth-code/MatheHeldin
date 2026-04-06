import { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';

interface KreisDef {
  label: string;
  radius: number; // in mm (aus der Loesung)
}

export interface KreiseDaten {
  kreise: KreisDef[];
}

/**
 * Erkennt Aufgaben mit "Kreis A/B/C... Radius ... mm" Pattern.
 * Extrahiert die Radien aus dem Loesungstext, damit die Kreise
 * massstabsgetreu gezeichnet werden koennen.
 */
export function parseKreiseDaten(text: string, loesung: string): KreiseDaten | null {
  if (!/Kreis/i.test(text) || !/Radius/i.test(text)) return null;
  if (!/Kreis\s+[A-E]\b/.test(text)) return null;

  const kreise: KreisDef[] = [];
  const labels = ['A', 'B', 'C', 'D', 'E'];

  for (const line of loesung.split('\n')) {
    const match = line.match(/^([a-e])\)\s*(\d+)/);
    if (match) {
      const idx = match[1].charCodeAt(0) - 'a'.charCodeAt(0);
      if (idx >= 0 && idx < labels.length) {
        kreise.push({ label: labels[idx], radius: parseInt(match[2], 10) });
      }
    }
  }

  if (kreise.length < 2) return null;
  return { kreise };
}

/** Pixel pro mm — Skalierung fuer die Kreisdarstellung. */
const PX_PER_MM = 2.5;
/** Laenge des Lineals in mm. */
const LINEAL_MM = 30;
const LINEAL_W = LINEAL_MM * PX_PER_MM;
const LINEAL_H = 28;

/**
 * SVG-Darstellung von beschrifteten Kreisen mit Mittelpunkt-Kreuzen
 * und einem verschiebbaren Lineal zum Messen der Radien.
 */
export function KreiseDiagramm({ kreise }: KreiseDaten) {
  const maxR = Math.max(...kreise.map((k) => k.radius));
  const cellSize = maxR * PX_PER_MM * 2 + 24;

  const cols = kreise.length <= 3 ? kreise.length : 3;
  const rows = Math.ceil(kreise.length / cols);
  const svgW = cols * cellSize;
  const svgH = rows * cellSize + 16;

  const containerRef = useRef<HTMLDivElement>(null);
  const [linealPos, setLinealPos] = useState({ x: 8, y: svgH - 6 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    dragOffset.current = {
      x: e.clientX - rect.left - linealPos.x,
      y: e.clientY - rect.top - linealPos.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    setLinealPos({
      x: e.clientX - rect.left - dragOffset.current.x,
      y: e.clientY - rect.top - dragOffset.current.y,
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    e.preventDefault();
    dragging.current = false;
  }

  return (
    <Card className="py-2 px-2">
      <p className="text-[10px] text-muted text-center mb-1">
        Verschiebe das Lineal an einen Kreis, um den Radius zu messen.
      </p>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-border bg-white"
        style={{ touchAction: 'none' }}
      >
        {/* Kreise als SVG */}
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
          {kreise.map((kreis, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = col * cellSize + cellSize / 2;
            const cy = row * cellSize + cellSize / 2;
            const r = kreis.radius * PX_PER_MM;
            const cross = 5;

            return (
              <g key={kreis.label}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth={1.5}
                />
                <line x1={cx - cross} y1={cy} x2={cx + cross} y2={cy} stroke="#334155" strokeWidth={1} />
                <line x1={cx} y1={cy - cross} x2={cx} y2={cy + cross} stroke="#334155" strokeWidth={1} />
                <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#334155">
                  {kreis.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Verschiebbares Lineal */}
        <div
          className="absolute cursor-grab active:cursor-grabbing select-none"
          style={{
            left: linealPos.x,
            top: linealPos.y,
            width: LINEAL_W + 16,
            height: LINEAL_H + 8,
            zIndex: 10,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            width={LINEAL_W + 16}
            height={LINEAL_H + 8}
            viewBox={`0 0 ${LINEAL_W + 16} ${LINEAL_H + 8}`}
          >
            {/* Lineal-Hintergrund */}
            <rect
              x={0}
              y={0}
              width={LINEAL_W + 16}
              height={LINEAL_H + 8}
              rx={4}
              fill="#fef9c3"
              stroke="#ca8a04"
              strokeWidth={1}
              opacity={0.92}
            />
            {/* Markierungen */}
            {Array.from({ length: LINEAL_MM + 1 }, (_, mm) => {
              const x = 8 + mm * PX_PER_MM;
              const isMajor = mm % 10 === 0;
              const isMid = mm % 5 === 0;
              return (
                <g key={mm}>
                  <line
                    x1={x}
                    y1={2}
                    x2={x}
                    y2={isMajor ? 16 : isMid ? 12 : 8}
                    stroke="#92400e"
                    strokeWidth={isMajor ? 1.5 : 0.75}
                  />
                  {isMajor && (
                    <text x={x} y={24} textAnchor="middle" fontSize={8} fill="#92400e" fontWeight="bold">
                      {mm}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Basis-Linie */}
            <line x1={8} y1={2} x2={8 + LINEAL_MM * PX_PER_MM} y2={2} stroke="#92400e" strokeWidth={1} />
            <text x={LINEAL_W / 2 + 8} y={LINEAL_H + 2} textAnchor="middle" fontSize={6} fill="#92400e">
              mm
            </text>
          </svg>
        </div>
      </div>
    </Card>
  );
}
