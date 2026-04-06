#!/usr/bin/env node
/**
 * Build-Pipeline: MD-Aufgaben → validiertes JSON.
 *
 * Liest alle Aufgaben-Markdown-Dateien aus docs/aufgaben/,
 * parst sie mit der gleichen Logik wie src/aufgaben/parser.ts + parserTyped.ts,
 * validiert die Ergebnisse und schreibt pro Datei ein JSON-File nach
 * src/aufgaben/data/.
 *
 * Ausfuehrung:  node scripts/build-aufgaben.cjs
 * Exit-Code:    0 bei Erfolg (nur Warnungen), 1 bei Fehlern
 */

const fs = require('fs');
const path = require('path');

// ─── Paths ──────────────────────────────────────────────────
const AUFGABEN_DIR = path.resolve(__dirname, '..', 'docs', 'aufgaben');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'src', 'aufgaben', 'data');

// ─── Colors for terminal output ─────────────────────────────
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

// ═══════════════════════════════════════════════════════════════
// Parser-Helpers (from src/aufgaben/parserHelpers.ts)
// ═══════════════════════════════════════════════════════════════

function splitTeilaufgaben(text) {
  const parts = text.split(/^([a-z])\)\s*/m);
  if (parts.length < 3) {
    return { intro: text.trim(), items: [] };
  }
  const intro = parts[0].trim();
  const items = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    const label = parts[i];
    const itemText = (parts[i + 1] || '').trim();
    if (label && itemText) {
      items.push({ label, text: itemText });
    }
  }
  return { intro, items };
}

function splitStrichliste(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

function extractAnweisung(aufgabenstellung) {
  const abcSplit = splitTeilaufgaben(aufgabenstellung);
  if (abcSplit.items.length > 0) return abcSplit.intro;
  const lines = aufgabenstellung.split('\n');
  const firstListIdx = lines.findIndex((l) => l.trim().startsWith('- '));
  if (firstListIdx > 0) return lines.slice(0, firstListIdx).join('\n').trim();
  return aufgabenstellung.trim();
}

function extractAntwortAusLoesung(loesungZeile) {
  const trimmed = loesungZeile.trim();
  const eqMatch = trimmed.match(/=\s*([\d.,]+)/);
  if (eqMatch) return eqMatch[1];
  const colonMatch = trimmed.match(/:\s*([\d.,]+)/);
  if (colonMatch) return colonMatch[1];
  const firstNum = trimmed.match(/^-?([\d.,]+)/);
  if (firstNum) return firstNum[0];
  const lastNum = trimmed.match(/([\d.,]+)\s*\S*\s*$/);
  if (lastNum) return lastNum[1];
  return trimmed;
}

function hatTabelle(text) {
  return /^\|.+\|$/m.test(text);
}

function hatStrichliste(text) {
  return /^- .+/m.test(text);
}

function hatRechenkette(text) {
  return /→/.test(text) && /[+\-·:×÷]/.test(text);
}

// ═══════════════════════════════════════════════════════════════
// Typed Parser (from src/aufgaben/parserTyped.ts)
// ═══════════════════════════════════════════════════════════════

function parseDaten(typ, aufgabenstellung, loesung) {
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
    default:
      return { typ: 'eingabe', anweisung: '', items: [{ label: '1', frage: aufgabenstellung.trim(), antwort: loesung.split('\n')[0].trim() }] };
  }
}

// ── Eingabe ─────────────────────────────────────────────

