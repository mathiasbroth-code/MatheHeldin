/**
 * Typspezifischer Parser: wandelt flache (aufgabenstellung, loesung) Strings
 * in strukturierte ParsedAufgabenDaten um. Jede View liest diese statt eigenes Parsing.
 */
import type {
  InteraktionsTyp,
  ParsedAufgabenDaten,
  EingabeDaten,
  SchrittDaten,
  LueckeDaten,
  AuswahlDaten,
  ZuordnungDaten,
  WahrFalschDaten,
  TextaufgabeDaten,
  ReihenfolgeDaten,
  TeilItem,
} from './types';
import {
  splitTeilaufgaben,
  splitStrichliste,
  extractAnweisung,
  extractAntwortAusLoesung,
  hatTabelle,
  hatStrichliste,
  hatRechenkette,
} from './parserHelpers';

// ── Dispatcher ──────────────────────────────────────────

/**
 * Parst aufgabenstellung + loesung in typspezifische Daten.
 * Gibt immer ein ParsedAufgabenDaten-Objekt zurueck — im Fehlerfall ein Fallback.
 */
export function parseDaten(
  typ: InteraktionsTyp | 'lücke',
  aufgabenstellung: string,
  loesung: string,
): ParsedAufgabenDaten {
  switch (typ) {
    case 'eingabe':
      return parseEingabeDaten(aufgabenstellung, loesung);
    case 'schritt':
      return parseSchrittDaten(aufgabenstellung, loesung);
    case 'luecke':
    case 'lücke':
      return parseLueckeDaten(aufgabenstellung, loesung);
    case 'auswahl':
      return parseAuswahlDaten(aufgabenstellung, loesung);
    case 'zuordnung':
      return parseZuordnungDaten(aufgabenstellung, loesung);
    case 'wahr-falsch':
      return parseWahrFalschDaten(aufgabenstellung, loesung);
    case 'textaufgabe':
      return parseTextaufgabeDaten(aufgabenstellung, loesung);
    case 'reihenfolge':
      return parseReihenfolgeDaten(aufgabenstellung, loesung);
  }
}

// ── Eingabe ─────────────────────────────────────────────

function parseEingabeDaten(aufgabenstellung: string, loesung: string): EingabeDaten {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    // Expand Paeckchen: if items have indented sub-lines, split them
    const expandedItems: TeilItem[] = [];
    for (const item of split.items) {
      const zeilen = item.text.split('\n').map((l) => l.trim()).filter(Boolean);
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const rawLoesungText = loesungItem?.text.split('\n')[0].trim() ?? '';
      // P4: If first line is just a header (ends with ":"), take the next non-empty line
      const loesungText = rawLoesungText.endsWith(':')
        ? (loesungItem?.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawLoesungText)
        : rawLoesungText;

      if (zeilen.length > 1 && loesungText.includes('/')) {
        // Paeckchen: multiple sub-answers separated by /
        const antworten = loesungText.split('/').map((a) => a.trim());
        zeilen.forEach((z, idx) => {
          expandedItems.push({
            label: `${item.label}${idx > 0 ? String(idx + 1) : ''}`,
            frage: z,
            antwort: antworten[idx] ?? '',
          });
        });
      } else {
        expandedItems.push({
          label: item.label,
          frage: zeilen[0],
          antwort: loesungText,
        });
      }
    }

    return {
      typ: 'eingabe',
      anweisung: split.intro,
      items: expandedItems,
    };
  }

  // Single item — no a)/b)/c)
  return {
    typ: 'eingabe',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort: loesung.split('\n')[0].trim() }],
  };
}

// ── Schritt (das Problemkind) ───────────────────────────

