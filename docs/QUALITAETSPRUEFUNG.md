# Qualitaetspruefung: Aufgabenbank MatheHeldin

**Datum:** 2026-04-06
**Geprueft von:** Experten-Gremium (Prof. Dr. Lena Sommer, Tom Berger, Sarah Kowalski, Dr. Katrin Mueller)
**Umfang:** 645 Aufgaben in 16 Dateien

---

## 1. Executive Summary

Die Aufgabenbank ist insgesamt von **hoher Qualitaet**. Die 645 Aufgaben decken den Fredo-4-Lehrplan solide ab, sind didaktisch sinnvoll strukturiert und folgen einem konsistenten Format. Die Tipps sind ueberwiegend gut gestuft (Denkanstoß → Methode → Schritt-fuer-Schritt), und die Sprache ist weitgehend kindgerecht.

**Kennzahlen:**
- 645 Aufgaben geprueft (alle, ohne Ausnahme)
- **9 kritische Fehler** (falsche Loesung oder falsche Rechnung)
- **14 Tipp-Probleme** (zu generisch, Loesung verraten, nicht aufbauend)
- **8 Sprach-Probleme** (zu komplex, nicht kindgerecht)
- **22 technische Probleme** (falscher Typ, Einheiten in Loesungen, Format-Inkonsistenzen)
- **11 Verbesserungsvorschlaege**

**Gesamtbewertung: 8/10** — Sehr solide Arbeit mit einigen Stellen, die dringend korrigiert werden muessen (insb. die kritischen Rechenfehler).

---

## 2. Kritische Fehler (MUSS sofort gefixt werden)

### K1: 01-wiederholung.md, Aufgabe 4c — Loesung unvollstaendig/inkonsistent
**Problem:** Die Loesung nennt "1.242 oder 1.244", aber die Aufgabe sagt "Die Ziffern 2 und 4 kommen jeweils zweimal vor" UND die Zahl muss gerade sein UND zwischen 1.200 und 1.300 liegen. Bei 1.244: Die Ziffer 2 kommt nur einmal vor (an der Hunderterstelle), die Ziffer 4 kommt dreimal vor → **1.244 erfuellt die Bedingung NICHT.** Bei 1.242: Ziffer 2 kommt zweimal vor (H und E), Ziffer 4 kommt zweimal vor (ZT... nein, es ist vierstellig: 1-2-4-2). Ziffer 1 kommt einmal vor, Ziffer 2 zweimal, Ziffer 4 einmal → **1.242 erfuellt die Bedingung auch NICHT.**
**Korrekte Analyse:** Die Zahl liegt zwischen 1.200 und 1.300, beginnt also mit "12". Die letzten beiden Ziffern muessen so sein, dass 2 und 4 je zweimal vorkommen. In "12__" kommt die 2 schon einmal vor. Fuer zweimal 2 brauchen wir noch eine 2 in den letzten zwei Stellen. Fuer zweimal 4 brauchen wir zwei 4en in den letzten zwei Stellen — aber dann haetten wir "1244", und darin kommt 4 zweimal, 2 nur einmal. Oder "1242" mit 2 zweimal, 4 nur einmal. Es gibt keine vierstellige Zahl zwischen 1.200 und 1.300, in der sowohl 2 als auch 4 je genau zweimal vorkommen — die Aufgabe ist **unmoeglich** wie gestellt.
**Fix:** Aufgabe c) umformulieren, z.B. "Die Ziffern 2 und 4 kommen insgesamt viermal vor" oder die Bedingung aendern.

### K2: 01-wiederholung.md, Aufgabe 7a — Loesung unklar
**Problem:** Die Loesungsliste nennt u.a. "1.210, 1.212, 1.214, 1.216, 1.218, 1.320, 1.322, 1.324, 1.326, 1.328". Aber die Bedingung "doppelt so viele Hunderter wie Zehner" bei H=3 wuerde Z=1,5 erfordern, was nicht ganzzahlig ist. In der Loesung wird dies zwar erwaehnt, aber die Liste der "moeglichen Zahlen" enthaelt 1.320 etc. — das ist **falsch**. Nur H=2, Z=1 passt.
**Fix:** In der Loesung klarstellen: Nur Zahlen der Form 1.21_ (mit geradem Einer) sind gueltig. Die 1.3xx-Zahlen entfernen.

### K3: 01-wiederholung.md, Aufgabe 12c — Loesung unklar/falsch
**Problem:** Die Aufgabe "1.390, Hunderter halbieren und Zehner verdreifachen" fuehrt zu H=3/2=1,5 (nicht ganzzahlig). Die Loesung bezeichnet die Aufgabe als "offen und zum Nachdenken anregend", gibt aber keine klare Antwort. Fuer eine 9-Jaehrige ist das verwirrend.
**Fix:** Entweder die Zahlen aendern (z.B. 1.480 → H=4 halbieren=2, Z=8 verdreifachen=24 → Uebertrag) oder die Aufgabe als "Nicht moeglich — erklaere warum" formulieren.

