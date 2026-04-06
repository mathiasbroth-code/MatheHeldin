import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis1000Lesen(): LesenAufgabe {
  const target = randInt(101, 999);
  return {
    id: aufgabeId('bis1000lesen', target),
    erzeugtAm: Date.now(),
    target,
  };
}
