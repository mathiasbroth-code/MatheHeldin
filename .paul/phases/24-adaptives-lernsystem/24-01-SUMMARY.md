---
phase: 24-adaptives-lernsystem
plan: 01
subsystem: learning-engine
tags: [adaptive, kompetenz, rostfaktor, spaced-repetition, eltern]

requires:
  - phase: 06-fortschritt-eltern
    provides: ElternGate, AntwortLog, getStufeRepetitionMap
provides:
  - useAdaptiv Hook (Kompetenz + Rostfaktor + Empfehlungen)
  - lernmodusStore (frei/sanft/gezielt per Profil)
  - "Vorgeschlagen für dich" auf Übersicht
  - Auto-Schwierigkeitsfilter in bankStage
  - Lernmodus-Regler im ElternGate
affects: []

tech-stack:
  added: []
  patterns: [Kompetenz aus AntwortLog on-the-fly berechnet, kein denormalisierter Score]

key-files:
  created:
    - src/hooks/useAdaptiv.ts
    - src/stores/lernmodusStore.ts
  modified:
    - src/pages/Uebersicht.tsx
    - src/aufgaben/bankStage.tsx
    - src/pages/ElternGate.tsx

key-decisions:
  - "Kompetenz on-the-fly aus AntwortLog berechnet — kein neues DB-Schema"
  - "Rostfaktor: 2% pro Tag, gedeckelt bei 30% — sanfter Verfall statt ANKI-Intervalle"
  - "Drei Lernmodi statt An/Aus — Eltern wählen Intensität"

patterns-established:
  - "Adaptive Empfehlungen: nur Stages mit ≥3 Antworten, sortiert nach effektiver Kompetenz"
  - "Auto-Filter: <0.4 → gelb, >0.7 → grün, dazwischen → alle"

duration: 15min
started: 2026-04-07T03:30:00Z
completed: 2026-04-07T03:45:00Z
---

# Phase 24 Plan 01: Adaptives Lernsystem — Summary

**Kompetenz + Rostfaktor + Eltern-Lernmodus: Themenbasiertes adaptives Lernen ohne ANKI-Zwang.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~15 min |
| Tasks | 4 completed (3 auto + 1 checkpoint) |
| Files created | 2 |
| Files modified | 3 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Kompetenzwert pro Stage | Pass | Gewichteter Score aus richtigQuote + tippQuote + Rostfaktor |
| AC-2: Vorgeschlagen-für-dich auf Übersicht | Pass | 2–3 Karten, nur bei sanft/gezielt, nur Stages mit ≥3 Antworten |
| AC-3: Automatischer Schwierigkeitsfilter | Pass | gelb/grün/null basierend auf effektiver Kompetenz |
| AC-4: Eltern-Lernmodus | Pass | 3 Buttons (Frei/Sanft/Gezielt) im ElternGate, persistiert per Profil |
| AC-5: Kein Zwang, kein Lock | Pass | Alle Stages immer zugänglich, Filter manuell änderbar |

## Accomplishments

- **useAdaptiv Hook**: Berechnet Kompetenz (richtigQuote − tippAbzug) und Rostfaktor (0.02/Tag, max 0.3) pro Stage aus bestehenden AntwortLog-Daten. Keine Schema-Änderung.
- **"Vorgeschlagen für dich"**: Übersicht zeigt schwächste Stages als Empfehlung. Dezent bei "sanft", prominent bei "gezielt", unsichtbar bei "frei".
- **Auto-Schwierigkeitsfilter**: bankStage startet mit passendem Default (gelb bei Schwäche, grün bei Stärke). Kind kann jederzeit manuell ändern.
- **Eltern-Lernmodus-Regler**: Drei-Stufen-Wahl im ElternGate Dashboard, gespeichert via Zustand persist.

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/hooks/useAdaptiv.ts` | Created | Kompetenz + Rostfaktor + Empfehlungen + schwierigkeitDefault |
| `src/stores/lernmodusStore.ts` | Created | Lernmodus per Profil (frei/sanft/gezielt), Zustand persist |
| `src/pages/Uebersicht.tsx` | Modified | "Vorgeschlagen für dich" Bereich vor den Gruppen |
| `src/aufgaben/bankStage.tsx` | Modified | Auto-Schwierigkeitsfilter beim Stage-Laden |
| `src/pages/ElternGate.tsx` | Modified | LernmodusRegler-Komponente im Dashboard |

## Deviations from Plan

None — Plan executed as specified.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| `stageId` Namenskonflikt in bankStage.tsx | Inline-Zugriff auf `aufgabe.bankAufgabe.stageId` statt separater Variable |
| StufeKarte-Props inkompatibel | StufeKarteCompact (aus gleichem File) statt StufeKarte verwendet |
| Unused DECAY-Konstante | Entfernt, da richtigQuote/tippQuote aus Repository bereits aggregiert sind |

## Next Phase Readiness

**Ready:**
- Adaptive Engine funktioniert, alle Daten kommen aus bestehendem AntwortLog
- Eltern können Intensität steuern
- System ist erweiterbar (neue Signale, Tagesziel, etc.)

**Concerns:**
- Empfehlungen erscheinen erst nach ≥3 Antworten pro Stage — bei frischem Profil sieht man nichts

**Blockers:**
- None

---
*Phase: 24-adaptives-lernsystem, Plan: 01*
*Completed: 2026-04-07*
