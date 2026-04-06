# Kapitel 7: Kombinatorik · Wahrscheinlichkeit — Aufgabensammlung
Buchseiten: 72-77 | Themen: 4 | Format: [FORMAT.md](FORMAT.md)

---

# Thema 1: Wie viele Möglichkeiten? (S. 72-73)

## Aufgabe 1

---
titel: "Anordnung von drei Freunden — Baumdiagramm"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Drei Freunde — Lena, Tom und Mia — wollen nebeneinander auf einem Foto stehen.

a) Wie viele verschiedene Reihenfolgen gibt es?
b) Zähle alle Möglichkeiten auf.

### Lösung
a) 6

b)
1. Lena – Tom – Mia
2. Lena – Mia – Tom
3. Tom – Lena – Mia
4. Tom – Mia – Lena
5. Mia – Lena – Tom
6. Mia – Tom – Lena

### Lösungsweg
Baumdiagramm:
```
       ┌── Tom ── Mia     → Lena, Tom, Mia
Lena ──┤
       └── Mia ── Tom     → Lena, Mia, Tom

       ┌── Lena ── Mia    → Tom, Lena, Mia
Tom ───┤
       └── Mia ── Lena    → Tom, Mia, Lena

       ┌── Lena ── Tom    → Mia, Lena, Tom
Mia ───┤
       └── Tom ── Lena    → Mia, Tom, Lena
```

Für den 1. Platz gibt es 3 Wahlmöglichkeiten, für den 2. Platz noch 2, für den 3. Platz nur 1.
3 × 2 × 1 = 6

### Tipp 1 (Denkanstoß)
Wer kann ganz links stehen? Es gibt 3 Möglichkeiten. Für jede dieser Möglichkeiten: Wer kann dann daneben stehen?

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm: Beginne mit den 3 Kindern als Äste. Von jedem Ast gehen 2 weitere Äste ab (die beiden übrigen Kinder). Am Ende steht das letzte Kind fest. Zähle die Enden!

```
Platz 1 → Platz 2 → Platz 3
3 Aeste → je 2 Aeste → je 1 Ast
```

### Tipp 3 (Schritt-für-Schritt)
Wenn Lena links steht, gibt es 2 Möglichkeiten: Tom–Mia oder Mia–Tom.
Wenn Tom links steht, gibt es auch 2 Möglichkeiten.
Wenn Mia links steht, noch einmal 2.
Also: 3 × 2 = ?

### Didaktischer Hinweis
Einstieg in die Kombinatorik über das Baumdiagramm. Drei Elemente sind ideal, weil die Anzahl (6) überschaubar bleibt und das Baumdiagramm auf ein Blatt passt. Das Prinzip "3 × 2 × 1" wird hier entdeckt, nicht als Formel vorgegeben.

---

## Aufgabe 2

---
titel: "Fotos zu zweit — Kombination vs. Reihenfolge"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Immer zwei der vier Freunde — Ali, Jana, Tobi und Pia — sollen zusammen auf ein Foto. Wie viele verschiedene Fotos können entstehen?

(Hinweis: Ali+Jana ist das gleiche Foto wie Jana+Ali — die Reihenfolge spielt keine Rolle.)

### Lösung
6 verschiedene Fotos.

Ali+Jana, Ali+Tobi, Ali+Pia, Jana+Tobi, Jana+Pia, Tobi+Pia

### Lösungsweg
Systematisch alle Paare aufschreiben — dabei Doppelungen vermeiden:

| | Jana | Tobi | Pia |
|-----|------|------|-----|
| Ali | Ali+Jana | Ali+Tobi | Ali+Pia |
| Jana | — | Jana+Tobi | Jana+Pia |
| Tobi | — | — | Tobi+Pia |

6 Paare insgesamt.

Oder: Ali hat 3 Partner (Jana, Tobi, Pia). Jana hat noch 2 neue Partner (Tobi, Pia). Tobi hat noch 1 neuen Partner (Pia).
3 + 2 + 1 = 6

### Tipp 1 (Denkanstoß)
Geh systematisch vor: Beginne mit Ali. Mit wem kann Ali zusammen aufs Foto? Dann nimm Jana — mit wem war sie noch nicht auf einem Foto?

### Tipp 2 (Methode)
Mache eine Tabelle: Schreibe alle Namen als Zeilen und Spalten. Kreuze jedes Paar an — aber nur einmal! (Wenn Ali+Jana schon da ist, brauchst du Jana+Ali nicht nochmal.)

### Tipp 3 (Schritt-für-Schritt)
Ali kann mit 3 Kindern fotografiert werden: Jana, Tobi, Pia → 3 Fotos.
Jana war schon mit Ali. Sie kann noch mit Tobi und Pia → 2 neue Fotos.
Tobi war schon mit Ali und Jana. Er kann noch mit Pia → 1 neues Foto.
Zusammen: 3 + 2 + 1 = ?

### Didaktischer Hinweis
Hier geht es um Kombinationen (ohne Reihenfolge), im Gegensatz zu Aufgabe 1 (Permutationen). Der Unterschied muss nicht begrifflich benannt werden, aber das Kind soll erkennen: "Ali+Jana ist das Gleiche wie Jana+Ali." Die Tabelle ist ein starkes visuelles Hilfsmittel gegen Doppelzählungen.

---

## Aufgabe 3

---
titel: "Zahlenschloss — Ziffernkombinationen finden"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: grün
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Lara hat die Ziffernkombination für ihr Zahlenschloss vergessen. Sie weiß noch, dass die Ziffern 2, 5 und 8 darin vorkommen. Jede Ziffer kommt genau einmal vor.

a) Wie viele Kombinationen muss Lara höchstens ausprobieren?
b) Schreibe alle Möglichkeiten auf.

### Lösung
a) 6

b)
258, 285, 528, 582, 825, 852

### Lösungsweg
Baumdiagramm:
```
     ┌── 5 ── 8  → 258
2 ───┤
     └── 8 ── 5  → 285

     ┌── 2 ── 8  → 528
5 ───┤
     └── 8 ── 2  → 582

     ┌── 2 ── 5  → 825
8 ───┤
     └── 5 ── 2  → 852
```
3 × 2 × 1 = 6

### Tipp 1 (Denkanstoß)
Welche Ziffer könnte an der ersten Stelle stehen? Das sind 3 Möglichkeiten. Dann bleiben für die zweite Stelle nur noch 2 Ziffern übrig ...

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm mit 3 Startästen (für die erste Ziffer). Von jedem Ast gehen 2 Äste ab (zweite Ziffer). Am Ende steht die letzte Ziffer fest.

### Tipp 3 (Schritt-für-Schritt)
Wenn die 2 vorne steht: _ _ _ → 2 _ _. Für die zweite Stelle bleiben 5 und 8: 258 und 285.
Wenn die 5 vorne steht: 5 _ _. Was sind die Möglichkeiten?

### Didaktischer Hinweis
Gleiche Struktur wie Aufgabe 1, aber mit Ziffern statt Personen. Das Baumdiagramm ist identisch — Kinder erkennen das Muster. Der Alltagsbezug (Zahlenschloss) macht die Aufgabe spannend. "Höchstens" ist wichtig: Im besten Fall trifft man beim ersten Versuch.

---

## Aufgabe 4

---
titel: "Vierstelliger Code — Erste Ziffer bekannt"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: grün
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Max hat den Code für sein Zahlenschloss vergessen. Er weiß noch, dass der Code mit 5 beginnt. Die übrigen Ziffern sind 1, 3 und 9 (jede genau einmal).

Wie viele Möglichkeiten gibt es für den Code? Schreibe alle auf.

### Lösung
6 Möglichkeiten:
5139, 5193, 5319, 5391, 5913, 5931

### Lösungsweg
Die erste Ziffer steht fest (5). Für die restlichen drei Stellen gibt es:
3 × 2 × 1 = 6 Möglichkeiten.

Baumdiagramm (nur die Stellen 2-4):
```
     ┌── 3 ── 9  → 5139
1 ───┤
     └── 9 ── 3  → 5193

     ┌── 1 ── 9  → 5319
3 ───┤
     └── 9 ── 1  → 5391

     ┌── 1 ── 3  → 5913
9 ───┤
     └── 3 ── 1  → 5931
```

### Tipp 1 (Denkanstoß)
Die erste Ziffer ist die 5 — die ist fix. Jetzt musst du nur noch die drei übrigen Ziffern (1, 3, 9) anordnen. Wie viele Möglichkeiten gibt es dafür?

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm für die Stellen 2, 3 und 4. Beginne mit den 3 Möglichkeiten für Stelle 2. Von dort aus verzweige für Stelle 3 und 4.

