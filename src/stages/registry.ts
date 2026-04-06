import type { Stage } from './types';

/**
 * Zentrale Registry aller aktiven Stufen.
 * Neue Stufe hinzufügen: import + push — fertig.
 */
export const STAGES: Stage[] = [
  // Stufen werden hier nach und nach importiert:
  // import { mengenStage } from './mengen';
  // import { mitteStage } from './mitte';
  // etc.
];

export function findStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
