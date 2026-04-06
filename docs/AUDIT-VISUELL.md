# Visuelles Audit aller Aufgaben -- MatheHeldin Experten-Gremium

**Datum:** 2026-04-06
**Durchgefuehrt von:** Prof. Sommer (Paedagogik), Tom Berger (UX), Sarah Kowalski (Frontend)
**Umfang:** 645 Aufgaben in 14 Kapiteln + 2 Intensiv-Dateien

---

## Legende

- **Text reicht** -- Einfache Rechenaufgaben, Eingabe/Auswahl genuegt
- **Koennte visueller** -- Tabellen, Diagramme, Stellenwerttafeln oder Gitterdarstellungen als Grafik statt reinem Text wuerden helfen
- **Braucht zwingend Visualisierung** -- Ohne visuelle Darstellung fuer Philippa (visueller Lerntyp) kaum verstaendlich

---

## Zusammenfassung

| Kapitel | Aufgaben | Text reicht | Koennte visueller | Braucht Visualisierung |
|---------|----------|-------------|-------------------|----------------------|
| 01 Wiederholung | 50 | 28 | 16 | 6 |
| 02 Zahlen bis Million | 60 | 30 | 18 | 12 |
| 03 Addition/Subtraktion/Rechenregeln | 55 | 34 | 15 | 6 |
| 04 Achsensymmetrie/Flaeche/Umfang | 26 | 6 | 6 | 14 |
| 05 Multiplikation | 34 | 26 | 6 | 2 |
| 06 Gewichte/Laengen/Skizzen | 41 | 14 | 12 | 15 |
| 07 Kombinatorik/Wahrscheinlichkeit | 24 | 12 | 8 | 4 |
| 08 Division | 49 | 32 | 11 | 6 |
| 09 Brueche/Hohlmasse/Masseinheiten | 48 | 16 | 14 | 18 |
| 10 Kreise/Muster/Koerper | 28 | 4 | 6 | 18 |
| 11 Sachrechnen | 16 | 12 | 4 | 0 |
| 12 Massstab/Orientierung | 22 | 6 | 4 | 12 |
| 13 Schaubilder/Daten | 27 | 10 | 7 | 10 |
| 14 Forscherkiste | 30 | 18 | 8 | 4 |
| Intensiv Division | 60 | 42 | 14 | 4 |
| Intensiv Kombinatorik/Einheiten | 75 | 36 | 20 | 19 |
| **GESAMT** | **645** | **326 (51%)** | **169 (26%)** | **150 (23%)** |

---

## Detailaudit pro Kapitel

---

### Kapitel 01: Wiederholung (50 Aufgaben)

**Themen:** Stellenwerte bis 2.000, Schriftl. Addieren/Subtrahieren, Halbschriftl. Multiplizieren, Sachaufgaben

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 28 | 3, 4, 5, 7, 13-17, 18-22, 23-27, 28-34, 42-43, 46 |
| Koennte visueller | 16 | 1, 2, 8-12, 29-30, 31, 32, 35-41, 44-45, 47-50 |
| Braucht Visualisierung | 6 | 6, 8, 9, 10, 11, 12 |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 6 | Dienes-Bloecke lesen | Visuelle Darstellung von Tausenderwuerfeln, Hunderterplatten, Zehnerstangen, Einerwuerfeln | **BlockDisplay** -- direkt wiederverwendbar |
| 8, 9, 10, 11, 12 | Stellenwerttafel mit Plaettchen | Interaktive Stellenwerttafel, Plaettchen hinzufuegen/wegnehmen | **Neue Komponente: StellenwertTafel** mit Drag-Plaettchen |

**Prof. Sommer:** Aufgaben 1-7 (Stellenwerte) profitieren enorm von Dienes-Bloecken -- fuer visuelle Lerner ist die Verbindung Zahl-zu-Block elementar. Die Sachaufgaben (35-50) koennten von Bar-Modellen/Teile-Diagrammen profitieren, sind aber auch als Textaufgabe machbar.

**Tom Berger:** StellenwertTafel als interaktive SVG-Komponente ist realistisch umsetzbar (4 Spalten T|H|Z|E, Plaettchen als Kreise). BlockDisplay existiert bereits und deckt Aufgabe 6 perfekt ab.

**Sarah Kowalski:** `BlockDisplay` ist direkt einsetzbar fuer Aufgabe 6. Fuer Aufgaben 8-12 brauchen wir eine neue `StellenwertTafel`-Komponente mit interaktiven Plaettchen.

---

### Kapitel 02: Zahlen bis zur Million (60 Aufgaben)

