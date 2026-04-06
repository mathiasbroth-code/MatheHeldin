# Aufgaben-Rendering-Architektur

Ergebnis der Gremiumssitzung: Sarah Kowalski (Frontend), Tom Berger (UX), Prof. Sommer (Didaktik).

---

## 1. Problemanalyse

### Was genau ist kaputt?

**Kernproblem:** Der Parser (`parser.ts`) liefert flache Strings (`aufgabenstellung: string`, `loesung: string`). Jede View muss diese Strings selbst in strukturierte Daten umwandeln. Das fuehrt zu 6 konkreten Fehlern:

#### 1.1 Duplizierte Parsing-Logik

Jede View hat eine eigene `parseXxx()`-Funktion, die fast identisch ist:
- `parseItems()` in EingabeView
- `parseLuecken()` in LueckeView
- `parseWahrFalsch()` in WahrFalschView
- `parseTextaufgabe()` in TextaufgabeView
- `parseSchritte()` in SchrittView
- `parseReihenfolge()` in ReihenfolgeView
- `parseAuswahl()` in AuswahlView
- `parseZuordnung()` in ZuordnungView

Alle teilen den gleichen `aufgabenstellung.split(/^[a-z]\)\s*/m)` Pattern. Wenn sich das MD-Format aendert, muessen 8 Stellen angepasst werden.

#### 1.2 "Schritt 1 von 1" bei Schritt-Aufgaben

Die `parseSchritte()` Funktion versucht 3 Strategien:
1. Split auf `a)/b)/c)` Pattern
2. Nummerierte Schritte aus der Loesung
3. Chain-Notation (Rechenkette `→`)

Wenn keine greift, Fallback: **ein einziger Schritt mit dem gesamten Aufgabentext**. Das passiert bei Aufgaben wie "47 * 13" mit Strichlisten (`- 40 * 10 = ___`), weil das weder `a)/b)/c)` noch nummerierte Schritte sind.

**Betroffene Aufgaben:** Alle `schritt`-Aufgaben mit Strichlisten-Format (ca. 30+ Aufgaben in 05-multiplikation.md, 08-division.md).

#### 1.3 Aufgabenstellung 2x angezeigt

Das Layout zeigt:
1. **bankStage.tsx, Zeile 146-149:** Card mit `currentAufgabe.thema` + `currentAufgabe.titel`
2. **SchrittView, Zeile 59:** Card mit `aufgabe.aufgabenstellung.split(...)[0].trim()`
3. Manchmal nochmal im aktuellen Schritt

Ursache: Keine klare Regel, *was wo angezeigt wird*. Der bankStage zeigt den Titel, die View zeigt die Aufgabenstellung — aber bei manchen Aufgaben ist der Titel die Aufgabenstellung.

#### 1.4 Nur 1 Eingabefeld statt 5

Bei "47 * 13 = Schreibe die Teilrechnungen auf: - 40 * 10 = ___ ..." erkennt `parseSchritte()` die Strichlisten-Items nicht als einzelne Schritte. Es faellt auf Fallback: 1 Schritt, 1 Feld.

**Soll:** 5 separate Felder (4 Teilrechnungen + Summe).

#### 1.5 Tipp-Button doppelt

- **bankStage.tsx, Zeile 138-140:** TippButton im Header (via Portal)
- **AufgabeWrapper.tsx, Zeile 62-68:** TippSystem unter der View

Beide sind unabhaengig voneinander, beide zeigen Tipps. Das ist ein Layout-Bug, kein Parser-Bug — aber es entsteht, weil keine klare Verantwortung definiert ist.

#### 1.6 Zuordnungs-View faellt oft auf Fallback zurueck

Die `parseZuordnung()` ist der komplexeste Parser (80+ Zeilen) und trotzdem fragil. Bei der Aufgabe "Rechenschritte zuordnen" (05-multiplikation.md, Aufgabe 20) mit nummerierten Items und Buchstaben-Choices funktioniert das Parsing nur, wenn das Format exakt dem erwarteten Pattern entspricht.

