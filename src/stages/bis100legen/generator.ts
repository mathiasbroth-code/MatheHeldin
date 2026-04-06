import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { randInt, aufgabeId } from '@/lib/helpers';

export function generateBis100Legen(): LegenAufgabe {
  const target = randInt(11, 99);
  return { id: aufgabeId('bis100legen', target), erzeugtAm: Date.now(), target };
}