function parseEingabeDaten(aufgabenstellung, loesung) {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const expandedItems = [];
    for (const item of split.items) {
      const zeilen = item.text.split('\n').map((l) => l.trim()).filter(Boolean);
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const rawLoesungText = loesungItem ? loesungItem.text.split('\n')[0].trim() : '';
      // P4: If first line is just a header (ends with ":"), take the next non-empty line
      const loesungText = rawLoesungText.endsWith(':')
        ? (loesungItem ? (loesungItem.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawLoesungText) : rawLoesungText)
        : rawLoesungText;

      if (zeilen.length > 1 && loesungText.includes('/')) {
        const antworten = loesungText.split('/').map((a) => a.trim());
        zeilen.forEach((z, idx) => {
          expandedItems.push({
            label: `${item.label}${idx > 0 ? String(idx + 1) : ''}`,
            frage: z,
            antwort: antworten[idx] || '',
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
    return { typ: 'eingabe', anweisung: split.intro, items: expandedItems };
  }

  return {
    typ: 'eingabe',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort: loesung.split('\n')[0].trim() }],
  };
}

// ── Schritt ─────────────────────────────────────────────

function parseSchrittDaten(aufgabenstellung, loesung) {
  if (hatTabelle(aufgabenstellung)) {
    const result = parseMaltabelle(aufgabenstellung, loesung);
    if (result) return result;
  }
  if (hatStrichliste(aufgabenstellung)) {
    const result = parseStrichliste(aufgabenstellung, loesung);
    if (result) return result;
  }
  if (hatRechenkette(loesung)) {
    const result = parseRechenkette(aufgabenstellung, loesung);
    if (result) return result;
  }

  const abcSplit = splitTeilaufgaben(aufgabenstellung);
  if (abcSplit.items.length > 0) {
    return parseSchrittAbc(aufgabenstellung, loesung, abcSplit);
  }

  const numSteps = parseNummerierteSchritte(loesung);
  if (numSteps.length > 1) {
    return {
      typ: 'schritt',
      anweisung: aufgabenstellung.trim(),
      teilaufgaben: [{ label: '1', schritte: numSteps }],
    };
  }

  const ueberschlagResult = parseUeberschlagGenau(aufgabenstellung, loesung);
  if (ueberschlagResult) return ueberschlagResult;

  // P4: header-line fix
  const rawFirst = loesung.split('\n')[0].trim();
  const fallbackAntwort = rawFirst.endsWith(':')
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst)
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

function parseStrichliste(aufgabenstellung, loesung) {
  const aufgabeItems = splitStrichliste(aufgabenstellung);
  const loesungItems = splitStrichliste(loesung);
  if (aufgabeItems.length < 2) return null;

  const anweisung = extractAnweisung(aufgabenstellung);
  const schritte = aufgabeItems.map((item, idx) => {
    const loesungZeile = loesungItems[idx] || '';
    let frage = item.replace(/___/g, '').trim();
    if (!frage.endsWith('=') && !frage.endsWith(':')) {
      const eqIdx = frage.indexOf('=');
      if (eqIdx > 0) frage = frage.slice(0, eqIdx).trim() + ' =';
    }
    if (frage.toLowerCase().startsWith('summe')) frage = 'Summe:';
    const antwort = extractAntwortAusLoesung(loesungZeile);
    return { label: String(idx + 1), frage, antwort };
  });

  return { typ: 'schritt', anweisung, teilaufgaben: [{ label: '1', schritte }] };
}

function parseSchrittAbc(_aufgabenstellung, loesung, abcSplit) {
  const loesungSplit = splitTeilaufgaben(loesung);
  const hatUeberschlag = loesungSplit.items.some(
    (item) => /[Üü]berschlag/i.test(item.text) && /genau/i.test(item.text)
  );

  const teilaufgaben = abcSplit.items.map((item) => {
    const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
    const loesungText = loesungItem ? loesungItem.text : loesung;

    if (hatUeberschlag) {
      return parseUeberschlagTeilaufgabe(item, loesungText);
    }

    const subStrichliste = splitStrichliste(loesungText);
    if (subStrichliste.length > 1) {
      const schritte = subStrichliste.map((schritt, idx) => ({
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
      const schritte = calcLines.map((line, idx) => ({
        label: String(idx + 1),
        frage: line.replace(/=\s*[\d.,]+\s*$/, '= ?').trim(),
        antwort: extractAntwortAusLoesung(line),
      }));
      return { label: item.label, schritte };
    }

    const frage = item.text.split('\n')[0].trim();
    // P4: header-line fix
    const rawAntwort = loesungText.split('\n')[0].trim();
    const antwort = rawAntwort.endsWith(':')
      ? (loesungText.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawAntwort)
      : rawAntwort;
    return { label: item.label, schritte: [{ label: '1', frage, antwort }] };
  });

  return { typ: 'schritt', anweisung: abcSplit.intro, teilaufgaben };
}

function parseRechenkette(aufgabenstellung, loesung) {
  const chainMatch = loesung.match(/[\d.,]+(?:\s*→\s*[+\-−·:×÷]\s*[\d.,]+\s*→\s*[\d.,]+)+/);
  if (!chainMatch) return null;

  const segments = chainMatch[0].split('→').map((s) => s.trim());
  const schritte = [];

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

function parseMaltabelle(aufgabenstellung, loesung) {
  const lines = aufgabenstellung.split('\n');
  const tableLines = lines.filter((l) => l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/));
  if (tableLines.length < 2) return null;

  const headerCells = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
  if (headerCells.length < 2) return null;

  const colHeaders = headerCells.slice(1).map((c) => c.trim()).filter(Boolean);
  const dataRows = tableLines.slice(1);
  const rowHeaders = [];
  for (const row of dataRows) {
    const cells = row.split('|').slice(1, -1).map((c) => c.trim());
    if (cells[0]) rowHeaders.push(cells[0]);
  }

  const loesungTableLines = loesung
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/));

  const schritte = [];
  let stepIdx = 1;
  const calcRows = rowHeaders.filter((_, i) => i < rowHeaders.length - 1 || rowHeaders.length <= 2);

  for (const rowH of calcRows) {
    for (const colH of colHeaders) {
      let antwort = '';
      for (const loesungLine of loesungTableLines) {
        const cells = loesungLine.split('|').slice(1, -1).map((c) => c.replace(/\*\*/g, '').trim());
        if ((cells[0] || '').trim() === rowH) {
          const loesungHeader = loesungTableLines[0] ? loesungTableLines[0].split('|').slice(1, -1).map((c) => c.trim()) : [];
          const colIdx = loesungHeader.findIndex((h) => h === colH);
          if (colIdx >= 0 && cells[colIdx]) antwort = cells[colIdx];
        }
      }
      schritte.push({ label: String(stepIdx++), frage: `${rowH} · ${colH} =`, antwort });
    }
  }

  if (schritte.length > 0) {
    const finalMatch = loesung.match(/=\s*\*?\*?([\d.,]+)\*?\*?\s*$/m);
    const summeMatch = loesung.match(/([\d.,]+)\s*$/);
    const summeAntwort = (finalMatch ? finalMatch[1] : null) || (summeMatch ? summeMatch[1] : '') || '';
    if (summeAntwort) {
      schritte.push({ label: String(stepIdx), frage: 'Summe:', antwort: summeAntwort });
    }
  }

  if (schritte.length < 2) return null;

  const anweisung = lines
    .filter((l) => !l.trim().startsWith('|') && !l.trim().match(/^\|[\s\-:|]+\|$/))
    .join('\n')
    .trim();

  return { typ: 'schritt', anweisung, teilaufgaben: [{ label: '1', schritte }] };
}

function parseUeberschlagGenau(aufgabenstellung, loesung) {
  if (!/[Üü]berschlag/i.test(loesung) || !/genau/i.test(loesung)) return null;

  const abcSplit = splitTeilaufgaben(aufgabenstellung);
  if (abcSplit.items.length > 0) {
    const loesungSplit = splitTeilaufgaben(loesung);
    const teilaufgaben = abcSplit.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem ? loesungItem.text : '';
      return parseUeberschlagTeilaufgabe(item, loesungText);
    });
    return { typ: 'schritt', anweisung: abcSplit.intro, teilaufgaben };
  }

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

function parseUeberschlagTeilaufgabe(item, loesungText) {
  const frage = item.text.split('\n')[0].trim();
  const ueberschlagMatch = loesungText.match(/[Üü]berschlag:\s*(?:.*?=\s*)?([\d.,]+)/);
  const genauMatch = loesungText.match(/genau:\s*([\d.,]+)/);
  const schritte = [];

  if (ueberschlagMatch) {
    schritte.push({ label: '1', frage: `Überschlag: ${frage} ≈`, antwort: ueberschlagMatch[1] });
  }
  if (genauMatch) {
    schritte.push({ label: '2', frage: `Genau: ${frage}`, antwort: genauMatch[1] });
  }
  if (schritte.length === 0) {
    // P4: header-line fix
    const rawFb = loesungText.split('\n')[0].trim();
    const fbAntwort = rawFb.endsWith(':')
      ? (loesungText.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFb)
      : rawFb;
    schritte.push({ label: '1', frage, antwort: fbAntwort });
  }

  return { label: item.label, schritte };
}

function parseNummerierteSchritte(loesung) {
  const numberedSteps = loesung.split(/^\d+\.\s+/m).filter(Boolean);
  if (numberedSteps.length <= 1) return [];
  return numberedSteps.map((step, idx) => {
    const line = step.trim().split('\n')[0];
    const eqMatch = line.match(/=\s*([\d.,]+)\s*$/);
    return {
      label: String(idx + 1),
      frage: line.replace(/=\s*[\d.,]+\s*$/, '= ?').trim(),
      antwort: eqMatch ? eqMatch[1] : '',
    };
  });
}

// ── Luecke ──────────────────────────────────────────────

function parseLueckeDaten(aufgabenstellung, loesung) {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      // P4: If first line is a header (ends with ":"), take the next non-empty line
      const rawFirst = loesungItem ? loesungItem.text.split('\n')[0].trim() : '';
      const antwort = rawFirst.endsWith(':')
        ? (loesungItem ? (loesungItem.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst) : rawFirst)
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
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst)
    : rawFirst;
  return {
    typ: 'luecke',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort: lueckeAntwort }],
  };
}