### Warum ist das passiert?

Der Parser wurde als "Markdown-to-flat-data" Schritt designed — er extrahiert Sections (Aufgabenstellung, Loesung, Tipps) und gibt Strings zurueck. Das war fuer den ersten Prototyp OK. Aber die Views brauchten *strukturierte* Daten, also wurde das Parsing in die Views verschoben. Jetzt haben wir zwei Parser: einen im Parser, einen in jeder View.

---

## 2. Neues Datenmodell

### 2.1 Grundprinzip

Der Parser liefert pro Aufgabe ein **typspezifisches, strukturiertes Objekt**. Die Views empfangen fertig aufbereitete Daten und muessen **null Parsing** mehr machen.

### 2.2 TypeScript-Interfaces

```typescript
// src/aufgaben/types.ts

// ── Gemeinsame Basis ────────────────────────────────

/** Intro-Text, der vor den eigentlichen Items steht. */
interface AufgabenKopf {
  /** Anweisungstext (z.B. "Rechne im Kopf." oder "Multipliziere schriftlich.") */
  anweisung: string;
  /** Kontext-Text bei Textaufgaben (Sachtext) */
  kontext?: string;
}

/** Ein einzelnes Teil-Item (a/b/c Teilaufgabe oder Strichlisten-Schritt) */
interface TeilItem {
  /** Label: "a", "b", "1", "2" etc. */
  label: string;
  /** Frage-/Aufgabentext */
  frage: string;
  /** Erwartete Antwort (normalisiert, zum Vergleich) */
  antwort: string;
}

// ── Typspezifische Erweiterungen ────────────────────

/** eingabe: Zahleneingabe mit optionalen Teilaufgaben. */
interface EingabeDaten extends AufgabenKopf {
  typ: 'eingabe';
  items: TeilItem[];
}

/** auswahl: Multiple-Choice. */
interface AuswahlDaten extends AufgabenKopf {
  typ: 'auswahl';
  frageText: string;
  optionen: { label: string; text: string }[];
  richtigeIdx: number;
}

/** zuordnung: Items den Choices zuordnen. */
interface ZuordnungDaten extends AufgabenKopf {
  typ: 'zuordnung';
  items: { label: string; text: string }[];
  choices: { label: string; text: string }[];
  /** Map: item.label → choice.label */
  antworten: Record<string, string>;
}

/** luecke: Gleichung mit Platzhaltern. */
interface LueckeDaten extends AufgabenKopf {
  typ: 'luecke';
  items: TeilItem[];
}

/** reihenfolge: Elemente sortieren. */
interface ReihenfolgeDaten extends AufgabenKopf {
  typ: 'reihenfolge';
  teilaufgaben: {
    label: string;
    items: string[];
    richtigeReihenfolge: string[];
  }[];
}

/** schritt: Mehrstufige Rechnung. */
interface SchrittDaten extends AufgabenKopf {
  typ: 'schritt';
  /** Teilaufgaben (a/b/c), jede mit eigenen Schritten */
  teilaufgaben: {
    label: string;
    schritte: TeilItem[];
  }[];
}

/** wahr-falsch: Aussagen beurteilen. */
interface WahrFalschDaten extends AufgabenKopf {
  typ: 'wahr-falsch';
  items: {
    label: string;
    aussage: string;
    richtig: boolean;
    erklaerung: string;
  }[];
}

/** textaufgabe: Sachaufgabe mit Kontext und Fragen. */
interface TextaufgabeDaten extends AufgabenKopf {
  typ: 'textaufgabe';
  items: TeilItem[];
}

/** Union aller typspezifischen Daten. */
type ParsedAufgabenDaten =
  | EingabeDaten
  | AuswahlDaten
  | ZuordnungDaten
  | LueckeDaten
  | ReihenfolgeDaten
  | SchrittDaten
  | WahrFalschDaten
  | TextaufgabeDaten;
```

### 2.3 Erweiterung von BankAufgabe

