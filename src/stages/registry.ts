import type { Stage } from './types';
import { mengen20Stage } from './mengen20';
import { buendelnStage } from './buendeln';
import { bis100LesenStage } from './bis100lesen';
import { bis100LegenStage } from './bis100legen';
import { bis1000LesenStage } from './bis1000lesen';
import { bis1000LegenStage } from './bis1000legen';
import { bis10000LesenStage } from './bis10000lesen';
import { bis10000LegenStage } from './bis10000legen';
import { zerlegenStage } from './zerlegen';
import { mitteStage } from './mitte';
import { skizzeStage } from './skizze';

/**
 * Zentrale Registry aller aktiven Stufen.
 * Sortiert nach didaktischer Reihenfolge (einfach → schwer).
 * Cast nötig wegen TypeScript-Varianz (Stage<T> ist invariant auf T).
 */
export const STAGES: Stage[] = [
  mengen20Stage as unknown as Stage,
  buendelnStage as unknown as Stage,
  bis100LesenStage as unknown as Stage,
  bis100LegenStage as unknown as Stage,
  bis1000LesenStage as unknown as Stage,
  bis1000LegenStage as unknown as Stage,
  bis10000LesenStage as unknown as Stage,
  bis10000LegenStage as unknown as Stage,
  zerlegenStage as unknown as Stage,
  mitteStage as unknown as Stage,
  skizzeStage as unknown as Stage,
];

/** Dynamisch Bank-Stages hinzufügen (nach Pool-Laden aufrufen). */
export function registerStage(stage: Stage): void {
  if (!STAGES.find((s) => s.id === stage.id)) {
    STAGES.push(stage);
  }
}

export function findStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
