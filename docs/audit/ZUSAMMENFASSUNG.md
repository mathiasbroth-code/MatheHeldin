# Audit-Zusammenfassung — MatheHeldin Aufgaben

Datum: 2026-04-07
Geprüft: **718 Aufgaben** in 16 Dateien (Platzhalter übersprungen)

## Übersicht pro Datei

| Datei | Aufgaben | Fehler | Warnungen |
|-------|----------|--------|-----------|
| 01-wiederholung.json | 47 | 2 | 6 |
| 02-zahlen-bis-million.json | 76 | 2 | 4 |
| 03-addition-subtraktion-rechenregeln.json | 72 | 0 | 3 |
| 04-achsensymmetrie-flaeche-umfang.json | 26 | 2 | 4 |
| 05-multiplikation.json | 34 | 0 | 3 |
| 06-gewichte-laengen-skizzen.json | 41 | 1 | 5 |
| 07-kombinatorik-wahrscheinlichkeit.json | 34 | 2 | 6 |
| 08-division.json | 49 | 1 | 5 |
| 09-alltagsbrueche-hohlmasse-masseinheiten.json | 46 | 6 | 12 |
| 10-kreise-muster-koerper.json | 26 | 4 | 4 |
| 11-sachrechnen.json | 30 | 9 | 5 |
| 12-massstab-orientierung.json | 27 | 1 | 4 |
| 13-schaubilder-daten.json | 13 | 0 | 3 |
| 14-forscherkiste.json | 37 | 4 | 6 |
| intensiv-division.json | 43 | 1 | 4 |
| intensiv-kombinatorik-einheiten.json | 73 | 2 | 7 |
| **Gesamt** | **674** | **37** | **79** |

## Kritische Fehler (Mathe falsch)

Diese Aufgaben liefern eine **mathematisch falsche Lösung**:

- **02#21** "Zahlenrätsel — Zahl mit Bedingungen finden" b): Lösung 213.547 verletzt HT=2·T und ZT=3·T. Korrekt: **231.547**
- **06#19** "Geschwindigkeiten vergleichen" b): `antwort: "4"` statt **16** km/h (Copy-Paste von a)
- **11#2** "Tageskarte oder 3-Stunden-Ticket": a) 28 statt **61**, b) 22 statt **46** (nur Erwachsene statt Familie)
- **11#5** "Geburtstagsfeier" c): 10 statt **16** Euro (Getränke vergessen)
- **11#7** "Sparvergleich": a) 7 statt **39**, b) 52 statt **68,80** (Teilkosten statt Gesamt)
- **intensiv-komb#55** "Lieblings-Buchstabe": 35 Buchstaben statt **34**
- **intensiv-komb#20** "Geschwindigkeit berechnen" c): `loesung` sagt "20 km/h > 10 km/h" statt **15 > 6**

## Strukturelle Fehler (parsed-Daten kaputt)

- **01#44** "Zeitschriften kaufen": parsed.items[1] beantwortet die falsche Frage
- **02#22** "Vier Plättchen": Titel sagt 4, Aufgabe arbeitet mit 5 Plättchen
- **04#10** "Symmetrisch oder nicht?": `thema`="Faltschnitte" statt "Achsensymmetrische Bilder"
- **04#12** "Rechte Winkel finden" d): Antwort sagt "Buchstabe E, 4 Winkel" statt "T, 2 Winkel" (Copy-Paste)
- **07#2** "Fotos zu zweit": parsed.items[0].frage enthält Hinweistext statt Frage
- **07#19** "Buchstaben in kurzem Text": Antwort "E,N,R,T,H" willkürlich bei Gleichstand
- **08#32** "Lückendivision" b): 3 Unterstriche suggerieren 6-stellige Zahl, richtig ist 4-stellig
- **09#0** "Pizza teilen" b): `antwort: "1"` statt "1/4"
- **09#14** "4 Liter abmessen": parsed nur Schritt 1 von 8
- **09#46** "Millionen-Quiz": parsed-Struktur komplett falsch (4 Fragen als 1 kodiert)
- **10#1** "Charlys Futterplatz" b): Antwort zu a) statt zu b)
- **10#6, #15, #26**: Tipp 4 komplett leer (leerer String)
- **11#8** "10er-Karte": Frage "Wie viel spart man?" — Antwort ist Einzelpreis, kein Sparbetrag
- **11#11, #13, #14, #16**: `antwort` enthält Satzfragmente statt Zahlen
- **12#28** "Maßstab DIN-A4": Nur 1 Antwort akzeptiert, mehrere sind korrekt
- **14#30, #33**: Fibonacci-Rückwärts: Antworten enthalten gegebene statt gesuchte Zahlen
- **14#43**: Pascal-Dreieck: 3 Lücken gefragt, nur 1 in parsed
- **14#44**: parsed.items.frage nur "```" (leerer Code-Zaun)
- **intensiv-div#27** "Teiler-Rätsel": Nur 12 als Lösung, 18 ist auch korrekt

## Wiederkehrende Warnmuster

### Antwort-Format: Erklärungstext statt Zahl
Betrifft ~40 Aufgaben in fast allen Dateien. `parsed.items[].antwort` enthält Rechenwege, Einheiten oder Sätze statt eingabefähiger Werte. Beispiel: `"8 Griffe × 12 = 96 Bonbons"` statt `"96"`.

### Inkonsistente Einheiten in Antworten
Manche Antworten haben Einheiten (`"1.800 kg"`), andere nicht (`"600"`). Kinder die `1800` eingeben werden als falsch gewertet.

### Jahreszahlen mit Tausenderpunkt
`"2.001"` statt `"2001"` — Jahreszahlen schreibt man ohne Trennzeichen.

### Mehrere korrekte Lösungen, nur eine akzeptiert
Betrifft offene Aufgaben (Zahlenrätsel, Maßstab-Wahl, Gleichstandsfälle bei Sortierungen).
