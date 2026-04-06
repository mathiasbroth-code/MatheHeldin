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

// ── Parsed-Daten: typspezifisch strukturiert ────────────

/** Intro-Text, der vor den eigentlichen Items steht. */
export interface AufgabenKopf {
  /** Anweisungstext (z.B. "Rechne im Kopf." oder "Multipliziere schriftlich.") */
  anweisung: string;
  /** Kontext-Text bei Textaufgaben (Sachtext) */
  kontext?: string;
}

/** Ein einzelnes Teil-Item (a/b/c Teilaufgabe oder Strichlisten-Schritt) */
export interface TeilItem {
  /** Label: "a", "b", "1", "2" etc. */
  label: string;
  /** Frage-/Aufgabentext */
  frage: string;
  /** Erwartete Antwort (normalisiert, zum Vergleich) */
  antwort: string;
}

/** eingabe: Zahleneingabe mit optionalen Teilaufgaben. */
export interface EingabeDaten extends AufgabenKopf {
  typ: 'eingabe';
  items: TeilItem[];
}

/** auswahl: Multiple-Choice. */
export interface AuswahlDaten extends AufgabenKopf {
  typ: 'auswahl';
  frageText: string;
  optionen: { label: string; text: string }[];
  richtigeIdx: number;
}

/** zuordnung: Items den Choices zuordnen. */
export interface ZuordnungDaten extends AufgabenKopf {
  typ: 'zuordnung';
  items: { label: string; text: string }[];
  choices: { label: string; text: string }[];
  /** Map: item.label -> choice.label */
  antworten: Record<string, string>;
}

/** luecke: Gleichung mit Platzhaltern. */
export interface LueckeDaten extends AufgabenKopf {
  typ: 'luecke';
  items: TeilItem[];
}

/** reihenfolge: Elemente sortieren. */
export interface ReihenfolgeDaten extends AufgabenKopf {
  typ: 'reihenfolge';
  teilaufgaben: {
    label: string;
    items: string[];
    richtigeReihenfolge: string[];
  }[];
}

/** schritt: Mehrstufige Rechnung. */
export interface SchrittDaten extends AufgabenKopf {
  typ: 'schritt';
  /** Teilaufgaben (a/b/c), jede mit eigenen Schritten */
  teilaufgaben: {
    label: string;
    schritte: TeilItem[];
  }[];
}

/** wahr-falsch: Aussagen beurteilen. */
export interface WahrFalschDaten extends AufgabenKopf {
  typ: 'wahr-falsch';
  items: {
    label: string;
    aussage: string;
    richtig: boolean;
    erklaerung: string;
  }[];
}

/** textaufgabe: Sachaufgabe mit Kontext und Fragen. */
export interface TextaufgabeDaten extends AufgabenKopf {
  typ: 'textaufgabe';
  items: TeilItem[];
}

/** Union aller typspezifischen Daten. */
export type ParsedAufgabenDaten =
  | EingabeDaten
  | AuswahlDaten
  | ZuordnungDaten
  | LueckeDaten
  | ReihenfolgeDaten
  | SchrittDaten
  | WahrFalschDaten
  | TextaufgabeDaten;

// ── BankAufgabe ─────────────────────────────────────────

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
  tipps: [string, string, string, string];
  tippBilder?: [string?, string?, string?, string?];
  didaktischerHinweis?: string;
  erklaerungBild?: string;
  themenIntroBild?: string;
  /** Typspezifisch strukturierte Daten. Immer gesetzt wenn Parser erfolgreich. */
  parsed: ParsedAufgabenDaten;
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
