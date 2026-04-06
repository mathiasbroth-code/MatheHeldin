import type { Aufgabe } from '@/stages/types';
import { randInt, aufgabeId } from '@/lib/helpers';
import { PROBLEMS } from './problems';

export interface SkizzeAufgabe extends Aufgabe {
  readonly problemIndex: number;
}

export function generateSkizze(): SkizzeAufgabe {
  const problemIndex = randInt(0, PROBLEMS.length - 1);
  return {
    id: aufgabeId('skizze', problemIndex, Date.now()),
    erzeugtAm: Date.now(),
    problemIndex,
  };
}
