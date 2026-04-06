---
phase: 03a-aufgabenbank-inhalt-welle-a
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/aufgaben/FORMAT.md
  - docs/aufgaben/01-wiederholung.md
  - docs/aufgaben/02-zahlen-bis-million.md
autonomous: false
---

<objective>
## Goal
Aufgabenformat definieren und die ersten 2 Kapitel des Fredo-4-Schulbuches als Aufgabenbank erstellen: Kapitel 1 "Wiederholung" (S. 6-17, 8 Themen) und Kapitel 2 "Zahlen bis zur Million" (S. 18-33, 10 Themen).

## Purpose
Die Aufgabenbank ist die inhaltliche Grundlage für alle Stages in MatheHeldin. Durch die enge Orientierung am Schulbuch kann Philippa in der App genau das üben, was sie im Unterricht lernt. Die Tipps sind speziell auf visuelle Lerntypen ausgerichtet.

## Output
- `docs/aufgaben/FORMAT.md` — verbindliche Formatdefinition mit YAML-Schema und Beispielaufgabe
- `docs/aufgaben/01-wiederholung.md` — Aufgaben für Kapitel 1 (S. 6-17)
- `docs/aufgaben/02-zahlen-bis-million.md` — Aufgaben für Kapitel 2 (S. 18-33)
</objective>

<context>
## Project Context
@.paul/PROJECT.md
@.paul/ROADMAP.md
@.paul/phases/03a-aufgabenbank-inhalt-welle-a/CONTEXT.md

## Source
@_reference/Fredo4_Schulbuch.pdf (Seiten 6-33)
@docs/FREDO_MAPPING.md (Stage-IDs und Aufgabentypen)
@docs/EXPERTEN_GREMIUM.md (Prof. Sommer: Tipps, Tom: Interaktionstypen)

## Philippa-Profil
- 9 Jahre, 4. Klasse, visueller Lerntyp
- Tut sich mit Mathe generell schwer
- Tipps müssen visuell, ermutigend und kleinschrittig sein
</context>

<skills>
## Required Skills (from SPECIAL-FLOWS.md)

Keine spezialisierten Skills nötig — dies ist eine Content-Phase, keine Code-Phase.
</skills>

<acceptance_criteria>

## AC-1: FORMAT.md definiert das verbindliche Aufgabenschema
```gherkin
Given die FORMAT.md existiert
When ein Aufgaben-Autor sie liest
Then kennt er das YAML-Frontmatter-Schema (alle Pflichtfelder)
And kennt er die 8 Interaktionstypen mit Beschreibung
And kennt er die 3 Schwierigkeitsgrade (gelb/grün/orange)
And sieht er eine vollständige Beispielaufgabe als Referenz
And kennt er die Regeln für Tipp-Formulierung (visuell, 3-stufig)
```

## AC-2: Kapitel 1 enthält buchnahe Aufgaben für alle digital umsetzbaren Themen
```gherkin
Given die Datei 01-wiederholung.md existiert
When sie gelesen wird
Then enthält sie Aufgaben zu den 8 Themen von S. 6-17
And jede Aufgabe hat gültiges YAML-Frontmatter (typ, thema, schwierigkeit, buchseite)
And die Aufgabenstellungen orientieren sich am Buchtext (gleiche Struktur, eigene Zahlen)
And nicht-digitale Aufgaben sind als Platzhalter markiert
And jede Aufgabe hat Lösung, Lösungsweg, 3 Tipps, didaktischen Hinweis
And Tipps betonen visuelle Hilfen (Dienes, Stellenwerttafel, etc.)
And die Schwierigkeitsgrade sind gemischt (gelb/grün/orange)
```

## AC-3: Kapitel 2 enthält buchnahe Aufgaben für alle digital umsetzbaren Themen
```gherkin
Given die Datei 02-zahlen-bis-million.md existiert
When sie gelesen wird
Then enthält sie Aufgaben zu den 10 Themen von S. 18-33
And alle Kriterien von AC-2 gelten analog
And der Zahlenraum bis 1.000.000 wird korrekt verwendet
And deutsche Zahlenformatierung (1.234.567) wird durchgängig genutzt
```

## AC-4: Aufgabenanzahl ist nach Seitenumfang gestaffelt
```gherkin
Given ein Thema mit 1 Buchseite
Then hat es 5-6 Aufgaben
Given ein Thema mit 2 Buchseiten
Then hat es 7-9 Aufgaben
Given ein Thema mit 3+ Buchseiten
Then hat es 10-15 Aufgaben
```

</acceptance_criteria>

<tasks>

