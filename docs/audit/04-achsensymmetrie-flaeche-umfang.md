# Audit: 04-achsensymmetrie-flaeche-umfang.json
Geprüft: 26 Aufgaben (keine Platzhalter vorhanden)

---

## Fehler

### #10 "Symmetrisch oder nicht? — Figuren beurteilen": Falsches `thema`-Feld
`thema` = `"Faltschnitte"` — die Aufgabe handelt jedoch von Symmetrieachsen an geometrischen Figuren und Buchstaben (Quadrat, Dreieck, Buchstabe X). Das `stageId`-Feld ist korrekt (`achsensymmetrie`), aber `thema` muss `"Achsensymmetrische Bilder"` lauten. Durch die falsche Zuordnung landet diese Aufgabe in der falschen Kategorie.

### #12 "Rechte Winkel finden — Wo stecken rechte Winkel?": Copy-Paste-Fehler in `parsed.items[3].antwort`
Teilaufgabe d) fragt: *„Der Buchstabe T (aus geraden Linien)"*.  
`antwort` lautet: `"Der Buchstabe E hat 4 rechte Winkel (oben, bei beiden mittleren Verbindungen und unten)"`.  
Das ist eine Antwort aus Aufgabe #16 (Buchstaben E, H, L, T, Z), die hier versehentlich eingefügt wurde. Buchstabe **T** hat **2** rechte Winkel (links und rechts an der T-Kreuzung) — wie in der `loesung` desselben Feldes korrekt angegeben. Das `antwort`-Feld widerspricht damit der `loesung` und enthält den falschen Buchstaben.  
**Richtig:** `"Der Buchstabe T hat 2 rechte Winkel (links und rechts an der Verbindungsstelle)."`

---

## Warnungen

### #12 "Rechte Winkel finden": Widerspruch zwischen `loesung` und `parsed.items[3].antwort`
Das Feld `loesung` gibt für den Buchstaben T korrekt 2 rechte Winkel an. Das `parsed`-Feld enthält (wie oben beschrieben) die falsche E-Antwort. Beide Felder sind für dieselbe Teilaufgabe — der Widerspruch kann zu inkonsistentem Verhalten in der App führen, wenn ein Feld für die Anzeigelogik und das andere für die Prüflogik verwendet wird.

### #1 "Symmetrieachsen erkennen — Welche Figur ist symmetrisch?": Lückenhafter Lösungsweg für Buchstabe B
`richtig = false` für B ist geometrisch akzeptabel, da der Großbuchstabe B in der Standarddruckschrift asymmetrisch ist (untere Rundung größer als obere). Der `loesungsweg` prüft aber **nur** die senkrechte Achse: *„Die obere und untere Hälfte sind ähnlich, aber an einer senkrechten Achse passt es nicht genau."* Die waagerechte Achse wird nicht explizit untersucht. Ein aufmerksames Kind könnte berechtigterweise fragen: *„Aber ist B nicht waagerecht symmetrisch?"* — und erhält keine Antwort. Der Lösungsweg sollte ergänzen, dass auch die waagerechte Achse geprüft wurde und aufgrund der ungleichen Rundungen nicht passt.

### #15, #19, #20, #21, #22, #24, #25, #26: `antwort`-Felder bei `textaufgabe` nicht direkt eingebbar
In allen `textaufgabe`-Aufgaben enthalten die `parsed.items[].antwort`-Felder vollständige Rechenwege und Erklärungstexte statt reiner Ergebnisse. Beispiele:
- `"Umfang = 2 · (8 cm + 3 cm) = 2 · 11 cm = 22 cm"` statt `"22 cm"`
- `"Die andere Seite ist 4 cm lang. (2 · (6 + x) = 20 → 6 + x = 10 → x = 4)"` statt `"4 cm"`
- `"Umfang = 12 cm (Man zählt: 3 cm unten + 1 cm hoch + ...)"` — mehrere Sätze

Ein Kind kann diese Texte nicht als Eingabe verwenden. Wenn die App die `antwort`-Felder für automatische Validierung nutzt, ist eine Gleichheits-Prüfung nicht möglich. Alle betroffenen Felder sollten das **Ergebnis** in eingebbarer Form enthalten; der Rechenweg gehört in `loesungsweg` oder `erklaerung`.

### #14 "Welche Form entsteht? — Senkrechte Strecken verbinden": Potenziell verwirrende Differenzierung Quadrat/Raute
Die entstehende Figur (auf der Spitze stehendes Quadrat) sieht für Viertklässler wie eine Raute aus — Option C. Die Aufgabe erklärt im `loesungsweg`, dass bei *ungleich* langen Strecken eine Raute entsteht, was impliziert, dass hier ein Quadrat korrekt ist. Diese Abgrenzung ist geometrisch richtig, kann Kinder aber ohne visuelle Hilfe verwirren, da die Figur in typischer Orientierung (auf der Spitze) optisch einer Raute ähnelt. Empfehlung: Im `frageText` oder in einem der Tipps klarstellen, dass ein auf der Spitze stehendes Quadrat trotzdem ein Quadrat ist.

---

## Gesamtbewertung

Die mathematischen Ergebnisse in allen 26 Aufgaben sind — mit Ausnahme des Copy-Paste-Fehlers in #12 — **korrekt nachgerechnet**. Die Tipp-Struktur (Impuls → Denkanstoß → Teilantwort → vollständige Lösung) ist in allen Aufgaben sauber umgesetzt und sprachlich kindgerecht. Die kritischen Punkte sind der faktische Fehler im `antwort`-Feld von #12 (falscher Buchstabe, falsche Zahl) und das systemweite Format-Problem in den `antwort`-Feldern der `textaufgabe`-Aufgaben.