function parseSchrittDaten(aufgabenstellung: string, loesung: string): SchrittDaten {
  // Erkennungsreihenfolge nach Architektur-Dokument:
  // 1. Maltabelle (Markdown-Tabelle)
  // 2. Strichliste (- xxx = ___)
  // 3. Rechenkette (→)
  // 4. a)/b)/c) Teilaufgaben
  // 5. Nummerierte Schritte in der Loesung
  // 6. Ueberschlag + genau
  // 7. Fallback

  // 1. Maltabelle
  if (hatTabelle(aufgabenstellung)) {
    const result = parseMaltabelle(aufgabenstellung, loesung);
    if (result) return result;
  }

  // 2. Strichliste
  if (hatStrichliste(aufgabenstellung)) {
    const result = parseStrichliste(aufgabenstellung, loesung);
    if (result) return result;
  }

  // 3. Rechenkette
  if (hatRechenkette(loesung)) {
    const result = parseRechenkette(aufgabenstellung, loesung);
    if (result) return result;
  }

  // 4. a)/b)/c) Teilaufgaben
  const abcSplit = splitTeilaufgaben(aufgabenstellung);
  if (abcSplit.items.length > 0) {
    return parseSchrittAbc(aufgabenstellung, loesung, abcSplit);
  }

  // 5. Nummerierte Schritte in der Loesung
  const numSteps = parseNummerierteSchritte(loesung);
  if (numSteps.length > 1) {
    return {
      typ: 'schritt',
      anweisung: aufgabenstellung.trim(),
      teilaufgaben: [{
        label: '1',
        schritte: numSteps,
      }],
    };
  }

  // 6. Ueberschlag + genau in Loesung
  const ueberschlagResult = parseUeberschlagGenau(aufgabenstellung, loesung);
  if (ueberschlagResult) return ueberschlagResult;

  // 7. Fallback: single step
  // P4: header-line fix
  const rawFirst = loesung.split('\n')[0].trim();
  const fallbackAntwort = rawFirst.endsWith(':')
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
    : rawFirst;
  return {
    typ: 'schritt',
    anweisung: aufgabenstellung.trim(),
    teilaufgaben: [{
      label: '1',
      schritte: [{ label: '1', frage: aufgabenstellung.trim(), antwort: fallbackAntwort }],
    }],
  };
}

/** Variante A: Strichlisten-Schritte */
function parseStrichliste(aufgabenstellung: string, loesung: string): SchrittDaten | null {
  const aufgabeItems = splitStrichliste(aufgabenstellung);
  const loesungItems = splitStrichliste(loesung);

  if (aufgabeItems.length < 2) return null;

  const anweisung = extractAnweisung(aufgabenstellung);

  const schritte: TeilItem[] = aufgabeItems.map((item, idx) => {
    const loesungZeile = loesungItems[idx] ?? '';

    // Frage: aus der Aufgabenstellung (z.B. "40 · 10 = ___")
    // Clean: remove ___ placeholders, add = if needed
    let frage = item.replace(/___/g, '').trim();
    // If frage ends with "=", keep it
    if (!frage.endsWith('=') && !frage.endsWith(':')) {
      // Extract left side of equation
      const eqIdx = frage.indexOf('=');
      if (eqIdx > 0) {
        frage = frage.slice(0, eqIdx).trim() + ' =';
      }
    }
    // Clean up "Summe:" pattern
    if (frage.toLowerCase().startsWith('summe')) {
      frage = 'Summe:';
    }

    const antwort = extractAntwortAusLoesung(loesungZeile);

    return {
      label: String(idx + 1),
      frage,
      antwort,
    };
  });

  return {
    typ: 'schritt',
    anweisung,
    teilaufgaben: [{ label: '1', schritte }],
  };
}

/** Variante B: a)/b)/c) Teilaufgaben als Schritte */
function parseSchrittAbc(
  _aufgabenstellung: string,
  loesung: string,
  abcSplit: { intro: string; items: { label: string; text: string }[] },
): SchrittDaten {
  const loesungSplit = splitTeilaufgaben(loesung);

  // Check if Loesung has Ueberschlag-Pattern for any item
  const hatUeberschlag = loesungSplit.items.some(
    (item) => /[Üü]berschlag/i.test(item.text) && /genau/i.test(item.text)
  );

  const teilaufgaben = abcSplit.items.map((item) => {
    const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
    const loesungText = loesungItem?.text ?? loesung;

    if (hatUeberschlag) {
      // Ueberschlag + genau: 2 Schritte
      return parseUeberschlagTeilaufgabe(item, loesungText);
    }

    // Check if loesung has sub-steps (Strichlisten within this teilaufgabe)
    const subStrichliste = splitStrichliste(loesungText);
    if (subStrichliste.length > 1) {
      const schritte: TeilItem[] = subStrichliste.map((schritt, idx) => ({
        label: String(idx + 1),
        frage: schritt.replace(/=\s*[\d.,]+\s*$/, '= ?').trim(),
        antwort: extractAntwortAusLoesung(schritt),
      }));
      return { label: item.label, schritte };
    }

    // P6: Try to extract multiple steps from multi-line lösung
    const loesungLines = loesungText.split('\n').map(l => l.trim()).filter(Boolean);
    const calcLines = loesungLines.filter(l => /=/.test(l));
    if (calcLines.length > 1) {
      const schritte: TeilItem[] = calcLines.map((line, idx) => ({
        label: String(idx + 1),
        frage: line.replace(/=\s*[\d.,]+\s*$/, '= ?').trim(),
        antwort: extractAntwortAusLoesung(line),
      }));
      return { label: item.label, schritte };
    }

    // Single step per teilaufgabe
    const frage = item.text.split('\n')[0].trim();
    // P4: header-line fix
    const rawAntwort = loesungText.split('\n')[0].trim();
    const antwort = rawAntwort.endsWith(':')
      ? (loesungText.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawAntwort)
      : rawAntwort;
    return {
      label: item.label,
      schritte: [{ label: '1', frage, antwort }],
    };
  });

  return {
    typ: 'schritt',
    anweisung: abcSplit.intro,
    teilaufgaben,
  };
}

