/** Schwierigkeitsgrade nach Fredo-Farbsystem. */
export type Schwierigkeit = 'gelb' | 'grün' | 'orange';

/** Die 8 Interaktionstypen aus FORMAT.md. */
export type InteraktionsTyp =
  | 'eingabe'
  | 'auswahl'
  | 'zuordnung'
  | 'luecke'
  | 'reihenfolge'
  | 'schritt'
  | 'wahr-falsch'
  | 'textaufgabe';

/** Digitalisierungsgrad. */
export type DigitalGrad = 'voll' | 'teilweise' | 'platzhalter';

/** Gemeinsame Basis für alle Aufgaben aus der Aufgabenbank. */
export interface BankAufgabeBase {
  titel: string;
  typ: InteraktionsTyp;
  thema: string;
  schwierigkeit: Schwierigkeit;
  buchseite: number;
  kapitel: string;
  stageId: string;
  digital: DigitalGrad;
  aufgabenstellung: string;
  loesung: string;
  loesungsweg: string;
  tipps: [string, string, string];
  didaktischerHinweis?: string;
}

// ── Per-Type Extensions ──────────────────────────────

/** Zahleneingabe: Kind tippt Zahl(en) ein. */
export interface EingabeAufgabe extends BankAufgabeBase {
  typ: 'eingabe';
}

/** Multiple-Choice: Kind wählt aus Optionen. */
export interface AuswahlAufgabe extends BankAufgabeBase {
  typ: 'auswahl';
}

/** Zuordnung: Elemente einander zuordnen. */
export interface ZuordnungAufgabe extends BankAufgabeBase {
  typ: 'zuordnung';
}

/** Lückentext: Lücken in Gleichung/Term füllen. */
export interface LueckeAufgabe extends BankAufgabeBase {
  typ: 'luecke';
}

/** Sortieren: Elemente in Reihenfolge bringen. */
export interface ReihenfolgeAufgabe extends BankAufgabeBase {
  typ: 'reihenfolge';
}

/** Mehrstufige Rechnung: Schritt für Schritt lösen. */
export interface SchrittAufgabe extends BankAufgabeBase {
  typ: 'schritt';
}

/** Stimmt/Stimmt nicht: Aussage beurteilen. */
export interface WahrFalschAufgabe extends BankAufgabeBase {
  typ: 'wahr-falsch';
}

/** Sachaufgabe: Text lesen, Fragen beantworten. */
export interface TextaufgabeAufgabe extends BankAufgabeBase {
  typ: 'textaufgabe';
}

/** Discriminated Union aller Aufgabentypen. */
export type BankAufgabe =
  | EingabeAufgabe
  | AuswahlAufgabe
  | ZuordnungAufgabe
  | LueckeAufgabe
  | ReihenfolgeAufgabe
  | SchrittAufgabe
  | WahrFalschAufgabe
  | TextaufgabeAufgabe;

/** Filter-Optionen für den Aufgaben-Pool. */
export interface AufgabenFilter {
  stageId?: string;
  schwierigkeit?: Schwierigkeit;
  typ?: InteraktionsTyp;
  kapitel?: string;
  digital?: DigitalGrad;
}
