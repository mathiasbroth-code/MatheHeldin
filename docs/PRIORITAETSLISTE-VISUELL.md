# Prioritaetsliste: Visuelle Ueberarbeitung der Aufgaben

> Erstellt vom MatheHeldin Experten-Gremium | Stand: 2026-04-06
> Basis: 645 Aufgaben in 14 Kapiteln + 2 Intensiv-Dateien

---

## Bewertungskriterien

| Experte | Perspektive |
|---------|-------------|
| **Prof. Sommer** (Paedagogik) | Didaktischer Nutzen der Visualisierung, Relevanz fuer Philippas Lernschwerpunkte |
| **Tom Berger** (UX) | UI-Komplexitaet, iPad-Tauglichkeit, Interaktionsqualitaet |
| **Sarah Kowalski** (Frontend) | Wiederverwendung bestehender Komponenten, Aufwand, Architektur-Fit |

**Formel:** Didaktischer Nutzen x Machbarkeit x Philippa-Relevanz = Prioritaet

---

## 1. Sofort-Prioritaet (Paukthemen, hoher Wert, machbar)

### 1.1 Halbschriftliches Dividieren — Schrittweise Zerlegung

**Kapitel:** 08-division (Thema 3+4), intensiv-division (Thema 3)
**Aufgaben:** ~24 (Typ: schritt, luecke)
**Stage-IDs:** `halbschriftlich-dividieren`, `halbschriftlich-dividieren-2`

**Benoetigte visuelle Komponente:**
- **StufenZerlegung** — Animierte Darstellung der schrittweisen Zerlegung: Dividend wird in farbige Bloecke (z.B. 84 = 80 + 4) aufgeteilt, jeder Block wird durch den Divisor geteilt, Teilergebnisse addieren sich zum Gesamtergebnis
- Optional: Dienes-Bloecke zeigen, wie z.B. 84 Einheiten in 4 gleiche Haufen verteilt werden

**Aufwand:** M (mittlerer Aufwand)

**Wiederverwendbare Komponenten:**
- `BlockDisplay.tsx` (Dienes-Bloecke) fuer die Darstellung der Zerlegung in T/H/Z/E
- `FeedbackBanner.tsx`, `TippSystem.tsx` fuer Schritt-Feedback

**Gremiums-Bewertung:**
- **Prof. Sommer:** Hoechste Prioritaet — halbschriftliches Dividieren ist Philippas aktuelles Paukthema, und die Zerlegungsstrategie ("geschickt zerlegen") ist genau der Punkt, an dem visuelle Lerner Hilfe brauchen; eine Animation, die zeigt, wie 84 in 80 + 4 zerfaellt, macht den abstrakten Vorgang greifbar.
- **Tom Berger:** Gut auf iPad umsetzbar als Schritt-fuer-Schritt-Flow mit "Naechster Schritt"-Button; aehnlich dem bestehenden Phasen-Indikator der Skizze-Stage.
- **Sarah Kowalski:** `BlockDisplay` kann direkt wiederverwendet werden, um die Zerlegung visuell darzustellen; als neue Stage `halbschriftlich-dividieren` umsetzbar mit Schritt-State.

---

### 1.2 Schriftliches Dividieren — Algorithmus-Visualisierung

**Kapitel:** 08-division (Thema 6+7), intensiv-division (Thema 4)
**Aufgaben:** ~28 (Typ: schritt, luecke)
**Stage-IDs:** `schriftlich-dividieren-1`, `schriftlich-dividieren-2`

**Benoetigte visuelle Komponente:**
- **SchriftlichDividierenCanvas** — Interaktive Darstellung des schriftlichen Divisionsalgorithmus: Ziffern werden von links nach rechts abgearbeitet, "runterziehen" der naechsten Ziffer wird animiert, Teilen-Multiplizieren-Subtrahieren-Zyklus wird Schritt fuer Schritt sichtbar
- Farbcodierung: aktuelle Stelle hervorgehoben, Rest-Uebertrag in anderer Farbe

**Aufwand:** L (grosser Aufwand — neuer Canvas/SVG-basierter Algorithmus)

