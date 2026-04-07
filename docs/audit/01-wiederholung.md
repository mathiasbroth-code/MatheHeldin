# Audit: 01-wiederholung.json
Geprüft: 47 Aufgaben (ohne Platzhalter — keine Platzhalter in dieser Datei)

---

## Fehler

### #7 "Welche Zahlen können es sein? — Offene Zahlenrätsel"
**parsed.items[a].frage unvollständig — fehlende Schranken-Bedingung**

Die `parsed.items[0].frage` enthält nur:
> "Die Zahl ist gerade. Sie hat doppelt so viele Hunderter wie Zehner."

Die entscheidende Schranke aus der Aufgabenstellung fehlt:
> "Die Zahl ist größer als 1.200 und kleiner als 1.400."

Ohne diese Schranke wären auch Z=2, H=4 → Zahlen wie 1.420, 1.422, 1.424, 1.426, 1.428 gültig — die Lösungsmenge wäre falsch. Die Frage in `parsed` ist damit unvollständig und würde die Aufgabe mathematisch falsch begrenzen, sobald die App nur auf `parsed.items[].frage` zurückgreift.

**Fix:** Schranke in `parsed.items[0].frage` ergänzen: "Die Zahl ist gerade. Sie hat doppelt so viele Hunderter wie Zehner. Die Zahl ist größer als 1.200 und kleiner als 1.400."

---

### #44 "Zeitschriften kaufen" — parsed.items[1].antwort beantwortet die falsche Frage
**Antwort passt nicht zur gestellten Frage**

`parsed.items[1].frage`:
> "Vergleiche: Was ändert sich, wenn Sophie die Zeitschrift nur alle zwei Wochen kauft?"

`parsed.items[1].antwort`:
> "Jede Woche: 52 Wochen · 2 Euro = 104 Euro pro Jahr."

Die Antwort bezieht sich auf die erste (nicht explizit im parsed gestellte) Frage — wie viel bei wöchentlichem Kauf. Sie beantwortet **nicht** die tatsächlich gestellte Frage nach dem Vergleich. Die korrekte Antwort auf die Vergleichsfrage wäre: "Alle zwei Wochen: 26 × 2 = 52 Euro pro Jahr." oder kompakt `"52"`.

**Fix:** `parsed.items[1].antwort` auf `"52"` (Euro/Jahr bei 2-wöchentlichem Kauf) korrigieren.

---

## Warnungen

### #2 "Zahlen zerlegen — Tausenderzahlen in Stellenwerte"
**Antwortformat nicht eingebbar**

`parsed.items[].antwort` enthält Ausdrücke wie:
> "1.000 + 400 + 80 + 2 / 1.000 + 200 + 30 + 7 / 1.000 + 600 + 50 + 4 / 1.000 + 800 + 10 + 9"

Vier Zerlegungen in einem Feld, getrennt durch `/`. Ein Kind kann das so nicht tippen. `typ=eingabe` passt dafür nicht — die Aufgabe braucht entweder mehrere separate Items (eines pro Zahl) oder den Typ `schritt`. Derzeit würde die Auswertung jeden Tipp als falsch markieren.

---

### #9 "Plättchen dazulegen — vierstellige Zahlen" / #10 "Plättchen wegnehmen" / #11 "Plättchen rückwärts"
**Antwortformat enthält Erklärungstext statt reiner Werte**

`parsed.items[].antwort` enthält z.B.:
> "704: → 705, 714, 804, 1.704"
> "1.870: → 1.869 geht nicht (E=0, kein Plättchen zum Wegnehmen!), 1.860, 1.770, 870"

Diese Antworten sind Erklärungstexte mit Pfeilen, Klammern und Begründungen. Für `typ=eingabe` ist das nicht maschinell auswertbar und für ein Kind nicht eingabetauglich. Die Antworten sollten entweder reine Komma-Listen sein (`"705, 714, 804, 1.704"`) oder der Typ auf `textaufgabe` geändert werden.

---

### #11 "Plättchen rückwärts" — Aufgabe a) Begründung irreführend
**Formulierungsfehler in antwort und loesung**

