/**
 * Baumdiagramm — SVG-Visualisierung für Kombinatorik-Aufgaben.
 * Zeigt Permutationen als Baumstruktur (z.B. 3 Freunde anordnen → 6 Möglichkeiten).
 *
 * Unterstützt:
 * - 2-4 Elemente (Permutationen)
 * - Schrittweises Aufdecken (revealLevel)
 * - Touch-optimiert für iPad
 */

interface BaumDiagrammProps {
  /** Die Elemente die permutiert werden (z.B. ["Lena", "Tom", "Mia"]) */
  elemente: string[];
  /** Wie viele Ebenen aufgedeckt sind (0=nur Root-Labels, 1=erste Verzweigung, etc.) */
  revealLevel?: number;
  /** Kompakte Darstellung */
  compact?: boolean;
  /** Callback wenn Kind die naechste Ebene aufdecken will */
  onReveal?: (newLevel: number) => void;
}

interface TreeNode {
  label: string;
  children: TreeNode[];
  path: string[];
}

function buildTree(elemente: string[], path: string[] = []): TreeNode[] {
  if (elemente.length === 0) return [];
  return elemente.map((el) => {
    const remaining = elemente.filter((e) => e !== el);
    const newPath = [...path, el];
    return {
      label: el,
      children: buildTree(remaining, newPath),
      path: newPath,
    };
  });
}

// Farben für die Ebenen
const LEVEL_COLORS = ['#0d9488', '#f59e0b', '#8b5cf6', '#ec4899'];
const LEVEL_BG = ['#ccfbf1', '#fef3c7', '#ede9fe', '#fce7f3'];

export function BaumDiagramm({ elemente, revealLevel = 99, compact = false, onReveal }: BaumDiagrammProps) {
  const tree = buildTree(elemente);
  const depth = elemente.length; // Tiefe des Baums
  const effectiveLevel = Math.min(revealLevel, depth);

  if (elemente.length < 2 || elemente.length > 4) {
    return null; // Nur 2-4 Elemente unterstützt
  }

  // Sichtbare Permutationen berechnen
  const totalPerms = factorial(elemente.length);
  const visiblePerms = effectiveLevel >= depth
    ? totalPerms
    : countVisiblePermutations(elemente.length, effectiveLevel);
  const fullyRevealed = effectiveLevel >= depth;

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className={`flex flex-col gap-0 ${compact ? 'text-xs' : 'text-sm'}`}>
        {/* Ebenen-Labels */}
        <div className="flex items-center gap-1 mb-2 px-1">
          {Array.from({ length: depth }, (_, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: i < effectiveLevel ? LEVEL_BG[i % LEVEL_BG.length] : '#f3f4f6',
                  color: i < effectiveLevel ? LEVEL_COLORS[i % LEVEL_COLORS.length] : '#9ca3af',
                }}
              >
                {i + 1}. Platz
              </span>
            </div>
          ))}
          <div className="w-24 text-center">
            <span className="text-xs font-bold text-muted">Reihenfolge</span>
          </div>
        </div>

        {/* Baumzeilen — jede Permutation ist eine Zeile */}
        {renderBranches(tree, 0, effectiveLevel, depth, compact)}

        {/* Zaehler */}
        <p className="text-xs text-muted text-center mt-2">
          {fullyRevealed
            ? `Alle ${totalPerms} Möglichkeiten`
            : `${visiblePerms} von ${totalPerms} Möglichkeiten sichtbar`}
        </p>

        {/* Naechste-Ebene-Button */}
        {onReveal && !fullyRevealed && (
          <button
            onClick={() => onReveal(effectiveLevel + 1)}
            className="mt-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm min-h-[44px] cursor-pointer hover:bg-primary/20 transition-colors"
          >
            Nächste Ebene aufdecken →
          </button>
        )}
      </div>
    </div>
  );
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function countVisiblePermutations(n: number, levels: number): number {
  // Bei L aufgedeckten Ebenen sieht man die Verzweigungen bis Ebene L
  // Ebene 1: n Äste, Ebene 2: n*(n-1) Äste, etc.
  let count = 1;
  for (let i = 0; i < levels; i++) count *= (n - i);
  return count;
}

