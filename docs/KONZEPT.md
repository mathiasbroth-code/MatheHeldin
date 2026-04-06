# MatheHeldin — Expertengremium-Konzept

Ergebnis einer fachübergreifenden Analyse: Pädagogik, UI/UX, Frontend-Architektur, Datenbank, Mobile/PWA.

---

## 1. Pädagogisches Fundament

### 1.1 Didaktische Grundprinzipien

| Prinzip | Umsetzung |
|---------|-----------|
| **Fehler sind Lernchancen** | Nie "Falsch!" sagen. Immer "Noch nicht ganz" + konkreter Hinweis, was das Kind tun kann. |
| **Scaffolding statt Lösung** | Tipp-System in 3 Stufen: (1) allgemeiner Denkanstoß, (2) konkreter Hinweis, (3) Schritt-für-Schritt-Lösung. Kind entscheidet, wie viel Hilfe es braucht. |
| **Visuelles Lernen** | Dienes-Material, Zahlenstrahl, Skizzen — immer erst das Bild, dann die Zahl. Philippa ist visuelle Lernerin, aber das Prinzip gilt allgemein. |
| **Kein Lock-in** | Alle Stufen von Anfang an offen. Kein "Du musst erst X schaffen, um Y zu machen." Kinder lernen nicht linear. |
| **Selbstwirksamkeit** | Sichtbarer Fortschritt (Sterne, Balken), aber nie Druck. Kein Timer, kein Ranking, kein "Du bist langsamer als..." |
| **Wiederholung mit Variation** | Aufgaben-Generatoren erzeugen immer neue Varianten. Nie dieselbe Aufgabe zweimal hintereinander. |
| **Kontext-Bezug** | Sachaufgaben aus dem Kinderalltag: Radtour, Schwimmbad, Einkaufen, Tiere. |

### 1.2 Lern-Tipps pro Aufgabentyp

Jede Stufe braucht **drei Tipp-Stufen**, die im AntwortLog als `tippStufe: 0|1|2|3` gespeichert werden:

| Stufe | Name | Beispiel (Mitte-Aufgabe) |
|-------|------|--------------------------|
| 0 | Kein Tipp | Kind arbeitet allein |
| 1 | Denkanstoß | "Überlege: Wie groß ist der Abstand zwischen den beiden Zahlen?" |
| 2 | Methode | "Rechne zuerst den Abstand aus, teile ihn durch 2, zähle ihn zur kleineren Zahl dazu." |
| 3 | Schritt-für-Schritt | "8.000 − 6.000 = 2.000. 2.000 ÷ 2 = 1.000. 6.000 + 1.000 = 7.000" |

### 1.3 Fredo-4-Curriculum → MatheHeldin-Stufen

81 Bucheinträge → priorisiert in 4 Implementierungswellen:

**Welle 1 — Kern (bereits im Referenzcode):**
- Mengen bis 20, Bündeln, Zahlen lesen/legen (100/1000/10000), Zerlegen, Mitte, Skizze

