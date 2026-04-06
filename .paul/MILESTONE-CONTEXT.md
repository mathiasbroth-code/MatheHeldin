# Milestone Context

**Generated:** 2026-04-06
**Status:** Ready for /paul:milestone

## Features to Build

1. **Division visuell** — Halbschriftliches + schriftliches Dividieren als Schritt-für-Schritt-Visualisierung. BlockDisplay (Dienes) wiederverwendbar. Philippas Paukthema #1, 52 Aufgaben betroffen.

2. **Einheiten-Leiter** — Eine interaktive Stufenleiter-Komponente für Einheiten-Umrechnungen (km↔m, kg↔g, l↔ml, €↔ct). Philippas Paukthema #2, 55 Aufgaben betroffen.

3. **Interaktives Baumdiagramm** — Die bestehende BaumDiagramm-Komponente interaktiv machen: Kind deckt Äste schrittweise auf statt alles auf einmal zu sehen. Für Kombinatorik-Aufgaben (23 Aufgaben).

4. **Stellenwerttafel** — Drag & Drop Ziffern in T|H|Z|E Felder. Starker didaktischer Wert für visuellen Lerntyp. ~12 Aufgaben.

5. **Zahlenstrahl** — Wiederverwendbare Komponente aus MitteView extrahieren. Interaktiv: Zahlen ablesen, einordnen, Nachbarn finden. ~30 Aufgaben über 4+ Kapitel.

6. **Schriftliches Rechnen** — Stellengerechte Eingabe untereinander (Addition, Subtraktion, Multiplikation, Division). Übertrag-Visualisierung. Größtes Einzelprojekt.

## Scope

**Suggested name:** v0.2 Visuelle Mathe-Komponenten
**Estimated phases:** 6
**Focus:** Die 669 Aufgaben mit interaktiven visuellen Komponenten zum Leben erwecken — statt reiner Texteingabe sieht Philippa Bilder, Diagramme und interaktive Elemente.

## Phase Mapping

| Phase | Focus | Features | Aufwand |
|-------|-------|----------|---------|
| 8 | Division visuell | Halbschriftlich + schriftlich als Schritt-Visualisierung | M |
| 9 | Einheiten-Leiter | Stufenleiter für km/m, kg/g, l/ml | M |
| 10 | Baumdiagramm interaktiv | Bestehende Komponente erweitern | S |
| 11 | Stellenwerttafel | Drag & Drop T/H/Z/E | M |
| 12 | Zahlenstrahl | Aus MitteView extrahieren, wiederverwendbar | M |
| 13 | Schriftliches Rechnen | Stellengerechte Eingabe, Übertrag | L-XL |

## Constraints

- Touch-first (iPad) — alle Interaktionen müssen mit dem Finger funktionieren
- Bestehende Aufgaben nutzen, keine neuen MD-Dateien nötig
- Komponenten wiederverwendbar über mehrere Kapitel
- Build-Pipeline (JSON) muss weiter grün bleiben
- Philippas Paukthemen (Division, Einheiten) haben höchste Priorität

## Additional Context

- Bestehende visuelle Komponenten: BlockDisplay (Dienes), BaumDiagramm (Kombinatorik), MitteView (Zahlenstrahl)
- Audit-Dokumente: AUDIT-VISUELL.md, SKIZZE-TEMPLATE-ANALYSE.md, PRIORITAETSLISTE-VISUELL.md
- 23% der Aufgaben brauchen zwingend Visualisierung (150 von 645)

---

*This file is temporary. It will be deleted after /paul:milestone creates the milestone.*
