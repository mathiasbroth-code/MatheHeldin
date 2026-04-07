# Audit: 12-massstab-orientierung.json
Geprüft: 27 Aufgaben (keine Platzhalter in dieser Datei)

---

## Fehler

- **#28 "Passenden Maßstab für ein DIN-A4-Blatt finden":** Die Aufgabe hat keine eindeutige Lösung — der `didaktischerHinweis` stellt selbst fest: "Mehrere richtige Antworten möglich (z. B. 1 : 250 oder 1 : 300)". Das `parsed.items[0].antwort`-Feld enthält aber nur `"250"`. Ein Kind, das z. B. "300" eingibt, würde fälschlicherweise als falsch markiert. Entweder muss der `typ` auf `auswahl` geändert werden (mit mehreren akzeptablen Werten als Optionen), oder die App-Logik muss einen Bereich von Maßstäben (z. B. 200–400) als korrekt akzeptieren.

---

## Warnungen

- **#3 "Wirkliche Größe berechnen — starke Vergrößerung":** `loesung: "3"` und `parsed.items[0].antwort: "3"` fehlt die Einheit. Die Aufgabe fragt "Wie groß ist die Kopflaus in Wirklichkeit?" — die vollständige Antwort wäre "3 mm". Alle anderen vergleichbaren Aufgaben (#2, #4) geben die Einheit in der `loesung` an. Konsequenz: Ein Kind, das "3 mm" eingibt, wird als falsch gewertet, obwohl es richtig antwortet. Empfehlung: `antwort: "3"` ist zur maschinellen Auswertung akzeptabel, wenn die Frage explizit "Gib in mm an" lautet — das fehlt aber in `aufgabenstellung` und `items[0].frage`.

- **#13 "Maßstab auf der Karte — Strecken berechnen":** Inkonsistentes Antwort-Format zwischen den beiden Teilaufgaben:
  - `items[0].antwort: "1.000 m"` — enthält Einheit und deutschen Tausenderpunkt
  - `items[1].antwort: "2.500"` — nur Zahl, keine Einheit
  Außerdem: Die Frage verlangt schon "in ___ m", d. h. die Einheit steht in der Frage. Das Antwortfeld bei a) sollte dann nur `"1000"` enthalten (ohne Einheit und ohne Punkt als Tausendertrennzeichen), analog zu b). Ein Kind, das "1000" eingibt, würde bei a) als falsch gewertet.

- **#10 "Foto oder Grundriss?":** Im `tipps[3]` (Lösungs-Tipp) steht `"massstabsgetreü"` — Tippfehler (ü statt u, fehlendes Leerzeichen). Korrekt wäre `"maßstabsgetreue"`.

- **#15 "Streckenlänge bei verschiedenen Maßstaben vergleichen":** `loesung: "a) 5\nb) 10\nc) 20"` ohne Einheit. Die `aufgabenstellung` sagt "Gib in km an", die `parsed.items[].antwort`-Felder enthalten `"5"`, `"10"`, `"20"` — das ist konsequent und korrekt für maschinelle Auswertung. Kein Problem, aber zur Klarheit sollte in `items[].frage` "(in km)" ergänzt werden, damit das Kind weiß, in welcher Einheit es antworten soll.

- **#28 "Passenden Maßstab für ein DIN-A4-Blatt finden" (zusätzlich zu Fehler oben):** In `tipps[1]` steht `"1 cm = 2 m (Maßstab 1 : 200): 60 : 2 = 30 cm — das passt knapp nicht"`. Das ist korrekt. Aber der Tipp rechnet mit Metern statt cm, was für ein Kind der 4. Klasse einen Einheitenwechsel mitten im Rechenweg bedeutet und ungewohnt ist. Didaktisch wäre es besser, durchgängig in einer Einheit zu rechnen.

---

## Mathematische Prüfung (alle Ergebnisse)

