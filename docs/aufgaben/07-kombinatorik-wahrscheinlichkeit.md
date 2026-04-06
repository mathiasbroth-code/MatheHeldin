# Kapitel 7: Kombinatorik · Wahrscheinlichkeit — Aufgabensammlung
Buchseiten: 72-77 | Themen: 3 | Format: [FORMAT.md](FORMAT.md)

---

# Thema 1: Wie viele Möglichkeiten? (S. 72-73)

## Aufgabe 1

---
titel: "Anordnung von drei Freunden — Baumdiagramm"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
Drei Freunde — Lena, Tom und Mia — wollen nebeneinander auf einem Foto stehen.

a) Wie viele verschiedene Reihenfolgen gibt es?
b) Zaehle alle Möglichkeiten auf.

### Lösung
a) 6 Möglichkeiten

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

Fuer den 1. Platz gibt es 3 Wahlmöglichkeiten, fuer den 2. Platz noch 2, fuer den 3. Platz nur 1.
3 × 2 × 1 = 6

### Tipp 1 (Denkanstoß)
Wer kann ganz links stehen? Es gibt 3 Möglichkeiten. Fuer jede dieser Möglichkeiten: Wer kann dann daneben stehen?

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm: Beginne mit den 3 Kindern als Aeste. Von jedem Ast gehen 2 weitere Aeste ab (die beiden uebrigen Kinder). Am Ende steht das letzte Kind fest. Zaehle die Enden!

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
Einstieg in die Kombinatorik ueber das Baumdiagramm. Drei Elemente sind ideal, weil die Anzahl (6) ueberschaubar bleibt und das Baumdiagramm auf ein Blatt passt. Das Prinzip "3 × 2 × 1" wird hier entdeckt, nicht als Formel vorgegeben.

---

## Aufgabe 2

---
titel: "Fotos zu zweit — Kombination vs. Reihenfolge"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
Immer zwei der vier Freunde — Ali, Jana, Tobi und Pia — sollen zusammen auf ein Foto. Wie viele verschiedene Fotos koennen entstehen?

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
Hier geht es um Kombinationen (ohne Reihenfolge), im Gegensatz zu Aufgabe 1 (Permutationen). Der Unterschied muss nicht begrifflich benannt werden, aber das Kind soll erkennen: "Ali+Jana ist das Gleiche wie Jana+Ali." Die Tabelle ist ein starkes visuelles Hilfsmittel gegen Doppelzaehlungen.

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
---

### Aufgabenstellung
Lara hat die Ziffernkombination fuer ihr Zahlenschloss vergessen. Sie weiss noch, dass die Ziffern 2, 5 und 8 darin vorkommen. Jede Ziffer kommt genau einmal vor.

a) Wie viele Kombinationen muss Lara hoechstens ausprobieren?
b) Schreibe alle Möglichkeiten auf.

### Lösung
a) 6 Kombinationen

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
Welche Ziffer koennte an der ersten Stelle stehen? Das sind 3 Möglichkeiten. Dann bleiben fuer die zweite Stelle nur noch 2 Ziffern uebrig ...

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm mit 3 Startaesten (fuer die erste Ziffer). Von jedem Ast gehen 2 Aeste ab (zweite Ziffer). Am Ende steht die letzte Ziffer fest.

### Tipp 3 (Schritt-für-Schritt)
Wenn die 2 vorne steht: _ _ _ → 2 _ _. Fuer die zweite Stelle bleiben 5 und 8: 258 und 285.
Wenn die 5 vorne steht: 5 _ _. Was sind die Möglichkeiten?

### Didaktischer Hinweis
Gleiche Struktur wie Aufgabe 1, aber mit Ziffern statt Personen. Das Baumdiagramm ist identisch — Kinder erkennen das Muster. Der Alltagsbezug (Zahlenschloss) macht die Aufgabe spannend. "Hoechstens" ist wichtig: Im besten Fall trifft man beim ersten Versuch.

---

## Aufgabe 4

---
titel: "Vierstelliger Code — Erste Ziffer bekannt"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: grün
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
Max hat den Code fuer sein Zahlenschloss vergessen. Er weiss noch, dass der Code mit 5 beginnt. Die uebrigen Ziffern sind 1, 3 und 9 (jede genau einmal).

Wie viele Möglichkeiten gibt es fuer den Code? Schreibe alle auf.

### Lösung
6 Möglichkeiten:
5139, 5193, 5319, 5391, 5913, 5931

### Lösungsweg
Die erste Ziffer steht fest (5). Fuer die restlichen drei Stellen gibt es:
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
Die erste Ziffer ist die 5 — die ist fix. Jetzt musst du nur noch die drei uebrigen Ziffern (1, 3, 9) anordnen. Wie viele Möglichkeiten gibt es dafuer?

### Tipp 2 (Methode)
Zeichne ein Baumdiagramm fuer die Stellen 2, 3 und 4. Beginne mit den 3 Möglichkeiten fuer Stelle 2. Von dort aus verzweige fuer Stelle 3 und 4.

### Tipp 3 (Schritt-für-Schritt)
Wenn nach der 5 die 1 kommt: 51_ _. Es bleiben 3 und 9 → 5139 und 5193.
Wenn nach der 5 die 3 kommt: 53_ _. Es bleiben 1 und 9 → zwei Möglichkeiten.
Und wenn die 9 kommt?

### Didaktischer Hinweis
Eine fixierte erste Stelle reduziert das Problem auf 3 × 2 × 1. Kinder erkennen: Weniger freie Stellen → weniger Möglichkeiten. Das ist ein wichtiger Baustein fuer das kombinatorische Denken.

---

## Aufgabe 5

---
titel: "Fussballturnier — Spiele in einer Gruppe zaehlen"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: grün
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
Bei einem Fussballturnier gibt es eine Gruppe mit 4 Mannschaften: A, B, C, D. Jede Mannschaft spielt einmal gegen jede andere.

a) Wie viele Spiele gibt es insgesamt?
b) Schreibe alle Spiele auf.

### Lösung
a) 6 Spiele

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
Geh der Reihe nach: Gegen wen spielt Team A? Dann: Gegen wen spielt Team B — aber ohne die Spiele, die schon gezaehlt sind?

