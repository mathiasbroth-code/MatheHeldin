import type { Stage } from '@/stages/types';
import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { generateBis100Lesen } from './generator';
import { ZahlLesenView } from '@/stages/shared/ZahlLesenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis100LesenStage: Stage<LesenAufgabe> = {
  id: 'bis100lesen',
  titel: 'Zahlen bis 100 lesen',
  sub: 'Welche Zahl ist das?',
  icon: stufenIcons.bis100lesen,
  farbe: 'sky',
  zielRichtige: 5,
  generator: generateBis100Lesen,
  validator: (_aufgabe, antwort) => {
    const n = parseInt(antwort.replace(/\./g, ''), 10);
    return !isNaN(n) && n === _aufgabe.target;
  },
  View: ZahlLesenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, Zehner-Balken und Einer-Würfel als zweistellige Zahl zu lesen.',
    soGehts: 'Zähle zuerst die Zehner-Balken, dann die Einer-Würfel. Setze beides zusammen.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      'Schau dir zuerst die langen Balken an — jeder ist ein Zehner.',
      `Zähle die Zehner und die Einer getrennt. Dann setze sie zusammen: Z Zehner + E Einer.`,
      `${d.Z} Zehner + ${d.E} Einer = ${fmt(aufgabe.target)}.`,
    ];
  },
};
