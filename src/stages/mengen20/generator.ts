import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateMengen20(): LesenAufgabe {
  const target = randInt(3, 20);
  return {
    id: aufgabeId('mengen20', target),
    erzeugtAm: Date.now(),
    target,
  };
}
