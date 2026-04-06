import type { Stage } from '@/stages/types';
import type { SkizzeAufgabe } from './generator';
import { generateSkizze } from './generator';
import { SkizzeView } from './SkizzeView';
import { PROBLEMS, loesen } from './problems';
import { stufenIcons } from '@/assets/stufen-icons';

export const skizzeStage: Stage<SkizzeAufgabe> = {
  id: 'skizze',
  titel: 'Sachaufgaben mit Skizze',
  sub: 'Strecken mit km',
  icon: stufenIcons.skizze,
  farbe: 'emerald',
  zielRichtige: 3,
  generator: generateSkizze,
  validator: (aufgabe, antwort) => {
    const problem = PROBLEMS[aufgabe.problemIndex];
    const expected = loesen(problem);
    const n = parseFloat(antwort.replace(',', '.'));
    return !isNaN(n) && Math.abs(n - expected) < 0.05;
  },
  View: SkizzeView,
  erklaerung: {
    wasLernstDu: 'Du lernst, Sachaufgaben mit einer Strecken-Skizze zu lösen — Schritt für Schritt.',
    soGehts: 'Lies die Aufgabe. Ordne die Orte auf einer Linie. Trage die bekannten Strecken ein. Rechne das fehlende Stück aus.',
  },
  tipps: (aufgabe) => {
    const p = PROBLEMS[aufgabe.problemIndex];
    const known = p.strecken.filter((s): s is number => s !== null);
    const knownSum = known.reduce((a, b) => a + b, 0);
    const sol = loesen(p);
    return [
      `Lies die Aufgabe nochmal. Welche Strecken kennst du schon, und welche ist gesucht?`,
      `Die bekannten Strecken sind ${known.map(String).join(' + ')} = ${knownSum} km. Die Gesamtstrecke ist ${p.gesamt} km${p.hinUndZurueck ? ' (hin und zurück)' : ''}.`,
      `${p.hinUndZurueck ? `${p.gesamt} ÷ 2 = ${p.gesamt / 2}. ${p.gesamt / 2} − ${knownSum} = ${sol} km.` : `${p.gesamt} − ${knownSum} = ${sol} km.`}`,
    ];
  },
};
