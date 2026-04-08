# Audit: 04-achsensymmetrie-flaeche-umfang.json
Geprueft: 24 Aufgaben (ohne Platzhalter)

## Fehler
Keine mathematischen Fehler gefunden. Alle 24 Aufgaben sind rechnerisch korrekt.

Die im vorherigen Audit gemeldeten Fehler (#10 falsches thema-Feld, #12 Copy-Paste-Fehler in parsed.items[3].antwort) sind behoben.

## Warnungen

### Antwort-Format

- #1 "Wie viele Symmetrieachsen? -- Formen untersuchen": Item d) `antwort = "unendlich"` -- fuer ein 9-jaehriges Kind schwer einzutippen. Besser als Auswahl-Aufgabe umsetzen oder akzeptierte Varianten erweitern.

- #10 "Rechte Winkel finden -- Wo stecken rechte Winkel?": Item d) `antwort = "Der Buchstabe T hat 2 rechte Winkel (links und rechts an der Verbindungsstelle)."` -- langer Erklaerungstext statt einfacher Zahl "2". Items a-c haben konsistent numerische Antworten ("4", "4", "1").

- #13 "Strecken parallel oder senkrecht? -- Buchstaben analysieren": Alle drei Items haben ausfuehrliche Erklaerungstexte als Antwort (z.B. "Parallele Linien: E, H, Z"). Fuer digitale Eingabe problematisch -- ein Kind kann das nicht eintippen.

- #18 "Gleicher Umfang, verschiedene Formen -- Was ist moeglich?": Items haben zusammengesetzte Antworten ("1 cm x 7 cm, Flaeche: 7 qcm"). Mehrere Werte pro Feld, schwer digital eingebbar.

- #20 "Blumenbeet planen -- Flaecheninhalt und Umfang kombinieren": Items a-c haben zusammengesetzte oder Aufzaehlungs-Antworten ("1 m x 12 m, 2 m x 6 m, 3 m x 4 m"). Gleiche Problematik wie #18.

### Didaktik

- #14 "Welche Form entsteht? -- Senkrechte Strecken verbinden": Die entstehende Figur (auf der Spitze stehendes Quadrat) sieht fuer Viertklaessler wie eine Raute aus (Option C). Die Unterscheidung Quadrat vs. Raute ist geometrisch korrekt, kann aber ohne visuelle Hilfe verwirren. Empfehlung: Im frageText klarstellen, dass ein gedrehtes Quadrat trotzdem ein Quadrat ist.
