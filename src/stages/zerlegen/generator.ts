import type { Aufgabe } from '@/stages/types';
import { randInt, aufgabeId } from '@/lib/helpers';

export interface ZerlegenAufgabe extends Aufgabe {
  readonly target: number;
}

export function generateZerlegen(): ZerlegenAufgabe {
  const target = randInt(1011, 9999);
  return { id: aufgabeId('zerlegen', target), erzeugtAm: Date.now(), target };
}
