import type { Stage } from '@/stages/types';
import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { generateBis1000Lesen } from './generator';
import { ZahlLesenView } from '@/stages/shared/ZahlLesenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis1000LesenStage: Stage<LesenAufgabe> = {
  id: 'bis1000lesen',
  titel: 'Zahlen bis 1.000 lesen',
  sub: 'Mit Hundertern',
  icon: stufenIcons.bis1000lesen,
  farbe: 'sky',
  zielRichtige: 5,
  generator: generateBis1000Lesen,
  validator: (_aufgabe, antwort) => {
    const n = parseInt(antwort.replace(/\./g, ''), 10);
    return !isNaN(n) && n === _aufgabe.target;
  },
  View: ZahlLesenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, Hunderter-Platten, Zehner-Balken und Einer-Würfel als dreistellige Zahl zu lesen.',
    soGehts: 'Zähle zuerst die Hunderter-Platten, dann die Zehner-Balken, dann die Einer. Setze alles zusammen.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      'Fang bei den großen Platten an — jede Platte ist ein Hunderter.',
      `Zähle jede Gruppe einzeln: Hunderter, Zehner, Einer.`,
      `${d.H} Hunderter + ${d.Z} Zehner + ${d.E} Einer = ${fmt(aufgabe.target)}.`,
    ];
  },
};