### Tipp 2 (Methode)
Mache eine Tabelle mit allen Teams als Zeilen und Spalten. Kreuze jedes Spiel an — aber nur einmal! (A gegen B = B gegen A, das zaehlt nur als 1 Spiel.)

### Tipp 3 (Schritt-für-Schritt)
Team A: 3 Spiele (gegen B, C, D).
Team B: nur noch 2 neue Spiele (gegen C, D) — gegen A wurde schon gezaehlt.
Team C: noch 1 neues Spiel (gegen D).
Zusammen: 3 + 2 + 1 = ?

### Didaktischer Hinweis
Identische Struktur wie Aufgabe 2 (Fotos zu zweit), aber im Fussball-Kontext. Kinder erkennen hoffentlich das Muster: 3 + 2 + 1 = 6 kommt wieder! Der Sportkontext ist besonders motivierend fuer viele Kinder.

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
---

### Aufgabenstellung
Bei einem Fussballturnier gibt es zwei Gruppen mit je 3 Mannschaften.

**Gruppe A:** Loewen, Tiger, Baeren
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
a) Gruppe A: Loewen–Tiger, Loewen–Baeren, Tiger–Baeren = 3 Spiele
   (2 + 1 = 3)
b) Gruppe B: gleiche Rechnung = 3 Spiele
c) 3 + 3 = 6 Spiele
d) 6 × 15 = 90 Minuten = 1 h 30 min

### Tipp 1 (Denkanstoß)
Wie viele Spiele gibt es in einer Gruppe mit 3 Teams? Zaehle systematisch (wie bei den Fotos): Team 1 hat 2 Gegner, Team 2 hat noch 1 neuen Gegner ...

### Tipp 2 (Methode)
3 Teams in einer Gruppe: 2 + 1 = 3 Spiele. Das gilt fuer beide Gruppen! Fuer die Gesamtspielzeit: Anzahl Spiele × Spieldauer.

### Tipp 3 (Schritt-für-Schritt)
Gruppe A: Loewen–Tiger, Loewen–Baeren → 2 Spiele fuer die Loewen. Tiger–Baeren → 1 weiteres Spiel. Zusammen: 3 Spiele.
Bei d): 6 Spiele × 15 Minuten. Rechne: 6 × 15 = 6 × 10 + 6 × 5 = 60 + 30 = ?

### Didaktischer Hinweis
Aufbau auf Aufgabe 5: Jetzt zwei Gruppen, die unabhaengig voneinander gespielt werden. Teil d) verbindet Kombinatorik mit Zeitrechnung. Die Umwandlung 90 min = 1 h 30 min ist ein zusaetzliches Lernziel.

---

## Aufgabe 7

---
titel: "Vierstellige Zahlen aus Ziffernkarten bilden"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: orange
buchseite: 73
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
Du hast die Ziffernkarten 2, 4, 6 und 8. Jede Karte darf nur einmal verwendet werden.

a) Wie viele verschiedene vierstellige Zahlen kannst du bilden?
b) Welches ist die kleinste Zahl? Welches die groesste?

### Lösung
a) 24 verschiedene Zahlen

b) Kleinste: 2.468, Groesste: 8.642

### Lösungsweg
a) 4 Möglichkeiten fuer die erste Stelle × 3 fuer die zweite × 2 fuer die dritte × 1 fuer die letzte = 4 × 3 × 2 × 1 = 24

b) Fuer die kleinste Zahl: kleinste Ziffer nach vorne → 2.468
   Fuer die groesste Zahl: groesste Ziffer nach vorne → 8.642

### Tipp 1 (Denkanstoß)
Fuer die Tausenderstelle hast du 4 Karten zur Auswahl. Nachdem du eine gelegt hast, bleiben noch 3 fuer die Hunderterstelle. Wie geht es weiter?

### Tipp 2 (Methode)
Stelle dir ein Baumdiagramm vor — es waere sehr gross! Stattdessen rechne:
Platz 1: 4 Möglichkeiten
Platz 2: 3 Möglichkeiten (eine Karte ist schon vergeben)
Platz 3: 2 Möglichkeiten
Platz 4: 1 Möglichkeit
Multipliziere alle miteinander.

### Tipp 3 (Schritt-für-Schritt)
Wenn die 2 vorne steht, gibt es 3 × 2 × 1 = 6 Zahlen (wie beim Zahlenschloss!).
Das gilt auch fuer die 4, die 6 und die 8 vorne.
Also: 4 × 6 = ?

b) Fuer die kleinste Zahl: Lege die Karten von klein nach gross: 2, 4, 6, 8 → ?

### Didaktischer Hinweis
Erweiterung auf 4 Elemente. Das Baumdiagramm waere mit 24 Enden sehr gross — hier lernen Kinder, mit der Multiplikationsregel zu rechnen statt alle aufzuzaehlen. Teil b) foerdert das Stellenwertverstaendnis: Die groesste Ziffer an der hoechsten Stelle ergibt die groesste Zahl.

---

## Aufgabe 8

---
titel: "Eissorten kombinieren — Baumdiagramm"
typ: eingabe
thema: "Wie viele Möglichkeiten?"
schwierigkeit: gelb
buchseite: 72
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "kombinatorik"
digital: voll
---

### Aufgabenstellung
In der Eisdiele gibt es 3 Sorten Eis: Vanille (V), Schoko (S) und Erdbeere (E). Du darfst 2 verschiedene Kugeln waehlen.

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
Wie viele Partner hat Vanille? (2: Schoko und Erdbeere). Wie viele neue Partner hat Schoko? (1: Erdbeere — mit Vanille wurde schon gezaehlt.)

### Tipp 2 (Methode)
Schreibe alle Sorten untereinander. Kombiniere die erste mit allen folgenden. Dann die zweite mit allen folgenden (aber nicht mehr mit der ersten!).

### Tipp 3 (Schritt-für-Schritt)
Vanille kann mit Schoko oder Erdbeere kombiniert werden → 2 Möglichkeiten.
Schoko kann noch mit Erdbeere kombiniert werden → 1 neue Möglichkeit.
Zusammen: 2 + 1 = ?

