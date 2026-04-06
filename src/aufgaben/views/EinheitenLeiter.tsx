import { Card } from '@/components/ui/Card';

interface Stufe {
  einheit: string;
  faktor: number | null; // Faktor zur naechsten kleineren Einheit
}

const KETTEN: Record<string, Stufe[]> = {
  laenge: [
    { einheit: 'km', faktor: 1000 },
    { einheit: 'm', faktor: 100 },
    { einheit: 'cm', faktor: 10 },
    { einheit: 'mm', faktor: null },
  ],
  gewicht: [
    { einheit: 't', faktor: 1000 },
    { einheit: 'kg', faktor: 1000 },
    { einheit: 'g', faktor: null },
  ],
  volumen: [
    { einheit: 'l', faktor: 1000 },
    { einheit: 'ml', faktor: null },
  ],
};

/** Mapping: stageId -> Ketten-Schluessel. */
const STAGE_KETTE: Record<string, string> = {
  'gewichte-t-kg': 'gewicht',
  'liter-milliliter': 'volumen',
};

/**
 * Erkennt die passende Einheiten-Kette anhand von stageId oder Aufgabentext.
 * Gibt null zurueck wenn keine Umrechnung erkannt wird.
 */
export function detectEinheitenKette(
  stageId: string,
  text: string,
): { kette: Stufe[]; aktiv: Set<string> } | null {
  let kettenId = STAGE_KETTE[stageId];

  // Fallback: aus Text erkennen
  if (!kettenId) {
    const hatLaenge =
      /\d\s*(?:km|cm|mm)\b/.test(text) ||
      /(?:Kilometer|Zentimeter|Millimeter)/.test(text);
    const hatGewicht =
      /\d\s*(?:kg|g)\b/.test(text) || /(?:Kilogramm|Gramm|Tonne)/.test(text);
    const hatVolumen =
      /\d\s*ml\b/.test(text) || /(?:Milliliter|Liter)/.test(text);

    if (hatGewicht) kettenId = 'gewicht';
    else if (hatVolumen) kettenId = 'volumen';
    else if (hatLaenge) kettenId = 'laenge';
  }

  if (!kettenId) return null;
  const kette = KETTEN[kettenId];

  // Aktive Einheiten aus dem Text erkennen
  const aktiv = new Set<string>();
  for (const stufe of kette) {
    // "t" braucht Sonderbehandlung wegen Kurzform
    if (stufe.einheit === 't') {
      if (/\d\s*t\b/.test(text) || /\bTonne/.test(text)) aktiv.add('t');
    } else {
      const pat = new RegExp(`\\d\\s*${stufe.einheit}\\b|\\b${stufe.einheit}\\b`);
      if (pat.test(text)) aktiv.add(stufe.einheit);
    }
  }

  // Bei explizitem Stage alle Stufen aktiv setzen
  if (aktiv.size < 2 && STAGE_KETTE[stageId]) {
    for (const s of kette) aktiv.add(s.einheit);
  }

  if (aktiv.size < 2) return null;
  return { kette, aktiv };
}

/**
 * Visuelle Einheiten-Stufenleiter: zeigt die Umrechnungskette als horizontale Treppe.
 * Aktive Einheiten sind hervorgehoben, Pfeile zeigen den Faktor.
 */
export function EinheitenLeiter({
  kette,
  aktiv,
}: {
  kette: Stufe[];
  aktiv: Set<string>;
}) {
  return (
    <Card className="py-2 px-3">
      <div className="flex items-center justify-center gap-0">
        {kette.map((stufe, i) => {
          const isAktiv = aktiv.has(stufe.einheit);
          const showPfeil = stufe.faktor !== null && i < kette.length - 1;

          return (
            <div key={stufe.einheit} className="flex items-center">
              {/* Einheiten-Box */}
              <div
                className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 min-w-[44px] min-h-[44px] border-2 transition-colors ${
                  isAktiv
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'bg-card text-muted border-border'
                }`}
              >
                <span className="text-sm font-bold">{stufe.einheit}</span>
              </div>

              {/* Pfeil mit Faktor */}
              {showPfeil && (
                <div className="flex flex-col items-center mx-1">
                  <span className="text-[9px] font-semibold text-primary whitespace-nowrap">
                    {'\u00d7'}{stufe.faktor!.toLocaleString('de-DE')}
                  </span>
                  <svg
                    width="28"
                    height="12"
                    viewBox="0 0 28 12"
                    className="text-primary"
                  >
                    <path
                      d="M2 6H22M22 6L17 2M22 6L17 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <span className="text-[9px] font-semibold text-muted whitespace-nowrap">
                    {'\u00f7'}{stufe.faktor!.toLocaleString('de-DE')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
