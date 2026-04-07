#!/usr/bin/env node
/**
 * Automatisierter Test aller Aufgaben in der MatheHeldin-Aufgabenbank.
 *
 * Liest alle .md-Dateien aus docs/aufgaben/, parst sie mit der gleichen Logik
 * wie src/aufgaben/parser.ts und prueft Pflicht- sowie View-spezifische Checks.
 *
 * Ausfuehrung:  node scripts/test-aufgaben.cjs
 * Ergebnis:     docs/aufgaben/TEST_REPORT.md
 */

const fs = require('fs');
const path = require('path');

// ─── Paths ──────────────────────────────────────────────────
const AUFGABEN_DIR = path.resolve(__dirname, '..', 'docs', 'aufgaben');
const REPORT_PATH = path.join(AUFGABEN_DIR, 'TEST_REPORT.md');

// ─── Parser (reimplemented from src/aufgaben/parser.ts) ─────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(markdown, name) {
  const pattern = new RegExp(
    `^### ${escapeRegex(name)}[^\\n]*\\n([\\s\\S]*?)(?=^### |$)`,
    'm',
  );
  const match = markdown.match(pattern);
  if (!match) return null;
  const content = match[1].trim();
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
  const aufgabenstellung =
    extractSection(afterYaml, 'Aufgabenstellung');
  const loesung =
    extractSection(afterYaml, 'Lösung') ??
    extractSection(afterYaml, 'Loesung');
  const loesungsweg =
    extractSection(afterYaml, 'Lösungsweg') ??
    extractSection(afterYaml, 'Loesungsweg');
  const tipp1 = extractSection(afterYaml, 'Tipp 1');
  const tipp2 = extractSection(afterYaml, 'Tipp 2');
  const tipp3 = extractSection(afterYaml, 'Tipp 3');
  const didaktischerHinweis = extractSection(
    afterYaml,
    'Didaktischer Hinweis',
  );

  if (!meta.titel || !meta.typ || !aufgabenstellung) return null;

  return {
    titel: meta.titel,
    typ: meta.typ,
    thema: meta.thema || '',
    schwierigkeit: meta.schwierigkeit || 'grün',
    buchseite: parseInt(meta.buchseite || '0', 10),
    kapitel: meta.kapitel || '',
    stageId: meta.stage_id || '',
    digital: meta.digital || 'voll',
    aufgabenstellung,
    loesung: loesung || '',
    loesungsweg: loesungsweg || '',
    tipps: [
      tipp1 || 'Lies die Aufgabe nochmal genau durch.',
      tipp2 || 'Überlege Schritt für Schritt.',
      tipp3 ||
        'Schau dir die Lösung an und versuche den Rechenweg nachzuvollziehen.',
    ],
    tippVorhanden: [!!tipp1, !!tipp2, !!tipp3],
    didaktischerHinweis: didaktischerHinweis || undefined,
    // Keep raw refs for debugging
    _raw: { meta, afterYaml },
  };
}

function parseAufgabenDatei(markdown) {
  const aufgaben = [];
  const blocks = markdown.split(/^## Aufgabe \d+/m);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    const parsed = parseAufgabenBlock(block);
    if (parsed) {
      aufgaben.push(parsed);
    } else {
      // Record unparseable blocks as errors
      aufgaben.push({ _unparseable: true, _blockPreview: block.slice(0, 200) });
    }
  }
  return aufgaben;
}

// ─── Validation ─────────────────────────────────────────────

const VALID_TYPEN = [
  'eingabe',
  'auswahl',
  'zuordnung',
  'luecke',
  'reihenfolge',
  'schritt',
  'wahr-falsch',
  'textaufgabe',
];
const VALID_SCHWIERIGKEIT = ['gelb', 'grün', 'gruen', 'orange'];

