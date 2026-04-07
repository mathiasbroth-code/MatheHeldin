import { Card } from '@/components/ui/Card';

export interface RoutenDaten {
  stationen: string[];
  /** Entfernung pro Segment. null = unbekannt (gesuchte Strecke). */
  strecken: (number | null)[];
  einheit: string;
}

interface Segment {
  von: string;
  nach: string;
  dist: number;
  einheit: string;
}

/**
 * Extrahiert Pfeil-Segmente ("Ort1 → Ort2: X km") aus dem Text.
 */
function extractSegments(text: string): Segment[] {
  const segments: Segment[] = [];

  for (const line of text.split('\n')) {
    // Erkennt "Ort1 → Ort2: 2,8 km" UND "Ort1 → Ort2: ? km"
    const match = line.match(
      /(?:^[-•*]\s*|^\s*)(.+?)\s*→\s*(.+?):\s*([\d.,]+|\?)\s*(km|m)\b/,
    );
    if (!match) continue;

    const von = match[1].replace(/^[a-z]\)\s*/i, '').trim();
    const nach = match[2].trim();
    const isUnbekannt = match[3] === '?';
    const raw = isUnbekannt ? 'NaN' : match[3].replace(/\./g, '').replace(',', '.');
    const dist = isUnbekannt ? NaN : parseFloat(raw);

    segments.push({ von, nach, dist: isUnbekannt ? 0 : dist, einheit: match[4] });
  }

  return segments;
}

/**
 * Parst Routendaten aus Aufgabentext.
 *
 * Erkennt zwei Muster:
 * 1. Vollstaendige Kette: alle Segmente A→B, B→C, C→D aufgelistet
 * 2. Lueckenhafte Route: Text nennt "Von A nach D ueber B und C",
 *    aber nicht alle Segmente sind aufgelistet (gesuchte = null)
 *
 * Gibt null zurueck wenn keine Route mit min. 3 Stationen erkannt wird.
 */
export function parseRoutenDaten(text: string): RoutenDaten | null {
  const segments = extractSegments(text);
  if (segments.length === 0) return null;

  // Fall 1: Zusammenhaengende Kette (alle Segmente vorhanden)
  if (segments.length >= 2) {
    let connected = true;
    for (let i = 1; i < segments.length; i++) {
      if (segments[i].von !== segments[i - 1].nach) {
        connected = false;
        break;
      }
    }

    if (connected) {
      return {
        stationen: [segments[0].von, ...segments.map((s) => s.nach)],
        strecken: segments.map((s) => s.dist === 0 ? null : s.dist),
        einheit: segments[0].einheit,
      };
    }
  }

  // Fall 2: Route mit Luecken — "Von X nach Y ... ueber Z und W"
  const vonNachMatch = text.match(
    /[Vv]on\s+([A-ZÄÖÜ][a-zäöüß]+)\s+nach\s+([A-ZÄÖÜ][a-zäöüß]+)/,
  );
  const ueberMatch = text.match(/über\s+(.+?)(?:\.\s|\n|$)/);

  if (vonNachMatch && ueberMatch) {
    const start = vonNachMatch[1];
    const end = vonNachMatch[2];
    const viaStations = ueberMatch[1]
      .split(/\s*(?:,\s*|\s+und\s+)/)
      .map((s) => s.trim())
      .filter(Boolean);

    const allStations = [start, ...viaStations, end];
    if (allStations.length < 3) return null;

    // Bekannte Distanzen zuordnen, Luecken als null
    const strecken: (number | null)[] = [];
    for (let i = 0; i < allStations.length - 1; i++) {
      const seg = segments.find(
        (s) => s.von === allStations[i] && s.nach === allStations[i + 1],
      );
      strecken.push(seg ? seg.dist : null);
    }

    // Mindestens ein bekanntes und ein unbekanntes Segment
    const bekannt = strecken.filter((s) => s !== null).length;
    if (bekannt >= 1 && bekannt < strecken.length) {
      return { stationen: allStations, strecken, einheit: segments[0].einheit };
    }
  }

  return null;
}

/**
 * Visuelle Routen-Darstellung: Horizontale Linie mit Stationen und Entfernungen.
 * Unbekannte Segmente werden als "?" in Warnfarbe dargestellt.
 */
export function RoutenDiagramm({ stationen, strecken, einheit }: RoutenDaten) {
  const n = stationen.length;
  const pad = 8;
  const positions = stationen.map(
    (_, i) => pad + (i / (n - 1)) * (100 - 2 * pad),
  );

  return (
    <Card>
      <div className="relative" style={{ height: n > 5 ? 76 : 68 }}>
        {/* Verbindungslinie */}
        <div
          className="absolute h-1 bg-border rounded"
          style={{ top: 24, left: `${pad}%`, right: `${pad}%` }}
        />

        {/* Entfernungs-Labels zwischen Stationen */}
        {strecken.map((dist, i) => {
          const midPos = (positions[i] + positions[i + 1]) / 2;
          const isUnknown = dist === null;
          const formatted = isUnknown
            ? '?'
            : dist % 1 === 0
              ? dist.toLocaleString('de-DE')
              : dist.toLocaleString('de-DE', { minimumFractionDigits: 1 });
          return (
            <div
              key={`d-${i}`}
              className="absolute flex items-center justify-center"
              style={{
                left: `${midPos}%`,
                top: 4,
                transform: 'translateX(-50%)',
              }}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isUnknown
                    ? 'text-warning bg-warning-bg border border-warning/30'
                    : 'text-primary bg-primary-light'
                }`}
              >
                {isUnknown ? '?' : `${formatted} ${einheit}`}
              </span>
            </div>
          );
        })}

        {/* Stations-Punkte + Namen */}
        {stationen.map((name, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: `${positions[i]}%`,
              top: 20,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="w-4 h-4 bg-primary border-2 border-white rounded-full shadow-sm" />
            <span className="mt-1 text-[10px] font-semibold text-heading bg-white px-0.5 rounded whitespace-nowrap max-w-[72px] truncate text-center">
              {name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