```typescript
export interface BankAufgabeBase {
  // ... bestehende Felder bleiben ...
  aufgabenstellung: string;  // bleibt als Fallback/Debug
  loesung: string;           // bleibt als Fallback/Debug
  
  /** NEU: Typspezifisch strukturierte Daten. Immer gesetzt wenn Parser erfolgreich. */
  parsed: ParsedAufgabenDaten;
}
```

---

## 3. Parser-Strategie

### 3.1 Architektur

```
parser.ts (besteht weiter)
  ├── parseAufgabenDatei()        — wie bisher: MD → Bloecke → YAML + Sections
  ├── parseAufgabenBlock()        — wie bisher, PLUS:
  │     └── parseDaten(typ, aufgabenstellung, loesung)  ← NEU
  │
  └── parseDaten()                ← NEU: Dispatcher
        ├── parseEingabeDaten()
        ├── parseAuswahlDaten()
        ├── parseZuordnungDaten()
        ├── parseLueckeDaten()
        ├── parseReihenfolgeDaten()
        ├── parseSchrittDaten()    ← hier liegt das Hauptproblem
        ├── parseWahrFalschDaten()
        └── parseTextaufgabeDaten()
```

### 3.2 Gemeinsame Hilfsfunktionen (1x definiert, ueberall genutzt)

```typescript
// src/aufgaben/parserHelpers.ts

/** Splittet auf a)/b)/c) und gibt Intro + Items zurueck. */
function splitTeilaufgaben(text: string): { intro: string; items: { label: string; text: string }[] }

/** Splittet Strichlisten-Items (- text) */
function splitStrichliste(text: string): string[]

/** Normalisiert Zahlen fuer Vergleich (Punkte entfernen, Komma → Punkt) */
function normalizeZahl(input: string): string

/** Extrahiert intro/anweisung aus dem Text vor den Items */
function extractAnweisung(aufgabenstellung: string): string
```

### 3.3 Pro Typ: Parsing-Regeln mit Beispielen

#### `eingabe` — einfachster Fall

**Pattern erkennen:**
- Hat `a)/b)/c)` Teilaufgaben → mehrere Items
- Keine Teilaufgaben → einzelnes Item

**Beispiel:**
```
Aufgabenstellung: "Rechne.\na) 300 + 500 =\nb) 1.300 + 500 ="
Loesung: "a) 800\nb) 1.800"
```
**Ergebnis:**
```json
{
  "typ": "eingabe",
  "anweisung": "Rechne.",
  "items": [
    { "label": "a", "frage": "300 + 500 =", "antwort": "800" },
    { "label": "b", "frage": "1.300 + 500 =", "antwort": "1.800" }
  ]
}
```

#### `schritt` — das Problemkind

**3 Format-Varianten erkannt:**

**Variante A: Strichlisten-Schritte (haeufigster Problemfall)**
```
Aufgabenstellung:
  "Rechne schrittweise.\n47 · 13 =\n- 40 · 10 = ___\n- 40 · 3 = ___\n- 7 · 10 = ___\n- 7 · 3 = ___\n- Summe: ___"
Loesung:
  "- 40 · 10 = 400\n- 40 · 3 = 120\n- 7 · 10 = 70\n- 7 · 3 = 21\n- Summe: 611"
```
**Ergebnis:**
```json
{
  "typ": "schritt",
  "anweisung": "Rechne schrittweise.\n47 · 13 =",
  "teilaufgaben": [{
    "label": "1",
    "schritte": [
      { "label": "1", "frage": "40 · 10 =", "antwort": "400" },
      { "label": "2", "frage": "40 · 3 =", "antwort": "120" },
      { "label": "3", "frage": "7 · 10 =", "antwort": "70" },
      { "label": "4", "frage": "7 · 3 =", "antwort": "21" },
      { "label": "5", "frage": "Summe:", "antwort": "611" }
    ]
  }]
}
```

