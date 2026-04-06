import type { Stage } from '@/stages/types';
import type { LegenAufgabe } from '@/stages/shared/ZahlLegenView';
import { generateBis100Legen } from './generator';
import { ZahlLegenView } from '@/stages/shared/ZahlLegenView';
import { fmt, digits } from '@/lib/helpers';
import { stufenIcons } from '@/assets/stufen-icons';

export const bis100LegenStage: Stage<LegenAufgabe> = {
  id: 'bis100legen',
  titel: 'Zahlen bis 100 legen',
  sub: 'Baue die Zahl',
  icon: stufenIcons.bis100legen,
  farbe: 'amber',
  zielRichtige: 5,
  generator: generateBis100Legen,
  validator: (aufgabe, antwort) => parseInt(antwort.replace(/\./g, ''), 10) === aufgabe.target,
  View: ZahlLegenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, eine zweistellige Zahl mit Zehner-Balken und Einer-Würfeln zu bauen.',
    soGehts: 'Schau dir die Zahl an. Wie viele Zehner brauchst du? Wie viele Einer? Tippe auf + um Blöcke hinzuzufügen.',
  },
  tipps: (aufgabe) => {
    const d = digits(aufgabe.target);
    return [
      `Welche Ziffer steht vorne? Das sind die Zehner.`,
      `${fmt(aufgabe.target)} besteht aus Zehnern und Einern. Schau auf die Ziffern.`,
      `${fmt(aufgabe.target)} = ${d.Z} Zehner + ${d.E} Einer. Tippe ${d.Z}× bei Zehner und ${d.E}× bei Einer.`,
    ];
  },
};
