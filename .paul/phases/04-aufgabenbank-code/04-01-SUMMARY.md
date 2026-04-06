---
phase: 04-aufgabenbank-code
plan: 01
subsystem: aufgaben
tags: [parser, typescript, json, build-pipeline, views, tipp-system]

requires:
  - phase: 03a/03b-aufgabenbank-inhalt
    provides: 669 Aufgaben in 16 MD-Dateien
provides:
  - Typed Parser (parserTyped.ts + parserHelpers.ts)
  - 8 View-Komponenten (alle auf parsed-Daten)
  - Build-Pipeline (MD → validiertes JSON)
  - 4-stufiges Tipp-System
  - BaumDiagramm-Komponente für Kombinatorik
affects: [visuelle-komponenten, neue-stages]

tech-stack:
  added: []
  patterns: [typed-parser, pre-built-json, parsed-data-contract]

key-files:
  created:
    - src/aufgaben/parserTyped.ts
    - src/aufgaben/parserHelpers.ts
    - src/aufgaben/data/*.json (16 Dateien)
    - src/components/kombinatorik/BaumDiagramm.tsx
    - scripts/build-aufgaben.cjs
    - scripts/fix-umlaute.cjs
  modified:
    - src/aufgaben/types.ts
    - src/aufgaben/parser.ts
    - src/aufgaben/index.ts
    - src/aufgaben/views/* (alle 8 Views)
    - src/aufgaben/bankStage.tsx
    - src/components/ui/TippSystem.tsx
    - src/aufgaben/views/MarkdownText.tsx
    - docs/aufgaben/*.md (alle 16 Dateien)

key-decisions:
  - "Parser liefert typspezifisches parsed-Feld statt rohe Strings"
  - "Views machen kein eigenes Parsing — lesen nur parsed-Daten"
  - "Build-Pipeline: MD → JSON beim Build, kein Runtime-Parsing"
  - "4-stufiges Tipp-System: Lösungsweg als 4. Stufe"
  - "normalizeZahl strippt Einheiten automatisch"

patterns-established:
  - "Typed Parser Contract: parseDaten(typ, aufgabenstellung, loesung) → ParsedAufgabenDaten"
  - "View Props: aufgabe.parsed as XxxDaten — kein eigenes Parsing"
  - "Build-Validation: scripts/build-aufgaben.cjs prüft alle Aufgaben beim Build"

duration: ~6h
started: 2026-04-06T12:00:00Z
completed: 2026-04-06T21:30:00Z
---

# Phase 4 Plan 01: Aufgabenbank Code-Integration — Summary

**Komplette Aufgaben-Infrastruktur: Typed Parser, 8 Views auf parsed-Daten, Build-Pipeline (MD→JSON), 4-stufiges Tipp-System, 669 Aufgaben mit 0 Fehlern.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~6h |
| Started | 2026-04-06 12:00 |
| Completed | 2026-04-06 21:30 |
| Tasks | Plan 04-01 + 04-02 + 04-03 in einem Durchlauf |
| Files modified | ~50 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Complete type system | Pass | ParsedAufgabenDaten Union mit 8 typspezifischen Interfaces |
| AC-2: Parser converts MD to typed objects | Pass | parserTyped.ts + parserHelpers.ts, 5 Schritt-Varianten |
| AC-3: Pool provides filtered random access | Pass | aufgabenPool.getRandom/getAll/getCount mit stageId/schwierigkeit Filter |
| (Bonus) Views lesen parsed-Daten | Pass | Alle 8 Views umgeschrieben, kein eigenes Parsing |
| (Bonus) Build-Pipeline | Pass | MD→JSON, 669 Aufgaben, 0 Fehler, 4 akzeptable Warnungen |
| (Bonus) Tipp-System 4-stufig | Pass | Denkanstoß→Methode→Schritt-für-Schritt→Lösungsweg |

## Accomplishments

- **Rendering-Architektur komplett neu**: Parser liefert `parsed`-Feld, Views lesen es direkt
- **Build-Pipeline**: `scripts/build-aufgaben.cjs` validiert beim Build, erzeugt JSON
- **669 Aufgaben bereinigt**: Umlaute (3.552), ß (250), Einheiten (486), stage_ids (20), Rechenfehler (7)
- **Sachrechnen von 16→30 Aufgaben** erweitert
- **BaumDiagramm-Komponente** für Kombinatorik (SVG, 2-4 Elemente)

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/aufgaben/parserTyped.ts` | Created | Typspezifischer Parser für alle 8 Typen |
| `src/aufgaben/parserHelpers.ts` | Created | Gemeinsame Hilfsfunktionen |
| `src/aufgaben/data/*.json` | Created | 16 pre-built JSON-Dateien |
| `src/components/kombinatorik/BaumDiagramm.tsx` | Created | SVG-Baumdiagramm |
| `scripts/build-aufgaben.cjs` | Created | MD→JSON Build-Script |
| `scripts/fix-umlaute.cjs` | Created | Umlaut-Fix-Script |
| `docs/AUFGABEN-RENDERING-ARCHITEKTUR.md` | Created | Gremiums-Design |
| `docs/AUDIT-VISUELL.md` | Created | Visuelles Audit aller 645 Aufgaben |
| `docs/SKIZZE-TEMPLATE-ANALYSE.md` | Created | Skizze-Flow Übertragbarkeit |
| `docs/PRIORITAETSLISTE-VISUELL.md` | Created | Priorisierte Baureihenfolge |
| `docs/QUALITAETSPRUEFUNG.md` | Created | Vollständige Qualitätsprüfung |
| `src/aufgaben/types.ts` | Modified | ParsedAufgabenDaten, 4-Tipp-Tuple |
| `src/aufgaben/parser.ts` | Modified | parseDaten()-Aufruf, Lösungsweg als 4. Tipp |
| `src/aufgaben/index.ts` | Modified | JSON-Loader (Priorität) + MD-Fallback |
| `src/aufgaben/views/*.tsx` | Modified | Alle 8 Views auf parsed-Daten |
| `src/aufgaben/bankStage.tsx` | Modified | Layout bereinigt |
| `src/components/ui/TippSystem.tsx` | Modified | 4 Stufen, MarkdownText |
| `src/aufgaben/views/MarkdownText.tsx` | Modified | Code-Blöcke, Tabellen-Grid |
| `docs/aufgaben/*.md` | Modified | Umlaute, ß, Einheiten, stage_ids, Fehler |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Scope additions | 5 | Positiv — Phase 4 komplett statt nur Plan 01 |
| Auto-fixed | 7 | Rechenfehler in Aufgaben korrigiert |

Plans 04-02 (Views) und 04-03 (Stage-Integration) wurden nie formal erstellt — die Arbeit wurde direkt in dieser Session erledigt, zusammen mit Plan 04-01. Die gesamte Phase 4 ist damit abgeschlossen.

## Next Phase Readiness

**Ready:**
- 669 Aufgaben als validiertes JSON
- Alle 8 Views funktionsfähig
- Build-Pipeline mit Validierung
- Visuelle Audit-Dokumente für nächste Phase (Visuelle Komponenten)

**Nächste Prioritäten (aus PRIORITAETSLISTE-VISUELL.md):**
1. Halbschriftliches Dividieren (BlockDisplay wiederverwendbar)
2. Einheiten-Leiter (km/m, kg/g, l/ml)
3. Hunderterfeld (einfaches Grid)
4. Kombinatorik-Baumdiagramm (interaktiv machen)
5. Schriftliches Dividieren

**Blockers:** None

---
*Phase: 04-aufgabenbank-code, Plan: 01*
*Completed: 2026-04-06*