**Variante B: a)/b)/c) Teilaufgaben ohne Unter-Schritte**
```
Aufgabenstellung: "Multipliziere schriftlich.\na) 2.313 · 3 =\nb) 1.621 · 4 ="
Loesung: "a) 6.939\nb) 6.484"
```
**Ergebnis:**
```json
{
  "typ": "schritt",
  "anweisung": "Multipliziere schriftlich.",
  "teilaufgaben": [
    { "label": "a", "schritte": [{ "label": "1", "frage": "2.313 · 3 =", "antwort": "6.939" }] },
    { "label": "b", "schritte": [{ "label": "1", "frage": "1.621 · 4 =", "antwort": "6.484" }] }
  ]
}
```

**Variante C: Rechenkette (Chain-Notation)**
```
Aufgabenstellung: "Berechne die Rechenkette.\n72 → · 5 → ▢ → − 20 → ▢"
Loesung: "72 → · 5 → 360 → − 20 → 340"
```
**Ergebnis:**
```json
{
  "typ": "schritt",
  "anweisung": "Berechne die Rechenkette.",
  "teilaufgaben": [{
    "label": "1",
    "schritte": [
      { "label": "1", "frage": "72 · 5 =", "antwort": "360" },
      { "label": "2", "frage": "360 − 20 =", "antwort": "340" }
    ]
  }]
}
```

**Variante D: Maltabelle (Tabelle mit Luecken)**
```
Aufgabenstellung: "Fuelle die Maltabelle aus.\n58 · 12:\n|  · | 10 | 2 |\n|---:|---:|---:|\n| 50 |    |   |\n|  8 |    |   |"
Loesung: "| 50 | 500 | 100 | 600 |\n|  8 | 80 | 16 | 96 |"
```
**Ergebnis:**
```json
{
  "typ": "schritt",
  "anweisung": "Fuelle die Maltabelle aus.\n58 · 12:",
  "teilaufgaben": [{
    "label": "1",
    "schritte": [
      { "label": "1", "frage": "50 · 10 =", "antwort": "500" },
      { "label": "2", "frage": "50 · 2 =", "antwort": "100" },
      { "label": "3", "frage": "8 · 10 =", "antwort": "80" },
      { "label": "4", "frage": "8 · 2 =", "antwort": "16" },
      { "label": "5", "frage": "Summe:", "antwort": "696" }
    ]
  }]
}
```

**Variante E: Ueberschlag + genau (2 Phasen pro Teilaufgabe)**
```
Aufgabenstellung: "Ueberschlage zuerst, dann rechne genau.\na) 2.849 · 3 ="
Loesung: "a) Ueberschlag: 3.000 · 3 = 9.000 → genau: 8.547"
```
**Ergebnis:**
```json
{
  "typ": "schritt",
  "anweisung": "Ueberschlage zuerst, dann rechne genau.",
  "teilaufgaben": [{
    "label": "a",
    "schritte": [
      { "label": "1", "frage": "Ueberschlag: 2.849 · 3 ≈", "antwort": "9000" },
      { "label": "2", "frage": "Genau: 2.849 · 3 =", "antwort": "8547" }
    ]
  }]
}
```

#### `luecke`

**Pattern:** Aufgabenstellung enthaelt `▢` oder `___`

**Beispiel:**
```
Aufgabenstellung: "a) 36.200 + ▢ = 37.000\nb) 37.000 + ▢ = 100.000"
Loesung: "a) 800\nb) 63.000"
```
**Ergebnis:**
```json
{
  "typ": "luecke",
  "anweisung": "Ergaenze. Welche Zahl fehlt?",
  "items": [
    { "label": "a", "frage": "36.200 + ▢ = 37.000", "antwort": "800" },
    { "label": "b", "frage": "37.000 + ▢ = 100.000", "antwort": "63.000" }
  ]
}
```

#### `auswahl`

**Pattern:** Grossbuchstaben-Optionen `A)/B)/C)/D)` oder explizite Optionszeilen

