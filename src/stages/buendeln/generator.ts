import type { Aufgabe } from '@/stages/types';
import { randInt, aufgabeId } from '@/lib/helpers';

export interface BuendelnAufgabe extends Aufgabe {
  readonly target: number;
}

export function generateBuendeln(): BuendelnAufgabe {
  const target = randInt(13, 59);
  return { id: aufgabeId('buendeln', target), erzeugtAm: Date.now(), target };
}