Alle übrigen Rechenwerte sind korrekt nachgerechnet:

| # | Titel | Rechnung | Ergebnis |
|---|-------|----------|----------|
| 1 | Maßstab verstehen | konzeptuell | ✓ |
| 2 | Rosenkäfer Vergrößerung | 40 mm : 2 = 20 mm | ✓ |
| 3 | Kopflaus 20:1 | 60 mm : 20 = 3 mm | ✓ (Einheit fehlt, s.o.) |
| 4 | Blauwal 1:500 | 6 cm × 500 = 3.000 cm = 30 m | ✓ |
| 5 | Maßstab zuordnen | 3:1 V, 1:1.000 Vk, 1:1 O, 10:1 V, 1:50.000 Vk | ✓ |
| 6 | Schulgebäude 3 Maßstäbe | 4.000:200=20, 4.000:500=8, 4.000:1.000=4 | ✓ |
| 7 | Bildlänge/echte Länge gemischt | 30:5=6, 8.000:2.000=4, 15×100=1.500cm=15m | ✓ |
| 8 | Käfer Maßstab ermitteln | 45:15=3 → 3:1 | ✓ |
| 9 | Himmelsrichtungen | N/O/S/W | ✓ |
| 10 | Burgbegriffe zuordnen | Graben→B, Wehrgang→A, Kapelle→C, Hof→D | ✓ |
| 11 | Luftaufnahme vs Grundriss | konzeptuell | ✓ |
| 12 | Standort Foto | konzeptuell | ✓ |
| 13 | Himmelsrichtung Grundriss | rechts=O, unten=S, links=W | ✓ |
| 14 | Perspektive wechseln | Von Süden: Südseite des Hauses | ✓ |
| 15 | Grundriss Räume zuordnen | sachkundig korrekt | ✓ |
| 16 | Wanderkarte 1:25.000 | 4×25.000=100.000cm=1.000m; 10×25.000=250.000cm=2.500m | ✓ |
| 17 | Wanderung planen | 16×25.000=400.000cm=4km; 4×20=80min | ✓ |
| 18 | Maßstäbe vergleichen | 20×25k=5km, 20×50k=10km, 20×100k=20km | ✓ |
| 19 | Maßstab 1:200.000 ermitteln | 10km=1.000.000cm; 1.000.000:5=200.000 → 1:200.000 | ✓ |
| 20 | Planquadrat G5 | G=Zeile, 5=Spalte → G5 | ✓ |
| 21 | Stadtplan 1:10.000 Entfernungen | 3×100=300m, 5×100=500m, 2,5×100=250m | ✓ |
| 22 | 1km auf 1:10.000-Karte | 100.000:10.000=10cm | ✓ |
| 23 | Maßstab 1:10 Wirklichkeit→Bild | 80:10=8, 120:10=12, 50:10=5 | ✓ |
| 24 | Maßstab 1:10 Bild→Wirklichkeit | 15×10=150, 9×10=90, 22×10=220 | ✓ |
| 25 | Klassenzimmer 1:100 | 800:100=8, 600:100=6 | ✓ |
| 26 | Karte 1:1.000 | 5×1.000=5.000cm=50m | ✓ |
| 27 | Insekt Vergrößerung | 6cm=60mm; 60:3=20 → 20:1 | ✓ |
| 28 | DIN-A4 Maßstab finden | 6.000:250=24✓, 4.000:250=16✓ (aber mehrdeutig) | Fehler s.o. |

---

## Zusammenfassung

- **1 Fehler** (kritisch): Aufgabe #28 hat mehrere richtige Lösungen, akzeptiert aber nur eine.
- **4 Warnungen**: Fehlende Einheiten in Antwortfeldern (#3), inkonsistentes Format (#13), Tippfehler in Tipp (#10-Foto/Grundriss), unklare Einheit für Kindereingabe (#15).
- Alle 28 Rechenergebnisse sind mathematisch korrekt.