**Beispiel:**
```
Aufgabenstellung: "Welche Zahl ist am groessten?\nA) 34.568\nB) 34.586\nC) 34.658\nD) 34.856"
Loesung: "D) 34.856"
```
**Ergebnis:**
```json
{
  "typ": "auswahl",
  "anweisung": "",
  "frageText": "Welche Zahl ist am groessten?",
  "optionen": [
    { "label": "A", "text": "34.568" },
    { "label": "B", "text": "34.586" },
    { "label": "C", "text": "34.658" },
    { "label": "D", "text": "34.856" }
  ],
  "richtigeIdx": 3
}
```

#### `zuordnung`

**Pattern:** Zwei Gruppen (Items + Choices) mit Pfeil-Zuordnung in der Loesung

**Beispiel (05-multiplikation.md, Aufg. 20):**
```
Items (nummeriert): "1. Ergebnis: ...6  2. Ergebnis: ...56"
Choices (Buchstaben): "A. 2 · 7H = 14H  B. 2 · 8E = 16E"
Loesung: "1 → B\n2 → C\n3 → A\n4 → D"
```

#### `wahr-falsch`

**Pattern:** a)/b)/c) Aussagen, Loesung mit Richtig/Falsch-Indikatoren

#### `textaufgabe`

**Pattern:** Laengerer Kontexttext + Frage(n)

#### `reihenfolge`

**Pattern:** Items die sortiert werden muessen, Loesung mit `>` oder `→`

### 3.4 Erkennungsreihenfolge fuer `schritt`-Aufgaben

Da `schritt` das groesste Problemformat ist, hier die exakte Reihenfolge:

```
1. Hat die Aufgabenstellung eine Markdown-Tabelle (| ... |)?
   → Maltabelle-Format: Extrahiere Zeilen/Spalten-Koepfe, generiere Schritt-Items
   
2. Hat die Aufgabenstellung Strichlisten-Items (- xxx = ___)?
   → Strichlisten-Format: Jedes "- " Item wird ein Schritt
   
3. Enthaelt die Loesung Chain-Notation (→)?
   → Rechenkette: Parse Start → Operation → Ergebnis Ketten
   
4. Hat die Aufgabenstellung a)/b)/c) Teilaufgaben?
   → Teilaufgaben-Format: Jede Teilaufgabe wird eine eigene Teilaufgabe mit 1 Schritt
   
5. Enthaelt die Loesung nummerierte Schritte (1. xxx = yyy)?
   → Schritte aus der Loesung extrahieren
   
6. Enthaelt die Loesung "Ueberschlag: ... → genau: ..."?
   → Ueberschlag+Genau-Format: 2 Schritte pro Teilaufgabe
   
7. Fallback: 1 Teilaufgabe, 1 Schritt
```

---

## 4. View-Verantwortlichkeiten

### 4.1 Wer zeigt was?

| Element | Verantwortlich | Wo |
|---------|---------------|-----|
| Thema + Titel | `bankStage.tsx` | Titel-Card oben |
| Schwierigkeitsfilter | `bankStage.tsx` | Ueber der View |
| Didaktischer Hinweis (?) | `bankStage.tsx` | Header-Button + aufklappbare Card |
| **Anweisung** (Intro-Text) | **View** | Erste Card in der View |
| **Interaktions-UI** | **View** | Hauptbereich |
| **Eingabefelder** | **View** | Unter der Frage |
| **Feedback-Banner** | **View** | Unter den Eingabefeldern |
| Tipp-System | `bankStage.tsx` | **NUR** dort, nie in der View |
| "Naechste Aufgabe" Button | `bankStage.tsx` | Ganz unten |

### 4.2 Klare Regel: AufgabeWrapper wird schlank

Aktuell hat `AufgabeWrapper.tsx` ein eigenes TippSystem. Das muss raus — Tipps werden **nur** im `bankStage.tsx` verwaltet.

```typescript
// AufgabeWrapper.tsx — NEU (vereinfacht)
export function AufgabeWrapper({ aufgabe, onRichtig, onFalsch }: AufgabeWrapperProps) {
  const View = VIEW_MAP[aufgabe.typ];
  if (!View) return <UnsupportedView typ={aufgabe.typ} />;
  return <View aufgabe={aufgabe} onRichtig={onRichtig} onFalsch={onFalsch} />;
}
```

