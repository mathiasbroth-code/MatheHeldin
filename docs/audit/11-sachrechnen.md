# Audit: 11-sachrechnen.json
Geprüft: 30 Aufgaben (keine Platzhalter vorhanden)

---

## Fehler

### Mathematisch falsche oder unbrauchbare `antwort`-Werte in `parsed.items`

- **#1 "Eintrittspreise vergleichen"** — Item c) `antwort: "64"`: Die Frage lautet "Welches Angebot ist für Jette günstiger?" — "64" ist ein Betrag, keine Antwort auf eine Vergleichsfrage. Ein Kind, das "Einzeltickets" eingibt, würde als falsch gewertet. Die `antwort` sollte eine prüfbare Zahl oder ein klar definierter String sein. Vorschlag: Entweder die Frage auf "Was kosten 8 Einzeltickets? (Vergleich: die günstigere Variante)" umformulieren und Antwort "64" akzeptieren, oder Typ auf `auswahl` ändern.

- **#2 "Tageskarte oder 3-Stunden-Ticket?"** — Schwerwiegend: Beide Antworten sind falsch.
  - Item a) `antwort: "28"`: Die Frage fragt nach den Gesamtkosten der Tageskarten für die ganze Familie. Richtig: **61** (2·14 + 3·11 = 28+33 = 61). "28" ist nur der Erwachsenenanteil.
  - Item b) `antwort: "22"`: Die Frage fragt nach den Gesamtkosten der 3-Stunden-Tickets. Richtig: **46** (2·11 + 3·8 = 22+24 = 46). "22" ist nur der Erwachsenenanteil.

- **#5 "Geburtstagsfeier im Schwimmbad"** — Item c) `antwort: "10"`: Die Frage lautet "Was kostet das mitgebrachte Essen und Trinken?" — die Lösung nennt 16 Euro (Essen 10 + Getränke 6). "10" sind nur die Essenskosten ohne Getränke. Richtige Antwort: **16**.

- **#7 "Sparvergleich — Essen kaufen oder mitbringen?"** — Zwei Antworten falsch:
  - Item a) `antwort: "7"`: Die Frage fragt den Gesamtpreis von Variante A. Richtig: **39** Euro (7+15+8+3+1,50+4,50 = 39). "7" ist nur der Kuchenpreis.
  - Item b) `antwort: "52"`: Die Frage fragt den Gesamtpreis von Variante B. Richtig: **68,80** (8·6,50 + 8·2,10 = 52+16,80 = 68,80). "52" ist nur der Essensanteil.

- **#8 "10er-Karte oder Einzeltickets — Ab wann lohnt sich die Karte?"** — Item b) `antwort: "80"`: Die Frage lautet "Wie viel spart man mit der 10er-Karte, wenn man sie komplett aufbraucht (10 Besuche)?" — laut `loesung` kostet die 10er-Karte *mehr* (85 vs. 80 Euro), man spart also **gar nichts** (die Karte ist 5 Euro teurer). "80" ist der Preis der Einzeltickets, nicht die Ersparnis. Die Frageformulierung ist irreführend; sinnvoller wäre: "Wie viel teurer ist die 10er-Karte bei 10 Besuchen?" mit Antwort "5".

- **#11 "Anna und Marie — Wettlauf mit Vorsprung"** — `antwort: "Nach"`: Bruchstück eines Satzes ("Nach 400 m…"), keine auswertbare Antwort. Richtig: **"400"**.

- **#13 "Fahrradtour — Wer ist wie weit gefahren?"** — `antwort: "Simon"`: Die Frage fragt "Wie viele Kilometer ist Simon in einer Stunde gefahren?" Richtig: **"10"**. "Simon" ist nicht auswertbar.

- **#14 "400-Meter-Bahn — Wann hat Felix Marco eingeholt?"** — `antwort: "Nach"`: Wieder Satzbruchstück. Richtig: **"800"** (Meter).

- **#15 "Züge fahren auseinander"** — `parsed.teilaufgaben[0].schritte[0].antwort: "a) 400 km (Schnellzug: 160 · 2,5)"`: Das ist Erklärungstext, keine eingebbare Zahl. Außerdem ist die `parsed`-Struktur stark unvollständig — sie enthält nur einen Schritt, obwohl die Aufgabe 3 Teilschritte (Schnellzug, Regionalzug, Gesamtentfernung) hat. Richtig wären drei Schritte mit Antworten "400", "225", "625".

- **#16 "Züge — Geschwindigkeit berechnen"** — `antwort: "Der"`: Satzbruchstück ("Der andere Zug fährt…"). Richtig: **"80"** (km/h).

---

## Warnungen

- **#1 "Eintrittspreise vergleichen"** — Item b) `antwort: "85 Euro"` (mit Einheit), Item a) `antwort: "64"` (ohne Einheit): Inkonsistentes Antwort-Format innerhalb derselben Aufgabe. Einheitliche Notation empfohlen (entweder immer mit "Euro" oder immer ohne).

- **#4 "Wartezeit an der Rutsche"** — Die Frage lautet "Wie lange muss Jette ungefähr warten?" (impliziert Minuten oder eine lesbare Zeitangabe), aber `antwort: "420"` erwartet Sekunden. Ein Kind, das "7" (Minuten) eingibt, würde als falsch gewertet. Entweder Frage auf "Wie viele Sekunden muss Jette warten?" anpassen oder `antwort: "7"` (Minuten) setzen und die Frage entsprechend stellen.

- **#9 "Schulweg — Wann holt Leo seine Schwester ein?"** — Tipp 4 enthält Algebra (50t = 75t − 300 → t = 12), die weit über das Niveau der 4. Klasse hinausgeht. Tipp 4 sollte die Lösung in Tabellenform (wie im `loesungsweg`) zeigen, nicht algebraisch.

- **#27 "Tabelle hilft — Getränkestand auf dem Schulfest"** — `parsed.teilaufgaben[0].schritte[12]` (label "13"): `frage: "Summe:", antwort: "."` — Dies ist kein gültiger Schritt. Kein Kind kann "." als Antwort eingeben und es ist unklar, was hier geprüft werden soll. Der Schritt sollte entweder entfernt oder sinnvoll formuliert werden (z.B. "Reichen die 50 Becher bis 16:30 Uhr?" mit Antwort "nein").

- **#2 "Tageskarte oder 3-Stunden-Ticket?"** — Tipp 3 enthält Lücken für alle drei Teilaufgaben zusammen, was bei korrekten `antwort`-Werten (nach Bugfix) noch passen würde, aber derzeit verwirrend ist.

- **#5 "Geburtstagsfeier im Schwimmbad"** — Item b) `antwort: "25 Euro"` (mit Einheit) vs. a) und d) ohne Einheit: Inkonsistentes Format.

---

## Zusammenfassung

| Kategorie | Anzahl betroffener Aufgaben |
|-----------|----------------------------|
| Fehler (falsche `antwort`-Werte) | 9 |
| Fehler (unbrauchbarer Satzfragment als `antwort`) | 4 |
| Warnungen (Format, Niveau, Struktur) | 5 |

**Dringend zu korrigieren vor dem Launch:** #2 (beide Antworten falsch), #5c, #7a+b, #11, #13, #14, #15, #16.