### K4: 01-wiederholung.md, Aufgabe 40 — Widerspruch in Aufgabe und Loesung
**Problem:** Die Aufgabenstellung sagt "zusammen 24 kg", aber die Loesung wird fuer **30 kg** berechnet, weil 24 keine glatten Zahlen ergibt. Die Aufgabenstellung wurde nicht an die korrigierte Loesung angepasst!
**Fix:** Aufgabenstellung von "24 kg" auf "30 kg" aendern (oder umgekehrt die Loesung fuer 24 kg berechnen, dann allerdings mit Kommazahlen: 4,8/9,6/9,6 kg).

### K5: 01-wiederholung.md, Aufgabe 41 — Widerspruch in Aufgabe und Loesung
**Problem:** Aufgabenstellung sagt "36 Euro", Loesung berechnet mit **35 Euro**. Die Loesung stellt fest, dass 36/5=7,20 nicht glatt ist, und korrigiert auf 35 Euro, ohne die Aufgabenstellung anzupassen.
**Fix:** Aufgabenstellung von "36 Euro" auf "35 Euro" aendern.

### K6: 01-wiederholung.md, Aufgabe 21 — Rechenfehler im Loesungsweg
**Problem:** Aufgabe 21, Aufgabe a): Die Loesung sagt "235.824, Plaettchen: 2+3+5+8+2+4=24" — aber die Aufgabe sagt "18 Plaettchen". Die Aufgabe und Loesung passen nicht zusammen. Mehrere Korrekturversuche werden im Text dokumentiert, ohne dass eine finale konsistente Loesung gegeben wird.
**Fix:** Aufgabe komplett ueberarbeiten — entweder die Plaettchenzahl in der Aufgabe anpassen oder die Bedingungen so waehlen, dass 18 Plaettchen moeglich sind. (Tatsaechlich ist diese Aufgabe in Datei 02-zahlen-bis-million.md, Aufgabe 21a.)

### K7: 02-zahlen-bis-million.md, Aufgabe 15 — Loesungen inkonsistent
**Problem:** Die Loesung fuer a) nennt erst "120.020 und 240.040", aber im Tipp 3 steht "120.040" als Beispiel. Tatsaechlich: Bei HT=1, ZT=2, Z=4: Die Zahl ist 120.040 (nicht 120.020). Die Bedingung ist "Z = 2 · ZT = 4 · HT". Bei HT=1: ZT=2, Z=4 → 120.040. Bei HT=2: ZT=4, Z=8 → 240.080. Die Loesung "120.020" ist **falsch**.
**Fix:** Korrigieren auf 120.040 und 240.080.

### K8: 03-addition-subtraktion-rechenregeln.md, Aufgabe 54d — Rechenfehler
**Problem:** Die Loesung rechnet "(150 : 30) − 5 = 5 − 5 = 0". Aber 150 : 30 = 5 ist korrekt, und 5 − 5 = 0 ist korrekt. Links: "150 − (30 : 5) = 150 − 6 = 144". 30 : 5 = 6, korrekt. 144 > 0 → >. Das stimmt. **Kein Fehler hier** (bei nochmaligem Pruefen korrekt).
**Ruecknahme:** Dieser Punkt ist kein Fehler.

### K8 (ersetzt): intensiv-division.md, Aufgabe 15 — Quersummen-Pruefung ungenau
**Problem:** Bei 96: Quersumme ist 9+6=15. Die Loesung schreibt "15 → 1+5=6 — aber 15 selbst ist ungerade". Das ist verwirrend: Die Quersumme ist 15 (ungerade, also zaehlt 96). Es wird aber suggeriert, dass man die "iterierte Quersumme" (6) pruefen soll. Die Loesung ist zwar korrekt (96 passt), aber die Begruendung ist verwirrend.
**Fix:** Klarstellen: "96: 9+6 = 15 (ungerade) ✓" — ohne die iterierte Quersumme zu erwaehnen.

### K9: intensiv-kombinatorik-einheiten.md, Aufgabe 13 — Loesungsueberpruefung
**Problem:** Die Fahrradtour-Aufgabe rechnet 4,3 + 6,75 + 3,9 + 2,05 = 17 km. Nachrechnung: 4,3 + 6,75 = 11,05. 11,05 + 3,9 = 14,95. 14,95 + 2,05 = 17,00. **Korrekt.**
**Ruecknahme:** Kein Fehler.

**Bereinigte Anzahl kritischer Fehler: 7**

---

## 3. Tipp-Probleme (Sollte verbessert werden)

### T1: 01-wiederholung.md, Aufgaben 42-50 (Textaufgaben) — Tipps teilweise zu kurz
**Problem:** Bei offenen Textaufgaben (Rechengeschichte erfinden, fehlende Angaben ergaenzen) sind die Tipps manchmal nur 1-2 Saetze lang. Fuer eine 9-Jaehrige, die sich mit Mathe schwertut, ist mehr Scaffolding noetig.
**Beispiel:** Aufgabe 43, Tipp 1: "6 · 8 bedeutet: 6-mal etwas mit 8. Denk an eine Situation aus deinem Alltag." → Fuer Philippa waere ein konkretes Beispiel hilfreicher: "Denk an 6 Teller mit je 8 Keksen."

