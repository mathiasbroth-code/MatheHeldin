export interface SkizzeProblem {
  readonly titel: string;
  readonly text: string;
  readonly stationen: string[];
  readonly strecken: (number | null)[];
  readonly gesamt: number;
  readonly hinUndZurueck: boolean;
  readonly frage: string;
}

export const PROBLEMS: SkizzeProblem[] = [
  {
    titel: 'Jette – Radtour zum See',
    text: 'Jette macht mit ihrer Familie eine Radtour. Zuerst radeln sie 3 km zum Spielplatz. Von dort geht es 4 km weiter zur Eisdiele und dann zum See. Sie sind bis dahin insgesamt 15 km geradelt. Wie weit ist der See von der Eisdiele entfernt?',
    stationen: ['Start', 'Spielplatz', 'Eisdiele', 'See'],
    strecken: [3, 4, null],
    gesamt: 15,
    hinUndZurueck: false,
    frage: 'Wie weit ist der See von der Eisdiele entfernt?',
  },
  {
    titel: 'Ali – Ausflug zum Grillplatz',
    text: 'Ali und seine Familie machen einen Ausflug mit dem Rad. Zuerst radeln sie zum See, der 4,3 km entfernt ist. Von dort fahren sie weiter zum Grillplatz im Wäldchen. Nach dem Grillen besuchen sie noch die Eisdiele, die 2,8 km entfernt ist. Danach radeln sie denselben Weg wieder zurück. Insgesamt legen sie 16,6 km zurück. Wie weit ist der Grillplatz vom See entfernt?',
    stationen: ['Start', 'See', 'Grillplatz', 'Eisdiele'],
    strecken: [4.3, null, 2.8],
    gesamt: 16.6,
    hinUndZurueck: true,
    frage: 'Wie weit ist der Grillplatz vom See entfernt?',
  },
  {
    titel: 'Tim, Lena & Olli – zum See',
    text: 'Tim, Lena und Olli wollen zum See fahren. Tim wohnt 10,6 km vom See entfernt. Auf dem Weg zum See kommt er an Lena vorbei, die 2,8 km von ihm entfernt wohnt. Zusammen fahren sie weiter zu Olli. Von dort aus radeln sie gemeinsam die 5,2 km zum See. Wie weit wohnt Olli von Lena entfernt?',
    stationen: ['Tim', 'Lena', 'Olli', 'See'],
    strecken: [2.8, null, 5.2],
    gesamt: 10.6,
    hinUndZurueck: false,
    frage: 'Wie weit wohnt Olli von Lena entfernt?',
  },
];

/** Berechnet die unbekannte Strecke eines Skizze-Problems. */
export function loesen(p: SkizzeProblem): number {
  const bekannt = p.strecken
    .filter((s): s is number => s !== null)
    .reduce((a, b) => a + b, 0);
  const mult = p.hinUndZurueck ? 2 : 1;
  return Math.round((p.gesamt / mult - bekannt) * 100) / 100;
}

/** Fisher-Yates Shuffle. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
