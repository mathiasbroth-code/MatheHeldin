# Audit: 02-zahlen-bis-million.json
Geprüft: 76 Aufgaben (ohne 1 Platzhalter)

## Fehler

- #12 "Zahl als Additionsaufgabe schreiben": `parsed.items[].antwort` enthält Gleichungstexte statt reiner Zahlen (z.B. `"63.407 = 60.000 + 3.000 + 400 + 7"`). Ein Kind kann das nicht als Eingabe tippen. Entweder `typ` auf `"textaufgabe"` umstellen oder Antworten auf reine Zerlegung kürzen (z.B. `"60.000 + 3.000 + 400 + 7"`).

- #22 "Rechenpäckchen — Welche Stelle ändert sich?": `parsed.items` enthält nur 1 Item (`222.228`), obwohl die Aufgabe 6 Teilaufgaben hat (222.228 / 222.282 / 222.822 / 228.222 / 282.222 / 822.222). Es fehlen 5 Items.

- #23 "Rechenpäckchen vervollständigen": `parsed.items` enthält nur 2 Items (`555.558` und `888.881`), obwohl die Aufgabe 12 Teilaufgaben hat (6 Additionen, 6 Subtraktionen). Es fehlen 10 Items.

- #31 "Anzahl schaetzen — Maiskörner in der Packung": **Titel stimmt nicht mit Aufgabentext.** Der Titel sagt "Maiskörner", aber die Aufgabenstellung handelt von "Reiskörner". Titel auf "Reiskörner" korrigieren.

- #37 "Zahlenstrahl — verschiedene Ausschnitte": `parsed.items[].antwort` enthält Mehrfachwerte als String (z.B. `"A = 755.000, B = 795.000, C = 820.000"`). Ein Kind kann das nicht in ein einzelnes Eingabefeld tippen. Muss in 6 separate Items aufgeteilt werden (A=755.000, B=795.000, C=820.000, D=432.300, E=432.700, F=432.900).

- #59 "Diagramm mit gerundeten Zahlen erstellen": Zwei Probleme:
  1. Marburg fehlt komplett in `parsed.teilaufgaben[0].schritte` (Einwohner 76.401, gerundet 80.000).
  2. Schritt 9 hat `frage: "Summe:"` und `antwort: "110.000."` — die Frage fragt nach den zwei Städten mit gleicher Rundung, aber die Antwort ist nur eine Zahl (mit störendem Punkt am Ende). Muss entweder umformuliert werden oder in zwei separate Items aufgeteilt werden ("Trier" und "Jena").

## Warnungen

- #14 "Zahlenrätsel — Welche Zahlen können es sein?": `parsed.items[2].antwort` = `"420.100, 440.200, 460.300, 480.400"` — vier Werte in einem String. Für automatisiertes Auswerten sollten es vier separate Items (b1–b4) sein, analog zu a1/a2.

- #21 "Fünf Plättchen in der Stellenwerttafel": `parsed.items[].antwort` enthält Erklärungstext statt einer Zahl (z.B. `"- 500.000 (5 Plättchen auf HT)"`). Aufgabe ist offen (3 größte / 3 kleinste Zahlen). Entweder `digital` auf `"teilweise"` setzen oder Antworten auf reine Zahlenwerte kürzen.

- #35 "Schätzung überprüfen" c): `richtig: false`, aber `erklaerung` sagt "ist eine gute Schätzung". Der Widerspruch (falsch markiert, aber als akzeptabel beschrieben) kann ein Kind verwirren. Empfehlung: `erklaerung` eindeutiger formulieren (z.B. "Stimmt nicht — 54 und 70 liegen zu weit auseinander") oder `richtig: true` setzen, falls man 70 als akzeptable Schätzung wertet.

- #45 "Nachbar-Tausender — welcher ist näher?" e): 67.500 liegt exakt in der Mitte. `loesung` sagt "gleich weit (Abstand 500 = 500)", aber `parsed.items[4].antwort` = `"68.000"` (aufgerundet). Das ist korrekt nach Rundungskonvention, aber der Aufgabentext fragt nach dem "näheren" Nachbarn — bei gleicher Distanz gibt es keinen näheren. Empfehlung: Im Fragetext "bei gleich weit: den größeren" ergänzen oder als Sonderfall behandeln.

- #50 "Auf welche Stelle wurde gerundet?": `typ` ist `"eingabe"`, aber die Antworten sind Textwörter ("Zehntausender", "Tausender" usw.). Ein Kind muss exakt den richtigen Stellenwert-Namen tippen — Tippfehler oder Varianten (z.B. "ZT" statt "Zehntausender") führen zu falscher Bewertung. Empfehlung: `typ` auf `"auswahl"` umstellen mit Optionen E/Z/H/T/ZT/HT.

- #55 "Gerundete Zahlen zuordnen — welche Zahl passt?": Typ-Passung fraglich. Die Aufgabenstellung fragt "Welche Zahlen könnten die Originalzahl sein?" (Antwort: c und e), aber die `parsed.items` lassen jede Zahl einzeln runden und den gerundeten Wert eingeben. Das ist eine andere Aufgabe als die eigentliche Frage. Entweder `typ` auf `"auswahl"` (mit Mehrfachauswahl c+e) umstellen oder die Aufgabe als Runden-Übung belassen (dann Titel/Aufgabenstellung anpassen).

- #58 "Zahlen runden — offene Aufgabe": `parsed.items[].antwort` enthält Erklärungstext (z.B. `"z.B. 237.501 oder 238.499 (jede Zahl zwischen 237.500 und 238.499)"`). Bei offenen Aufgaben mit vielen Lösungen ist automatisiertes Auswerten schwierig. `digital: "teilweise"` ist korrekt gesetzt, aber die Antwort sollte trotzdem auf einen Beispielwert reduziert werden (z.B. `"238.000"`).