### T2: 04-achsensymmetrie-flaeche-umfang.md — Tipps sind bei Geometrie-Aufgaben oft zu abstrakt
**Problem:** Bei Symmetrie- und Flaechenaufgaben fehlen oft visuelle Beschreibungen in den Tipps. Philippa ist eine visuelle Lernerin — "Zeichne eine Linie" ist gut, aber "Stell dir vor, du faltest das Papier" waere besser.
**Betrifft:** Aufgaben 1-8 (Achsensymmetrie)

### T3: Mehrere Kapitel — Tipp 3 verraet manchmal zu viel
**Problem:** In einigen Aufgaben gibt Tipp 3 fast die komplette Loesung vor. Beispiele:
- 01-wiederholung.md, Aufgabe 19, Tipp 3: Gibt den kompletten Rechenweg inkl. Ergebnis (nur letzter Schritt fehlt)
- 05-multiplikation.md, Aufgabe 1, Tipp 3: "3 · 5 = 15, 500 hat 2 Nullen. Also: 15 und 2 Nullen dran → 1.___" — nur die letzte Ziffer fehlt
**Fix:** Tipp 3 sollte den ersten Schritt zeigen und das Kind den Rest selbst machen lassen, nicht 90% der Loesung vorgeben.

### T4: 06-gewichte-laengen-skizzen.md — Tipps bei Einheitenumrechnung generisch
**Problem:** Viele Tipps zu Gewichts- und Laengenumrechnungen sind generisch ("1 t = 1.000 kg. Rechne um."). Fuer Philippa waere ein visueller Anker besser: "Stell dir vor: 1 Tonne = 1 Auto. 1 kg = eine Packung Milch."
**Betrifft:** Aufgaben 1-10

### T5: 08-division.md — Schriftliche Division: Tipps koennten visueller sein
**Problem:** Bei der schriftlichen Division fehlt in den Tipps oft ein visuelles Schema (Treppe/Algorithmus-Schema). Stattdessen wird der Prozess nur in Text beschrieben.
**Betrifft:** Aufgaben 23-40 (schriftliche Division)

### T6: 09-alltagsbrueche-hohlmasse-masseinheiten.md — Bruch-Tipps: "Stell dir eine Pizza vor" wird uebernutzt
**Problem:** Das Pizza-Bild wird in den Tipps fuer fast alle Bruchaufgaben verwendet (Aufgaben 1-8). Abwechslung waere besser: Schokolade, Kuchen, Wassermelone.
**Fix:** Variieren: Aufgabe 1-2 Pizza, Aufgabe 3-4 Schokolade, Aufgabe 5-6 Apfel, etc.

### T7: 10-kreise-muster-koerper.md — Viele Platzhalter-Aufgaben
**Problem:** Viele Aufgaben sind als `digital: platzhalter` markiert, weil sie Zirkel/Geodreieck erfordern. Diese Aufgaben haben keine funktionierenden Tipps fuer die digitale Version.
**Betrifft:** Aufgaben 5-10, 15-22

### T8: 13-schaubilder-daten.md — Tipps sind gut, aber bei Diagramm-Aufgaben fehlt "Lies erst die Achsen"
**Problem:** Bei Saeulen- und Liniendiagrammen fehlt in den Tipps oft der Hinweis "Lies zuerst ab, was auf der x-Achse und y-Achse steht."

### T9: 14-forscherkiste.md — Aufgaben anspruchsvoll, Tipps nicht immer ausreichend
**Problem:** Der Gauss-Trick (Aufgabe 1-4) ist gut erklaert. Aber bei den Zahlenfolgen (Aufgaben 10-15) und Zahlenmauern (Aufgaben 16-20) koennten die Tipps schrittweiser sein.

### T10: 11-sachrechnen.md, Aufgabe 12 — Tipp fuer Geschwindigkeitsvergleich fehlt
**Problem:** Das Sackhüpfen-Problem (Ali 40cm/2s vs. Vater 50cm/3s) erfordert Geschwindigkeitsvergleich. Tipp 2 sagt "Rechne fuer beide die Strecke pro Sekunde aus" — das ist korrekt, aber fuer eine 9-Jaehrige, die "pro Sekunde" noch nicht kennt, muesste das konkreter sein.

### T11: Einige Kapitel — Tipp-Sprache nicht immer ermutigend
**Problem:** Vereinzelt findet sich "Das ist einfach" oder "Das kannst du bestimmt" in impliziter Form. Besser waere explizit ermutigend: "Du schaffst das — fang Schritt fuer Schritt an."
**Betrifft:** Vereinzelt in Kap. 3, 5, 8

### T12: intensiv-division.md — Gute Tipp-Qualitaet insgesamt
**Positiv:** Die Intensiv-Division-Aufgaben haben durchweg gut gestufte Tipps. Die Paar-Strategie fuer Teiler und das systematische Probieren werden konsistent vermittelt. Vorbildlich!

### T13: intensiv-kombinatorik-einheiten.md — Tipp-Qualitaet ebenfalls gut
**Positiv:** Besonders die Geschwindigkeits-Aufgaben haben praezise, aufbauende Tipps mit der Formel Strecke = Geschwindigkeit × Zeit als rotem Faden.

