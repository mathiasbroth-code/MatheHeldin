# Audit: intensiv-division.json
Geprüft: 60 Aufgaben (ohne Platzhalter)

## Fehler
Keine Fehler gefunden.

## Warnungen
- #1 "Vielfache aufschreiben": loesung-Feld enthält nur die letzten Vielfachen ("a) 24, b) 56"), aber parsed.items[].antwort enthält die vollständige Ausfüllung ("9, 12, 15, 18, 21, 24"). Das ist korrekt -- das parsed-Format passt zum Eingabeformat. Aber die Diskrepanz zwischen `loesung` und `parsed.items[].antwort` könnte verwirren, wenn `loesung` zur Anzeige genutzt wird.
- #8 "Vielfache in der Sachaufgabe — Eierkartons": parsed.items[0].antwort = "8 volle Kartons" enthält Text neben der Zahl. Wenn ein Kind nur "8" eingibt, muss der Validator das akzeptieren.
- #24 "Halbschriftlich — Kopf oder Zerlegung?": Die parsed.items[].antwort-Felder enthalten Erklärungstext (z.B. "60 (im Kopf: 36:6=6, also 360:6=60)"). Das ist als `schritt`-Typ mit einem einzigen Schritt akzeptabel, aber der Validator muss den reinen Zahlenwert extrahieren.
- #30 "Fehlende Ziffern finden — Lückendivision": Antworten enthalten erklärenden Text ("4.962 : 6 = 827 → fehlende Ziffer: 9"). Das Kind soll vermutlich nur "9" eingeben.