// ── Auswahl ─────────────────────────────────────────────

function parseAuswahlDaten(aufgabenstellung, loesung) {
  let optionMatches = aufgabenstellung.match(/^[A-D]\)\s*.+$/gm) || [];
  let optionen = optionMatches.map((m) => ({
    label: m[0],
    text: m.replace(/^[A-D]\)\s*/, '').trim(),
  }));
  let frageText = aufgabenstellung.split(/^[A-D]\)/m)[0].trim();
  let answerMatch = loesung.match(/^([A-D])\)/m) || loesung.match(/^([A-D])\b/m);
  let richtigeIdx = answerMatch ? answerMatch[1].charCodeAt(0) - 65 : 0;

  if (optionen.length < 2) {
    optionMatches = aufgabenstellung.match(/^[a-z]\)\s*.+$/gm) || [];
    optionen = optionMatches.map((m) => ({
      label: m[0].toUpperCase(),
      text: m.replace(/^[a-z]\)\s*/, '').trim(),
    }));
    frageText = aufgabenstellung.split(/^[a-z]\)/m)[0].trim();
    answerMatch = loesung.match(/^([a-z])\)/m) || loesung.match(/^([a-z])\b/m);
    richtigeIdx = answerMatch ? answerMatch[1].charCodeAt(0) - 97 : 0;
  }

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

  return { typ: 'auswahl', anweisung: '', frageText, optionen, richtigeIdx };
}

