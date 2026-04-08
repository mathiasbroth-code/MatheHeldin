# Audit: 13-schaubilder-daten.json
Geprüft: 13 Aufgaben (ohne Platzhalter)

## Fehler
Keine Fehler gefunden.

## Warnungen
- #7 "Eigene Größe einschaetzen": Lösung ist "169", tatsächlich ist 337 : 2 = 168,5. Gerundet auf 169 ist vertretbar, aber das Kind könnte "168" oder "168,5" eingeben -- beides wäre mathematisch ebenfalls korrekt. Als `textaufgabe` (nicht `eingabe`) ist die Validierung flexibler, daher akzeptabel.
- #1 "Tabelle lesen": Antwort a) ist "Lena und Tobi sind gleich groß: 152 cm" -- als Freitextantwort schwer automatisch zu validieren, aber als `textaufgabe`-Typ passt das.
