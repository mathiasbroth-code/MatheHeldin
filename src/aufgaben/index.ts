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

/** Schöne Titel für Stage-IDs erzeugen. */
function formatStageTitle(stageId: string): string {
  return stageId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Lädt alle Aufgaben-Dateien, erstellt Bank-Stages und registriert sie.
 * Sollte einmal beim App-Start aufgerufen werden.
 */
export async function loadAllAufgaben(): Promise<number> {
  const { parseAufgabenDatei } = await import('./parser');
  const { aufgabenPool } = await import('./pool');
  const { createBankStage } = await import('./bankStage');
  const { registerStage } = await import('@/stages/registry');

  // Vite glob: loads all chapter MD files as raw strings
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

  // Dynamisch Bank-Stages für alle eindeutigen stageIds registrieren
  const stageIds = aufgabenPool.getStageIds();
  let registered = 0;

  for (const stageId of stageIds) {
    const aufgaben = aufgabenPool.getAll({ stageId });
    if (aufgaben.length === 0) continue;

    const sample = aufgaben[0];
    const stage = createBankStage(
      stageId,
      formatStageTitle(stageId),
      sample.thema,
      '📝',
      sample.kapitel,
    );

    registerStage(stage as unknown as import('@/stages/types').Stage);
    registered++;
  }

  if (import.meta.env.DEV) {
    console.log(`[Aufgaben] Total: ${total} Aufgaben, ${registered} Bank-Stages registriert`);
  }

  return total;
}