// ── Zuordnung ───────────────────────────────────────────

function parseZuordnungDaten(aufgabenstellung, loesung) {
  const lines = aufgabenstellung.split('\n').map((l) => l.trim()).filter(Boolean);
  const introLines = [];
  const itemLines = [];
  const choiceLines = [];
  let section = 'intro';

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

  const items = itemLines.map((l) => {
    const match = l.match(/^([a-g0-9]+)\)\s*(.*)/);
    return match ? { label: match[1], text: match[2].trim() } : null;
  }).filter((x) => x !== null);

  const choices = choiceLines.map((l) => {
    const match = l.match(/^([A-G0-9]+)[.):]?\s*(.*)/);
    return match ? { label: match[1], text: match[2].trim() } : null;
  }).filter((x) => x !== null);

  const antworten = {};
  for (const line of loesung.split('\n')) {
    const match = line.match(/^([a-g0-9]+)\)?\s*.*?→\s*([A-G0-9]+)\)?/);
    if (match) antworten[match[1]] = match[2];
  }

  return { typ: 'zuordnung', anweisung: introLines.join('\n'), items, choices, antworten };
}

// ── Wahr-Falsch ─────────────────────────────────────────

function parseWahrFalschDaten(aufgabenstellung, loesung) {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem ? loesungItem.text : '';
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

function istRichtig(loesungText) {
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

function parseTextaufgabeDaten(aufgabenstellung, loesung) {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    const items = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      // P4: If first line is a header (ends with ":"), take the next non-empty line
      const rawFirst = loesungItem ? loesungItem.text.split('\n')[0].trim() : '';
      const antwort = rawFirst.endsWith(':')
        ? (loesungItem ? (loesungItem.text.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst) : rawFirst)
        : rawFirst;
      return {
        label: item.label,
        frage: item.text.split('\n')[0].trim(),
        antwort,
      };
    });
    return { typ: 'textaufgabe', anweisung: split.intro, kontext: split.intro, items };
  }

  const paragraphs = aufgabenstellung.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    const kontext = paragraphs.slice(0, -1).join('\n\n');
    const frage = paragraphs[paragraphs.length - 1];
    // P4: header-line fix for single-item loesung
    const rawFirst = loesung.split('\n')[0].trim();
    const antwort = rawFirst.endsWith(':')
      ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst)
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
    ? (loesung.split('\n').slice(1).map(l => l.trim()).filter(Boolean)[0] || rawFirst)
    : rawFirst;
  return {
    typ: 'textaufgabe',
    anweisung: '',
    items: [{ label: '1', frage: aufgabenstellung.trim(), antwort }],
  };
}

