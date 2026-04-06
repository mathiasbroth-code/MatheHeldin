# Skizze-Template-Analyse: 3-Phasen-Flow auf neue Aufgabentypen

> Erstellt vom MatheHeldin Experten-Gremium
> Datum: 2026-04-06

---

## 1. Der bestehende Skizze-Flow -- Architektur-Analyse

### Aufbau

Der Skizze-Stage implementiert einen **3-Phasen-Flow** fuer Sachaufgaben mit Strecken:

| Phase | Datei | Zweck |
|-------|-------|-------|
| 1 -- Ordnen | `Phase1Ordnen.tsx` | Orte in richtiger Reihenfolge auf eine Linie tippen |
| 2 -- Strecken | `Phase2Strecken.tsx` | Bekannte Entfernungen eintragen, Unbekannte freilassen |
| 3 -- Rechnen | `Phase3Rechnen.tsx` | Fehlende Strecke ausrechnen, Ergebnis eingeben |

### Architektur-Muster

```
SkizzeView.tsx              -- Orchestrator (Phase-State, Aufgabenwahl)
  |-- Phase1Ordnen.tsx      -- Interaktive Sortier-Phase
  |-- Phase2Strecken.tsx    -- Daten-Eintrage-Phase
  |-- Phase3Rechnen.tsx     -- Berechnungs- & Antwort-Phase
problems.ts                 -- Statische Aufgaben-Definitionen
generator.ts                -- Zufalls-Auswahl
meta.ts                     -- Stage-Registrierung
```

**Kernprinzipien:**
- **Phasen-State** wird im Orchestrator (`SkizzeView`) gehalten: `useState(1 | 2 | 3)`
- **Phasen-Indikator** (1-2-3 Kreise mit Haken) ist im Orchestrator, nicht in den Phasen
- **Jede Phase** bekommt `problem` + `onComplete` (bzw. `onBack`), ist ansonsten self-contained
- **Phase 3** bekommt zusaetzlich `onAntwort` fuer die persistente Antwort-Logik
- **Aufgabenwahl** (Grid mit 3 Buttons) ist im Orchestrator, nicht im Phase-System

### Was ist wiederverwendbar?

| Komponente | Wiederverwendbarkeit |
|------------|---------------------|
| Phasen-Indikator (3 Kreise) | **Direkt** -- nur CSS, keine Logik |
| Orchestrator-Pattern (Phase-State) | **Direkt** -- Copy & Adapt |
| Phase1: Tap-to-Order Chips | **Konzept uebertragbar** auf andere Sortier-Aufgaben |
| Phase2: Input-Felder mit Validierung | **Konzept uebertragbar** auf andere Eintrage-Aufgaben |
| Phase3: Antwort + Feedback + Loesung | **Direkt** -- `FeedbackBanner` ist bereits eine Shared-Komponente |
| `problems.ts` Datenstruktur | **Nicht direkt** -- zu spezifisch auf Strecken-Probleme |

---

## 2. Kandidaten-Analyse

---

### Kandidat 1: Entfernungen (Kap. 6)
**Strecken auf einer Route berechnen**

#### Prof. Sommer (Paedagogik)
> Der 3-Phasen-Flow ist **ideal** fuer Entfernungen -- er ist quasi 1:1 das bestehende Skizze-Muster. Die Aufgaben in Kap. 6 (Thema 3 + 5) folgen exakt dem Schema: Orte identifizieren, Teilstrecken eintragen, fehlende Strecke berechnen. Der einzige Unterschied: Manche Aufgaben haben mehr Orte (bis zu 6 statt 4) und gemischte Einheiten (km + m). Das ist eine natuerliche Erweiterung, keine Strukturaenderung.

**Didaktisch sinnvoll?** Ja, perfekt. Das ist der natuerliche Erweiterungsfall.

#### Tom Berger (UI/UX)
> Die UI ist **identisch** mit dem bestehenden Skizze-Flow. Neue Varianten:
> - Mehr Stationen (5-6 statt 4) -- der Zahlenstrahl wird enger, Labels muessen kleiner werden
> - Einheiten-Umrechnung (km/m) koennte als Zwischen-Step vor Phase 2 kommen
> - Hin-und-zurueck-Toggle ist bereits implementiert

**Touch-Interaktionen:** Keine neuen noetig. Tap-Chips + Input-Felder reichen.

