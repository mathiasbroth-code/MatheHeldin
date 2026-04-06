# PAUL Session Handoff

**Session:** 2026-04-06
**Phase:** Phase 1 complete, Phase 2 ready
**Context:** Projekt-Initialisierung, Architektur, Fredo-Mapping, Design System

---

## Session Accomplishments

- **Vite-Projekt scaffolded:** React 19 + TypeScript (strict), Tailwind v4, Dexie, Zustand, React Router v7, vite-plugin-pwa
- **Kern-Gerüst angelegt:** Stage-Types, Registry, Dexie-Schema, Repository, Stores, Hooks, Dienes-SVG-Komponenten, Router, Pages
- **Feste Ports konfiguriert:** Dev auf `localhost:5175`, Preview auf `localhost:8009` (keine Kollision mit PVS/ImmoVerwaltung/pAIperless)
- **Fredo-4-Curriculum vollständig gemappt:** Alle 81 Einträge → `docs/FREDO_MAPPING.md` (76 umsetzbar, 5 nicht sinnvoll digital)
- **Expertengremium-Konzept erstellt:** `docs/KONZEPT.md` — Pädagogik, UI/UX, Frontend, DB, PWA, Analytics
- **PAUL initialisiert:** PROJECT.md, ROADMAP.md, STATE.md, SPECIAL-FLOWS.md (ui-ux-pro-max required)
- **Roadmap v0.1 definiert:** 7 Phasen + 4 Future-Milestones (v0.2-v0.4 für Wellen 2-4)
- **Phase 1 COMPLETE:** Design System "Clean Minimal" — Tailwind Theme + 7 UI-Komponenten + Layout-Shell + Seiten refactored
- **Build verifiziert:** TypeScript + Vite fehlerfrei, visueller Check approved

---

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| **Zustand + TypeScript** (nicht Context/JSX) | Stage<T>-Interface ist der Architektur-Kern, TS erzwingt Sauberkeit. Zustand hat persist-Middleware. | Alle Stages müssen Stage<T> implementieren |
| **Dexie.js für Persistenz** | Log-Daten (Antworten mit Timestamp, Dauer), nicht Key-Value. Offline, kein Server. | Compound-Index `[profileId+stufeId]` für schnelle Abfragen |
| **Clean Minimal (Richtung 3)** | User wählte aus 3 Moodboard-Optionen. Fokus auf Inhalt, nicht verspielt. | Teal Primary, weiß BG, borderbasiert, KEIN shadow |
| **ui-ux-pro-max Claymorphism ignoriert** | Tool empfahl Claymorphism für Kinder-App, aber User hatte bereits Clean Minimal gewählt | Design System folgt SPECIAL-FLOWS.md, nicht Tool-Empfehlung |
| **Kein Stufen-Lock** | Bewusste didaktische Entscheidung: Kinder lernen nicht linear | Alle Stufen von Anfang an zugänglich |
| **3-stufiges Tipp-System** | Philippa soll die Materie VERSTEHEN — Tips die SIE umsetzen kann | tippStufe wird in AntwortLog gespeichert (Phase 5) |
| **Aufgabenbank als eigene Phase** | 76 Kapitel × 5 Aufgaben = 380+ Aufgaben, braucht eigene Planung | Phase 4 in Roadmap |
| **pnpm als Package Manager** | Konsistenz mit anderen Projekten, musste erst installiert werden | `npm install -g pnpm` war nötig |

---

## Key Files Reference

### Architektur & Planung
```
CLAUDE.md                              — Projekt-Kontext für Claude Code (Stack, Patterns, Regeln)
docs/KONZEPT.md                        — Expertengremium-Konzept (Features, UI/UX, DB, Roadmap)
docs/FREDO_MAPPING.md                  — Vollständiges Mapping aller 81 Fredo-4-Einträge
fredo4_inhaltsverzeichnis.md           — Fredo-4 Schulbuch Inhaltsverzeichnis
_reference/matheheldin_artifact.jsx    — v3-Referenzcode (alle 11 Stufen, Dienes, Skizze)
```

### PAUL
```
.paul/PROJECT.md                       — Projektbeschreibung + Core Value
.paul/ROADMAP.md                       — 7 Phasen v0.1 + Future Milestones
.paul/STATE.md                         — Aktueller Stand
.paul/SPECIAL-FLOWS.md                 — Design System Specs + Skill-Mapping
.paul/phases/01-design-system/01-01-PLAN.md
.paul/phases/01-design-system/01-01-SUMMARY.md
```

### Source Code (Gerüst)
```
src/stages/types.ts                    — Stage<T>, StageProps<T>, Aufgabe Interfaces
src/stages/registry.ts                 — STAGES[] (leer, wird in Phase 2 befüllt)
src/db/schema.ts                       — Dexie MatheDB (profiles, sessions, antworten)
src/db/repository.ts                   — Typisierte Queries
src/stores/profileStore.ts             — Zustand + persist
src/stores/sessionStore.ts             — Zustand Session
src/hooks/useAntwortRecorder.ts        — Zentrales Answer-Logging
src/hooks/useStufenFortschritt.ts      — Reaktive Stats
src/hooks/useAktuelleAufgabe.ts        — Aufgaben-Generator
src/components/dienes/                 — Einer, Zehner, Hunderter, Tausender, BlockDisplay
src/components/ui/                     — Button, Card, Input, ProgressBar, FeedbackBanner, TippButton, StufeKarte
src/components/layout/                 — AppShell, Header
src/lib/helpers.ts                     — randInt, fmt, digits, aufgabeId
```

---

## Prioritized Next Actions

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | `/paul:plan` für Phase 2 — Stufen portieren (Welle 1) | Mittel |
| 2 | `mitte`-Stufe portieren (einfachster Case, testet kompletten Flow) | Niedrig |
| 3 | `zahlLesen`/`zahlLegen` portieren (testet Dienes-System) | Mittel |
| 4 | `buendeln` + `zerlegen` portieren | Mittel |
| 5 | `skizze`-Stufe portieren (komplexester Case: 3 Phasen) | Hoch |
| 6 | Fortschrittsbalken live aus Dexie in Uebersicht.tsx | Niedrig |

---

## Open Questions

- **Stage-Interface erweitern vor Phase 2?** Das KONZEPT.md schlägt `kategorie`, `erklaerung`, `tipps` als neue Felder vor. Könnte in Phase 2 oder Phase 5 passieren. Empfehlung: `kategorie` in Phase 2 mitgeben, `tipps`/`erklaerung` in Phase 5.
- **Git Commit?** Repo ist initialisiert aber es gibt noch keinen Commit. Nächste Session sollte mit einem initialen Commit starten.

---

## State Summary

**Current:** Phase 1 complete, Loop geschlossen, Milestone 14%
**Next:** `/paul:plan` für Phase 2 (Stufen portieren Welle 1)
**Resume:** `/paul:resume` → lies dieses Handoff

---

*Handoff created: 2026-04-06*
