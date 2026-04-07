# Audit: intensiv-division.json
Geprüft: 43 Aufgaben (keine Platzhalter vorhanden)

Alle Rechenergebnisse wurden manuell nachgerechnet (Node.js-Skript). Themenblöcke: Vielfache (12 Aufgaben), Teiler (13 Aufgaben), Halbschriftliches Dividieren (10 Aufgaben), Schriftliches Dividieren (8 Aufgaben).

---

## Fehler

### #27 "Teiler-Rätsel — Nur eine Zahl passt"
**Mathematisch:** `loesung` und `parsed.items[0].antwort` geben nur `"12."` an. Tatsächlich haben aber **zwei** gerade Zahlen unter 20 genau 6 Teiler: 12 und 18. Dies wird im `loesungsweg` korrekt erkannt ("Hm, auch 18 hat 6 Teiler!"), aber weder in `loesung` noch in `parsed.items[0].antwort` widergespiegelt. Das Kind würde mit "18" als Antwort als falsch bewertet werden, obwohl es mathematisch korrekt ist.

**Fix:** `loesung` → `"12 und 18."`, `parsed.items[0].antwort` → `"12 und 18."` Alternativ die Aufgabenstellung präzisieren, sodass eindeutig eine Zahl gesucht ist (z.B. "Ich bin kleiner als 15").

---

## Warnungen

### #1 "Vielfache aufschreiben — 3er- und 7er-Reihe"
**Antwort-Format:** Die Aufgabenstellung hat 6 Lücken pro Teilaufgabe (z.B. "3, 6, ___, ___, ___, ___, ___, ___"). `parsed.items[].antwort` enthält nur das letzte Vielfache ("24" und "56"). Das ist intern konsistent (auch `loesung` und `loesungsweg` nennen nur das letzte), aber ein Kind, das alle 6 Lücken einzeln eintippen müsste, könnte durch das Format verwirrt werden. Falls die App nur ein Endfeld pro Teilaufgabe anzeigt, ist das Format OK — sollte sie 6 Felder zeigen, fehlen die Zwischenwerte.

### #11 "Zahlenrätsel — Vielfaches finden"
**Antwort-Format:** `parsed.items[].antwort` enthält Erklärungstexte statt eingabefähige Antworten (z.B. `"42 (6 · 7 = 42) oder 49 (7 · 7 = 49)"`). Kein Kind tippt solch einen Text ein. Da `typ = "textaufgabe"` ist, wird dies vom Renderer wahrscheinlich als Freitext-Referenz behandelt — aber eine digitale Auswertung ist damit nicht möglich. Empfehlung: Entweder `typ` auf `"auswahl"` ändern (da zwei Optionen pro Teilaufgabe richtig sind) oder die Antwort auf die reinen Zahlen reduzieren ("42 oder 49").

### #24 "Rätsel — Teiler und Bedingungen", Teilaufgabe b)
**Grenzfall:** Die Aufgabe fragt nach einer Zahl "zwischen 30 und 50", die durch 2, 3 und 5 teilbar ist. Die Lösung ist 30. Das Wort "zwischen" wird im Deutschen oft exklusiv verstanden (also > 30 und < 50), was keine Lösung ergeben würde (nächste wäre 60). Der `loesungsweg` behandelt 30 als gültig, ohne die Grenzwert-Interpretation zu erklären. Empfehlung: Formulierung ändern zu "von 30 bis 50" oder "ab 30 bis unter 50" um Ambiguität zu vermeiden.

### #9 "Vielfache in der Sachaufgabe — Eierkartons", Teilaufgabe c)
**Antwort-Format / Mehrdeutigkeit:** Die Frage "Wie viele Eier bräuchte sie, damit kein Ei übrig bleibt?" hat zwei mathematisch vertretbare Antworten: 48 (weniger Eier, gleiche Kartons) oder 54 (mehr Eier, ein Karton mehr). `loesung` und `parsed.items[].antwort` nennen beide Optionen korrekt. Für eine Grundschulaufgabe ist die Fragestellung aber sprachlich ambig — in Schulbüchern ist üblicherweise genau eine Antwort erwartet. Das ist keine mathematische Fehler, aber didaktisch unscharf.

### Tipps-Qualität: Aufgabe #12 "Wie heißt die Zahl? — Rückwärts rechnen mit Vielfachen"
**Aufbau der Tipps:** Tipp 1 fragt allgemein ("Was ist das Fünffache von 60?"), Tipp 2 erklärt die Methode, Tipp 3 liefert einen konkreten Zwischenschritt für a), Tipp 4 gibt die vollständige Lösung. Das ist gut gestaffelt. Allerdings geht Tipp 3 nur auf Teilaufgabe a) ein — b) bleibt unbegleitet bis Tipp 4. Für Aufgabe b) (die schwieriger ist) fehlt ein eigener Zwischenschritt-Tipp. Empfehlung: Tipp 3 auf beide Teilaufgaben ausweiten.

---

## Mathematisch korrekte Aufgaben (Auswahl wichtiger geprüfter Werte)

| Aufgabe | Geprüfte Rechnung | Ergebnis |
|---------|-------------------|----------|
| Vielfache #1–14 | Alle 8er-Reihen, gemeinsame Vielfache, Quersummen | korrekt |
| Teiler #16–29 | T(8), T(15), T(10), T(24), T(30), T(16), T(21), T(36), T(32), T(36) | korrekt |
| Halbschriftlich #30–44 | 48:4, 76:4, 91:7, 96:8, 728:8, 504:6, 50:3 R2, 67:4 R3, 371:7, 738:9, 389:6 R5, 527:4 R3, 845:9 R8, 473:8 R1, 1.246:7 | korrekt |
| Schriftlich #45–59 | 846:2, 3.528:4, 7.592:4, 42.735:5, 63.216:8, 4.218:7 R4, 5.040:6, 827×6=4.962, 1.955:6 R5, 7.215:5=1.443, 3.024:4=756, 6.042:6=1.007, 15.372:6, 27.846:9=3.094, 56.042:7=8.006, 25.956:4=6.489 | korrekt |
| Firma-Boni | 34.272:6=5.712, 31.360:5=6.272, Differenz 560 | korrekt |
