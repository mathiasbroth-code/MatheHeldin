import type { BankAufgabe, InteraktionsTyp, Schwierigkeit, DigitalGrad, MerkkastenDaten, MerkkastenBegriff } from './types';
import { parseDaten } from './parserTyped';

/**
 * Parst eine Aufgaben-Markdown-Datei (z.B. 01-wiederholung.md)
 * und extrahiert alle Aufgaben mit YAML-Frontmatter + Markdown-Sections.
 */
export function parseAufgabenDatei(markdown: string): BankAufgabe[] {
  const aufgaben: BankAufgabe[] = [];

  // Split on "## Aufgabe N" boundaries
  const blocks = markdown.split(/^## Aufgabe \d+/m);

  // First block is the chapter header — skip it
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    const parsed = parseAufgabenBlock(block);
    if (parsed) aufgaben.push(parsed);
  }

  return aufgaben;
}

function parseAufgabenBlock(block: string): BankAufgabe | null {
  // Extract YAML frontmatter between --- markers
  const yamlMatch = block.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return null;

  const yamlStr = yamlMatch[1];
  const meta = parseSimpleYaml(yamlStr);

  // Extract Markdown sections
  const afterYaml = block.slice(yamlMatch[0].length);
  const aufgabenstellung = extractSection(afterYaml, 'Aufgabenstellung');
  const loesung = extractSection(afterYaml, 'Lösung') ?? extractSection(afterYaml, 'Loesung');
  const loesungsweg = extractSection(afterYaml, 'Lösungsweg') ?? extractSection(afterYaml, 'Loesungsweg');
  const tipp1 = extractSection(afterYaml, 'Tipp 1');
  const tipp2 = extractSection(afterYaml, 'Tipp 2');
  const tipp3 = extractSection(afterYaml, 'Tipp 3');
  const didaktischerHinweis = extractSection(afterYaml, 'Didaktischer Hinweis');

  if (!meta.titel || !meta.typ || !aufgabenstellung) return null;

  const typ = meta.typ as InteraktionsTyp;
  const loesungStr = loesung || '';
  const parsed = parseDaten(typ, aufgabenstellung, loesungStr);

  // Optionale Bild-Felder aus YAML
  const erklaerungBild = meta.erklaerung_bild || undefined;
  const themenIntroBild = meta.themen_intro_bild || undefined;
  const tippBilder: [string?, string?, string?, string?] = [
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
    schwierigkeit: (meta.schwierigkeit || 'grün') as Schwierigkeit,
    buchseite: parseInt(meta.buchseite || '0', 10),
    kapitel: meta.kapitel || '',
    stageId: meta.stage_id || '',
    digital: (meta.digital || 'voll') as DigitalGrad,
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
    ...parseMerkkasten(meta),
    parsed,
  } as BankAufgabe;
}

/**
 * Simple YAML parser for flat key: value pairs.
 * Handles: key: "quoted value", key: unquoted value, key: number
 */
function parseSimpleYaml(yaml: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Extracts a Markdown section by heading.
 * Returns the content between `### {name}` and the next `###` or end of string.
 *
 * NOTE: We intentionally avoid using a single regex with the `m` flag and `$`,
 * because in multiline mode `$` matches at the end of every line — causing
 * a lazy `[\s\S]*?` to stop after the first line instead of capturing the
 * full section content.
 */
function extractSection(markdown: string, name: string): string | null {
  // Step 1: Find the heading line
  const headingPattern = new RegExp(`^### ${escapeRegex(name)}[^\\n]*\\n`, 'm');
  const headingMatch = markdown.match(headingPattern);
  if (!headingMatch || headingMatch.index === undefined) return null;

  // Step 2: Slice everything after the heading
  const startIdx = headingMatch.index + headingMatch[0].length;
  const rest = markdown.slice(startIdx);

  // Step 3: Find the next ### heading or --- separator (at start of line) or take the rest
  const nextSectionIdx = rest.search(/^(### |---$)/m);
  const content = nextSectionIdx === -1 ? rest.trim() : rest.slice(0, nextSectionIdx).trim();

  return content || null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parst merkkasten_typ + merkkasten_begriffe/merkkasten_text aus YAML-Metadaten.
 * Format:
 *   merkkasten_typ: begriffe
 *   merkkasten_begriffe: "der Tausender (T), der Hunderter (H), der Zehner (Z), der Einer (E)"
 * oder:
 *   merkkasten_typ: regel
 *   merkkasten_text: "1 Tonne = 1.000 Kilogramm"
 */
function parseMerkkasten(meta: Record<string, string>): { merkkasten?: MerkkastenDaten } {
  const typ = meta.merkkasten_typ;
  if (!typ) return {};

  if (typ === 'begriffe' && meta.merkkasten_begriffe) {
    const begriffe: MerkkastenBegriff[] = meta.merkkasten_begriffe
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((entry) => {
        const abbrMatch = entry.match(/\(([^)]+)\)$/);
        const term = abbrMatch ? entry.slice(0, abbrMatch.index).trim() : entry;
        return { term, ...(abbrMatch ? { abbrev: abbrMatch[1] } : {}) };
      });

    return { merkkasten: { typ: 'begriffe', begriffe } };
  }

  if (typ === 'regel' && meta.merkkasten_text) {
    return { merkkasten: { typ: 'regel', text: meta.merkkasten_text.replace(/\\n/g, '\n') } };
  }

  return {};
}