**Wiederverwendbare Komponenten:**
- `FeedbackBanner.tsx` fuer Schritt-Feedback
- Phasen-Indikator-Muster aus `SkizzeView.tsx`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Ebenfalls hoechste Prioritaet als Paukthema; der schriftliche Divisionsalgorithmus ist fuer visuelle Lerner besonders schwer, weil er viele abstrakte Schritte hat — eine Schritt-fuer-Schritt-Animation mit "Teilen, Multiplizieren, Subtrahieren, Runterholen" macht den Algorithmus nachvollziehbar.
- **Tom Berger:** Technisch anspruchsvoll, aber machbar als SVG/Canvas mit Touch-Interaktion; Kind tippt die naechste Ziffer ein, System zeigt den Rechenweg.
- **Sarah Kowalski:** Braucht eine komplett neue Komponente, aber das Schritt-Pattern aus der Skizze-Stage (Phase 1-2-3) kann als Architektur-Vorlage dienen; die Aufgaben-Frontmatter hat bereits `typ: schritt`, was perfekt passt.

---

### 1.3 Einheiten umrechnen — Zahlenstrahl/Stufenleiter

**Kapitel:** 06-gewichte (Thema 1-4), 09-alltagsbrueche (Thema 2+6), intensiv-kombinatorik-einheiten (Thema 1+2)
**Aufgaben:** ~55 (Typ: eingabe, textaufgabe)
**Stage-IDs:** `entfernungen-km`, `geschwindigkeiten`, `gewichte-t-kg`, `liter-milliliter`, `masseinheiten`

**Benoetigte visuelle Komponente:**
- **EinheitenLeiter** — Interaktive Stufenleiter/Treppe: Einheiten als Stufen (km → m → cm → mm oder t → kg → g), "Komma wandert"-Animation beim Umrechnen, visueller Pfeil zeigt Richtung (x1000 rauf, :1000 runter)
- Alternative: Zahlenstrahl mit Einheiten-Markierungen

**Aufwand:** M (mittlerer Aufwand)

**Wiederverwendbare Komponenten:**
- Zahlenstrahl-Ansatz aus `MitteView.tsx` als Basis fuer die Laengen-Visualisierung
- `Card.tsx`, `Input.tsx` fuer Eingabe-Flow

**Gremiums-Bewertung:**
- **Prof. Sommer:** Philippas Paukthema — Einheiten umrechnen ist ein typisches Thema, bei dem visuelle Lerner von einer "Treppe" oder "Leiter" enorm profitieren; die Vorstellung "Komma wandert 3 Stellen" wird durch Animation konkret; die Stufenleiter ist in der Didaktik bewaehrt.
- **Tom Berger:** Klare, intuitive UI als vertikale oder horizontale Treppe; grossflaechige Touch-Targets moeglich; iPad-optimal.
- **Sarah Kowalski:** Neue Komponente `EinheitenLeiter`, aber relativ einfach (SVG-Stufen + CSS-Animation); die `MitteView.tsx`-Zahlenstrahl-Logik kann als Inspiration dienen; eine Komponente fuer alle Einheiten-Typen wiederverwendbar.

---

### 1.4 Kombinatorik — Interaktives Baumdiagramm

**Kapitel:** 07-kombinatorik (Thema 1), intensiv-kombinatorik-einheiten (Thema 3)
**Aufgaben:** ~23 (Typ: eingabe, textaufgabe)
**Stage-IDs:** `kombinatorik`

**Benoetigte visuelle Komponente:**
- **BaumDiagramm** — Interaktiver Baum: Kind waehlt pro Ebene eine Option, Aeste wachsen animiert, am Ende zaehlen der Pfade; Tabellenansicht als Alternative fuer Kombinations-Aufgaben (Tabelle mit Zeilen/Spalten zum Ankreuzen)

**Aufwand:** M-L (mittlerer bis grosser Aufwand)

**Wiederverwendbare Komponenten:**
- Phasen-Pattern aus `SkizzeView.tsx` (Aufbau in Schritten)
- `Card.tsx` fuer die Darstellung

**Gremiums-Bewertung:**
- **Prof. Sommer:** Philippas Paukthema — Kombinatorik ist ohne visuelle Hilfe fuer 9-Jaehrige extrem abstrakt; das Baumdiagramm ist DAS didaktische Werkzeug; ein interaktiver Baum, den Philippa selbst aufbaut, verankert das Konzept "3 x 2 x 1 = 6" viel besser als reine Rechnung.
- **Tom Berger:** Baumdiagramm als SVG mit anklickbaren Knoten ist auf iPad gut bedienbar; Tabellen-Variante als Fallback fuer Kombinations-Aufgaben.
- **Sarah Kowalski:** Neue Komponente, aber das SVG-Rendering ist nicht ueberkomplex; der Baum ist endlich (max. 3-4 Ebenen bei den Aufgaben); kann als generische `TreeDiagram`-Komponente fuer Kombinatorik UND Wahrscheinlichkeit genutzt werden.

