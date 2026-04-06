# Session Handoff — Rendering-Architektur + Qualitätsbereinigung

**Datum:** 2026-04-06 (dritter Handoff)
**Session-Fokus:** Aufgaben-Rendering komplett neu architektiert, Qualitätsprüfung, Build-Pipeline

---

## Was wurde erreicht

### 1. Gremiums-Audit: 3 Strategie-Dokumente erstellt
- `docs/AUDIT-VISUELL.md` — 645 Aufgaben kategorisiert (51% Text reicht, 26% könnte visueller, 23% braucht Visualisierung)
- `docs/SKIZZE-TEMPLATE-ANALYSE.md` — 8 Kandidaten für 3-Phasen-Flow bewertet
- `docs/PRIORITAETSLISTE-VISUELL.md` — Baureihenfolge für visuelle Komponenten

### 2. Umlaute + ß komplett gefixt
- 3.552 ae/oe/ue→ä/ö/ü Ersetzungen in 15 Dateien
- ~250 ss→ß Ersetzungen (groß, größer, Maßstab, etc.)
- Script: `scripts/fix-umlaute.cjs`

### 3. Aufgaben-Rendering komplett neu architektiert
**Kernproblem gelöst:** Parser liefert jetzt typspezifisch strukturierte Daten (`parsed`-Feld), Views machen kein eigenes Parsing mehr.

**Neue Dateien:**
- `src/aufgaben/parserHelpers.ts` — gemeinsame Hilfsfunktionen
- `src/aufgaben/parserTyped.ts` — typspezifischer Parser für alle 8 Typen
- `src/components/kombinatorik/BaumDiagramm.tsx` — SVG-Baumdiagramm für Kombinatorik
- `docs/AUFGABEN-RENDERING-ARCHITEKTUR.md` — Gremiums-Design-Dokument

**Geänderte Dateien:**
- `src/aufgaben/types.ts` — neue Interfaces (ParsedAufgabenDaten, SchrittDaten, etc.)
- `src/aufgaben/parser.ts` — ruft parseDaten() auf, Lösungsweg als 4. Tipp
- `src/aufgaben/views/MarkdownText.tsx` — Code-Blöcke, Tabellen als Grid, Inline-Bold/Code
- `src/aufgaben/views/SchrittView.tsx` — komplett neu (Teilaufgaben + Schritte)
- `src/aufgaben/views/EingabeView.tsx` — liest parsed, BaumDiagramm bei Kombinatorik
- `src/aufgaben/views/LueckeView.tsx` — liest parsed
- `src/aufgaben/views/WahrFalschView.tsx` — liest parsed
- `src/aufgaben/views/AuswahlView.tsx` — liest parsed
- `src/aufgaben/views/TextaufgabeView.tsx` — liest parsed
- `src/aufgaben/views/ReihenfolgeView.tsx` — liest parsed
- `src/aufgaben/views/ZuordnungView.tsx` — interaktive Button-UI, liest parsed
- `src/aufgaben/views/AufgabeWrapper.tsx` — reiner Dispatcher, kein TippSystem
- `src/aufgaben/bankStage.tsx` — Layout bereinigt (Tipps nur 1x, Aufgabenstellung nur 1x)
- `src/components/ui/TippSystem.tsx` — 4 Stufen, MarkdownText für Tipp-Inhalte

### 4. Build-Pipeline: MD → JSON
- `scripts/build-aufgaben.cjs` — konvertiert MD → validiertes JSON
- `src/aufgaben/data/*.json` — 16 pre-built JSON-Dateien
- `src/aufgaben/index.ts` — lädt JSON (Priorität) oder parsed MD (Fallback)
- `package.json` — `build:aufgaben` + `prebuild` Scripts

### 5. 4-stufiges Tipp-System
- Stufe 1: 💡 Denkanstoß
- Stufe 2: 🔍 Methode
- Stufe 3: 📝 Schritt für Schritt
- Stufe 4: ✅ Lösungsweg (aus bestehender ### Lösungsweg Section)

### 6. Qualitätsprüfung + Bereinigung
- `docs/QUALITAETSPRUEFUNG.md` — 645 Aufgaben vollständig geprüft
- 7 kritische Rechenfehler korrigiert (Kap. 1 + 2)
- 20 leere stage_ids zugeordnet (Kap. 9, 10, 14)
- 486 Einheiten aus Lösungen entfernt / 154 Aufgaben als textaufgabe umtypisiert
- 72 Fallback-Parsing-Probleme auf 2 reduziert (beides Platzhalter)
- 4 fehlende Tipps geschrieben
- 1 leere Lösung ergänzt (Parkettierung)

### 7. Sachrechnen (Kap. 11) erweitert
- Von 16 → 30 Aufgaben (6 neue Schwimmbad + 8 neue Sachaufgaben-Strategien)
- Zwei Stages zusammengelegt zu einem: `sachaufgaben` (🧩)

### 8. normalizeZahl verbessert
- Strippt Einheiten automatisch (km, kg, €, etc.)
- Unterstützt Textantworten case-insensitive
- Extrahiert Werte nach "=" (z.B. "N = Norden" → "norden")

---

## Build-Status

```
Dateien:    16
Aufgaben:   669
JSON-Files: 16
Fehler:     0
Warnungen:  4 (akzeptabel: 2x Rechenkette mit 1 Schritt, 2x Platzhalter)
TypeScript: ✅ keine Fehler
```

---

## NÄCHSTE SESSION: Visuelle Komponenten bauen

### Sofort-Priorität (aus PRIORITAETSLISTE-VISUELL.md)
1. **Halbschriftliches Dividieren** — BlockDisplay wiederverwendbar, 24 Aufgaben
2. **Einheiten-Leiter** — eine Komponente für km/m, kg/g, l/ml, 55 Aufgaben
3. **Hunderterfeld** — einfaches Grid, 35 Aufgaben
4. **Kombinatorik-Baumdiagramm** — BaumDiagramm.tsx existiert, interaktiv machen
5. **Schriftliches Dividieren** — größter Einzelaufwand

### Skizze-Flow übertragbar auf (aus SKIZZE-TEMPLATE-ANALYSE.md)
- Entfernungen (90% Reuse, sofort machbar)
- Stellenwerttafel (bester neuer 3-Phasen-Kandidat)

### Technische Verbesserungen
- Baumdiagramm interaktiv machen (schrittweises Aufdecken durch Kind)
- Stellenwerttafel als eigene Komponente
- Zahlenstrahl aus MitteView extrahieren (wiederverwendbar)

---

## Nicht anfassen
- `src/stages/` (alte Grundübungen — funktionieren)
- `docs/aufgaben/FORMAT.md` (verbindliches Schema)
- `_reference/` (Schulbuch, Videos, Keyframes)

---

## Bekannte offene Punkte
- 2 Rechenketten zeigen "Schritt 1 von 1" (Parser-Eigenheit, niedrige Prio)
- 2 Platzhalter-Aufgaben haben kein parsed (erwartetes Verhalten)
- ~435 Warnungen bereinigt, Build ist grün

---

*Handoff erstellt: 2026-04-06*