// ── Reihenfolge ─────────────────────────────────────────

function parseReihenfolgeDaten(aufgabenstellung, loesung) {
  const split = splitTeilaufgaben(aufgabenstellung);
  const loesungSplit = splitTeilaufgaben(loesung);

  if (split.items.length > 0) {
    // P5: Check if loesung is a label order (e.g. "b, d, a, c")
    const labelOrder = extractLabelOrder(loesung, split.items);
    if (labelOrder) {
      const itemMap = new Map(split.items.map((i) => [i.label, i.text.split('\n')[0].trim()]));
      const items = split.items.map((i) => i.text.split('\n')[0].trim());
      const richtigeReihenfolge = labelOrder.map((l) => itemMap.get(l) || l);
      return {
        typ: 'reihenfolge',
        anweisung: split.intro,
        teilaufgaben: [{ label: '1', items, richtigeReihenfolge }],
      };
    }

    const teilaufgaben = split.items.map((item) => {
      const loesungItem = loesungSplit.items.find((l) => l.label === item.label);
      const loesungText = loesungItem ? loesungItem.text : '';
      const richtigeReihenfolge = extractOrderedItems(loesungText);
      const items = extractItemsFromText(item.text.trim(), richtigeReihenfolge);
      return { label: item.label, items, richtigeReihenfolge };
    });
    return { typ: 'reihenfolge', anweisung: split.intro, teilaufgaben };
  }

  const richtigeReihenfolge = extractOrderedItems(loesung);
  const items = extractItemsFromText(aufgabenstellung.trim(), richtigeReihenfolge);
  return {
    typ: 'reihenfolge',
    anweisung: aufgabenstellung.split(/^[a-z]\)/m)[0].trim(),
    teilaufgaben: [{ label: '1', items, richtigeReihenfolge }],
  };
}

/** P5: Detects if loesung is a label order like "b, d, a, c" */
function extractLabelOrder(loesung, items) {
  const labels = new Set(items.map((i) => i.label));
  const parts = loesung.trim().split(/[,\s]+/).filter(Boolean);
  if (parts.length === labels.size && parts.every((p) => labels.has(p))) {
    return parts;
  }
  return null;
}

function extractOrderedItems(loesung) {
  if (/[>→]/.test(loesung)) {
    const items = loesung.split(/[>→]/).map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }
  const numberedMatches = loesung.match(/^\d+\.\s+(.+)$/gm);
  if (numberedMatches && numberedMatches.length >= 2) {
    return numberedMatches.map((m) => m.replace(/^\d+\.\s+/, '').trim());
  }
  // Comma and/or = separated items
  if (loesung.includes(',') || /(?<!\d)\s*=\s*(?!\s*\d)/.test(loesung)) {
    const items = loesung.split(/,|(?<!\d)\s*=\s*(?!\s*\d)/).map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }
  const lineItems = loesung.split('\n').map((l) => l.trim()).filter(Boolean);
  return lineItems.length >= 2 ? lineItems : [loesung.trim()];
}

