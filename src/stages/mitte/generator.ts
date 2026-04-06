import type { Aufgabe } from '@/stages/types';
import { randInt, aufgabeId } from '@/lib/helpers';

export interface MitteAufgabe extends Aufgabe {
  readonly low: number;
  readonly high: number;
  readonly middle: number;
  readonly schwierigkeit: number;
}

type Pattern = () => { low: number; high: number };

/**
 * 5 Schwierigkeitsstufen, je 2 Patterns pro Level.
 * Level 0: bis 100, runde 10er
 * Level 1: bis 1.000, Abstand 100
 * Level 2: bis 1.000, Abstand 50/200
 * Level 3: bis 10.000, Abstand 1.000/2.000
 * Level 4: bis 100.000, unregelmäßig
 */
const patternsByLevel: Pattern[][] = [
  // Level 0: Zahlenraum bis 100, glatte 10er-Abstände
  [
    () => {
      const base = randInt(1, 7) * 10;
      return { low: base, high: base + 20 };
    },
    () => {
      const base = randInt(1, 6) * 10;
      return { low: base, high: base + 40 };
    },
  ],
  // Level 1: bis 1.000, Abstand 100
  [
    () => {
      const base = randInt(1, 8) * 100;
      return { low: base, high: base + 100 };
    },
    () => {
      const base = randInt(1, 7) * 100;
      return { low: base, high: base + 200 };
    },
  ],
  // Level 2: bis 1.000, Abstand 50–200 (schwieriger: keine glatten 100er)
  [
    () => {
      const base = randInt(2, 18) * 50;
      return { low: base, high: base + 100 };
    },
    () => {
      const base = randInt(20, 97) * 100;
      return { low: base, high: base + 200 };
    },
  ],
  // Level 3: bis 10.000, Abstand 1.000–2.000
  [
    () => {
      const base = randInt(2, 8) * 1000 + randInt(0, 9) * 100;
      return { low: base, high: base + 1000 };
    },
    () => {
      const base = randInt(2, 7) * 1000;
      return { low: base, high: base + 2000 };
    },
  ],
  // Level 4: bis 100.000, unregelmäßige Abstände
  [
    () => {
      const t = randInt(10, 95) * 1000;
      return { low: t, high: t + 1000 };
    },
    () => {
      const base = randInt(100, 997) * 100;
      return { low: base, high: base + 200 };
    },
  ],
];

export function generateMitte(schwierigkeit?: number): MitteAufgabe {
  const level = schwierigkeit ?? randInt(0, patternsByLevel.length - 1);
  const clampedLevel = Math.max(0, Math.min(level, patternsByLevel.length - 1));
  const patterns = patternsByLevel[clampedLevel];
  const pattern = patterns[randInt(0, patterns.length - 1)];
  const { low, high } = pattern();
  const middle = (low + high) / 2;

  return {
    id: aufgabeId('mitte', low, high),
    erzeugtAm: Date.now(),
    low,
    high,
    middle,
    schwierigkeit: clampedLevel,
  };
}
