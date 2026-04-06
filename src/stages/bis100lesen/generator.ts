import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis100Lesen(): LesenAufgabe {
  const target = randInt(11, 99);
  return {
    id: aufgabeId('bis100lesen', target),
    erzeugtAm: Date.now(),
    target,
  };
}
