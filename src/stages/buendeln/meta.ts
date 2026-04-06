import type { Stage } from '@/stages/types';
import type { BuendelnAufgabe } from './generator';
import { generateBuendeln } from './generator';
import { BuendelnView } from './BuendelnView';
import { digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';
// fmt not needed — buendeln uses only small numbers

export const buendelnStage: Stage<BuendelnAufgabe> = {
  id: 'buendeln',
  titel: 'Zehner bündeln',
  sub: 'Wie viele Zehner und Einer?',
  icon: stufenIcons.buendeln,
  farbe: 'purple',
  zielRichtige: 5,
  generator: generateBuendeln,
  validator: (aufgabe, antwort) => {
    const [zStr, eStr] = antwort.split(',');
    const z = parseInt(zStr, 10);
    const e = parseInt(eStr, 10);
    const d = digits(aufgabe.target);
    return z === d.Z && e === d.E;
  },
  View: BuendelnView,
  erklaerung: {
    wasLernstDu: 'Du lernst, Einer-Würfel zu Zehnern zusammenzufassen — das ist die Grundlage für unser Zahlensystem.',
    soGehts: 'Zähle immer 10 Einer ab und mache daraus einen Zehner. Was übrig bleibt, sind die Einer.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      `Zähle die Würfel. Wie oft passen 10 Stück hinein?`,
      `Bündel immer 10 zu einem Zehner. Zähle die 10er-Gruppen und die übrigen Einer einzeln.`,
      `${aufgabe.target} Würfel: ${d.Z} × 10 = ${d.Z * 10}, Rest ${d.E}. Also ${d.Z} Zehner und ${d.E} Einer.`,
    ];
  },
};
