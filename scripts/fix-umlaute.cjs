#!/usr/bin/env node
/**
 * fix-umlaute.cjs
 *
 * Fixes ASCII-encoded German umlauts in docs/aufgaben/*.md files.
 * Replaces ae→ä, oe→ö, ue→ü (and uppercase variants) within words,
 * while skipping:
 *   - a whitelist of legitimate words containing these digraphs
 *   - words that already contain proper umlauts (mixed state)
 *   - content inside backtick spans (inline code / filenames)
 *   - content inside fenced code blocks
 */

const fs = require('fs');
const path = require('path');

const AUFGABEN_DIR = path.resolve(__dirname, '..', 'docs', 'aufgaben');

// Files to exclude
const EXCLUDE_FILES = new Set(['FORMAT.md', 'TEST_REPORT.md']);

// ─── WHITELIST ────────────────────────────────────────────────────────
// Pattern-based skip rules (applied to the LOWERCASED word).
// If any pattern matches, the word is NOT modified.

const SKIP_PATTERNS = [
  // --- "ue" is legitimately not ü ---
  /zuerst/,                    // zuerst, Zuerst
  /quersumm/,                  // Quersumme, Quersummen, Quersummenregel
  /querst/,                    // Querstrich
  /querb/,                     // Querbalken
  /^aktuell/,                  // aktuell, aktuelle, aktuellen, aktueller
  /abenteuer/,                 // Abenteuer
  /^genau/,                    // genau, genaue, genauer, genaues, genauem
  /ungenau/,                   // ungenauer
  /^neue[rnms]?$/,             // neue, neuen, neuer, neues, neuem
  /^erneu/,                    // erneuer, erneuerbar
  /^blaue[rnms]?$/,            // blaue, blauen, blauer, blaues
  /dauer/,                     // Dauer, dauert, Spieldauer, Ausdauer
  /mauer/,                     // Mauer, Mauern, Burgmauern, Zahlenmauern
  /^bauer/,                    // Bauer, Bauern, Bauernhof (but not Gebäuer)
  /steuer/,                    // Steuer
  /feuer/,                     // Feuer, Feuerwehr
  /teuer/,                     // teuer, teuersten
  /zuschauer/,                 // Zuschauer, Zuschauerzahlen, Zuschauerpl
  /frequenz/,                  // Frequenz
  /sequenz/,                   // sequenzielle
  /vertrauen/,                 // Vertrauen, vertrauen
  /^(?:auf)?bauen$/,           // bauen, aufbauen
  /^aufbauend$/,               // aufbauend
  /^schaue[n]?$/,              // schaue, schauen
  /^hinzuschauen$/,            // hinzuschauen
  /^visuell/,                  // visuell, visuelle, visuelles, visuellen, visueller
  /^virtuell/,                 // virtuell, virtuelle, virtuelles, virtueller
  /^zueinander$/,              // zueinander
  /^schlauen$/,                // schlauen
  /fehlerquelle/,              // Fehlerquelle, Fehlerquellen
  /^minuend$/,                 // Minuend
  /^dazuerfinden$/,            // dazuerfinden (= dazu erfinden)
  // --- "oe" is legitimately not ö ---
  /^noemi$/,                   // proper name
  /koeffizient/,               // Koeffizient, Binomialkoeffizienten
  // --- proper nouns ---
  /^israel$/, /^manuel$/, /^rafael$/,
  // --- French loanword ---
  /^baguette$/,                // Baguette
];

// ─── REPLACEMENT LOGIC ───────────────────────────────────────────────

/**
 * Check if a word (lowercased) should be skipped entirely.
 */
function shouldSkip(wordLower) {
  for (const pat of SKIP_PATTERNS) {
    if (pat.test(wordLower)) return true;
  }
  return false;
}