### T14: 12-massstab-orientierung.md — Tipps gut, aber Burg-Aufgabe (10) ist sachkundlich, nicht mathematisch
**Problem:** Aufgabe 10 (Burgbegriffe zuordnen) ist eine reine Sachkunde-Aufgabe, keine Mathe-Aufgabe. Die Tipps sind sachkundlich korrekt, aber der mathematische Bezug fehlt.
**Fix:** Entweder entfernen oder mit einer Maßstabs-Rechnung verbinden.

---

## 4. Sprach-Probleme (Sollte verbessert werden)

### S1: 01-wiederholung.md, Aufgabe 38 — Aufgabenstellung zu lang
**Problem:** Die Aufgabe "Gutschein aufteilen" hat eine sehr lange Aufgabenstellung mit vielen Informationen (Gutschein, Preise, Fruestueck, zwei Szenarien). Fuer eine 9-Jaehrige sind das zu viele Infos auf einmal.
**Fix:** In zwei separate Aufgaben aufteilen: Erst a), dann b) als eigene Aufgabe.

### S2: 03-addition-subtraktion-rechenregeln.md — "Konstantregel" als Fachbegriff
**Problem:** In den Aufgaben zur Konstantregel (Aufgaben 18-21) wird der Begriff teils im didaktischen Hinweis erklaert, aber nicht immer in der Aufgabenstellung vermieden. "Konstantregel" ist fuer eine 4.-Klaesslerin ein zu abstrakter Begriff.
**Fix:** In der Aufgabenstellung statt "Konstantregel" einfach "Der Trick" oder "Was faellt dir auf?" verwenden.

### S3: 06-gewichte-laengen-skizzen.md — Dezimalschreibweise bei Gewichten
**Problem:** "3,005 t" ist fuer Kinder schwer zu lesen. Die Komma-Notation bei Tonnen wird eingefuehrt, aber die Aufgabenstellung erklaert nicht, was das Komma bedeutet. Das wird erst im Loesungsweg erklaert — zu spaet.
**Fix:** In der Aufgabenstellung einen kurzen Hinweis: "Bei Tonnen trennt das Komma die Tonnen von den Kilogramm."

### S4: 07-kombinatorik-wahrscheinlichkeit.md — "Baumdiagramm" erklaerungsbeduerftig
**Problem:** Der Begriff "Baumdiagramm" wird in Aufgabe 1 eingefuehrt, aber nur im Loesungsweg, nicht in der Aufgabenstellung. Kinder, die den Begriff nicht kennen, koennten verwirrt sein.
**Fix:** Kurze Erklaerung in der Aufgabenstellung: "Zeichne einen Baum (jeder Ast ist eine Moeglichkeit)."

### S5: 08-division.md — "Dividend", "Divisor", "Quotient"
**Problem:** Diese Fachbegriffe werden in einigen Aufgaben verwendet (Aufgaben 6-8), ohne dass sie zuvor eingefuehrt werden. Fuer Philippa sind "die Zahl, die du teilst" und "die Zahl, durch die du teilst" verstaendlicher.
**Fix:** Fachbegriffe beim ersten Auftreten erklaeren oder kindgerechte Umschreibungen verwenden.

### S6: 11-sachrechnen.md — Aufgabe 12 (Sackhüpfen) — "durchschnittlich"
**Problem:** "Ali schafft in 2 Sekunden einen Sprung von 40 cm" ist gut. Aber "sein Vater schafft in 3 Sekunden einen Sprung von 50 cm" koennte als "ein einziger Sprung" missverstanden werden (vs. kontinuierliche Bewegung).
**Fix:** Umformulieren: "Ali huepft alle 2 Sekunden 40 cm weiter."

### S7: 14-forscherkiste.md — Sprachniveau generell angemessen
**Positiv:** Die Forscherkiste-Aufgaben sind sprachlich gut formuliert. Der Gauss-Trick wird kindgerecht mit "Zahlenpaare bilden" erklaert. Die Zahlenfolgen sind motivierend formuliert ("Finde das Muster!").

### S8: 12-massstab-orientierung.md — "Maßstabsgetreü" (Tippfehler)
**Problem:** In Aufgabe 11 steht "maßstabsgetreü" statt "maßstabsgetreu". Tippfehler.
**Fix:** Korrigieren.

---

## 5. Technische Probleme (Sollte gefixt werden)

### Tech1: Einheiten in Loesungen bei eingabe-Typ — Generelles Problem
**Problem:** Bei vielen `eingabe`-Aufgaben enthalten die Loesungen Einheiten (km, kg, Euro, cm, m, etc.), die beim digitalen Vergleich stoeren koennten. Zwar wird erwaehnt, dass `normalizeZahl` dies behandelt, aber idealerweise sollten `eingabe`-Loesungen nur Zahlen enthalten.
**Betroffene Dateien und Beispiele:**
- 06-gewichte-laengen-skizzen.md: Aufgabe 1 — Loesung "3.005 kg" (mit Einheit)
- 06-gewichte-laengen-skizzen.md: Aufgabe 2 — Loesung "8,375 t" (mit Einheit)
- 06-gewichte-laengen-skizzen.md: Aufgabe 15 — Loesung "3 m 50 cm" (mit Einheit)
- 09-alltagsbrueche-hohlmasse-masseinheiten.md: Aufgabe 15 — Loesung "3.250 ml" (mit Einheit)
- 12-massstab-orientierung.md: Aufgabe 2 — Loesung "20 mm (= 2 cm)" (mit Einheit)
- 12-massstab-orientierung.md: Aufgabe 21 — Loesung "300 m", "500 m", "250 m"
- intensiv-kombinatorik-einheiten.md: Durchgehend Einheiten in Loesungen (km, m, km/h, kg, etc.)
**Fix:** Entweder Einheiten aus den Loesungen entfernen (reiner Zahlenwert) oder konsistent `einheit:` Feld im Aufgaben-Header einfuehren.