<task type="auto">
  <name>Task 1: FORMAT.md — Aufgabenformat-Definition erstellen</name>
  <files>docs/aufgaben/FORMAT.md</files>
  <action>
    Erstelle eine Formatdefinition mit:

    **1. YAML-Frontmatter-Schema:**
    - titel (string, Pflicht)
    - typ (enum: eingabe|auswahl|zuordnung|luecke|reihenfolge|schritt|wahr-falsch|textaufgabe)
    - thema (string, Unterthema aus dem Buch)
    - schwierigkeit (enum: gelb|grün|orange)
    - buchseite (number)
    - kapitel (string, z.B. "01-wiederholung")
    - stage_id (string, aus FREDO_MAPPING.md)
    - digital (enum: voll|teilweise|platzhalter)

    **2. Beschreibung jedes Interaktionstyps** mit Beispiel aus dem Buch:
    - eingabe: Zahleneingabe → "Rechne: 400 + 300"
    - auswahl: Multiple-Choice → "Welche Zahl ist größer?"
    - zuordnung: Tap-to-Match → "Ordne Einheiten zu"
    - luecke: Platzhalter → "90 : (4 + ▢) = 10"
    - reihenfolge: Sortieren → "Ordne nach der Größe"
    - schritt: Mehrstufig → Rechenkette, schriftliches Rechnen
    - wahr-falsch: Stimmt/Stimmt nicht → "Hat Jette richtig gerechnet?"
    - textaufgabe: Sachaufgabe → "Die Schule hat 2.000 Euro..."

    **3. Tipp-Regeln** (aus Experten-Gremium):
    - Tipp 1 (Denkanstoß): Frage, die zum Denkweg führt. Visuell wo möglich.
    - Tipp 2 (Methode): Strategie benennen, visuelles Hilfsmittel vorschlagen.
    - Tipp 3 (Scaffolding): Ersten Schritt vormachen, Rest offen lassen.
    - NIE: "Rechne nochmal", "Denk nach", oder die Lösung verraten.

    **4. Platzhalter-Format** für nicht-digitale Aufgaben:
    - digital: platzhalter
    - Aufgabenstellung beschreiben, warum nicht digital
    - Alternative vorschlagen falls möglich

    **5. Vollständige Beispielaufgabe** (Rechenpäckchen aus S. 9)
  </action>
  <verify>Datei existiert, enthält YAML-Schema, 8 Typen, Tipp-Regeln, Beispiel</verify>
  <done>AC-1 satisfied</done>
</task>

<task type="auto">
  <name>Task 2: Kapitel 1 — Wiederholung (S. 6-17)</name>
  <files>docs/aufgaben/01-wiederholung.md</files>
  <action>
    Lies Seiten 6-17 der PDF `_reference/Fredo4_Schulbuch.pdf` und erstelle Aufgaben.

    **Themen und Seitenumfang:**
    1. 1000 und weiter (S. 6-7, 2 Seiten → 7-9 Aufgaben)
    2. Zahlen in der Stellenwerttafel (S. 8, 1 Seite → 5-6 Aufgaben)
    3. Rechnen bis 2000 (S. 9, 1 Seite → 5-6 Aufgaben)
    4. Schriftliches Addieren (S. 10, 1 Seite → 5-6 Aufgaben)
    5. Schriftliches Subtrahieren (S. 11, 1 Seite → 5-6 Aufgaben)
    6. Große Zahlen multiplizieren (S. 12-13, 2 Seiten → 7-9 Aufgaben)
    7. Tierische Rechengeschichten (S. 14-15, 2 Seiten → 7-9 Aufgaben)
    8. Rechengeschichten (S. 16-17, 2 Seiten → 7-9 Aufgaben)

    **Regeln:**
    - Aufgabenstruktur aus dem Buch übernehmen, eigene Zahlen verwenden
    - Jede Aufgabe: YAML-Frontmatter + Aufgabenstellung + Lösung + Lösungsweg + 3 Tipps + Didaktischer Hinweis
    - Tipps betonen visuelle Hilfen (Dienes-Blöcke, Stellenwerttafel)
    - Schwierigkeitsgrade mischen: ~30% gelb, ~40% grün, ~30% orange
    - Deutsche Zahlenformatierung (1.234)
    - Kindgerechte Sprache (einfach, direkt, ermutigend)
    - Nicht-digitale Aufgaben (z.B. "Lege mit Material") als Platzhalter
    - stage_ids aus FREDO_MAPPING.md verwenden
  </action>
  <verify>Datei existiert, YAML parst korrekt, alle 8 Themen abgedeckt, Schwierigkeitsgrade gemischt</verify>
  <done>AC-2, AC-4 satisfied</done>
</task>

