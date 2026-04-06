import type { BankAufgabe, InteraktionsTyp, Schwierigkeit, DigitalGrad } from './types';

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
  const loesung = extractSection(afterYaml, 'Lösung');
  const loesungsweg = extractSection(afterYaml, 'Lösungsweg');
  const tipp1 = extractSection(afterYaml, 'Tipp 1');
  const tipp2 = extractSection(afterYaml, 'Tipp 2');
  const tipp3 = extractSection(afterYaml, 'Tipp 3');
  const didaktischerHinweis = extractSection(afterYaml, 'Didaktischer Hinweis');

  if (!meta.titel || !meta.typ || !aufgabenstellung) return null;

  return {
    titel: meta.titel,
    typ: meta.typ as InteraktionsTyp,
    thema: meta.thema || '',
    schwierigkeit: (meta.schwierigkeit || 'grün') as Schwierigkeit,
    buchseite: parseInt(meta.buchseite || '0', 10),
    kapitel: meta.kapitel || '',
    stageId: meta.stage_id || '',
    digital: (meta.digital || 'voll') as DigitalGrad,
    aufgabenstellung,
    loesung: loesung || '',
    loesungsweg: loesungsweg || '',
    tipps: [
      tipp1 || 'Lies die Aufgabe nochmal genau durch.',
      tipp2 || 'Überlege Schritt für Schritt.',
      tipp3 || 'Schau dir die Lösung an und versuche den Rechenweg nachzuvollziehen.',
    ],
    didaktischerHinweis: didaktischerHinweis || undefined,
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
 * Returns the content between `### {name}` and the next `###` or end.
 */
function extractSection(markdown: string, name: string): string | null {
  // Match heading with optional content in parentheses, e.g. "### Tipp 1 (Denkanstoß)"
  const pattern = new RegExp(`^### ${escapeRegex(name)}[^\\n]*\\n([\\s\\S]*?)(?=^### |$)`, 'm');
  const match = markdown.match(pattern);
  if (!match) return null;

  const content = match[1].trim();
  return content || null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
