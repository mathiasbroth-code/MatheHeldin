#!/usr/bin/env node
/**
 * Vollständiger Aufgaben-Validator für MatheHeldin.
 *
 * Prüft ALLE Aufgaben in src/aufgaben/data/*.json gegen:
 *   1. Struktur-Checks  — Pflichtfelder, Typen, Referenzen
 *   2. Kindgerecht-Checks — Sprache, Verständlichkeit, Tonalität
 *
 * Ausfuehrung:  node scripts/validate-aufgaben.cjs
 * Optionen:     --fix   automatisch behebbare Fehler fixen (TODO: spätere Erweiterung)
 *               --json  Ergebnis als JSON statt als Konsolen-Report
 */

const fs = require('fs');
const path = require('path');

// ── Pfade ──────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'aufgaben', 'data');
const STAGE_MAPPING_PATH = path.join(ROOT, 'src', 'aufgaben', 'stageMapping.ts');

// ── Gültige Werte ──────────────────────────────────────────
const VALID_TYPEN = ['eingabe', 'schritt', 'luecke', 'lücke', 'auswahl', 'zuordnung', 'wahr-falsch', 'textaufgabe', 'reihenfolge'];
const VALID_DIGITAL = ['voll', 'teilweise', 'platzhalter'];
const VALID_SCHWIERIGKEIT = ['gelb', 'grün', 'orange'];

// ── StageIds aus stageMapping.ts extrahieren ───────────────
function loadValidStageIds() {
  const content = fs.readFileSync(STAGE_MAPPING_PATH, 'utf8');
  const matches = content.matchAll(/stageId:\s*'([^']+)'/g);
  return new Set([...matches].map(m => m[1]));
}

// ── Asset-Existenz prüfen ──────────────────────────────────
function assetExists(relativePath) {
  if (!relativePath) return true;
  // Assets liegen in public/ oder src/
  const publicPath = path.join(ROOT, 'public', relativePath);
  const srcPath = path.join(ROOT, 'src', relativePath);
  const rootPath = path.join(ROOT, relativePath);
  return fs.existsSync(publicPath) || fs.existsSync(srcPath) || fs.existsSync(rootPath);
}

// ── Kindgerecht-Wortlisten ────────────────────────────────
const JARGON_WORDS = [
  'algorithmus', 'variable', 'parameter', 'funktion', 'abstrakt',
  'komplex', 'optimier', 'implementier', 'iteration', 'rekursion',
  'integer', 'float', 'string', 'array', 'objekt',
  'mathematisch gesehen', 'formal', 'trivial',
];

const DISCOURAGING_WORDS = [
  'dumm', 'schlecht', 'falsch gemacht', 'das ist falsch',
  'das kannst du nicht', 'zu schwer für dich',
];

const ENGLISH_LEAK_WORDS = [
  'please', 'answer', 'correct', 'wrong', 'submit',
  'check', 'hint', 'solution', 'step', 'total',
  'calculate', 'multiply', 'divide', 'fraction',
];

// ── Einzelne Checks ────────────────────────────────────────

