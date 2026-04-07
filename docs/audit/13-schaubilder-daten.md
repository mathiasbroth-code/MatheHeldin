# Audit: 13-schaubilder-daten.json
Geprüft: 13 Aufgaben (keine Platzhalter vorhanden)

---

## Fehler

Keine mathematischen Fehler gefunden.

---

## Warnungen

- **#5 "Daten ordnen — Reihenfolge nach Größe":** Lukas und Jan sind beide 137 cm groß. Es gibt daher zwei gleich korrekte Reihenfolgen: `Lukas → Jan → Ole → ...` und `Jan → Lukas → Ole → ...`. Die `richtigeReihenfolge` im `parsed`-Objekt legt Lukas vor Jan fest — ein Kind, das Jan zuerst einordnet, würde fälschlicherweise als falsch gewertet. Entweder beide Varianten als korrekt kennzeichnen oder die Aufgabenstellung so anpassen, dass kein Gleichstand entsteht.

- **#12 "Jahreszahlen als römische Zahlen lesen":** Die `antwort`-Felder lauten `"2.001"`, `"1.945"`, `"1.812"` mit deutschem Tausenderpunkt. Jahreszahlen schreibt man in der Praxis ohne Tausendertrennzeichen (2001, nicht 2.001). Ein Kind würde instinktiv `2001` eingeben und würde bei exakter String-Prüfung als falsch gewertet. Inkonsistent mit allen anderen Aufgaben in der Datei (z. B. #4: Antwort `"47"`, `"188"` ohne Trennzeichen). Empfehlung: Antworten auf `"2001"`, `"1945"`, `"1812"` ändern oder die Validierungslogik Tausenderpunkte ignorieren lassen.

- **#3 "Diagramm lesen — Werte ablesen":** Tipp 3 thematisiert nur die Teilaufgaben a und c, nicht b und d. Das verletzt das Scaffolding-Prinzip — der dritte Tipp sollte alle vier Aussagen anleuchten oder zumindest eine klare Brücke zu b und d schlagen.

---

## Hinweise (keine Fehler, aber beachtenswert)

- **#2 "Mittelwert verstehen — Größe in der Mitte":** Die Aufgabe bezeichnet den Median als „Mittelwert". Für die 4. Klasse ist das didaktisch üblich und entspricht dem Schulbuch-Sprachgebrauch. In diesem Sonderfall stimmt der Median (140) zufällig auch mit dem arithmetischen Mittelwert überein (Summe: 129+137+140+142+152 = 700, 700÷5 = 140), was eine spätere Verwechslung durch Kinder begünstigen kann. Kein Handlungsbedarf, aber zu beachten.

- **#6 "Eigene Größe einschätzen — Wie groß wirst du?":** 337 ÷ 2 = 168,5. Die Datei rundet auf 169 (kaufmännisches Runden). Das ist korrekt und konsistent mit dem Loesungsweg. Die Aufgabenstellung enthält `≈` im Loesungsweg, was signalisiert, dass eine Näherung erwartet wird — gut so.

- **#0 "Tabelle lesen — Werte ablesen und vergleichen":** Teilaufgabe c erwartet als `antwort` den String `"152 - 128 = 24 cm"`. Bei einer Textaufgabe ist das akzeptabel, aber bei digitaler Eingabe muss die Validierungslogik diesen exakten String matchen. Alternativ wäre `"24"` als Antwort klarer — die Rechnung wird bereits in der `loesung` erklärt.

---

## Zusammenfassung Mathematik-Check

| # | Titel | a | b | c |
|---|-------|---|---|---|
| 0 | Tabelle lesen | 152 cm ✓ | 128 cm ✓ | 24 cm ✓ |
| 1 | Größenunterschiede | 3 ✓ | 3 ✓ | 24 ✓ |
| 2 | Mittelwert | 140 ✓ | 140 ✓ | — |
| 4 | Dreifaches/Vierfaches | 47 ✓ | 188 ✓ | 47 ✓ |
| 7 | Arabisch→Römisch einfach | III ✓ | VIII ✓ | XII ✓ |
| 8 | Römisch→Arabisch einfach | 6 ✓ | 11 ✓ | 20 ✓ |
| 9 | Arabisch→Römisch Subtraktion | IV ✓ | IX ✓ | XIV ✓ |
| 10 | Römisch→Arabisch Subtraktion | 40 ✓ | 90 ✓ | 44 ✓ |
| 11 | Große Zahlen→Römisch | CL ✓ | CCLXXVI ✓ | CDXCIX ✓ |
| 12 | Jahreszahlen lesen | 2001 ✓ | 1945 ✓ | 1812 ✓ |
