import type { Stage } from '@/stages/types';
import type { MitteAufgabe } from './generator';
import { generateMitte } from './generator';
import { MitteView } from './MitteView';
import { fmt } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const mitteStage: Stage<MitteAufgabe> = {
  id: 'mitte',
  titel: 'Zahl in der Mitte',
  sub: 'Zwischen zwei Zahlen',
  icon: stufenIcons.mitte,
  farbe: 'indigo',
  zielRichtige: 5,
  generator: generateMitte,
  validator: (aufgabe, antwort) => {
    const n = parseInt(antwort.replace(/\./g, ''), 10);
    return !isNaN(n) && n === aufgabe.middle;
  },
  View: MitteView,
  schwierigkeit: {
    stufen: 5,
    labels: ['bis 100', 'bis 1.000 (glatt)', 'bis 1.000 (krumm)', 'bis 10.000', 'bis 100.000'],
  },
  erklaerung: {
    wasLernstDu: 'Du lernst, die Zahl genau zwischen zwei Zahlen zu finden — den Mittelwert auf dem Zahlenstrahl.',
    soGehts: 'Rechne den Abstand zwischen den beiden Zahlen aus, teile ihn durch 2, und zähle das Ergebnis zur kleineren Zahl dazu.',
  },
  tipps: (aufgabe) => {
    const gap = aufgabe.high - aufgabe.low;
    const half = gap / 2;
    return [
      `Überlege: Wie groß ist der Abstand zwischen ${fmt(aufgabe.low)} und ${fmt(aufgabe.high)}?`,
      `Der Abstand ist ${fmt(gap)}. Teile ihn durch 2: ${fmt(gap)} ÷ 2 = ${fmt(half)}.`,
      `${fmt(aufgabe.high)} − ${fmt(aufgabe.low)} = ${fmt(gap)}. ${fmt(gap)} ÷ 2 = ${fmt(half)}. ${fmt(aufgabe.low)} + ${fmt(half)} = ${fmt(aufgabe.middle)}.`,
    ];
  },
};
