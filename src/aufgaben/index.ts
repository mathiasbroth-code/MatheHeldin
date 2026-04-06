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
 * Nutzt das Fredo-Buchkapitel-Mapping für Titel und Sortierung.
 */
export async function loadAllAufgaben(): Promise<number> {
  const { parseAufgabenDatei } = await import('./parser');
  const { aufgabenPool } = await import('./pool');
  const { createBankStage } = await import('./bankStage');
  const { STAGE_MAPPING, getKategorieMeta } = await import('./stageMapping');
  const { registerStage } = await import('@/stages/registry');

  const modules = import.meta.glob('/docs/aufgaben/[0-9]*.md', {
    query: '?raw',
    import: 'default',
  });

  let total = 0;

  for (const [path, loader] of Object.entries(modules)) {
    const content = (await loader()) as string;
    const aufgaben = parseAufgabenDatei(content);
    aufgabenPool.load(aufgaben);
    total += aufgaben.length;

    if (import.meta.env.DEV) {
      const filename = path.split('/').pop();
      console.log(`[Aufgaben] ${filename}: ${aufgaben.length} geladen`);
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
    console.log(`[Aufgaben] Total: ${total} Aufgaben, ${registered} Bank-Stages registriert`);
  }

  return total;
}
