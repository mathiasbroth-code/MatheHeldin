# Audit: 10-kreise-muster-koerper.json
Geprüft: 26 Aufgaben (3 Platzhalter übersprungen: #4 "Radius am Kreis ablesen", #11 "Spiegelachsen in der Parkettierung finden", #12 "Parkettierung fortsetzen")

---

## Fehler

- **#1 "Charlys Futterplatz"**: `parsed.items[1].antwort` ist `"A, B, D"` — das ist die Antwort auf Teilaufgabe a), nicht auf b). Teilaufgabe b) fragt *"Welche Form hat Charlys Futterplatz?"*. Die korrekte Antwort müsste `"Kreis"` oder `"Ein Kreis mit Radius 3 m"` lauten. Die Antwort "A, B, D" (Pflanzenauswahl) ist hier sachlich falsch.

- **#6 "Kreismuster mit dem Zirkel"**: `tipps[3]` ist ein leerer String `""`. Tipp 4 muss die vollständige Lösung liefern — hier fehlt er komplett. Dasselbe gilt für:
  - **#15 "Schablone aus Dreieck herstellen"**: `tipps[3]` ist `""`.
  - **#26 "Schrägbild zeichnen"**: `tipps[3]` ist `""`.

---

## Warnungen

- **#1 "Charlys Futterplatz"**: `parsed.items[1]` (Teilaufgabe b, Formfrage) hat `typ: textaufgabe`, aber die Frage nach der Form ("Kreis") ist eine Freitextantwort ohne klar definierten Erwartungswert. Ein Kind tippt "Kreis", das System erwartet nichts Klares — hier fehlt eine saubere Spezifikation des Antwortformats.

- **#7 "Jettes Kreismuster analysieren"**: Die `antwort`-Felder in `parsed.items` enthalten erklärende Sätze statt eingabefähiger Werte:
  - `items[0].antwort = "7 Kreise"` → sollte `"7"` sein.
  - `items[1].antwort = "Ja, alle Kreise haben den gleichen Radius."` → für ein Eingabefeld unpraktikabel; besser als `wahr-falsch`-Typ modellieren.
  - `items[2].antwort = "Sie hat die Schnittpunkte der Kreise mit geraden Linien verbunden..."` → sehr langer Freitext, kein Kind kann das exakt so eintippen; hier fehlt eine klar akzeptable Kurzantwort.

- **#14 "Formen-Check: Parkettiert das oder nicht?"**: Der Loesungsweg enthält die Begründung `"Dreieck: 6 · 60° = 360°"` — das stimmt nur für das *gleichseitige* Dreieck. Die Aufgabe fragt aber nach einem *beliebigen* Dreieck. Die Aussage `wahr: true` für d) ist korrekt, aber die Begründung ist geometrisch unvollständig und könnte bei Kindern falsche Vorstellungen wecken. Empfehlung: Begründung durch "Jedes Dreieck lässt sich durch Drehen und Spiegeln parkettieren — die Winkel ergänzen sich immer zu 360°" ersetzen.

- **#21 "Schachtel bauen — Wie viele Laschen?"**: `parsed.items[1].antwort = "5 Faltkanten (die Kanten, an denen die Flächen im Netz zusammenhängen)"` und `items[2].antwort = "7 Klebelaschen (12 - 5 = 7)"`. Die Rechenresultate (5 bzw. 7) sind korrekt, aber die Erklärungstexte in Klammern gehören nicht ins `antwort`-Feld — ein Kind kann das nicht so eintippen. Die `antwort`-Felder sollten `"5"` und `"7"` lauten.

- **#24 "Würfelgebäude — Schrägbild dem Bauplan zuordnen"**: Der `loesungsweg` bezeichnet die Baupläne intern als "Bauplan 1, 2, 3, 4" (Ziffern), während die `parsed.choices` mit Buchstaben A–D beschriftet sind. Das ist inkonsistent und verwirrt beim Debugging: "A (L-Form) = Bauplan 1" müsste "A (L-Form) → Bauplan B" heißen. Die `parsed.antworten` selbst sind korrekt.

---

## Hinweise (kein Fehler, aber prüfenswert)

- **#19 "Körper und Netze zuordnen"**: Netz a) wird beschrieben als "Vier Dreiecke, die von einem Punkt ausgehen". Ein echtes Dreieckspyramiden-Netz besteht aus einem zentralen Dreieck mit drei anliegenden Dreiecken (nicht alle von einem Punkt ausgehend). Die Beschreibung ist geometrisch ungenau, die Zuordnung zu F (Dreieckspyramide) ist aber korrekt.

- **#17 "Ist das ein Quadernetz?"** (wahr-falsch): `tipps[2]` enthält eine Lücke `"sind es ___"` ohne Auflösung — das ist didaktisch korrekt als Denkstoß formuliert und kein Fehler.

- **#6, #15, #26** (alle `reihenfolge`-Typ): Tipp 4 ist leer (siehe Fehler oben). Für Reihenfolge-Aufgaben sollte Tipp 4 die korrekte Reihenfolge explizit nennen, z. B.: *"Die richtige Reihenfolge ist: b → d → a → c."*