#### Sarah Kowalski (Frontend)
> **90% des Codes ist direkt wiederverwendbar.** Im Grunde muss nur `problems.ts` um neue Aufgaben erweitert werden. Moeglicherweise ein optionaler Einheiten-Konvertierungsschritt. Die bestehenden Phase-Komponenten funktionieren ohne Aenderung.

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Orte ordnen 2. Strecken eintragen 3. Rechnen |
| Machbarkeit | Trivial -- Erweiterung des bestehenden Skizze-Stages |
| Aufwand | **S** (Small) |
| Wiederverwendbarkeit | 90% |
| Empfehlung | Sofort umsetzbar als Erweiterung von `problems.ts` |

---

### Kandidat 2: Gewichte (Kap. 6)
**Waage-Visualisierung, Gewichte zuordnen**

#### Prof. Sommer (Paedagogik)
> Gewichte folgen einem **anderen kognitiven Muster** als Strecken. Es gibt keine lineare Anordnung (A -> B -> C), sondern eine **Balance-Beziehung** (links = rechts). Der 3-Phasen-Flow muesste umgebaut werden:
> 1. **Situation verstehen:** Leergewicht, Ladung, Gesamtgewicht identifizieren
> 2. **Werte eintragen:** Bekannte Gewichte in eine Waage/Tabelle eintragen
> 3. **Rechnen:** Fehlendes Gewicht berechnen
>
> Das ist moeglich, aber die Phase 1 (Ordnen) hat keinen natuerlichen Platz -- Gewichte haben keine Reihenfolge. Man koennte Phase 1 als "Einheiten vereinheitlichen" umdeuten (alles in kg umrechnen).

**Didaktisch sinnvoll?** Bedingt. Der 3-Phasen-Flow passt, wenn man Phase 1 als Einheiten-Konvertierung nutzt.

#### Tom Berger (UI/UX)
> Eine **Waage-Visualisierung** waere visuell attraktiv:
> - Phase 1: Drag & Drop von Gewichtsbloecken auf eine Balkenwaage
> - Phase 2: Numerische Werte eintragen (wie bei Strecken-Inputs)
> - Phase 3: Fehlenden Wert berechnen
>
> **Aber:** Eine animierte Waage ist komplex (CSS-Transformationen, Balance-Physik). Eine einfachere Tabellen-Darstellung (wie in den Aufgaben: Leergewicht | Ladung | Gesamtgewicht) waere realistischer.

**Touch-Interaktionen:** Tabellen-Inputs sind einfach. Waage mit Drag & Drop waere aufwendiger.

#### Sarah Kowalski (Frontend)
> Das Orchestrator-Pattern und Phase 3 (Rechnen) sind wiederverwendbar. Phase 1 und 2 muessen **komplett neu** gebaut werden:
> - Tabellen-Input-Komponente (3 Spalten: Leergewicht, Ladung, Gesamt)
> - Einheiten-Konvertierung (t, kg, gemischt)
> - Optional: Waage-SVG-Komponente (neu)

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Einheiten vereinheitlichen 2. Bekannte Werte eintragen 3. Rechnen |
| Machbarkeit | Gut -- mit Tabellen-UI statt Waage |
| Aufwand | **M** (Medium) |
| Wiederverwendbarkeit | 40% (Orchestrator + Phase 3) |
| Empfehlung | Umsetzen mit Tabellen-Ansatz, Waage-Animation spaeter als Enhancement |

---

### Kandidat 3: Liter/Milliliter (Kap. 9)
**Messbecher-Visualisierung**

#### Prof. Sommer (Paedagogik)
> Der 3-Phasen-Flow passt **nicht natuerlich**. Liter/Milliliter-Aufgaben sind primaer Umrechnungsaufgaben (1 l = 1.000 ml, 1/2 l = 500 ml), keine Sachaufgaben mit mehreren Schritten. Ein besserer Flow waere:
> 1. **Menge erkennen:** Visuell am Messbecher eine Fuellhoehe ablesen
> 2. **Umrechnen:** ml in l oder Brueche in ml umwandeln
> 3. **Pruefen:** Ergebnis eingeben
>
> Das sind aber eher **2 Phasen** (Ablesen + Antworten). Die Zwischen-Phase (Umrechnen) ist kognitiv zu duenn fuer eine eigene Phase.

