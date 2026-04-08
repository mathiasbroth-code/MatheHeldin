# Audit: 03-addition-subtraktion-rechenregeln.json
Geprüft: 72 Aufgaben (ohne 1 Platzhalter: #54 "Platzhalter in Ungleichungen finden")

---

## Fehler

- #44 "Klammern setzen, damit das Ergebnis stimmt": typ=luecke, aber die `antwort`-Werte (480, 10, 880, 70) sind identisch mit den Ergebniszahlen, die bereits in der `frage` stehen (z.B. "90 + 30 · 4 = 480"). Das Kind soll Klammerpositionen angeben, nicht das schon sichtbare Ergebnis eintippen. Entweder muss die Antwort die Klammernotation enthalten (z.B. "(90 + 30) · 4") oder der Typ muss geaendert werden.

- #71 "Zahlenraetsel als Textaufgabe — einfach": typ=eingabe, aber `antwort` ist "Die gedachte Zahl ist 20." statt "20". Die EingabeView erwartet einen numerischen Vergleich — der Textanteil fuehrt zu Fehlabgleich.

- #72 "Zahlenraetsel als Textaufgabe — knifflig": typ=eingabe, aber `antwort` ist "Die gedachte Zahl ist 150." statt "150". Gleiches Problem wie #71.

---

## Warnungen

- #7 "Fuenfstellige Zahlen bilden und subtrahieren": Die Aufgabenstellung verlangt "mindestens zwei Moeglichkeiten", aber `parsed.items[0].antwort` zeigt nur ein Beispiel ("100.000 − 64.815 = 35.185"). Fuer die digitale Auswertung muss die Aufgabe als offene Freitext-Eingabe behandelt oder das Antwortfeld erweitert werden.

- #8 "Schriftliches Subtrahieren mit grossen Zahlen": Im `loesungsweg` steht ein leicht missverstaendlicher Zwischenschritt ("H: 4 − 1 = 3 (mit Anpassung)"). Die Antworten (3.316, 5.358, 3.277) sind alle korrekt.

- #22 "Einkaufsliste mit Budget planen": Die Aufgabe fordert "moeglichst nahe an 1.500 Euro", aber `parsed.items[0].antwort` zeigt die bessere Loesung mit 1.493,80 Euro. Das ist ein sehr langer Text (178 Zeichen) — als Freitexteingabe fuer ein 9-jaehriges Kind kaum eingebbar. Besser als offene Aufgabe mit Musterloesung behandeln.

- #15 "Ergebnisse von ANNA-Subtraktionen vergleichen": typ=eingabe mit nur 1 Item ("Was ergeben alle vier ANNA-Subtraktionen?", Antwort "4.455"). Die Aufgabenstellung im `aufgabenstellung`-Feld ist wesentlich komplexer (Zuordnungsaufgabe mit 4 Rechnungen und 4 Ergebnis-Buchstaben). Der parsed-Typ vereinfacht die Aufgabe stark.

- #50 "Gleichung zu einer Sachsituation schreiben": typ=textaufgabe, `antwort` ist "Gleichung: 78 + 65 = 55 + ▢" — eine Gleichung mit Platzhalterzeichen. Schwer einzugeben fuer ein Kind; besser als Anzeige-Aufgabe mit Musterloesung oder als numerische Antwort (88) umformatieren.

---

## Notizen (keine Fehler, aber beachtenswert)

- Alle 72 Aufgaben (ohne Platzhalter) wurden einzeln nachgerechnet. Saemtliche Rechenergebnisse in `loesung`, `parsed.items[].antwort`, `loesungsweg` und `tipps` sind mathematisch korrekt. Dies betrifft: Rechenpaeckchen (#0–#2), Ergaenzungsaufgaben (#3–#5), grosse Subtraktionen (#6), ANNA/NANA-Zahlen (#13–#17), Ueberschlagsaufgaben (#18–#27), Rechenketten (#28–#33), Zahlenraetsel (#34–#38), Punkt-vor-Strich und Klammern (#39–#46), Gleichungen/Ungleichungen (#47–#53), Geld-Ueberschlagen (#55–#60), Ergebnis-Pruefen (#61–#66), Platzhalter (#67–#70).

- Typ-Passung: `typ` und `parsed.typ` stimmen bei allen 72 Aufgaben ueberein.

- Tipps: Alle 72 Aufgaben haben exakt 4 Tipps. Die Staffelung (Impuls, Denkansatz, Teilantwort, volle Loesung) ist durchgehend eingehalten. Sprache ist kindgerecht.

- Zuordnungsaufgaben (#25, #32, #51): Alle Zuordnungen (item-labels zu choice-labels) sind inhaltlich korrekt verifiziert.

- Auswahl-Aufgaben (#40, #55–#60): Alle `richtigeIdx`-Werte zeigen auf die mathematisch korrekte Option.

- Wahr-Falsch-Aufgaben (#13, #19, #23–#27, #61–#66): Alle `richtig`-Werte stimmen mit der Nachrechnung ueberein. Die absichtlich falschen Ergebnisse und ihre Korrekturen in den Erklaerungen sind korrekt.