**Themen:** Millionen-Wuerfel, Zahlen sprechen/schreiben, Zahlen zerlegen, Vergleichen, Kopfrechnen, Schaetzen, Zahlenstrahl, Nachbarzahlen, Runden

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 30 | 8-16, 19-22, 23-29, 43-47, 48-52 |
| Koennte visueller | 18 | 1-7, 17-18, 30-36, 53-60 |
| Braucht Visualisierung | 12 | 37-42 (Zahlenstrahl), 30-34 (Schaetzen mit Bildreferenz), 40 (Mitte) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 37-42 | Grosse Zahlen am Zahlenstrahl | Interaktiver Zahlenstrahl mit Skalierung 520.000-530.000 etc., Punkte ablesen und platzieren | **MitteView** -- teilweise wiederverwendbar (Zahlenstrahl-Grundstruktur), aber braucht Erweiterung fuer Ablese-Aufgaben |
| 40 | Zahl in der Mitte | Zahlenstrahl mit zwei Endpunkten, Mitte finden | **MitteView** -- direkt wiederverwendbar |
| 30-34 | Grosse Anzahlen schaetzen | Bilder/Raster mit vielen Objekten (z.B. Reiskoerner, Menschenmenge), Kind soll schaetzen | **Neue Komponente: SchaetzRaster** -- SVG-Darstellung von Objektgruppen |
| 53-60 | Runden und Darstellen | Zahlenstrahl mit Markierungen fuer gerundete Werte | Erweiterung von MitteView |

**Prof. Sommer:** Der Zahlenstrahl ist DAS zentrale visuelle Werkzeug fuer Zahlenverstaendnis. Aufgaben 37-42 sind ohne gezeichneten Zahlenstrahl fuer Philippa kaum zugaenglich. Das Schaetzen (30-34) braucht visuelle Referenzen -- rein textlich ("Schaetze, wie viele Reiskoerner in einem Glas sind") ist fuer visuelle Lerner nutzlos.

**Tom Berger:** Der Zahlenstrahl aus MitteView kann als generische `Zahlenstrahl`-Komponente extrahiert werden. Varianten: feste Skalierung, Zoom-Ausschnitte, anklickbare Punkte. SVG-basiert, gut machbar.

**Sarah Kowalski:** Die Zahlenstrahl-Logik aus `MitteView` (Linie, Striche, Punkte, Labels) kann in eine wiederverwendbare `src/components/zahlenstrahl/Zahlenstrahl.tsx` extrahiert werden. Fuer Aufgaben 37-42 braucht es zusaetzlich klickbare Punkte und dynamische Skalierung.

---

### Kapitel 03: Addition, Subtraktion, Rechenregeln (55 Aufgaben)

**Themen:** Kopfrechnen, Schriftl. Add./Sub., ANNA-Zahlen, Geldbetraege, Ergebnisse pruefen, Rechenketten, Zahlenraetsel, Gleichungen

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 34 | 1-8, 9-13, 14-18, 24-28, 35-39, 40-50 |
| Koennte visueller | 15 | 19-23 (Geld mit Muenzbild), 29-34 (Rechenketten als Flussdiagramm), 51-55 |
| Braucht Visualisierung | 6 | 29-34 (Rechenketten) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 29-34 | Rechenketten | Visuelle Darstellung als Kette/Fluss: Zahl -> Operation -> Ergebnis -> Operation -> ... | **Neue Komponente: Rechenkette** -- SVG-Pfeil-Kette mit Zwischenergebnissen |

**Prof. Sommer:** Rechenketten (29-34) sind klassisch-visuell: Ein Flussdiagramm mit Pfeilen und Operationskaestchen. Ohne diese Darstellung ist der Aufgabentyp "Rechenkette" fuer Kinder unklar. ANNA-Zahlen und Zahlenraetsel profitieren von Stellenwerttafeln, sind aber auch textbasiert loesbar.

**Tom Berger:** Rechenketten als SVG-Pfeilkette: Kreis (Zahl) -> Pfeil mit Label (+5, ·3) -> Kreis (?) -> ... Einfach umsetzbar, hoher visueller Nutzen.

---

### Kapitel 04: Achsensymmetrie, Flaeche, Umfang (26 Aufgaben)

**Themen:** Symmetrie erkennen, Spiegelbilder, Geodreieck, Parallele/Senkrechte, Flaecheninhalt, Umfang

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 6 | 12, 16, 17, 21, 23, 24 |
| Koennte visueller | 6 | 11, 13, 14, 19, 22, 26 |
| Braucht Visualisierung | 14 | 1-10 (Symmetrie), 15 (Zeichnen), 18, 20, 25 |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 1-5 | Achsensymmetrische Bilder | Buchstaben/Figuren mit einzeichenbarer Spiegelachse, Spiegelbilder zum Vergleichen | **Neue Komponente: SymmetrieFigur** -- SVG-Buchstaben/Formen mit Achse |
| 3, 5 | Spiegelbild erkennen | Figuren und ihre Spiegelungen als Bilder (Multiple-Choice mit SVG) | SVG-Figuren |
| 6-10 | Faltschnitte (4 Platzhalter!) | Haptisch, digital schwer. Alternative: Animiertes Falten/Schneiden als Video oder Klapp-Animation | **Komplex**, moeglicherweise Canvas-basiert |
| 18, 20 | Flaecheninhalt auf Gitter | Kaestchengitter mit Figuren, Kind zaehlt/klickt Kaestchen | **Neue Komponente: KaroGitter** -- interaktives Grid |
| 25 | Umfang Treppenfigur | Figur auf Gitter, Kind zaehlt Aussenkanten | KaroGitter mit Kantenmarkierung |
| 15 | Rechteck zeichnen | Teilweise: Umfang berechnen (digital) + Zeichnen (Platzhalter) | Nur Rechenteil digital |

