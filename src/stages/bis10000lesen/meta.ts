import type { Stage } from '@/stages/types';
import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { generateBis10000Lesen } from './generator';
import { ZahlLesenView } from '@/stages/shared/ZahlLesenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis10000LesenStage: Stage<LesenAufgabe> = {
  id: 'bis10000lesen',
  titel: 'Zahlen bis 10.000 lesen',
  sub: 'Mit Tausendern',
  icon: stufenIcons.bis10000lesen,
  farbe: 'sky',
  zielRichtige: 5,
  generator: generateBis10000Lesen,
  validator: (_aufgabe, antwort) => {
    const n = parseInt(antwort.replace(/\./g, ''), 10);
    return !isNaN(n) && n === _aufgabe.target;
  },
  View: ZahlLesenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, Tausender-Würfel, Hunderter-Platten, Zehner-Balken und Einer als vierstellige Zahl zu lesen.',
    soGehts: 'Zähle von groß nach klein: erst Tausender, dann Hunderter, Zehner, Einer.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      'Fang bei den großen Würfeln an — jeder Würfel ist ein Tausender.',
      `Zähle jede Gruppe einzeln: Tausender, Hunderter, Zehner, Einer.`,
      `${d.T} Tausender + ${d.H} Hunderter + ${d.Z} Zehner + ${d.E} Einer = ${fmt(aufgabe.target)}.`,
    ];
  },
};