### Didaktischer Hinweis
Einfacher Einstieg in Kombinationen ueber einen motivierenden Alltagskontext. Nur 3 Elemente, nur Paare — das ist ueberschaubar. Die Tabelle als visuelles Hilfsmittel verhindert Doppelzaehlungen.

---

# Thema 2: Alles Zufall? (S. 74-75)

## Aufgabe 9

---
titel: "Augensummen mit zwei Wuerfeln"
typ: eingabe
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Du wuerfelst mit zwei Wuerfeln und addierst die Augenzahlen.

a) Welche Augensumme ist die kleinste mögliche?
b) Welche ist die groesste mögliche?
c) Ist die Augensumme 1 moeglich? Begruende.

### Lösung
a) 2 (1 + 1)
b) 12 (6 + 6)
c) Nein, die Augensumme 1 ist unmoeglich. Der kleinste Wert pro Wuerfel ist 1, also ist die kleinste Summe 1 + 1 = 2.

### Lösungsweg
- Kleinste Augenzahl pro Wuerfel: 1
- Groesste Augenzahl pro Wuerfel: 6
- Kleinste Summe: 1 + 1 = 2
- Groesste Summe: 6 + 6 = 12
- Mögliche Summen: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

### Tipp 1 (Denkanstoß)
Stell dir die zwei Wuerfel vor. Welche ist die kleinste Zahl, die ein Wuerfel zeigen kann? Und die groesste?

### Tipp 2 (Methode)
Fuer die kleinste Summe: Beide Wuerfel zeigen die kleinste Zahl.
Fuer die groesste Summe: Beide zeigen die groesste Zahl.
Fuer c): Kann die Summe von zwei positiven Zahlen kleiner als 2 sein?

### Tipp 3 (Schritt-für-Schritt)
a) Kleinste Augenzahl: 1. Zwei Wuerfel: 1 + 1 = ?
b) Groesste Augenzahl: 6. Zwei Wuerfel: 6 + 6 = ?

### Didaktischer Hinweis
Grundlagen der Wahrscheinlichkeit: den Ergebnisraum bestimmen. Kinder muessen verstehen, dass mit zwei Wuerfeln Summen von 2 bis 12 moeglich sind — nicht von 1 bis 12. Das ist eine haeufige Fehlvorstellung.

---

## Aufgabe 10

---
titel: "Möglichkeiten fuer Augensummen zaehlen"
typ: eingabe
thema: "Alles Zufall?"
schwierigkeit: grün
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Du wuerfelst mit zwei Wuerfeln. Untersuche, wie viele Möglichkeiten es fuer jede Augensumme gibt.

Fuelle die Tabelle aus:

| Augensumme | 2 | 3 | 4 | 5 | 6 | 7 |
|------------|---|---|---|---|---|---|
| Möglichkeiten | ? | ? | ? | ? | ? | ? |

### Lösung
| Augensumme | 2 | 3 | 4 | 5 | 6 | 7 |
|------------|---|---|---|---|---|---|
| Möglichkeiten | 1 | 2 | 3 | 4 | 5 | 6 |

### Lösungsweg
Alle Wuerfelkombinationen fuer jede Summe:
- **2:** (1,1) → 1 Möglichkeit
- **3:** (1,2), (2,1) → 2 Möglichkeiten
- **4:** (1,3), (2,2), (3,1) → 3 Möglichkeiten
- **5:** (1,4), (2,3), (3,2), (4,1) → 4 Möglichkeiten
- **6:** (1,5), (2,4), (3,3), (4,2), (5,1) → 5 Möglichkeiten
- **7:** (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 Möglichkeiten

### Tipp 1 (Denkanstoß)
Fuer die Augensumme 3: Welche Zahlen kann der erste Wuerfel zeigen, damit die Summe 3 wird? Ueberlege fuer jede Möglichkeit, was der zweite Wuerfel zeigen muss.

### Tipp 2 (Methode)
Mache eine Tabelle: Wuerfel 1 in die Zeilen (1-6), Wuerfel 2 in die Spalten (1-6). Berechne jede Summe. Zaehle dann, wie oft jede Summe vorkommt.

| | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 2 | 3 | 4 | ... | ... | ... | ... |

### Tipp 3 (Schritt-für-Schritt)
Augensumme 4: Der erste Wuerfel zeigt 1 → zweiter muss 3 zeigen (1+3=4). Erster zeigt 2 → zweiter zeigt 2 (2+2=4). Erster zeigt 3 → zweiter zeigt ? (3+?=4). Das sind 3 Möglichkeiten.

### Didaktischer Hinweis
Die systematische Tabelle aller 36 Kombinationen ist das zentrale Werkzeug. Kinder entdecken das Muster: Die 7 hat die meisten Möglichkeiten (6), die 2 und 12 die wenigsten (je 1). Das erklaert, warum manche Summen haeufiger gewuerfelt werden als andere — ein Aha-Erlebnis!

---

## Aufgabe 11

---
titel: "Sicher, möglich oder unmöglich?"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Du wuerfelst mit zwei Wuerfeln und addierst die Augenzahlen. Entscheide: Ist die Aussage **sicher**, **moeglich** oder **unmoeglich**?

a) Die Augensumme ist groesser als 1.
b) Die Augensumme ist 7.
c) Die Augensumme ist 13.
d) Die Augensumme ist eine gerade Zahl.
e) Die Augensumme ist kleiner als 13.

### Lösung
a) sicher (kleinste Summe ist 2, also immer groesser als 1)
b) moeglich (z.B. 3+4=7, aber nicht bei jedem Wurf)
c) unmoeglich (groesste Summe ist 12)
d) moeglich (z.B. 2+4=6, aber nicht immer)
e) sicher (groesste Summe ist 12, also immer kleiner als 13)

### Lösungsweg
Man prueeft jede Aussage gegen den Ergebnisraum (Summen von 2 bis 12):
- **sicher:** trifft auf ALLE möglichen Ergebnisse zu
- **moeglich:** trifft auf EINIGE, aber nicht alle zu
- **unmoeglich:** trifft auf KEIN mögliches Ergebnis zu

