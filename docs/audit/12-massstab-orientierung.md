# Audit: 12-massstab-orientierung.json
Geprueft: 28 Aufgaben (keine Platzhalter)

## Fehler
Keine mathematischen Fehler gefunden. Alle Rechenwerte sind korrekt.

## Warnungen
- #1 "Wirkliche Groesse berechnen -- Vergroesserung": parsed.items[0].antwort ist "20 mm (= 2 cm)" -- Erklaerungstext statt reine Zahl. Ein Kind kann das nicht so eingeben. Antwort sollte "20" sein.
- #8 "Himmelsrichtungen benennen": Alle vier Teilaufgaben erwarten Freitext ("Norden", "Osten", "Sueden", "Westen"). Rechtschreibfehler wuerden als falsch gewertet. Besser als Zuordnung umsetzen oder case-insensitive Validierung sicherstellen.
- #12 "Himmelsrichtung auf dem Grundriss": Gleiche Freitext-Problematik wie #8 ("Osten", "Sueden", "Westen").
- #15 "Massstab auf der Karte -- Strecken berechnen": Inkonsistentes Antwort-Format. Teilaufgabe a) hat antwort "1000" (ohne Trennzeichen), Teilaufgabe b) hat antwort "2.500" (mit Punkt als Tausendertrennzeichen). Sollte einheitlich sein -- entweder beide mit oder beide ohne Punkt.
