/**
 * Maßstab-Visualisierung: Zeigt Vergrößerung/Verkleinerung als Größenvergleich.
 * Erkennt Objekt + Maßstab aus dem Aufgabentext. Wird nur nach richtiger Antwort gezeigt.
 */

interface MassstabVergleichProps {
  faktor: number;
  label?: string;
  emoji?: string;
  objektName?: string;
}

/** Erkennt Objekt im Text und liefert passendes Emoji */
function detectObjekt(text: string): { emoji: string; name: string } {
  const lower = text.toLowerCase();
  if (/marienkäfer|käfer/.test(lower)) return { emoji: '🐞', name: 'Käfer' };
  if (/insekt|ameise/.test(lower)) return { emoji: '🐜', name: 'Insekt' };
  if (/schmetterling/.test(lower)) return { emoji: '🦋', name: 'Schmetterling' };
  if (/blatt|pflanze/.test(lower)) return { emoji: '🌿', name: 'Blatt' };
  if (/tisch/.test(lower)) return { emoji: '🪑', name: 'Tisch' };
  if (/schrank/.test(lower)) return { emoji: '🗄️', name: 'Schrank' };
  if (/zimmer|raum|klasse/.test(lower)) return { emoji: '🏠', name: 'Raum' };
  if (/schul/.test(lower)) return { emoji: '🏫', name: 'Schule' };
  if (/haus|gebäude/.test(lower)) return { emoji: '🏢', name: 'Gebäude' };
  if (/auto/.test(lower)) return { emoji: '🚗', name: 'Auto' };
  if (/karte|plan/.test(lower)) return { emoji: '🗺️', name: 'Karte' };
  if (/lupe/.test(lower)) return { emoji: '🔍', name: 'Lupe' };
  return { emoji: '📐', name: 'Objekt' };
}

export function parseMassstab(text: string): MassstabVergleichProps | null {
  const match = text.match(/[Mm]a(?:ß|ss)stab\s+(\d+)\s*:\s*(\d+)/);
  if (!match) return null;

  const links = parseInt(match[1], 10);
  const rechts = parseInt(match[2], 10);
  if (!links || !rechts) return null;

  const faktor = links / rechts;
  const objekt = detectObjekt(text);
  return { faktor, label: `${links} : ${rechts}`, emoji: objekt.emoji, objektName: objekt.name };
}

export function MassstabVergleich({ faktor, label, emoji = '📐', objektName = 'Objekt' }: MassstabVergleichProps) {
  const istVergroesserung = faktor > 1;
  const verhaeltnis = Math.max(faktor, 1 / faktor);

  // Emoji-Größen berechnen
  const kleinSize = 20;
  const grossSize = Math.min(kleinSize * verhaeltnis, 80);
  const realSize = istVergroesserung ? kleinSize : grossSize;
  const bildSize = istVergroesserung ? grossSize : kleinSize;

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {/* Echt */}
      <div className="flex flex-col items-center gap-1">
        <span style={{ fontSize: `${realSize}px`, lineHeight: 1 }}>{emoji}</span>
        <span className="text-[9px] text-muted font-medium">{objektName} (echt)</span>
      </div>

      {/* Pfeil + Maßstab */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-bold text-primary">{label}</span>
        <span className="text-base text-primary">→</span>
        <span className="text-[9px] text-muted">
          {istVergroesserung ? `${verhaeltnis}× größer` : `${verhaeltnis}× kleiner`}
        </span>
      </div>

      {/* Bild */}
      <div className="flex flex-col items-center gap-1">
        <span style={{ fontSize: `${bildSize}px`, lineHeight: 1 }}>{emoji}</span>
        <span className="text-[9px] text-primary font-semibold">Bild</span>
      </div>
    </div>
  );
}
