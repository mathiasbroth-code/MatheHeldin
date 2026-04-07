# Content Audit — Fehlerliste

**Datum:** 2026-04-06
**Umfang:** 669 Aufgaben in 16 Dateien, 5 Parallel-Agenten
**Ergebnis:** ~30 Fehler gefunden

---

## Mathe- und Logikfehler (sofort fixen)

### 1. 02-zahlen-bis-million.md — Aufg. 15b
**Fehler:** Lösungen (410.100, 420.200, 430.300, 440.400) erfüllen NICHT "doppelt so viele ZT wie H"
**Fix:** Korrekte Lösungen: 420.100, 440.200, 460.300, 480.400

### 2. 03-addition-subtraktion-rechenregeln.md — Aufg. 37
**Fehler:** Zahlenrätsel hat keine ganzzahlige Lösung (350/6)
**Fix:** Aufgabe umformulieren: "multipliziere mit 5, addiere 50, dividiere durch 3 = 100" → Antwort: 50

### 3. 03-addition-subtraktion-rechenregeln.md — Aufg. 49b
**Fehler:** 60+60=120, 120/80=1,5 (nicht ganzzahlig)
**Fix:** "80 · ▢" → "40 · ▢", Lösung: ▢ = 3

### 4. 03-addition-subtraktion-rechenregeln.md — Aufg. 50b
**Fehler:** 84−29=55, 280/55 nicht ganzzahlig
**Fix:** "84 − 29 = 280 : ▢" → "84 − 24 = 300 : ▢", Lösung: ▢ = 5

### 5. 03-addition-subtraktion-rechenregeln.md — Aufg. 52
**Fehler:** 7 + ▢ = 10 − 4 = 6, ▢ = −1 (negativ, nicht 4. Klasse)
**Fix:** Gleichung c) ändern: "7 + ▢ = 10 + 4" → ▢ = 7

### 6. 04-achsensymmetrie-flaeche-umfang.md — Aufg. 5
**Fehler:** Lösung sagt erst d), dann c) — widersprüchlich
**Fix:** Korrekte Antwort: c) "In allen vier Ecken"

### 7. 05-multiplikation.md — Aufg. 23b
**Fehler:** Fehlerbeschreibung "Übertrag vergessen, plus 2" stimmt nicht (Carry ist 0)
**Fix:** "Einmaleins-Fehler bei den Zehnern (3 · 3 = 9, nicht 6)"

### 8. 06-gewichte-laengen-skizzen.md — Aufg. 6
**Fehler:** Zwei ### Lösung Blöcke, erst "Nein" dann "Ja"
**Fix:** Ersten (falschen) Block entfernen, nur "Ja, 15,15 t < 16 t" behalten

### 9. 07-kombinatorik-wahrscheinlichkeit.md — Aufg. 15c
**Fehler:** "Die 6 hat die größte Chance" — aber 12 hat auch 4 Möglichkeiten
**Fix:** "Die 6 und die 12 haben die größte Chance (jeweils 4 Möglichkeiten)"

### 10. 07-kombinatorik-wahrscheinlichkeit.md — Aufg. 18
**Fehler:** E-Zählung: "Der Hund spielt gerne im Garten" hat 5 E, nicht 4
**Fix:** E von 4 auf 5 ändern

### 11. 07-kombinatorik-wahrscheinlichkeit.md — Aufg. 19
**Fehler:** E-Zählung: Text hat 10 E, nicht 8
**Fix:** E von 8 auf 10 ändern, "Die fünf häufigsten" aktualisieren

### 12. 09-alltagsbrueche-hohlmasse-masseinheiten.md — Aufg. 7
**Fehler:** Aufgabe bietet nur < oder > an, aber e) braucht "="
**Fix:** "Setze das richtige Zeichen ein: <, > oder ="

### 13. 14-forscherkiste.md — Aufg. 5e
**Fehler:** DCV = 605, nicht 505
**Fix:** Lösung korrigieren

### 14. 14-forscherkiste.md — Aufg. 33c
**Fehler:** Fibonacci: 7+17=24, nicht 27
**Fix:** Aufgabenstellung: "10, 7, 17, 24, ___"

### 15. intensiv-division.md — Aufg. 15
**Fehler:** Quersumme 88 = 16 (gerade), nicht 7. Inkonsistente Definition
**Fix:** Antwort: "72 und 96" (nicht 88)

### 16. intensiv-kombinatorik-einheiten.md — Aufg. 63b
**Fehler:** P kommt auch 2-mal vor, nicht nur O
**Fix:** "O und P (je 2-mal)"

### 17. intensiv-kombinatorik-einheiten.md — Aufg. 64
**Fehler:** Strichliste T = "IIII IIII" = 10, aber Lösung sagt 9
**Fix:** Strichliste für T auf 9 Striche anpassen

---

## typ-Fehler: auswahl → zuordnung (5 Aufgaben)

### 18. 07-kombinatorik-wahrscheinlichkeit.md — Aufg. 12
"Sicher/möglich/unmöglich — drei Würfel" → typ: zuordnung

### 19. 07-kombinatorik-wahrscheinlichkeit.md — Aufg. 16
"Alltagsaussagen" → typ: zuordnung

### 20. 09-alltagsbrueche-hohlmasse-masseinheiten.md — Aufg. 8
"Alltagsbrüche" → typ: zuordnung

### 21. intensiv-kombinatorik-einheiten.md — Aufg. 47
"Kugeln ziehen" → typ: zuordnung

### 22. intensiv-kombinatorik-einheiten.md — Aufg. 48
"Alltagsaussagen beurteilen" → typ: zuordnung

---

## Scratch-Work entfernen (7 Aufgaben)

### 23-26. 14-forscherkiste.md — Aufg. 31, 32, 33, 48
Sichtbares Scratch-Work / doppelte Lösungsblöcke mit Selbstkorrekturen

### 27-29. intensiv-kombinatorik-einheiten.md — Aufg. 61, 62, 63
Doppelte ### Lösung Blöcke mit falschen Erstversuchen

---

## Sonstige

### 30. 08-division.md — Aufg. 10
Tippfehler: "Ferienlagser" → "Ferienlager"

### 31. 11-sachrechnen.md — Aufg. 1
"10er-Karte lohnt sich ab 11 Besuchen" — falsch (8,50€/Besuch > 8€/Besuch, lohnt sich nie)

### 32. 10-kreise-muster-koerper.md — Aufg. 11
Referenziert Parkettierung-Bild, das digital fehlt → digital: platzhalter

---

## Resume Instructions

1. Lese diese Datei
2. Fixe jeden Fehler einzeln in der genannten Markdown-Datei
3. Baue die JSON-Dateien neu: `node scripts/build-aufgaben.cjs`
4. Prüfe Build: `pnpm build`

---
*Handoff created: 2026-04-06 23:50*