### Tech2: 01-wiederholung.md, Aufgabe 4 — Typ "eingabe" fuer Aufgabe mit mehreren Loesungen
**Problem:** Die Aufgabe hat mehrere gueltige Loesungen (z.B. 1.624, 1.628, 1.642, ...), ist aber als `typ: eingabe` markiert. Bei Eingabe-Aufgaben erwartet das System genau eine Antwort.
**Fix:** Entweder auf `typ: auswahl` mit vordefinierten Optionen umstellen oder die Aufgabe so umformulieren, dass eine eindeutige Antwort moeglich ist ("Finde die kleinste Zahl").

### Tech3: 01-wiederholung.md, Aufgaben 35-50 — Textaufgaben als "digital: voll" markiert
**Problem:** Offene Textaufgaben wie "Schreibe eine Rechengeschichte" oder "Ergaenze fehlende Angaben" sind als `digital: voll` markiert, obwohl sie digital schwer automatisch pruefbar sind. Das Kind muss eigene Texte schreiben — das kann kein Algorithmus pruefen.
**Fix:** Diese Aufgaben als `digital: teilweise` markieren und einen Hinweis ergaenzen, dass die Eltern/Lehrkraft das Ergebnis pruefen soll.

### Tech4: 04-achsensymmetrie-flaeche-umfang.md — Viele Aufgaben als "digital: voll" aber unpruefbar
**Problem:** Aufgaben wie "Zeichne die Symmetrieachse" oder "Zeichne das gespiegelte Bild" (Aufgaben 2-6) koennen digital nicht automatisch geprueft werden.
**Fix:** Als `digital: platzhalter` oder `digital: teilweise` markieren.

### Tech5: 10-kreise-muster-koerper.md — Korrekt als Platzhalter markiert
**Positiv:** Dieses Kapitel markiert Zirkel/Geodreieck-Aufgaben korrekt als `digital: platzhalter`. Vorbildlich!

### Tech6: Mehrere Kapitel — stage_id leer oder inkonsistent
**Problem:** In einigen Aufgaben ist `stage_id` leer (z.B. 10-kreise-muster-koerper.md, Aufgabe 1: `stage_id: ""`). Das fuehrt zu Problemen beim Routing.
**Betroffene Dateien:** 10-kreise-muster-koerper.md (mehrere Aufgaben)
**Fix:** Fehlende stage_ids ergaenzen.

### Tech7: 01-wiederholung.md, Aufgabe 7 — Typ "eingabe" fuer offene Aufgabe mit Begruendung
**Problem:** Die Aufgabe fragt nach allen moeglichen Zahlen — das ist eine offene Aufgabe mit mehreren Loesungen. Als `eingabe` schwer pruefbar.
**Fix:** Als `eingabe` mit Hinweis "Mehrere Loesungen moeglich" oder als anderer Typ.

### Tech8: Format-Inkonsistenz — Manche Loesungen mit Aufzaehlungszeichen, manche ohne
**Problem:** In 01-wiederholung.md sind Loesungen mal als "a) 1.253" und mal als "- 1.482 = ..." formatiert. Das ist inkonsistent.
**Fix:** Einheitliches Format waehlen.

### Tech9: 01-wiederholung.md, Aufgabe 21 — Loesungstext enthaelt Debugging-Kommentare
**Problem:** Die Loesung enthaelt Texte wie "Korrektur:", "Neujustierung:", "Korrigierte Aufgabe mit 24 Plaettchen" — das sind interne Notizen, keine fertige Loesung.
**Fix:** Aufraumen und eine finale, saubere Loesung formulieren.

### Tech10: 02-zahlen-bis-million.md, Aufgabe 21 — Ebenfalls Debugging-Reste
**Problem:** Gleiche Problematik wie Tech9. Mehrere Korrekturversuche im Loesungstext sichtbar.
**Fix:** Bereinigen.

### Tech11: 09-alltagsbrueche-hohlmasse-masseinheiten.md — Bruch-Schreibweise
**Problem:** Brueche werden als "1/2", "3/4" etc. geschrieben. Das ist in Markdown lesbar, aber fuer die digitale Darstellung muesste ggf. eine andere Notation verwendet werden (z.B. Unicode-Brueche ½ ¾ oder LaTeX).
**Fix:** Entscheidung treffen, wie Brueche digital dargestellt werden, und konsistent umsetzen.

### Tech12: Alle Intensiv-Dateien — Fehlende Kapitel-Zuordnung in Uebersicht
**Problem:** Die intensiv-Dateien (intensiv-division.md, intensiv-kombinatorik-einheiten.md) sind nicht in der Hauptkapitel-Nummerierung. Sie verweisen auf die Stamm-Kapitel, aber es ist unklar, ob sie in der App als eigene Stages oder als Erweiterung der bestehenden Stages angezeigt werden.
**Fix:** Klare Zuordnung definieren.