### Tipp 1 (Denkanstoß)
Erinnere dich: Die kleinste Augensumme ist 2, die groesste ist 12. Pruefe jede Aussage: Passiert das immer? Manchmal? Oder nie?

### Tipp 2 (Methode)
Drei Fragen fuer jede Aussage:
1. Kann es passieren? → Wenn nein: unmoeglich
2. Passiert es immer? → Wenn ja: sicher
3. Passiert es manchmal? → Wenn ja: moeglich

### Tipp 3 (Schritt-für-Schritt)
a) "Groesser als 1" — die kleinste Summe ist 2. Ist 2 > 1? Ja! Dann gilt das immer → sicher.
c) "Ist 13" — die groesste Summe ist 12. Kann 13 vorkommen? Nein → unmoeglich.
d) Gerade Summen: 2, 4, 6, 8, 10, 12 — die gibt es. Aber auch ungerade: 3, 5, 7 ... → nicht immer gerade → ?

### Didaktischer Hinweis
Die Dreigliederung sicher/moeglich/unmoeglich ist der Kern der Wahrscheinlichkeitslehre in der Grundschule. Keine Brueche oder Prozente — nur qualitative Einschaetzung. Besonders d) und e) erfordern sorgfaeltiges Nachdenken.

---

## Aufgabe 12

---
titel: "Sicher, möglich oder unmöglich — drei Wuerfel"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: grün
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Du wuerfelst mit **drei** Wuerfeln und addierst die Augenzahlen. Entscheide: sicher, moeglich oder unmoeglich?

a) Die Augensumme ist groesser als 2.
b) Die Augensumme ist 10.
c) Die Augensumme ist 2.
d) Die Augensumme ist kleiner als 19.

### Lösung
a) sicher (kleinste Summe: 1+1+1=3, also immer groesser als 2)
b) moeglich (z.B. 3+3+4=10)
c) unmoeglich (kleinste Summe: 3)
d) sicher (groesste Summe: 18, also immer kleiner als 19)

### Lösungsweg
Ergebnisraum bei drei Wuerfeln:
- Kleinste Summe: 1+1+1 = 3
- Groesste Summe: 6+6+6 = 18
- Mögliche Summen: 3 bis 18

### Tipp 1 (Denkanstoß)
Drei Wuerfel: Was ist die kleinste Zahl, die alle drei zusammen zeigen koennen? Und die groesste?

### Tipp 2 (Methode)
Bestimme zuerst den Bereich: kleinste Summe = 3 × 1 = 3, groesste = 3 × 6 = 18. Dann pruefe jede Aussage wie vorher: sicher, moeglich oder unmoeglich.

### Tipp 3 (Schritt-für-Schritt)
c) Augensumme 2: Dafuer muessten zwei Wuerfel 1 zeigen und einer 0. Aber ein Wuerfel hat keine 0! Also 1+1+0 geht nicht. Minimum ist 1+1+1 = ?

### Didaktischer Hinweis
Erweiterung auf drei Wuerfel: Der Ergebnisraum verschiebt sich (3 bis 18 statt 2 bis 12). Kinder transferieren die Methode aus Aufgabe 11. Besonders c) ist lehrreich: Die Summe 2 ist mit drei Wuerfeln unmoeglich, obwohl sie mit zwei Wuerfeln noch moeglich war.

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
---

### Aufgabenstellung
Du spielst mit zwei Wuerfeln. Entscheide: Welche Regel ist **fair** (gleiche Chancen fuer beide), welche ist **unfair**?

**Regel A:** Kind 1 bekommt einen Punkt bei gerader Augensumme. Kind 2 bei ungerader Augensumme.

**Regel B:** Kind 1 bekommt einen Punkt bei Augensumme groesser als 7. Kind 2 bei Augensumme kleiner als 7. Bei Augensumme 7 bekommt keiner einen Punkt.

### Lösung
Regel A: **fair** — es gibt jeweils 18 Möglichkeiten fuer gerade und ungerade Summen.

Regel B: **unfair** — Augensumme > 7: 15 Möglichkeiten, Augensumme < 7: 15 Möglichkeiten. Aber bei Summe 7 (6 Möglichkeiten) bekommt keiner einen Punkt. Also ist die Regel eigentlich fair fuer die Punkte, aber es gibt viele Runden ohne Punkte.

Korrektur: Regel B ist **fair**, weil beide gleich viele Gewinnmöglichkeiten haben (je 15 von 36).

### Lösungsweg
Wir zaehlen die Möglichkeiten mit der Tabelle aller 36 Ergebnisse:

Gerade Summen (2, 4, 6, 8, 10, 12): 1+3+5+5+3+1 = 18
Ungerade Summen (3, 5, 7, 9, 11): 2+4+6+4+2 = 18
→ Regel A: 18 vs. 18 = fair ✓

Summe > 7 (8,9,10,11,12): 5+4+3+2+1 = 15
Summe < 7 (2,3,4,5,6): 1+2+3+4+5 = 15
→ Regel B: 15 vs. 15 = fair ✓

### Tipp 1 (Denkanstoß)
Um zu entscheiden, ob eine Regel fair ist, musst du zaehlen: Wie viele Möglichkeiten hat Kind 1? Wie viele hat Kind 2? Wenn beide gleich viel haben, ist es fair.

### Tipp 2 (Methode)
Nutze die grosse 6×6-Tabelle aller Wuerfelkombinationen. Faerbe die Felder ein:
- Eine Farbe fuer "Kind 1 gewinnt"
- Eine andere Farbe fuer "Kind 2 gewinnt"
Zaehle die Felder!

### Tipp 3 (Schritt-für-Schritt)
Regel A: Gerade Summen bei zwei Wuerfeln: 2 (1 Möglichkeit), 4 (3 Möglichkeiten), 6 (5 Möglichkeiten), 8 (5), 10 (3), 12 (1) = 1+3+5+5+3+1 = ?
Ungerade Summen: 3 (2), 5 (4), 7 (6), 9 (4), 11 (2) = 2+4+6+4+2 = ?
Gleich? → fair oder unfair?