### Tipp 3 (Schritt-für-Schritt)
Wenn nach der 5 die 1 kommt: 51_ _. Es bleiben 3 und 9 → 5139 und 5193.
Wenn nach der 5 die 3 kommt: 53_ _. Es bleiben 1 und 9 → zwei Möglichkeiten.
Und wenn die 9 kommt?

### Didaktischer Hinweis
Eine fixierte erste Stelle reduziert das Problem auf 3 × 2 × 1. Kinder erkennen: Weniger freie Stellen → weniger Möglichkeiten. Das ist ein wichtiger Baustein für das kombinatorische Denken.

---

## Aufgabe 5

---
titel: "Fussballturnier — Spiele in einer Gruppe zählen"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: grün
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Bei einem Fussballturnier gibt es eine Gruppe mit 4 Mannschaften: A, B, C, D. Jede Mannschaft spielt einmal gegen jede andere.

a) Wie viele Spiele gibt es insgesamt?
b) Schreibe alle Spiele auf.

### Lösung
a) 6

b)
A–B, A–C, A–D, B–C, B–D, C–D

### Lösungsweg
Systematisch alle Paarungen aufschreiben (A gegen B ist dasselbe wie B gegen A):

Team A spielt gegen: B, C, D → 3 Spiele
Team B spielt noch gegen: C, D → 2 neue Spiele
Team C spielt noch gegen: D → 1 neues Spiel
3 + 2 + 1 = 6

Oder als Tabelle:
| | B | C | D |
|---|---|---|---|
| A | A–B | A–C | A–D |
| B | — | B–C | B–D |
| C | — | — | C–D |

### Tipp 1 (Denkanstoß)
Geh der Reihe nach: Gegen wen spielt Team A? Dann: Gegen wen spielt Team B — aber ohne die Spiele, die schon gezählt sind?

### Tipp 2 (Methode)
Mache eine Tabelle mit allen Teams als Zeilen und Spalten. Kreuze jedes Spiel an — aber nur einmal! (A gegen B = B gegen A, das zählt nur als 1 Spiel.)

### Tipp 3 (Schritt-für-Schritt)
Team A: 3 Spiele (gegen B, C, D).
Team B: nur noch 2 neue Spiele (gegen C, D) — gegen A wurde schon gezählt.
Team C: noch 1 neues Spiel (gegen D).
Zusammen: 3 + 2 + 1 = ?

### Didaktischer Hinweis
Identische Struktur wie Aufgabe 2 (Fotos zu zweit), aber im Fussball-Kontext. Kinder erkennen hoffentlich das Muster: 3 + 2 + 1 = 6 kommt wieder! Der Sportkontext ist besonders motivierend für viele Kinder.

---

## Aufgabe 6

---
titel: "Zwei Gruppen — Gesamtanzahl der Spiele"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: orange
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Bei einem Fussballturnier gibt es zwei Gruppen mit je 3 Mannschaften.

**Gruppe A:** Löwen, Tiger, Bären
**Gruppe B:** Adler, Falken, Eulen

In jeder Gruppe spielt jede Mannschaft einmal gegen jede andere.

a) Wie viele Spiele gibt es in Gruppe A?
b) Wie viele Spiele gibt es in Gruppe B?
c) Wie viele Spiele gibt es insgesamt in beiden Gruppen?
d) Wenn jedes Spiel 15 Minuten dauert — wie lang ist die gesamte Spielzeit?

### Lösung
a) 3 Spiele
b) 3 Spiele
c) 6 Spiele
d) 90 Minuten = 1 Stunde 30 Minuten

### Lösungsweg
a) Gruppe A: Löwen–Tiger, Löwen–Bären, Tiger–Bären = 3 Spiele
   (2 + 1 = 3)
b) Gruppe B: gleiche Rechnung = 3 Spiele
c) 3 + 3 = 6 Spiele
d) 6 × 15 = 90 Minuten = 1 h 30 min

### Tipp 1 (Denkanstoß)
Wie viele Spiele gibt es in einer Gruppe mit 3 Teams? Zähle systematisch (wie bei den Fotos): Team 1 hat 2 Gegner, Team 2 hat noch 1 neuen Gegner ...

### Tipp 2 (Methode)
3 Teams in einer Gruppe: 2 + 1 = 3 Spiele. Das gilt für beide Gruppen! Für die Gesamtspielzeit: Anzahl Spiele × Spieldauer.

### Tipp 3 (Schritt-für-Schritt)
Gruppe A: Löwen–Tiger, Löwen–Bären → 2 Spiele für die Löwen. Tiger–Bären → 1 weiteres Spiel. Zusammen: 3 Spiele.
Bei d): 6 Spiele × 15 Minuten. Rechne: 6 × 15 = 6 × 10 + 6 × 5 = 60 + 30 = ?

### Didaktischer Hinweis
Aufbau auf Aufgabe 5: Jetzt zwei Gruppen, die unabhängig voneinander gespielt werden. Teil d) verbindet Kombinatorik mit Zeitrechnung. Die Umwandlung 90 min = 1 h 30 min ist ein zusätzliches Lernziel.

---

## Aufgabe 7

---
titel: "Vierstellige Zahlen aus Ziffernkarten bilden"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: orange
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
Du hast die Ziffernkarten 2, 4, 6 und 8. Jede Karte darf nur einmal verwendet werden.

a) Wie viele verschiedene vierstellige Zahlen kannst du bilden?
b) Welches ist die kleinste Zahl? Welches die größte?

### Lösung
a) 24

b) Kleinste: 2.468, Größte: 8.642

### Lösungsweg
a) 4 Möglichkeiten für die erste Stelle × 3 für die zweite × 2 für die dritte × 1 für die letzte = 4 × 3 × 2 × 1 = 24

b) Für die kleinste Zahl: kleinste Ziffer nach vorne → 2.468
   Für die größte Zahl: größte Ziffer nach vorne → 8.642

### Tipp 1 (Denkanstoß)
Für die Tausenderstelle hast du 4 Karten zur Auswahl. Nachdem du eine gelegt hast, bleiben noch 3 für die Hunderterstelle. Wie geht es weiter?

### Tipp 2 (Methode)
Stelle dir ein Baumdiagramm vor — es wäre sehr groß! Stattdessen rechne:
Platz 1: 4 Möglichkeiten
Platz 2: 3 Möglichkeiten (eine Karte ist schon vergeben)
Platz 3: 2 Möglichkeiten
Platz 4: 1 Möglichkeit
Multipliziere alle miteinander.

### Tipp 3 (Schritt-für-Schritt)
Wenn die 2 vorne steht, gibt es 3 × 2 × 1 = 6 Zahlen (wie beim Zahlenschloss!).
Das gilt auch für die 4, die 6 und die 8 vorne.
Also: 4 × 6 = ?

b) Für die kleinste Zahl: Lege die Karten von klein nach groß: 2, 4, 6, 8 → ?

### Didaktischer Hinweis
Erweiterung auf 4 Elemente. Das Baumdiagramm wäre mit 24 Enden sehr groß — hier lernen Kinder, mit der Multiplikationsregel zu rechnen statt alle aufzuzählen. Teil b) fördert das Stellenwertverständnis: Die größte Ziffer an der höchsten Stelle ergibt die größte Zahl.

---

## Aufgabe 8

---
titel: "Eissorten kombinieren — Baumdiagramm"
typ: textaufgabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
tipp_2_bild: "assets/erklaerungen/s72-begriffe-kombinatorik.webp"
---

### Aufgabenstellung
In der Eisdiele gibt es 3 Sorten Eis: Vanille (V), Schoko (S) und Erdbeere (E). Du darfst 2 verschiedene Kugeln wählen.

Wie viele verschiedene Kombinationen gibt es?
(Hinweis: Vanille+Schoko ist dasselbe wie Schoko+Vanille.)

### Lösung
3 Kombinationen: V+S, V+E, S+E

### Lösungsweg
Systematisch alle Paare:
- Vanille + Schoko
- Vanille + Erdbeere
- Schoko + Erdbeere

Das sind 3 verschiedene Becher.

Tabelle:
| | S | E |
|---|---|---|
| V | V+S | V+E |
| S | — | S+E |

2 + 1 = 3

### Tipp 1 (Denkanstoß)
Wie viele Partner hat Vanille? (2: Schoko und Erdbeere). Wie viele neue Partner hat Schoko? (1: Erdbeere — mit Vanille wurde schon gezählt.)

### Tipp 2 (Methode)
Schreibe alle Sorten untereinander. Kombiniere die erste mit allen folgenden. Dann die zweite mit allen folgenden (aber nicht mehr mit der ersten!).

