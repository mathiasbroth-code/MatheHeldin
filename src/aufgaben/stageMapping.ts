import type { StageFarbe } from '@/stages/types';

/** Fredo-Buchkategorien für die Übersicht. */
export type Kategorie =
  | 'wiederholung'
  | 'zahlen'
  | 'rechnen-add-sub'
  | 'geometrie'
  | 'multiplikation'
  | 'groessen'
  | 'daten-zufall'
  | 'division'
  | 'brueche-masse'
  | 'kreise-koerper'
  | 'sachrechnen'
  | 'massstab'
  | 'schaubilder'
  | 'forscherkiste';

export interface KategorieMeta {
  id: Kategorie;
  titel: string;
  farbe: StageFarbe;
  sortierung: number;
}

export const KATEGORIEN: KategorieMeta[] = [
  { id: 'wiederholung', titel: 'Wiederholung', farbe: 'sky', sortierung: 1 },
  { id: 'zahlen', titel: 'Zahlen bis zur Million', farbe: 'sky', sortierung: 2 },
  { id: 'rechnen-add-sub', titel: 'Addition & Subtraktion', farbe: 'amber', sortierung: 3 },
  { id: 'geometrie', titel: 'Geometrie', farbe: 'indigo', sortierung: 4 },
  { id: 'multiplikation', titel: 'Multiplikation', farbe: 'amber', sortierung: 5 },
  { id: 'groessen', titel: 'Größen & Skizzen', farbe: 'emerald', sortierung: 6 },
  { id: 'daten-zufall', titel: 'Daten & Zufall', farbe: 'purple', sortierung: 7 },
  { id: 'division', titel: 'Division', farbe: 'amber', sortierung: 8 },
  { id: 'brueche-masse', titel: 'Brüche & Maße', farbe: 'emerald', sortierung: 9 },
  { id: 'kreise-koerper', titel: 'Kreise & Körper', farbe: 'indigo', sortierung: 10 },
  { id: 'sachrechnen', titel: 'Sachrechnen', farbe: 'emerald', sortierung: 11 },
  { id: 'massstab', titel: 'Maßstab & Orientierung', farbe: 'indigo', sortierung: 12 },
  { id: 'schaubilder', titel: 'Schaubilder & Daten', farbe: 'purple', sortierung: 13 },
  { id: 'forscherkiste', titel: 'Forscherkiste', farbe: 'rose', sortierung: 14 },
];

export interface StageMappingEntry {
  stageId: string;
  titel: string;
  kategorie: Kategorie;
  sortierung: number;
  icon: string;
}

/**
 * Mapping: stage_id → buchnaher Titel + Kategorie + Sortierung.
 * Sortierung innerhalb der Kategorie nach Buchseite.
 */
