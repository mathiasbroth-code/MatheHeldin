# Roadmap: MatheHeldin

## Overview
Eine App (Handy, Tablet, PC) in der Kinder Mathematik parallel zum Schulunterricht lernen, üben und die Materie verstehen sollen. Es soll ihnen Spaß machen, weil sie auch sehen, wie sie besser werden.

## Current Milestone
**v0.1 Funktionsfähige Lern-App** (v0.1.0)
Status: In progress
Phases: 1 of 7 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Design System + UI-Primitives | 01-01 | Complete | 2026-04-06 |
| 2 | Stufen portieren (Welle 1) | TBD | Not started | - |
| 3 | Profil-System + Navigation | TBD | Not started | - |
| 4 | Aufgabenbank Welle 1 | TBD | Not started | - |
| 5 | Tipp-System + Feedback | TBD | Not started | - |
| 6 | Fortschritt + Eltern-Dashboard | TBD | Not started | - |
| 7 | PWA + Mobile-Optimierung | TBD | Not started | - |

## Phase Details

### Phase 1: Design System + UI-Primitives
Tailwind-Theme nach Clean Minimal (Richtung 3), Shared Components (Button, Card, Input, ProgressBar, Layout, StufeKarte). Grundlage für alle weitere UI-Arbeit.

### Phase 2: Stufen portieren (Welle 1)
11 Stufen aus dem Referenzcode portieren: mengen20, buendeln, bis100lesen, bis100legen, bis1000lesen, bis1000legen, bis10000lesen, bis10000legen, zerlegen, mitte, skizze. Jede Stufe als eigenes Modul in src/stages/<id>/ nach Stage<T>-Pattern.

### Phase 3: Profil-System + Navigation
Startscreen mit Profil-Auswahl (Avatar + Name), Profil-CRUD, Session-Management, erweiterte Navigation (Tabs: Üben | Fortschritt), Eltern-PIN-Zugang.

### Phase 4: Aufgabenbank Welle 1
5 Aufgaben + 3-stufige Lerntipps + Lösung + Hinführung für JEDES der 11 Welle-1-Kapitel (55 Aufgaben gesamt). Aufgaben als JSON/TS-Daten in den Stage-Modulen. Grundlage: docs/FREDO_MAPPING.md.

### Phase 5: Tipp-System + Feedback
3-stufiges Tipp-System (Denkanstoß → Methode → Schritt-für-Schritt) in allen Stufen. "Was lernst du hier?" Tooltips. tippStufe im AntwortLog. Session-Zusammenfassung nach Übungsrunde.

### Phase 6: Fortschritt + Eltern-Dashboard
Kind-Ansicht: Fortschrittsbalken, Heatmap (Übungstage), "X Stufen geschafft". Eltern-Ansicht: PIN-geschützt, Drill-Down pro Kind, Fehlerquote, Tipp-Nutzung, Empfehlungen.

### Phase 7: PWA + Mobile-Optimierung
Service Worker testen, Offline-Verhalten, apple-touch-icon, iPad-Fullscreen, Touch-Tap-Optimierung (44px Minimum), Viewport-Fit, Install-Prompt.

## Future Milestones

### v0.2 Welle 2 — Kernausbau (25 Stufen)
Zahlenraum bis Million, Stellenwerttafel, Nachbarzahlen, Runden, Kopfrechnen, Schriftl. Add/Sub/Mult/Div Grundlagen, Brüche, Einheiten, Symmetrie.

### v0.3 Welle 3 — Vertiefung (27 Stufen)
Erweiterte schriftliche Verfahren, Überschlag, Rechenketten, Geometrie, Daten, Sachrechnen.

### v0.4 Welle 4 — Spezial (13 Stufen)
Binärsystem, Pascal, Fibonacci, komplexe Geometrie, Sachaufgaben, Lexikon.

---
*Roadmap updated: 2026-04-06*