### Tipp 3 (Schritt-für-Schritt)
Vanille kann mit Schoko oder Erdbeere kombiniert werden → 2 Möglichkeiten.
Schoko kann noch mit Erdbeere kombiniert werden → 1 neue Möglichkeit.
Zusammen: 2 + 1 = ?

### Didaktischer Hinweis
Einfacher Einstieg in Kombinationen über einen motivierenden Alltagskontext. Nur 3 Elemente, nur Paare — das ist überschaubar. Die Tabelle als visuelles Hilfsmittel verhindert Doppelzählungen.

---

# Thema 2: Alles Zufall? (S. 74-75)

## Aufgabe 9

---
titel: "Augensummen mit zwei Würfeln"
typ: eingabe
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit zwei Würfeln und addierst die Augenzahlen.

a) Welche Augensumme ist die kleinste mögliche?
b) Welche ist die größte mögliche?
c) Ist die Augensumme 1 möglich? Begründe.

### Lösung
a) 2 (1 + 1)
b) 12 (6 + 6)
c) Nein, die Augensumme 1 ist unmöglich. Der kleinste Wert pro Würfel ist 1, also ist die kleinste Summe 1 + 1 = 2.

### Lösungsweg
- Kleinste Augenzahl pro Würfel: 1
- Größte Augenzahl pro Würfel: 6
- Kleinste Summe: 1 + 1 = 2
- Größte Summe: 6 + 6 = 12
- Mögliche Summen: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

### Tipp 1 (Denkanstoß)
Stell dir die zwei Würfel vor. Welche ist die kleinste Zahl, die ein Würfel zeigen kann? Und die größte?

### Tipp 2 (Methode)
Für die kleinste Summe: Beide Würfel zeigen die kleinste Zahl.
Für die größte Summe: Beide zeigen die größte Zahl.
Für c): Kann die Summe von zwei positiven Zahlen kleiner als 2 sein?

### Tipp 3 (Schritt-für-Schritt)
a) Kleinste Augenzahl: 1. Zwei Würfel: 1 + 1 = ?
b) Größte Augenzahl: 6. Zwei Würfel: 6 + 6 = ?

### Didaktischer Hinweis
Grundlagen der Wahrscheinlichkeit: den Ergebnisraum bestimmen. Kinder müssen verstehen, dass mit zwei Würfeln Summen von 2 bis 12 möglich sind — nicht von 1 bis 12. Das ist eine häufige Fehlvorstellung.

---

## Aufgabe 10

---
titel: "Möglichkeiten für Augensummen zählen"
typ: textaufgabe
thema: "Alles Zufall?"
schwierigkeit: grün
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit zwei Würfeln. Untersuche, wie viele Möglichkeiten es für jede Augensumme gibt.

Fülle die Tabelle aus:

| Augensumme | 2 | 3 | 4 | 5 | 6 | 7 |
|------------|---|---|---|---|---|---|
| Möglichkeiten | ? | ? | ? | ? | ? | ? |

### Lösung
| Augensumme | 2 | 3 | 4 | 5 | 6 | 7 |
|------------|---|---|---|---|---|---|
| Möglichkeiten | 1 | 2 | 3 | 4 | 5 | 6 |

### Lösungsweg
Alle Würfelkombinationen für jede Summe:
- **2:** (1,1) → 1 Möglichkeit
- **3:** (1,2), (2,1) → 2 Möglichkeiten
- **4:** (1,3), (2,2), (3,1) → 3 Möglichkeiten
- **5:** (1,4), (2,3), (3,2), (4,1) → 4 Möglichkeiten
- **6:** (1,5), (2,4), (3,3), (4,2), (5,1) → 5 Möglichkeiten
- **7:** (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 Möglichkeiten

### Tipp 1 (Denkanstoß)
Für die Augensumme 3: Welche Zahlen kann der erste Würfel zeigen, damit die Summe 3 wird? Überlege für jede Möglichkeit, was der zweite Würfel zeigen muss.

### Tipp 2 (Methode)
Mache eine Tabelle: Würfel 1 in die Zeilen (1-6), Würfel 2 in die Spalten (1-6). Berechne jede Summe. Zähle dann, wie oft jede Summe vorkommt.

| | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 2 | 3 | 4 | ... | ... | ... | ... |

### Tipp 3 (Schritt-für-Schritt)
Augensumme 4: Der erste Würfel zeigt 1 → zweiter muss 3 zeigen (1+3=4). Erster zeigt 2 → zweiter zeigt 2 (2+2=4). Erster zeigt 3 → zweiter zeigt ? (3+?=4). Das sind 3 Möglichkeiten.

### Didaktischer Hinweis
Die systematische Tabelle aller 36 Kombinationen ist das zentrale Werkzeug. Kinder entdecken das Muster: Die 7 hat die meisten Möglichkeiten (6), die 2 und 12 die wenigsten (je 1). Das erklärt, warum manche Summen häufiger gewürfelt werden als andere — ein Aha-Erlebnis!

---

## Aufgabe 11

---
titel: "Sicher, möglich oder unmöglich?"
typ: zuordnung
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit zwei Würfeln und addierst die Augenzahlen. Ordne jeder Aussage zu: sicher, möglich oder unmöglich.

a) Die Augensumme ist größer als 1.
b) Die Augensumme ist 7.
c) Die Augensumme ist 13.
d) Die Augensumme ist eine gerade Zahl.
e) Die Augensumme ist kleiner als 13.

A) sicher
B) möglich
C) unmöglich

### Lösung
a) → A
b) → B
c) → C
d) → B
e) → A
e) sicher (größte Summe ist 12, also immer kleiner als 13)

### Lösungsweg
Man prüeft jede Aussage gegen den Ergebnisraum (Summen von 2 bis 12):
- **sicher:** trifft auf ALLE möglichen Ergebnisse zu
- **möglich:** trifft auf EINIGE, aber nicht alle zu
- **unmöglich:** trifft auf KEIN mögliches Ergebnis zu

### Tipp 1 (Denkanstoß)
Erinnere dich: Die kleinste Augensumme ist 2, die größte ist 12. Prüfe jede Aussage: Passiert das immer? Manchmal? Oder nie?

### Tipp 2 (Methode)
Drei Fragen für jede Aussage:
1. Kann es passieren? → Wenn nein: unmöglich
2. Passiert es immer? → Wenn ja: sicher
3. Passiert es manchmal? → Wenn ja: möglich

### Tipp 3 (Schritt-für-Schritt)
a) "Größer als 1" — die kleinste Summe ist 2. Ist 2 > 1? Ja! Dann gilt das immer → sicher.
c) "Ist 13" — die größte Summe ist 12. Kann 13 vorkommen? Nein → unmöglich.
d) Gerade Summen: 2, 4, 6, 8, 10, 12 — die gibt es. Aber auch ungerade: 3, 5, 7 ... → nicht immer gerade → ?

### Didaktischer Hinweis
Die Dreigliederung sicher/möglich/unmöglich ist der Kern der Wahrscheinlichkeitslehre in der Grundschule. Keine Brüche oder Prozente — nur qualitative Einschätzung. Besonders d) und e) erfordern sorgfältiges Nachdenken.

---

## Aufgabe 12

---
titel: "Sicher, möglich oder unmöglich — drei Würfel"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: grün
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit **drei** Würfeln und addierst die Augenzahlen. Entscheide: sicher, möglich oder unmöglich?

a) Die Augensumme ist größer als 2.
b) Die Augensumme ist 10.
c) Die Augensumme ist 2.
d) Die Augensumme ist kleiner als 19.

### Lösung
a) sicher (kleinste Summe: 1+1+1=3, also immer größer als 2)
b) möglich (z.B. 3+3+4=10)
c) unmöglich (kleinste Summe: 3)
d) sicher (größte Summe: 18, also immer kleiner als 19)

### Lösungsweg
Ergebnisraum bei drei Würfeln:
- Kleinste Summe: 1+1+1 = 3
- Größte Summe: 6+6+6 = 18
- Mögliche Summen: 3 bis 18

### Tipp 1 (Denkanstoß)
Drei Würfel: Was ist die kleinste Zahl, die alle drei zusammen zeigen können? Und die größte?

### Tipp 2 (Methode)
Bestimme zuerst den Bereich: kleinste Summe = 3 × 1 = 3, größte = 3 × 6 = 18. Dann prüfe jede Aussage wie vorher: sicher, möglich oder unmöglich.

### Tipp 3 (Schritt-für-Schritt)
c) Augensumme 2: Dafür müssten zwei Würfel 1 zeigen und einer 0. Aber ein Würfel hat keine 0! Also 1+1+0 geht nicht. Minimum ist 1+1+1 = ?