### Didaktischer Hinweis
Fairness analysieren ist ein Kernthema der Grundschul-Wahrscheinlichkeit. Kinder muessen systematisch zaehlen, nicht raten. Die 6×6-Tabelle ist das zentrale Werkzeug. Ueberraschend: Beide Regeln sind fair! Das widerspricht oft der Intuition.

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
---

### Aufgabenstellung
Zwei Kinder spielen mit zwei Wuerfeln. Die Spielregel:

- Kind 1 bekommt einen Punkt, wenn die Augensumme durch 4 teilbar ist.
- Kind 2 bekommt einen Punkt, wenn die Augensumme durch 3 teilbar ist.

a) Welches Kind hat die groessere Gewinnchance?
b) Ist das Spiel fair?

### Lösung
a) Kind 2 hat die groessere Gewinnchance.
b) Nein, das Spiel ist unfair.

### Lösungsweg
Durch 4 teilbare Summen: 4, 8, 12
- 4: 3 Möglichkeiten, 8: 5 Möglichkeiten, 12: 1 Möglichkeit
- Gesamt: 3 + 5 + 1 = **9** Möglichkeiten

Durch 3 teilbare Summen: 3, 6, 9, 12
- 3: 2 Möglichkeiten, 6: 5 Möglichkeiten, 9: 4 Möglichkeiten, 12: 1 Möglichkeit
- Gesamt: 2 + 5 + 4 + 1 = **12** Möglichkeiten

Kind 2 hat 12 vs. 9 Möglichkeiten → unfair, Kind 2 gewinnt haeufiger.

### Tipp 1 (Denkanstoß)
Welche Augensummen sind durch 4 teilbar? (4, 8, 12.) Welche durch 3? (3, 6, 9, 12.) Zaehle fuer jede Summe die Möglichkeiten.

### Tipp 2 (Methode)
Nutze die Tabelle der Augensummen aus Aufgabe 10. Markiere alle Summen, die durch 4 teilbar sind (fuer Kind 1) und alle, die durch 3 teilbar sind (fuer Kind 2). Zaehle jeweils.

### Tipp 3 (Schritt-für-Schritt)
Kind 1 (durch 4 teilbar):
Summe 4: (1,3), (2,2), (3,1) → 3 Möglichkeiten.
Summe 8: (2,6), (3,5), (4,4), (5,3), (6,2) → 5 Möglichkeiten.
Summe 12: (6,6) → 1 Möglichkeit.
Zusammen: 3 + 5 + 1 = 9.

Kind 2: Zaehle genauso fuer Summen 3, 6, 9, 12. Wer hat mehr?

### Didaktischer Hinweis
Diese Aufgabe verbindet Teilbarkeit mit Wahrscheinlichkeit. Kinder muessen zwei Konzepte gleichzeitig anwenden: Teilbarkeitsregeln (aus Kap. 8) und Wuerfelmöglichkeiten. Das Ergebnis (unfair!) ist nicht intuitiv offensichtlich und foerdert kritisches Denken.

---

## Aufgabe 15

---
titel: "Wuerfelprodukt — Welche Ergebniszahl gewinnt?"
typ: textaufgabe
thema: "Alles Zufall?"
schwierigkeit: orange
buchseite: 74
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Du spielst mit zwei Wuerfeln und **multiplizierst** die Augenzahlen (statt sie zu addieren).

a) Welches ist das kleinste moegliche Ergebnis?
b) Welches das groesste?
c) Welche Ergebniszahl hat die groesste Chance, gewuerfelt zu werden? Begruende.

### Lösung
a) 1 (1 × 1)
b) 36 (6 × 6)
c) Die 6 hat die groesste Chance (4 Möglichkeiten: 1×6, 2×3, 3×2, 6×1).

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
Erstelle eine Tabelle: Wuerfel 1 (Zeilen) mal Wuerfel 2 (Spalten). Welches Ergebnis kommt am haeufigsten vor?

### Tipp 2 (Methode)
Fuelle die Multiplikationstabelle aus. Zaehle dann, wie oft jede Zahl vorkommt. Die Zahl mit den meisten Vorkommen hat die groesste Chance.

### Tipp 3 (Schritt-für-Schritt)
Produkt 6: Wie kann man 6 als Produkt zweier Wuerfelzahlen (1-6) schreiben?
1 × 6 = 6 ✓, 2 × 3 = 6 ✓, 3 × 2 = 6 ✓, 6 × 1 = 6 ✓. Das sind 4 Möglichkeiten.
Pruefe: Hat eine andere Zahl mehr als 4 Möglichkeiten?

### Didaktischer Hinweis
Eine kreative Variation des Wuerfelspiels: Multiplikation statt Addition. Die Produkttabelle ist gleichzeitig Einmaleins-Uebung! Das Ergebnis ueberrascht: Die haeufigsten Produkte (6 und 12 mit je 4) sind nicht die mittleren Zahlen. Die Struktur ist voellig anders als bei der Addition.

---

## Aufgabe 16

---
titel: "Alltagsaussagen — sicher, moeglich, unmoeglich"
typ: auswahl
thema: "Alles Zufall?"
schwierigkeit: gelb
buchseite: 75
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "wahrscheinlichkeit"
digital: voll
---

### Aufgabenstellung
Entscheide: Ist die Aussage **sicher**, **moeglich** oder **unmoeglich**?

a) Es schneit im Juli in Deutschland.
b) Nach Mittwoch kommt Donnerstag.
c) Du wirfst einen Stein hoch und er faellt wieder herunter.
d) Morgen scheint den ganzen Tag die Sonne.
e) Ein Hund kann fliegen.

### Lösung
a) moeglich (sehr unwahrscheinlich, aber in den Bergen theoretisch denkbar)
b) sicher (die Reihenfolge der Wochentage ist festgelegt)
c) sicher (die Schwerkraft wirkt immer)
d) moeglich (das Wetter kann man nicht sicher vorhersagen)
e) unmoeglich (Hunde haben keine Fluegel und koennen nicht fliegen)

### Lösungsweg
Bei jeder Aussage fragen:
- Kann es NIEMALS passieren? → unmoeglich
- Passiert es IMMER? → sicher
- Kann es passieren, muss aber nicht? → moeglich