function renderBranches(
  nodes: TreeNode[],
  level: number,
  revealLevel: number,
  maxDepth: number,
  compact: boolean,
): React.ReactNode[] {
  const rows: React.ReactNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.children.length === 0) {
      // Blatt — eine komplette Permutation
      rows.push(
        <PermutationRow
          key={node.path.join('-')}
          path={node.path}
          revealLevel={revealLevel}
          maxDepth={maxDepth}
          compact={compact}
        />,
      );
    } else {
      const childRows = renderBranches(node.children, level + 1, revealLevel, maxDepth, compact);
      rows.push(...childRows);
    }
  }

  return rows;
}

function PermutationRow({
  path,
  revealLevel,
  maxDepth,
  compact,
}: {
  path: string[];
  revealLevel: number;
  maxDepth: number;
  compact: boolean;
}) {
  const isFullyRevealed = revealLevel >= maxDepth;
  const h = compact ? 'h-8' : 'h-10';

  return (
    <div className={`flex items-center gap-1 ${h} border-b border-border/30 last:border-b-0`}>
      {path.map((name, i) => {
        const revealed = i < revealLevel;
        const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
        const bg = LEVEL_BG[i % LEVEL_BG.length];

        return (
          <div key={i} className="flex-1 flex items-center justify-center gap-1">
            {i > 0 && (
              <svg width="16" height="12" className="shrink-0 text-border">
                <path d="M0 6 L16 6" stroke={revealed ? color : '#d1d5db'} strokeWidth="1.5" fill="none" />
                <path d="M12 3 L16 6 L12 9" stroke={revealed ? color : '#d1d5db'} strokeWidth="1.5" fill="none" />
              </svg>
            )}
            <span
              className={`inline-block px-2 py-0.5 rounded-lg font-bold text-center min-w-[40px] transition-all duration-300 ${
                compact ? 'text-xs' : 'text-sm'
              }`}
              style={{
                backgroundColor: revealed ? bg : '#f9fafb',
                color: revealed ? color : '#d1d5db',
                border: `1.5px solid ${revealed ? color : '#e5e7eb'}`,
              }}
            >
              {revealed ? name : '?'}
            </span>
          </div>
        );
      })}
      {/* Ergebnis-Pfeil + Reihenfolge */}
      <div className="w-24 flex items-center gap-1">
        <svg width="16" height="12" className="shrink-0">
          <path d="M0 6 L16 6" stroke={isFullyRevealed ? '#10b981' : '#d1d5db'} strokeWidth="1.5" />
          <path d="M12 3 L16 6 L12 9" stroke={isFullyRevealed ? '#10b981' : '#d1d5db'} strokeWidth="1.5" fill="none" />
        </svg>
        <span
          className={`text-xs font-semibold truncate ${isFullyRevealed ? 'text-success' : 'text-muted/30'}`}
        >
          {isFullyRevealed ? path.join(', ') : '...'}
        </span>
      </div>
    </div>
  );
}

/**
 * Hilfsfunktion: Extrahiert Elemente aus dem Aufgabentext.
 * Sucht nach Mustern wie "Lena, Tom und Mia" oder "A, B, C".
 */
export function extractElemente(text: string): string[] | null {
  // Pattern: "Name1, Name2 und Name3"
  const undMatch = text.match(/(\b[A-ZÄÖÜ][a-zäöüß]+)(?:,\s*(\b[A-ZÄÖÜ][a-zäöüß]+))*\s+und\s+(\b[A-ZÄÖÜ][a-zäöüß]+)/);
  if (undMatch) {
    const full = undMatch[0];
    const parts = full.replace(/\s+und\s+/, ', ').split(/,\s*/);
    if (parts.length >= 2 && parts.length <= 4) {
      return parts;
    }
  }

  // Pattern: "drei Freunde — Name1, Name2 und Name3"
  const dashMatch = text.match(/—\s*([A-ZÄÖÜ][a-zäöüß]+(?:,\s*[A-ZÄÖÜ][a-zäöüß]+)*\s+und\s+[A-ZÄÖÜ][a-zäöüß]+)/);
  if (dashMatch) {
    const parts = dashMatch[1].replace(/\s+und\s+/, ', ').split(/,\s*/);
    if (parts.length >= 2 && parts.length <= 4) {
      return parts;
    }
  }

  return null;
}