### Didaktischer Hinweis
Erweiterung auf drei Würfel: Der Ergebnisraum verschiebt sich (3 bis 18 statt 2 bis 12). Kinder transferieren die Methode aus Aufgabe 11. Besonders c) ist lehrreich: Die Summe 2 ist mit drei Würfeln unmöglich, obwohl sie mit zwei Würfeln noch möglich war.

---

## Aufgabe 13

---
titel: "Faire und unfaire Spielregeln"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: grün
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du spielst mit zwei Würfeln. Entscheide: Welche Regel ist **fair** (gleiche Chancen für beide), welche ist **unfair**?

**Regel A:** Kind 1 bekommt einen Punkt bei gerader Augensumme. Kind 2 bei ungerader Augensumme.

**Regel B:** Kind 1 bekommt einen Punkt bei Augensumme größer als 7. Kind 2 bei Augensumme kleiner als 7. Bei Augensumme 7 bekommt keiner einen Punkt.

### Lösung
Regel A: **fair** — es gibt jeweils 18 Möglichkeiten für gerade und ungerade Summen.

Regel B: **unfair** — Augensumme > 7: 15 Möglichkeiten, Augensumme < 7: 15 Möglichkeiten. Aber bei Summe 7 (6 Möglichkeiten) bekommt keiner einen Punkt. Also ist die Regel eigentlich fair für die Punkte, aber es gibt viele Runden ohne Punkte.

Korrektur: Regel B ist **fair**, weil beide gleich viele Gewinnmöglichkeiten haben (je 15 von 36).

### Lösungsweg
Wir zählen die Möglichkeiten mit der Tabelle aller 36 Ergebnisse:

Gerade Summen (2, 4, 6, 8, 10, 12): 1+3+5+5+3+1 = 18
Ungerade Summen (3, 5, 7, 9, 11): 2+4+6+4+2 = 18
→ Regel A: 18 vs. 18 = fair ✓

Summe > 7 (8,9,10,11,12): 5+4+3+2+1 = 15
Summe < 7 (2,3,4,5,6): 1+2+3+4+5 = 15
→ Regel B: 15 vs. 15 = fair ✓

### Tipp 1 (Denkanstoß)
Um zu entscheiden, ob eine Regel fair ist, musst du zählen: Wie viele Möglichkeiten hat Kind 1? Wie viele hat Kind 2? Wenn beide gleich viel haben, ist es fair.

### Tipp 2 (Methode)
Nutze die große 6×6-Tabelle aller Würfelkombinationen. Färbe die Felder ein:
- Eine Farbe für "Kind 1 gewinnt"
- Eine andere Farbe für "Kind 2 gewinnt"
Zähle die Felder!

### Tipp 3 (Schritt-für-Schritt)
Regel A: Gerade Summen bei zwei Würfeln: 2 (1 Möglichkeit), 4 (3 Möglichkeiten), 6 (5 Möglichkeiten), 8 (5), 10 (3), 12 (1) = 1+3+5+5+3+1 = ?
Ungerade Summen: 3 (2), 5 (4), 7 (6), 9 (4), 11 (2) = 2+4+6+4+2 = ?
Gleich? → fair oder unfair?

### Didaktischer Hinweis
Fairness analysieren ist ein Kernthema der Grundschul-Wahrscheinlichkeit. Kinder müssen systematisch zählen, nicht raten. Die 6×6-Tabelle ist das zentrale Werkzeug. Überraschend: Beide Regeln sind fair! Das widerspricht oft der Intuition.

---

## Aufgabe 14

---
titel: "Gewinnchance — durch 4 oder durch 3 teilbar?"
typ: textaufgabe
thema: "Alles Zufall?"
schwierigkeit: orange
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Zwei Kinder spielen mit zwei Würfeln. Die Spielregel:

- Kind 1 bekommt einen Punkt, wenn die Augensumme durch 4 teilbar ist.
- Kind 2 bekommt einen Punkt, wenn die Augensumme durch 3 teilbar ist.

a) Welches Kind hat die größere Gewinnchance?
b) Ist das Spiel fair?

### Lösung
a) Kind 2 hat die größere Gewinnchance.
b) Nein, das Spiel ist unfair.

### Lösungsweg
Durch 4 teilbare Summen: 4, 8, 12
- 4: 3 Möglichkeiten, 8: 5 Möglichkeiten, 12: 1 Möglichkeit
- Gesamt: 3 + 5 + 1 = **9** Möglichkeiten

Durch 3 teilbare Summen: 3, 6, 9, 12
- 3: 2 Möglichkeiten, 6: 5 Möglichkeiten, 9: 4 Möglichkeiten, 12: 1 Möglichkeit
- Gesamt: 2 + 5 + 4 + 1 = **12** Möglichkeiten

Kind 2 hat 12 vs. 9 Möglichkeiten → unfair, Kind 2 gewinnt häufiger.

### Tipp 1 (Denkanstoß)
Welche Augensummen sind durch 4 teilbar? (4, 8, 12.) Welche durch 3? (3, 6, 9, 12.) Zähle für jede Summe die Möglichkeiten.

### Tipp 2 (Methode)
Nutze die Tabelle der Augensummen aus Aufgabe 10. Markiere alle Summen, die durch 4 teilbar sind (für Kind 1) und alle, die durch 3 teilbar sind (für Kind 2). Zähle jeweils.

### Tipp 3 (Schritt-für-Schritt)
Kind 1 (durch 4 teilbar):
Summe 4: (1,3), (2,2), (3,1) → 3 Möglichkeiten.
Summe 8: (2,6), (3,5), (4,4), (5,3), (6,2) → 5 Möglichkeiten.
Summe 12: (6,6) → 1 Möglichkeit.
Zusammen: 3 + 5 + 1 = 9.

Kind 2: Zähle genauso für Summen 3, 6, 9, 12. Wer hat mehr?

### Didaktischer Hinweis
Diese Aufgabe verbindet Teilbarkeit mit Wahrscheinlichkeit. Kinder müssen zwei Konzepte gleichzeitig anwenden: Teilbarkeitsregeln (aus Kap. 8) und Würfelmöglichkeiten. Das Ergebnis (unfair!) ist nicht intuitiv offensichtlich und fördert kritisches Denken.

---

## Aufgabe 15

---
titel: "Würfelprodukt — Welche Ergebniszahl gewinnt?"
typ: textaufgabe
thema: "Alles Zufall?"
schwierigkeit: orange
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du spielst mit zwei Würfeln und **multiplizierst** die Augenzahlen (statt sie zu addieren).

a) Welches ist das kleinste mögliche Ergebnis?
b) Welches das größte?
c) Welche Ergebniszahl hat die größte Chance, gewürfelt zu werden? Begründe.

### Lösung
a) 1 (1 × 1)
b) 36 (6 × 6)
c) Die 6 hat die größte Chance (4 Möglichkeiten: 1×6, 2×3, 3×2, 6×1).

### Lösungsweg
Alle Produkte in einer 6×6-Tabelle:

| × | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 3 | 4 | 5 | 6 |
| 2 | 2 | 4 | 6 | 8 | 10 | 12 |
| 3 | 3 | 6 | 9 | 12 | 15 | 18 |
| 4 | 4 | 8 | 12 | 16 | 20 | 24 |
| 5 | 5 | 10 | 15 | 20 | 25 | 30 |
| 6 | 6 | 12 | 18 | 24 | 30 | 36 |

Die 6 kommt 4-mal vor: (1,6), (2,3), (3,2), (6,1).
Die 12 kommt auch 4-mal vor: (2,6), (3,4), (4,3), (6,2).

### Tipp 1 (Denkanstoß)
Erstelle eine Tabelle: Würfel 1 (Zeilen) mal Würfel 2 (Spalten). Welches Ergebnis kommt am häufigsten vor?

### Tipp 2 (Methode)
Fülle die Multiplikationstabelle aus. Zähle dann, wie oft jede Zahl vorkommt. Die Zahl mit den meisten Vorkommen hat die größte Chance.

### Tipp 3 (Schritt-für-Schritt)
Produkt 6: Wie kann man 6 als Produkt zweier Würfelzahlen (1-6) schreiben?
1 × 6 = 6 ✓, 2 × 3 = 6 ✓, 3 × 2 = 6 ✓, 6 × 1 = 6 ✓. Das sind 4 Möglichkeiten.
Prüfe: Hat eine andere Zahl mehr als 4 Möglichkeiten?

### Didaktischer Hinweis
Eine kreative Variation des Würfelspiels: Multiplikation statt Addition. Die Produkttabelle ist gleichzeitig Einmaleins-Übung! Das Ergebnis überrascht: Die häufigsten Produkte (6 und 12 mit je 4) sind nicht die mittleren Zahlen. Die Struktur ist völlig anders als bei der Addition.

---

