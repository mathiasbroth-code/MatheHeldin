# Audit: 01-wiederholung.json
Geprueft: 50 Aufgaben (ohne Platzhalter -- keine Platzhalter in dieser Datei)

## Fehler

- #11 "Stellenwerttafel -- Zahlen veraendern": **parsed.items[].antwort enthaelt Text mit Pfeil-Zeichen, normalizeZahl extrahiert falsche Zahl.** Die Antworten lauten z.B. `"1.463 -> H und Z tauschen: H=6, Z=4 -> 1.643"`. Die Funktion `normalizeZahl` entfernt alles nach dem ersten `->`, sodass `"1.463"` uebrig bleibt -- statt der korrekten Ergebniszahl `1.643`. Dadurch werden alle drei Teilaufgaben (a=1.643, b=1.830, c=1.440) immer als falsch gewertet, egal was das Kind eingibt. **Fix:** Antworten in parsed.items auf reine Zahlen aendern: a) `"1.643"`, b) `"1.830"`, c) `"1.440"`.

- #40 "Theaterbesuch -- Sitzplatz und Haengeplatz": **parsed.items[0].antwort enthaelt zwei Werte als Fliesstext, normalizeZahl extrahiert nur den ersten.** Die Antwort `"Stehplatz: 7 Euro, Sitzplatz: 14 Euro."` hat nur 2 Komma-Teile (nicht >2), wird also nicht als Liste behandelt. `normalizeZahl` extrahiert die erste Zahl: `"7"`. Ein Kind, das `"14"` fuer den Sitzplatz eingibt, wird als falsch gewertet. **Fix:** Entweder in zwei separate Items aufteilen (je eine Frage fuer Steh- und Sitzplatz) oder antwort auf `"7, 14"` kuerzen -- aber dann braucht es mindestens 3 Komma-Teile fuer die Listenlogik. Besser: Zwei Items.

- #44 "Zeitschriften kaufen": **Hauptfrage fehlt in parsed.items, einziges Item beantwortet Folgefrage.** Die Aufgabenstellung fragt zuerst "Wie viel Geld gibt sie in einem Jahr aus?" (Antwort: 104 Euro), dann "Was aendert sich bei alle zwei Wochen?" (Antwort: 52 Euro). In parsed.items existiert nur ein Item mit antwort `"52"` fuer die Folgefrage. Die Hauptfrage (104 Euro) ist nicht als Item vorhanden und kann nicht bearbeitet werden. **Fix:** Zwei Items anlegen -- Item 1: "Wie viel gibt Sophie in einem Jahr aus?" mit antwort `"104"`, Item 2: die bestehende Vergleichsfrage.

## Warnungen

- #1 "Zahlen zerlegen -- Tausenderzahlen in Stellenwerte": Antwortformat `"1.000 + 400 + 80 + 2"` ist fuer typ=eingabe schwer eingebbar. normalizeZahl wuerde nur die letzte Zahl nach `=` oder die erste Zahl extrahieren -- nicht den vollstaendigen Ausdruck. Ein Kind muesste den exakten String tippen. Besser waere typ=schritt mit einzelnen Stellenwert-Eingaben oder Akzeptanz des reinen Zahlenwerts (z.B. `"1482"`).

- #6 "Welche Zahlen koennen es sein? -- Offene Zahlenraetsel": parsed.items[0].frage enthaelt die Schranken-Bedingung ("groesser als 1.200 und kleiner als 1.400"), aber die Antwort `"Moegliche Zahlen: 1.210, 1.212, 1.214, 1.216, 1.218"` ist als Fliesstext formuliert statt als reine Komma-Liste. normalizeZahl wuerde `"1210"` extrahieren (erste Zahl). Fuer eine offene Aufgabe mit vielen Loesungen ist typ=textaufgabe passend, aber die automatische Auswertung wird scheitern.

- #8 "Plaettchen dazulegen -- vierstellige Zahlen" / #9 "Plaettchen wegnehmen" / #10 "Plaettchen rueckwaerts": parsed.items[].antwort enthaelt Komma-Listen wie `"705, 714, 804, 1.704"`. Die Listenlogik (isListAnswer) greift hier korrekt (>2 Komma-Teile). Mathematisch korrekt. Aber: Das Kind muss alle 3-4 Zahlen in ein Feld tippen -- fuer 9-Jaehrige potenziell ueberfordemd als Eingabeformat.

