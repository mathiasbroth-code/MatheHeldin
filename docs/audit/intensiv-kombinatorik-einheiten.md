# Audit: intensiv-kombinatorik-einheiten.json
Geprüft: 73 Aufgaben (ohne 2 Platzhalter)

Themenblöcke: Entfernungen (15), Geschwindigkeiten (14), Kombinatorik (15), Wahrscheinlichkeit (13), Buchstabenanalyse (16)

---

## Fehler

### #20 (Index 19) "Geschwindigkeit berechnen — Wer ist schneller?"
**Mathematisch falsch im `loesung`-Feld:**
`loesung = "a) 6\nb) 15\nc) Radfahrer (20 km/h > 10 km/h)"`
Korrekt: `c) Radfahrer (15 km/h > 6 km/h)`
Die Zahlen 20 und 10 stammen aus einer anderen Aufgabe (wahrscheinlich copy-paste aus "Wie weit kommt man in 2 Stunden?"). Das `parsed.items[c].antwort` ist korrekt ("Radfahrer (15 km/h > 6 km/h)"), nur das Top-Level-`loesung`-Feld ist falsch.

### #55 (Index 54) "Lieblings-Buchstabe finden — Textanalyse"
**Falsche Buchstabenzählung:**
Aufgabentext: "Tim und Mia spielen im Garten mit dem Ball."
`loesung` sagt: `a) 35 Buchstaben`
Tatsächlich: **34 Buchstaben** (T-I-M-U-N-D-M-I-A-S-P-I-E-L-E-N-I-M-G-A-R-T-E-N-M-I-T-D-E-M-B-A-L-L = 34)
Der `loesungsweg` listet denselben Text auf und nennt 35 — eine davon ist falsch; nachgezählt sind es 34.

---

## Warnungen

### #4 (Index 3) "Welche Strecke ist länger?"
**Falsche `parsed`-Struktur (Typ-Passung):**
Die Aufgabe hat 4 Teilfragen (a–d), jede mit 3 Auswahlmöglichkeiten. `parsed.typ = "auswahl"` mit einem einzigen `richtigeIdx = 0` bildet das nicht ab — die `optionen` enthalten die 4 *Fragen* a–d, nicht die Antwortoptionen. Eine `zuordnung`- oder ein Array von `eingabe`-Items würde besser passen. Wie implementiert kann die App keinen Schüler durch alle 4 Teilantworten führen.

### #35 (Index 34) "Sitzreihenfolge im Auto"
**Unvollständige `parsed`-Antwort:**
`parsed.items[b].antwort = "1. Emma – Finn – Greta"` — nur die erste von 6 Reihenfolgen. Die Frage lautet "Schreibe alle auf." Ein Kind, das die App als Referenz nutzt, sieht nur eine von sechs. Die anderen fünf fehlen in der strukturierten Daten-Ebene (sie stehen jedoch vollständig im `loesung`-Feld).

### #36 (Index 35) "Münzen werfen — Kopf oder Zahl"
**Unvollständige `parsed`-Antwort:**
`parsed.items[b].antwort = "1. K-K (beide Kopf)"` — nur das erste von 4 Ergebnissen. Gleiche Problematik wie #35.

### #45 (Index 44) "Münzen werfen — drei Münzen"
**Unvollständige `parsed`-Antwort:**
`parsed.items[b].antwort = "1. K-K-K"` — nur das erste von 8 Ergebnissen. Gleiche Problematik wie #35/#36.

### #50 (Index 49) "Strichliste in eine Tabelle übertragen"
**`parsed`-Antwort ist nur ein Label:**
`parsed.items[a].antwort = "a)"` — enthält keine echte Antwort, nur das Aufgabenlabel. Das `parsed.items[c].antwort` enthält zudem langen Erklärungstext mit Lösungsversuchen statt einer klaren Buchstaben-Paar-Angabe ("A + T = 3 + 9 = 12"). Für eine Auswertung durch die App unbrauchbar.

### #56 (Index 55) "Diagramm ablesen — Wie oft kommt jeder Buchstabe vor?"
**`parsed`-Antwort ist nur ein Label:**
`parsed.items[a].antwort = "a)"` — keine echte Antwort. Die vollständige Tabelle steht im `loesung`-Feld, aber nicht in `parsed.items`.

### #53 (Index 52) "Strichliste für einen kurzen Satz"
**Unvollständige `parsed`-Antwort:**
`parsed.items[1].antwort = "E: 4, I: 2, A: 2"` — die gefragten Buchstaben N, T, S fehlen. Die vollständige Lösung (E:4, I:2, A:2, N:2, T:2, S:2) steht im `loesung`-Feld.
Zusätzlich: "heißt" enthält ß, das in der Lösung als SS (= 2 S-Buchstaben) behandelt wird. Das ist für 9-Jährige ohne Erklärung verwirrend — ein kurzer Hinweis in den Tipps wäre sinnvoll.

---

## Tipps-Qualität

Alle geprüften Aufgaben folgen dem 4-Stufen-Schema (Impuls → Denkanstoß → Teilantwort → vollständige Lösung) konsequent. Tipp 4 gibt stets die komplette Lösung. Sprache kindgerecht. Keine Beanstandungen.

---

## Mathematische Korrektheit (Zusammenfassung)

Alle Rechenoperationen wurden nachgeprüft:

- Km/m-Umrechnungen: korrekt (3×1000=3000, Kommaverschiebung ✓)
- Entfernungsaufgaben: alle Additionen/Subtraktionen korrekt
- Geschwindigkeiten (s=v×t, v=s/t, t=s/v): alle korrekt
- Begegnungsaufgabe (2 Autos): 80+70=150, 300÷150=2h ✓
- Kombinatorik-Multiplikationsregel: alle korrekt (3×2=6, 4×3×2=24 etc.)
- Fakultäten: 3!=6, C(4,3)=4, C(5,2)=10 etc. ✓
- Würfelsummen (>7 / <7): je 15 Möglichkeiten, symmetrisch ✓
- Buchstabenzählungen: 1 Fehler (s.o. #55)
