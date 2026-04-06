import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis10000Lesen(): LesenAufgabe {
  const target = randInt(1001, 9999);
  return {
    id: aufgabeId('bis10000lesen', target),
    erzeugtAm: Date.now(),
    target,
  };
}
