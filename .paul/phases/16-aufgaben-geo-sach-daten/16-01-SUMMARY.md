---
phase: 16-aufgaben-geo-sach-daten
plan: 01
subsystem: content
tags: [aufgaben, millionen-wuerfel, haeufigkeitsanalyse, massstab]

requires:
  - phase: 04-aufgabenbank-code
    provides: Build-Pipeline, stageMapping, View-System
provides:
  - 18 neue Aufgaben in 3 Stages (millionen-wuerfel, haeufigkeitsanalyse, massstab)
affects: []

tech-stack:
  added: []
  patterns: []

key-files:
  modified:
    - docs/aufgaben/02-zahlen-bis-million.md
    - docs/aufgaben/07-kombinatorik-wahrscheinlichkeit.md
    - docs/aufgaben/12-massstab-orientierung.md
    - vite.config.ts

key-decisions:
  - "sachaufgaben-schwimmbad + loesungshilfen existieren bereits unter stageId 'sachaufgaben' — nicht doppelt erstellt"
  - "PWA workbox maximumFileSizeToCacheInBytes auf 3MB erhöht (Aufgabenbank wächst)"

duration: 8min
completed: 2026-04-07T00:25:00Z
---

# Phase 16 Plan 01: Aufgaben Geo/Sach/Daten — Summary

**18 neue Aufgaben für 3 fehlende Stages, Aufgabenbank von 699 auf 717, PWA-Limit angepasst**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~8 min |
| Tasks | 2 completed |
| Aufgaben created | 18 |
| Files modified | 4 (3 MD + vite.config.ts) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Alle 3 Stages haben Aufgaben | Pass | Je 6 Aufgaben |
| AC-2: Build pipeline grün | Pass | 0 Fehler, PWA-Limit auf 3MB erhöht |

## Accomplishments

- millionen-wuerfel: 6 Aufgaben — Stellenwerte im Millionenbereich, Dienes-Konzept
- haeufigkeitsanalyse: 6 Aufgaben — Buchstaben zählen, Strichlisten, Vokale
- massstab: 6 Aufgaben — Vergrößern/Verkleinern mit verschiedenen Maßstäben
- Umlaut-stageId-Bereinigung: 169 Ersetzungen in 10 MD-Dateien (ä→ae, ü→ue, ö→oe, ß→ss) — alle stageIds matchen jetzt stageMapping
- PWA workbox Limit: 2MB → 3MB (Bundle wuchs auf 2.1MB durch mehr Aufgaben-Daten)

## Deviations from Plan

| Type | Count | Impact |
|------|-------|--------|
| Scope-Reduktion | 1 | sachaufgaben-schwimmbad + loesungshilfen entfallen (existieren unter "sachaufgaben") |
| Auto-fixed | 1 | PWA maximumFileSizeToCacheInBytes auf 3MB erhöht |

## Next Phase Readiness

**Ready:**
- Phase 16 komplett — alle fehlenden Aufgaben-Inhalte erstellt
- Phase 17 (Geometrie-Visualisierungen) als nächstes

**Blockers:** None

---
*Phase: 16-aufgaben-geo-sach-daten, Plan: 01*
*Completed: 2026-04-06*
