export type {
  BankAufgabe,
  BankAufgabeBase,
  EingabeAufgabe,
  AuswahlAufgabe,
  ZuordnungAufgabe,
  LueckeAufgabe,
  ReihenfolgeAufgabe,
  SchrittAufgabe,
  WahrFalschAufgabe,
  TextaufgabeAufgabe,
  AufgabenFilter,
  Schwierigkeit,
  InteraktionsTyp,
} from './types';

export { parseAufgabenDatei } from './parser';
export { aufgabenPool } from './pool';
export { createBankStage } from './bankStage';
export { STAGE_MAPPING, KATEGORIEN, getStageMeta, getKategorieMeta } from './stageMapping';
export type { Kategorie, KategorieMeta, StageMappingEntry } from './stageMapping';

/**
 * Lädt alle Aufgaben-Dateien, erstellt Bank-Stages und registriert sie.
 *
 * Priorität:
 * 1. Pre-built JSON aus src/aufgaben/data/ (erzeugt von scripts/build-aufgaben.cjs)
 * 2. Fallback: Runtime-Parsing der MD-Dateien (für den Fall dass JSON nicht vorhanden)
 */
export async function loadAllAufgaben(): Promise<number> {
  const { aufgabenPool } = await import('./pool');
  const { createBankStage } = await import('./bankStage');
  const { STAGE_MAPPING, getKategorieMeta } = await import('./stageMapping');
  const { registerStage } = await import('@/stages/registry');

  let total = 0;

  // Versuch 1: Pre-built JSON laden
  const jsonModules = import.meta.glob('./data/*.json', {
    eager: true,
  });

  const hasJson = Object.keys(jsonModules).length > 0;

  if (hasJson) {
    // JSON-Dateien direkt laden — kein Parsing nötig
    for (const [path, mod] of Object.entries(jsonModules)) {
      const aufgaben = (mod as { default: unknown }).default as import('./types').BankAufgabe[] ??
        mod as import('./types').BankAufgabe[];
      if (!Array.isArray(aufgaben)) continue;
      aufgabenPool.load(aufgaben);
      total += aufgaben.length;

      if (import.meta.env.DEV) {
        const filename = path.split('/').pop();
        console.log(`[Aufgaben/JSON] ${filename}: ${aufgaben.length} geladen`);
      }
    }
  } else {
    // Fallback: Runtime-Parsing der MD-Dateien
    if (import.meta.env.DEV) {
      console.warn('[Aufgaben] Keine JSON-Dateien gefunden — Fallback auf Runtime-Parsing');
    }

    const { parseAufgabenDatei } = await import('./parser');
    const modules = import.meta.glob('/docs/aufgaben/{[0-9]*,intensiv-*}.md', {
      query: '?raw',
      import: 'default',
    });

    for (const [path, loader] of Object.entries(modules)) {
      const content = (await loader()) as string;
      const aufgaben = parseAufgabenDatei(content);
      aufgabenPool.load(aufgaben);
      total += aufgaben.length;

      if (import.meta.env.DEV) {
        const filename = path.split('/').pop();
        console.log(`[Aufgaben/MD] ${filename}: ${aufgaben.length} geladen`);
      }
    }
  }

  // Registriere Bank-Stages in der Reihenfolge des Fredo-Mappings
  let registered = 0;

  for (const mapping of STAGE_MAPPING) {
    const count = aufgabenPool.getCount({ stageId: mapping.stageId });
    if (count === 0) continue;

    const katMeta = getKategorieMeta(mapping.kategorie);
    const stage = createBankStage(
      mapping.stageId,
      mapping.titel,
      katMeta?.titel || mapping.kategorie,
      mapping.icon,
      mapping.kategorie,
    );

    registerStage(stage as unknown as import('@/stages/types').Stage);
    registered++;
  }

  if (import.meta.env.DEV) {
    const source = hasJson ? 'JSON' : 'MD (Fallback)';
    console.log(`[Aufgaben] Total: ${total} Aufgaben, ${registered} Bank-Stages registriert (Quelle: ${source})`);
  }

  return total;
}
