import type { Aufgabe } from '@/stages/types';
import { randInt, aufgabeId } from '@/lib/helpers';

export interface MitteAufgabe extends Aufgabe {
  readonly low: number;
  readonly high: number;
  readonly middle: number;
}

type Pattern = () => { low: number; high: number };

const patterns: Pattern[] = [
  // 3–4-stellig, Abstand 100
  () => {
    const base = randInt(30, 98) * 100;
    return { low: base, high: base + 100 };
  },
  // 3–4-stellig, Abstand 200
  () => {
    const base = randInt(20, 97) * 100;
    return { low: base, high: base + 200 };
  },
  // 4-stellig, Abstand 1.000
  () => {
    const base = randInt(2, 8) * 1000 + randInt(0, 9) * 100;
    return { low: base, high: base + 1000 };
  },
  // 4-stellig, Abstand 2.000
  () => {
    const base = randInt(2, 7) * 1000;
    return { low: base, high: base + 2000 };
  },
  // 5-stellig, Abstand 1.000
  () => {
    const t = randInt(10, 95) * 1000;
    return { low: t, high: t + 1000 };
  },
  // 5-stellig, Abstand 200 (schwerer: gleiche Tausender)
  () => {
    const base = randInt(100, 997) * 100;
    return { low: base, high: base + 200 };
  },
];

export function generateMitte(): MitteAufgabe {
  const pattern = patterns[randInt(0, patterns.length - 1)];
  const { low, high } = pattern();
  const middle = (low + high) / 2;

  return {
    id: aufgabeId('mitte', low, high),
    erzeugtAm: Date.now(),
    low,
    high,
    middle,
  };
}