### Tipp 1 (Denkanstoß)
Stell dir jede Situation bildlich vor. Passiert das jedes Mal so? Oder nur manchmal? Oder nie?

### Tipp 2 (Methode)
Drei Fragen nacheinander:
1. Ist es unmoeglich? → Wenn ja: unmoeglich.
2. Ist es sicher (passiert es 100% immer)? → Wenn ja: sicher.
3. Alles andere: moeglich.

### Tipp 3 (Schritt-für-Schritt)
b) Welcher Tag kommt nach Mittwoch? Immer Donnerstag? Ja! → sicher.
e) Kannst du dir einen fliegenden Hund vorstellen (ohne Flugzeug)? Nein → unmoeglich.
d) Ist es garantiert, dass morgen die Sonne scheint? → ?

### Didaktischer Hinweis
Alltagsbezogene Aussagen sind der beste Einstieg in die Wahrscheinlichkeitslehre. Kinder lernen die drei Grundbegriffe an Beispielen aus ihrer Lebenswelt. Wichtig: "moeglich, aber unwahrscheinlich" (wie Schnee im Juli) ist trotzdem "moeglich" — das unterscheidet Grundschul-Wahrscheinlichkeit von exakter Stochastik.

---

# Thema 3: Buchstaben zaehlen (S. 76-77)

## Aufgabe 17

---
titel: "Haeufige und seltene Buchstaben — Vermutung"
typ: auswahl
thema: "Buchstaben zaehlen"
schwierigkeit: gelb
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Ali und Jette spielen "Buchstabenvogel" (wie Galgenmännchen). Welche drei Buchstaben wuerdest du **zuerst** raten? Welche drei Buchstaben wuerdest du auf **keinen Fall** zuerst raten?

Waehle aus:
Zuerst raten: E, N, I, S, R, A, T
Auf keinen Fall: X, Y, Q, J, C

### Lösung
Zuerst raten (z.B.): E, N, S (haeufigste Buchstaben im Deutschen)
Auf keinen Fall (z.B.): X, Y, Q (seltenste Buchstaben)

### Lösungsweg
Im Deutschen kommen manche Buchstaben viel haeufiger vor als andere:
- Sehr haeufig: E, N, I, S, R, A, T
- Sehr selten: Q, X, Y, J, C

Der haeufigste Buchstabe ist das E — es kommt in fast jedem Wort vor!

### Tipp 1 (Denkanstoß)
Denke an Woerter, die du kennst: "Schule", "Hase", "Katze", "Sonne". Welcher Buchstabe kommt in besonders vielen Woertern vor?

### Tipp 2 (Methode)
Ueberlege: Welche Buchstaben brauchst du fast nie, wenn du schreibst? Das sind die seltenen. Welche brauchst du staendig? Das sind die haeufigen.

### Tipp 3 (Schritt-für-Schritt)
Der Buchstabe E kommt in diesen Woertern vor: Heft, Lesen, Rechnen, Schreiber. Fallen dir Woerter OHNE E ein? Das ist schwer! Also ist E ein guter erster Tipp.

### Didaktischer Hinweis
Intuitiver Einstieg in die Haeufigkeitsanalyse. Kinder nutzen ihr Sprachgefuehl, bevor sie zaehlen. Das Spiel "Buchstabenvogel" motiviert und schafft einen natuerlichen Anlass, ueber Buchstabenhaeufigkeiten nachzudenken.

---

## Aufgabe 18

---
titel: "Buchstaben in einem Satz zaehlen"
typ: eingabe
thema: "Buchstaben zaehlen"
schwierigkeit: gelb
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Zaehle, wie oft jeder Buchstabe in diesem Satz vorkommt:

**"Der Hund spielt gerne im Garten."**

Trage die Ergebnisse in eine Strichliste ein fuer die Buchstaben: D, E, R, N, I, G, S, T.

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
Satz in Grossbuchstaben: D E R H U N D S P I E L T G E R N E I M G A R T E N

Buchstabe fuer Buchstabe zaehlen:
- D: D...D → 2
- E: E...E...E...E → 4
- R: R...R...R → 3
- N: N...N...N → 3
- I: I...I → 2
- G: G...G → 2
- S: S → 1
- T: T...T → 2

### Tipp 1 (Denkanstoß)
Gehe den Satz Buchstabe fuer Buchstabe durch. Mache fuer jeden gesuchten Buchstaben einen Strich in der Tabelle.

### Tipp 2 (Methode)
Am besten: Nimm dir einen Buchstaben vor und gehe den ganzen Satz durch. Mache einen Strich fuer jedes Vorkommen. Dann den naechsten Buchstaben.

Strichliste: IIII = 4, IIII I = 5 usw.

### Tipp 3 (Schritt-für-Schritt)
Fang mit E an: "D**e**r Hund spi**e**lt g**e**rn**e** im Gart**e**n." Zaehle: 1...2...3...4... Stimmt das? Dann nimm dir R vor.

Achtung: Schau genau — das E in "spielt" und das E in "gerne" nicht vergessen!

### Didaktischer Hinweis
Strichlisten sind das einfachste Werkzeug der Datenerhebung. Die Aufgabe trainiert Konzentration und Systematik. Typische Fehlerquelle: Buchstaben uebersehen oder doppelt zaehlen. Die Methode "ein Buchstabe pro Durchgang" ist zuverlaessiger.

---

## Aufgabe 19

---
titel: "Buchstaben in einem kurzen Text zaehlen"
typ: eingabe
thema: "Buchstaben zaehlen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Untersuche diesen kurzen Text. Zaehle, wie oft jeder Buchstabe vorkommt. Notiere die fuenf haeufigsten Buchstaben.

**"Fredo rechnet gerne mit grossen Zahlen. Er findet Mathe toll."**

### Lösung
Vollstaendige Zaehlung (ohne Leerzeichen und Satzzeichen):

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

Die fuenf haeufigsten: E (8), N (5), R (5), T (5), I oder S (3)

### Lösungsweg
Den Text systematisch durchgehen und jeden Buchstaben mit Strichen zaehlen. Dann sortieren nach Haeufigkeit.