**Didaktisch sinnvoll?** Eher ein 2-Phasen-Flow oder ein klassischer 1-Phasen-Flow mit visueller Unterstuetzung. Die 3-Phasen-Struktur wirkt hier erzwungen.

#### Tom Berger (UI/UX)
> Ein **interaktiver Messbecher** waere toll:
> - SVG-Becher mit Fuellstand (animiert)
> - Skala mit Markierungen (100 ml, 250 ml, 500 ml, 1 l)
> - Tap auf einen Fuellstand, um die Menge abzulesen
>
> **Problem:** Die meisten Aufgaben aus Kap. 9 sind reine Umrechnungs-Aufgaben (schreibe 2 l in ml). Dafuer braucht man keinen interaktiven Becher -- ein statisches Bild mit Input-Feld reicht.

**Touch-Interaktionen:** Slider fuer Fuellstand oder Tap auf Markierungen. Machbar, aber nicht zwingend noetig.

#### Sarah Kowalski (Frontend)
> Vom Skizze-Code ist **wenig wiederverwendbar**. Der Messbecher-SVG muss komplett neu gebaut werden. Die Aufgabenlogik (Umrechnung) ist trivial. Empfehlung: **Kein 3-Phasen-Flow**, sondern ein eigener Stage mit Messbecher-Visualisierung + Input.

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | Kein natuerlicher 3-Phasen-Flow |
| Machbarkeit | Gut als eigener Stage-Typ |
| Aufwand | **M** (Medium) -- wegen Messbecher-SVG |
| Wiederverwendbarkeit | 15% (nur Orchestrator-Shell) |
| Empfehlung | Eigener Stage-Typ, kein 3-Phasen-Template |

---

### Kandidat 4: Zahlenstrahl (Kap. 2)
**Zahlen ablesen/einordnen auf interaktivem Zahlenstrahl**

#### Prof. Sommer (Paedagogik)
> Hier laesst sich ein sinnvoller 3-Phasen-Flow konstruieren:
> 1. **Skalierung bestimmen:** Anfang, Ende und Schrittweite des Zahlenstrahls erkennen
> 2. **Markierung setzen:** Gegebene Zahl auf dem Zahlenstrahl einordnen (Tap/Drag)
> 3. **Antwort:** Zahl ablesen und eingeben
>
> **Aber:** Die meisten Zahlenstrahl-Aufgaben sind 1-Schritt-Aufgaben (ablesen oder einordnen). Ein 3-Phasen-Flow waere **Overengineering** fuer einfache Ableseaufgaben. Besser: 2 Varianten als separate Stages (Ablesen + Einordnen).
>
> **Ausnahme:** Die Mitte-finden-Aufgabe hat schon einen eigenen Stage (`MitteView`) und funktioniert hervorragend als 1-Phasen-Interaktion.

**Didaktisch sinnvoll?** Nein als 3-Phasen-Flow. Ja als interaktiver Zahlenstrahl-Stage.

#### Tom Berger (UI/UX)
> Ein **interaktiver Zahlenstrahl** ist extrem wertvoll:
> - Pinch-to-Zoom fuer verschiedene Skalierungen
> - Drag eines Markers auf den Strahl
> - Snap-to-Grid an den Skalenstrichen
>
> **Das ist ein eigenes UI-Primitiv**, kein 3-Phasen-Flow. Es gibt bereits `src/components/zahlenstrahl/`-Komponenten, die erweitert werden koennten.

**Touch-Interaktionen:** Tap + Drag auf den Strahl. Pan/Zoom optional. Sehr gut geeignet fuer iPad.

#### Sarah Kowalski (Frontend)
> Die bestehenden Zahlenstrahl-Komponenten in `src/components/zahlenstrahl/` sind die Basis. Der Skizze-Code ist **nicht relevant** -- die Interaktionslogik ist voellig anders (Drag auf Strahl statt Tap-Chips + Input-Felder).

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | Kein natuerlicher 3-Phasen-Flow |
| Machbarkeit | Sehr gut als eigener interaktiver Stage |
| Aufwand | **M** (Medium) |
| Wiederverwendbarkeit | 10% (nur allgemeine Patterns) |
| Empfehlung | Eigener Stage-Typ mit Zahlenstrahl-Komponenten |

---

### Kandidat 5: Stellenwerttafel (Kap. 1-2)
**Drag & Drop in T|H|Z|E Felder**