**Prof. Sommer:** Dieses Kapitel ist das visuellste ueberhaupt. Symmetrie, Faltschnitte, Flaecheninhalt -- all das MUSS gezeichnet werden, um verstanden zu werden. Fuer Philippa sind rein textbasierte Symmetrie-Aufgaben wie "Welcher Buchstabe ist symmetrisch?" ohne Bild sinnlos. Die 4 Platzhalter (Faltschnitte, Zirkel) sind begruendet -- diese Aufgaben erfordern wirklich haptisches Material.

**Tom Berger:** SymmetrieFigur (SVG-Buchstaben mit animierter Spiegelachse) ist realistisch. KaroGitter (Canvas/SVG mit klickbaren Zellen) ist eine Kernkomponente -- wiederverwendbar fuer Flaecheninhalt UND Umfang. Die Faltschnitt-Animation waere sehr aufwendig -- besser als Multiple-Choice-Alternative umsetzen.

**Sarah Kowalski:** Fuer dieses Kapitel brauchen wir mindestens 2 neue Komponenten: `SymmetrieFigur` und `KaroGitter`. Das KaroGitter ist auch fuer andere Stages nuetzlich (Multiplikationsfelder, Muster).

---

### Kapitel 05: Multiplikation (34 Aufgaben)

**Themen:** Multiplizieren im Kopf, Halbschriftlich, Schriftlich, Vertiefen, Dividieren im Kopf

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 26 | 1-8 (Kopfrechnen), 9-14 (Halbschriftlich), 15-24 (Schriftlich), 30-34 |
| Koennte visueller | 6 | 9-14 (Halbschriftl. mit Zerlegungsdiagramm), 25-29 (Schriftl. Vertiefen) |
| Braucht Visualisierung | 2 | 9 (Malkreuz/Zerlegung visuell), 25 (Schriftl. Multiplizieren Schritt-fuer-Schritt) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 9 | Halbschriftlich multiplizieren -- Malkreuz | Visuelles Malkreuz (Zerlegung in Stellenwerte als Gitter) | **Neue Komponente: Malkreuz** |
| 25 | Schriftliches Multiplizieren Schritt-fuer-Schritt | Stellengerechte Darstellung mit farbig markierten Uebertraegen | Erweiterung der Schritt-Eingabe-Komponente |

**Prof. Sommer:** Multiplikation ist ein eher algorithmisches Thema -- hier reicht Text oft aus. Aber das Malkreuz (Aufgabe 9) ist ein zentrales didaktisches Werkzeug, das die Zerlegung visualisiert. Fuer Philippa waere das Malkreuz als visuelle Stuetze beim halbschriftlichen Multiplizieren sehr wertvoll.

---

### Kapitel 06: Gewichte, Laengen, Skizzen (41 Aufgaben)

**Themen:** Tonne/Kilogramm, Tierische Weltrekorde, Entfernungen, Geschwindigkeiten, Loesungshilfe Skizze

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 14 | 1-3, 6-7, 15, 19-22, 24, 35-37 |
| Koennte visueller | 12 | 4-5 (Gewichtstabelle als Grafik), 8-14 (Tiervergleiche mit Bildskala), 16-18, 38-41 |
| Braucht Visualisierung | 15 | 25-34 (Skizze), 15-18 (Entfernungskarte), 20-24 (Geschwindigkeiten), 8-14 (Tier-Gewichtsvergleiche) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 25-31 | Loesungshilfe Skizze (3-Phasen) | Orte auf Linie ordnen, Strecken eintragen, rechnen -- exakt der Skizze-Flow! | **SkizzeView** -- direkt wiederverwendbar! |
| 15-18 | Entfernungen auf Karte | Strecke zwischen Orten mit Teilstrecken-Beschriftung | SkizzeView (angepasst) oder neue **StreckenDiagramm**-Komponente |
| 28 | Faehrstrecke/Glocken-Ueberlappung | Visualisierung zweier ueberlappender Bereiche auf einer Linie | Erweiterung von Zahlenstrahl mit Bereichsmarkierung |
| 20-24 | Geschwindigkeiten | Vergleichsbalken / proportionale Darstellung | **Neue Komponente: BalkenVergleich** |
| 8-14 | Tierische Weltrekorde (Gewichte) | Gewichtsvergleich-Grafik (Waage, Balken) | BalkenVergleich (wiederverwendbar) |

