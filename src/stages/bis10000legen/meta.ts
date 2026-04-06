import type { Stage } from '@/stages/types';
import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { generateBis10000Legen } from './generator';
import { ZahlLegenView } from '@/stages/shared/ZahlLegenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis10000LegenStage: Stage<LegenAufgabe> = {
  id: 'bis10000legen',
  titel: 'Zahlen bis 10.000 legen',
  sub: 'Mit Tausendern',
  icon: stufenIcons.bis10000legen,
  farbe: 'amber',
  zielRichtige: 5,
  generator: generateBis10000Legen,
  validator: (aufgabe, antwort) => parseInt(antwort.replace(/\./g, ''), 10) === aufgabe.target,
  View: ZahlLegenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, eine vierstellige Zahl mit Tausender-Würfeln, Hunderter-Platten, Zehner-Balken und Einer-Würfeln zu bauen.',
    soGehts: 'Lies die Zahl von links nach rechts: Tausender, Hunderter, Zehner, Einer. Tippe bei jeder Gruppe auf + bis es stimmt.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      `Welche Ziffer steht ganz vorne? Das sind die Tausender.`,
      `Zerlege ${fmt(aufgabe.target)}: Tausender, Hunderter, Zehner, Einer — lies die Ziffern einzeln ab.`,
      `${fmt(aufgabe.target)} = ${d.T} Tausender + ${d.H} Hunderter + ${d.Z} Zehner + ${d.E} Einer.`,
    ];
  },
};