Kein TippSystem, kein State — nur Dispatch.

### 4.3 Views empfangen `parsed`-Daten

```typescript
// Neue View-Props
export interface AufgabeViewProps {
  aufgabe: BankAufgabe; // hat jetzt `.parsed` mit strukturierten Daten
  onRichtig: () => void;
  onFalsch: () => void;
}
```

Jede View liest `aufgabe.parsed` statt eigenes Parsing:

```typescript
// SchrittView — NEU
export function SchrittView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as SchrittDaten;
  // daten.teilaufgaben[0].schritte → fertig strukturiert!
  // KEIN parseSchritte() mehr noetig
}
```

---

## 5. Layout-Regeln

### 5.1 Aufgabenstellung: Immer nur 1x

**Regel:** Die `anweisung` aus `parsed` wird **in der View** als erste Card angezeigt. Der `bankStage.tsx` zeigt **nur** Thema + Titel (Metadaten), **nicht** den Aufgabentext.

```
┌─────────────────────────────────┐
│ 🔢 Halbschriftliches Multipli...│  ← bankStage: Thema + Titel
│ Schrittweise multiplizieren     │
├─────────────────────────────────┤
│ Rechne schrittweise.            │  ← View: parsed.anweisung
│ 47 · 13 =                      │
├─────────────────────────────────┤
│ ✓ 40 · 10 = 400                │  ← View: erledigte Schritte
│ ✓ 40 · 3 = 120                 │
├─────────────────────────────────┤
│ Schritt 3 von 5                 │  ← View: aktueller Schritt
│ 7 · 10 = ?                     │
├─────────────────────────────────┤
│ [___________]                   │  ← View: Eingabefeld
├─────────────────────────────────┤
│ [ Pruefen ]                     │  ← View: Button
├─────────────────────────────────┤
│ 💡 Tipp (1/3)                  │  ← bankStage: TippSystem
├─────────────────────────────────┤
│ [ Naechste Aufgabe → ]          │  ← bankStage: Navigation
└─────────────────────────────────┘
```

### 5.2 Tipp-Button: Immer nur 1x

**Regel:** Der Tipp-Button lebt **nur** im `bankStage.tsx`. Die `AufgabeWrapper` hat **kein** eigenes TippSystem mehr.

Das loest: Tipp-Button-Dopplung (Header + View-Footer).

### 5.3 Eingabefelder: Passend zum Typ

| Typ | Eingabe-UI |
|-----|-----------|
| `eingabe` | 1 numerisches Feld pro Item, Items sequenziell |
| `luecke` | 1 numerisches Feld pro Luecke, inline neben der Gleichung |
| `schritt` | 1 numerisches Feld pro Schritt, Schritte sequenziell freigeschaltet |
| `auswahl` | Tap-Buttons (keine Eingabefelder) |
| `wahr-falsch` | Stimmt/Stimmt-nicht Buttons |
| `zuordnung` | Tap-to-Match Buttons |
| `reihenfolge` | Tap-to-Sort Buttons |
| `textaufgabe` | 1 Textfeld pro Frage |

### 5.4 Teilaufgaben-Navigation

Bei Typen mit a)/b)/c) Teilaufgaben:
- Items werden **sequenziell** durchlaufen (a, dann b, dann c)
- Fortschrittsanzeige: "Teilaufgabe 2 von 3"
- Erst nach der letzten Teilaufgabe wird `onRichtig()` aufgerufen

Bei `schritt` mit Teilaufgaben UND Schritten:
- Aeussere Schleife: Teilaufgaben
- Innere Schleife: Schritte pro Teilaufgabe
- Anzeige: "Aufgabe a) — Schritt 2 von 4"

---

## 6. Migrations-Plan

### Phase 1: Parser erweitern (keine View-Aenderungen)

**Ziel:** `parsed`-Feld wird auf `BankAufgabe` hinzugefuegt. Views ignorieren es erstmal.