**Welle 2 — Zahlenraum bis Million + Grundrechenarten:**
- Zahlen sprechen/schreiben bis 1.000.000 (Fredo #10, #11)
- Zahlen vergleichen & verändern (#12)
- Nachbarzahlen (#16), Runden (#17, #18)
- Große Zahlen am Zahlenstrahl (#15) — erweitert den bestehenden Zahlenstrahl
- Kopfrechnen Add/Sub (#19), Schriftliches Add/Sub (#20)
- Kopfrechnen Mult/Div (#32, #33)

**Welle 3 — Vertiefung Rechnen:**
- Schriftliches Multiplizieren (#35-#37)
- Schriftliches Dividieren (#51-#52)
- Halbschriftliches Mult/Div (#34, #48-#49)
- Rechenketten (#24), Zahlenrätsel (#25)
- Rechenregeln (#26), Gleichungen/Ungleichungen (#27)
- ANNA-Zahlen (#21), Teilbarkeitsregeln (#50)
- Rechnen mit Kommazahlen (#53)

**Welle 4 — Spezial-Module:**
- Geometrie: Achsensymmetrie (#28), Flächeninhalt/Umfang (#31), Kreise (#62) — SVG-interaktiv
- Größen: Tonne/kg (#38), Entfernungen (#40), Geschwindigkeiten (#41), Liter/ml (#56)
- Daten: Kombinatorik (#43), Diagramme (#71)
- Brüche (#55), Römische Zahlen (#72), Binärsystem (#73)
- Forscherkiste: Fibonacci (#76), Pascalsches Dreieck (#79)

**Nicht digital sinnvoll:** Faltschnitte (#29), Geodreieck-Zeichnen (#30), Körpernetze basteln (#64), Schrägbilder (#65) — diese sind haptisch besser aufgehoben.

---

## 2. Feature-Katalog

### 2.1 MUSS-Features (v1)

| # | Feature | Beschreibung |
|---|---------|-------------|
| F1 | **Kinderprofil-Auswahl** | Start-Screen: Wer übt heute? Avatar + Name. Tap zum Starten. |
| F2 | **Stufen-Übersicht** | Alle Stufen als farbige Karten mit Icon, Titel, Fortschrittsbalken. Gruppiert nach Kategorien (Z/R/S). |
| F3 | **Stufen-Runner** | Einheitlicher Ablauf: Aufgabe → Eingabe → Prüfung → Feedback → Nächste. Funktioniert für alle Stufen gleich. |
| F4 | **3-stufiges Tipp-System** | Tipp-Button zeigt progressiv mehr Hilfe. Jede Nutzung wird im Log gespeichert. |
| F5 | **Positives Feedback** | "Richtig!" mit kurzer Erklärung. "Noch nicht ganz" mit konkretem Hinweis. Nie demotivierend. |
| F6 | **Fortschrittsbalken pro Stufe** | Anzeige: X von Y richtig. Sterne oder Füllanzeige. Ziel konfigurierbar (default 5). |
| F7 | **Antwort-Persistenz** | Jede Antwort in Dexie: Aufgabe, Antwort, richtig/falsch, Dauer, Tipp-Stufe, Timestamp. |
| F8 | **Offline-fähige PWA** | Installierbar auf iPad/iPhone. Funktioniert ohne Internet. Service Worker cacht alle Assets. |
| F9 | **Touch-first UI** | 44px Min-Tap-Target. Große Buttons. Kein Hover-only. Scrollbare Bereiche mit Momentum. |
| F10 | **Responsive Layout** | Funktioniert auf iPhone (375px), iPad (768px), Laptop (1024px+). Breakpoints: sm/md/lg. |

### 2.2 SOLL-Features (v1.5)

| # | Feature | Beschreibung |
|---|---------|-------------|
| F11 | **Eltern-Dashboard** | Geschützter Bereich (PIN oder Wischgeste). Zeigt: Welches Kind hat wann wie viel geübt? Wo Schwächen? Trend-Grafiken. |
| F12 | **Lernfortschritts-Übersicht** | Pro Kind: Heatmap (welche Tage geübt), Fehlerquote pro Stufe, Tipp-Nutzungsquote, Zeitverlauf. |
| F13 | **Mehrere Kinder** | Profile anlegen/bearbeiten/löschen. Jedes Kind hat eigenen Fortschritt. Profilwechsel auf Startseite. |
| F14 | **Kategorie-Gruppierung** | Stufen nach Fredo-Kategorien gruppieren: Zahlen (Z), Rechnen (R), Größen & Sachrechnen (S), Geometrie (G), Daten (D). |
| F15 | **Tooltips / Erklärungen** | Bei jeder Stufe ein "?" Button mit kindgerechter Erklärung: "Was lernst du hier?" + "So geht's". |
| F16 | **Session-Zusammenfassung** | Nach Beenden einer Übungsrunde: "Du hast heute 12 Aufgaben gemacht, 9 richtig! Super!" |
| F17 | **Streak / Motivations-Element** | "Du hast 3 Tage hintereinander geübt!" — kein Druck, nur Anerkennung wenn es passiert. |

### 2.3 KANN-Features (v2+)

| # | Feature | Beschreibung |
|---|---------|-------------|
| F18 | **Adaptiver Schwierigkeitsgrad** | Wenn Kind viele Fehler macht → einfachere Variante. Viele richtig → schwieriger. Pro Stufe konfigurierbar. |
| F19 | **Aufgaben-Favoriten** | Kind kann Aufgabentypen als Liebling markieren → schneller Zugang. |
| F20 | **Cloud-Sync** | Supabase/Firebase: Fortschritt geräteübergreifend synchronisieren. Optional, kein Lock-in. |
| F21 | **Mathe-Lexikon** | Interaktives Glossar (Fredo #81): Kind tippt auf "Stellenwert" → Animation zeigt was das ist. |
| F22 | **Rechenweg-Anzeige** | Bei komplexen Aufgaben (schriftlich Mult/Div): schrittweise Animation des Lösungswegs. |
| F23 | **Sound-Feedback** | Optionale Töne bei richtig/falsch. Ausschaltbar in den Einstellungen. |
| F24 | **Dark Mode / Themes** | Kind wählt Farb-Theme. Nachtmodus für Abend-Üben. |
| F25 | **Export für Eltern** | CSV/PDF-Export der Lernstatistiken fürs Elterngespräch mit der Lehrerin. |

---

## 3. UI/UX-Konzept

### 3.1 Design-Sprache

```
Kernwerte: Warm, einladend, klar, nie überfordernd.

Primärfarbe:    Emerald (#10b981) — Fortschritt, Erfolg
Hintergrund:    Amber-50 (#fffbeb) — warm, wie ein Blatt Papier
Akzentfarben:   Pro Kategorie (Z=sky, R=amber, S=emerald, G=indigo, D=purple)
Schrift:        System-Font-Stack, bold für Zahlen, tabular-nums
Ecken:          Durchgehend rounded-2xl (16px) — weich, kindgerecht
Schatten:       shadow-md — dezente Tiefe, kein flaches Material-Design
```

### 3.2 Navigationsstruktur

```
┌─────────────────────────────────────────────────┐
│  /                    Profil-Auswahl            │
│  ├─ /ueben            Stufen-Übersicht          │
│  │  └─ /stufe/:id     Übungsmodus               │
│  ├─ /fortschritt      Lernfortschritt (Kind)    │
│  └─ /eltern           Eltern-Dashboard (PIN)    │
│     ├─ /eltern/kinder   Profile verwalten       │
│     └─ /eltern/stats    Detaillierte Statistik  │
└─────────────────────────────────────────────────┘
```

### 3.3 Screen-Designs (Wireframe-Beschreibung)

**Startseite / Profil-Auswahl:**
- Große, runde Avatar-Kreise (mind. 80px) mit Name darunter
- "+" Button zum Anlegen eines neuen Profils
- Kein Login, kein Passwort — das sind Kinder
- Darunter dezent: "Eltern-Bereich" Link (öffnet PIN-Eingabe)

**Stufen-Übersicht (Hauptscreen):**
- Header: "Hallo [Name]!" + Avatar klein
- Kategorie-Tabs oder Scroll-Sektionen: Zahlen | Rechnen | Sachrechnen | ...
- Pro Stufe: Farbige Karte mit Icon, Titel, Untertitel, Fortschrittsbalken
- Untere Tab-Bar: Üben | Fortschritt | (Eltern)
- Fortschrittsbalken zeigt: X/Y Sterne oder Prozent

**Übungsmodus:**
- Oben: Zurück-Button + Stufen-Titel + Fortschritt (3/5 Sterne)
- Mitte: Aufgabe (visuell, groß, klar)
- Unten: Eingabe + Buttons (Prüfen, Tipp, Nächste)
- Tipp-Button: erst "Tipp", dann "Mehr Tipp", dann "Lösung zeigen"
- Feedback erscheint inline (kein Modal, kein Popup)

**Lernfortschritt (Kind-Ansicht):**
- Einfach gehalten: "Du hast schon X Stufen geschafft!"
- Balkendiagramm: pro Stufe wie viel Prozent richtig
- Kalender/Heatmap: an welchen Tagen geübt

**Eltern-Dashboard:**
- PIN-geschützt (4-stellig, in Zustand persist gespeichert)
- Pro Kind: Übersichts-Karte mit Gesamtfortschritt
- Drill-Down: Stufen-Details, Fehlerquote, Tipp-Nutzung, Zeitverlauf
- Empfehlung: "Philippa hat bei Zahlen zerlegen Schwierigkeiten. Tipp: Zusammen mit Dienes-Material üben."

### 3.4 Mobile-spezifische UX

| Thema | Lösung |
|-------|--------|
| **Tastatur** | `inputMode="numeric"` für Zahlen, `inputMode="decimal"` für Kommazahlen. Kein `type="number"` (spinners stören auf Mobile). |
| **Viewport** | `viewport-fit=cover` + safe-area padding für Notch/Dynamic Island. |
| **Scroll** | Übungs-View scrollt nicht — alles in einer Bildschirmhöhe. Bei Bedarf: vertikaler Scroll mit snap. |
| **Orientation** | Portrait bevorzugt. Landscape erlaubt, aber Layout passt sich an. |
| **Tap-Targets** | Minimum 44x44px. Buttons eher 48px hoch. Chips 40px. |
| **Gesten** | Swipe-left für "Nächste Aufgabe" (optional). Kein Swipe-Right für Zurück (kollidiert mit Safari). |

---

## 4. Datenbank-Erweiterung

### 4.1 Erweitertes Dexie-Schema (v2)

Gegenüber dem aktuellen Schema brauchen wir:

```
profiles        — erweitert um: avatar (string), pin? (für Eltern-Profil)
sessions        — unverändert
antworten       — erweitert um: tippStufe (0-3), schwierigkeitsgrad? (number)
tagesStats      — NEU: denormalisierte Tagesübersicht für Heatmap
einstellungen   — NEU: soundAn, darkMode, elternPin
```

```ts
// Erweitertes Schema
this.version(2).stores({
  profiles: '++id, name',
  sessions: '++id, profileId, stufeId, gestartetAm',
  antworten: '++id, [profileId+stufeId], [profileId+erstelltAm], sessionId, erstelltAm, richtig',
  tagesStats: '++id, [profileId+datum], datum',
  einstellungen: 'key',
}).upgrade(tx => {
  // Migration: tippStufe default 0 für bestehende Einträge
  return tx.table('antworten').toCollection().modify(entry => {
    if (entry.tippStufe === undefined) entry.tippStufe = 0;
  });
});
```

### 4.2 Wichtige Queries

| Query | Zweck | Index |
|-------|-------|-------|
| `antworten.where('[profileId+stufeId]')` | Fortschritt pro Stufe | Compound |
| `antworten.where('[profileId+erstelltAm]')` | Zeitverlauf / Heatmap | Compound (NEU) |
| `antworten.where('richtig').equals(0).and(profileId)` | Schwächen identifizieren | Filter |
| `tagesStats.where('[profileId+datum]')` | Schnelle Tagesübersicht | Compound |

### 4.3 Profilstruktur

```ts
interface Profile {
  id?: number;
  name: string;
  avatar: string;        // Emoji oder Bild-Key ('🦊', '🌟', '🚀', ...)
  farbe: string;         // Tailwind-Farbe für Personalisierung
  istEltern: boolean;    // true = Eltern-Profil (kein Übungsmodus)
  pin?: string;          // 4-stellig, nur für Eltern-Zugang
  erstelltAm: number;
}
```

---

## 5. Technische Architektur-Ergänzungen

### 5.1 Stage-Registry mit Metadaten

```ts
// Erweitertes Stage-Interface
interface Stage<T extends Aufgabe = Aufgabe> {
  id: string;
  titel: string;
  sub: string;
  icon: string;
  farbe: StageFarbe;
  kategorie: 'Z' | 'R' | 'G' | 'S' | 'D';   // NEU: Fredo-Kategorie
  zielRichtige: number;
  schwierigkeiten?: number[];                   // NEU: z.B. [1,2,3] für adaptive Level
  erklaerung: {                                  // NEU: Tooltip-Inhalte
    wasLernstDu: string;
    soGehts: string;
  };
  tipps: (aufgabe: T) => string[];              // NEU: 3 Tipp-Stufen
  generator: (schwierigkeit?: number) => T;
  validator: (aufgabe: T, antwort: string) => boolean;
  View: ComponentType<StageProps<T>>;
}
```

### 5.2 Responsive Breakpoints

```
Mobile:   < 640px   → single column, große Touch-Targets
Tablet:   640-1024px → etwas mehr Platz, 2-Spalten in Übersicht
Laptop:   > 1024px  → max-width Container, komfortable Abstände
```

### 5.3 Routing-Erweiterung

```ts
<Routes>
  <Route path="/" element={<ProfilAuswahl />} />
  <Route path="/ueben" element={<Uebersicht />} />
  <Route path="/stufe/:stufeId" element={<StufeView />} />
  <Route path="/fortschritt" element={<Fortschritt />} />
  <Route path="/eltern" element={<ElternGate />}>
    <Route index element={<ElternDashboard />} />
    <Route path="kinder" element={<KinderVerwalten />} />
    <Route path="stats/:profileId" element={<DetailStats />} />
  </Route>
</Routes>
```

---

## 6. Implementierungs-Roadmap

### Phase 1: Gerüst + erste Stufen (jetzt)
- [x] Vite + React + TS + Tailwind + Dexie + Zustand + PWA
- [x] Stage-Types, Registry, Hooks, Dienes-Komponenten
- [ ] `mitte`-Stufe portieren (einfachster Fall, testet kompletten Flow)
- [ ] `zahlLesen` / `zahlLegen` portieren (testet Dienes-System)
- [ ] `buendeln` + `zerlegen` portieren
- [ ] `skizze`-Stufe portieren (komplexester Fall: 3 Phasen)
- [ ] Fortschrittsbalken in Übersicht live aus Dexie

### Phase 2: Multi-Profil + Eltern-Zugang
- [ ] Profil-Auswahl Startscreen mit Avataren
- [ ] Profil-CRUD (anlegen, bearbeiten, löschen)
- [ ] Eltern-PIN + Dashboard-Grundgerüst
- [ ] Lernfortschritt-View (Kind): Balken + Heatmap
- [ ] Session-Zusammenfassung nach Übungsrunde

### Phase 3: Tipp-System + Didaktik-Verbesserung
- [ ] 3-stufiges Tipp-System in allen Stufen
- [ ] "Was lernst du hier?" Tooltips pro Stufe
- [ ] `tippStufe` in AntwortLog
- [ ] Erklärungs-Animationen bei Fehlern

### Phase 4: Welle 2 — Neue Stufen
- [ ] Zahlenraum bis 1.000.000 (lesen, schreiben, zerlegen)
- [ ] Nachbarzahlen, Runden
- [ ] Zahlenstrahl erweitern für große Zahlen
- [ ] Kopfrechnen Add/Sub, Schriftliches Add/Sub

### Phase 5: Eltern-Dashboard + Statistik
- [ ] Trend-Grafiken (Fehlerquote über Zeit)
- [ ] Stärken/Schwächen-Analyse pro Kind
- [ ] Empfehlungen ("Übe mehr X")
- [ ] Export-Funktion (optional)

### Phase 6: Welle 3+4 — Vertiefung
- [ ] Schriftliches Mult/Div
- [ ] Geometrie-Module (SVG-interaktiv)
- [ ] Brüche, Größen, Kombinatorik
- [ ] Adaptiver Schwierigkeitsgrad

---

## 7. Zusammenfassung: Was zuerst?

**Sofort (Phase 1):** Die bestehenden 11 Stufen aus dem Referenzcode portieren. Danach funktioniert die App bereits als Lernwerkzeug.

**Direkt danach (Phase 2):** Multi-Profil und Eltern-Zugang. Ohne das kann die App nicht von mehreren Kindern genutzt werden.

**Parallel entwickelbar:** Das 3-stufige Tipp-System (Phase 3) kann gleichzeitig mit neuen Stufen (Phase 4) gebaut werden, da es ein orthogonales Feature ist.

**Priorisierung nach didaktischem Wert:**
1. Stufen portieren → App ist nutzbar
2. Tipps + Erklärungen → App wird lehrreich
3. Fortschritt + Eltern → App wird nachhaltig
4. Neue Stufen → App wächst mit dem Schuljahr