/**
 * Replace ae→ä, oe→ö, ue→ü in a single word.
 * Handles uppercase variants: Ae→Ä, Oe→Ö, Ue→Ü.
 *
 * IMPORTANT: If the word already contains proper umlauts (ä, ö, ü, Ä, Ö, Ü),
 * we still process it (e.g. "Wuerfelmöglichkeiten" → "Würfelmöglichkeiten",
 * "Ueberprüfe" → "Überprüfe"), BUT we must be careful not to double-replace.
 * Since we only replace ASCII digraphs, and proper umlauts are single chars,
 * this is safe — we just need to ensure the skip patterns don't false-match
 * on already-replaced chars.
 *
 * HOWEVER: Words like "Bäuerin" already have ä and the "ue" in "uerin" is
 * legitimate (not an encoded ü). So we skip words where the ae/oe/ue digraph
 * is adjacent to an existing umlaut in a way that suggests it's already correct.
 *
 * The safest approach: if a word ALREADY contains ä/ö/ü/Ä/Ö/Ü, only replace
 * digraphs that are clearly encoded umlauts. We handle this by checking if
 * the word with umlauts has a plausible "ue" that's not an umlaut.
 */
function replaceUmlautsInWord(word) {
  const lower = word.toLowerCase();

  // Skip whitelisted words (check against lowercased form)
  if (shouldSkip(lower)) return word;

  // If the word already contains proper umlauts, be more careful.
  // Specifically: if there's an existing ä/ö/ü right before "ue"/"ae"/"oe",
  // or the "ue" follows a vowel that suggests it's legitimate German,
  // we need to check case by case.
  //
  // The main problematic pattern: "Bäuerin" — here ä+ue+rin.
  // The "ue" after "ä" is NOT an encoded ü, it's part of "äu" (Bauer→Bäuerin).
  // Similarly: any word with "äue" pattern should not replace "ue".
  //
  // Strategy: if the word already has an umlaut, do selective replacement
  // only where the digraph is not adjacent to an existing umlaut.
  if (/[äöüÄÖÜ]/.test(word)) {
    return replaceSelectiveInMixedWord(word);
  }

  let result = word;

  // Replace AE → Ä (all-caps)
  result = result.replace(/AE/g, 'Ä');
  // Replace Ae → Ä (title-case)
  result = result.replace(/Ae/g, 'Ä');
  // Replace ae → ä (lowercase)
  result = result.replace(/ae/g, 'ä');
  // Replace OE → Ö (all-caps)
  result = result.replace(/OE/g, 'Ö');
  // Replace Oe → Ö (title-case)
  result = result.replace(/Oe/g, 'Ö');
  // Replace oe → ö (lowercase)
  result = result.replace(/oe/g, 'ö');
  // Replace UE → Ü (all-caps, but not after Q)
  result = result.replace(/(?<![qQ])UE/g, 'Ü');
  // Replace Ue → Ü (title-case, but not after q/Q)
  result = result.replace(/(?<![qQ])Ue/g, 'Ü');
  // Replace ue → ü (lowercase, but not after q/Q)
  result = result.replace(/(?<![qQ])ue/g, 'ü');

  return result;
}

/**
 * Handle words that already contain some proper umlauts mixed with ASCII digraphs.
 * Example: "Ueberprüfe" → "Überprüfe" (replace Ue at start)
 *          "Wuerfelmöglichkeiten" → "Würfelmöglichkeiten" (replace ue in Wuerfel)
 *          "Bäuerin" → "Bäuerin" (DON'T replace, äu is legitimate)
 *          "Frequenzänderungen" → "Frequenzänderungen" (DON'T replace, no digraph)
 *          "Zuschauerplätze" → "Zuschauerplätze" (DON'T replace)
 */
function replaceSelectiveInMixedWord(word) {
  let result = word;

  // Don't replace "ue" if preceded by "ä" (pattern: äue → legitimate German)
  // Don't replace "ae"/"oe"/"ue" if directly adjacent to existing umlauts

  // Replace Ae → Ä (only if not adjacent to existing umlauts in problematic way)
  result = result.replace(/(?<![äöüÄÖÜ])Ae(?![äöüÄÖÜ])/g, 'Ä');
  result = result.replace(/(?<![äöüÄÖÜ])ae(?![äöüÄÖÜ])/g, 'ä');
  result = result.replace(/(?<![äöüÄÖÜ])Oe(?![äöüÄÖÜ])/g, 'Ö');
  result = result.replace(/(?<![äöüÄÖÜ])oe(?![äöüÄÖÜ])/g, 'ö');
  result = result.replace(/(?<![qQäöüÄÖÜ])Ue(?![äöüÄÖÜ])/g, 'Ü');
  result = result.replace(/(?<![qQäöüÄÖÜ])ue(?![äöüÄÖÜ])/g, 'ü');

  return result;
}