## Aufgabe 16

---
titel: "Alltagsaussagen — sicher, möglich, unmöglich"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Entscheide: Ist die Aussage **sicher**, **möglich** oder **unmöglich**?

a) Es schneit im Juli in Deutschland.
b) Nach Mittwoch kommt Donnerstag.
c) Du wirfst einen Stein hoch und er fällt wieder herunter.
d) Morgen scheint den ganzen Tag die Sonne.
e) Ein Hund kann fliegen.

### Lösung
a) möglich (sehr unwahrscheinlich, aber in den Bergen theoretisch denkbar)
b) sicher (die Reihenfolge der Wochentage ist festgelegt)
c) sicher (die Schwerkraft wirkt immer)
d) möglich (das Wetter kann man nicht sicher vorhersagen)
e) unmöglich (Hunde haben keine Flügel und können nicht fliegen)

### Lösungsweg
Bei jeder Aussage fragen:
- Kann es NIEMALS passieren? → unmöglich
- Passiert es IMMER? → sicher
- Kann es passieren, muss aber nicht? → möglich

### Tipp 1 (Denkanstoß)
Stell dir jede Situation bildlich vor. Passiert das jedes Mal so? Oder nur manchmal? Oder nie?

### Tipp 2 (Methode)
Drei Fragen nacheinander:
1. Ist es unmöglich? → Wenn ja: unmöglich.
2. Ist es sicher (passiert es 100% immer)? → Wenn ja: sicher.
3. Alles andere: möglich.

### Tipp 3 (Schritt-für-Schritt)
b) Welcher Tag kommt nach Mittwoch? Immer Donnerstag? Ja! → sicher.
e) Kannst du dir einen fliegenden Hund vorstellen (ohne Flugzeug)? Nein → unmöglich.
d) Ist es garantiert, dass morgen die Sonne scheint? → ?

### Didaktischer Hinweis
Alltagsbezogene Aussagen sind der beste Einstieg in die Wahrscheinlichkeitslehre. Kinder lernen die drei Grundbegriffe an Beispielen aus ihrer Lebenswelt. Wichtig: "möglich, aber unwahrscheinlich" (wie Schnee im Juli) ist trotzdem "möglich" — das unterscheidet Grundschul-Wahrscheinlichkeit von exakter Stochastik.

---

# Thema 3: Buchstaben zählen (S. 76-77)

## Aufgabe 17

---
titel: "Häufige und seltene Buchstaben — Vermutung"
typ: auswahl
thema: "Buchstaben zählen"
schwierigkeit: gelb
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Ali und Jette spielen "Buchstabenvogel" (wie Galgenmännchen). Welche drei Buchstaben würdest du **zuerst** raten? Welche drei Buchstaben würdest du auf **keinen Fall** zuerst raten?

Wähle aus:
Zuerst raten: E, N, I, S, R, A, T
Auf keinen Fall: X, Y, Q, J, C

### Lösung
Zuerst raten (z.B.): E, N, S (häufigste Buchstaben im Deutschen)
Auf keinen Fall (z.B.): X, Y, Q (seltenste Buchstaben)

### Lösungsweg
Im Deutschen kommen manche Buchstaben viel häufiger vor als andere:
- Sehr häufig: E, N, I, S, R, A, T
- Sehr selten: Q, X, Y, J, C

Der häufigste Buchstabe ist das E — es kommt in fast jedem Wort vor!

### Tipp 1 (Denkanstoß)
Denke an Wörter, die du kennst: "Schule", "Hase", "Katze", "Sonne". Welcher Buchstabe kommt in besonders vielen Wörtern vor?

### Tipp 2 (Methode)
Überlege: Welche Buchstaben brauchst du fast nie, wenn du schreibst? Das sind die seltenen. Welche brauchst du ständig? Das sind die häufigen.

### Tipp 3 (Schritt-für-Schritt)
Der Buchstabe E kommt in diesen Wörtern vor: Heft, Lesen, Rechnen, Schreiber. Fallen dir Wörter OHNE E ein? Das ist schwer! Also ist E ein guter erster Tipp.

### Didaktischer Hinweis
Intuitiver Einstieg in die Häufigkeitsanalyse. Kinder nutzen ihr Sprachgefühl, bevor sie zählen. Das Spiel "Buchstabenvogel" motiviert und schafft einen natürlichen Anlass, über Buchstabenhäufigkeiten nachzudenken.

---

## Aufgabe 18

---
titel: "Buchstaben in einem Satz zählen"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: gelb
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Zähle, wie oft jeder Buchstabe in diesem Satz vorkommt:

**"Der Hund spielt gerne im Garten."**

Trage die Ergebnisse in eine Strichliste ein für die Buchstaben: D, E, R, N, I, G, S, T.

### Lösung
| Buchstabe | Strichliste | Anzahl |
|-----------|-------------|--------|
| D | II | 2 |
| E | IIII | 4 |
| R | III | 3 |
| N | III | 3 |
| I | II | 2 |
| G | II | 2 |
| S | I | 1 |
| T | II | 2 |

### Lösungsweg
Satz in Großbuchstaben: D E R H U N D S P I E L T G E R N E I M G A R T E N

Buchstabe für Buchstabe zählen:
- D: D...D → 2
- E: E...E...E...E → 4
- R: R...R...R → 3
- N: N...N...N → 3
- I: I...I → 2
- G: G...G → 2
- S: S → 1
- T: T...T → 2

### Tipp 1 (Denkanstoß)
Gehe den Satz Buchstabe für Buchstabe durch. Mache für jeden gesuchten Buchstaben einen Strich in der Tabelle.

### Tipp 2 (Methode)
Am besten: Nimm dir einen Buchstaben vor und gehe den ganzen Satz durch. Mache einen Strich für jedes Vorkommen. Dann den nächsten Buchstaben.

Strichliste: IIII = 4, IIII I = 5 usw.

### Tipp 3 (Schritt-für-Schritt)
Fang mit E an: "D**e**r Hund spi**e**lt g**e**rn**e** im Gart**e**n." Zähle: 1...2...3...4... Stimmt das? Dann nimm dir R vor.

Achtung: Schau genau — das E in "spielt" und das E in "gerne" nicht vergessen!

### Didaktischer Hinweis
Strichlisten sind das einfachste Werkzeug der Datenerhebung. Die Aufgabe trainiert Konzentration und Systematik. Typische Fehlerquelle: Buchstaben übersehen oder doppelt zählen. Die Methode "ein Buchstabe pro Durchgang" ist zuverlässiger.

---

## Aufgabe 19

---
titel: "Buchstaben in einem kurzen Text zählen"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Untersuche diesen kurzen Text. Zähle, wie oft jeder Buchstabe vorkommt. Notiere die fünf häufigsten Buchstaben.

**"Fredo rechnet gerne mit großen Zahlen. Er findet Mathe toll."**

### Lösung
Vollständige Zählung (ohne Leerzeichen und Satzzeichen):

| Buchstabe | Anzahl |
|-----------|--------|
| E | 8 |
| N | 5 |
| R | 5 |
| T | 5 |
| I | 3 |
| S | 3 |
| G | 2 |
| D | 2 |
| O | 2 |
| L | 2 |
| H | 2 |
| A | 2 |
| M | 2 |
| F | 2 |
| Z | 1 |
| C | 1 |

Die fünf häufigsten: E (8), N (5), R (5), T (5), I oder S (3)

### Lösungsweg
Den Text systematisch durchgehen und jeden Buchstaben mit Strichen zählen. Dann sortieren nach Häufigkeit.

### Tipp 1 (Denkanstoß)
Geh den Text Buchstabe für Buchstabe durch. Welchen Buchstaben siehst du am öftesten? Tipp: Es ist ein Vokal!

### Tipp 2 (Methode)
Erstelle eine Strichliste für alle vorkommenden Buchstaben. Am Ende sortierst du nach Häufigkeit (der mit den meisten Strichen steht oben).

### Tipp 3 (Schritt-für-Schritt)
Färbe zuerst alle E im Text ein: "Fr**e**do r**e**chn**e**t g**e**rn**e** mit groß**e**n Zahl**e**n. **E**r find**e**t Math**e** toll."
Zähle: 1, 2, 3, 4, 5, 6, 7, ... Wie viele E findest du?

### Didaktischer Hinweis
Längerer Text = mehr Daten = zuverlässigeres Ergebnis. Kinder entdecken: Das E ist tatsächlich der häufigste Buchstabe! Das bestätigt die Vermutung aus Aufgabe 17. Der Übergang von Strichliste zur Rangfolge ist ein wichtiger Schritt in der Datenauswertung.

---

## Aufgabe 20