Die Antwort für a) (Ausgangszahl 825) lautet:
> "825: → 824, 815, 725 (T kann nicht, da T=0 → vorher wäre T negativ)"

Die Begründung "vorher wäre T negativ" ist sprachlich unklar/falsch. Gemeint ist: 825 − 1.000 = −175, also eine negative Zahl. Für einen 4.-Klässler ist die korrekte Erklärung: "Kein Tausender-Plättchen wurde dazugelegt, weil nach dem Wegnehmen keine negative Zahl entstehen darf." Mathematisch sind die drei Ergebnisse (824, 815, 725) korrekt.

---

### #12 "Stellenwerttafel — Zahlen verändern" — Aufgabe c) zu komplex für Grundschule
**Didaktische Warnung: Übertrag-Konzept über Stellenwertgrenzen für 4. Klasse grenzwertig**

Bei c) (1.480 → Hunderter halbieren UND Zehner verdreifachen gleichzeitig) entsteht ein Übertrag von der Zehner- in die Hunderterstelle, der *gleichzeitig* mit der Halbierung der Hunderter zusammen gerechnet werden muss. Die Lösung (1.440) ist mathematisch korrekt, aber die kombinierte Operation (halbieren + verdreifachen mit Übertrag) übersteigt in dieser Kombination das Niveau einer typischen 4.-Klasse-Stellenwert-Aufgabe. Eine Warnung ist angebracht, kein Fehler.

---

### #27 "Schriftlich subtrahieren — Ergebnis prüfen" — Lösungsweg unübersichtlich
**Loesungsweg für b) schwer lesbar / enthält Selbstkorrektur**

Der `loesungsweg` für Aufgabe b) (1.502 − 738) enthält Mid-Stream-Korrekturen:
> "Z: 9-3=6 (0-1=... borge von H: 5→4, 0→10, 10-1=9, 9→...)"

Das ist kein klarer Rechenweg, sondern ein Entwurf mit Durchstreichungen. Ein Kind, das auf Tipp 4 klickt, sieht verwirrenden Text. Mathematisch richtig (Ergebnis 764 ✓), aber die Erklärung sollte überarbeitet werden.

---

### #35 "Hotelrechnung — Grundaufgabe" — antwort in parsed enthält Rechenweg statt Wert
**Antwortformat für Eingabe nicht geeignet**

`parsed.items[0].antwort`:
> "1 Woche = 7 Nächte: 7 · 19,00 = 133,00 Euro (Übernachtung) + 7 · 3,50 = 24,50 Euro (Frühstück) = 157,50 Euro pro Person."

Das ist ein vollständiger Lösungsweg als Antwort. Ein Kind kann das nicht so eingeben. Die Antwort sollte `"157,50"` sein (mit `typ=textaufgabe` und entsprechend freier Antwort). Derzeit würde jede Eingabe eines Kindes als falsch gewertet, da kein String-Match möglich ist.

---

### #36 "Hotelrechnung — anderes Hotel" / #37 "Hotelrechnung mit Ausnahmen"
**Gleiches Antwortformat-Problem wie #35**