/** Variante C: Rechenkette */
function parseRechenkette(aufgabenstellung: string, loesung: string): SchrittDaten | null {
  const chainMatch = loesung.match(/[\d.,]+(?:\s*→\s*[+\-−·:×÷]\s*[\d.,]+\s*→\s*[\d.,]+)+/);
  if (!chainMatch) return null;

  const segments = chainMatch[0].split('→').map((s) => s.trim());
  const schritte: TeilItem[] = [];

  for (let i = 0; i < segments.length - 1; i += 2) {
    const start = segments[i];
    const op = segments[i + 1];
    const result = segments[i + 2];
    if (op && result && /^[+\-−·:×÷]/.test(op)) {
      const opParts = op.split(/\s+/);
      const opSymbol = opParts[0];
      const opValue = opParts.slice(1).join(' ');
      schritte.push({
        label: String(schritte.length + 1),
        frage: `${start} ${opSymbol} ${opValue} =`.trim(),
        antwort: result,
      });
    }
  }

  if (schritte.length === 0) return null;

  return {
    typ: 'schritt',
    anweisung: extractAnweisung(aufgabenstellung),
    teilaufgaben: [{ label: '1', schritte }],
  };
}

/** Variante D: Maltabelle */
function parseMaltabelle(aufgabenstellung: string, loesung: string): SchrittDaten | null {
  const lines = aufgabenstellung.split('\n');
  const tableLines = lines.filter((l) => l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/));

  if (tableLines.length < 2) return null;

  // Parse header row: | · | col1 | col2 |
  const headerCells = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
  if (headerCells.length < 2) return null;

  // Column headers (skip first cell which is · or similar)
  const colHeaders = headerCells.slice(1).map((c) => c.trim()).filter(Boolean);

  // Parse data rows: | row | val1 | val2 |
  const dataRows = tableLines.slice(1);
  const rowHeaders: string[] = [];
  for (const row of dataRows) {
    const cells = row.split('|').slice(1, -1).map((c) => c.trim());
    if (cells[0]) rowHeaders.push(cells[0]);
  }

  // Parse Loesung table if available
  const loesungTableLines = loesung
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/));

  const schritte: TeilItem[] = [];
  let stepIdx = 1;

  // Generate step items from row x col combinations
  // Skip the last row if it's a sum row (same as total)
  const calcRows = rowHeaders.filter((_, i) => i < rowHeaders.length - 1 || rowHeaders.length <= 2);

  for (const rowH of calcRows) {
    for (const colH of colHeaders) {
      // Find answer from loesung table
      let antwort = '';
      for (const loesungLine of loesungTableLines) {
        const cells = loesungLine.split('|').slice(1, -1).map((c) => c.replace(/\*\*/g, '').trim());
        if (cells[0]?.trim() === rowH) {
          // Find matching column
          const loesungHeader = loesungTableLines[0]?.split('|').slice(1, -1).map((c) => c.trim()) ?? [];
          const colIdx = loesungHeader.findIndex((h) => h === colH);
          if (colIdx >= 0 && cells[colIdx]) {
            antwort = cells[colIdx];
          }
        }
      }

      schritte.push({
        label: String(stepIdx++),
        frage: `${rowH} · ${colH} =`,
        antwort,
      });
    }
  }

  // Add Summe step
  if (schritte.length > 0) {
    // Extract final answer from loesung
    const finalMatch = loesung.match(/=\s*\*?\*?([\d.,]+)\*?\*?\s*$/m);
    const summeMatch = loesung.match(/([\d.,]+)\s*$/);
    const summeAntwort = finalMatch?.[1] ?? summeMatch?.[1] ?? '';

    if (summeAntwort) {
      schritte.push({
        label: String(stepIdx),
        frage: 'Summe:',
        antwort: summeAntwort,
      });
    }
  }

  if (schritte.length < 2) return null;

  const anweisung = lines
    .filter((l) => !l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/))
    .join('\n')
    .trim();

  return {
    typ: 'schritt',
    anweisung,
    teilaufgaben: [{ label: '1', schritte }],
  };
}