function validateAufgabe(aufgabe, datei, aufgabeNr) {
  const fails = [];
  const warns = [];
  const label = `${datei} / Aufgabe ${aufgabeNr}`;

  if (aufgabe._unparseable) {
    fails.push('Block konnte nicht geparst werden (kein YAML oder fehlende Pflichtfelder)');
    return { label, titel: '(nicht parsebar)', typ: '?', fails, warns };
  }

  const { titel, typ, aufgabenstellung, loesung, schwierigkeit, kapitel, tipps, tippVorhanden, digital } = aufgabe;

  // ── Pflicht-Checks ──────────────────────────────
  if (!titel || titel.trim().length === 0) {
    fails.push('titel ist leer');
  }

  if (!VALID_TYPEN.includes(typ)) {
    fails.push(`typ "${typ}" ist nicht gueltig (erlaubt: ${VALID_TYPEN.join(', ')})`);
  }

  if (!aufgabenstellung || aufgabenstellung.length < 10) {
    fails.push(`aufgabenstellung zu kurz (${(aufgabenstellung || '').length} Zeichen, min 10)`);
  }

  if (!loesung || loesung.trim().length === 0) {
    if (digital !== 'platzhalter') {
      fails.push('loesung ist leer (und digital != platzhalter)');
    }
  }

  if (!VALID_SCHWIERIGKEIT.includes(schwierigkeit)) {
    fails.push(`schwierigkeit "${schwierigkeit}" ist ungueltig (erlaubt: ${VALID_SCHWIERIGKEIT.join(', ')})`);
  }

  if (!kapitel || kapitel.trim().length === 0) {
    fails.push('kapitel ist leer');
  }

  // Mindestens 1 echter Tipp vorhanden (nicht der Fallback)
  const echterTippCount = tippVorhanden.filter(Boolean).length;
  if (echterTippCount < 1) {
    fails.push('Kein einziger Tipp vorhanden (alle 3 sind Fallback-Texte)');
  }

  // ── View-spezifische Checks ────────────────────

  if (typ === 'eingabe') {
    // Pruefen ob a/b/c Teilaufgaben vorhanden
    const fragenMatches = aufgabenstellung.match(/^[a-z]\)/gm);
    const loesungMatches = loesung.match(/^[a-z]\)/gm);
    if (fragenMatches && loesungMatches) {
      if (fragenMatches.length !== loesungMatches.length) {
        fails.push(
          `eingabe: Anzahl Fragen (${fragenMatches.length}) != Anzahl Loesungen (${loesungMatches.length})`,
        );
      }
    } else if (fragenMatches && !loesungMatches) {
      // Check if loesung has a), b) etc in any format (e.g. just "a) 123\nb) 456")
      // Also accept loesung lines starting with a), etc. without ^ anchor
      const loesungLinesWithLetters = loesung.match(/^[a-z]\)/gm);
      if (!loesungLinesWithLetters) {
        warns.push(
          `eingabe: Aufgabe hat ${fragenMatches.length} Teilaufgaben (a/b/c) aber Loesung hat kein a/b/c-Format`,
        );
      }
    }
  }

  if (typ === 'auswahl') {
    // Check for uppercase A/B/C/D options or lowercase a/b/c
    const hasUpperOptions = /^[A-D]\)/m.test(aufgabenstellung);
    const hasLowerOptions = /^[a-d]\)/m.test(aufgabenstellung);
    if (!hasUpperOptions && !hasLowerOptions) {
      warns.push('auswahl: Keine A/B/C/D- oder a/b/c/d-Optionen in der Aufgabenstellung erkannt');
    }
  }

  if (typ === 'luecke') {
    const hasLuecke = /▢|___/.test(aufgabenstellung);
    if (!hasLuecke) {
      warns.push('luecke: Aufgabenstellung enthaelt weder "▢" noch "___"');
    }
  }

  if (typ === 'schritt') {
    const fragenMatches = aufgabenstellung.match(/^[a-z]\)/gm);
    const loesungMatches = loesung.match(/^[a-z]\)/gm);
    if (fragenMatches && loesungMatches) {
      if (fragenMatches.length !== loesungMatches.length) {
        fails.push(
          `schritt: Anzahl Schritte (${fragenMatches.length}) != Anzahl Loesungen (${loesungMatches.length})`,
        );
      }
    }
  }

  if (typ === 'wahr-falsch') {
    const loesungLower = loesung.toLowerCase();
    const hasWahrFalschTerms =
      /stimmt|richtig|falsch|ja|nein|✓|✗|wahr/i.test(loesung);
    if (!hasWahrFalschTerms) {
      warns.push(
        'wahr-falsch: Loesung enthaelt keines von: stimmt, richtig, falsch, ja, nein, ✓, ✗',
      );
    }
  }

  if (typ === 'textaufgabe') {
    // Context (text before first a/) should not be empty
    const beforeA = aufgabenstellung.split(/^[a-z]\)/m)[0].trim();
    if (!beforeA || beforeA.length < 10) {
      warns.push(
        `textaufgabe: Kontext vor a/ ist zu kurz oder leer (${(beforeA || '').length} Zeichen)`,
      );
    }
  }

  if (typ === 'zuordnung') {
    // Check for at least 2 zuordenbare Elemente (arrows, pipes, table rows, bullet points)
    const arrowCount = (loesung.match(/→|->|↔/g) || []).length;
    const bulletCount = (loesung.match(/^[-*•]/gm) || []).length;
    const tableRowCount = (aufgabenstellung.match(/^\|/gm) || []).length;
    if (arrowCount < 2 && bulletCount < 2 && tableRowCount < 2) {
      warns.push(
        `zuordnung: Weniger als 2 zuordenbare Elemente gefunden (Pfeile: ${arrowCount}, Bullets: ${bulletCount}, Tabellenzeilen: ${tableRowCount})`,
      );
    }
  }

  if (typ === 'reihenfolge') {
    // Loesung should contain sorted elements (> or < or comma-separated)
    const hasSortIndicator = /[<>]|→|,/.test(loesung);
    if (!hasSortIndicator) {
      warns.push('reihenfolge: Loesung enthaelt keine Sortier-Indikatoren (<, >, →, Komma)');
    }
  }

  return { label, titel: titel || '?', typ: typ || '?', fails, warns };
}