---

## 2. Hoher Wert (grosser didaktischer Nutzen, bestehende Komponenten nutzbar)

### 2.1 Zahlen bis zur Million — Dienes-Bloecke erweitert

**Kapitel:** 02-zahlen-bis-million (Thema 1-4)
**Aufgaben:** ~26 (Typ: zuordnung, eingabe)
**Stage-IDs:** `millionen-wuerfel`, `zahlen-lesen-schreiben`, `zerlegen-gross`, `zahlen-vergleichen`

**Benoetigte visuelle Komponente:**
- Erweiterung von `BlockDisplay.tsx` um ZT (Zehntausender), HT (Hunderttausender) — aktuell nur E/Z/H/T
- Stellenwerttafel als interaktive Tabelle

**Aufwand:** S (klein — bestehende Komponente erweitern)

**Wiederverwendbare Komponenten:**
- `BlockDisplay.tsx` direkt erweiterbar (neue Props ZT, HT)
- `Einer.tsx`, `Zehner.tsx`, `Hunderter.tsx`, `Tausender.tsx` als Vorlage fuer neue Block-Typen

**Gremiums-Bewertung:**
- **Prof. Sommer:** Stellenwertverstaendnis ist die Basis aller weiteren Arithmetik; die Erweiterung der Dienes-Bloecke auf groessere Zahlenraeume ist didaktisch wertvoll und baut auf dem auf, was Philippa schon kennt.
- **Tom Berger:** Minimaler UI-Aufwand — es sind nur 2 neue Block-Typen zu den bestehenden hinzuzufuegen.
- **Sarah Kowalski:** `BlockDisplay.tsx` erweitern ist die einfachste moegliche Aenderung; zwei neue SVG-Komponenten (`Zehntausender.tsx`, `Hunderttausender.tsx`) nach dem gleichen Muster wie die bestehenden.

---

### 2.2 Zahlenstrahl fuer grosse Zahlen

**Kapitel:** 02-zahlen-bis-million (Thema 7+8+9+10)
**Aufgaben:** ~25 (Typ: eingabe, auswahl)
**Stage-IDs:** `zahlenstrahl-gross`, `nachbarzahlen`, `runden`, `runden-zahlenstrahl`

**Benoetigte visuelle Komponente:**
- Erweiterung des Zahlenstrahl-Konzepts aus `MitteView.tsx` auf flexible Bereiche (0-10.000, 0-100.000, 0-1.000.000)
- Zoom-faehiger Zahlenstrahl mit Markierungen zum Antippen

**Aufwand:** M (mittlerer Aufwand)

**Wiederverwendbare Komponenten:**
- `MitteView.tsx` als direkte Vorlage (Zahlenstrahl mit Punkten und Labels)
- `Card.tsx`, `Input.tsx`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Zahlenstrahl ist DAS Visualisierungswerkzeug fuer Zahlenverstaendnis; fuer Nachbarzahlen, Runden und Schaetzen ist er unverzichtbar; Philippa profitiert stark davon, Zahlen "verorten" zu koennen.
- **Tom Berger:** `MitteView.tsx` zeigt bereits, wie gut Zahlenstrahlen auf iPad funktionieren; Erweiterung auf variable Bereiche ist UI-technisch sauber.
- **Sarah Kowalski:** Der Zahlenstrahl aus `MitteView` kann in eine generische `Zahlenstrahl`-Komponente refactored werden mit Props fuer `min`, `max`, `ticks`, `markerPositions`; mehrere Stages profitieren davon.

---

### 2.3 Vielfache und Teiler — Zahlenreihen-Visualisierung

**Kapitel:** 08-division (Thema 1+2), intensiv-division (Thema 1+2)
**Aufgaben:** ~35 (Typ: eingabe, wahr-falsch)
**Stage-IDs:** `vielfache`, `teiler`

**Benoetigte visuelle Komponente:**
- **ZahlenGitter/Hunderterfeld** — Farbiges 10x10-Gitter (1-100), in dem Vielfache einer Zahl eingefaerbt werden; bei gemeinsamen Vielfachen: zwei Farben ueberlagern; Teiler als "passt rein"-Animation (z.B. 12 Punkte in 3er- oder 4er-Gruppen)
- Zahlenstrahl mit farbigen Spruengen fuer Vielfache

**Aufwand:** M (mittlerer Aufwand)

**Wiederverwendbare Komponenten:**
- Zahlenstrahl-Logik aus `MitteView.tsx` fuer die Spruenge-Darstellung
- Hunderterfeld ist eine neue, aber einfache Grid-Komponente

