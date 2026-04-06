import type { ComponentType } from 'react';

/** Basis-Interface für alle Aufgaben. Jede Stufe erweitert dieses Interface. */
export interface Aufgabe {
  readonly id: string;
  readonly erzeugtAm: number;
}

/** Props, die jede Stufen-View-Komponente erhält. */
export interface StageProps<T extends Aufgabe> {
  aufgabe: T;
  onAntwort: (antwort: string, richtig: boolean, dauerMs: number) => void;
  onNaechste: () => void;
  fortschritt: { richtig: number; versuche: number };
}

/** Farben, die für Stufen-Karten verwendet werden. */
export type StageFarbe = 'sky' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'purple';

/** Erklärung einer Stufe ("Was lernst du hier?"). */
export interface StageErklaerung {
  wasLernstDu: string;
  soGehts: string;
}

/** Definition der Schwierigkeitsstufen einer Stage (optional). */
export interface SchwierigkeitsDef {
  /** Anzahl der Schwierigkeitsstufen (z.B. 5 → Level 0–4) */
  readonly stufen: number;
  /** Labels nur für Eltern-Dashboard, nicht sichtbar fürs Kind */
  readonly labels: readonly string[];
}

/** Vollständige Definition einer Übungsstufe. */
export interface Stage<T extends Aufgabe = Aufgabe> {
  id: string;
  titel: string;
  sub: string;
  icon: string;
  farbe: StageFarbe;
  zielRichtige: number;
  generator: (schwierigkeit?: number) => T;
  validator: (aufgabe: T, antwort: string) => boolean;
  View: ComponentType<StageProps<T>>;
  /** Optional: "Was lernst du hier?" + "So geht's" */
  erklaerung?: StageErklaerung;
  /** Optional: 3-stufige Tipps [Denkanstoß, Methode, Schritt-für-Schritt] */
  tipps?: (aufgabe: T) => [string, string, string];
  /** Optional: Schwierigkeitsstufen — ohne = keine Adaptivität */
  schwierigkeit?: SchwierigkeitsDef;
}