// ─── Main ───────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(AUFGABEN_DIR).filter(
    (f) => f.endsWith('.md') && f !== 'FORMAT.md' && f !== 'TEST_REPORT.md',
  );
  files.sort();

  let totalAufgaben = 0;
  let totalPass = 0;
  let totalFail = 0;
  let totalWarn = 0;
  let totalUnparseable = 0;

  const allResults = [];
  const failsByType = {}; // typ -> [{label, reason}]
  const warnsByType = {};

  for (const file of files) {
    const markdown = fs.readFileSync(path.join(AUFGABEN_DIR, file), 'utf8');
    const aufgaben = parseAufgabenDatei(markdown);

    for (let i = 0; i < aufgaben.length; i++) {
      totalAufgaben++;
      const aufgabe = aufgaben[i];
      const result = validateAufgabe(aufgabe, file, i + 1);

      if (result.fails.length > 0) {
        totalFail++;
        for (const reason of result.fails) {
          const typ = result.typ;
          if (!failsByType[typ]) failsByType[typ] = [];
          failsByType[typ].push({ label: result.label, reason });
        }
      } else {
        totalPass++;
      }

      if (result.warns.length > 0) {
        totalWarn++;
        for (const reason of result.warns) {
          const typ = result.typ;
          if (!warnsByType[typ]) warnsByType[typ] = [];
          warnsByType[typ].push({ label: result.label, reason });
        }
      }

      if (aufgabe._unparseable) totalUnparseable++;

      allResults.push(result);
    }
  }

  // ── Console Output ────────────────────────────────
  console.log(`\n=== MatheHeldin Aufgaben-Test ===\n`);
  console.log(`Dateien:      ${files.length}`);
  console.log(`Aufgaben:     ${totalAufgaben}`);
  console.log(`PASS:         ${totalPass}`);
  console.log(`FAIL:         ${totalFail}`);
  console.log(`WARN:         ${totalWarn}`);
  console.log(`Unparseable:  ${totalUnparseable}`);
  console.log(`Quote:        ${((totalPass / totalAufgaben) * 100).toFixed(1)}%\n`);

  if (totalFail > 0) {
    console.log(`--- FAILS ---`);
    for (const r of allResults) {
      if (r.fails.length > 0) {
        for (const f of r.fails) {
          console.log(`  FAIL  ${r.label} — ${f}`);
        }
      }
    }
    console.log('');
  }

  if (totalWarn > 0) {
    console.log(`--- WARNS ---`);
    for (const r of allResults) {
      if (r.warns.length > 0) {
        for (const w of r.warns) {
          console.log(`  WARN  ${r.label} — ${w}`);
        }
      }
    }
    console.log('');
  }

  // ── Report ────────────────────────────────────────
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const lines = [];
  lines.push(`# Aufgaben-Test Report`);
  lines.push(`Generiert: ${now}\n`);
  lines.push(`## Zusammenfassung\n`);
  lines.push(`| Metrik | Wert |`);
  lines.push(`|--------|------|`);
  lines.push(`| Dateien | ${files.length} |`);
  lines.push(`| Aufgaben gesamt | ${totalAufgaben} |`);
  lines.push(`| PASS | ${totalPass} |`);
  lines.push(`| FAIL | ${totalFail} |`);
  lines.push(`| WARN (kein Fehler) | ${totalWarn} |`);
  lines.push(`| Nicht parsebar | ${totalUnparseable} |`);
  lines.push(`| Bestehensquote | ${((totalPass / totalAufgaben) * 100).toFixed(1)}% |`);
  lines.push('');

  // Fails by type
  if (Object.keys(failsByType).length > 0) {
    lines.push(`## Fehler nach Typ\n`);
    for (const [typ, items] of Object.entries(failsByType).sort()) {
      lines.push(`### ${typ} (${items.length} Fehler)\n`);
      for (const item of items) {
        lines.push(`- **${item.label}**: ${item.reason}`);
      }
      lines.push('');
    }
  }

  // Warns by type
  if (Object.keys(warnsByType).length > 0) {
    lines.push(`## Warnungen nach Typ\n`);
    for (const [typ, items] of Object.entries(warnsByType).sort()) {
      lines.push(`### ${typ} (${items.length} Warnungen)\n`);
      for (const item of items) {
        lines.push(`- **${item.label}**: ${item.reason}`);
      }
      lines.push('');
    }
  }

  // Per-file summary
  lines.push(`## Ergebnisse pro Datei\n`);
  let currentFile = '';
  for (const r of allResults) {
    const file = r.label.split(' / ')[0];
    if (file !== currentFile) {
      currentFile = file;
      lines.push(`\n### ${file}\n`);
      lines.push(`| Aufgabe | Titel | Typ | Status | Details |`);
      lines.push(`|---------|-------|-----|--------|---------|`);
    }
    const nr = r.label.split('Aufgabe ')[1];
    const status = r.fails.length > 0 ? 'FAIL' : r.warns.length > 0 ? 'WARN' : 'PASS';
    const emoji = status === 'FAIL' ? '&#x274C;' : status === 'WARN' ? '&#x26A0;' : '&#x2705;';
    const details = [
      ...r.fails.map((f) => `FAIL: ${f}`),
      ...r.warns.map((w) => `WARN: ${w}`),
    ].join('; ') || '-';
    // Escape pipes in titel/details
    const safeTitle = (r.titel || '').replace(/\|/g, '\\|');
    const safeDetails = details.replace(/\|/g, '\\|');
    lines.push(`| ${nr} | ${safeTitle} | ${r.typ} | ${emoji} ${status} | ${safeDetails} |`);
  }

  lines.push('\n---\n');
  lines.push(`*Automatisch generiert von scripts/test-aufgaben.cjs*`);

  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(`Report geschrieben: ${REPORT_PATH}`);
}

main();