**Prof. Sommer:** Hier ist der Skizze-Flow Gold wert! Aufgaben 25-31 sind exakt fuer den bestehenden 3-Phasen-Flow gemacht. Die Entfernungs- und Geschwindigkeitsaufgaben profitieren stark von Streckendiagrammen -- fuer Philippa ist "4,8 km + 6,3 km + 5,2 km" als Text schwer vorstellbar, aber als Strecke mit Markierungen sofort klar. Die Gewichtsvergleiche (8-14) brauchen mindestens Vergleichsbalken, idealerweise eine Waagen-Grafik.

**Sarah Kowalski:** SkizzeView deckt Aufgaben 25-31 perfekt ab. Fuer die Entfernungs- und Geschwindigkeitsaufgaben koennte eine vereinfachte Variante des Skizze-Flows als `StreckenDiagramm` extrahiert werden.

---

### Kapitel 07: Kombinatorik und Wahrscheinlichkeit (24 Aufgaben)

**Themen:** Buchstaben zaehlen, Wie viele Moeglichkeiten?, Alles Zufall?

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 12 | 1-4, 9-12, 17-20 |
| Koennte visueller | 8 | 5-8 (Baumdiagramm), 13-16 (Zufallsrad), 21-24 |
| Braucht Visualisierung | 4 | 5-6 (Baumdiagramm), 17-18 (Gluecksrad/Wuerfel) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 5-6 | Wie viele Moeglichkeiten -- Baumdiagramm | Baumdiagramm das systematisch alle Kombinationen zeigt | **Neue Komponente: Baumdiagramm** -- SVG-Baum |
| 17-18 | Gluecksrad / Wuerfelwahrscheinlichkeit | Drehbares Gluecksrad mit Sektoren, animierter Wuerfel | **Neue Komponente: Gluecksrad** -- CSS/SVG-Animation |

**Prof. Sommer:** Baumdiagramme sind DAS Visualisierungswerkzeug fuer Kombinatorik. Ohne Baumdiagramm ist "Wie viele 3-stellige Zahlen kann man aus den Ziffern 1, 2, 3 bilden?" fuer 9-Jaehrige extrem abstrakt. Das Gluecksrad macht Wahrscheinlichkeiten greifbar.

**Tom Berger:** Baumdiagramm als SVG mit expandierbaren Aesten ist machbar, aber nicht trivial. Gluecksrad (Kreis mit Sektoren, drehbar) ist als CSS-Animation gut umsetzbar. Beides sind Komponenten mit breitem Wiederverwendungspotenzial.

---

### Kapitel 08: Division (49 Aufgaben)

**Themen:** Halbschriftlich Dividieren, Schriftlich Dividieren, Teilbarkeitsregeln, Teiler/Vielfache, Sponsorenlauf, Kommazahlen

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 32 | 1-8, 9-14, 15-20, 26-33, 42-49 |
| Koennte visueller | 11 | 21-25 (Schriftl. Division Schritt-fuer-Schritt), 34-41 (Sachaufgaben), 9-14 (Halbschriftl.) |
| Braucht Visualisierung | 6 | 21-25 (Schriftl. Division als Schritt-Verfahren), 34-36 (Sponsorenlauf/Sachaufgabe mit Skizze) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 21-25 | Schriftliches Dividieren Schritt-fuer-Schritt | Stellengerechte Division mit farbig markierten Teilschritten (Teilen, Multiplizieren, Subtrahieren, Runterholen) | **Neue Komponente: SchriftlicheDivision** -- interaktive Schritt-Darstellung |
| 34-36 | Sponsorenlauf (Sachaufgaben mit Strecken) | Streckendiagramm, Laeufer auf Rundkurs | SkizzeView (angepasst) |

**Prof. Sommer:** Schriftliche Division ist das schwierigste Rechenverfahren der Grundschule. Ohne visuelle Schritt-fuer-Schritt-Fuehrung (farbige Markierung: "Teile 27 durch 4 = 6, dann 6 mal 4 = 24, dann 27 minus 24 = 3, dann die 2 runterholen...") ist das fuer Philippa eine Blackbox. Die 5 teilweise-digitalen Aufgaben betreffen Kommazahlen-Darstellung, die eine Stellenwerttafel mit Komma braucht.

---

### Kapitel 09: Brueche, Hohlmasse, Masseinheiten (48 Aufgaben)

