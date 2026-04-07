/**
 * Gemeinsame Hilfsfunktionen fuer das Aufgaben-Parsing.
 * Einmal definiert, ueberall genutzt — keine Duplikation in den Views.
 */

/** Ergebnis von splitTeilaufgaben(). */
export interface TeilaufgabenSplit {
  intro: string;
  items: { label: string; text: string }[];
}

/**
 * Splittet einen Text auf a)/b)/c) Teilaufgaben.
 * Gibt den Intro-Text (vor den Items) und die Items zurueck.
 */
export function splitTeilaufgaben(text: string): TeilaufgabenSplit {
  const parts = text.split(/^([a-z])\)\s*/m);
  // parts[0] = intro, parts[1] = "a", parts[2] = text_a, parts[3] = "b", parts[4] = text_b, ...

  if (parts.length < 3) {
    return { intro: text.trim(), items: [] };
  }

  const intro = parts[0].trim();
  const items: { label: string; text: string }[] = [];

  for (let i = 1; i < parts.length - 1; i += 2) {
    const label = parts[i];
    const itemText = parts[i + 1]?.trim() ?? '';
    if (label && itemText) {
      items.push({ label, text: itemText });
    }
  }

  return { intro, items };
}

/**
 * Splittet einen Text auf Strichlisten-Items (- text).
 * Gibt nur die Zeilen zurueck, die mit "- " beginnen.
 */