/**
 * Process an entire text, replacing umlauts word-by-word.
 * Preserves content inside backticks (inline code) and fenced code blocks.
 */
function fixUmlauts(text) {
  // First, protect content inside fenced code blocks (```...```)
  // and inline backtick spans (`...`).
  // We do this by splitting the text into segments: code vs. prose.

  const segments = [];
  let remaining = text;
  let inFencedBlock = false;

  // Process line by line for fenced code blocks, then handle inline backticks
  const lines = text.split('\n');
  const processedLines = [];

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFencedBlock = !inFencedBlock;
      processedLines.push(line); // Don't modify fence markers
      continue;
    }

    if (inFencedBlock) {
      processedLines.push(line); // Don't modify code block content
      continue;
    }

    // Don't modify lines that are video/file references (YAML-like metadata)
    if (/^video:\s*"/.test(line)) {
      processedLines.push(line);
      continue;
    }

    // For prose lines, protect inline backtick spans
    processedLines.push(processLineWithBackticks(line));
  }

  return processedLines.join('\n');
}

/**
 * Process a single line, preserving content inside backtick spans.
 */
function processLineWithBackticks(line) {
  // Split by backtick spans. Regex matches `...` (non-greedy).
  // We alternate between prose (replace) and code (preserve).
  const parts = line.split(/(`[^`]*`)/);
  return parts.map((part, i) => {
    // Odd indices are the backtick-wrapped parts (including the backticks)
    if (part.startsWith('`') && part.endsWith('`')) {
      return part; // Preserve code spans
    }
    // Replace umlauts in prose
    return part.replace(/[A-Za-zäöüÄÖÜß][A-Za-z0-9äöüÄÖÜß]*/g, (match) => {
      return replaceUmlautsInWord(match);
    });
  }).join('');
}

// ─── MAIN ─────────────────────────────────────────────────────────────

function main() {
  const allFiles = fs.readdirSync(AUFGABEN_DIR);
  const mdFiles = allFiles.filter(f =>
    f.endsWith('.md') &&
    !f.endsWith('.bak') &&
    !f.endsWith('.bak.md') &&
    !EXCLUDE_FILES.has(f)
  ).sort();

  console.log(`Found ${mdFiles.length} .md files to process.\n`);

  let totalReplacements = 0;
  let filesModified = 0;

  for (const file of mdFiles) {
    const filePath = path.join(AUFGABEN_DIR, file);
    const original = fs.readFileSync(filePath, 'utf8');
    const fixed = fixUmlauts(original);

    if (fixed !== original) {
      // Count replacements: each ae→ä / oe→ö / ue→ü saves exactly 1 character
      const count = original.length - fixed.length;

      fs.writeFileSync(filePath, fixed, 'utf8');
      totalReplacements += count;
      filesModified++;

      // Show sample replacements (unique, up to 10)
      const seen = new Set();
      const samples = [];
      const origWords = original.match(/[A-Za-zäöüÄÖÜß][A-Za-z0-9äöüÄÖÜß]*/g) || [];
      for (const w of origWords) {
        if (samples.length >= 10) break;
        const replaced = replaceUmlautsInWord(w);
        if (replaced !== w) {
          const key = `${w}→${replaced}`;
          if (!seen.has(key)) {
            seen.add(key);
            samples.push(key);
          }
        }
      }
      console.log(`  ${file}: ${count} replacements`);
      if (samples.length > 0) {
        console.log(`    Samples: ${samples.join(', ')}`);
      }
    } else {
      console.log(`  ${file}: 0 replacements (no changes)`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Summary:`);
  console.log(`  Files processed: ${mdFiles.length}`);
  console.log(`  Files modified:  ${filesModified}`);
  console.log(`  Total replacements: ${totalReplacements}`);
  console.log(`${'='.repeat(60)}`);
}

main();