**Themen:** Einfache Brueche, Liter/Milliliter, Rauminhalt, Masseinheiten, Wasserverbrauch, Millionen-Fragen

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 16 | 4, 17-24, 33-40, 45-48 |
| Koennte visueller | 14 | 6-8, 25-32 (Liter-Gefaesse), 41-44 |
| Braucht Visualisierung | 18 | 1, 3, 5 (Pizza/Kreis-Brueche), 9-16 (Messbecher/Liter), 25-32 (Rauminhalt als Wuerfel) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 1, 3, 5 | Pizza/Kreis-Brueche | Kreisdiagramm mit faerbbaren Sektoren (Bruchteile markieren) | **Neue Komponente: BruchKreis** -- SVG-Kreis mit teilbaren Sektoren |
| 3 | Rechteck-Brueche | Rechteck in gleiche Teile geteilt, Teile farbig markiert | **Neue Komponente: BruchRechteck** -- SVG-Grid mit Faerbung |
| 9-16 | Liter und Milliliter | Messbecher-Grafik mit Fuellstand, Skala | **Neue Komponente: Messbecher** -- SVG mit animiertem Fuellstand |
| 25-32 | Rauminhalt (Wuerfelbausteine zaehlen) | 3D-Darstellung von Wuerfelbausteinen (Quader aus Einheitswuerfeln) | **Neue Komponente: WuerfelBausteine** -- Isometrische SVG-Darstellung |
| 2 | Rechteck aufteilen (Platzhalter) | Interaktives Teilen eines Rechtecks -- komplex | Platzhalter beibehalten, MC-Alternative |

**Prof. Sommer:** Brueche MUESSEN visuell eingefuehrt werden! Eine Pizza in 8 Teile schneiden und 5 faerben -- das IST der Bruch 5/8 fuer ein Kind. Ohne Bild ist "5/8" eine bedeutungslose Zeichenfolge. Ebenso Messbecher: "350 ml" wird erst durch einen sichtbaren Fuellstand begreifbar. Die Rauminhalt-Aufgaben (Wuerfelbausteine zaehlen) sind ohne isometrische Darstellung nicht loesbar. Dieses Kapitel hat den hoechsten Visualisierungsbedarf zusammen mit Kapitel 10.

**Tom Berger:** BruchKreis und BruchRechteck sind einfache SVG-Komponenten. Messbecher ist etwas aufwendiger (Skala, Fuellstand, Animation). WuerfelBausteine als isometrische SVG-Darstellung ist machbar, aber erfordert sorgfaeltige Perspektiv-Berechnung.

---

### Kapitel 10: Kreise, Muster, Koerper (28 Aufgaben)

**Themen:** Kreise zeichnen, Parkettierungen, Koerpernetze, Schraegbilder

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 4 | 1, 2, 5, 8 |
| Koennte visueller | 6 | 4, 6, 7, 9, 10, 11 |
| Braucht Visualisierung | 18 | 3 (Platzhalter: Zirkel), 12-18 (Parkettierungen), 19-28 (Koerpernetze, Schraegbilder) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 3 | Kreise mit Zirkel (Platzhalter) | Digital: Konzentrische Kreise als SVG anzeigen, Groessenvergleich | **Neue Komponente: KreisZeichnung** -- SVG-Kreise mit Radius-Label |
| 4 | Radius ablesen | Kreis mit Mittelpunkt, Masslinie | KreisZeichnung |
| 12-18 | Parkettierungen | Muster aus geometrischen Formen die sich lueckenlos wiederholen | **Neue Komponente: Parkettierung** -- SVG-Kachelmuster, teilweise interaktiv |
| 19-21 | Koerpernetze | 2D-Netz eines Wuerfels/Quaders, Kind ordnet zu welcher Koerper entsteht | **Neue Komponente: Koerpernetz** -- SVG-Netze mit Zuordnung |
| 22-28 | Schraegbilder | 3D-Koerper in isometrischer Ansicht | **Neue Komponente: Schraegbild** -- Isometrische SVG |

**Prof. Sommer:** Geometrie IST visuell. Dieses Kapitel ohne Bilder zu praesentieren ist wie ein Kochbuch ohne Rezepte. Die 4 Platzhalter (Zirkel-Aufgaben) sind begruendet. Alle anderen Aufgaben brauchen mindestens eine statische Grafik. Parkettierungen und Koerpernetze sind ohne Bild schlicht nicht machbar.

**Tom Berger:** Kreise als SVG -- trivial. Parkettierungen -- mittel (repetierende SVG-Patterns). Koerpernetze und Schraegbilder -- aufwendig (isometrische Projektion). Priorisierung: Kreise > Parkettierung > Netze > Schraegbilder.

**Sarah Kowalski:** Die 4 Platzhalter bleiben. Fuer die restlichen 18 Aufgaben brauchen wir mindestens statische SVG-Darstellungen. Interaktivitaet (z.B. "Welches Netz passt zum Wuerfel?") ist als Multiple-Choice mit SVG-Bildern umsetzbar.

---

### Kapitel 11: Sachrechnen (16 Aufgaben)