---
titel: "Säulendiagramm aus Buchstabenhäufigkeiten erstellen"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Stelle die folgenden Buchstabenhäufigkeiten in einem Säulendiagramm dar. Wähle eine Kästchenhöhe für jeweils 2 Buchstaben.

| Buchstabe | E | N | R | S | T | A | I |
|-----------|---|---|---|---|---|---|---|
| Anzahl | 12 | 8 | 6 | 6 | 10 | 4 | 5 |

a) Zeichne das Diagramm.
b) Welcher Buchstabe kommt am häufigsten vor?
c) Welche zwei Buchstaben kommen gleich oft vor?

### Lösung
b) E (12-mal)
c) R und S (je 6-mal)

a) Säulendiagramm:
```
12 |  █
10 |  █        █
 8 |  █  █     █
 6 |  █  █  █  █  █
 4 |  █  █  █  █  █  █
 2 |  █  █  █  █  █  █  █
   |  E  N  R  S  T  A  I
```

### Lösungsweg
Für jede Säule: Anzahl ÷ 2 = Kästchenhöhe.
- E: 12 ÷ 2 = 6 Kästchen
- N: 8 ÷ 2 = 4 Kästchen
- R: 6 ÷ 2 = 3 Kästchen
- S: 6 ÷ 2 = 3 Kästchen
- T: 10 ÷ 2 = 5 Kästchen
- A: 4 ÷ 2 = 2 Kästchen
- I: 5 ÷ 2 = 2,5 Kästchen (halbes Kästchen)

### Tipp 1 (Denkanstoß)
Ein Säulendiagramm zeigt Zahlen als Balken. Je größer die Zahl, desto höher der Balken. Welcher Buchstabe bekommt den höchsten Balken?

### Tipp 2 (Methode)
Zeichne für jeden Buchstaben eine Säule. 1 Kästchen = 2 Buchstaben. Also: E hat 12 Buchstaben → 12 ÷ 2 = 6 Kästchen hoch. Mache das für alle Buchstaben.

### Tipp 3 (Schritt-für-Schritt)
Fang mit E an: 12 Buchstaben ÷ 2 = 6 Kästchen. Zeichne eine Säule, die 6 Kästchen hoch ist.
Dann N: 8 ÷ 2 = 4 Kästchen.
R und S: 6 ÷ 2 = 3 Kästchen — gleich hoch!

### Didaktischer Hinweis
Säulendiagramme sind das zentrale Visualisierungswerkzeug für Häufigkeiten. Die Skalierung (1 Kästchen = 2) ist ein wichtiges Konzept: Kinder müssen teilen und ggf. mit halben Kästchen umgehen. Das Ablesen von Informationen aus dem Diagramm (b und c) trainiert die Diagrammkompetenz.

---

## Aufgabe 21

---
titel: "Diagramm ablesen — Vergleichende Aussagen"
typ: auswahl
thema: "Buchstaben zählen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Schau dir die Buchstabenhäufigkeiten an:

| Buchstabe | E | N | R | S | T | A |
|-----------|---|---|---|---|---|---|
| Anzahl | 15 | 10 | 7 | 5 | 9 | 8 |

Welche Aussage stimmt? Welche stimmt nicht?

a) E kommt am häufigsten vor.
b) S kommt häufiger vor als R.
c) N kommt doppelt so oft vor wie S.
d) A kommt seltener vor als T.
e) R und A zusammen kommen genauso oft vor wie E.

### Lösung
a) Stimmt (15 ist der höchste Wert)
b) Stimmt nicht (S=5, R=7, also R kommt häufiger vor)
c) Stimmt (N=10, S=5, und 10 = 2 × 5)
d) Stimmt (A=8, T=9, also A < T)
e) Stimmt (R+A = 7+8 = 15 = E)

### Lösungsweg
Jede Aussage einzeln prüfen:
- a) E=15, nächsthöchster N=10 → E ist am häufigsten ✓
- b) S=5, R=7 → S < R, also S kommt seltener vor, nicht häufiger ✗
- c) N=10, S=5 → 10 = 2 × 5 ✓
- d) A=8, T=9 → 8 < 9 ✓
- e) R+A = 7+8 = 15 = E ✓

### Tipp 1 (Denkanstoß)
Lies jede Aussage und schau in der Tabelle nach: Welche Zahlen brauchst du? Vergleiche sie direkt.

### Tipp 2 (Methode)
Schreibe zu jeder Aussage die Zahlen daneben:
a) E=15, ist das das Maximum?
b) S=5, R=7, ist 5 > 7?
...

### Tipp 3 (Schritt-für-Schritt)
b) S kommt 5-mal vor, R kommt 7-mal vor. 5 ist weniger als 7. Also kommt S seltener vor als R — die Aussage sagt aber "häufiger". Stimmt das?

### Didaktischer Hinweis
Daten interpretieren und Aussagen kritisch prüfen — eine Kernkompetenz der Datenanalyse. Besonders die Begriffe "häufiger als", "doppelt so oft" und "genauso oft wie" müssen verstanden werden. Die Aufgabe trainiert auch Addition und Vergleich.

---

## Aufgabe 22

---
titel: "Welche Wörter sind schwer zu erraten?"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: orange
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: voll
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Beim Spiel "Buchstabenvogel" musst du ein Wort erraten, indem du Buchstaben rätst. Falsche Buchstaben kosten einen Versuch.

Welches der folgenden Wörter wäre am **schwersten** zu erraten? Begründe deine Antwort.

a) SCHULHEFT
b) RHYTHMUS
c) ELEFANT
d) GYMNASIUM

### Lösung
b) RHYTHMUS ist am schwersten zu erraten.

### Lösungsweg
Man schaut, wie viele seltene Buchstaben im Wort stecken:
- a) SCHULHEFT: S, C, H, U, L, H, E, F, T → E und S sind häufig, leicht zu erraten
- b) RHYTHMUS: R, H, Y, T, H, M, U, S → Y ist sehr selten! Kein E!
- c) ELEFANT: E, L, E, F, A, N, T → zwei E, viele häufige Buchstaben
- d) GYMNASIUM: G, Y, M, N, A, S, I, U, M → Y ist selten, aber A, N, S, I sind häufig

RHYTHMUS hat kein E (der häufigste Buchstabe!) und enthält Y (sehr selten). Deshalb ist es am schwersten.

### Tipp 1 (Denkanstoß)
Welches Wort enthält die meisten seltenen Buchstaben? Und: Welches Wort hat keinen der Top-Buchstaben (E, N, S, R)?

### Tipp 2 (Methode)
Prüfe für jedes Wort: Enthält es E? Enthält es N? Enthält es häufige Buchstaben? Je weniger häufige Buchstaben, desto schwerer ist es zu erraten.

### Tipp 3 (Schritt-für-Schritt)
Suche in jedem Wort nach dem Buchstaben E:
- SCHULHEFT: E ist drin! → einfacher zu erraten
- RHYTHMUS: kein E! → schwerer
- ELEFANT: sogar 2 × E! → am einfachsten
Welches Wort hat also die wenigsten häufigen Buchstaben?

### Didaktischer Hinweis
Diese Aufgabe verbindet Buchstabenhäufigkeiten mit strategischem Denken. Kinder lernen, dass Wissen über Häufigkeiten einen praktischen Nutzen hat (bessere Strategie beim Buchstabenraten). Das ist angewandte Statistik auf Grundschulniveau!

---

## Aufgabe 23

---
titel: "Eigenen Text untersuchen — Buchstabenverteilung"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: orange
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: teilweise
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Untersuche diesen Zeitungstext. Zähle die Buchstaben und beantworte die Fragen.

**"Die Feuerwehr rettete gestern einen Kater vom Dach. Der Kater hatte sich erschreckt und war auf den höchsten Baum geklettert."**

a) Welcher Buchstabe kommt am häufigsten vor?
b) Welcher Buchstabe kommt am seltensten vor (aber mindestens einmal)?
c) Welche Buchstaben kommen gar nicht vor?

### Lösung
a) E (kommt am häufigsten vor, ca. 14-mal)
b) z.B. F (1-mal), W (1-mal) oder B (1-mal)
c) z.B. J, Q, X, Y, Z kommen nicht vor (variiert je nach Zählung)

### Lösungsweg
Systematisches Zählen aller Buchstaben im Text:
E: ca. 14 — mit grossem Abstand am häufigsten
R: ca. 7
T: ca. 7
N: ca. 5
...
Selten: F, W, B (je 1-mal)
Nicht vorhanden: J, Q, X, Y (oder weitere)

### Tipp 1 (Denkanstoß)
Beginne mit dem E — färbe alle E im Text ein. Dann zähle sie. Wiederhole das für andere Buchstaben, die dir auffallen.

