# Audit: 14-forscherkiste.json
Geprüft: 37 Aufgaben (ohne 2 Platzhalter: "Taschenrechner-Aufgaben" und "Abschied von der 4. Klasse")

Themen: Römische Zahlen (7), Binärsystem (5), Datenmengen (6), Rechenkünstler/Gauss (6), Fibonacci (6), Zahlenforscher (5), Pascalsches Dreieck (6), Taschenrechner (Platzhalter), Abschied (Platzhalter).

---

## Fehler

- **#30** "Fibonacci rückwärts — fehlende Zahlen finden" (`parsed.items`): Antworten b) und c) falsch belegt.
  - b) Frage: `___, 10, 15, ___, ___`. Fehlende Stellen: 1. (=5), 4. (=25), 5. (=40). `parsed.items[b].antwort = "15, 25, 40"` — die 15 ist bereits in der Aufgabe gegeben, nicht fehlend. Korrekt: `"5, 25, 40"`.
  - c) Frage: `___, ___, 34, 62, ___`. Fehlende Stellen: 1. (=6), 2. (=28), 5. (=96). `parsed.items[c].antwort = "34, 62, 96"` — 34 und 62 sind bereits gegeben. Korrekt: `"6, 28, 96"`.

- **#33** "Fibonacci rückwärts berechnen — schwierige Lücken" (`parsed.items`): Antworten enthalten die gegebenen End-Zahlen statt der echten Lücken.
  - a) Frage: `7, ___, ___, ___, 44`. Fehlende: 2.=10, 3.=17, 4.=27 (44 ist vorgegeben). `parsed.items[a].antwort = "17, 27, 44 (...)"` — 44 ist vorgegeben, 10 fehlt. Korrekt: `"10, 17, 27"`.
  - b) Frage: `10, ___, ___, ___, 59`. Fehlende: 2.=13, 3.=23, 4.=36. `parsed.items[b].antwort = "23, 36, 59 (...)"` — 59 ist vorgegeben, 13 fehlt. Korrekt: `"13, 23, 36"`.

- **#43** "Das pascalsche Dreieck verstehen — Additionsregel" (`parsed.items`): Die Aufgabe fragt nach drei fehlenden Zahlen (a=6, b=5, c=10), aber `parsed.items` enthält nur **ein** einziges Item, und dessen `antwort` nennt nur `"a) 6 (fehlende Zahl in Reihe 5)"`. Die Teilantworten b) und c) sind im `parsed`-Block komplett abwesend.

- **#44** "Ausschnitte ergänzen — Fehlende Zahlen im Dreieck" (`parsed.items`): Zwei strukturelle Fehler:
  1. `parsed.items[].frage` enthält für alle drei Items nur den Text `"\`\`\`"` (ein leerer Markdown-Code-Zaun) statt des Aufgabeninhalts. Das Kind bekommt keine lesbare Frage angezeigt.
  2. `parsed.items[].antwort` enthält den vollständigen Rechenweg (z.B. `"84 + ___ = 210 → ___ = 126"`), nicht die reine Ziffern-Antwort. Ein Kind müsste exakt diesen Satz eintippen, was unpraktisch ist. Korrekt wäre: `"126"`, `"126"`, `"210"`.

---

## Warnungen

- **#31** "Fibonacci mit Zielzahl — Startzahlen finden" (`parsed.items`): `antwort = "34, 66, 100 ✓"` zeigt nur die letzten drei Zahlen einer Folge. Die Aufgabe verlangt **vollständige 5-stellige Folgen** (mindestens zwei). Eine sinnvolle Antwort wäre z.B. `"2, 32, 34, 66, 100 und 5, 30, 35, 65, 100"`. Für die App-Validierung ist der aktuelle Wert nicht verwendbar.

- **#45** "Reihensummen im pascalschen Dreieck" (`parsed.items`): `antwort = "Reihe 1: 1"` enthält nur die erste Reihe. Die vollständige Antwort (Reihen 1–6: 1, 2, 4, 8, 16, 32 plus Muster-Beschreibung) fehlt. Für die App ist die Antwort damit unvollständig.

- **#16** "Speicherplatz berechnen — Fotos und Texte" (`parsed.items`): `items[a].antwort = "10"` ohne Einheit. Die Aufgabe fragt nach Speicherplatz, die Antwort sollte `"10 MB"` oder zumindest `"10"` mit klar definierter Einheit sein. Die anderen Teilaufgaben b) und c) enthalten Einheiten (`"1.000 KB (= ca. 1 MB)"`, `"ungefähr 500 Fotos"`), was inkonsistent ist.

- **#8** "Dezimal in Binär umwandeln — kleine Zahlen": Antwortformat `"00011"`, `"00101"` usw. mit führenden Nullen. Mathematisch korrekt (5-Bit-Darstellung), aber ein Kind, das nur `"11"` eingibt, würde abgelehnt. Sollte im UI-Handling explizit berücksichtigt werden (entweder führende Nullen als optional markieren oder das Eingabeformat im Aufgabentext präzisieren).

- **#43** Tipp-Qualität: Tipp 2 enthält einen Satzanfang `"Schau immer eine Reihe höher. Die Lücke in Reihe 5 liegt zwischen zwei 3en: 3+3 = ___."` — der Lückentext ist korrekt, verrät aber schon den Rechenweg für Teilaufgabe a) vollständig, ohne b) und c) zu adressieren. Tipps bauen im Wesentlichen auf, sind aber auf nur eine Lücke zugeschnitten.

- **#20** "Der Gauss-Trick — Summe von 1 bis 10" (`typ: luecke`): Das `loesung`-Feld nennt nur die fünf Einzelantworten (a–e), beantwortet aber nicht explizit die im Aufgabentext gestellten Zusatzfragen ("Wie viele Paare gibt es?" / "Was ist die Summe?"). Der `loesungsweg` enthält diese Antworten — `loesung` ist daher unvollständig für den Schüler-Output.

---

## Mathematische Korrektheit: Keine Fehler gefunden

Alle nachgerechneten Werte sind mathematisch korrekt:
- Alle römischen Zahlumwandlungen (Indizes 0–6) korrekt.
- Alle Binärzahl-Umwandlungen (Indizes 7–12) korrekt.
- Alle Datenmengen-Rechnungen (Indizes 13–19) korrekt.
- Gauss-Trick (Indizes 20–23, 27): 1+…+10=55, 1+…+100=5.050, 1+…+200=20.100, 1+…+50=1.275, 1+…+500=125.250 — alles korrekt.
- Nelson/Verdoppeln (Indizes 24–25): Folge 1,2,4,8,16,32 und Tag 10=512, Tag 15=16.384 — korrekt.
- Fahrrad-Handel (Index 26): Gewinn 20 Euro — korrekt.
- Fibonacci-Folgen (Indizes 28–34): Alle Folgenwerte nachgerechnet und korrekt.
- Arme/Reiche/Vollkommene Zahlen (Indizes 37–39): Teilersummen korrekt.
- Primzahlen 1–20 (Index 40–42): Liste korrekt.
- Pascalsches Dreieck Reihe 12 (Index 47): Alle Binomialkoeffizienten korrekt.
- Dreieckszahlen (Index 48): 21+7=28 korrekt.