**Themen:** Schwimmbad-Sachaufgaben, Loesungshilfen

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 12 | 1-6, 9-14 |
| Koennte visueller | 4 | 7-8 (Tabelle als Grafik), 15-16 (Loesungshilfen mit Skizze) |
| Braucht Visualisierung | 0 | -- |

**Prof. Sommer:** Dieses Kapitel ist rein textbasiert machbar. Die Sachaufgaben (Schwimmbad-Preise, Budgetplanung) sind Alltagskontext -- Philippa kann sich das vorstellen. Tabellen als grafische Darstellung waeren nett, aber nicht zwingend.

---

### Kapitel 12: Massstab und Orientierung (22 Aufgaben)

**Themen:** Vergroessern/Verkleinern, Orientierung auf Karten, Ansichten/Grundriss

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 6 | 1-3, 5, 8, 11 |
| Koennte visueller | 4 | 4, 6, 7, 9 |
| Braucht Visualisierung | 12 | 10, 12-22 (Karten, Plaene, Ansichten, Grundrisse) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 10, 12-15 | Karten und Plaene | Vereinfachter Stadtplan/Karte mit Massstab, Kind misst Entfernungen | **Neue Komponente: Kartenansicht** -- SVG-Plan mit Massstab-Leiste |
| 16-19 | Ansichten | Gegenstand von vorne/seite/oben zeigen | Statische SVG-Grafiken (3 Ansichten) |
| 20-22 | Grundriss | Vogelperspektive eines Raumes/Gebaeudes | SVG-Grundriss |

**Prof. Sommer:** Massstab und Orientierung sind inherent visuell. "Im Massstab 1:500 gezeichnet" ohne Bild ist sinnlos. Karten, Plaene und Ansichten/Grundrisse muessen gezeigt werden. Die 6 teilweise-digitalen Aufgaben betreffen Aufgaben, die im Buch eine Karte zeigen, die wir digital reproduzieren muessen.

**Tom Berger:** Vereinfachte Karten als SVG (Strassen als Linien, Gebaeude als Rechtecke, Massstab-Balken) sind realistisch. Ansichten als 3 statische SVG-Bilder pro Objekt -- machbar. Grundrisse sind einfache 2D-Plaene.

---

### Kapitel 13: Schaubilder und Daten (27 Aufgaben)

**Themen:** Tabellen/Diagramme, Roemische Zahlen, Datenmengen, Binaersystem

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 10 | 8-14 (Roemische Zahlen), 22-27 (Binaersystem) |
| Koennte visueller | 7 | 1-2, 5-6, 15-17 |
| Braucht Visualisierung | 10 | 3-4 (Diagramme ablesen), 7 (Wachstumsdiagramm), 18-21 (Saeulen/Balkendiagramme), 22-27 (Datenmengen mit Darstellung) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 3-4, 7 | Diagramme ablesen | Liniendiagramm (Wachstumskurve), Balkendiagramm | **Neue Komponente: Diagramm** -- SVG-Balken/Linien-Chart |
| 18-21 | Saeulendiagramme erstellen/ablesen | Interaktives Saeulendiagramm (Hoehe per Tap einstellen) | Diagramm-Komponente mit Interaktion |

**Prof. Sommer:** "Lies den Wert bei 10 Jahren aus dem Diagramm ab" -- ohne Diagramm unmoeglich. Dieses Kapitel handelt VON Datenvisualisierung, also MUSS es Diagramme zeigen. Die Roemischen Zahlen und das Binaersystem sind dagegen rein textbasiert machbar.

**Tom Berger:** Balkendiagramm und Liniendiagramm als SVG-Komponenten -- Standardaufgabe, gut machbar. Interaktive Saeulen (Kind tippt auf Balken um Hoehe zu setzen) erfordern Touch-Handling, aber das haben wir bereits im Skizze-Modul.

---

### Kapitel 14: Forscherkiste (30 Aufgaben)

**Themen:** Zahlenforscher, Fibonacci-Folge, Pascalsches Dreieck, Rechenkuenstler, Taschenrechner

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 18 | 1-8 (Zahlenforscher), 15-22 (Rechenkuenstler), 29-30 |
| Koennte visueller | 8 | 9-14 (Fibonacci als Spirale/Kacheln), 23-28 (Pascalsches Dreieck) |
| Braucht Visualisierung | 4 | 9-10 (Fibonacci-Spirale), 23-24 (Pascalsches Dreieck) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 9-10 | Fibonacci-Folge | Fibonacci-Spirale oder Kacheldarstellung (goldener Schnitt) | **Neue Komponente: FibonacciVisualisierung** -- SVG |
| 23-24 | Pascalsches Dreieck | Dreiecksfoermige Zahlenpyramide, interaktiv ausfuellbar | **Neue Komponente: PascalDreieck** -- SVG-Pyramide mit Eingabe |

