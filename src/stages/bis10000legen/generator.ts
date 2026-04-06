import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis10000Legen(): LegenAufgabe {
  const target = randInt(1001, 9999);
  return { id: aufgabeId('bis10000legen', target), erzeugtAm: Date.now(), target };
}