function checkStruktur(aufgabe, idx, dateiName, validStageIds) {
  const errors = [];
  const warnings = [];
  const prefix = `[${dateiName}#${idx}] "${aufgabe.titel || '(kein Titel)'}"`;

  const istPlatzhalter = aufgabe.digital === 'platzhalter';

  // Pflichtfelder (bei Platzhaltern nur Basisdaten prüfen)
  const pflichtfelder = istPlatzhalter
    ? ['titel', 'typ', 'stageId']
    : ['titel', 'typ', 'stageId', 'aufgabenstellung', 'loesung', 'tipps', 'parsed'];
  for (const feld of pflichtfelder) {
    if (!aufgabe[feld] && aufgabe[feld] !== 0) {
      errors.push(`${prefix}: Pflichtfeld "${feld}" fehlt`);
    }
  }

  // Platzhalter: keine weiteren Struktur-Checks nötig (Pool filtert sie raus)
  if (istPlatzhalter) {
    return { errors, warnings };
  }

  // Typ gültig
  if (aufgabe.typ && !VALID_TYPEN.includes(aufgabe.typ)) {
    errors.push(`${prefix}: Unbekannter Typ "${aufgabe.typ}"`);
  }

  // StageId gültig
  if (aufgabe.stageId && !validStageIds.has(aufgabe.stageId)) {
    errors.push(`${prefix}: StageId "${aufgabe.stageId}" nicht in stageMapping.ts`);
  }

  // Digital-Status
  if (aufgabe.digital === 'platzhalter') {
    warnings.push(`${prefix}: Noch als PLATZHALTER markiert`);
  }
  if (aufgabe.digital && !VALID_DIGITAL.includes(aufgabe.digital)) {
    errors.push(`${prefix}: Unbekannter digital-Status "${aufgabe.digital}"`);
  }

  // Schwierigkeit
  if (aufgabe.schwierigkeit && !VALID_SCHWIERIGKEIT.includes(aufgabe.schwierigkeit)) {
    errors.push(`${prefix}: Unbekannte Schwierigkeit "${aufgabe.schwierigkeit}"`);
  }

  // Lösung nicht leer
  if (typeof aufgabe.loesung === 'string' && aufgabe.loesung.trim() === '') {
    errors.push(`${prefix}: Lösung ist leer`);
  }

  // Tipps
  if (Array.isArray(aufgabe.tipps)) {
    if (aufgabe.tipps.length !== 4) {
      errors.push(`${prefix}: Tipps hat ${aufgabe.tipps.length} Einträge (erwartet: 4)`);
    }
    aufgabe.tipps.forEach((tipp, i) => {
      if (i < 3 && (!tipp || tipp.trim() === '')) {
        errors.push(`${prefix}: Tipp ${i + 1} ist leer`);
      }
    });
  }

  // Parsed-Struktur
  if (aufgabe.parsed) {
    const p = aufgabe.parsed;

    // Typ-Match
    if (p.typ && aufgabe.typ && p.typ !== aufgabe.typ) {
      if (!(p.typ === 'luecke' && aufgabe.typ === 'lücke') && !(p.typ === 'lücke' && aufgabe.typ === 'luecke')) {
        warnings.push(`${prefix}: parsed.typ "${p.typ}" ≠ aufgabe.typ "${aufgabe.typ}"`);
      }
    }

    // Items prüfen (eingabe, textaufgabe, wahr-falsch, luecke, zuordnung)
    if (p.items && Array.isArray(p.items)) {
      p.items.forEach((item, i) => {
        if (item.antwort !== undefined && typeof item.antwort === 'string' && item.antwort.trim() === '') {
          errors.push(`${prefix}: parsed.items[${i}] (${item.label || i}) hat leere Antwort`);
        }
        if (item.frage !== undefined && typeof item.frage === 'string' && item.frage.includes('PLATZHALTER')) {
          errors.push(`${prefix}: parsed.items[${i}] enthält "PLATZHALTER"`);
        }
      });
    }

    // Schritt-Items prüfen
    if (p.teilaufgaben && Array.isArray(p.teilaufgaben)) {
      p.teilaufgaben.forEach((teil, ti) => {
        if (teil.schritte && Array.isArray(teil.schritte)) {
          teil.schritte.forEach((schritt, si) => {
            if (!schritt.antwort || schritt.antwort.trim() === '') {
              errors.push(`${prefix}: Teilaufgabe ${teil.label || ti}, Schritt ${si}: leere Antwort`);
            }
          });
        }
      });
    }

    // Wahr-Falsch Items
    if (p.items && aufgabe.typ === 'wahr-falsch') {
      p.items.forEach((item, i) => {
        if (item.richtig === undefined) {
          errors.push(`${prefix}: Wahr-Falsch Item ${i} hat kein "richtig"-Feld`);
        }
        if (!item.aussage || item.aussage.trim() === '') {
          errors.push(`${prefix}: Wahr-Falsch Item ${i} hat keine Aussage`);
        }
      });
    }

    // Auswahl-Items
    if (aufgabe.typ === 'auswahl') {
      if (!p.optionen || !Array.isArray(p.optionen) || p.optionen.length === 0) {
        errors.push(`${prefix}: Auswahl hat keine Optionen`);
      }
      if (p.richtigeIdx === undefined || p.richtigeIdx === null) {
        errors.push(`${prefix}: Auswahl hat keinen richtigeIdx`);
      }
    }
  }

  // Bild-Referenzen
  if (aufgabe.erklaerungBild && !assetExists(aufgabe.erklaerungBild)) {
    warnings.push(`${prefix}: erklaerungBild nicht gefunden: ${aufgabe.erklaerungBild}`);
  }
  if (aufgabe.themenIntroBild && !assetExists(aufgabe.themenIntroBild)) {
    warnings.push(`${prefix}: themenIntroBild nicht gefunden: ${aufgabe.themenIntroBild}`);
  }
  if (Array.isArray(aufgabe.tippBilder)) {
    aufgabe.tippBilder.forEach((bild, i) => {
      if (bild && !assetExists(bild)) {
        warnings.push(`${prefix}: tippBilder[${i}] nicht gefunden: ${bild}`);
      }
    });
  }

  return { errors, warnings };
}