**Prof. Sommer:** Die Forscherkiste ist bewusst als Bereicherung gedacht. Die Fibonacci-Spirale und das Pascalsche Dreieck sind visuell faszinierend -- sie fuer Philippa nur als Zahlenreihe zu praesentieren, verschenkt den "Wow-Effekt", der Kinder zum Forschen motiviert.

---

### Intensiv Division (60 Aufgaben)

**Themen:** Vielfache, Teiler, Halbschriftlich/Schriftlich Dividieren, Vertiefen

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 42 | 1-15 (Vielfache), 16-30 (Teiler), 31-38, 55-60 |
| Koennte visueller | 14 | 39-52 (Schriftl. Division Schritt-fuer-Schritt) |
| Braucht Visualisierung | 4 | 39-42 (Halbschriftl. Division mit Restdarstellung) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 39-42 | Halbschriftl. Division mit Rest | Dienes-Bloecke die aufgeteilt werden (Visualisierung des Aufteilens) | BlockDisplay (erweitert um Aufteilung) |

---

### Intensiv Kombinatorik und Einheiten (75 Aufgaben)

**Themen:** Buchstaben zaehlen, Wie viele Moeglichkeiten?, Alles Zufall?, Entfernungen, Geschwindigkeiten

| Kategorie | Anzahl | Aufgaben-Nummern |
|-----------|--------|-----------------|
| Text reicht | 36 | 1-15 (Buchstaben), 46-60 (Entfernungen rein rechnerisch) |
| Koennte visueller | 20 | 16-30 (Baumdiagramme), 61-75 (Geschwindigkeiten) |
| Braucht Visualisierung | 19 | 16-20 (Baumdiagramm), 31-40 (Gluecksrad/Wuerfel), 61-70 (Streckendiagramme), 71-75 (Geschwindigkeitsvergleich) |

**Aufgaben mit zwingendem Visualisierungsbedarf:**

| Nr. | Thema | Was wird gebraucht | Bestehende Komponente |
|-----|-------|-------------------|----------------------|
| 16-20 | Baumdiagramm (Kombinatorik) | Baumdiagramm mit Verzweigungen | Baumdiagramm (aus Kap. 7) |
| 31-40 | Wahrscheinlichkeit (Gluecksrad, Wuerfel) | Drehbares Gluecksrad, Wuerfel-Animation | Gluecksrad (aus Kap. 7) |
| 61-70 | Entfernungen mit Karte/Skizze | Streckendiagramm mit Orten | SkizzeView / StreckenDiagramm |
| 71-75 | Geschwindigkeitsvergleich | Balkenvergleich verschiedener Geschwindigkeiten | BalkenVergleich |

---

## Priorisierte Liste neuer visueller Komponenten

Basierend auf der Analyse: Sortiert nach **Anzahl betroffener Aufgaben** und **Wiederverwendbarkeit**.

### Prio 1 -- Hoechste Dringlichkeit (>20 betroffene Aufgaben)

| Komponente | Betroffene Aufgaben | Kapitel | Aufwand | Wiederverwendung |
|------------|-------------------|---------|---------|-----------------|
| **Zahlenstrahl** (aus MitteView extrahiert) | ~30 | 02, 03, 06, Intensiv | Mittel | Sehr hoch -- Mitte, Ablesen, Runden, Platzieren |
| **BruchKreis / BruchRechteck** | ~20 | 09 | Niedrig | Hoch -- alle Bruch-Aufgaben |
| **Diagramm** (Balken + Linien) | ~20 | 13, Intensiv | Mittel | Hoch -- Tabellen, Daten, Vergleiche |
| **StreckenDiagramm** (Skizze-Variante) | ~25 | 06, 12, Intensiv | Mittel | Hoch -- Entfernungen, Skizzen |

### Prio 2 -- Hohe Dringlichkeit (10-20 betroffene Aufgaben)

| Komponente | Betroffene Aufgaben | Kapitel | Aufwand | Wiederverwendung |
|------------|-------------------|---------|---------|-----------------|
| **KaroGitter** (Flaecheninhalt + Umfang) | ~15 | 04 | Mittel | Mittel -- Flaecheninhalt, Muster, Parkettierung |
| **StellenwertTafel** (interaktiv mit Plaettchen) | ~12 | 01, 02 | Mittel | Mittel -- Stellenwerte, Zerlegen |
| **Messbecher** (Fuellstand-SVG) | ~12 | 09 | Mittel | Niedrig -- nur Hohlmasse |
| **SymmetrieFigur** | ~10 | 04 | Niedrig | Niedrig -- nur Symmetrie |
| **Kartenansicht** (vereinfachter Plan) | ~12 | 12 | Hoch | Niedrig -- nur Massstab |

### Prio 3 -- Mittlere Dringlichkeit (<10 betroffene Aufgaben)