### Tipp 1 (Denkanstoß)
Geh den Text Buchstabe fuer Buchstabe durch. Welchen Buchstaben siehst du am oeftesten? Tipp: Es ist ein Vokal!

### Tipp 2 (Methode)
Erstelle eine Strichliste fuer alle vorkommenden Buchstaben. Am Ende sortierst du nach Haeufigkeit (der mit den meisten Strichen steht oben).

### Tipp 3 (Schritt-für-Schritt)
Faerbe zuerst alle E im Text ein: "Fr**e**do r**e**chn**e**t g**e**rn**e** mit gross**e**n Zahl**e**n. **E**r find**e**t Math**e** toll."
Zaehle: 1, 2, 3, 4, 5, 6, 7, ... Wie viele E findest du?

### Didaktischer Hinweis
Laengerer Text = mehr Daten = zuverlaessigeres Ergebnis. Kinder entdecken: Das E ist tatsaechlich der haeufigste Buchstabe! Das bestaetigt die Vermutung aus Aufgabe 17. Der Uebergang von Strichliste zur Rangfolge ist ein wichtiger Schritt in der Datenauswertung.

---

## Aufgabe 20

---
titel: "Saeulendiagramm aus Buchstabenhaeufigkeiten erstellen"
typ: eingabe
thema: "Buchstaben zaehlen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Stelle die folgenden Buchstabenhaeufigkeiten in einem Saeulendiagramm dar. Waehle eine Kaestchenhoehe fuer jeweils 2 Buchstaben.

| Buchstabe | E | N | R | S | T | A | I |
|-----------|---|---|---|---|---|---|---|
| Anzahl | 12 | 8 | 6 | 6 | 10 | 4 | 5 |

a) Zeichne das Diagramm.
b) Welcher Buchstabe kommt am haeufigsten vor?
c) Welche zwei Buchstaben kommen gleich oft vor?

### Lösung
b) E (12-mal)
c) R und S (je 6-mal)

a) Saeulendiagramm:
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
Fuer jede Saeule: Anzahl ÷ 2 = Kaestchenhoehe.
- E: 12 ÷ 2 = 6 Kaestchen
- N: 8 ÷ 2 = 4 Kaestchen
- R: 6 ÷ 2 = 3 Kaestchen
- S: 6 ÷ 2 = 3 Kaestchen
- T: 10 ÷ 2 = 5 Kaestchen
- A: 4 ÷ 2 = 2 Kaestchen
- I: 5 ÷ 2 = 2,5 Kaestchen (halbes Kaestchen)

### Tipp 1 (Denkanstoß)
Ein Saeulendiagramm zeigt Zahlen als Balken. Je groesser die Zahl, desto hoeher der Balken. Welcher Buchstabe bekommt den hoechsten Balken?

### Tipp 2 (Methode)
Zeichne fuer jeden Buchstaben eine Saeule. 1 Kaestchen = 2 Buchstaben. Also: E hat 12 Buchstaben → 12 ÷ 2 = 6 Kaestchen hoch. Mache das fuer alle Buchstaben.

### Tipp 3 (Schritt-für-Schritt)
Fang mit E an: 12 Buchstaben ÷ 2 = 6 Kaestchen. Zeichne eine Saeule, die 6 Kaestchen hoch ist.
Dann N: 8 ÷ 2 = 4 Kaestchen.
R und S: 6 ÷ 2 = 3 Kaestchen — gleich hoch!

### Didaktischer Hinweis
Saeulendiagramme sind das zentrale Visualisierungswerkzeug fuer Haeufigkeiten. Die Skalierung (1 Kaestchen = 2) ist ein wichtiges Konzept: Kinder muessen teilen und ggf. mit halben Kaestchen umgehen. Das Ablesen von Informationen aus dem Diagramm (b und c) trainiert die Diagrammkompetenz.

---

## Aufgabe 21

---
titel: "Diagramm ablesen — Vergleichende Aussagen"
typ: auswahl
thema: "Buchstaben zaehlen"
schwierigkeit: grün
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Schau dir die Buchstabenhaeufigkeiten an:

| Buchstabe | E | N | R | S | T | A |
|-----------|---|---|---|---|---|---|
| Anzahl | 15 | 10 | 7 | 5 | 9 | 8 |

Welche Aussage stimmt? Welche stimmt nicht?

a) E kommt am haeufigsten vor.
b) S kommt haeufiger vor als R.
c) N kommt doppelt so oft vor wie S.
d) A kommt seltener vor als T.
e) R und A zusammen kommen genauso oft vor wie E.

### Lösung
a) Stimmt (15 ist der hoechste Wert)
b) Stimmt nicht (S=5, R=7, also R kommt haeufiger vor)
c) Stimmt (N=10, S=5, und 10 = 2 × 5)
d) Stimmt (A=8, T=9, also A < T)
e) Stimmt (R+A = 7+8 = 15 = E)

### Lösungsweg
Jede Aussage einzeln pruefen:
- a) E=15, naechsthoechster N=10 → E ist am haeufigsten ✓
- b) S=5, R=7 → S < R, also S kommt seltener vor, nicht haeufiger ✗
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
b) S kommt 5-mal vor, R kommt 7-mal vor. 5 ist weniger als 7. Also kommt S seltener vor als R — die Aussage sagt aber "haeufiger". Stimmt das?

### Didaktischer Hinweis
Daten interpretieren und Aussagen kritisch pruefen — eine Kernkompetenz der Datenanalyse. Besonders die Begriffe "haeufiger als", "doppelt so oft" und "genauso oft wie" muessen verstanden werden. Die Aufgabe trainiert auch Addition und Vergleich.

---

## Aufgabe 22

---
titel: "Welche Woerter sind schwer zu erraten?"
typ: textaufgabe
thema: "Buchstaben zaehlen"
schwierigkeit: orange
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: voll
---

### Aufgabenstellung
Beim Spiel "Buchstabenvogel" musst du ein Wort erraten, indem du Buchstaben raetst. Falsche Buchstaben kosten einen Versuch.

Welches der folgenden Woerter waere am **schwersten** zu erraten? Begruende deine Antwort.

