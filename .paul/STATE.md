# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-04-06)

**Core value:** Philippa kann selbstständig Mathe üben und ihre Eltern sehen den Lernfortschritt. Pädagogisch sinnvolle Lerntipps, die sie verstehen und umsetzen kann.
**Current focus:** Milestone v0.4 COMPLETE — Alle Fredo-4-Inhalte umgesetzt

## Current Position

Milestone: v0.3 Vertiefung & Interaktivität
Milestone: v0.4 Spezial & Forscherkiste
Milestone: v0.4 Spezial & Forscherkiste — COMPLETE
Phase: 23 (Mathe-Lexikon) — Complete
Plan: All plans complete
Status: Milestone v0.4 complete — all 4 milestones done
Last activity: 2026-04-06 — Milestone v0.4 transition

Progress:
- Milestone v0.1: [██████████] 100% ✓
- Milestone v0.2: [██████████] 100% ✓
- Milestone v0.3: [██████████] 100% ✓
- Milestone v0.4: [██████████] 100% ✓

## Loop Position

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Milestone v0.4 complete]
```

## Accumulated Context

### Decisions
- Tech Stack: Vite + React 18 + TypeScript, Tailwind v4, Zustand, Dexie.js, React Router v6, vite-plugin-pwa
- Architecture: Stage-based module system (src/stages/<id>/)
- Design System: Clean Minimal (Richtung 3) — implementiert in globals.css + 7 UI-Komponenten
- Fredo-4-Curriculum vollständig gemappt: docs/FREDO_MAPPING.md (76 umsetzbare Stages)
- Aufgabenbank: 717 Aufgaben in 16 Dateien, pre-built JSON, 0 Build-Fehler
- Rendering: Views lesen parsed-Daten, kein eigenes Parsing
- Visualisierungen: Kaskadiert in AufgabeWrapper — max. 1 pro Aufgabe, auto-detect via Text/StageId

### Completed Phases
| Phase | Name | Status |
|-------|------|--------|
| 1 | Design System | ✓ |
| 2 | Stufen portieren | ✓ |
| 3a | Aufgabenbank Inhalt Welle A | ✓ |
| 3b | Aufgabenbank Inhalt Welle B | ✓ |
| 3 | Profil-System + Navigation | ✓ |
| 4 | Aufgabenbank Code-Integration | ✓ |
| 5 | Tipp-System + Feedback | ✓ |
| 6 | Fortschritt + Eltern-Dashboard | ✓ |
| 7 | PWA + Mobile | ✓ |
| 8 | Division visuell | ✓ |
| 9 | Einheiten-Leiter | ✓ |
| 9+ | Aufgaben-Visualisierungen | ✓ |
| 10 | Baumdiagramm interaktiv | ✓ |
| 11 | Stellenwerttafel | ✓ |
| 12 | Zahlenstrahl | ✓ |
| 13 | Schriftliches Rechnen | ✓ |
| 14 | Fixes & Polish | ✓ |
| 15 | Aufgaben-Inhalte Rechnen | ✓ |
| 16 | Aufgaben-Inhalte Geo/Sach/Daten | ✓ |
| 17 | Geometrie-Visualisierungen | ✓ |
| 18 | Daten-Visualisierungen | ✓ |
| 19 | Schriftliches Rechnen interaktiv | ✓ |

### v0.2 Features — Alle komplett

| Feature | Datei | Status |
|---------|-------|--------|
| RoutenDiagramm | views/RoutenDiagramm.tsx | ✓ |
| EinheitenLeiter | views/EinheitenLeiter.tsx | ✓ |
| DivisionsZerlegung | views/DivisionsZerlegung.tsx | ✓ |
| WerteBalken | views/WerteBalken.tsx | ✓ |
| KreiseDiagramm | views/KreiseDiagramm.tsx | ✓ |
| Zeichenfeld | components/ui/Zeichenfeld.tsx | ✓ |
| BaumDiagramm | components/kombinatorik/BaumDiagramm.tsx | ✓ |
| StellenwertTafel | views/StellenwertTafel.tsx | ✓ |
| ZahlenstrahlDiagramm | views/ZahlenstrahlDiagramm.tsx | ✓ |
| SchriftlicheRechnung | views/SchriftlicheRechnung.tsx | ✓ |

### Aufgaben-Fixes (2026-04-06)
- 3× typ auswahl→zuordnung: "sicher/möglich/unmöglich"-Aufgaben (Kap. 7 + Intensiv)
- 1× digital voll→platzhalter→voll: Kreise-Aufgabe (SVG generiert statt Buch-Bild)

### Deferred Issues
- ~~Rechenketten "Schritt 1 von 1"~~ → Fixed (Phase 14, Unicode-Minus)
- ~~Teilaufgaben-Sync~~ → Fixed (Phase 14, activeLabel)
- Tipps-Verbesserungen: 46 Vorschläge in docs/TIPPS-REVIEW.md (niedrige Prio)
- SchriftlicheRechnung: Interaktive Ziffern-Eingabe (Phase 19)

### Blockers/Concerns
None.

## Session Continuity

Last session: 2026-04-06
Stopped at: Phase 16 complete (18 neue Aufgaben in 3 Stages)
Next action: /paul:plan for Phase 17 (Geometrie-Visualisierungen)
Resume file: .paul/phases/16-aufgaben-geo-sach-daten/16-01-SUMMARY.md
Resume context:
- 3 Deferred Issues gelöst (Unicode-Minus, Teilaufgaben-Sync, Tipps-Review)
- Phase 15: 5 fehlende Stages brauchen neue Aufgaben-JSON
- AufgabeWrapper hat jetzt activeLabel-State für Viz-Sync

---
*STATE.md — Updated 2026-04-06 after Phase 14 transition*
