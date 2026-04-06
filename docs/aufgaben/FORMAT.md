# Aufgabenbank — Formatdefinition

Verbindliches Schema für alle Aufgaben-Dateien in `docs/aufgaben/`.

---

## Dateistruktur

Eine Markdown-Datei pro Buchkapitel:
- `01-wiederholung.md`
- `02-zahlen-bis-million.md`
- usw.

Jede Datei enthält einen Kapitel-Header und dann Aufgaben als `## Aufgabe N`-Blöcke.

---

## YAML-Frontmatter pro Aufgabe

Jede Aufgabe beginnt mit einem YAML-Block:

```yaml
---
titel: "Rechenpäckchen — verwandte Aufgaben"
typ: eingabe
thema: "Rechnen bis 2.000"
schwierigkeit: gelb
buchseite: 9
kapitel: "01-wiederholung"
stage_id: "rechnen-bis-2000"
digital: voll
---
```

### Pflichtfelder

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `titel` | string | Kurzer, beschreibender Aufgabentitel |
| `typ` | enum | Interaktionstyp (siehe unten) |
| `thema` | string | Unterthema aus dem Buch (z.B. "Schriftliches Addieren") |
| `schwierigkeit` | enum | `gelb` (einfach), `grün` (Kern), `orange` (knifflig) |
| `buchseite` | number | Seitenzahl im Fredo-4-Buch |
| `kapitel` | string | Kapitel-ID (z.B. "01-wiederholung") |
| `stage_id` | string | Stage-ID aus FREDO_MAPPING.md |
| `digital` | enum | `voll` (komplett digital), `teilweise` (eingeschränkt), `platzhalter` (nicht digital) |

---

## Die 8 Interaktionstypen

### 1. `eingabe` — Zahleneingabe
Das Kind tippt eine Zahl ein. Häufigstes Format.

**Beispiel aus dem Buch (S. 9):**
> Rechne: 400 + 300 = ___

**App-UI:** Numeric Keypad, Eingabefeld, Prüfen-Button.

---

### 2. `auswahl` — Multiple-Choice
Das Kind wählt aus 2-4 Antwortmöglichkeiten.

**Beispiel aus dem Buch (S. 22):**
> Welche Zahl ist größer? a) 34.568 b) 34.586

**App-UI:** Große Tap-Buttons mit den Optionen.

---

### 3. `zuordnung` — Zuordnung / Tap-to-Match
Das Kind ordnet Elemente einander zu.

**Beispiel aus dem Buch (S. 40):**
> Welche Beschreibung gehört zu welcher Rechenkette? Ordne zu.

**App-UI:** Zwei Spalten, durch Antippen verbinden.

---

### 4. `luecke` — Lückentext / Platzhalter
Das Kind füllt Lücken in einer Gleichung oder einem Term.

**Beispiel aus dem Buch (S. 43):**
> Setze die richtige Zahl ein: 90 : (4 + ▢) = 10

**App-UI:** Inline-Eingabefelder in der Gleichung.

---

### 5. `reihenfolge` — Sortieren
Das Kind bringt Elemente in die richtige Reihenfolge.

**Beispiel aus dem Buch (S. 22):**
> Ordne die Zahlen nach der Größe. Beginne mit der größten Zahl.

**App-UI:** Drag-and-Drop oder Antippen zum Sortieren.

---

### 6. `schritt` — Mehrstufige Rechnung
Das Kind löst eine Aufgabe in mehreren Teilschritten.

**Beispiel aus dem Buch (S. 40):**
> Rechenkette: 54 → ·6 → ▢ → −10 → ▢

**Beispiel:** Schriftliches Addieren Zeile für Zeile.

**App-UI:** Mehrere Eingabefelder, Schritt für Schritt freigeschaltet.

---

### 7. `wahr-falsch` — Stimmt / Stimmt nicht
Das Kind beurteilt, ob eine Aussage oder ein Ergebnis richtig ist.

**Beispiel aus dem Buch (S. 39):**
> Finde mit dem Überschlag heraus, welche Ergebnisse nicht stimmen können. 589 + 103 = 692 — Stimmt das?

**App-UI:** Zwei große Buttons: ✓ Stimmt / ✗ Stimmt nicht. Bei "Stimmt nicht": Korrektur eingeben.

---

### 8. `textaufgabe` — Sachaufgabe mit Kontext
Das Kind liest einen Text und beantwortet Fragen dazu.

**Beispiel aus dem Buch (S. 38):**
> Die Schule hat einen Gutschein von 2.000 Euro gewonnen und möchte davon möglichst viele Pausenspiele kaufen. Was könnte die Schule kaufen?

**App-UI:** Textblock oben, Eingabefeld(er) unten, ggf. mehrstufig.

---

## Schwierigkeitsgrade (Fredo-Farbsystem)

| Grad | Farbe | Bedeutung | Anteil |
|------|-------|-----------|--------|
| `gelb` | 🟡 | Einfache Aufgaben, Grundlagen sichern | ~30% |
| `grün` | 🟢 | Kernaufgaben, das Wesentliche üben | ~40% |
| `orange` | 🟠 | Knifflige Aufgaben, Vertiefung | ~30% |

---

## Aufgabenanzahl pro Thema

Gestaffelt nach Seitenumfang im Buch:

| Buchseiten | Aufgaben |
|-----------|----------|
| 1 Seite | 5-6 |
| 2 Seiten | 7-9 |
| 3+ Seiten | 10-15 |

---

## Tipp-Regeln

Jede Aufgabe hat 3 Tipps. Die Tipps sind speziell für **visuelle Lerntypen** gestaltet.

### Tipp 1: Denkanstoß
Eine Frage, die zum richtigen Denkweg führt. Visuell wo möglich.

> ✅ "Stell dir die Zahl mit Dienes-Blöcken vor. Wie viele Hunderter siehst du?"
> ✅ "Schau dir den Zahlenstrahl an. Wo liegt die Zahl ungefähr?"
> ❌ "Denk nochmal nach."
> ❌ "Rechne nochmal."

### Tipp 2: Methode
Die Strategie benennen und ein visuelles Hilfsmittel vorschlagen.

> ✅ "Zerlege die Zahl in Stellenwerte. Schreibe sie in eine Stellenwerttafel: T | H | Z | E"
> ✅ "Rechne zuerst nur die Hunderter. Dann addiere die Zehner dazu."
> ❌ "Benutze die Formel."

### Tipp 3: Scaffolding
Den ersten Schritt vormachen, den Rest offen lassen. Das Kind macht den letzten Schritt selbst.

> ✅ "423 = 400 + ___ + 3. Was fehlt in der Mitte?"
> ✅ "Der erste Schritt: 300 + 500 = 800. Jetzt kommt der Tausender dazu: 1.000 + 800 = ?"
> ❌ "Die Antwort ist 1.880." (Lösung verraten!)

### Generelle Regeln
- Tipps sind **nie demotivierend** ("Das ist doch einfach", "Das müsstest du können")
- Tipps betonen immer **visuelle Hilfen**: Dienes-Blöcke, Stellenwerttafel, Zahlenstrahl, Skizze
- Tipps **bauen aufeinander auf**: Denkanstoß → Methode → Scaffolding
- Tipp 3 gibt **nie die komplette Lösung** — das Kind macht den letzten Schritt selbst

---

## Platzhalter für nicht-digitale Aufgaben

Aufgaben, die haptisches Material erfordern (Zirkel, Geodreieck, Basteln, Gruppenarbeit), werden als Platzhalter markiert:

```yaml
---
titel: "Kreise mit dem Zirkel zeichnen"
typ: eingabe
thema: "Kreise zeichnen"
schwierigkeit: grün
buchseite: 104
kapitel: "10-kreise-muster-koerper"
stage_id: ""
digital: platzhalter
---

### Aufgabenstellung
⚠️ **PLATZHALTER — Nicht digital umsetzbar**

Diese Aufgabe erfordert einen Zirkel und Papier.
Original: "Zeichne einen Kreis mit dem Radius 3 cm."

**Mögliche digitale Alternative:** Multiple-Choice "Welcher Kreis hat den Radius 3 cm?"
```

---

## Vollständige Beispielaufgabe

```markdown
## Aufgabe 3

---
titel: "Rechenpäckchen — verwandte Aufgaben"
typ: eingabe
thema: "Rechnen bis 2.000"
schwierigkeit: gelb
buchseite: 9
kapitel: "01-wiederholung"
stage_id: "rechnen-bis-2000"
digital: voll
---

### Aufgabenstellung
Rechne. Vergleiche die Aufgaben miteinander.

a) 300 + 500 =
b) 1.300 + 500 =
c) 1.380 + 500 =

### Lösung
a) 800
b) 1.800
c) 1.880

### Lösungsweg
Die Aufgaben bauen aufeinander auf — das ist ein Rechenpäckchen:
- a) 3 Hunderter + 5 Hunderter = 8 Hunderter → 800
- b) Gleiche Hunderter-Aufgabe, aber 1 Tausender kommt dazu → 1.800
- c) Gleiche Aufgabe, aber 80 (8 Zehner) kommen dazu → 1.880

Das Muster: Wenn du die einfache Aufgabe gelöst hast, brauchst du bei den schwierigeren nur noch das Neue dazuzurechnen.

### Tipp 1 (Denkanstoß)
Schau dir die drei Aufgaben genau an. Was ist bei allen gleich? Was verändert sich von Aufgabe zu Aufgabe?

### Tipp 2 (Methode)
Rechne zuerst nur die Hunderter: 3H + 5H = 8H = 800.
Das ist deine Grundaufgabe. Bei b) und c) kommt etwas dazu — aber die Hunderter-Rechnung bleibt gleich!

### Tipp 3 (Schritt-für-Schritt)
a) 300 + 500 = 800 ✓
b) Es kommt nur ein Tausender dazu. Was ist 1.000 + 800? Das ist deine Antwort für b).
c) Jetzt kommen noch 80 dazu. Was ist 1.800 + 80?

### Didaktischer Hinweis
Rechenpäckchen trainieren das Erkennen von Mustern bei verwandten Aufgaben. Das Kind soll lernen, dass es nicht jede Aufgabe "von Null" rechnen muss, sondern Zusammenhänge zwischen den Aufgaben nutzen kann. Dies fördert das Verständnis für das Stellenwertsystem und effiziente Rechenstrategien.
```

---

*Erstellt: 2026-04-06 — Verbindlich für alle Aufgaben-Dateien in docs/aufgaben/*