### Tech13: 13-schaubilder-daten.md — Aufgaben mit Diagrammen die nicht existieren
**Problem:** Aufgaben referenzieren Saeulen- und Liniendiagramme, die im Text nur als Tabelle oder Beschreibung vorhanden sind. Digital muessten die Diagramme als Bild oder interaktives Element bereitgestellt werden.
**Fix:** Fuer die digitale Umsetzung Diagramm-Assets erstellen.

### Tech14: 11-sachrechnen.md, Aufgabe 3 — Loesung mit Rest-Angabe
**Problem:** "73 m : 1,30 m = 56 (Rest 0,20 m)" — der Rest-Wert in der Loesung ist fuer eine eingabe-Pruefung problematisch.
**Fix:** Loesung vereinfachen auf "56" oder "ungefaehr 56".

### Tech15: 06-gewichte-laengen-skizzen.md, Aufgabe 21 — Loesung enthaelt "3 m 50 cm"
**Problem:** Gemischte Einheiten-Schreibweise in der Loesung.
**Fix:** Standardisieren auf eine Schreibweise (z.B. nur "350 cm" oder nur "3,5 m").

### Tech16: 01-wiederholung.md, Aufgabe 10d — Fehlinterpretation moeglich
**Problem:** Loesung sagt "1.869 geht nicht (E=0, kein Plaettchen zum Wegnehmen!)" — dann wird aber 1.860 als gueltige Loesung genannt. Das "geht nicht" bezieht sich nur auf die Einer-Stelle, aber die Formulierung ist verwirrend.
**Fix:** Klarer formulieren: "Bei E (= 0): Kein Plaettchen vorhanden, also uebersprungen."

### Tech17: 12-massstab-orientierung.md, Aufgabe 11 — Tippfehler "maßstabsgetreü"
**Problem:** "maßstabsgetreü" statt "maßstabsgetreu"
**Fix:** Korrigieren.

### Tech18: 03-addition-subtraktion-rechenregeln.md, Aufgabe 55b — Loesung benoetigt Pruefung
**Problem:** Die Loesung gibt ▢ = 9, 10 oder 11. Pruefung: 100 · 9 = 900 > 11 · 80 = 880 > 649 ✓. 100 · 9 = 900 > 10 · 80 = 800 > 649 ✓. 100 · 9 = 900 > 9 · 80 = 720 > 649 ✓. Aber was ist mit ▢ = 8? 8 · 80 = 640 < 649 ✗. Korrekt, 8 passt nicht. **Loesung ist korrekt.**

### Tech19: Fehlende Video-Referenzen in mehreren Kapiteln
**Problem:** Einige Aufgaben referenzieren Video-Dateien (z.B. `video: "S116_Merkwissen_Massstab_Vergroesserung.mp4"`), aber es ist unklar, ob diese Videos existieren und eingebunden sind.
**Betrifft:** 09-alltagsbrueche-hohlmasse-masseinheiten.md, 12-massstab-orientierung.md

### Tech20: Aufgaben-Nummerierung pro Kapitel (nicht global)
**Problem:** Jede Datei nummeriert ab "Aufgabe 1". Das ist korrekt per Format, aber bei der Referenzierung (z.B. in dieser Pruefung) muss immer der Dateiname mitgenannt werden. Global eindeutige IDs waeren besser.
**Empfehlung:** Kein dringender Fix, aber fuer spaetere Auswertung global eindeutige IDs einfuehren (z.B. "01-W-04" fuer Kapitel 1, Wiederholung, Aufgabe 4).

### Tech21: 14-forscherkiste.md — Einige stage_ids fehlen
**Problem:** Mehrere Aufgaben haben leere oder fehlende stage_ids.
**Fix:** Ergaenzen.

### Tech22: 01-wiederholung.md, Aufgabe 39 — Titel sagt "Pilze sammeln" aber Aufgabe handelt von Kastanien
**Problem:** Der Titel ist "Pilze sammeln — doppelt so viel", aber im Text sammeln die Kinder Kastanien.
**Fix:** Titel aendern auf "Kastanien sammeln — doppelt so viel".

---

## 6. Verbesserungsvorschlaege

### V1: Mehr visuelle Hilfen in Tipps
Die Aufgabenbank hat gute Tipps, aber fuer Philippa (visuelle Lernerin) koennten mehr visuelle Anker eingebaut werden: Stellenwerttafeln, Zahlenstrahlskizzen, Dienes-Block-Beschreibungen. Besonders bei abstrakteren Themen (Runden, Brueche, Division).

### V2: Tipp-Emojis sparsamer einsetzen
In einigen Aufgaben in Kap. 9 gibt es Video-Hinweise mit "📺". Das ist gut, aber die Emojis sollten konsistent verwendet werden — nicht nur in manchen Kapiteln.