#### Prof. Sommer (Paedagogik)
> Hier laesst sich ein **eleganter 3-Phasen-Flow** konstruieren:
> 1. **Stellenwerte identifizieren:** Aus einem Zahlwort oder einer Beschreibung die Stellenwerte erkennen (z.B. "3 Hunderter, 5 Zehner" -> H=3, Z=5)
> 2. **In Tafel eintragen:** Ziffern per Tap/Drag in die richtige Spalte der Stellenwerttafel setzen
> 3. **Zahl ablesen:** Die vollstaendige Zahl aus der Tafel ablesen und eingeben
>
> Das ist didaktisch **hervorragend** -- es spiegelt den tatsaechlichen Lernprozess: erst verstehen, dann ordnen, dann synthetisieren. Besonders bei Zahlen mit Nullen (1.007 -- null Hunderter, null Zehner) wird die Stellenwerttafel zum unverzichtbaren Werkzeug.

**Didaktisch sinnvoll?** Ja! Das ist einer der besten Kandidaten.

#### Tom Berger (UI/UX)
> **UI-Mockup (Text):**
> ```
> Phase 1: Aufgabentext + Chips
> +-----------------------------------------+
> | "5 Hunderttausender, 3 Zehntausender"   |
> |                                          |
> | [5 HT] [3 ZT]  <- extrahierte Chips     |
> +-----------------------------------------+
>
> Phase 2: Stellenwerttafel
> +----+----+----+----+----+----+----+
> | M  | HT | ZT | T  | H  | Z  | E  |
> +----+----+----+----+----+----+----+
> | __ | [5]| [3]| __ | __ | __ | __ |
> +----+----+----+----+----+----+----+
>
> Phase 3: Ergebnis
> +----+----+----+----+----+----+----+
> | M  | HT | ZT | T  | H  | Z  | E  |
> +----+----+----+----+----+----+----+
> |    |  5 |  3 |  0 |  0 |  0 |  0 |
> +----+----+----+----+----+----+----+
> Die Zahl ist: [530.000]  <- Input
> ```
>
> **Touch:** Tap auf Tafel-Zellen + Tastatur-Input. Alternativ Drag & Drop von Chips in Zellen (aufwendiger). Tap-basiert ist simpler und zuverlaessiger.

**Touch-Interaktionen:** Tap auf Zelle + Ziffern-Input. Gut auf iPad.

#### Sarah Kowalski (Frontend)
> Das Orchestrator-Pattern und der Phasen-Indikator sind **direkt wiederverwendbar**. Phase 3 (Antwort + Feedback) kann die bestehende `FeedbackBanner`-Komponente nutzen. Neu zu bauen:
> - **Stellenwerttafel-Komponente** (Grid mit 7 Spalten, editierbare Zellen)
> - **Chip-Extraktion** aus dem Aufgabentext (Phase 1)
> - **Auto-Null-Fueller** fuer leere Stellen
>
> Die `BlockDisplay`-Komponente fuer Dienes-Bloecke koennte in Phase 1 zur Visualisierung genutzt werden.

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Stellenwerte erkennen 2. In Tafel eintragen 3. Zahl ablesen |
| Machbarkeit | Sehr gut |
| Aufwand | **M** (Medium) |
| Wiederverwendbarkeit | 50% (Orchestrator, Phasen-Indikator, FeedbackBanner, BlockDisplay) |
| Empfehlung | **Top-Kandidat** -- ideal fuer 3-Phasen-Flow |

---

### Kandidat 6: Brueche (Kap. 9)
**Pizza/Kuchen-Visualisierung**

#### Prof. Sommer (Paedagogik)
> Brueche koennen in einen 3-Phasen-Flow passen, wenn man sie als visuelles Erkennen strukturiert:
> 1. **Ganzes erkennen:** Wie viele gleiche Teile hat die Figur insgesamt? (Nenner bestimmen)
> 2. **Anteil markieren:** Geforderten Anteil faerben/antippen (Zaehler bestimmen)
> 3. **Bruch schreiben:** Den Bruch als Zahl eingeben (z.B. 3/4)
>
> **Aber:** Fuer einfache Aufgaben (1/2, 1/4) ist das zu viel Zeremonie. Der Flow lohnt sich erst bei komplexeren Aufgaben (3/8, aequivalente Brueche). Fuer die Grundaufgaben aus Kap. 9 reicht ein 1-Phasen-Flow mit visueller Unterstuetzung.