`parsed.items[].antwort` enthält Rechenwege statt reine Werte. Für `typ=textaufgabe` sollten die numerischen Ergebnisse als saubere Werte stehen: `"108"`, `"432"` etc. (wie in #37 korrekt für items a1–b umgesetzt — dort stehen tatsächlich reine Zahlen, Ausnahme ist items[0].antwort in #35 und #36).

**Hinweis:** In #37 sind die parsed-Antworten korrekt als reine Zahlen (`"135"`, `"135"`, `"110"`, `"108"`, `"488"`). Das ist das richtige Muster — #35 und #36 sollten analog korrigiert werden.

---

## Mathematische Korrektheit — Zusammenfassung

Alle nachgerechneten Ergebnisse sind korrekt:

| # | Titel | Ergebnis |
|---|-------|----------|
| 1 | Welche Zahl ist es? | ✓ (1.253, 1.400, 361, 1.007) |
| 2 | Zahlen zerlegen | ✓ (alle Zerlegungen korrekt) |
| 3 | Zahlwörter lesen | ✓ (1.417, 1.470, 1.017, 1.070, 1.007) |
| 4 | Zahlenrätsel Bedingungen | ✓ (alle Lösungsmengen geprüft) |
| 5 | Zahlenrätsel Verdoppeln | ✓ (1.224, 1.248) |
| 6 | Dienes-Blöcke | ✓ (1.357, 1.042, 1.608, 1.891) |
| 7 | Offene Zahlenrätsel | ✓ (Mathe korrekt, parsed-Fehler siehe oben) |
| 8 | Plättchen 350 | ✓ (351, 360, 450, 1.350) |
| 9 | Plättchen vierstellig | ✓ |
| 10 | Plättchen wegnehmen | ✓ |
| 11 | Plättchen rückwärts | ✓ (Ergebnisse; Begründung s. Warnung) |
| 12 | Stellenwerttafel verändern | ✓ (1.643, 1.830, 1.440) |
| 13 | Hunderter addieren/subtrahieren | ✓ |
| 14 | Rechenpäckchen verwandt | ✓ |
| 15 | Rechenpäckchen schrittweise | ✓ |
| 16 | Veränderungen erkennen Add. | ✓ |
| 17 | Subtrahieren mit Veränderungen | ✓ |
| 18 | Schriftlich addieren dreistellig | ✓ (678, 475, 961) |
| 19 | Schriftlich addieren Übertrag | ✓ (922, 662, 934) |
| 20 | Schriftlich addieren drei Summanden | ✓ (962, 632, 772) |
| 21 | Fehler finden addieren | ✓ (942 ✓, 643≠634 ✓, 823≠832 ✓) |
| 22 | Schriftlich addieren gemischt | ✓ (852, 803, 834) |
| 23 | Schriftlich subtrahieren dreistellig | ✓ (536, 333, 323) |
| 24 | Schriftlich subtrahieren Entbündelung | ✓ (565, 474, 327) |
| 25 | Schriftlich subtrahieren vierstellig | ✓ (1.165, 1.065, 1.736) |
| 26 | Fehler finden subtrahieren | ✓ (563≠536, 356≠365, 1.157≠1.175) |
| 27 | Subtrahieren Ergebnis prüfen | ✓ (436, 764; Probe korrekt) |
| 28 | Halbschriftlich mult. intro | ✓ (235, 504) |
| 29 | Halbschriftlich mult. selbstständig | ✓ (332, 342, 282, 322) |
| 30 | Halbschriftlich mult. dreistellig | ✓ (852, 456) |
| 31 | Multiplizieren vergleichen | ✓ (258=258, 190=190, 192=192) |
| 32 | Multiplikationstabelle | ✓ (alle 9 Felder korrekt) |
| 33 | Geschickt rechnen großer Faktor | ✓ (561, 1.230, 1.592, 1.650) |
| 34 | Zwei Rechenwege | ✓ (343, 490, 591) |
| 35 | Hotelrechnung Grundaufgabe | ✓ (157,50€, 472,50€; Antwortformat s. Warnung) |
| 36 | Hotelrechnung anderes Hotel | ✓ (108€, 432€) |
| 37 | Hotelrechnung mit Ausnahmen | ✓ (135, 135, 110, 108, 488) |
| 38 | Gutschein aufteilen | ✓ (5 Tage, 7 Tage) |
| 39 | Pilze sammeln | ✓ (Mia=600, Lina/Tom=300) |
| 40 | Taschen packen | ✓ (6, 12, 12 kg) |
| 41 | Theaterbesuch | ✓ (Stehplatz 7€, Sitzplatz 14€) |
| 42 | Rechengeschichte 248-35 | ✓ (213) |
| 43 | Rechengeschichte 6·8 | ✓ (48) |
| 44 | Rechengeschichten Schwimmen | ✓ (15h, 14h) |
| 45 | Zeitschriften | ✓ (Mathematik: 104€, 52€; Antwortformat s. Fehler) |
| 46 | Musik-Downloads | ✓ (5) |
| 47 | Schulweg | ✓ (150 min, 2,5h) |
| 48 | Alter-Rätsel | ✓ (offene Aufgabe, Beispiellösung korrekt) |