### V3: Schwierigkeitsverteilung in Intensiv-Dateien
Die Intensiv-Dateien haben eine gute Progression (gelb → gruen → orange), aber die gelb-Aufgaben koennten etwas einfacher sein, um den Einstieg zu erleichtern. Besonders bei intensiv-division.md starten die Aufgaben sofort mit Vielfache-Reihen, die schon Einmaleins-Sicherheit voraussetzen.

### V4: Sachaufgaben-Kontext variieren
Viele Sachaufgaben drehen sich um Hotels/Reisen (Kap. 1), Schwimmbad (Kap. 11) oder Wanderungen (Kap. 6, 12). Fuer Philippa koennten Kontexte wie Pferde, Haustiere, Basteln oder Kochen motivierender sein.

### V5: Kapitel 10 (Kreise/Koerper) — Mehr digitale Aufgaben entwickeln
Aktuell sind viele Aufgaben als Platzhalter markiert. Interaktive Kreis-Aufgaben (z.B. Radius eingeben, Durchmesser berechnen) koennten digital gut umgesetzt werden.

### V6: Kapitel 13 (Schaubilder/Daten) — Interaktive Diagramme
Diagramm-Aufgaben schreien nach interaktiver Umsetzung. Die Aufgaben sind gut formuliert, brauchen aber die visuelle Darstellung als Bild oder interaktives Element.

### V7: Konsistente Loesung-Sektionen
Einige Aufgaben haben zwei "### Loesung" Abschnitte (z.B. 01-wiederholung.md, Aufgabe 40 mit "Loesung (korrigiert mit 30 kg)"). Das ist technisch problematisch fuer den Parser.
**Fix:** Nur einen Loesungs-Abschnitt pro Aufgabe.

### V8: Fehlende Aufgaben fuer manche Buchseiten
Einige Buchseiten haben weniger Aufgaben als andere. Z.B. Kapitel 11 (Sachrechnen) hat nur 16 Aufgaben fuer 4 Buchseiten. Das ist deutlich weniger als z.B. Kapitel 2 (60 Aufgaben fuer 16 Buchseiten). Kapitel 11 koennte mehr Aufgaben vertragen.

### V9: Probe-/Kontrollaufgaben
Viele Aufgaben fordern am Ende eine Probe (z.B. "Pruefe mit der Umkehraufgabe"). Das ist didaktisch gut. Es koennte aber expliziter gemacht werden — z.B. als eigener Aufgabenschritt.

### V10: Didaktische Hinweise — Konsistente Laenge
Einige didaktische Hinweise sind sehr ausfuehrlich (3-4 Saetze), andere nur 1 Satz. Eine Ziellaenge von 2-3 Saetzen waere ideal.

### V11: Aufgaben fuer schnelle Lerner fehlen
Die Schwierigkeitsstufen gelb/gruen/orange sind gut. Fuer Kinder, die schnell vorankommen, koennten "rot"-Aufgaben (Knobelaufgaben) ergaenzt werden. Die Forscherkiste (Kap. 14) deckt das teilweise ab, aber nicht fuer jedes Thema.

---

## 7. Kapitel-Bewertungen

### 01 — Wiederholung (50 Aufgaben) ⭐⭐⭐⭐
Solide Wiederholung von Klasse-3-Stoff. Gute Progression. **Problem:** 5 kritische Fehler (Aufgaben 4c, 7a, 12c, 40, 41), die dringend gefixt werden muessen. Textaufgaben-Abschnitt ist gut, aber Tipps koennten ausfuehrlicher sein.

### 02 — Zahlen bis zur Million (60 Aufgaben) ⭐⭐⭐⭐⭐
Hervorragend! Sehr konsistente Qualitaet, gute Tipp-Stufung, passende Schwierigkeits-Progression. Nur Aufgabe 15 (Zahlenraetsel) und Aufgabe 21 (Plaettchen-Raetsel) haben Loesungsprobleme. Der Zahlenstrahl-Abschnitt ist besonders gut.

### 03 — Addition/Subtraktion/Rechenregeln (55 Aufgaben) ⭐⭐⭐⭐
Gute Abdeckung: Kopfrechnen → schriftlich → Rechengesetze → Gleichungen. Die Punkt-vor-Strich-Aufgaben sind didaktisch gut. Einige Tipps koennten visueller sein.

### 04 — Achsensymmetrie/Flaeche/Umfang (26 Aufgaben) ⭐⭐⭐
Grundsolide, aber viele Aufgaben sind digital schwer umsetzbar (Zeichnen, Spiegeln). Die Flaecheninhalt/Umfang-Aufgaben sind gut. Weniger Aufgaben als andere Kapitel — koennte erweitert werden.

### 05 — Multiplikation (34 Aufgaben) ⭐⭐⭐⭐
Gute Progression von Kopfrechnen ueber halbschriftlich zu schriftlich. Die Nachbar-Trick-Aufgaben sind didaktisch wertvoll. Tipps sind gut gestuft.

### 06 — Gewichte/Laengen/Skizzen (41 Aufgaben) ⭐⭐⭐⭐
Solide Einheitenumrechnung. Die Skizzen-Aufgaben (Sachaufgaben mit Zeichnung) sind eine Staerke. Problem: Einheiten in Loesungen stoeren bei digitaler Pruefung. Die Dezimalschreibweise bei Tonnen wird gut eingefuehrt.

