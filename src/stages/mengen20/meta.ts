import type { Stage } from '@/stages/types';
import type { LesenAufgabe } from '@/stages/shared/ZahlLesenView';
import { generateMengen20 } from './generator';
import { ZahlLesenView } from '@/stages/shared/ZahlLesenView';
import { stufenIcons } from '@/assets/stufen-icons';

export const mengen20Stage: Stage<LesenAufgabe> = {
  id: 'mengen20',
  titel: 'Mengen bis 20',
  sub: 'Zähle die Blöcke',
  icon: stufenIcons.mengen,
  farbe: 'sky',
  zielRichtige: 5,
  generator: generateMengen20,
  validator: (_aufgabe, antwort) => {
    const n = parseInt(antwort.replace(/\./g, ''), 10);
    return !isNaN(n) && n === _aufgabe.target;
  },
  View: ZahlLesenView,
  erklaerung: {
    wasLernstDu: 'Du lernst, eine Menge von Einer-Würfeln zu zählen und als Zahl aufzuschreiben.',
    soGehts: 'Zähle die Würfel einzeln durch. Fang oben links an und geh Reihe für Reihe vor.',
  },
  tipps: (aufgabe) => {
    const fives = Math.floor(aufgabe.target / 5);
    const rest = aufgabe.target % 5;
    return [
      'Zähle die Würfel langsam und zeige dabei auf jeden einzelnen.',
      `Zähle in Fünfer-Gruppen: ${Array.from({ length: fives }, (_, i) => (i + 1) * 5).join(', ')}${rest > 0 ? ` und dann noch ${rest} dazu` : ''}.`,
      `Es sind genau ${aufgabe.target} Würfel.`,
    ];
  },
};