/** Variante E: Ueberschlag + genau */
function parseUeberschlagGenau(aufgabenstellung: string, loesung: string): SchrittDaten | null {
  // Check if Loesung has Ueberschlag pattern
  if (!/[Üü]berschlag/i.test(loesung) || !/genau/i.test(loesung)) return null;

  const abcSplit = splitTeilaufgaben(aufgabenstellung);

  if (abcSplit.items.length > 0) {
    const loesungSplit = splitTeilaufgaben(loesung);

    const teilaufgaben = abcSplit.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem?.text ?? '';
      return parseUeberschlagTeilaufgabe(item, loesungText);
    });

    return {
      typ: 'schritt',
      anweisung: abcSplit.intro,
      teilaufgaben,
    };
  }

  // Single Ueberschlag item
  const ueberschlagMatch = loesung.match(/[Üü]berschlag:\s*.*?=\s*([\d.,]+)/);
  const genauMatch = loesung.match(/genau:\s*([\d.,]+)/);

  if (!ueberschlagMatch || !genauMatch) return null;

  return {
    typ: 'schritt',
    anweisung: aufgabenstellung.trim(),
    teilaufgaben: [{
      label: '1',
      schritte: [
        { label: '1', frage: `${aufgabenstellung.trim()} (Überschlag) ≈`, antwort: ueberschlagMatch[1] },
        { label: '2', frage: `${aufgabenstellung.trim()} (genau) =`, antwort: genauMatch[1] },
      ],
    }],
  };
}

/** Helper: Parse Ueberschlag-Teilaufgabe from a single item */
function parseUeberschlagTeilaufgabe(
  item: { label: string; text: string },
  loesungText: string,
): { label: string; schritte: TeilItem[] } {
  const frage = item.text.split('\n')[0].trim();

  // Pattern: "Überschlag: 3.000 · 3 = 9.000 → genau: 8.547"
  const ueberschlagMatch = loesungText.match(/[Üü]berschlag:\s*(?:.*?=\s*)?([\d.,]+)/);
  const genauMatch = loesungText.match(/genau:\s*([\d.,]+)/);

  const schritte: TeilItem[] = [];

  if (ueberschlagMatch) {
    schritte.push({
      label: '1',
      frage: `Überschlag: ${frage} ≈`,
      antwort: ueberschlagMatch[1],
    });
  }

  if (genauMatch) {
    schritte.push({
      label: '2',
      frage: `Genau: ${frage}`,
      antwort: genauMatch[1],
    });
  }

  // Fallback: no Ueberschlag recognized
  if (schritte.length === 0) {
    // P4: header-line fix
    const rawFb = loesungText.split('\n')[0].trim();
    const fbAntwort = rawFb.endsWith(':')
      ? (loesungText.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFb)
      : rawFb;
    schritte.push({
      label: '1',
      frage,
      antwort: fbAntwort,
    });
  }

  return { label: item.label, schritte };
}

/** Parse nummerierte Schritte aus der Loesung (1. xxx = yyy) */
function parseNummerierteSchritte(loesung: string): TeilItem[] {
  const numberedSteps = loesung.split(/^\d+\.\s+/m).filter(Boolean);
  if (numberedSteps.length <= 1) return [];

  return numberedSteps.map((step, idx) => {
    const line = step.trim().split('\n')[0];
    const eqMatch = line.match(/=\s*([\d.,]+)\s*$/);
    return {
      label: String(idx + 1),
      frage: line.replace(/=\s*[\d.,]+\s*$/, '= ?').trim(),
      antwort: eqMatch?.[1] ?? '',
    };
  });
}

// ── Luecke ──────────────────────────────────────────────

