# Audit: 07-kombinatorik-wahrscheinlichkeit.json
Geprüft: 32 Aufgaben (ohne Platzhalter)

## Fehler
- #0 "Anordnung von drei Freunden — Baumdiagramm": parsed.items[1] (b) hat `antwort: "6"`, aber die Frage lautet "Zähle alle Möglichkeiten auf." — die Antwort sollte die Auflistung der 6 Permutationen sein, nicht die Zahl 6. Kind gibt eine Liste ein, Validierung gegen "6" schlägt fehl.

## Warnungen
- #2 "Zahlenschloss — Ziffernkombinationen finden": parsed.items[1] (b) hat `antwort: "258, 285, 528, 582, 825, 852"` — kommaseparierte Liste von 6 Werten in einem einzigen Eingabefeld. Schwer einzugeben und schwer zu validieren.
- #3 "Vierstelliger Code — Erste Ziffer bekannt": parsed.items[1] (b) hat `antwort: "5139, 5193, 5319, 5391, 5913, 5931"` — gleiche Problematik wie #2.
- #4 "Fussballturnier — Spiele in einer Gruppe zählen": parsed.items[1] (b) hat `antwort: "A–B, A–C, A–D, B–C, B–D, C–D"` — kommaseparierte Paarungen, schwierig einzugeben und zu validieren.
- #5 "Zwei Gruppen — Gesamtanzahl der Spiele": parsed.items enthalten Einheiten im Antworttext ("3 Spiele", "6 Spiele", "90 Minuten = 1 Stunde 30 Minuten") — ein Kind wird vermutlich nur die Zahl eingeben, Validierung problematisch.
- #6 "Vierstellige Zahlen aus Ziffernkarten bilden": parsed.items[1] (b) hat `antwort: "Kleinste: 2.468, Größte: 8.642"` — zwei Werte in einem Feld, nicht als einzelne Eingabe validierbar.
- #14 "Würfelprodukt — Welche Ergebniszahl gewinnt?": parsed.items[0] (a) hat `antwort: "1 (1 × 1)"` und items[1] (b) hat `antwort: "36 (6 × 6)"` — Erklärungs-Klammern in der Antwort. Kind tippt "1" bzw. "36", Validierung gegen "1 (1 × 1)" schlägt evtl. fehl.
- #16 "Buchstaben in einem kurzen Text zählen": parsed.items[0] hat `antwort: "E, N/R/T (je 5×), H/L/O (je 3×)"` — komplexes Format, nicht als einzelne Eingabe sinnvoll.
- #19 "Eigenen Text untersuchen — Buchstabenverteilung": parsed.items enthalten Erklärungs-Sätze als Antwort (z.B. "E (kommt 22-mal vor — ...)", "z.B. B (1-mal)...") — nicht als Eingabe validierbar.
- #22 "Buchstabenverteilung vergleichen — Deutsch vs. andere Sprache": parsed.items enthalten ganze Sätze als Antwort (z.B. "E und I sind in beiden Listen.") — nicht als Eingabe validierbar.
- #28 "Augensummen mit drei Würfeln": parsed.items[2] (c) hat `antwort: "10 (oder 11 — beide haben jeweils 27 Kombinationen und sind gleich häufig)"` — Erklärungstext statt reiner Zahl.
- #31 "Häufigster Buchstabe in einem Satz": parsed.items[0] hat `antwort: "A (9-mal, wenn man A, a und Ä zusammenzählt)"` — Erklärungstext statt reinem Buchstaben.