### Tipp 2 (Methode)
Mache eine Strichliste für das gesamte Alphabet (A bis Z). Gehe den Text Buchstabe für Buchstabe durch und mache für jeden einen Strich.

### Tipp 3 (Schritt-für-Schritt)
Fang mit den Vokalen an (A, E, I, O, U) — die sind leicht zu finden. Zähle dann die häufigsten Konsonanten: R, N, S, T. Am Ende schau, welche Buchstaben des Alphabets gar keinen Strich haben.

### Didaktischer Hinweis
Längerer Text mit realistischem Inhalt. Die vollständige Auszählung ist aufwändig und trainiert Ausdauer und Systematik. Das Ergebnis (E am häufigsten, seltene Buchstaben wie Q, X, Y fehlen) bestätigt die Erkenntnisse aus den vorherigen Aufgaben. Kinder sehen: Die Muster gelten für ALLE deutschen Texte.

---

## Aufgabe 24

---
titel: "Buchstabenverteilung vergleichen — Deutsch vs. andere Sprache"
typ: textaufgabe
thema: "Buchstaben zählen"
schwierigkeit: orange
buchseite: 77
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "häufigkeitsanalyse"
digital: teilweise
erklaerung_bild: "assets/erklaerungen/s72-merkkasten-baumdiagramm.webp"
---

### Aufgabenstellung
Hier sind die fünf häufigsten Buchstaben in zwei Sprachen:

**Deutsch:** E, N, I, S, R
**Englisch:** E, T, A, O, I

a) Welcher Buchstabe ist in beiden Sprachen unter den Top 5?
b) Welcher Buchstabe ist im Deutschen häufig, aber nicht im Englischen (unter den Top 5)?
c) Warum könnte das E in beiden Sprachen der häufigste Buchstabe sein?

### Lösung
a) E und I sind in beiden Listen.
b) N, S und R sind im Deutschen unter den Top 5, aber nicht im Englischen.
c) Das E kommt in sehr vielen Wörtern vor — sowohl im Deutschen als auch im Englischen. Es wird für viele Endungen und Vorsilben gebraucht.

### Lösungsweg
Vergleich der Listen:
- Deutsch: {E, N, I, S, R}
- Englisch: {E, T, A, O, I}
- Schnittmenge (in beiden): {E, I}
- Nur Deutsch: {N, S, R}
- Nur Englisch: {T, A, O}

### Tipp 1 (Denkanstoß)
Schreibe beide Listen nebeneinander. Welche Buchstaben tauchen in BEIDEN auf?

### Tipp 2 (Methode)
Kreise die gemeinsamen Buchstaben ein. Unterstreiche die, die nur in einer Liste vorkommen.

### Tipp 3 (Schritt-für-Schritt)
Deutsch: E, N, I, S, R
Englisch: E, T, A, O, I
Prüfe: Ist E in beiden? Ja! Ist N in beiden? N ist nicht im Englischen. Ist I in beiden? ...

### Didaktischer Hinweis
Sprachvergleiche wecken Neugier und zeigen, dass Buchstabenhäufigkeiten sprachspezifisch sind. Das E als universell häufiger Buchstabe ist ein spannendes Ergebnis. Die Aufgabe lässt sich gut mit dem Deutschunterricht verknüpfen. Für mehrsprachige Kinder besonders motivierend.

---

# Thema 4: Würfelspiele — Augensummen (S. 74-75)

## Aufgabe 25

---
titel: "Augensummen mit zwei Würfeln — möglich oder unmöglich?"
typ: wahr-falsch
thema: "Würfelspiele — Augensummen"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wuerfelspiele"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit zwei Würfeln und addierst die Augenzahlen. Stimmen die folgenden Aussagen?

a) "Die Augensumme 1 ist möglich."
b) "Die Augensumme 7 ist möglich."
c) "Die Augensumme 12 ist möglich."
d) "Die Augensumme 13 ist unmöglich."

### Lösung
a) Falsch — Die kleinste Augensumme mit zwei Würfeln ist 1 + 1 = 2. Die Summe 1 ist unmöglich.
b) Richtig — Zum Beispiel 3 + 4 = 7 oder 1 + 6 = 7.
c) Richtig — 6 + 6 = 12. Das ist die größtmögliche Augensumme.
d) Richtig — Die größte Augensumme ist 6 + 6 = 12. Eine Summe von 13 ist unmöglich.

### Lösungsweg
Zwei Würfel zeigen jeweils mindestens 1 und höchstens 6.
- Kleinste Augensumme: 1 + 1 = 2
- Größte Augensumme: 6 + 6 = 12
- Mögliche Summen: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

Daraus folgt: 1 ist unmöglich (< 2), 7 ist möglich, 12 ist möglich (Maximum), 13 ist unmöglich (> 12).

### Tipp 1 (Denkanstoß)
Was ist die kleinste Zahl, die ein Würfel zeigen kann? Und wenn du zwei davon addierst? Was ist die größte?

### Tipp 2 (Methode)
Schreibe dir die Grenzen auf:
- Minimum: 1 + 1 = 2
- Maximum: 6 + 6 = 12
Jede Augensumme zwischen 2 und 12 ist möglich. Alles darunter oder darüber ist unmöglich.

### Tipp 3 (Schritt-für-Schritt)
a) Kann die Summe 1 sein? Der kleinste Wert pro Würfel ist 1. Also ist 1 + 1 = 2 das Minimum. Ist 1 kleiner als 2? Dann ist die Summe 1 ...?
b) Kann die Summe 7 sein? Zum Beispiel: 3 + ? = 7. Welche Zahl fehlt? Zeigt der Würfel diese Zahl?

### Didaktischer Hinweis
Einstiegsaufgabe, die das Grundverständnis für den Wertebereich bei zwei Würfeln sichert. Die Grenzen (Minimum 2, Maximum 12) bilden die Basis für alle weiteren Aufgaben zu Augensummen. Das Kind soll diese Grenzen selbst herleiten, nicht auswendig lernen.

---

## Aufgabe 26

---
titel: "Welche Augensumme hat die meisten Möglichkeiten?"
typ: auswahl
thema: "Würfelspiele — Augensummen"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wuerfelspiele"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Du würfelst mit zwei Würfeln und addierst die Augenzahlen. Welche Augensumme hat die meisten Möglichkeiten, gewürfelt zu werden?

a) 2
b) 7
c) 12

### Lösung
b) 7

### Lösungsweg
Zähle für jede Summe die Kombinationen:
- Augensumme 2: nur 1+1 → 1 Möglichkeit
- Augensumme 7: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 → 6 Möglichkeiten
- Augensumme 12: nur 6+6 → 1 Möglichkeit

Die 7 hat mit 6 Möglichkeiten die meisten Kombinationen aller Augensummen.

### Tipp 1 (Denkanstoß)
Überlege: Auf wie viele verschiedene Arten kann man 2 würfeln? Und auf wie viele Arten kann man 7 würfeln? Male dir die Würfel auf!

### Tipp 2 (Methode)
Schreibe für jede Summe alle Kombinationen auf. Zum Beispiel für 7: Welcher erste Würfel + welcher zweite Würfel ergibt zusammen 7?
- 1 + ? = 7
- 2 + ? = 7
- 3 + ? = 7
- ...

### Tipp 3 (Schritt-für-Schritt)
Summe 2: Nur 1+1 — das ist 1 Möglichkeit.
Summe 7: 1+6 ist eine Möglichkeit. 2+5 ist eine weitere. 3+4 auch. Aber auch 4+3, 5+2 und 6+1! Das sind zusammen ...? Möglichkeiten.

### Didaktischer Hinweis
Zentrale Erkenntnis der Wahrscheinlichkeitslehre: Nicht alle Augensummen sind gleich wahrscheinlich. Die 7 als "Champion" mit 6 Kombinationen wird oft in Spielen ausgenutzt. Das systematische Aufzählen der Kombinationen trainiert gleichzeitig kombinatorisches Denken.

---

## Aufgabe 27

---
titel: "sicher — möglich — unmöglich"
typ: zuordnung
thema: "Würfelspiele — Augensummen"
schwierigkeit: grün
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wuerfelspiele"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Ordne die folgenden Aussagen den Begriffen **sicher**, **möglich** oder **unmöglich** zu.

Beim Würfeln mit zwei Würfeln ...

| Aussage | sicher / möglich / unmöglich? |
|---------|-------------------------------|
| a) Die Augensumme ist kleiner als 13. | ? |
| b) Die Augensumme ist genau 6. | ? |
| c) Die Augensumme ist 1. | ? |
| d) Die Augensumme ist eine gerade Zahl. | ? |
| e) Die Augensumme ist größer als 1. | ? |