function parseLueckeDaten(aufgabenstellung: string, loesung: string): LueckeDaten {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items: TeilItem[] = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      // P4: If first line is a header (ends with ":"), take the next non-empty line
      const rawFirst = loesungItem?.text.split('\n')[0].trim() ?? '';
      const antwort = rawFirst.endsWith(':')
        ? (loesungItem?.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
        : rawFirst;
      return {
        label: item.label,
        frage: item.text.split('\n')[0].trim(),
        antwort,
      };
    });

    return { typ: 'luecke', anweisung: split.intro, items };
  }

  // P4: header-line fix
  const rawFirst = loesung.split('\n')[0].trim();
  const lueckeAntwort = rawFirst.endsWith(':')
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
    : rawFirst;
  return {
    typ: 'luecke',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort: lueckeAntwort }],
  };
}

// ── Auswahl ─────────────────────────────────────────────

function parseAuswahlDaten(aufgabenstellung: string, loesung: string): AuswahlDaten {
  // Try uppercase A) B) C) D) first
  let optionMatches = aufgabenstellung.match(/^[A-D]\)\s*.+$/gm) ?? [];
  let optionen = optionMatches.map((m) => ({
    label: m[0],
    text: m.replace(/^[A-D]\)\s*/, '').trim(),
  }));
  let frageText = aufgabenstellung.split(/^[A-D]\)/m)[0].trim();

  let answerMatch = loesung.match(/^([A-D])\)/m) ?? loesung.match(/^([A-D])\b/m);
  let richtigeIdx = answerMatch ? answerMatch[1].charCodeAt(0) - 65 : 0;

  // If no uppercase options, try lowercase a) b) c) d)
  if (optionen.length < 2) {
    optionMatches = aufgabenstellung.match(/^[a-z]\)\s*.+$/gm) ?? [];
    optionen = optionMatches.map((m) => ({
      label: m[0].toUpperCase(),
      text: m.replace(/^[a-z]\)\s*/, '').trim(),
    }));
    frageText = aufgabenstellung.split(/^[a-z]\)/m)[0].trim();

    answerMatch = loesung.match(/^([a-z])\)/m) ?? loesung.match(/^([a-z])\b/m);
    richtigeIdx = answerMatch ? answerMatch[1].charCodeAt(0) - 97 : 0;
  }

  // Fallback: split by newlines
  if (optionen.length < 2) {
    const lines = aufgabenstellung.split('\n').map((l) => l.trim()).filter(Boolean);
    const nonListLines = lines.filter((l) => !l.startsWith('- ') && !l.startsWith('|'));
    if (nonListLines.length >= 3) {
      return {
        typ: 'auswahl',
        anweisung: '',
        frageText: nonListLines[0],
        optionen: nonListLines.slice(1).map((text, i) => ({
          label: String.fromCharCode(65 + i),
          text,
        })),
        richtigeIdx: 0,
      };
    }

    return {
      typ: 'auswahl',
      anweisung: '',
      frageText: aufgabenstellung,
      optionen: [{ label: 'A', text: '(Keine Optionen erkannt)' }],
      richtigeIdx: 0,
    };
  }

  return {
    typ: 'auswahl',
    anweisung: '',
    frageText,
    optionen,
    richtigeIdx,
  };
}

// ── Zuordnung ───────────────────────────────────────────