function extractItemsFromText(text, fallbackItems) {
  // Skip | splitting if text contains a Markdown table (lines starting with |)
  if (text.includes('|') && !text.split('\n').some((l) => l.trim().startsWith('|'))) {
    const items = text.split('|').map((s) => s.trim()).filter(Boolean);
    if (items.length >= 2) return items;
  }
  // Comma-separated items
  if (text.includes(',')) {
    const commaItems = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (commaItems.length >= 3) return commaItems;
  }
  return [...fallbackItems];
}

// ═══════════════════════════════════════════════════════════════
// MD Parser (from src/aufgaben/parser.ts)
// ═══════════════════════════════════════════════════════════════

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(markdown, name) {
  const headingPattern = new RegExp(`^### ${escapeRegex(name)}[^\\n]*\\n`, 'm');
  const headingMatch = markdown.match(headingPattern);
  if (!headingMatch || headingMatch.index === undefined) return null;

  const startIdx = headingMatch.index + headingMatch[0].length;
  const rest = markdown.slice(startIdx);
  const nextSectionIdx = rest.search(/^(### |---$)/m);
  const content = nextSectionIdx === -1 ? rest.trim() : rest.slice(0, nextSectionIdx).trim();
  return content || null;
}

function parseSimpleYaml(yaml) {
  const result = {};
  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function parseAufgabenBlock(block) {
  const yamlMatch = block.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return null;

  const yamlStr = yamlMatch[1];
  const meta = parseSimpleYaml(yamlStr);

  const afterYaml = block.slice(yamlMatch[0].length);
  const aufgabenstellung = extractSection(afterYaml, 'Aufgabenstellung');
  const loesung = extractSection(afterYaml, 'Lösung') || extractSection(afterYaml, 'Loesung');
  const loesungsweg = extractSection(afterYaml, 'Lösungsweg') || extractSection(afterYaml, 'Loesungsweg');
  const tipp1 = extractSection(afterYaml, 'Tipp 1');
  const tipp2 = extractSection(afterYaml, 'Tipp 2');
  const tipp3 = extractSection(afterYaml, 'Tipp 3');
  const didaktischerHinweis = extractSection(afterYaml, 'Didaktischer Hinweis');

  if (!meta.titel || !meta.typ || !aufgabenstellung) return null;

  // Normalize umlaut variant: lücke → luecke
  const typ = meta.typ === 'lücke' ? 'luecke' : meta.typ;
  const loesungStr = loesung || '';
  const parsed = parseDaten(typ, aufgabenstellung, loesungStr);

  // Optionale Bild-Felder aus YAML
  const erklaerungBild = meta.erklaerung_bild || undefined;
  const themenIntroBild = meta.themen_intro_bild || undefined;
  const tippBilder = [
    meta.tipp_1_bild || undefined,
    meta.tipp_2_bild || undefined,
    meta.tipp_3_bild || undefined,
    undefined,
  ];
  const hatTippBilder = tippBilder.some(Boolean);

  return {
    titel: meta.titel,
    typ,
    thema: meta.thema || '',
    schwierigkeit: meta.schwierigkeit || 'grün',
    buchseite: parseInt(meta.buchseite || '0', 10),
    kapitel: meta.kapitel || '',
    stageId: meta.stage_id || '',
    digital: meta.digital || 'voll',
    aufgabenstellung,
    loesung: loesungStr,
    loesungsweg: loesungsweg || '',
    tipps: [
      tipp1 || 'Lies die Aufgabe nochmal genau durch.',
      tipp2 || 'Überlege Schritt für Schritt.',
      tipp3 || 'Schau dir die Lösung an und versuche den Rechenweg nachzuvollziehen.',
      loesungsweg || loesungStr || '',
    ],
    ...(hatTippBilder ? { tippBilder } : {}),
    didaktischerHinweis: didaktischerHinweis || undefined,
    erklaerungBild,
    themenIntroBild,
    parsed,
  };
}

function parseAufgabenDatei(markdown) {
  const aufgaben = [];
  const blocks = markdown.split(/^## Aufgabe \d+/m);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    const parsed = parseAufgabenBlock(block);
    if (parsed) aufgaben.push(parsed);
  }
  return aufgaben;
}

// ═══════════════════════════════════════════════════════════════
// Validation
// ═══════════════════════════════════════════════════════════════

const GENERISCHE_TIPPS = [
  'lies die aufgabe nochmal',
  'lies die aufgabe noch einmal',
  'lies dir die aufgabe',
  'schau dir die aufgabe nochmal an',
];

function isGenerischerTipp(tipp) {
  const lower = tipp.toLowerCase();
  return GENERISCHE_TIPPS.some((g) => lower.includes(g));
}

/**
 * Returns true if the parsed data looks like a "fallback" (not properly parsed).
 * We check for patterns that indicate the parser fell through to default behavior.
 */
function isFallbackParsed(aufgabe) {
  const { parsed, typ } = aufgabe;
  if (!parsed) return true;

  // For eingabe/luecke: single item with full aufgabenstellung as frage = fallback
  if ((typ === 'eingabe' || typ === 'luecke') && parsed.items) {
    if (parsed.items.length === 1 && parsed.items[0].label === '1') {
      const frage = parsed.items[0].frage;
      if (frage === aufgabe.aufgabenstellung.trim()) return true;
    }
  }

  // For schritt: single teilaufgabe with single schritt where frage = full aufgabenstellung
  if (typ === 'schritt' && parsed.teilaufgaben) {
    if (parsed.teilaufgaben.length === 1 && parsed.teilaufgaben[0].schritte.length === 1) {
      const schritt = parsed.teilaufgaben[0].schritte[0];
      if (schritt.frage === aufgabe.aufgabenstellung.trim()) return true;
    }
  }

  return false;
}

function validateAufgabe(aufgabe, datei, aufgabeNr) {
  const errors = [];
  const warnings = [];
  const label = `${datei}:${aufgabeNr}`;

  // ── Pflichtfelder ──────────────────────────────
  if (!aufgabe.titel || aufgabe.titel.trim().length === 0) {
    errors.push('titel ist leer');
  }
  if (!aufgabe.aufgabenstellung || aufgabe.aufgabenstellung.length < 5) {
    errors.push('aufgabenstellung fehlt oder zu kurz');
  }
  if (!aufgabe.loesung || aufgabe.loesung.trim().length === 0) {
    if (aufgabe.digital !== 'platzhalter') {
      errors.push('loesung ist leer');
    }
  }
  if (!aufgabe.stageId || aufgabe.stageId.trim().length === 0) {
    errors.push('stage_id ist leer');
  }

  // ── Tipps ──────────────────────────────────────
  const echttipps = aufgabe.tipps.slice(0, 3);
  const fallbackTipps = [
    'Lies die Aufgabe nochmal genau durch.',
    'Überlege Schritt für Schritt.',
    'Schau dir die Lösung an und versuche den Rechenweg nachzuvollziehen.',
  ];
  const echteCount = echttipps.filter((t, i) => t !== fallbackTipps[i]).length;
  if (echteCount < 3) {
    warnings.push(`Nur ${echteCount}/3 echte Tipps (${3 - echteCount} Fallback-Tipps)`);
  }
  for (let i = 0; i < 3; i++) {
    if (echttipps[i] !== fallbackTipps[i] && isGenerischerTipp(echttipps[i])) {
      warnings.push(`Tipp ${i + 1} ist generisch: "${echttipps[i].slice(0, 50)}..."`);
    }
  }

  // ── parsed erfolgreich? ────────────────────────
  if (!aufgabe.parsed) {
    errors.push('parsed ist undefined — Parser fehlgeschlagen');
  } else if (isFallbackParsed(aufgabe)) {
    warnings.push('parsed ist Fallback (Parser hat keine Struktur erkannt)');
  }

  // ── Typspezifisch ─────────────────────────────

  const typ = aufgabe.typ;
  const parsed = aufgabe.parsed;

  if ((typ === 'eingabe' || typ === 'luecke') && parsed && parsed.items) {
    for (const item of parsed.items) {
      // Check: Antwort sollte nur Zahlen enthalten (keine Einheiten)
      if (item.antwort && /[a-zA-ZäöüÄÖÜ€§]/.test(item.antwort)) {
        // Allow common non-number answers for certain contexts
        if (!/^(ja|nein|stimmt|richtig|falsch|wahr)/i.test(item.antwort)) {
          warnings.push(`${item.label}: Antwort "${item.antwort}" enthaelt Buchstaben/Einheiten`);
        }
      }
    }
  }

  if (typ === 'schritt' && parsed && parsed.teilaufgaben) {
    const totalSchritte = parsed.teilaufgaben.reduce((sum, t) => sum + t.schritte.length, 0);
    if (totalSchritte < 2) {
      warnings.push(`schritt: Nur ${totalSchritte} Schritt(e) — moegliches Parsing-Problem`);
    }
  }

  return { label, titel: aufgabe.titel, typ: aufgabe.typ, errors, warnings };
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

function main() {
  console.log(`\n${CYAN}━━━ MatheHeldin: Build Aufgaben → JSON ━━━${RESET}\n`);

  // Find MD files
  const files = fs.readdirSync(AUFGABEN_DIR).filter(
    (f) => f.endsWith('.md') && !f.endsWith('.bak') && f !== 'FORMAT.md' && f !== 'TEST_REPORT.md',
  );
  files.sort();

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalAufgaben = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const allResults = [];

  for (const file of files) {
    const markdown = fs.readFileSync(path.join(AUFGABEN_DIR, file), 'utf8');
    const aufgaben = parseAufgabenDatei(markdown);

    // Validate each
    let fileErrors = 0;
    let fileWarnings = 0;

    for (let i = 0; i < aufgaben.length; i++) {
      const result = validateAufgabe(aufgaben[i], file, i + 1);
      allResults.push(result);
      fileErrors += result.errors.length;
      fileWarnings += result.warnings.length;
    }

    totalAufgaben += aufgaben.length;
    totalErrors += fileErrors;
    totalWarnings += fileWarnings;

    // Write JSON output
    const jsonName = file.replace('.md', '.json');
    const jsonPath = path.join(OUTPUT_DIR, jsonName);
    fs.writeFileSync(jsonPath, JSON.stringify(aufgaben, null, 2), 'utf8');

    // Status line
    const status = fileErrors > 0
      ? `${RED}${fileErrors} Fehler${RESET}`
      : fileWarnings > 0
        ? `${YELLOW}${fileWarnings} Warnungen${RESET}`
        : `${GREEN}OK${RESET}`;
    console.log(`  ${file.padEnd(50)} ${String(aufgaben.length).padStart(3)} Aufgaben  ${status}`);
  }

  // Print errors/warnings
  const hasErrors = allResults.some((r) => r.errors.length > 0);
  const hasWarnings = allResults.some((r) => r.warnings.length > 0);

  if (hasErrors) {
    console.log(`\n${RED}── Fehler ──${RESET}`);
    for (const r of allResults) {
      for (const err of r.errors) {
        console.log(`  ${RED}FEHLER${RESET}  ${r.label} "${r.titel}" — ${err}`);
      }
    }
  }

  if (hasWarnings) {
    console.log(`\n${YELLOW}── Warnungen ──${RESET}`);
    for (const r of allResults) {
      for (const warn of r.warnings) {
        console.log(`  ${YELLOW}WARN${RESET}    ${r.label} "${r.titel}" — ${warn}`);
      }
    }
  }

  // Summary
  console.log(`\n${CYAN}── Zusammenfassung ──${RESET}`);
  console.log(`  Dateien:    ${files.length}`);
  console.log(`  Aufgaben:   ${totalAufgaben}`);
  console.log(`  JSON-Files: ${files.length} geschrieben nach ${DIM}src/aufgaben/data/${RESET}`);
  console.log(`  Fehler:     ${totalErrors > 0 ? RED : GREEN}${totalErrors}${RESET}`);
  console.log(`  Warnungen:  ${totalWarnings > 0 ? YELLOW : GREEN}${totalWarnings}${RESET}`);

  if (totalErrors > 0) {
    console.log(`\n${RED}Build fehlgeschlagen — ${totalErrors} Fehler muessen behoben werden.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}Build erfolgreich!${RESET}\n`);
    process.exit(0);
  }
}

main();
