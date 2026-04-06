import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis1000Legen(): LegenAufgabe {
  const target = randInt(101, 999);
  return { id: aufgabeId('bis1000legen', target), erzeugtAm: Date.now(), target };
}
