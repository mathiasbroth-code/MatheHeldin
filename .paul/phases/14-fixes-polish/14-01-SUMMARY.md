---
phase: 14-fixes-polish
plan: 01
subsystem: ui, parser
tags: [bugfix, unicode, rechenketten, teilaufgaben-sync, tipps-review]

requires:
  - phase: 13-schriftliches-rechnen
    provides: SchriftlicheRechnung-Komponente mit parseSchriftlicheRechnung(teilFrage?)
provides:
  - Rechenketten-Parser erkennt Unicode-Minus (U+2212)
  - SchriftlicheRechnung synchronisiert mit aktiver Teilaufgabe
  - Tipps-Review-Dokument mit 46 Verbesserungsvorschlägen
affects: []

tech-stack:
  added: []
  patterns: [activeLabel-State in AufgabeWrapper für Visualisierungs-Sync]

key-files:
  created:
    - docs/TIPPS-REVIEW.md
  modified:
    - src/aufgaben/parserTyped.ts
    - scripts/build-aufgaben.cjs
    - src/aufgaben/views/AufgabeWrapper.tsx
    - src/aufgaben/data/03-addition-subtraktion-rechenregeln.json

key-decisions:
  - "activeLabel-State in AufgabeWrapper statt in bankStage — hält Viz-Sync lokal"
  - "Tipps nur reviewen, nicht ändern — Änderungen in separatem Plan"

patterns-established:
  - "findAktiveTeilFrage() extrahiert frage-Text aus parsed-Daten anhand Label"

duration: 12min
completed: 2026-04-06T23:55:00Z
---

# Phase 14 Plan 01: Fixes & Polish — Summary

**3 Deferred Issues behoben: Rechenketten-Unicode-Bug, SchriftlicheRechnung-Teilaufgaben-Sync, Tipps-Review erstellt**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~12 min |
| Tasks | 4 completed (3 auto + 1 checkpoint) |
| Files modified | 4 |
| Files created | 1 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Rechenketten korrekte Schrittzahl | Pass | 2 Ketten jetzt 2 Schritte, 1 Kette 3 Schritte |
| AC-2: SchriftlicheRechnung zeigt aktive Teilaufgabe | Pass | activeLabel-State + findAktiveTeilFrage() |
| AC-3: Tipps-Review dokumentiert | Pass | 46 Vorschläge in docs/TIPPS-REVIEW.md |

## Accomplishments

- Rechenketten-Bug: `−` (U+2212) in 4 Regex-Stellen ergänzt (parserTyped.ts + build-aufgaben.cjs), JSON rebuilt
- AufgabeWrapper: activeLabel-State, handleTeilaufgabeChange-Wrapper, findAktiveTeilFrage-Hilfsfunktion
- Tipps-Review: 46 konkrete Verbesserungsvorschläge aus Video-Analyse über 6 Kapitel

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/aufgaben/parserTyped.ts` | Modified | Unicode-Minus in 2 Regex-Patterns |
| `scripts/build-aufgaben.cjs` | Modified | Unicode-Minus in 2 Regex-Patterns (Build-Script-Kopie) |
| `src/aufgaben/views/AufgabeWrapper.tsx` | Modified | activeLabel State + findAktiveTeilFrage + handleTeilaufgabeChange |
| `src/aufgaben/data/03-*.json` | Rebuilt | Rechenketten-parsed-Daten aktualisiert |
| `docs/TIPPS-REVIEW.md` | Created | 46 Verbesserungsvorschläge aus Video-Vergleich |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Auto-fixed | 1 | Build-Script hatte eigene Parser-Kopie — dort auch gefixt |

**Build-Script:** Plan erwähnte nur parserTyped.ts, aber build-aufgaben.cjs hat eigene Kopie der parseRechenkette-Funktion. Dort ebenfalls Unicode-Minus ergänzt und JSON rebuilt.

## Next Phase Readiness

**Ready:**
- Alle 3 Deferred Issues aus v0.2 adressiert
- Phase 14 komplett — bereit für Phase 15 (Aufgaben-Inhalte Rechnen)

**Deferred (aus Tipps-Review, nicht blockierend):**
- 46 Tipp-Verbesserungen in docs/TIPPS-REVIEW.md — können schrittweise umgesetzt werden

**Blockers:** None

---
*Phase: 14-fixes-polish, Plan: 01*
*Completed: 2026-04-06*
