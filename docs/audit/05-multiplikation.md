# Audit: 05-multiplikation.json
Geprüft: 34 Aufgaben (ohne Platzhalter)

---

## Fehler

Keine mathematischen Fehler gefunden. Alle 34 Aufgaben sind rechnerisch korrekt nachgerechnet.

---

## Warnungen

### Typ-Passung

- **#8** "Division mit Kontrolle — Große Zahlen": Typ ist `textaufgabe`, aber die Aufgabe ist eine reine Rechenaufgabe ohne Sachkontext (4 Divisionsaufgaben mit Kontrollmultiplikation). `eingabe` wäre passender. `textaufgabe` impliziert eine Sachsituation mit beschreibendem Text, die hier fehlt.

### Antwortformat

- **#13** "Halbschriftlich multiplizieren — Übung": In `parsed.teilaufgaben[].schritte[].antwort` steht `"41 · 23 = 943"` statt nur `"943"`. Das ist inkonsequent: Alle anderen `schritt`-Aufgaben im gleichen File (z.B. #11, #12, #17–19) haben nur die Zahl als Antwort. Ein Validator kann hier die Eingabe eines Kindes nicht eindeutig gegen eine Gleichungsdarstellung prüfen.

- **#15** "Verdoppeln und Halbieren — Justus' Trick": Typ ist `eingabe`, aber `parsed.items[].antwort` enthält Rechenketten wie `"25 · 24 = 50 · 12 = 100 · 6 = 600"` statt nur `"600"`. Ein Kind, das im Eingabefeld eine Zahl eingibt, kann nie exakt diese Kette produzieren. Wenn der Trick-Weg gezeigt werden soll, passt `schritt` oder `textaufgabe` besser — oder die Antwort muss auf `"600"` / `"900"` / `"900"` reduziert werden.

### Notation / Formulierung

- **#26** "Fehlende Ziffern ergänzen — Detektivarbeit": Die Aufgabenstellung schreibt `"___43___ · 2 = 4.862"` mit drei Unterstrichen auf jeder Seite. Das signalisiert visuell drei Lücken — gemeint sind aber nur zwei fehlende Ziffern (Tausender und Einer von 2.431). Konsistente Notation wäre `"_43_ · 2 = 4.862"` (ein Unterstrich pro Lücke). Gleiches Problem in Teilaufgabe b (`"6__7 · 4 = 24.828"` — hier stimmt die Anzahl der Unterstriche mit den Lücken überein, also ist b konsistent, nur a ist betroffen).

---

## Notizen ohne Handlungsbedarf

- **#5** (Wahr-Falsch 24.000), **#23** (Fehlersuche): Die absichtlich falschen Ergebnisse in der Aufgabenstellung sind korrekt als falsch markiert; die in den `erklaerung`-Feldern genannten richtigen Werte wurden alle gegengerechnet und stimmen.
- **#20** (Rechenschritte zuordnen 1.728 · 2 = 3.456): Alle vier Zuordnungen a→B, b→C, c→A, d→D sind inhaltlich und rechnerisch korrekt.
- **#34** (Ziffernkarten-Rätsel): 231 · 45 = 10.395 ✓ (Ziffern 1–5 je einmal), 534 · 12 = 6.408 ✓ (Ziffern 1–5 je einmal).
- **Tipps-Qualität**: Alle geprüften Aufgaben folgen dem Impuls → Denkanstoß → Teilantwort → vollständige Lösung-Muster. Tipp 4 entspricht jeweils dem `loesungsweg`. Sprache ist durchgehend kindgerecht und ermutigend.