**Didaktisch sinnvoll?** Bedingt. Fuer fortgeschrittene Bruchaufgaben ja, fuer den Einstieg Overengineering.

#### Tom Berger (UI/UX)
> **UI-Mockup:**
> ```
> Phase 1: Figur anzeigen
> +-------------------+
> |   [Kreis in 8     |
> |    Teile geteilt]  |
> |                    |
> | "In wie viele      |
> |  Teile ist der     |
> |  Kreis geteilt?"   |
> | Antwort: [8]       |
> +-------------------+
>
> Phase 2: Anteil markieren
> +-------------------+
> |   [Kreis: tippe    |
> |    3 Teile an]     |
> |                    |
> | "Tippe 3 Teile an" |
> +-------------------+
>
> Phase 3: Bruch eingeben
> | Zaehler:  [3]      |
> | ------             |
> | Nenner:   [8]      |
> | = 3/8              |
> +-------------------+
> ```
>
> **Touch:** Tap auf Kreissegmente zum Faerben. Das ist Touch-natuerlich und macht Kindern Spass. SVG-Kreissegmente mit Hit-Areas.

**Touch-Interaktionen:** Tap auf Segmente. Gut machbar, visuell ansprechend.

#### Sarah Kowalski (Frontend)
> Fast alles muss **neu** gebaut werden:
> - Kreis/Rechteck-SVG mit interaktiven Segmenten
> - Segment-Tap-Logik (Zaehler hochzaehlen)
> - Bruch-Eingabe-Komponente (Zaehler/Nenner getrennt)
>
> Vom Skizze-Code ist nur das Orchestrator-Pattern nutzbar.

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Teile zaehlen (Nenner) 2. Anteil markieren (Zaehler) 3. Bruch eingeben |
| Machbarkeit | Gut -- SVG-Segmente sind Standard |
| Aufwand | **L** (Large) -- wegen interaktiver SVG-Grafik |
| Wiederverwendbarkeit | 20% (nur Orchestrator) |
| Empfehlung | Eigener Stage-Typ mit optionalem 3-Phasen-Flow fuer fortgeschrittene Aufgaben |

---

### Kandidat 7: Schriftliches Rechnen (Kap. 3, 5, 8)
**Stellengerechte Eingabe untereinander**

#### Prof. Sommer (Paedagogik)
> Schriftliches Rechnen hat einen **natuerlichen Phasen-Flow**, aber es sind **nicht 3 Phasen wie bei Skizze**, sondern ein **Zeile-fuer-Zeile-Flow**:
> 1. **Aufgabe aufschreiben:** Zahlen stellengerecht untereinander notieren
> 2. **Schrittweise rechnen:** Von rechts nach links Stelle fuer Stelle rechnen (mit Uebertrag)
> 3. **Ergebnis pruefen:** Endergebnis ablesen und ggf. mit Umkehraufgabe pruefen
>
> Das klingt nach 3 Phasen, aber Phase 2 ist in sich **iterativ** (mehrere Schritte pro Stelle). Das ist ein fundamental anderer Flow als Skizze. Ich empfehle einen **eigenen Flow-Typ**: Schrittweises Rechnen mit Eingabe pro Stelle.

**Didaktisch sinnvoll?** Ja, aber als eigener Flow-Typ (nicht Skizze-Template).

#### Tom Berger (UI/UX)
> **UI-Mockup:**
> ```
>   Phase 1: Stellengerecht aufschreiben
>   +------+------+------+------+------+
>   | ZT   |  T   |  H   |  Z   |  E   |
>   +------+------+------+------+------+
>   |      |  4   |  5   |  3   |  8   |
>   |  +   |  2   |  7   |  6   |  5   |
>   +------+------+------+------+------+
>   |      |  ?   |  ?   |  ?   |  ?   |
>   +------+------+------+------+------+
>   Uebertrag: [_] [_] [_] [_]
>
>   Phase 2: Von rechts nach links rechnen
>   -> E: 8+5=13, schreibe 3, Uebertrag 1
>   -> Z: 3+6+1=10, schreibe 0, Uebertrag 1
>   -> ...
>
>   Phase 3: Ergebnis
>   = 7.303
> ```
>
> **Herausforderung:** Die stellengerechte Eingabe mit Uebertrag-Zeile braucht eine **spezielle Grid-Komponente**. Auf dem iPad ist das machbar, wenn die Zellen gross genug sind (min 44x44px). Fuer 6-stellige Zahlen wird es aber eng auf dem iPhone.

