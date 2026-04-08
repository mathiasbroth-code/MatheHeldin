# Audit: 05-multiplikation.json
Geprueft: 30 Aufgaben (ohne Platzhalter)

## Fehler
Keine mathematischen Fehler gefunden. Alle 30 Aufgaben sind rechnerisch korrekt.

Stichproben-Verifikation:
- 58 x 12 = 696, 47 x 13 = 611, 41 x 23 = 943, 32 x 54 = 1.728, 73 x 16 = 1.168
- 2.313 x 3 = 6.939, 1.621 x 4 = 6.484, 1.531 x 5 = 7.655
- 7.526 x 4 = 30.104 (Fehler in Aufgabenstellung bewusst), 3.532 x 3 = 10.596, 7.604 x 2 = 15.208, 4.520 x 4 = 18.080
- 2.849 x 3 = 8.547, 4.629 x 4 = 18.516, 2.512 x 7 = 17.584
- 1.234 x 9 = 11.106, 1.235 x 9 = 11.115, 1.236 x 9 = 11.124
- 284 x 37 = 10.508, 432 x 48 = 20.736, 2.412 x 72 = 173.664
- 3.625 x 357 = 1.294.125, 231 x 45 = 10.395, 534 x 12 = 6.408

## Warnungen

### Antwort-Format

- #8 "Zahlenraetsel mit Division": Items haben `antwort = "Meine Zahl = 4"` bzw. `"Meine Zahl = 42.000"` statt einfacher Zahlenwerte "4" und "42.000". Ein Kind tippt eine Zahl, nicht einen Satz.

- #9 "Divisionsaufgaben finden -- Umkehraufgaben bilden": Items haben offene Antworten wie `"- 5.600 : 7 = 800"`. Offene Aufgabe mit vielen moeglichen korrekten Antworten -- schwer automatisch zu validieren.

- #13 "Muster in Rechenpaeeckchen -- Produkte vergleichen": Items haben zusammengesetzte Antworten wie `"6 x 74 = 444 und 12 x 37 = 444 -- gleich!"` statt einfacher Zahlen. Typ "textaufgabe" passt hier bedingt.

### Typ-Passung

- #8 "Division mit Kontrolle -- Grosse Zahlen": Typ ist `eingabe` mit zusaetzlichem `kontext`-Feld. Kein Problem, aber das `kontext`-Feld ist bei `eingabe` normalerweise nicht vorhanden.

### Loesung vs. parsed-Antwort -- Widerspruch

- #24 "Tauschaufgaben -- Welche Reihenfolge ist einfacher?": Die `loesung`-Prosa beginnt mit "22 x 318 ist einfacher", aber die `parsed.items[0].antwort` ist "A" (318 x 22). Der spaetere Text in `loesung` bestaetigt korrekt, dass die groessere Zahl vorne stehen soll (weniger Teilzeilen), also ist parsed-Antwort "A" richtig. Aber der erste Satz in `loesung` ist irrefuehrend und sollte korrigiert werden.
