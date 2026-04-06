import type { Stage } from '@/stages/types';
import type { ZerlegenAufgabe } from './generator';
import { generateZerlegen } from './generator';
import { ZerlegenView } from './ZerlegenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const zerlegenStage: Stage<ZerlegenAufgabe> = {
  id: 'zerlegen',
  titel: 'Zahlen zerlegen',
  sub: 'T, H, Z, E getrennt',
  icon: stufenIcons.zerlegen,
  farbe: 'rose',
  zielRichtige: 5,
  generator: generateZerlegen,
  validator: (aufgabe, antwort) => {
    const parts = antwort.split(',');
    const d = digits(aufgabe.target);
    return (
      Number(parts[0] || 0) === d.T &&
      Number(parts[1] || 0) === d.H &&
      Number(parts[2] || 0) === d.Z &&
      Number(parts[3] || 0) === d.E
    );
  },
  View: ZerlegenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, eine vierstellige Zahl in ihre Stellenwerte zu zerlegen: Tausender, Hunderter, Zehner, Einer.',
    soGehts: 'Lies die Zahl von links nach rechts. Jede Ziffer gehört zu einem Stellenwert: T, H, Z, E.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      `Schau dir die Zahl ${fmt(aufgabe.target)} genau an. Wie viele Ziffern hat sie?`,
      `Lies jede Ziffer einzeln: Die erste Ziffer sind die Tausender, die zweite die Hunderter, und so weiter.`,
      `${fmt(aufgabe.target)}: T = ${d.T}, H = ${d.H}, Z = ${d.Z}, E = ${d.E}.`,
    ];
  },
};
