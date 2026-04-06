import type { Stage } from '@/stages/types';
import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { generateBis1000Legen } from './generator';
import { ZahlLegenView } from '@/stages/shared/ZahlLegenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis1000LegenStage: Stage<LegenAufgabe> = {
  id: 'bis1000legen',
  titel: 'Zahlen bis 1.000 legen',
  sub: 'Mit Hundertern',
  icon: stufenIcons.bis1000legen,
  farbe: 'amber',
  zielRichtige: 5,
  generator: generateBis1000Legen,
  validator: (aufgabe, antwort) => parseInt(antwort.replace(/\./g, ''), 10) === aufgabe.target,
  View: ZahlLegenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, eine dreistellige Zahl mit Hunderter-Platten, Zehner-Balken und Einer-Würfeln zu bauen.',
    soGehts: 'Lies die Zahl Ziffer für Ziffer: Hunderter, Zehner, Einer. Tippe bei jeder Gruppe auf + bis die richtige Anzahl da ist.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      `Welche Ziffer steht ganz vorne? Das sind die Hunderter.`,
      `Zerlege ${fmt(aufgabe.target)} in Hunderter, Zehner und Einer.`,
      `${fmt(aufgabe.target)} = ${d.H} Hunderter + ${d.Z} Zehner + ${d.E} Einer.`,
    ];
  },
};