export const STAGE_MAPPING: StageMappingEntry[] = [
  // ── Wiederholung (Kap. 1, S. 6–17) ──
  { stageId: 'bis2000lesen', titel: '1.000 und weiter', kategorie: 'wiederholung', sortierung: 1, icon: '📖' },
  { stageId: 'stellenwerttafel', titel: 'Stellenwerttafel', kategorie: 'wiederholung', sortierung: 2, icon: '📊' },
  { stageId: 'rechnen-bis-2000', titel: 'Rechnen bis 2.000', kategorie: 'wiederholung', sortierung: 3, icon: '🧮' },
  { stageId: 'schriftlich-addieren', titel: 'Schriftlich Addieren', kategorie: 'wiederholung', sortierung: 4, icon: '➕' },
  { stageId: 'schriftlich-subtrahieren', titel: 'Schriftlich Subtrahieren', kategorie: 'wiederholung', sortierung: 5, icon: '➖' },
  { stageId: 'halbschriftlich-multiplizieren-intro', titel: 'Große Zahlen multiplizieren', kategorie: 'wiederholung', sortierung: 6, icon: '✖️' },
  { stageId: 'sachaufgaben-tiere', titel: 'Tierische Rechengeschichten', kategorie: 'wiederholung', sortierung: 7, icon: '🐾' },
  { stageId: 'sachaufgaben-alltag', titel: 'Rechengeschichten', kategorie: 'wiederholung', sortierung: 8, icon: '📝' },

  // ── Zahlen bis zur Million (Kap. 2, S. 18–33) ──
  { stageId: 'millionen-wuerfel', titel: 'Der Millionen-Würfel', kategorie: 'zahlen', sortierung: 1, icon: '🎲' },
  { stageId: 'zahlen-lesen-schreiben', titel: 'Zahlen sprechen & schreiben', kategorie: 'zahlen', sortierung: 2, icon: '✍️' },
  { stageId: 'zerlegen-gross', titel: 'Zahlen zerlegen', kategorie: 'zahlen', sortierung: 3, icon: '✂️' },
  { stageId: 'zahlen-vergleichen', titel: 'Zahlen vergleichen', kategorie: 'zahlen', sortierung: 4, icon: '⚖️' },
  { stageId: 'kopfrechnen-gross', titel: 'Rechnen im Kopf', kategorie: 'zahlen', sortierung: 5, icon: '🧠' },
  { stageId: 'schaetzen', titel: 'Große Anzahlen schätzen', kategorie: 'zahlen', sortierung: 6, icon: '🔍' },
  { stageId: 'zahlenstrahl-gross', titel: 'Zahlen am Zahlenstrahl', kategorie: 'zahlen', sortierung: 7, icon: '📏' },
  { stageId: 'nachbarzahlen', titel: 'Nachbarzahlen', kategorie: 'zahlen', sortierung: 8, icon: '↔️' },
  { stageId: 'runden', titel: 'Runden', kategorie: 'zahlen', sortierung: 9, icon: '🔄' },
  { stageId: 'runden-zahlenstrahl', titel: 'Runden & Darstellen', kategorie: 'zahlen', sortierung: 10, icon: '📐' },

  // ── Addition & Subtraktion (Kap. 3, S. 34–45) ──
  { stageId: 'kopfrechnen-addsub', titel: 'Rechnen im Kopf', kategorie: 'rechnen-add-sub', sortierung: 1, icon: '🧠' },
  { stageId: 'schriftlich-addsub-gross', titel: 'Addieren & Subtrahieren', kategorie: 'rechnen-add-sub', sortierung: 2, icon: '📝' },
  { stageId: 'anna-zahlen', titel: 'ANNA-Zahlen', kategorie: 'rechnen-add-sub', sortierung: 3, icon: '🔢' },
  { stageId: 'ueberschlag-geld', titel: 'Geldbeträge überschlagen', kategorie: 'rechnen-add-sub', sortierung: 4, icon: '💶' },
  { stageId: 'ergebnis-pruefen', titel: 'Ergebnisse prüfen', kategorie: 'rechnen-add-sub', sortierung: 5, icon: '✅' },
  { stageId: 'rechenketten', titel: 'Rechenketten', kategorie: 'rechnen-add-sub', sortierung: 6, icon: '🔗' },
  { stageId: 'zahlenraetsel', titel: 'Zahlenrätsel', kategorie: 'rechnen-add-sub', sortierung: 7, icon: '❓' },
  { stageId: 'rechenregeln', titel: 'Rechenregeln', kategorie: 'rechnen-add-sub', sortierung: 8, icon: '📋' },
  { stageId: 'gleichungen', titel: 'Gleichungen', kategorie: 'rechnen-add-sub', sortierung: 9, icon: '⚖️' },

  // ── Geometrie (Kap. 4, S. 46–53) ──
  { stageId: 'achsensymmetrie', titel: 'Achsensymmetrie', kategorie: 'geometrie', sortierung: 1, icon: '🦋' },
  { stageId: 'faltschnitte', titel: 'Faltschnitte', kategorie: 'geometrie', sortierung: 2, icon: '✂️' },
  { stageId: 'flaecheninhalt-umfang', titel: 'Fläche & Umfang', kategorie: 'geometrie', sortierung: 3, icon: '📐' },

  // ── Multiplikation (Kap. 5, S. 54–63) ──
  { stageId: 'kopfrechnen-multiplikation', titel: 'Multiplizieren im Kopf', kategorie: 'multiplikation', sortierung: 1, icon: '🧠' },
  { stageId: 'kopfrechnen-division', titel: 'Dividieren im Kopf', kategorie: 'multiplikation', sortierung: 2, icon: '➗' },
  { stageId: 'halbschriftlich-multiplizieren', titel: 'Halbschriftlich Multiplizieren', kategorie: 'multiplikation', sortierung: 3, icon: '✖️' },
  { stageId: 'schriftlich-multiplizieren-1', titel: 'Schriftlich Multiplizieren', kategorie: 'multiplikation', sortierung: 4, icon: '📝' },
  { stageId: 'schriftlich-multiplizieren-2', titel: 'Multiplizieren vertiefen', kategorie: 'multiplikation', sortierung: 5, icon: '📝' },
  { stageId: 'schriftlich-multiplizieren-3', titel: 'Mehrstellig Multiplizieren', kategorie: 'multiplikation', sortierung: 6, icon: '🔢' },

  // ── Größen & Skizzen (Kap. 6, S. 64–71) ──
  { stageId: 'gewichte-t-kg', titel: 'Tonne und Kilogramm', kategorie: 'groessen', sortierung: 1, icon: '⚖️' },
  { stageId: 'tierische-weltrekorde', titel: 'Tierische Weltrekorde', kategorie: 'groessen', sortierung: 2, icon: '🦒' },
  { stageId: 'entfernungen-km', titel: 'Entfernungen', kategorie: 'groessen', sortierung: 3, icon: '🗺️' },
  { stageId: 'geschwindigkeiten', titel: 'Geschwindigkeiten', kategorie: 'groessen', sortierung: 4, icon: '🏎️' },
  { stageId: 'skizze', titel: 'Lösungshilfe: Skizze', kategorie: 'groessen', sortierung: 5, icon: '✏️' },

  // ── Daten & Zufall (Kap. 7, S. 72–77) ──
  { stageId: 'kombinatorik', titel: 'Wie viele Möglichkeiten?', kategorie: 'daten-zufall', sortierung: 1, icon: '🎲' },
  { stageId: 'wahrscheinlichkeit', titel: 'Alles Zufall?', kategorie: 'daten-zufall', sortierung: 2, icon: '🎯' },
  { stageId: 'haeufigkeitsanalyse', titel: 'Buchstaben zählen', kategorie: 'daten-zufall', sortierung: 3, icon: '📊' },

  // ── Division (Kap. 8, S. 78–91) ──
  { stageId: 'vielfache', titel: 'Vielfache', kategorie: 'division', sortierung: 1, icon: '🔢' },
  { stageId: 'teiler', titel: 'Teiler', kategorie: 'division', sortierung: 2, icon: '➗' },
  { stageId: 'halbschriftlich-dividieren', titel: 'Halbschriftlich Dividieren', kategorie: 'division', sortierung: 3, icon: '📝' },
  { stageId: 'halbschriftlich-dividieren-2', titel: 'Dividieren vertiefen', kategorie: 'division', sortierung: 4, icon: '📝' },
  { stageId: 'teilbarkeitsregeln', titel: 'Teilbarkeitsregeln', kategorie: 'division', sortierung: 5, icon: '📋' },
  { stageId: 'schriftlich-dividieren-1', titel: 'Schriftlich Dividieren', kategorie: 'division', sortierung: 6, icon: '✍️' },
  { stageId: 'schriftlich-dividieren-2', titel: 'Dividieren vertiefen', kategorie: 'division', sortierung: 7, icon: '✍️' },
  { stageId: 'rechnen-kommazahlen', titel: 'Rechnen mit Kommazahlen', kategorie: 'division', sortierung: 8, icon: '💰' },
  { stageId: 'sponsorenlauf', titel: 'Sponsorenlauf', kategorie: 'division', sortierung: 9, icon: '🏃' },

  // ── Brüche & Maße (Kap. 9, S. 92–103) ──
  { stageId: 'einfache-brueche', titel: 'Einfache Brüche', kategorie: 'brueche-masse', sortierung: 1, icon: '🍕' },
  { stageId: 'liter-milliliter', titel: 'Liter und Milliliter', kategorie: 'brueche-masse', sortierung: 2, icon: '🥛' },
  { stageId: 'rauminhalt', titel: 'Rauminhalt', kategorie: 'brueche-masse', sortierung: 3, icon: '📦' },
  { stageId: 'masseinheiten', titel: 'Maßeinheiten', kategorie: 'brueche-masse', sortierung: 4, icon: '📏' },
  { stageId: 'millionen-fragen', titel: 'Millionen-Fragen', kategorie: 'brueche-masse', sortierung: 5, icon: '❓' },

  // ── Kreise & Körper (Kap. 10, S. 104–111) ──
  { stageId: 'parkettierungen', titel: 'Parkettierungen', kategorie: 'kreise-koerper', sortierung: 1, icon: '🔷' },
  { stageId: 'koerpernetze', titel: 'Körpernetze', kategorie: 'kreise-koerper', sortierung: 2, icon: '📦' },
  { stageId: 'schraegbilder', titel: 'Schrägbilder', kategorie: 'kreise-koerper', sortierung: 3, icon: '🎨' },

  // ── Sachrechnen (Kap. 11, S. 112–115) ──
  { stageId: 'sachaufgaben-schwimmbad', titel: 'Schwimmbad-Aufgaben', kategorie: 'sachrechnen', sortierung: 1, icon: '🏊' },
  { stageId: 'loesungshilfen', titel: 'Lösungshilfen', kategorie: 'sachrechnen', sortierung: 2, icon: '💡' },

  // ── Maßstab & Orientierung (Kap. 12, S. 116–121) ──
  { stageId: 'massstab', titel: 'Vergrößern & Verkleinern', kategorie: 'massstab', sortierung: 1, icon: '🔎' },
  { stageId: 'ansichten-grundriss', titel: 'Ansichten & Grundriss', kategorie: 'massstab', sortierung: 2, icon: '🏠' },
  { stageId: 'karten-orientierung', titel: 'Karten & Pläne', kategorie: 'massstab', sortierung: 3, icon: '🗺️' },

  // ── Schaubilder & Daten (Kap. 13, S. 122–129) ──
  { stageId: 'tabellen-diagramme', titel: 'Tabellen & Diagramme', kategorie: 'schaubilder', sortierung: 1, icon: '📊' },
  { stageId: 'roemische-zahlen', titel: 'Römische Zahlen', kategorie: 'schaubilder', sortierung: 2, icon: '🏛️' },
  { stageId: 'binaersystem', titel: 'Binärsystem', kategorie: 'schaubilder', sortierung: 3, icon: '💻' },
  { stageId: 'datenmengen', titel: 'Datenmengen', kategorie: 'schaubilder', sortierung: 4, icon: '📈' },

  // ── Forscherkiste (Kap. 14, S. 130–141) ──
  { stageId: 'rechenkuenstler', titel: 'Rechenkünstler', kategorie: 'forscherkiste', sortierung: 1, icon: '🎩' },
  { stageId: 'fibonacci', titel: 'Fibonacci-Folge', kategorie: 'forscherkiste', sortierung: 2, icon: '🐚' },
  { stageId: 'zahlenforscher', titel: 'Zahlenforscher', kategorie: 'forscherkiste', sortierung: 3, icon: '🔬' },
  { stageId: 'pascalsches-dreieck', titel: 'Pascalsches Dreieck', kategorie: 'forscherkiste', sortierung: 4, icon: '🔺' },
];

/** Lookup: stageId → Mapping-Eintrag. */
export function getStageMeta(stageId: string): StageMappingEntry | undefined {
  return STAGE_MAPPING.find((m) => m.stageId === stageId);
}

/** Lookup: stageId → Kategorie-Meta. */
export function getKategorieMeta(kategorie: Kategorie): KategorieMeta | undefined {
  return KATEGORIEN.find((k) => k.id === kategorie);
}