a) SCHULHEFT
b) RHYTHMUS
c) ELEFANT
d) GYMNASIUM

### Lösung
b) RHYTHMUS ist am schwersten zu erraten.

### Lösungsweg
Man schaut, wie viele seltene Buchstaben im Wort stecken:
- a) SCHULHEFT: S, C, H, U, L, H, E, F, T → E und S sind haeufig, leicht zu erraten
- b) RHYTHMUS: R, H, Y, T, H, M, U, S → Y ist sehr selten! Kein E!
- c) ELEFANT: E, L, E, F, A, N, T → zwei E, viele haeufige Buchstaben
- d) GYMNASIUM: G, Y, M, N, A, S, I, U, M → Y ist selten, aber A, N, S, I sind haeufig

RHYTHMUS hat kein E (der haeufigste Buchstabe!) und enthaelt Y (sehr selten). Deshalb ist es am schwersten.

### Tipp 1 (Denkanstoß)
Welches Wort enthaelt die meisten seltenen Buchstaben? Und: Welches Wort hat keinen der Top-Buchstaben (E, N, S, R)?

### Tipp 2 (Methode)
Pruefe fuer jedes Wort: Enthaelt es E? Enthaelt es N? Enthaelt es haeufige Buchstaben? Je weniger haeufige Buchstaben, desto schwerer ist es zu erraten.

### Tipp 3 (Schritt-für-Schritt)
Suche in jedem Wort nach dem Buchstaben E:
- SCHULHEFT: E ist drin! → einfacher zu erraten
- RHYTHMUS: kein E! → schwerer
- ELEFANT: sogar 2 × E! → am einfachsten
Welches Wort hat also die wenigsten haeufigen Buchstaben?

### Didaktischer Hinweis
Diese Aufgabe verbindet Buchstabenhaeufigkeiten mit strategischem Denken. Kinder lernen, dass Wissen ueber Haeufigkeiten einen praktischen Nutzen hat (bessere Strategie beim Buchstabenraten). Das ist angewandte Statistik auf Grundschulniveau!

---

## Aufgabe 23

---
titel: "Eigenen Text untersuchen — Buchstabenverteilung"
typ: eingabe
thema: "Buchstaben zaehlen"
schwierigkeit: orange
buchseite: 76
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: teilweise
---

### Aufgabenstellung
Untersuche diesen Zeitungstext. Zaehle die Buchstaben und beantworte die Fragen.

**"Die Feuerwehr rettete gestern einen Kater vom Dach. Der Kater hatte sich erschreckt und war auf den hoechsten Baum geklettert."**

a) Welcher Buchstabe kommt am haeufigsten vor?
b) Welcher Buchstabe kommt am seltensten vor (aber mindestens einmal)?
c) Welche Buchstaben kommen gar nicht vor?

### Lösung
a) E (kommt am haeufigsten vor, ca. 14-mal)
b) z.B. F (1-mal), W (1-mal) oder B (1-mal)
c) z.B. J, Q, X, Y, Z kommen nicht vor (variiert je nach Zaehlung)

### Lösungsweg
Systematisches Zaehlen aller Buchstaben im Text:
E: ca. 14 — mit grossem Abstand am haeufigsten
R: ca. 7
T: ca. 7
N: ca. 5
...
Selten: F, W, B (je 1-mal)
Nicht vorhanden: J, Q, X, Y (oder weitere)

### Tipp 1 (Denkanstoß)
Beginne mit dem E — faerbe alle E im Text ein. Dann zaehle sie. Wiederhole das fuer andere Buchstaben, die dir auffallen.

### Tipp 2 (Methode)
Mache eine Strichliste fuer das gesamte Alphabet (A bis Z). Gehe den Text Buchstabe fuer Buchstabe durch und mache fuer jeden einen Strich.

### Tipp 3 (Schritt-für-Schritt)
Fang mit den Vokalen an (A, E, I, O, U) — die sind leicht zu finden. Zaehle dann die haeufigsten Konsonanten: R, N, S, T. Am Ende schau, welche Buchstaben des Alphabets gar keinen Strich haben.

### Didaktischer Hinweis
Laengerer Text mit realistischem Inhalt. Die vollstaendige Auszaehlung ist aufwaendig und trainiert Ausdauer und Systematik. Das Ergebnis (E am haeufigsten, seltene Buchstaben wie Q, X, Y fehlen) bestaetigt die Erkenntnisse aus den vorherigen Aufgaben. Kinder sehen: Die Muster gelten fuer ALLE deutschen Texte.

---

## Aufgabe 24

---
titel: "Buchstabenverteilung vergleichen — Deutsch vs. andere Sprache"
typ: textaufgabe
thema: "Buchstaben zaehlen"
schwierigkeit: orange
buchseite: 77
kapitel: "07-kombinatorik-wahrscheinlichkeit"
stage_id: "haeufigkeitsanalyse"
digital: teilweise
---

### Aufgabenstellung
Hier sind die fuenf haeufigsten Buchstaben in zwei Sprachen:

**Deutsch:** E, N, I, S, R
**Englisch:** E, T, A, O, I

a) Welcher Buchstabe ist in beiden Sprachen unter den Top 5?
b) Welcher Buchstabe ist im Deutschen haeufig, aber nicht im Englischen (unter den Top 5)?
c) Warum koennte das E in beiden Sprachen der haeufigste Buchstabe sein?

### Lösung
a) E und I sind in beiden Listen.
b) N, S und R sind im Deutschen unter den Top 5, aber nicht im Englischen.
c) Das E kommt in sehr vielen Woertern vor — sowohl im Deutschen als auch im Englischen. Es wird fuer viele Endungen und Vorsilben gebraucht.

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
Pruefe: Ist E in beiden? Ja! Ist N in beiden? N ist nicht im Englischen. Ist I in beiden? ...

### Didaktischer Hinweis
Sprachvergleiche wecken Neugier und zeigen, dass Buchstabenhaeufigkeiten sprachspezifisch sind. Das E als universell haeufiger Buchstabe ist ein spannendes Ergebnis. Die Aufgabe laesst sich gut mit dem Deutschunterricht verknuepfen. Fuer mehrsprachige Kinder besonders motivierend.