### Lösung
- a) Die Augensumme ist kleiner als 13. → **sicher** (Maximum ist 12, also immer kleiner als 13)
- b) Die Augensumme ist genau 6. → **möglich** (z.B. 1+5, 2+4, 3+3 — aber nicht bei jedem Wurf)
- c) Die Augensumme ist 1. → **unmöglich** (Minimum ist 1+1 = 2)
- d) Die Augensumme ist eine gerade Zahl. → **möglich** (z.B. 1+1 = 2, aber auch 1+2 = 3 ist ungerade)
- e) Die Augensumme ist größer als 1. → **sicher** (Minimum ist 2, also immer größer als 1)

### Lösungsweg
- **sicher** = tritt bei JEDEM Wurf ein, es gibt keine Ausnahme
- **möglich** = tritt manchmal ein, aber nicht immer
- **unmöglich** = kann nie eintreten, egal was man würfelt

Prüfe für jede Aussage: Gibt es einen Wurf, bei dem sie NICHT gilt? → dann ist sie nicht sicher. Gibt es einen Wurf, bei dem sie gilt? → dann ist sie nicht unmöglich.

### Tipp 1 (Denkanstoß)
Denke an die Grenzen: Die kleinste Augensumme ist 2, die größte ist 12. Welche Aussagen gelten IMMER, welche nur MANCHMAL, welche NIE?

### Tipp 2 (Methode)
Prüfe jede Aussage mit einem Gegenbeispiel:
- Kann die Aussage falsch sein? → Dann ist sie nicht "sicher".
- Kann die Aussage wahr sein? → Dann ist sie nicht "unmöglich".
- Kann sie sowohl wahr als auch falsch sein? → Dann ist sie "möglich".

### Tipp 3 (Schritt-für-Schritt)
a) Ist die Augensumme immer kleiner als 13? Die größte Summe ist 12. Ist 12 < 13? Ja! Gibt es eine Summe ≥ 13? Nein! Also ist es ...?
c) Kann die Summe 1 sein? Das Minimum ist 1+1 = 2. Ist 2 > 1? Dann ist eine Summe von 1 ...?

### Didaktischer Hinweis
Die Dreistufung sicher/möglich/unmöglich ist ein Kernbegriff der Wahrscheinlichkeitslehre in der Grundschule. Die Aufgabe verlangt, dass das Kind nicht nur einzelne Beispiele betrachtet, sondern über ALLE möglichen Würfe nachdenkt. Aussage d) ist besonders lehrreich: Gerade Summen kommen vor (2, 4, 6, ...), aber nicht immer — also "möglich", nicht "sicher".

---

## Aufgabe 28

---
titel: "Faire Gewinnregel?"
typ: auswahl
thema: "Würfelspiele — Augensummen"
schwierigkeit: grün
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wuerfelspiele"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Zwei Kinder spielen ein Würfelspiel mit zwei Würfeln. Die Regel lautet:

- **Kind A** bekommt einen Punkt, wenn die Augensumme **gerade** ist (2, 4, 6, 8, 10, 12).
- **Kind B** bekommt einen Punkt, wenn die Augensumme **ungerade** ist (3, 5, 7, 9, 11).

Ist das Spiel fair?

a) Ja, das ist fair — beide haben gleich viele Möglichkeiten.
b) Nein, gerade Summen kommen häufiger vor.
c) Nein, ungerade Summen kommen häufiger vor.

### Lösung
a) Ja, das ist fair — beide haben gleich viele Möglichkeiten.

### Lösungsweg
Von den 36 möglichen Kombinationen (6 × 6) ergeben:
- **18 Kombinationen** eine gerade Summe
- **18 Kombinationen** eine ungerade Summe

Gerade Summen: 1+1, 1+3, 1+5, 2+2, 2+4, 2+6, 3+1, 3+3, 3+5, 4+2, 4+4, 4+6, 5+1, 5+3, 5+5, 6+2, 6+4, 6+6 → 18
Ungerade Summen: 1+2, 1+4, 1+6, 2+1, 2+3, 2+5, 3+2, 3+4, 3+6, 4+1, 4+3, 4+5, 5+2, 5+4, 5+6, 6+1, 6+3, 6+5 → 18

Beide haben exakt gleich viele Möglichkeiten, also ist das Spiel fair.

### Tipp 1 (Denkanstoß)
Überlege: Wann ist eine Summe gerade? Wenn beide Würfel gerade ODER beide ungerade sind. Wann ist sie ungerade? Wenn ein Würfel gerade und der andere ungerade ist.

### Tipp 2 (Methode)
Male eine Tabelle mit allen 36 Kombinationen (6 Zeilen × 6 Spalten). Färbe gerade Summen blau und ungerade Summen rot. Zähle dann die blauen und roten Felder.

```
    1   2   3   4   5   6
1 | 2 | 3 | 4 | 5 | 6 | 7 |
2 | 3 | 4 | 5 | 6 | 7 | 8 |
3 | 4 | 5 | 6 | 7 | 8 | 9 |
4 | 5 | 6 | 7 | 8 | 9 |10 |
5 | 6 | 7 | 8 | 9 |10 |11 |
6 | 7 | 8 | 9 |10 |11 |12 |
```

### Tipp 3 (Schritt-für-Schritt)
In der Tabelle bildet sich ein Schachbrettmuster: gerade und ungerade wechseln sich ab. In einem 6×6-Schachbrett gibt es 18 helle und 18 dunkle Felder. Also gibt es 18 gerade und 18 ungerade Summen. Ist das fair?

### Didaktischer Hinweis
Fairness beurteilen ist ein zentrales Thema der Wahrscheinlichkeitslehre. Das Kind lernt, dass "fair" bedeutet: gleich viele günstige Ausgänge für beide Spieler. Die Erkenntnis, dass gerade und ungerade Summen gleich häufig sind, ist nicht offensichtlich — das Schachbrettmuster in der Tabelle macht es visuell erfahrbar.

---

## Aufgabe 29

---
titel: "Augensummen mit drei Würfeln"
typ: textaufgabe
thema: "Würfelspiele — Augensummen"
schwierigkeit: orange
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wuerfelspiele"
digital: voll
erklaerung_bild: "assets/erklaerungen/s74-merkkasten-wahrscheinlichkeit.webp"
tipp_2_bild: "assets/erklaerungen/s74-begriffe-zufall-wahrscheinlichkeit.webp"
---

### Aufgabenstellung
Jetzt würfelst du mit **drei** Würfeln und addierst alle Augenzahlen.

a) Was ist die kleinste mögliche Augensumme?
b) Was ist die größte mögliche Augensumme?
c) Welche Augensumme kommt am häufigsten vor? (Tipp: Sie liegt genau in der Mitte zwischen a und b.)

### Lösung
a) 3
b) 18
c) 10 (oder 11 — beide haben jeweils 27 Kombinationen und sind gleich häufig)

### Lösungsweg
- a) Minimum: Jeder Würfel zeigt 1 → 1 + 1 + 1 = 3
- b) Maximum: Jeder Würfel zeigt 6 → 6 + 6 + 6 = 18
- c) Die möglichen Summen reichen von 3 bis 18. Die Mitte liegt bei (3 + 18) / 2 = 10,5. Die Summen 10 und 11 haben tatsächlich beide die meisten Kombinationen (je 27 von 216 möglichen).

### Tipp 1 (Denkanstoß)
Stell dir drei Würfel vor. Was zeigen sie, wenn alle die kleinste Zahl zeigen? Und wenn alle die größte Zahl zeigen?

### Tipp 2 (Methode)
Für a): Jeder Würfel zeigt mindestens 1. Drei Würfel zeigen zusammen mindestens 1 + 1 + 1 = ?
Für b): Jeder Würfel zeigt höchstens 6. Drei Würfel zeigen zusammen höchstens 6 + 6 + 6 = ?
Für c): Die häufigste Summe liegt in der Mitte zwischen dem Minimum und Maximum.

### Tipp 3 (Schritt-für-Schritt)
a) 1 + 1 + 1 = ?
b) 6 + 6 + 6 = ?
c) Die Mitte zwischen deinen Antworten a) und b): Addiere beide und teile durch 2. (3 + 18) / 2 = ? Runde auf eine ganze Zahl — das ist die häufigste Summe!

### Didaktischer Hinweis
Transfer von zwei auf drei Würfel. Die Aufgabe baut auf den vorherigen Erkenntnissen auf und erweitert sie. Die Symmetrie der Verteilung (häufigste Summe in der Mitte) ist ein universelles Prinzip. Dass sowohl 10 als auch 11 gleich häufig vorkommen, ist eine Feinheit, die nicht erzwungen wird — die Antwort 10 oder 11 wird akzeptiert.
