# Audit: 02-zahlen-bis-million.json
Geprüft: 76 Aufgaben (ohne 1 Platzhalter)

## Fehler

- #21 "Zahlenrätsel — Zahl mit Bedingungen finden" (Teilaufgabe b): **Falsche Lösung durchgehend.**
  - Bedingungen: E=7, Z=4, HT=2·T, ZT=3·T, Plättchen=22.
  - Gesamtrechnung: HT+ZT+T+H+Z+E = 2T+3T+T+H+4+7 = 6T+H+11 = 22 → H = 11−6T. Mit T=1: H=5, HT=2, ZT=3.
  - Korrekte Zahl: **231.547** (HT=2, ZT=3, T=1, H=5, Z=4, E=7 → Plättchen 2+3+1+5+4+7=22 ✓).
  - Fehlerhafte Zahl in `loesung`, `loesungsweg`, Tipp 4 und `parsed.items[1].antwort`: **213.547**.
  - Probe für 213.547: HT=2, ZT=1, T=3 → HT=2·T wäre 2·3=6≠2 (FALSCH), ZT=3·T wäre 3·3=9≠1 (FALSCH).

- #22 "Vier Plättchen in der Stellenwerttafel — größte und kleinste Zahl": **Titel stimmt nicht mit Aufgabe überein.**
  - `titel` sagt "Vier Plättchen".
  - `aufgabenstellung`, `loesung` und `parsed` arbeiten durchgängig mit **fünf Plättchen** (z. B. "Lege fünf Plättchen", Lösung 500.000 = 5 Plättchen auf HT).
  - Entweder den Titel auf "Fünf Plättchen" korrigieren oder die Aufgabe auf vier Plättchen umstellen.

## Warnungen

- #3 "Blöcke in Stellenwerttafel eintragen": **Antwort-Format nicht eingabetauglich.**
  - `parsed.items[].antwort` enthält den rohen Markdown-Tabellenrahmen `|---|----|----|---|---|---|---|` statt eines lesbaren Zahlenwerts (z. B. "352" bzw. "352.000"). Ein Kind kann diesen Wert nicht sinnvoll eintippen. Lösung: Antwort als Zahl hinterlegen, Tabelle als Visualisierung separat behandeln.

- #15 "Zahlenrätsel — Welche Zahlen können es sein?": **Mehrfachwert in einem `antwort`-Feld.**
  - `parsed.items[2].antwort` = `"420.100, 440.200, 460.300, 480.400"` — vier Werte in einem String. Automatisiertes Auswerten nicht möglich; für Teilaufgabe b) wären vier separate Items (b1–b4) konsistenter mit dem Muster der Teilaufgaben a1/a2.

- #27 "Plusaufgaben bilden — Ergebnis im Bereich": **Antwort ist kein eingebbarer Wert.**
  - `parsed.items[0].antwort` = `"Mögliche Aufgaben (mehrere Lösungen möglich):"` — das ist Beschreibungstext, kein Zahlenwert. Da die Aufgabe offen ist (mehrere Lösungen), sollte `digital` auf `"teilweise"` bleiben und das Antwort-Feld zumindest eine Beispiellösung als Zahl enthalten (z. B. `"241.000"`), damit der Validator funktionieren kann.

- #38 "Zahlenstrahl — verschiedene Ausschnitte": **Aufgabentext ist mehrdeutig.**
  - `aufgabenstellung` beschreibt Punkt A als "liegt 1 Strich nach 750.000". Die Lösung ist 755.000, was einem halben Zehntausender-Abschnitt (5.000-Strich) entspricht. Der Text sagt aber "Zehntausenderstrich alle 10.000" und gibt dann "1 Strich nach 750.000" — ein Kind könnte "1 Strich = 10.000" lesen und käme auf 760.000. Empfehlung: Aufgabentext klarer formulieren, z. B. "A liegt auf dem kleinen Strich zwischen 750.000 und 760.000".