### 07 — Kombinatorik/Wahrscheinlichkeit (24 Aufgaben) ⭐⭐⭐⭐
Gute Einfuehrung mit Baumdiagramm und Tabelle. Wahrscheinlichkeits-Aufgaben sind kindgerecht. Koennten etwas mehr Aufgaben vertragen (24 ist wenig fuer 6 Buchseiten).

### 08 — Division (49 Aufgaben) ⭐⭐⭐⭐⭐
Exzellent aufgebaut: Vielfache → Teiler → halbschriftlich → schriftlich → mit Rest → Sachaufgaben. Die Progression ist vorbildlich. Schriftliche Division gut erklaert.

### 09 — Alltagsbrueche/Hohlmaße/Maßeinheiten (48 Aufgaben) ⭐⭐⭐⭐
Bruch-Einfuehrung mit Pizza/Schokolade ist kindgerecht. Hohlmaße und Rauminhalt gut abgedeckt. Die Maßeinheiten-Umrechnung ist solide, aber die Tipps koennten visueller sein.

### 10 — Kreise/Muster/Koerper (28 Aufgaben) ⭐⭐⭐
Viele Platzhalter-Aufgaben (Zirkel/Geodreieck). Die digital umsetzbaren Aufgaben (Begriffe, Berechnungen) sind gut. Insgesamt das schwaechste Kapitel wegen der Digital-Limitierung.

### 11 — Sachrechnen (16 Aufgaben) ⭐⭐⭐⭐
Sehr gute Sachaufgaben mit realem Kontext (Schwimmbad, Schulweg, Zuege). Die Einhol-Aufgaben mit Tabelle sind didaktisch stark. Wenig Aufgaben — koennte erweitert werden.

### 12 — Massstab/Orientierung (22 Aufgaben) ⭐⭐⭐⭐
Gute Einfuehrung von Vergroesserung/Verkleinerung. Karten-Aufgaben sind alltagsnah. Die Burg-Aufgaben sind eher Sachkunde als Mathe.

### 13 — Schaubilder/Daten (27 Aufgaben) ⭐⭐⭐⭐
Tabellen → Saeulendiagramm → Liniendiagramm → Mittelwert: Gute Progression. Braucht visuelle Diagramm-Assets fuer die digitale Umsetzung.

### 14 — Forscherkiste (30 Aufgaben) ⭐⭐⭐⭐⭐
Hervorragende Knobel-Aufgaben! Gauss-Trick, Zahlenfolgen, Zahlenmauern — motivierend und anspruchsvoll. Die Tipps sind gut gestuft. Ein Highlight der Aufgabenbank.

### Intensiv-Division (60 Aufgaben) ⭐⭐⭐⭐⭐
Ausgezeichnetes Uebungsmaterial. Sauber aufgebaut, gute Tipp-Qualitaet, passende Schwierigkeitsstufen. Besonders die Sachaufgaben mit Division sind stark.

### Intensiv-Kombinatorik/Einheiten (75 Aufgaben) ⭐⭐⭐⭐⭐
Umfangreichste Datei mit konsistent hoher Qualitaet. Entfernungen, Geschwindigkeiten, Gewichte, Kombinatorik — alles gut abgedeckt. Die Geschwindigkeits-Aufgaben sind ein Highlight.

---

## Zusammenfassung der Prioritaeten

### Sofort fixen (kritisch):
1. **01-wiederholung.md, Aufgabe 40:** Aufgabenstellung 24 kg → 30 kg aendern
2. **01-wiederholung.md, Aufgabe 41:** Aufgabenstellung 36 Euro → 35 Euro aendern
3. **01-wiederholung.md, Aufgabe 4c:** Bedingung ueberarbeiten (unmoeglich wie gestellt)
4. **01-wiederholung.md, Aufgabe 7a:** Falsche Loesungen entfernen
5. **01-wiederholung.md, Aufgabe 12c:** Aufgabe ueberarbeiten oder als Denkaufgabe kennzeichnen
6. **02-zahlen-bis-million.md, Aufgabe 15:** Loesungen korrigieren (120.040, 240.080)
7. **02-zahlen-bis-million.md, Aufgabe 21:** Debugging-Reste entfernen, saubere Loesung formulieren

### Bald fixen (wichtig):
1. Einheiten aus `eingabe`-Loesungen entfernen oder `einheit`-Feld einfuehren
2. `digital: voll` bei unpruefbaren Aufgaben auf `teilweise` oder `platzhalter` aendern
3. Leere stage_ids ergaenzen
4. Aufgabe 39 Titel korrigieren (Pilze → Kastanien)
5. Tippfehler "maßstabsgetreü" korrigieren

### Mittelfristig (Verbesserung):
1. Tipps visueller gestalten (Stellenwerttafeln, Zahlenstrahlskizzen)
2. Tipp 3 weniger verraten — ersten Schritt statt fast-komplette-Loesung
3. Mehr Aufgaben fuer Kap. 4, 10, 11
4. Diagramm-Assets fuer Kap. 13 erstellen
5. Bruch-Darstellung standardisieren

---

*Erstellt am 2026-04-06 vom MatheHeldin Experten-Gremium*
*Naechste Pruefung empfohlen: Nach Behebung der kritischen Fehler*
