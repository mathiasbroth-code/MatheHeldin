# Audit: 14-forscherkiste.json
Geprüft: 48 Aufgaben (ohne Platzhalter)

## Fehler
Keine Fehler gefunden.

## Warnungen
- #6 "Jahreszahlen in römischen Zahlen": Antworten verwenden Tausendertrennpunkt ("1.756", "1.946", "2.026"). Bei der Eingabe muss der Validator Tausenderpunkte korrekt akzeptieren oder ignorieren, damit ein Kind, das "1756" eingibt, nicht als falsch gewertet wird.
- #9 "Dezimal in Binär umwandeln — größere Zahlen": Die Aufgabe verlangt 7-stellige Binärzahlen mit führenden Nullen (z.B. "0011001"). Ein Kind könnte "11001" eingeben (ohne führende Nullen) -- der Validator sollte beides akzeptieren.
- #10 "Binärcode knacken": Antwort ist "MATHE" -- als textaufgabe sollte auch "Mathe" oder "mathe" akzeptiert werden.
- #20 "Nelsons Taschengeld — nach 15 Tagen": Antwort a) ist "512 ct (= 5,12 Euro)" -- als textaufgabe-Antwort enthält das Erklärungstext, der die Eingabevalidierung erschwert.