function parseZuordnungDaten(aufgabenstellung: string, loesung: string): ZuordnungDaten {
  const lines = aufgabenstellung.split('\n').map((l) => l.trim()).filter(Boolean);

  const introLines: string[] = [];
  const itemLines: string[] = [];
  const choiceLines: string[] = [];

  let section: 'intro' | 'items' | 'gap' | 'choices' = 'intro';

  for (const line of lines) {
    const isLettered = /^[a-g]\)\s/.test(line);
    const isNumbered = /^\d+\)\s/.test(line);
    const isUpperLettered = /^[A-G][.)]\s/.test(line);

    if (section === 'intro') {
      if (isLettered || isNumbered) {
        section = 'items';
        itemLines.push(line);
      } else {
        introLines.push(line);
      }
    } else if (section === 'items') {
      if (isLettered || isNumbered) {
        itemLines.push(line);
      } else if (isUpperLettered || (itemLines.some((l) => /^[a-g]\)/.test(l)) && /^\d+\)/.test(line))) {
        section = 'choices';
        choiceLines.push(line);
      } else if (line.match(/^(Begriffe|Beschreibungen|Antworten|Werte|Rechenketten):/i)) {
        section = 'gap';
      } else {
        section = 'gap';
      }
    } else if (section === 'gap') {
      if (isUpperLettered || isNumbered || /^[A-G][.:]\s/.test(line)) {
        section = 'choices';
        choiceLines.push(line);
      } else if (/^[-•]\s*[A-G][:.]/.test(line)) {
        section = 'choices';
        choiceLines.push(line.replace(/^[-•]\s*/, ''));
      } else if (isLettered) {
        section = 'choices';
        choiceLines.push(line);
      }
    } else if (section === 'choices') {
      if (isUpperLettered || isNumbered || /^[A-G][.:]\s/.test(line) || /^[-•]\s*[A-G][:.]/.test(line)) {
        choiceLines.push(line.replace(/^[-•]\s*/, ''));
      }
    }
  }

  // Parse items
  const items = itemLines.map((l) => {
    const match = l.match(/^([a-g0-9]+)\)\s*(.*)/);
    return match ? { label: match[1], text: match[2].trim() } : null;
  }).filter((x): x is { label: string; text: string } => x !== null);

  const choices = choiceLines.map((l) => {
    const match = l.match(/^([A-G0-9]+)[.):]?\s*(.*)/);
    return match ? { label: match[1], text: match[2].trim() } : null;
  }).filter((x): x is { label: string; text: string } => x !== null);

  // Parse answers from Loesung
  const antworten: Record<string, string> = {};
  for (const line of loesung.split('\n')) {
    const match = line.match(/^([a-g0-9]+)\)?\s*.*?→\s*([A-G0-9]+)\)?/);
    if (match) {
      antworten[match[1]] = match[2];
    }
  }

  return {
    typ: 'zuordnung',
    anweisung: introLines.join('\n'),
    items,
    choices,
    antworten,
  };
}

// ── Wahr-Falsch ─────────────────────────────────────────

function parseWahrFalschDaten(aufgabenstellung: string, loesung: string): WahrFalschDaten {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem?.text ?? '';
      return {
        label: item.label,
        aussage: item.text.split('\n')[0].trim(),
        richtig: istRichtig(loesungText),
        erklaerung: loesungText.split('\n')[0].trim(),
      };
    });

    return { typ: 'wahr-falsch', anweisung: split.intro, items };
  }

  return {
    typ: 'wahr-falsch',
    anweisung: '',
    items: [{
      label: '1',
      aussage: aufgabenstellung.trim(),
      richtig: istRichtig(loesung),
      erklaerung: loesung.split('\n')[0].trim(),
    }],
  };
}

/** Determines if a loesung text indicates "stimmt" (true) or "stimmt nicht" (false). */
function istRichtig(loesungText: string): boolean {
  const lower = loesungText.toLowerCase();

  if (lower.includes('stimmt nicht') || lower.includes('nicht stimmen')) return false;
  if (loesungText.includes('✗')) return false;
  if (lower.includes('falsch') && !lower.includes('nicht falsch')) return false;
  if (/\bnein\b/.test(lower)) return false;

  if (lower.includes('stimmt')) return true;
  if (loesungText.includes('✓')) return true;
  if (lower.includes('richtig')) return true;
  if (/\bja\b/.test(lower)) return true;
  if (lower.includes('plausibel')) return true;

  return true;
}

// ── Textaufgabe ─────────────────────────────────────────

function parseTextaufgabeDaten(aufgabenstellung: string, loesung: string): TextaufgabeDaten {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items: TeilItem[] = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      // P4: If first line is a header (ends with ":"), take the next non-empty line
      const rawFirst = loesungItem?.text.split('\n')[0].trim() ?? '';
      const antwort = rawFirst.endsWith(':')
        ? (loesungItem?.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
        : rawFirst;
      return {
        label: item.label,
        frage: item.text.split('\n')[0].trim(),
        antwort,
      };
    });

    return {
      typ: 'textaufgabe',
      anweisung: split.intro,
      kontext: split.intro,
      items,
    };
  }

  // No a)/b)/c) — split context from question by last paragraph
  const paragraphs = aufgabenstellung.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    const kontext = paragraphs.slice(0, -1).join('\n\n');
    const frage = paragraphs[paragraphs.length - 1];
    // P4: header-line fix for single-item loesung
    const rawFirst = loesung.split('\n')[0].trim();
    const antwort = rawFirst.endsWith(':')
      ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
      : rawFirst;
    return {
      typ: 'textaufgabe',
      anweisung: kontext,
      kontext,
      items: [{ label: '1', frage, antwort }],
    };
  }

  // P4: header-line fix for single-item loesung
  const rawFirst = loesung.split('\n')[0].trim();
  const antwort = rawFirst.endsWith(':')
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] ?? rawFirst)
    : rawFirst;
  return {
    typ: 'textaufgabe',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort }],
  };
}

