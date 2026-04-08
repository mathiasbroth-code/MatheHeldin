# Audit: 09-alltagsbrueche-hohlmasse-masseinheiten.json
Geprüft: 32 Aufgaben (ohne Platzhalter)

## Fehler
Keine Probleme gefunden.

## Warnungen
- #0 "Pizza teilen — Bruch verstehen": parsed.items[0] (a) hat `antwort: "1/2 (ein Halbes)"` und items[2] (c) hat `antwort: "1/8 (ein Achtel)"` — Erklärungstext in Klammern. Kind tippt "1/2", Validierung gegen "1/2 (ein Halbes)" schlägt evtl. fehl. (items[1] ist dagegen korrekt nur "1/4".)
- #4 "Gefärbter Anteil des Kreises — Bruch ablesen": Die Frage für items b/c/d enthält "oder ___" (erwartete Mehrfach-Antwort), aber parsed hat nur eine einzige Antwort pro Item (z.B. "1/2" statt "2/4 oder 1/2"). Das ist mathematisch korrekt (vereinfachter Bruch), aber inkonsistent mit der Fragestellung.
- #10 "Gemischte Angaben umwandeln — l und ml": parsed.items[2] (c) hat `antwort: "0,5"` für "500 ml = ___ l" — mathematisch korrekt, aber Kinder kennen evtl. eher "1/2" als "0,5".
- #12 "Kniffelaufgabe — 4 Liter abmessen": parsed.items[0] enthält einen sehr langen Erklärungstext als Antwort — nicht als Eingabe sinnvoll.
- #15 "Wasserverbrauch hochrechnen — Woche und Monat": parsed.items Antworten ("1.015", "4.350") sind reine Zahlen — passt gut.
- #19 "Burger-Wasserverbrauch — Vergleich mit Alltag": parsed.items[1] (b) hat `antwort: "ja"` — funktioniert als Eingabe, aber fragliche UX für ein 9-jähriges Kind.
- #20 "Schokolade und Wasser — Kann das stimmen?": parsed.items[0] hat Erklärungstext als Antwort — nicht als Eingabe validierbar.
- #22 "Zentimeterwürfel zählen — Rauminhalt berechnen": parsed.items enthalten Rechenweg in der Antwort (z.B. "5 · 3 · 2 = 30 cm³") statt nur der Zahl.
- #24 "Quader-Rauminhalt — größere Maße": gleiche Problematik wie #22 — Rechenweg in der Antwort.
- #25 "Dezimeterwürfel und Liter": parsed.items enthalten Rechenweg/Erklärung in der Antwort.
- #27 "Quader vergleichen — wer fasst mehr?": parsed.items enthalten Erklärungstext ("In Quader A passt mehr.", "90 - 80 = 10 l mehr.") statt reiner Werte.
- #28 "Quader für 160 ml finden": parsed.items[0] enthält Auflistung von zwei Möglichkeiten — nicht als einzelne Eingabe validierbar.
- #30 "Wie weit ist eine Million Schritte?": parsed.items enthalten Rechenweg in der Antwort.
- #32 "Eine Million Gramm — wie schwer?": parsed.items[2] (c) hat ganzen Erklärungssatz als Antwort.
- #33 "Eine Million Milliliter — wie viele Badewannen?": parsed.items[0] hat `antwort: "1.000 l"` (mit Einheit) und items[1] hat Erklärungstext als Antwort.
- #34 "Wie lange dauert es, bis zur Million zu zählen?": parsed.items enthalten Rechnungen als Antwort (z.B. "1.000.000 × 2 = 2.000.000 Sekunden").
- #31 "Eine Million Sekunden — wie viele Tage?": parsed.items[3] (d) hat `antwort: "ca. 12 Tage"` — der Lösungsweg sagt "≈ 11,6 Tage". Antwort "12" ist gerundet akzeptabel, aber "ca. 12 Tage" enthält Erklärungstext.