- #12 "Hunderter addieren und subtrahieren": parsed.items[].antwort enthaelt `"7 H = 700"`. normalizeZahl extrahiert korrekt `"700"` (nach `=`). Funktioniert technisch, aber die angezeigte Loesung `"7 H = 700"` koennte ein Kind verwirren, das nur `"700"` getippt hat.

- #26 "Schriftlich subtrahieren -- Ergebnis pruefen": parsed.teilaufgaben[].schritte[].antwort enthaelt Probe-Text wie `"903 - 467 = 436. Probe: 436 + 467 = 903"`. normalizeZahl entfernt `. Probe:...` und extrahiert `"436"` korrekt. Funktioniert technisch. Aber Tipp 4 (loesungsweg) ist schwer lesbar -- enthaelt Selbstkorrekturen und unklare Notation.

- #28 "Halbschriftlich multiplizieren -- selbststaendig zerlegen": parsed.teilaufgaben[].schritte[].antwort enthaelt vollstaendigen Rechenweg `"4 . 83 = 4 . 80 + 4 . 3 = 320 + 12 = 332"`. normalizeZahl extrahiert `"332"` korrekt (letzte Zahl nach `=`). Funktioniert technisch.

- #39 "Taschen packen -- Verhaeltnisaufgabe": parsed.items[0].antwort `"Linas Rucksack = 6 kg, Toms Rucksack = 12 kg, Mias Rucksack = 12 kg."` wird als Liste behandelt (3 Komma-Teile). normalizeZahl extrahiert pro Teil: 6, 12, 12. Ein Kind muesste `"6, 12, 12"` eingeben -- es ist nicht klar, welches Gewicht zu welcher Person gehoert. Besser: Drei separate Items mit je einer Person.

- #41 "Rechengeschichte zu Ende schreiben": parsed.items[0].antwort ist `"Frage: Wie viele Seiten muss Lukas noch lesen?"` -- ein Freitext, der maschinell schwer auswertbar ist. Fuer typ=textaufgabe akzeptabel, aber kein Kind wird exakt diesen Wortlaut tippen. Die numerische Antwort (213) fehlt als separates Item.

- #46 "Fehlende Angaben ergaenzen" / #47 "Rechengeschichte veraendern" / #49 "Alter-Raetsel -- fehlende Angaben": Offene kreative Aufgaben mit Beispiel-Antworten als Fliesstext. Maschinelle Auswertung unmoeglich. Fuer typ=textaufgabe didaktisch sinnvoll, aber die App muesste diese als "Zeige Muster-Loesung und lass Kind selbst bewerten" behandeln.

## Mathematische Korrektheit

Alle 50 Aufgaben nachgerechnet -- keine mathematischen Fehler gefunden. Stichproben:
- Schriftlich addieren: 463+215=678, 328+147=475, 572+389=961, 637+285=922, 194+468=662, 756+178=934, 347+526+89=962, 268+45+319=632, 73+415+284=772 -- alle korrekt
- Schriftlich subtrahieren: 789-253=536, 723-158=565, 841-367=474, 612-285=327, 1547-382=1165, 1724-659=1065, 1830-94=1736, 903-467=436, 1502-738=764 -- alle korrekt
- Fehler finden: 624+318=942 (richtig), 457+186=643 nicht 634 (richtig erkannt), 239+584=823 nicht 832 (richtig erkannt), 856-293=563 nicht 536, 974-618=356 nicht 365, 1435-278=1157 nicht 1175 -- alle Fehlererkennung korrekt
- Multiplikation: 5*47=235, 8*63=504, 4*83=332, 6*57=342, 3*94=282, 7*46=322, 4*213=852, 3*152=456, 3*187=561, 5*246=1230, 4*398=1592, 6*275=1650 -- alle korrekt
- Sachaufgaben: Hotelkosten, Gutschein-Division, Verhaeltnisaufgaben -- alle korrekt

## Tipps-Qualitaet

Alle 50 Aufgaben haben 4 Tipps mit aufbauender Struktur (Impuls, Denkansatz, Teilantwort, Loesung). Sprache ist durchgehend kindgerecht und ermutigend. Keine Auffaelligkeiten.