function checkKindgerecht(aufgabe, idx, dateiName) {
  const errors = [];
  const warnings = [];
  const prefix = `[${dateiName}#${idx}] "${aufgabe.titel || '(kein Titel)'}"`;

  // Platzhalter überspringen — werden nie angezeigt
  if (aufgabe.digital === 'platzhalter') return { errors, warnings };

  const allText = [
    aufgabe.aufgabenstellung || '',
    ...(aufgabe.tipps || []),
    aufgabe.loesung || '',
    aufgabe.loesungsweg || '',
  ].join(' ').toLowerCase();

  // PLATZHALTER-Marker im Text (nicht das Mathe-Wort "Platzhalter" fuer Leerstellen)
  if (/⚠️.*platzhalter|platzhalter.*nicht digital|platzhalter.*umsetzbar/i.test(allText)) {
    errors.push(`${prefix}: Text enthält PLATZHALTER-Marker — nicht für Kinder sichtbar`);
  }

  // TODO/FIXME Reste
  if (/\b(todo|fixme|xxx|hack)\b/i.test(allText)) {
    errors.push(`${prefix}: Enthält Entwickler-Marker (TODO/FIXME)`);
  }

  // Jargon
  for (const word of JARGON_WORDS) {
    if (allText.includes(word)) {
      warnings.push(`${prefix}: Enthält Fachjargon: "${word}"`);
    }
  }

  // Entmutigende Sprache
  for (const word of DISCOURAGING_WORDS) {
    if (allText.includes(word)) {
      errors.push(`${prefix}: Enthält entmutigende Sprache: "${word}"`);
    }
  }

  // Englische Wörter (nur in Aufgabenstellung + Tipps, nicht in Lösungsweg)
  const kinderText = [
    aufgabe.aufgabenstellung || '',
    ...(aufgabe.tipps || []),
  ].join(' ').toLowerCase();

  for (const word of ENGLISH_LEAK_WORDS) {
    // Wort-Grenze prüfen damit "Strecke" nicht "check" matcht
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(kinderText)) {
      warnings.push(`${prefix}: Enthält möglicherweise englisches Wort: "${word}"`);
    }
  }

  // Aufgabenstellung zu lang (>600 Zeichen = viel für 9-Jährige)
  if (aufgabe.aufgabenstellung && aufgabe.aufgabenstellung.length > 600) {
    warnings.push(`${prefix}: Aufgabenstellung sehr lang (${aufgabe.aufgabenstellung.length} Zeichen)`);
  }

  // Tipps: Tipp 4 sollte die Lösung/den Lösungsweg enthalten
  if (Array.isArray(aufgabe.tipps) && aufgabe.tipps.length >= 4 && aufgabe.tipps[3]) {
    const tipp4 = aufgabe.tipps[3].toLowerCase();
    const loesung = (aufgabe.loesung || '').toLowerCase();
    // Heuristik: Tipp 4 sollte mindestens eine Zahl aus der Lösung enthalten
    const loesungsZahlen = loesung.match(/\d+/g) || [];
    if (loesungsZahlen.length > 0) {
      const hatZahlAusLoesung = loesungsZahlen.some(z => tipp4.includes(z));
      if (!hatZahlAusLoesung && tipp4.length < 20) {
        warnings.push(`${prefix}: Tipp 4 scheint die Lösung nicht zu enthalten`);
      }
    }
  }

  // Tipps: Progressive Scaffolding — Tipp 1 sollte kürzer sein als Tipp 4
  if (Array.isArray(aufgabe.tipps) && aufgabe.tipps.length >= 4) {
    const t1 = (aufgabe.tipps[0] || '').length;
    const t4 = (aufgabe.tipps[3] || '').length;
    if (t1 > 0 && t4 > 0 && t1 > t4 * 1.5) {
      warnings.push(`${prefix}: Tipp 1 (${t1} Zeichen) ist deutlich länger als Tipp 4 (${t4} Zeichen) — umgekehrtes Scaffolding?`);
    }
  }

  // Fehlende Punkte am Satzende in Tipps (Qualitätssignal)
  if (Array.isArray(aufgabe.tipps)) {
    aufgabe.tipps.forEach((tipp, i) => {
      if (tipp && tipp.length > 30) {
        const lastChar = tipp.trim().slice(-1);
        if (!/[.!?)\]]/.test(lastChar) && !/\d$/.test(tipp.trim())) {
          // Endet nicht mit Satzzeichen oder Zahl
          warnings.push(`${prefix}: Tipp ${i + 1} endet ohne Satzzeichen`);
        }
      }
    });
  }

  // Aufgabenstellung enthält ⚠️ oder ähnliche Warn-Emojis
  if (aufgabe.aufgabenstellung && /[⚠️🚧🔴❌]/.test(aufgabe.aufgabenstellung)) {
    errors.push(`${prefix}: Aufgabenstellung enthält Warn-Emojis (nicht kindgerecht)`);
  }

  return { errors, warnings };
}