<task type="auto">
  <name>Task 3: Kapitel 2 — Zahlen bis zur Million (S. 18-33)</name>
  <files>docs/aufgaben/02-zahlen-bis-million.md</files>
  <action>
    Lies Seiten 18-33 der PDF und erstelle Aufgaben.

    **Themen und Seitenumfang:**
    1. Der Millionen-Würfel (S. 18-19, 2 Seiten → 7-9 Aufgaben)
    2. Zahlen sprechen und schreiben (S. 20, 1 Seite → 5-6 Aufgaben)
    3. Zahlen zerlegen (S. 21, 1 Seite → 5-6 Aufgaben)
    4. Zahlen vergleichen und verändern (S. 22-23, 2 Seiten → 7-9 Aufgaben)
    5. Rechnen im Kopf (S. 24-25, 2 Seiten → 7-9 Aufgaben)
    6. Große Anzahlen schätzen (S. 26-27, 2 Seiten → 7-9 Aufgaben)
    7. Große Zahlen am Zahlenstrahl (S. 28-29, 2 Seiten → 7-9 Aufgaben)
    8. Nachbarzahlen (S. 30, 1 Seite → 5-6 Aufgaben)
    9. Runden (S. 31, 1 Seite → 5-6 Aufgaben)
    10. Große Zahlen runden und darstellen (S. 32-33, 2 Seiten → 7-9 Aufgaben)

    **Gleiche Regeln wie Task 2.** Zusätzlich:
    - Zahlenraum bis 1.000.000 korrekt nutzen
    - Dienes-Aufbau visualisieren (Einer→Zehner→Hunderter→Tausender→ZT→HT→Million)
    - Zahlenstrahl-Aufgaben: Zahlen ablesen, Mitte finden, Nachbarn bestimmen
    - Stellenwerttafel-Aufgaben: HT|ZT|T|H|Z|E
  </action>
  <verify>Datei existiert, YAML parst korrekt, alle 10 Themen abgedeckt, Zahlenraum bis 1.000.000</verify>
  <done>AC-3, AC-4 satisfied</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Aufgabenformat-Definition + erste 2 Kapitel der Aufgabenbank</what-built>
  <how-to-verify>
    1. Öffne: docs/aufgaben/FORMAT.md
       - Prüfe: Sind die 8 Interaktionstypen klar beschrieben?
       - Prüfe: Ist das YAML-Schema vollständig?
       - Prüfe: Ist die Beispielaufgabe gut?

    2. Öffne: docs/aufgaben/01-wiederholung.md
       - Prüfe: Stimmt die Anzahl Aufgaben pro Thema?
       - Prüfe: Sind die Aufgabenstellungen nah am Buch?
       - Prüfe: Sind die Tipps visuell und hilfreich (nicht "rechne nochmal")?
       - Prüfe: Ist die Sprache kindgerecht?
       - Prüfe: Sind Schwierigkeitsgrade sinnvoll verteilt?

    3. Öffne: docs/aufgaben/02-zahlen-bis-million.md
       - Gleiche Prüfung wie bei Kapitel 1
       - Zusätzlich: Zahlenraum bis 1.000.000 korrekt?

    4. Gesamteindruck:
       - Würde Philippa die Aufgaben verstehen?
       - Sind die Tipps hilfreich für ein visuell lernendes Kind?
       - Passt das Format für die Weiterverarbeitung in Phase 4?
  </how-to-verify>
  <resume-signal>Type "approved" to continue with Kapitel 3-7, or describe issues to fix</resume-signal>
</task>

</tasks>

<boundaries>

## DO NOT CHANGE
- _reference/Fredo4_Schulbuch.pdf (Quell-PDF, nur lesen)
- docs/FREDO_MAPPING.md (Referenz, nicht modifizieren)
- docs/EXPERTEN_GREMIUM.md (Referenz, nicht modifizieren)
- src/ (kein Code in dieser Phase)
- .paul/phases/03-profil-system/ (paralleler Code-Track)

## SCOPE LIMITS
- Nur Kapitel 1-2 in diesem Plan (Kapitel 3-7 folgen in Plan 03a-02 und 03a-03)
- Keine Code-Integration (das ist Phase 4)
- Keine Änderungen am Stage-Pattern oder den bestehenden Stages
- Aufgaben sind Markdown-Content, keine TypeScript-Objekte

</boundaries>

<verification>
Before declaring plan complete:
- [ ] FORMAT.md existiert mit vollständigem YAML-Schema
- [ ] 01-wiederholung.md enthält Aufgaben zu allen 8 Themen
- [ ] 02-zahlen-bis-million.md enthält Aufgaben zu allen 10 Themen
- [ ] YAML-Frontmatter jeder Aufgabe ist syntaktisch korrekt
- [ ] Schwierigkeitsgrade sind gemischt (gelb/grün/orange)
- [ ] Tipps sind visuell orientiert und 3-stufig
- [ ] Nicht-digitale Aufgaben sind als Platzhalter markiert
- [ ] Deutsche Zahlenformatierung durchgängig
- [ ] User hat Format und Qualität im Checkpoint bestätigt
</verification>

<success_criteria>
- FORMAT.md ist verbindliche Referenz für alle weiteren Aufgaben-Dateien
- ~55-75 Aufgaben in Kapitel 1, ~65-85 Aufgaben in Kapitel 2
- Jede Aufgabe hat Lösung, Lösungsweg, 3 visuell orientierte Tipps
- User bestätigt: Format stimmt, Qualität stimmt, Sprache passt
</success_criteria>

<output>
After completion, create `.paul/phases/03a-aufgabenbank-inhalt-welle-a/03a-01-SUMMARY.md`
</output>
