# Phase 3a Context: Aufgabenbank Inhalt — Welle A

## Goals

1. **Vollständige, buchnahe Aufgabenbank für Kapitel 1-7** (S. 6-77, ~40 Themen)
   - Pro Thema eine sinnvolle Anzahl Aufgaben (5-15, nach Seitenumfang)
   - Nah am Fredo-4-Original: gleiche Aufgabenstruktur, gleiche Wortwahl, eigene Zahlen
   - Nicht-digitale Aufgaben als Platzhalter markieren

2. **Visuell orientierte Tipps** für ein Kind das sich mit Mathe schwertut
   - Philippa ist visueller Lerntyp → Tipps betonen Dienes, Zahlenstrahl, Stellenwerttafel, Skizzen
   - 3-stufig nach Prof. Sommer: Denkanstoß → Methode → Scaffolding
   - Nie demotivierend, immer konstruktiv

3. **Maschinenlesbares Format** für spätere Code-Integration (Phase 4)
   - YAML-Frontmatter pro Aufgabe
   - 8 Interaktionstypen: eingabe, auswahl, zuordnung, luecke, reihenfolge, schritt, wahr-falsch, textaufgabe
   - 3 Schwierigkeitsgrade: gelb/grün/orange (Fredo-Farbsystem)

## Approach

- **Quelle:** `_reference/Fredo4_Schulbuch.pdf` (entschlüsselt, 148 Seiten)
- **Struktur:** 1 Markdown-Datei pro Buchkapitel in `docs/aufgaben/`
- **Gremium-Entscheidungen:** 8 Interaktionstypen, flexible Aufgabenanzahl, Fredo-Farbsystem
- **Parallelisierung:** Agents lesen je 1-2 Kapitel aus der PDF und erstellen Aufgaben
- **Philippa-Profil:** visueller Lerntyp, tut sich mit Mathe generell schwer → Tipps müssen besonders gut sein

## Open Questions

- Exakte Aufgabenanzahl pro Thema wird erst beim Lesen der Buchseiten festgelegt
- Ob Teilaufgaben (a, b, c) als einzelne Aufgaben oder als eine Aufgabe mit Teilen zählen

## Scope

**Kapitel in Welle A:**
1. Wiederholung (S. 6-17) — 8 Themen
2. Zahlen bis zur Million (S. 18-33) — 10 Themen
3. Addition & Subtraktion / Rechenregeln (S. 34-45) — 9 Themen
4. Achsensymmetrie / Fläche / Umfang (S. 46-53) — 4 Themen
5. Multiplikation (S. 54-63) — 6 Themen
6. Gewichte / Längen / Skizzen (S. 64-71) — 5 Themen
7. Kombinatorik / Wahrscheinlichkeit (S. 72-77) — 3 Themen

---
*Created: 2026-04-06*