**Gremiums-Bewertung:**
- **Prof. Sommer:** Vielfache und Teiler sind die Grundlage fuer Division; ein farbiges Hunderterfeld macht Muster sichtbar (jedes 3. Feld blau, jedes 4. gruen → gemeinsame Vielfache in Mischfarbe); das ist genau die Art von Muster-Erkennung, die visuelle Lerner brauchen.
- **Tom Berger:** Ein 10x10-Grid ist iPad-perfekt — grosse Tap-Targets, uebersichtlich, farbenfroh.
- **Sarah Kowalski:** Einfaches CSS-Grid, kein Canvas noetig; als wiederverwendbare `HunderterFeld`-Komponente implementierbar; auch fuer spaetere Themen (Teilbarkeitsregeln) nutzbar.

---

### 2.4 Alltagsbrueche — Pizza/Kuchen-Visualisierung

**Kapitel:** 09-alltagsbrueche (Thema 1)
**Aufgaben:** ~8 (Typ: eingabe, auswahl)
**Stage-ID:** `einfache-brueche`

**Benoetigte visuelle Komponente:**
- **BruchKreis** — SVG-Kreis (Pizza/Kuchen), der in n gleiche Teile geteilt wird; Teile koennen durch Antippen eingefaerbt werden; Nenner/Zaehler werden daneben angezeigt
- Alternativ: Bruch-Balken (Rechteck geteilt)

**Aufwand:** S-M (klein bis mittel)

**Wiederverwendbare Komponenten:**
- Keine direkte bestehende Komponente, aber SVG-Rendering folgt dem gleichen Pattern wie die Dienes-Bloecke

**Gremiums-Bewertung:**
- **Prof. Sommer:** Brueche sind fuer visuelle Lerner ohne Bild kaum greifbar; die Pizza-Metapher ist bewaehrt und in den Aufgaben bereits angelegt; eine interaktive Pizza, die Philippa selbst teilen kann, ist didaktisch ideal.
- **Tom Berger:** SVG-Kreis mit Touch-zum-Einfaerben ist eine elegante, intuitive Interaktion; auf iPad perfekt.
- **Sarah Kowalski:** Relativ einfache SVG-Geometrie (Kreissektoren); als `BruchKreis`-Komponente in `src/components/` wiederverwendbar.

---

### 2.5 Wahrscheinlichkeit — Gluecksrad/Urne

**Kapitel:** 07-kombinatorik (Thema 2), intensiv-kombinatorik-einheiten (Thema 4)
**Aufgaben:** ~23 (Typ: auswahl, textaufgabe)
**Stage-IDs:** `wahrscheinlichkeit`

**Benoetigte visuelle Komponente:**
- **GluecksRad** — Drehbares SVG-Rad mit farbigen Sektoren; Kind kann "drehen" und Ergebnisse zaehlen; Haeufigkeitsanzeige baut sich auf
- **Urne** — Darstellung mit farbigen Kugeln zum "Ziehen"

**Aufwand:** M-L (braucht Animation)

**Wiederverwendbare Komponenten:**
- `BruchKreis` (aus 2.4) als Basis fuer Gluecksrad-Sektoren

**Gremiums-Bewertung:**
- **Prof. Sommer:** Wahrscheinlichkeit wird durch Experiment greifbar; ein Gluecksrad, das Philippa wirklich drehen kann, macht "wahrscheinlich/unwahrscheinlich/sicher" erlebbar statt abstrakt.
- **Tom Berger:** Touch-Geste zum Drehen ist intuitiv und macht Spass; iPad-nativ.
- **Sarah Kowalski:** Aufwaendiger wegen Dreh-Animation, aber der `BruchKreis` aus Kategorie 2.4 liefert die SVG-Sektor-Logik; das Gluecksrad ist im Grunde ein animierter BruchKreis mit Rotation.

---

## 3. Mittlerer Wert (nuetzlich, aber mehr Aufwand)

### 3.1 Schriftliches Multiplizieren — Algorithmus-Visualisierung

**Kapitel:** 05-multiplikation (Thema 4-6), 01-wiederholung (Thema 6)
**Aufgaben:** ~25 (Typ: schritt, eingabe)
**Stage-IDs:** `schriftlich-multiplizieren-1`, `schriftlich-multiplizieren-2`, `schriftlich-multiplizieren-3`

