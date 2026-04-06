import { useRef, useState, useCallback, useEffect } from 'react';
import { Card } from './Card';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  eraser: boolean;
}

const COLORS = [
  { value: '#334155', label: 'Schwarz' },
  { value: '#dc2626', label: 'Rot' },
  { value: '#2563eb', label: 'Blau' },
  { value: '#16a34a', label: 'Grün' },
];

const PEN_WIDTH = 3;
const ERASER_WIDTH = 24;

/**
 * Freihand-Zeichenfeld als Schmierzettel-Ersatz.
 * Funktioniert mit Touch, Apple Pencil und Maus.
 * Kein Speichern — dient als visuelles Hilfsmittel waehrend der Aufgabe.
 */
export function Zeichenfeld({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);
  const dprRef = useRef(1);

  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(COLORS[0].value);
  const [strokeCount, setStrokeCount] = useState(0);

  // Canvas-Groesse setzen (Retina-aware)
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    redraw();
  }, []);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  function getPos(e: React.PointerEvent): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width / dprRef.current;
    const h = canvas.height / dprRef.current;
    ctx.clearRect(0, 0, w, h);

    const all = [...strokesRef.current];
    if (currentRef.current) all.push(currentRef.current);

    for (const stroke of all) {
      if (stroke.points.length < 2) continue;

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.eraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = ERASER_WIDTH;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    isDrawing.current = true;
    currentRef.current = {
      points: [getPos(e)],
      color,
      width: PEN_WIDTH,
      eraser: tool === 'eraser',
    };
    canvasRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDrawing.current || !currentRef.current) return;
    e.preventDefault();
    currentRef.current.points.push(getPos(e));
    redraw();
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!isDrawing.current || !currentRef.current) return;
    e.preventDefault();
    isDrawing.current = false;
    if (currentRef.current.points.length >= 2) {
      strokesRef.current = [...strokesRef.current, currentRef.current];
      setStrokeCount(strokesRef.current.length);
    }
    currentRef.current = null;
    redraw();
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
  }

  function clear() {
    strokesRef.current = [];
    setStrokeCount(0);
    redraw();
  }

  return (
    <Card className="p-2">
      {/* Zeichenflaeche */}
      <div
        ref={containerRef}
        className="w-full rounded-lg border border-border overflow-hidden bg-white"
        style={{ height: 220, touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {/* Werkzeugleiste */}
      <div className="flex items-center gap-1 mt-2">
        {/* Stift */}
        <ToolButton
          active={tool === 'pen'}
          onClick={() => setTool('pen')}
          label="Stift"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolButton>

        {/* Radierer */}
        <ToolButton
          active={tool === 'eraser'}
          onClick={() => setTool('eraser')}
          label="Radierer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 14H14M3.5 11.5L1.5 13.5L4.5 13.5L12.5 5.5L9.5 2.5L3.5 8.5V11.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolButton>

        {/* Trenner */}
        <div className="w-px h-6 bg-border mx-0.5" />

        {/* Farben */}
        {COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setColor(c.value);
              setTool('pen');
            }}
            className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center cursor-pointer transition-all ${
              color === c.value && tool === 'pen'
                ? 'ring-2 ring-primary/40 bg-primary-light'
                : 'hover:bg-card'
            }`}
            aria-label={c.label}
          >
            <div
              className="w-5 h-5 rounded-full border border-black/10"
              style={{ backgroundColor: c.value }}
            />
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rueckgaengig */}
        <ToolButton
          onClick={undo}
          disabled={strokeCount === 0}
          label="Rückgängig"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 6H10C12.2 6 14 7.8 14 10C14 12.2 12.2 14 10 14H6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 3L3 6L6 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolButton>

        {/* Alles loeschen */}
        <ToolButton
          onClick={clear}
          disabled={strokeCount === 0}
          label="Alles löschen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4H14M5 4V2H11V4M6 7V12M10 7V12M3 4L4 14H12L13 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolButton>

        {/* Schliessen */}
        <ToolButton onClick={onClose} label="Zeichenfeld schließen">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </ToolButton>
      </div>
    </Card>
  );
}

/** Wiederverwendbarer Toolbar-Button. */
function ToolButton({
  children,
  active,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/30 ${
        active
          ? 'bg-primary text-white'
          : 'bg-card border border-border text-muted hover:text-primary hover:border-primary'
      }`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