// ── Reihenfolge ─────────────────────────────────────────

function parseReihenfolgeDaten(aufgabenstellung: string, loesung: string): ReihenfolgeDaten {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    // Pruefen: Ist die Loesung eine Label-Reihenfolge (z.B. "b, d, a, c")?
    const labelOrder = extractLabelOrder(loesung, split.items);
    if (labelOrder) {
      // Alle Items sind die Beschreibungstexte der Labels, Loesung gibt die Reihenfolge vor
      const itemMap = new Map(split.items.map((i) => [i.label, i.text.split('\n')[0].trim()]));
      const items = split.items.map((i) => i.text.split('\n')[0].trim());
      const richtigeReihenfolge = labelOrder.map((l) => itemMap.get(l) ?? l);
      return {
        typ: 'reihenfolge',
        anweisung: split.intro,
        teilaufgaben: [{ label: '1', items, richtigeReihenfolge }],
      };
    }

    // Mehrere Teilaufgaben mit eigenen Items
    const teilaufgaben = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem?.text ?? '';
      const richtigeReihenfolge = extractOrderedItems(loesungText);
      const items = extractItemsFromText(item.text.trim(), richtigeReihenfolge);
      return { label: item.label, items, richtigeReihenfolge };
    });

    return { typ: 'reihenfolge', anweisung: split.intro, teilaufgaben };
  }

  // Einzelaufgabe ohne a)/b)
  const richtigeReihenfolge = extractOrderedItems(loesung);
  const items = extractItemsFromText(aufgabenstellung.trim(), richtigeReihenfolge);
  return {
    typ: 'reihenfolge',
    anweisung: aufgabenstellung.split(/^[a-z]\)/m)[0].trim(),
    teilaufgaben: [{ label: '1', items, richtigeReihenfolge }],
  };
}

/** Erkennt ob die Loesung eine Label-Reihenfolge ist (z.B. "b, d, a, c"). */
function extractLabelOrder(loesung: string, items: { label: string }[]): string[] | null {
  const labels = new Set(items.map((i) => i.label));
  const parts = loesung.trim().split(/[,\s]+/).filter(Boolean);
  if (parts.length === labels.size && parts.every((p) => labels.has(p))) {
    return parts;
  }
  return null;
}

function extractOrderedItems(loesung: string): string[] {
  // Erst auf > oder → splitten (explizite Ordnung)
  if (/[>→]/.test(loesung)) {
    const items = loesung.split(/[>→]/).map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }

  // Nummerierte Liste
  const numberedMatches = loesung.match(/^\d+\.\s+(.+)$/gm);
  if (numberedMatches && numberedMatches.length >= 2) {
    return numberedMatches.map((m) => m.replace(/^\d+\.\s+/, '').trim());
  }

  // Komma- und/oder =-getrennte Items (z.B. "Lukas (137 cm) = Jan (137 cm), Ole (138 cm)")
  if (loesung.includes(',') || /(?<!\d)\s*=\s*(?!\s*\d)/.test(loesung)) {
    const items = loesung.split(/,|(?<!\d)\s*=\s*(?!\s*\d)/).map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }

  const lineItems = loesung.split('\n').map((l) => l.trim()).filter(Boolean);
  return lineItems.length >= 2 ? lineItems : [loesung.trim()];
}

function extractItemsFromText(text: string, fallbackItems: string[]): string[] {
  // Skip | splitting if text contains a Markdown table (lines starting with |)
  if (text.includes('|') && !text.split('\n').some((l) => l.trim().startsWith('|'))) {
    const items = text.split('|').map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }

  // Komma-getrennte Items (z.B. "Lukas (137 cm), Justus (140 cm), ...")
  // Nur wenn Komma-Items wie "Name (Zahl)" aussehen oder mind. 3 Items entstehen
  if (text.includes(',')) {
    const commaItems = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (commaItems.length >= 3) return commaItems;
  }

  return [...fallbackItems];
}