**Benoetigte visuelle Komponente:**
- Aehnlich wie `SchriftlichDividierenCanvas` (1.2), aber fuer Multiplikation: Schritt-fuer-Schritt-Aufbau der Teilprodukte, Stellenverschiebung sichtbar machen

**Aufwand:** L (analog zu 1.2, kann aber viel Logik teilen)

**Wiederverwendbare Komponenten:**
- Wenn `SchriftlichDividierenCanvas` (1.2) zuerst gebaut wird, kann das Schritt-Pattern wiederverwendet werden

**Gremiums-Bewertung:**
- **Prof. Sommer:** Wertvoll, aber Multiplikation ist aktuell kein Paukthema; die Visualisierung hilft trotzdem, weil Stellenverschiebung bei mehrstelliger Multiplikation fuer visuelle Lerner abstrakt ist.
- **Tom Berger:** Gleiche UI-Architektur wie schriftliche Division — Synergieeffekt.
- **Sarah Kowalski:** Wenn die Division-Canvas-Komponente steht, ist die Multiplikation ein Ableger; geschaetzter Zusatzaufwand nur 40% des Originals.

---

### 3.2 Schriftlich Addieren/Subtrahieren — Uebertragsvisualisierung

**Kapitel:** 01-wiederholung (Thema 4+5), 03-addition-subtraktion (Thema 2)
**Aufgaben:** ~15 (Typ: schritt, eingabe)
**Stage-IDs:** `schriftlich-addieren`, `schriftlich-subtrahieren`, `schriftlich-addsub-gross`

**Benoetigte visuelle Komponente:**
- Stellenweise Hervorhebung mit animiertem Uebertrag ("1 geht rauf")
- Farbcodierung pro Stelle (E, Z, H, T in Dienes-Farben)

**Aufwand:** M-L

**Wiederverwendbare Komponenten:**
- Canvas-/Schritt-Pattern aus der Division-Visualisierung (1.2)
- Dienes-Farbcodes aus `BlockDisplay`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Nicht Philippas aktuelles Paukthema, aber Grundlage fuer alles Weitere; die Uebertrags-Animation hilft visuellen Lernern, den "unsichtbaren" Schritt zu sehen.
- **Tom Berger:** Technisch analog zu Division/Multiplikation — gleiche Architektur.
- **Sarah Kowalski:** Dritter Ableger der Algorithmus-Canvas-Komponente; wenn die Division steht, ist der Aufwand gering.

---

### 3.3 Flaecheninhalt und Umfang — Rasterfeld

**Kapitel:** 04-achsensymmetrie (Thema 4)
**Aufgaben:** ~10 (Typ: eingabe, auswahl)
**Stage-ID:** `flaecheninhalt-umfang`

**Benoetigte visuelle Komponente:**
- **RasterFeld** — Quadratisches Gitter, auf dem Philippa Rechtecke/Quadrate markieren kann; Flaecheninhalt = Kaestchen zaehlen, Umfang = Randkaestchen markieren

**Aufwand:** M

**Wiederverwendbare Komponenten:**
- Grid-Logik aehnlich dem `HunderterFeld` (aus 2.3)

**Gremiums-Bewertung:**
- **Prof. Sommer:** Flaecheninhalt und Umfang werden durch Zaehlen/Markieren auf einem Raster greifbar; besonders der Unterschied "Flaeche vs. Rand" wird so sichtbar.
- **Tom Berger:** Touch-zum-Markieren auf einem Raster ist intuitiv; iPad-geeignet.
- **Sarah Kowalski:** Wenn `HunderterFeld` (2.3) als generisches Grid gebaut wird, kann `RasterFeld` darauf aufbauen.

---

### 3.4 Rauminhalt — 3D-Wuerfeldarstellung

**Kapitel:** 09-alltagsbrueche (Thema 5)
**Aufgaben:** ~7 (Typ: eingabe, reihenfolge)
**Stage-ID:** `rauminhalt`

**Benoetigte visuelle Komponente:**
- **WuerfelStapel** — Isometrische 3D-Ansicht von gestapelten Einheitswuerfeln; Schichten koennen ein-/ausgeblendet werden

**Aufwand:** L (isometrische Darstellung ist komplex)

**Wiederverwendbare Komponenten:**
- Dienes-Block-Farbcodes aus `BlockDisplay.tsx`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Rauminhalt ist ohne 3D-Darstellung kaum vermittelbar; Wuerfel zaehlen in Schichten ist die Standard-Methode.
- **Tom Berger:** Isometrische SVG ist machbar, aber die Interaktion (Schichten ein-/ausblenden) braucht sorgfaeltiges UI-Design.
- **Sarah Kowalski:** Neue, eigenstaendige Komponente; keine direkte Wiederverwendung moeglich; isometrisches SVG ist Frontend-technisch anspruchsvoll.

