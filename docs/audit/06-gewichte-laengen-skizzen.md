# Audit: 06-gewichte-laengen-skizzen.json
Geprüft: 41 Aufgaben (keine Platzhalter vorhanden)

---

## Fehler

- **#19** "Geschwindigkeiten vergleichen — km/h berechnen": `parsed.items[1]` (Radfahrer, b) hat `antwort: "4"` — das ist mathematisch falsch. Korrekt: 60 min ÷ 30 min × 8 km = 2 × 8 = **16** km/h. Der Wert `4` ist der des Fußgängers (a) und wurde offensichtlich fälschlicherweise kopiert. Die `loesung` im Freitext nennt korrekt 16, das `parsed`-Objekt widerspricht ihr.

---

## Warnungen

### Mathematik / Logik

- **#9** "Tiervergleich — Wie viele Tiere wiegen so viel wie ...?": `parsed.items[0]` (a) hat `antwort: "ungefähr 11 Pferde"`. Das Ergebnis 6500 ÷ 600 ≈ 10,83 → 11 ist rechnerisch korrekt, aber das `antwort`-Feld enthält Erklärungstext statt einer eingebbaren Zahl. Item (b) hat sauber `"20"`. Inkonsistenz im selben parsed-Objekt.

### Antwort-Format (Eingabe nicht eindeutig)

- **#8** "Futterbedarf im Zoo berechnen": `parsed.items[1].antwort = "1.800 kg"` und `[2].antwort = "4.200 kg"` — diese Werte enthalten Einheit und Tausenderpunkt. Item [0] hat dagegen `"600 kg"` mit Einheit, aber ohne Tausenderpunkt. Ein Kind, das nur `1800` eingibt, würde womöglich nicht als richtig gewertet. Empfehlung: Einheit aus `antwort` herausnehmen, nur Zahl (`"600"`, `"1800"`, `"4200"`).

- **#12** "Futtermenge berechnen — Blauwal und Elefant": `parsed.items[0].antwort = "20 Tage"` und `[1].antwort = "50 Tage"` — Einheit im Antwortwert. Mathématisch korrekt (4000 ÷ 200 = 20, 4000 ÷ 80 = 50), aber Format inkonsistent mit anderen Aufgaben.

- **#22** "Schwalben-Reise": `parsed.items[0].antwort = "180 Stunden"` — Einheit im Antwortwert. Rechnerisch korrekt (9000 ÷ 50 = 180), aber Eingabe-Format unklar.

- **#9** (Zusatz zu oben): `parsed.items[0].antwort = "ungefähr 11 Pferde"` ist kein maschinenprüfbarer Wert. Sollte `"11"` sein (mit Hinweis im `frage`-Text auf "ungefähr").

### Typ-Passung

- **#37** "Urlaubsfahrt — km und Pausen": `typ: "schritt"` ist kein im Stage-Interface definierter Standardtyp (die Liste in `CLAUDE.md` kennt: `eingabe`, `schritt`, `luecke`, `auswahl`, `zuordnung`, `wahr-falsch`, `textaufgabe`, `reihenfolge`). `schritt` taucht in der Aufzählung auf — aber das `parsed`-Objekt hat eine eigene `teilaufgaben[].schritte[]`-Struktur, die von keinem anderen Aufgaben-typ verwendet wird. Hinweis: Falls der Renderer diesen Typ noch nicht unterstützt, würde die Aufgabe nicht dargestellt.

### Tipps-Qualität

- **#19** "Geschwindigkeiten vergleichen": Tipp 3 rechnet ausschließlich den Fußgänger (a) durch, erwähnt den Radfahrer (b) nicht — obwohl b) den einzigen Rechenfehler im `parsed`-Objekt enthält und damit der kniffligste Fall ist. Nach Korrektur des Fehlers sollte Tipp 3 auch b) anreissen.

- **#29** "Skizze Gartenzaun": Die `loesung` nennt `2 × 7 + 2 × 3 − 1 = 14 + 6 − 1 = 19 m`, der `loesungsweg` rechnet korrekt Umfang = 20 m, dann 20 − 1 = 19 m. Beide Darstellungen sind inhaltlich gleich — die `loesung` kombiniert aber die Subtraktion des Tors direkt in die Formel, was für ein Kind leicht verwirrend sein kann (warum taucht die −1 mitten in der Formel auf?). Keine echte Falschinformation, aber didaktisch uneinheitlich.

---

## Korrekte Aufgaben (Stichproben bestätigt)

Alle übrigen 39 Aufgaben wurden nachgerechnet und sind mathematisch korrekt:
- Tonnen/kg-Umrechnungen (#0–#4): alle Werte stimmen
- Fahrzeuggewichte (#5–#6): stimmen, einschließlich der Proberechnung mit 5 PKW
- Tiersteckbriefe (#7–#13): alle Reihenfolgen, Multiplikationen und Divisionen korrekt
- Entfernungsaufgaben (#14–#18, #31–#40): alle Additionen und Subtraktionen korrekt
- Geschwindigkeiten (#20–#23): alle Werte korrekt (außer dem Fehler in #19b)
- Skizzenaufgaben (#24–#30): alle Lösungswege korrekt nachvollzogen
- Tipp-Progression (4-stufig): bei allen geprüften Aufgaben vorhanden und aufbauend strukturiert; Tipp 4 gibt jeweils die vollständige Lösung