1. Neue Datei `src/aufgaben/parserHelpers.ts` mit gemeinsamen Hilfsfunktionen
2. Neue Datei `src/aufgaben/parserTyped.ts` mit `parseDaten()` Dispatcher + typspezifische Parser
3. `parser.ts` aendern: Nach dem Extrahieren von `aufgabenstellung` und `loesung` wird `parseDaten()` aufgerufen
4. `types.ts` erweitern: `parsed: ParsedAufgabenDaten` Feld auf `BankAufgabeBase`
5. **Testen:** Console.log von `parsed` fuer alle Aufgaben, manuell pruefen ob die Strukturen stimmen

**Risiko:** Null. Die Views lesen `parsed` noch nicht.

### Phase 2: Views umstellen (eine nach der anderen)

Reihenfolge nach Prioritaet (haeufigste Typen zuerst):

1. **SchrittView** — groesstes Problem, hoechste Prioritaet
2. **EingabeView** — haeufigster Typ
3. **LueckeView** — aehnlich wie Eingabe
4. **WahrFalschView** — eigene Logik, relativ einfach
5. **AuswahlView** — funktioniert schon OK, aber Parsing rausziehen
6. **TextaufgabeView** — spezielle Kontext-Logik
7. **ReihenfolgeView** — komplexe Interaktion
8. **ZuordnungView** — komplexestes Parsing

Pro View-Umstellung:
1. View liest `aufgabe.parsed as XxxDaten` statt eigenes `parseXxx()`
2. Eigene `parseXxx()` Funktion wird geloescht
3. View wird getestet mit verschiedenen Aufgaben des Typs

### Phase 3: Layout-Bereinigung

1. TippSystem aus `AufgabeWrapper.tsx` entfernen
2. Tipp-Logik in `bankStage.tsx` konsolidieren (lebt schon dort, nur aufaeumen)
3. Aufgabenstellung-Dopplung beheben: `bankStage.tsx` zeigt nur Metadaten, View zeigt `parsed.anweisung`

### Phase 4: Aufaeumen

1. Alte `parseXxx()` Funktionen in Views sind alle geloescht
2. `parserHelpers.ts` Funktionen testen
3. Console-Warnings fuer Aufgaben wo `parsed` nicht gesetzt werden konnte (Fallback-Tracking)

---

## 7. Format-Pattern-Checkliste

Fuer jede Aufgabe in den MD-Dateien: welches Format-Pattern wird vom Parser erkannt?

### 7.1 `eingabe`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| `a)/b)/c)` Items | "a) 300 + 500 =\nb) 1.300 + 500 =" | Sehr haeufig | `splitTeilaufgaben()` |
| Einzelne Rechnung | "400 + 300 =" | Haeufig | 1 Item mit gesamtem Text |
| Paeckchen (Einrueckung) | "a) 5 · 800 =\n   5 · 8.000 =" | Selten | Eingerueckte Zeilen als Teil des vorherigen Items |
| Frage + Antwort | "Wie viele Moeglichkeiten?" | Textfragen | 1 Item, Freitext-Antwort |

### 7.2 `schritt`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| Strichliste `- x = ___` | "- 40 · 10 = ___\n- 40 · 3 = ___" | Sehr haeufig (Multiplikation) | `splitStrichliste()` → Schritte |
| `a)/b)/c)` Teilaufgaben | "a) 2.313 · 3 =\nb) 1.621 · 4 =" | Sehr haeufig | Teilaufgaben mit je 1 Schritt |
| Rechenkette `→` | "72 → · 5 → ▢ → − 20 → ▢" | Haeufig (Kap. 3) | Chain-Parser |
| Maltabelle `\|...\|` | "\| · \| 10 \| 2 \|\n\| 50 \| \| \|" | Selten (Kap. 5) | Tabellen-Parser |
| Text-Beschreibung | "Multipliziere 40 mit 8..." | Selten (Kap. 3) | Schritte aus Loesung extrahieren |
| Ueberschlag + genau | "Ueberschlag: ... → genau: ..." | Mittel (Kap. 5, 8) | 2 Schritte pro Teilaufgabe |
| Halbschriftlich a)/b)/c) | "a) 84 : 4\nb) 72 : 6" | Haeufig (Kap. 8) | Teilaufgaben, Schritte aus Loesung |