---

### 3.5 Haeufigkeitsanalyse — Strichliste und Balkendiagramm

**Kapitel:** 07-kombinatorik (Thema 3), intensiv-kombinatorik-einheiten (Thema 5)
**Aufgaben:** ~23 (Typ: eingabe, textaufgabe)
**Stage-ID:** `haeufigkeitsanalyse`

**Benoetigte visuelle Komponente:**
- **StrichListe** — Interaktive Strichliste (5er-Buendel)
- **BalkenDiagramm** — Einfaches Balkendiagramm, das sich beim Zaehlen aufbaut

**Aufwand:** M

**Wiederverwendbare Komponenten:**
- `BalkenDiagramm` ist auch fuer Kapitel 13 (Schaubilder) nutzbar

**Gremiums-Bewertung:**
- **Prof. Sommer:** Strichlisten und Diagramme sind grundlegende Darstellungsformen, die Philippa beherrschen muss; das interaktive Zaehlen und Aufbauen eines Diagramms verankert das Konzept.
- **Tom Berger:** Einfache, klare UI; auf iPad gut bedienbar; das Balkendiagramm waechst sichtbar — guter Lerneffekt.
- **Sarah Kowalski:** Neue Komponenten, aber nicht komplex; das `BalkenDiagramm` hat hohen Wiederverwendungswert (Kap. 13).

---

## 4. Aufwaendig (wertvoll, aber komplexe Neuentwicklung)

### 4.1 Achsensymmetrie — Spiegelzeichner

**Kapitel:** 04-achsensymmetrie (Thema 1+2)
**Aufgaben:** ~10 (Typ: auswahl, zuordnung)
**Stage-IDs:** `achsensymmetrie`, `faltschnitte`

**Benoetigte visuelle Komponente:**
- **SpiegelCanvas** — Geteilte Zeichenflaeche mit Spiegelachse; eine Seite vorgegeben, Kind zeichnet/waehlt die Spiegelung

**Aufwand:** XL (Freihand-Zeichnen + Spiegellogik)

**Gremiums-Bewertung:**
- **Prof. Sommer:** Symmetrie ist ein visuelles Thema par excellence, aber kein aktuelles Paukthema.
- **Tom Berger:** Freihand-Zeichnen auf iPad ist technisch anspruchsvoll und fehleranfaellig.
- **Sarah Kowalski:** Canvas/Touch-Drawing-Logik ist eine komplett neue Baustelle; kein Wiederverwendungspotential aus bestehenden Komponenten.

---

### 4.2 Koerpernetze und Schraegbilder

**Kapitel:** 10-kreise-muster-koerper (Thema 3+4)
**Aufgaben:** ~14 (Typ: zuordnung, auswahl)
**Stage-IDs:** `koerpernetze`, `schraegbilder`

**Benoetigte visuelle Komponente:**
- **KoerperNetz3D** — Interaktives Koerpernetz, das sich zum 3D-Koerper zusammenfaltet (Animation)

**Aufwand:** XL (3D-Transformation/Animation)

**Gremiums-Bewertung:**
- **Prof. Sommer:** Geometrisch hochwertig, aber kein Paukthema; haengt stark von der Qualitaet der 3D-Darstellung ab.
- **Tom Berger:** 3D-Faltanimation ist wow-Faktor, aber komplex in der Umsetzung.
- **Sarah Kowalski:** Erfordert eventuell eine 3D-Library (three.js oder CSS 3D transforms); weit ausserhalb des aktuellen Tech-Stacks.

---

### 4.3 Massstab und Karten-Orientierung

**Kapitel:** 12-massstab-orientierung (alle Themen)
**Aufgaben:** ~22 (Typ: eingabe, auswahl, zuordnung)
**Stage-IDs:** `massstab`, `ansichten-grundriss`, `karten-orientierung`

**Benoetigte visuelle Komponente:**
- **MassstabZoom** — Interaktiver Vergleich von Originalgrösse und verkleinerter/vergroesserter Darstellung
- **KartenAnsicht** — Vereinfachte Karte mit Zoom und Entfernungsmessung

**Aufwand:** L-XL

**Gremiums-Bewertung:**
- **Prof. Sommer:** Massstab ist visuell, aber kein Paukthema; die meisten Aufgaben funktionieren auch als Text.
- **Tom Berger:** Pinch-to-Zoom-Geste auf iPad waere intuitiv, aber die Umsetzung ist aufwaendig.
- **Sarah Kowalski:** Neue Komponentenwelt ohne Wiederverwendungspotential; niedrige Prioritaet.