**Touch-Interaktionen:** Tap in einzelne Zellen + Ziffern-Tastatur. Overflow bei grossen Zahlen auf iPhone.

#### Sarah Kowalski (Frontend)
> Das ist ein **komplett neuer UI-Typ**. Nichts vom Skizze-Code ist wiederverwendbar (ausser dem generischen Phase-Pattern). Zu bauen:
> - **Rechen-Grid-Komponente** (dynamisch fuer Add/Sub/Mul/Div)
> - **Uebertrag-Logik** mit visueller Anzeige
> - **Schritt-fuer-Schritt-Validierung** (jede Stelle einzeln pruefen)
> - **Vier Varianten:** Addition, Subtraktion, Multiplikation, Division
>
> Die Division (Kap. 8) ist besonders komplex wegen des umgekehrten Ablaufs (von links nach rechts).

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Aufgabe aufschreiben 2. Schrittweise rechnen 3. Ergebnis pruefen |
| Machbarkeit | Machbar, aber aufwendig |
| Aufwand | **XL** (Extra Large) -- wegen 4 Rechenarten + Uebertrag-Logik |
| Wiederverwendbarkeit | 10% (nur generisches Phase-Pattern) |
| Empfehlung | **Eigener Flow-Typ** (Schriftliches-Rechnen-Engine), nicht Skizze-Template |

---

### Kandidat 8: Kombinatorik (Kap. 7)
**Baumdiagramme als interaktive Grafik**

#### Prof. Sommer (Paedagogik)
> Baumdiagramme haben einen natuerlichen 3-Phasen-Flow:
> 1. **Elemente identifizieren:** Welche Objekte/Personen gibt es? (z.B. Lena, Tom, Mia)
> 2. **Baum aufbauen:** Aeste Stufe fuer Stufe von links nach rechts aufspannen
> 3. **Zaehlen/Antworten:** Alle Pfade zaehlen und die Multiplikationsregel erkennen
>
> Das passt **erstaunlich gut** zum Skizze-Flow: Phase 1 = Struktur erkennen, Phase 2 = Grafik aufbauen, Phase 3 = Ergebnis berechnen. Die kognitive Parallele ist stark.

**Didaktisch sinnvoll?** Ja! Einer der besten Kandidaten fuer den 3-Phasen-Ansatz.

#### Tom Berger (UI/UX)
> **UI-Mockup:**
> ```
> Phase 1: Elemente benennen
> "Drei Freunde wollen nebeneinander stehen."
> Tippe die Freunde an: [Lena] [Tom] [Mia]
>
> Phase 2: Baum aufbauen
>        ┌── [?] ── [?]     Tippe den naechsten Ast
> [Lena]─┤
>        └── [?] ── [?]
>
> [Tom]──┤ ...
>
> [Mia]──┤ ...
>
> Phase 3: Zaehlen
> "Wie viele Moeglichkeiten gibt es?"
> Zaehle die Pfade: [6]
> Erklaerung: 3 x 2 x 1 = 6
> ```
>
> **Herausforderung:** Baumdiagramme brauchen **viel Platz**. Mit 4+ Elementen (24 Pfade) wird es auf dem iPhone unuebersichtlich. Loesung: Horizontales Scrollen oder schrittweiser Aufbau (nur den aktuellen Teilbaum zeigen).

**Touch-Interaktionen:** Tap auf Aeste/Knoten, um den Baum Schritt fuer Schritt aufzubauen. Horizontal scrollbar bei grossem Baum.

#### Sarah Kowalski (Frontend)
> Das Orchestrator-Pattern ist wiederverwendbar, alles andere ist neu:
> - **Baum-SVG/Canvas-Komponente** mit dynamischer Tiefe/Breite
> - **Ast-fuer-Ast-Aufbau-Logik** (Progressive Disclosure)
> - **Pfad-Zaehler**
>
> Die Baum-Visualisierung ist die groesste Herausforderung. Ein flexibles Baum-Layout (egal ob 3 oder 4 Elemente) braucht ein ordentliches Layout-Algorithmus.

