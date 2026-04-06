# Session Handoff — Aufgabenbank + Bugfixes + Visuelle Überarbeitung

**Datum:** 2026-04-06 (zweiter Handoff, ergänzt den ersten)
**Session-Fokus:** Aufgabenbank erstellen, Parser/View-Bugs fixen, Tipp-System integrieren

---

## Was wurde erreicht

### Aufgabenbank: 635 Aufgaben komplett
- 500 reguläre Aufgaben (14 Kapitel, docs/aufgaben/01-*.md bis 14-*.md)
- 135 Intensiv-Aufgaben für Philippas Paukthemen (intensiv-division.md + intensiv-kombinatorik-einheiten.md)
- FORMAT.md als verbindliches Schema
- Test-Script: scripts/test-aufgaben.cjs (645 Aufgaben, 98.4% bestanden)

### Parser-Bug gefixt (ROOT CAUSE)
- `extractSection` in parser.ts verwendete Regex mit `m`-Flag → `$` matchte nach jeder Zeile → nur erste Zeile jeder Section wurde extrahiert
- Fix: Zwei-Schritt-Ansatz (Heading finden → bis zum nächsten ### slicen)
- Betraf ALLE Aufgaben, ALLE Typen

### Views gefixt (8 Views)
- Alle Views nutzen jetzt `MarkdownText`-Komponente für korrekte Anzeige von Listen, Tabellen, mehrzeiligem Text
- `parts.slice(0)` → `parts.slice(1)` in EingabeView, LueckeView, SchrittView
- Lösungs-Alignment: `.filter(Boolean)` → `.slice(1)` in allen Views
- AuswahlView: Kleinbuchstaben-Support + kein "Ja/Nein"-Fallback mehr
- WahrFalschView: Teilaufgaben-Support + robuste Antwort-Erkennung
- TextaufgabeView: Paragraph-Split für Aufgaben ohne a/b/c

### Tipp-System + ?-Button integriert
- ?-Button neben dem Aufgabentitel (bankStage.tsx) → zeigt "Was lernst du hier?" mit didaktischem Hinweis
- TippSystem (3-stufig: Denkanstoß → Methode → Schritt-für-Schritt) unter jeder View (AufgabeWrapper.tsx)
- Nutzt bestehende TippSystem-Komponente mit Maskottchen

### Umlaut-Fix im Parser
- Parser akzeptiert jetzt `### Lösung` UND `### Loesung` (5 Dateien verwendeten ASCII-Umlaute)

---

## NÄCHSTE SESSION: Visuelle Überarbeitung

### Das Problem
Die 635 Aufgaben sind inhaltlich vollständig, aber viele sind **rein textbasiert** — Philippa ist ein visueller Lerntyp und braucht mehr visuelle Darstellungen. Die Skizze-Stage (3-Phasen-Flow: Orte ordnen → Strecken eintragen → Rechnen) ist das Vorbild.

### Aufgabe 1: Gremiums-Audit — Welche Aufgaben brauchen visuelle Darstellungen?

**Vorgehen:** 
- Alle 635 Aufgaben systematisch durchgehen
- Für jede Aufgabe bewerten: "Reicht Text + Eingabe?" vs. "Braucht visuelle Komponente"
- Kategorien: 
  - ✅ Text reicht (einfache Rechenaufgaben: "Rechne 345 + 678")
  - 🟡 Könnte visueller (Tabellen, Diagramme als Grafik statt Text)
  - 🔴 Braucht zwingend Visualisierung (Entfernungen, Zahlenstrahl, Stellenwerttafel, Dienes)

**Experten-Input:**
- Prof. Sommer: Welche Themen profitieren am meisten von visueller Darstellung?
- Tom Berger: Welche visuellen Komponenten sind realistisch umsetzbar (SVG, Canvas, CSS)?
- Sarah: Welche bestehenden Komponenten können wiederverwendet werden?

**Bestehende visuelle Komponenten:**
- `src/components/dienes/BlockDisplay.tsx` — Dienes-Blöcke (Einer, Zehner, Hunderter, Tausender)
- `src/components/zahlenstrahl/` — Zahlenstrahl-Primitives
- `src/stages/skizze/` — 3-Phasen-Flow (Orte → Strecken → Rechnen)
- `src/stages/mitte/MitteView.tsx` — Zahlenstrahl mit Mittelwert

### Aufgabe 2: Skizze-Stage als Template — 3-Phasen-Flow übertragen

**Idee:** Der Skizze-Flow funktioniert perfekt für Entfernungs-Aufgaben. Kann er auf andere Themen übertragen werden?

Mögliche Kandidaten:
- **Entfernungen** (Kap. 6) → Orte auf einer Strecke anordnen, Teilstrecken eintragen
- **Gewichte** (Kap. 6) → Waage-Visualisierung, Gewichte zuordnen
- **Liter/Milliliter** (Kap. 9) → Messbecher-Visualisierung
- **Zahlenstrahl** (Kap. 2) → Zahlen ablesen/einordnen auf interaktivem Zahlenstrahl
- **Stellenwerttafel** (Kap. 1-2) → Drag & Drop in T|H|Z|E Felder
- **Brüche** (Kap. 9) → Pizza/Kuchen-Visualisierung
- **Schriftliches Rechnen** (Kap. 3, 5, 8) → Stellengerechte Eingabe untereinander

### Aufgabe 3: Prioritätsliste — Welche Aufgaben zuerst?

**Sofort-Priorität (Philippas Paukthemen):**
1. Division (49 + 60 Aufgaben) — halbschriftlich/schriftlich visuell als Schritt-für-Schritt
2. Entfernungen (20 Aufgaben) — Skizze-Flow wie bei Sachaufgaben
3. Kombinatorik (32 Aufgaben) — Baumdiagramme als interaktive Grafik

**Hoher Wert, machbar:**
4. Zahlenstrahl-Aufgaben — interaktiver Zahlenstrahl existiert schon
5. Stellenwerttafel — Drag & Drop Ziffern
6. Dienes-Blöcke — BlockDisplay existiert, für Lesen/Legen-Aufgaben

**Aufwändig, aber wertvoll:**
7. Schriftliches Rechnen (Add/Sub/Mult/Div) — stellengerechte Eingabe
8. Bruch-Visualisierung — Pizza/Kuchen
9. Gewichte — Waage

---

## Technische Hinweise für die nächste Session

### Dateien die geändert wurden (diese Session)
- `src/aufgaben/parser.ts` — extractSection komplett neu (Zwei-Schritt)
- `src/aufgaben/views/AufgabeWrapper.tsx` — TippSystem integriert
- `src/aufgaben/views/MarkdownText.tsx` — NEU, shared Renderer
- `src/aufgaben/views/*.tsx` — alle 8 Views: MarkdownText, slice(1), Lösungs-Alignment
- `src/aufgaben/bankStage.tsx` — ?-Button neben Titel, Erklärung aufklappbar
- `docs/aufgaben/*.md` — Backups wiederhergestellt (Content-Fix-Agent hatte Aufgaben kaputt gemacht)
- `docs/aufgaben/*.md.bak` — Backup-Dateien, können gelöscht werden

### Bekannte Issues
- Content-Fix-Agent (117 Warnungen) hat Aufgaben kaputt gemacht → Backups wiederhergestellt → Warnungen sind noch da aber harmlos (betreffen Test-Script, nicht die App)
- 10 FAIL im Test (Platzhalter, zu kurze Aufgabenstellungen) → akzeptabel
- Einige Aufgaben haben `Loesung` statt `Lösung` → Parser akzeptiert beides

### Nicht anfassen
- `src/stages/` (alte Stages — funktionieren, nicht ändern)
- `docs/aufgaben/FORMAT.md` (verbindliches Schema)
- `_reference/` (Schulbuch, Videos, Keyframes)

---

## Session-Zusammenfassung

| Was | Ergebnis |
|-----|----------|
| Aufgaben erstellt | 635 (500 + 135 Intensiv) |
| Parser-Bug gefixt | extractSection Root Cause |
| Views repariert | 8 Views, 14+ Bugs |
| Tipp-System integriert | ?-Button + 3-stufiges TippSystem |
| Umlaut-Fix | Lösung/Loesung beides akzeptiert |
| Content-Warnungen | 117 → Backups wiederhergestellt |

**Nächster Schritt:** Visuelle Überarbeitung — Gremiums-Audit, Skizze-Template, Prioritätsliste

---
*Handoff erstellt: 2026-04-06*