---

### 4.4 Parkettierungen

**Kapitel:** 10-kreise-muster-koerper (Thema 2)
**Aufgaben:** ~7 (Typ: zuordnung)
**Stage-ID:** `parkettierungen`

**Benoetigte visuelle Komponente:**
- Interaktives Muster-Puzzle (Formen auf Raster legen)

**Aufwand:** XL

**Gremiums-Bewertung:**
- **Prof. Sommer:** Visuell reizvoll, aber kein Paukthema und wenig Aufgaben.
- **Tom Berger:** Drag-and-Drop-Puzzle auf iPad ist machbar, aber aufwaendig.
- **Sarah Kowalski:** Komplett neue Drag-and-Drop-Logik; niedriger ROI bei nur 7 Aufgaben.

---

## 5. Kein Handlungsbedarf (Text reicht, Visualisierung bringt wenig Mehrwert)

### 5.1 Kopfrechnen (Addition, Subtraktion, Multiplikation, Division)

**Kapitel:** 02 (Thema 5), 03 (Thema 1), 05 (Thema 1+2), diverse
**Aufgaben:** ~40 (Typ: eingabe)
**Stage-IDs:** `kopfrechnen-addsub`, `kopfrechnen-multiplikation`, `kopfrechnen-division`, `kopfrechnen-gross`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Kopfrechnen soll im Kopf stattfinden — Visualisierung wuerde den Zweck untergraben.
- **Tom Berger:** Einfache Eingabe reicht; keine UI-Komplexitaet noetig.
- **Sarah Kowalski:** Bestehender Eingabe-Flow ist ausreichend.

---

### 5.2 Rechenketten und Rechenregeln (Punkt vor Strich etc.)

**Kapitel:** 03-addition-subtraktion (Thema 6+8+9)
**Aufgaben:** ~22 (Typ: eingabe, luecke, auswahl)
**Stage-IDs:** `rechenketten`, `rechenregeln`, `gleichungen`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Rechenregeln sind regelbasiert, nicht visuell; Text + strukturierte Eingabe reicht.
- **Tom Berger:** Klare Textdarstellung genuegt.
- **Sarah Kowalski:** Standard-Eingabe-Typ; kein Handlungsbedarf.

---

### 5.3 ANNA-Zahlen, Zahlenraetsel, Fibonacci, Pascalsches Dreieck

**Kapitel:** 03 (Thema 3+7), 14 (Thema 2+5)
**Aufgaben:** ~22 (Typ: eingabe)
**Stage-IDs:** `anna-zahlen`, `zahlenraetsel`, `fibonacci`, `pascalsches-dreieck`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Knobelaufgaben leben vom Nachdenken, nicht von Visualisierung; Text ist hier bewusst das richtige Medium.
- **Tom Berger:** Einfache Eingabe genuegt.
- **Sarah Kowalski:** Standard-Stage-Pattern passt perfekt.

---

### 5.4 Roemische Zahlen, Binaersystem

**Kapitel:** 13-schaubilder (Thema 2+3)
**Aufgaben:** ~13 (Typ: eingabe, wahr-falsch)
**Stage-IDs:** `roemische-zahlen`, `binaersystem`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Uebersetzungsaufgaben; Text + Tabelle reicht; kein visueller Mehrwert.
- **Tom Berger:** Standard-UI genuegt.
- **Sarah Kowalski:** Eingabe-Stage ohne Extras.

---

### 5.5 Textaufgaben / Sachrechnen (reine Rechengeschichten)

**Kapitel:** 01 (Thema 7+8), 08 (Thema 9), 11 (alle)
**Aufgaben:** ~40 (Typ: textaufgabe)
**Stage-IDs:** `sachaufgaben-tiere`, `sachaufgaben-alltag`, `sponsorenlauf`, `sachaufgaben-schwimmbad`, `loesungshilfen`

**Gremiums-Bewertung:**
- **Prof. Sommer:** Sachaufgaben profitieren von Skizzen — die `SkizzeView`-Stage deckt das bereits ab; reine Rechengeschichten brauchen Text + Eingabe.
- **Tom Berger:** Bestehende Skizze-Stage ist fuer komplexe Sachaufgaben da; einfache Textaufgaben brauchen keine Extra-Visualisierung.
- **Sarah Kowalski:** `SkizzeView.tsx` mit 3-Phasen-Flow existiert bereits und deckt diesen Bereich ab.