// ── Haupt-Validierung ──────────────────────────────────────

function main() {
  const jsonFlag = process.argv.includes('--json');
  const validStageIds = loadValidStageIds();

  const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort();

  let totalAufgaben = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const allResults = [];

  for (const datei of dataFiles) {
    const filePath = path.join(DATA_DIR, datei);
    let aufgaben;
    try {
      aufgaben = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      allResults.push({ file: datei, errors: [`JSON Parse-Fehler: ${e.message}`], warnings: [] });
      totalErrors++;
      continue;
    }

    if (!Array.isArray(aufgaben)) {
      allResults.push({ file: datei, errors: ['Datei ist kein Array'], warnings: [] });
      totalErrors++;
      continue;
    }

    for (let i = 0; i < aufgaben.length; i++) {
      totalAufgaben++;
      const aufgabe = aufgaben[i];

      const struktur = checkStruktur(aufgabe, i, datei, validStageIds);
      const kindgerecht = checkKindgerecht(aufgabe, i, datei);

      const errors = [...struktur.errors, ...kindgerecht.errors];
      const warnings = [...struktur.warnings, ...kindgerecht.warnings];

      totalErrors += errors.length;
      totalWarnings += warnings.length;

      if (errors.length > 0 || warnings.length > 0) {
        allResults.push({ file: datei, index: i, titel: aufgabe.titel, errors, warnings });
      }
    }
  }

  // ── Ausgabe ──────────────────────────────────────────────

  if (jsonFlag) {
    console.log(JSON.stringify({ totalAufgaben, totalErrors, totalWarnings, results: allResults }, null, 2));
    return;
  }

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   MatheHeldin — Aufgaben-Validator       ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log(`📊 ${totalAufgaben} Aufgaben in ${dataFiles.length} Dateien geprüft\n`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✅ Alles in Ordnung! Keine Fehler oder Warnungen.\n');
    process.exit(0);
    return;
  }

  // Fehler gruppiert nach Datei
  const byFile = new Map();
  for (const r of allResults) {
    const key = r.file;
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key).push(r);
  }

  for (const [file, results] of byFile) {
    const fileErrors = results.reduce((s, r) => s + r.errors.length, 0);
    const fileWarnings = results.reduce((s, r) => s + r.warnings.length, 0);
    console.log(`\n── ${file} (${fileErrors} Fehler, ${fileWarnings} Warnungen) ──`);

    for (const r of results) {
      for (const e of r.errors) {
        console.log(`  ❌ ${e}`);
      }
      for (const w of r.warnings) {
        console.log(`  ⚠️  ${w}`);
      }
    }
  }

  // Zusammenfassung
  console.log('\n────────────────────────────────────────');
  console.log(`❌ ${totalErrors} Fehler`);
  console.log(`⚠️  ${totalWarnings} Warnungen`);
  console.log(`📊 ${totalAufgaben} Aufgaben geprüft`);

  const fehlerRate = ((totalErrors / totalAufgaben) * 100).toFixed(1);
  console.log(`📈 Fehlerrate: ${fehlerRate}%\n`);

  // Top-Kategorien
  const errorCategories = new Map();
  for (const r of allResults) {
    for (const e of [...r.errors, ...r.warnings]) {
      // Kategorie aus dem Text extrahieren (nach dem Titel-Teil)
      const match = e.match(/:\s*(.+?)(?:\s*"|$)/);
      const cat = match ? match[1].substring(0, 40) : 'Sonstige';
      errorCategories.set(cat, (errorCategories.get(cat) || 0) + 1);
    }
  }

  const sorted = [...errorCategories.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  if (sorted.length > 0) {
    console.log('Top-Probleme:');
    for (const [cat, count] of sorted) {
      console.log(`  ${count}× ${cat}`);
    }
    console.log('');
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