| Eigenschaft | Bewertung |
|-------------|-----------|
| Phasen | 1. Elemente identifizieren 2. Baum aufbauen 3. Pfade zaehlen |
| Machbarkeit | Gut fuer 3 Elemente, schwieriger fuer 4+ |
| Aufwand | **L** (Large) -- wegen Baum-Layout |
| Wiederverwendbarkeit | 20% (Orchestrator + Phasen-Indikator) |
| Empfehlung | Lohnenswert, aber auf 3 Elemente beschraenken fuer v1 |

---

## 3. Zusammenfassung

### Aufwand und Eignung auf einen Blick

| # | Kandidat | 3-Phasen-Flow? | Aufwand | Wiederverwendung | Prioritaet |
|---|----------|---------------|---------|------------------|------------|
| 1 | Entfernungen | Perfekt | **S** | 90% | 1 -- Sofort |
| 5 | Stellenwerttafel | Sehr gut | **M** | 50% | 2 -- Naechster Sprint |
| 8 | Kombinatorik | Gut | **L** | 20% | 3 -- Lohnenswert |
| 2 | Gewichte | Anpassbar | **M** | 40% | 4 -- Variante |
| 6 | Brueche | Bedingt | **L** | 20% | 5 -- Eigener Typ besser |
| 3 | Liter/Milliliter | Nein | **M** | 15% | 6 -- Eigener Typ |
| 4 | Zahlenstrahl | Nein | **M** | 10% | 7 -- Eigener Typ |
| 7 | Schriftl. Rechnen | Eigener Flow | **XL** | 10% | 8 -- Separates Projekt |

---

## 4. Gremiums-Empfehlung

### Tier 1: Direkte Uebertragung des 3-Phasen-Flows

**Entfernungen** (Kandidat 1) -- Keine Frage, das ist der offensichtlichste naechste Schritt. Die bestehende Skizze-Infrastruktur kann fast 1:1 genutzt werden. Einfach neue Aufgaben in `problems.ts` einfuegen oder einen Unter-Typ fuer die Kap-6-Entfernungsaufgaben anlegen.

**Stellenwerttafel** (Kandidat 5) -- Der intellektuell spannendste Kandidat. Phase 1 (Stellenwerte erkennen), Phase 2 (in Tafel eintragen), Phase 3 (Zahl ablesen) bilden einen didaktisch sauberen Dreischritt, der den Lernprozess 1:1 abbildet. Die Stellenwerttafel-Komponente ist auch fuer andere Stages wiederverwendbar.

### Tier 2: Angepasster 3-Phasen-Flow

**Kombinatorik/Baumdiagramme** (Kandidat 8) -- Die Phasen-Parallele ist stark (Elemente -> Baum -> Zaehlen). Der Aufwand steckt in der Baum-Visualisierung. Empfehlung: Erst mit 3 Elementen starten (6 Moeglichkeiten), spaeter auf 4 erweitern.

**Gewichte** (Kandidat 2) -- Funktioniert als 3-Phasen-Flow, wenn man Phase 1 als Einheiten-Konvertierung umdeutet. Die Tabellen-UI (Leergewicht | Ladung | Gesamt) ist ein natuerliches Aequivalent zur Strecken-Tabelle.

### Tier 3: Eigene Stage-Typen (kein 3-Phasen-Template)

**Brueche, Liter/Milliliter, Zahlenstrahl** -- Diese Typen profitieren mehr von eigenen, spezialisierten Interaktionen (Kreissegmente antippen, Messbecher-Fuellstand, Drag auf Zahlenstrahl) als von einem erzwungenen 3-Phasen-Flow.

**Schriftliches Rechnen** -- Das ist ein **eigenes Grossprojekt** mit einer Schritt-fuer-Schritt-Rechen-Engine. Hier lohnt sich ein separates Template-System (Stellengerechtes-Rechnen-Flow), das dann fuer Addition, Subtraktion, Multiplikation und Division wiederverwendet wird.

### Konkrete naechste Schritte

1. **Sofort:** Entfernungen-Aufgaben aus Kap. 6 als neue `problems` im bestehenden Skizze-Stage ergaenzen
2. **Sprint 1:** Stellenwerttafel-Stage mit 3-Phasen-Flow neu bauen (wiederverwendbare Tafel-Komponente!)
3. **Sprint 2:** Kombinatorik-Stage mit Baumdiagramm-Visualisierung (erst 3 Elemente)
4. **Parallel planen:** Schriftliches-Rechnen-Engine als eigenes Architektur-Konzept entwerfen