export function splitStrichliste(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

/**
 * Normalisiert eine Antwort fuer Vergleich.
 * Zahlen: Entfernt Tausendertrennpunkte, wandelt Komma in Punkt,
 *         strippt Einheiten (km, kg, €, l, etc.).
 * Text:   Extrahiert Wert nach "=" (z.B. "N = Norden" → "norden"),
 *         vergleicht case-insensitive.
 */
export function normalizeZahl(input: string): string {
  const trimmed = input.trim();

  // Klammern und Probe-/Kontrolltexte entfernen bevor Wert extrahiert wird
  const cleaned = trimmed
    .replace(/\s*\(.*?\)\s*/g, ' ')       // (Kontrolle: ...) entfernen
    .replace(/\s*[✓✗].*$/, '')             // ✓/✗ und Folgetext entfernen
    .replace(/\.\s*Probe:.*$/i, '')        // ". Probe: ..." entfernen
    .replace(/\s*→.*$/, '')                // "→ <" etc. entfernen
    .trim();

  // "X = Y" Pattern: Wert nach dem letzten "=" extrahieren
  const eqParts = cleaned.split('=');
  const valueStr = eqParts.length > 1 ? eqParts[eqParts.length - 1].trim() : cleaned;

  // Zahl extrahieren falls vorhanden
  const zahlenMatch = valueStr.match(/-?[\d.,]+/);
  if (zahlenMatch) return zahlenMatch[0].replace(/\./g, '').replace(',', '.');

  // Textantwort: case-insensitive normalisieren
  return valueStr.toLowerCase();
}

/**
 * Extrahiert den Anweisungstext aus einer Aufgabenstellung.
 * Das ist der Text vor den a)/b)/c) Items oder Strichlisten.
 * Bei Strichlisten: alles vor dem ersten "- ".
 */
export function extractAnweisung(aufgabenstellung: string): string {
  // Check for a)/b)/c) items first
  const abcSplit = splitTeilaufgaben(aufgabenstellung);
  if (abcSplit.items.length > 0) {
    return abcSplit.intro;
  }

  // Check for Strichlisten
  const lines = aufgabenstellung.split('\n');
  const firstListIdx = lines.findIndex((l) => l.trim().startsWith('- '));
  if (firstListIdx > 0) {
    return lines.slice(0, firstListIdx).join('\n').trim();
  }

  // No structured items found — full text is anweisung
  return aufgabenstellung.trim();
}

/**
 * Extrahiert die Antwort aus einem Loesungs-String.
 * Typisch: "40 · 10 = 400" -> "400" oder "28 km" -> "28"
 * Strippt Einheiten (km, kg, €, l, etc.) automatisch.
 */
export function extractAntwortAusLoesung(loesungZeile: string): string {
  const trimmed = loesungZeile.trim();

  // Pattern: "= ZAHL [Einheit]" am Ende
  const eqMatch = trimmed.match(/=\s*([\d.,]+)/);
  if (eqMatch) return eqMatch[1];

  // Uhrzeit-Pattern "HH:MM" (vor colonMatch, da : sonst als Trenner greift)
  const zeitMatch = trimmed.match(/(\d{1,2}:\d{2})/);
  if (zeitMatch) return zeitMatch[1];

  // Bruch-Pattern "Z/N" (z.B. "1/2", "3/4")
  const bruchMatch = trimmed.match(/(\d+\/\d+)/);
  if (bruchMatch) return bruchMatch[1];

  // Pattern: "Summe: 611" oder "Ergebnis: 12"
  const colonMatch = trimmed.match(/:\s*([\d.,]+)/);
  if (colonMatch) return colonMatch[1];

  // Erste Zahl im String (strippt Einheiten wie "28 km", "14,5 €")
  const firstNum = trimmed.match(/^-?([\d.,]+)/);
  if (firstNum) return firstNum[0];

  // Letzte Zahl im String als Fallback
  const lastNum = trimmed.match(/([\d.,]+)\s*\S*\s*$/);
  if (lastNum) return lastNum[1];

  return trimmed;
}

/**
 * Filtert einen Tipp-Text fuer eine bestimmte Teilaufgabe (label).
 * - Zeilen mit passendem Label (z.B. "a)") werden behalten, Label wird entfernt
 * - Zeilen mit anderem Label werden entfernt
 * - Zeilen ohne Label (allgemeiner Text) bleiben erhalten
 * - Falls keine Labels im Text: unveraendert zurueckgeben
 */
export function filterTippForLabel(text: string, label: string): string {
  const lines = text.split('\n');
  const hasAnyLabel = lines.some((l) => /^\s*[-•*]?\s*[a-z]\)/.test(l.trim()));
  if (!hasAnyLabel) return text;

  // Abschnitts-basierte Filterung: Zeilen gehoeren zum letzten gesehenen Label.
  // Zeilen VOR dem ersten Label sind "Intro" und werden immer gezeigt.
  const introLines: string[] = [];
  const labelSections: Record<string, string[]> = {};
  let currentSection: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^[-•*]?\s*([a-z])\)\s*/);
    if (match) {
      currentSection = match[1];
      if (!labelSections[currentSection]) labelSections[currentSection] = [];
      // Zeile ohne Label-Prefix speichern
      const content = trimmed.replace(/^[-•*]?\s*[a-z]\)\s*/, '');
      if (content) labelSections[currentSection].push(content);
    } else if (currentSection) {
      // Folgezeile gehoert zum aktuellen Abschnitt
      labelSections[currentSection].push(line);
    } else {
      // Vor dem ersten Label = Intro
      introLines.push(line);
    }
  }

  const sectionContent = labelSections[label] ?? [];
  const parts = [...introLines];
  if (sectionContent.length > 0) parts.push(...sectionContent);

  return parts.join('\n').trim();
}

/**
 * Prueft ob ein Text eine Markdown-Tabelle enthaelt.
 */
export function hatTabelle(text: string): boolean {
  return /^\|.+\|$/m.test(text);
}

/**
 * Prueft ob ein Text Strichlisten-Items enthaelt.
 */
export function hatStrichliste(text: string): boolean {
  return /^- .+/m.test(text);
}

/**
 * Prueft ob ein Text eine Rechenkette (Chain-Notation) enthaelt.
 */
export function hatRechenkette(text: string): boolean {
  return /→/.test(text) && /[+\-·:×÷]/.test(text);
}