---

### 5.6 Geodreieck, Kreise zeichnen, Taschenrechner

**Kapitel:** 04 (Thema 3), 10 (Thema 1), 14 (Thema 3)
**Aufgaben:** ~16
**Stage-IDs:** `geodreieck-erkennen`, diverse

**Gremiums-Bewertung:**
- **Prof. Sommer:** Diese Aufgaben sind haptisch/werkzeugbasiert; digital nur eingeschraenkt sinnvoll.
- **Tom Berger:** Digitale Werkzeuge (Geodreieck, Zirkel) sind in v1 nicht realistisch.
- **Sarah Kowalski:** Ausserhalb des aktuellen Scopes.

---

## Empfohlene Reihenfolge

Die folgende Liste definiert die Baureihenfolge. Jeder Schritt baut auf den vorherigen auf und maximiert den Nutzen fuer Philippa.

| # | Was | Aufwand | Warum zuerst |
|---|-----|---------|-------------|
| **1** | **Halbschriftliches Dividieren** (Schritt-Zerlegung mit Dienes-Bloecken) | M | Paukthema Nr. 1, nutzt bestehende `BlockDisplay`-Komponente, sofortiger Lerneffekt |
| **2** | **Einheiten-Leiter** (km/m, kg/g, l/ml) | M | Paukthema, 55 Aufgaben profitieren, Komponente ist wiederverwendbar fuer alle Einheiten |
| **3** | **Hunderterfeld / Vielfache-Gitter** | M | Basis fuer Division, 35 Aufgaben, einfache Grid-Komponente, auch fuer Teilbarkeit nutzbar |
| **4** | **Kombinatorik-Baumdiagramm** | M-L | Paukthema, 23 Aufgaben, macht abstraktes Thema greifbar |
| **5** | **Schriftliches Dividieren** (Algorithmus-Canvas) | L | Paukthema, 28 Aufgaben, groesster Einzelaufwand aber hoechster Lerneffekt |
| **6** | **Zahlenstrahl generisch** (grosse Zahlen, Runden, Nachbarn) | M | 25 Aufgaben, baut auf `MitteView` auf, Wiederverwendung hoch |
| **7** | **Dienes-Bloecke erweitert** (ZT, HT) | S | Kleinster Aufwand, 26 Aufgaben, erweitert bestehende Komponente |
| **8** | **Bruch-Kreis** (Pizza/Kuchen) | S-M | 8 Aufgaben direkt, aber Basis fuer Gluecksrad (2.5) |
| **9** | **Gluecksrad / Wahrscheinlichkeit** | M-L | 23 Aufgaben, baut auf Bruch-Kreis auf |
| **10** | **Balkendiagramm + Strichliste** | M | 23 + 27 Aufgaben (Kap. 7 + 13), hoher Wiederverwendungswert |
| **11** | **Schriftliches Multiplizieren** (Canvas-Ableger) | L* | *Nur 40% Aufwand wenn Division-Canvas steht |
| **12** | **Flaecheninhalt/Umfang Rasterfeld** | M | Baut auf Grid-Komponente (3.) auf |

### Zusammenfassung der Abhaengigkeiten

```
BlockDisplay (besteht) ──→ [1] Halbschriftl. Div. ──→ [5] Schriftl. Div. ──→ [11] Schriftl. Mult.
MitteView (besteht) ────→ [6] Zahlenstrahl generisch
                         → [2] Einheiten-Leiter
Neu: Grid-Komponente ───→ [3] Hunderterfeld ──→ [12] Flaecheninhalt-Raster
Neu: SVG-Sektoren ──────→ [8] Bruch-Kreis ──→ [9] Gluecksrad
Neu: Baumdiagramm ──────→ [4] Kombinatorik
Neu: Balkendiagramm ────→ [10] Strichliste + Diagramme
[7] Dienes erweitert (unabhaengig, kann jederzeit)
```

### Quick-Wins (unter 1 Tag Aufwand)

1. **Dienes-Bloecke erweitern** (#7) — 2-3 Stunden
2. **Hunderterfeld-Komponente** (#3) — halber Tag
3. **Bruch-Kreis** (#8) — halber Tag

### Groesste Hebelwirkung

Wird **#1 (Halbschriftliches Dividieren)** und **#5 (Schriftliches Dividieren)** als Einheit gebaut, profitieren **52 Aufgaben** aus Philippas Paukthema direkt — das ist der groesste Einzelhebel im gesamten Projekt.