| Komponente | Betroffene Aufgaben | Kapitel | Aufwand | Wiederverwendung |
|------------|-------------------|---------|---------|-----------------|
| **Baumdiagramm** | ~8 | 07, Intensiv | Mittel | Mittel |
| **Gluecksrad** | ~8 | 07, Intensiv | Niedrig | Niedrig |
| **Rechenkette** (Pfeilkette) | ~6 | 03 | Niedrig | Mittel |
| **Malkreuz** | ~4 | 05 | Niedrig | Niedrig |
| **BalkenVergleich** | ~8 | 06, Intensiv | Niedrig | Mittel |
| **SchriftlicheDivision** | ~6 | 08, Intensiv | Hoch | Mittel |
| **WuerfelBausteine** (isometrisch) | ~8 | 09 | Hoch | Niedrig |
| **Koerpernetz / Schraegbild** | ~10 | 10 | Sehr hoch | Niedrig |
| **PascalDreieck** | ~4 | 14 | Niedrig | Niedrig |
| **FibonacciVisualisierung** | ~2 | 14 | Niedrig | Niedrig |

---

## Bestehende Komponenten und ihre Abdeckung

| Komponente | Pfad | Deckt ab | Erweiterungsbedarf |
|------------|------|----------|-------------------|
| **BlockDisplay** | `src/components/dienes/BlockDisplay.tsx` | Kap. 01 Aufg. 6 (Dienes lesen), alle "Zahl-zu-Block"-Aufgaben | Minimal -- funktioniert bereits |
| **MitteView** | `src/stages/mitte/MitteView.tsx` | Kap. 02 Aufg. 40 (Mitte finden) | Zahlenstrahl-Logik extrahieren fuer allgemeine Verwendung |
| **SkizzeView** | `src/stages/skizze/SkizzeView.tsx` | Kap. 06 Aufg. 25-31 (3-Phasen Skizze) | Gut abgedeckt, ggf. neue Problems hinzufuegen |

---

## Gesamtbewertung des Experten-Gremiums

### Prof. Sommer (Paedagogik):
> Von 645 Aufgaben brauchen 150 (23%) zwingend eine visuelle Darstellung. Weitere 169 (26%) wuerden deutlich profitieren. Fuer einen visuellen Lerntyp wie Philippa ist eine rein textbasierte Praesentation bei diesen 150 Aufgaben **didaktisch unzureichend**. Die kritischsten Bereiche sind: Brueche (Kap. 9), Geometrie (Kap. 4, 10), Zahlenstrahl (Kap. 2), und Massstab/Karten (Kap. 12). Empfehlung: Prio-1-Komponenten zuerst umsetzen -- damit werden ca. 95 der 150 kritischen Aufgaben abgedeckt.

### Tom Berger (UX):
> Die 4 Prio-1-Komponenten (Zahlenstrahl, BruchKreis, Diagramm, StreckenDiagramm) sind alle als SVG/CSS realistisch umsetzbar. Geschaetzter Aufwand: je 2-4 Stunden. Damit waeren ~95 Aufgaben visuell aufgewertet. Die Prio-2-Komponenten (KaroGitter, StellenwertTafel, Messbecher, Symmetrie, Karte) erfordern jeweils 3-6 Stunden. Die Prio-3-Komponenten (Baumdiagramm, Gluecksrad, isometrische 3D) sind nice-to-have und koennen schrittweise ergaenzt werden.

### Sarah Kowalski (Frontend):
> Die Architektur unterstuetzt das gut: Neue visuelle Komponenten kommen nach `src/components/` (zahlenstrahl, bruch, diagramm, etc.) und werden in den Stage-Views eingebunden. Die bestehenden 3 Komponenten (BlockDisplay, MitteView-Zahlenstrahl, SkizzeView) decken bereits ~40 Aufgaben ab. Die extrahierte Zahlenstrahl-Komponente hat das hoechste ROI, weil sie in mindestens 4 Kapiteln wiederverwendet wird. **Empfehlung: Zahlenstrahl-Extraktion als erstes, dann BruchKreis, dann Diagramm.**

---

## Naechste Schritte

1. **Zahlenstrahl extrahieren** aus MitteView nach `src/components/zahlenstrahl/Zahlenstrahl.tsx`
2. **BruchKreis + BruchRechteck** erstellen in `src/components/bruch/`
3. **Diagramm-Komponente** erstellen in `src/components/diagramm/`
4. **StreckenDiagramm** erstellen (Skizze-Variante fuer Entfernungsaufgaben)
5. **KaroGitter** fuer Flaecheninhalt/Umfang
6. **StellenwertTafel** fuer interaktive Plaettchen-Aufgaben

---

*Erstellt: 2026-04-06 | Audit durch das MatheHeldin Experten-Gremium*
*Basierend auf der Analyse aller 645 Aufgaben in 16 Dateien*