### 7.3 `luecke`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| `▢` in Gleichung | "36.200 + ▢ = 37.000" | Haeufig | `▢` oder `___` als Luecken-Marker |
| `___` in Gleichung | "96 : ___ = 12" | Haeufig | Gleicher Parser |

### 7.4 `auswahl`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| `A)/B)/C)/D)` Optionen | "A) 34.568\nB) 34.586" | Haeufig | Grossbuchstaben-Split |
| `a)/b)/c)` als Optionen (kein Teilaufgaben-Split!) | "a) Jettes Methode\nb) Justus' Methode" | Selten | Kleinbuchstaben als Optionen |

### 7.5 `zuordnung`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| Nummerierte Items + Buchstaben-Choices | "1. ...\n2. ...\nA. ...\nB. ..." | Haeufig | Zwei Gruppen erkennen |
| `a)/b)` Items + Tabelle-Choices | Items als Buchstaben, Choices als Zeilen | Selten | Tabellen-Parser als Choice-Quelle |
| Loesung mit `→` | "1 → B\n2 → C" | Standard | Pfeil-Parser |

### 7.6 `wahr-falsch`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| `a)/b)/c)` Aussagen | "a) 63 ist das Neunfache von 7." | Haeufig | Teilaufgaben, Loesung-Text → boolean |
| Einzelne Aussage + Rechnung | "589 + 103 = 692 — Stimmt das?" | Selten | 1 Item |

### 7.7 `textaufgabe`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| Kontext + `a)/b)` Fragen | "Text...\na) Wie viel...?\nb) Wie viel...?" | Haeufig | Kontext + Items |
| Kontext + 1 Frage | "Text...\n\nWie viel kostet...?" | Haeufig | Kontext (alle Absaetze bis auf letzten) + 1 Frage |

### 7.8 `reihenfolge`-Aufgaben

| Pattern | Beispiel | Haeufigkeit | Parser-Strategie |
|---------|----------|-------------|-----------------|
| Items aus Loesung | Loesung: "A > B > C" | Haeufig | `>` oder `→` Split |
| Pipe-separiert | "A \| B \| C" | Selten | Pipe-Split |

---

## 8. Offene Entscheidungen

### 8.1 Umgang mit nicht-parsebaren Aufgaben

**Vorschlag:** Wenn `parseDaten()` fuer eine Aufgabe fehlschlaegt, wird `parsed` trotzdem gesetzt — als Fallback-Typ:

```typescript
interface FallbackDaten {
  typ: 'fallback';
  aufgabenstellung: string;
  loesung: string;
  grund: string; // warum Parsing fehlschlug
}
```

Die Views haben dann einen Fallback-Modus, der den rohen Text anzeigt + Freitext-Eingabe. Plus: Console-Warning in Dev, damit wir sehen welche Aufgaben nachgebessert werden muessen.

### 8.2 Paeckchen-Format (eingabe mit Einrueckung)

Aufgabe 2 in 05-multiplikation.md hat das Format:
```
a) 5 · 800 =
   5 · 8.000 =
   5 · 80.000 =
```

Hier sind die eingerueckten Zeilen **Teil der Teilaufgabe a)**, nicht eigene Teilaufgaben. Der Parser muss das erkennen. Vorschlag: Eingerueckte Zeilen (2+ Leerzeichen) werden an den vorherigen Item angehaengt.

### 8.3 Loesung mit Slash-Notation

Bei Paeckchen steht die Loesung manchmal als:
```
a) 4.000 / 40.000 / 400.000
```

Der Parser muss `/` als Trennzeichen fuer mehrere Antworten innerhalb einer Teilaufgabe erkennen.

---

*Erstellt: 2026-04-06 — Gremiumssitzung Sarah Kowalski, Tom Berger, Prof. Sommer*
*Status: Entwurf zur Freigabe durch Mathias*
