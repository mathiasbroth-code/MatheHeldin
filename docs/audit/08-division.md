# Audit: 08-division.json
Geprüft: 49 Aufgaben (ohne Platzhalter)

## Fehler
Keine Probleme gefunden.

## Warnungen
- #1 "Gemeinsame Vielfache finden": parsed.items[0] hat `antwort: "Gemeinsame Vielfache von 4 und 8 bis 40: 8, 16, 24, 32, 40"` — ein Satz mit kommaseparierter Liste. Schwer als Eingabe zu validieren.
- #6 "Gemeinsame Teiler finden": parsed.items geben nur die Teiler-Mengen der einzelnen Zahlen an (z.B. "T₁₀ = {1, 2, 5, 10}, T₃₀ = ..."), nicht die gemeinsamen Teiler als Antwort. Die Aufgabe fragt aber nach den gemeinsamen Teilern.
- #8 "Gruppen bilden — Teiler im Alltag": parsed.items enthalten Erklärungstext ("Gruppen mit 1, 2, 3, 6, 9 oder 18 Kindern → 6 Möglichkeiten") — nicht als Eingabe validierbar.
- #9 "Ferienlager-Rätsel": parsed.items[0] hat `antwort: "31 Kinder."` — Einheit im Antworttext.
- #39 "Preisvergleich — Was ist günstiger pro Stück?": parsed.items enthalten mehrzeilige Erklärungen als Antwort — nicht als Eingabe validierbar.
- #40 "Sponsorenlauf — Einnahmen berechnen": parsed.items[0] hat `antwort: "20,00 €"` — Einheitensymbol in der Antwort, Kind tippt vermutlich nur "20".
- #41 "Sponsorenlauf — Gesamteinnahmen vergleichen": parsed.items[0] hat mehrzeilige Rechnung als Antwort — nicht als einzelne Eingabe validierbar.
- #42 "Sponsorenlauf — Gerecht aufteilen": parsed.items[0] hat `antwort: "69,75 € pro Projekt."` — Erklärungstext statt Zahl.
- #44 "Sponsorenlauf — Klassenvergleich": parsed.items[0] hat mehrzeilige Rechnung als Antwort — nicht als einzelne Eingabe validierbar.
