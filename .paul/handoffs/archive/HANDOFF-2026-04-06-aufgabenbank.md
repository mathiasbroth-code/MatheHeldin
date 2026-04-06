# Session Handoff — Aufgabenbank Content

**Datum:** 2026-04-06
**Session-Fokus:** Aufgabenbank erstellen (Phase 3a + 3b)

## Was wurde erreicht

### Fredo-4 Schulbuch erschlossen
- Cornelsen-App analysiert, DRM-Verschlüsselung geknackt (AES-128-CBC, statischer Schlüssel)
- Schulbuch-PDF entschlüsselt: `_reference/Fredo4_Schulbuch.pdf` (148 Seiten)
- Buchstruktur als JSON: `_reference/fredo4_uma.json`
- 140 Lernvideos entschlüsselt: `_reference/videos/` (3.1 GB)
- 700 Keyframes extrahiert: `_reference/video-keyframes/`
- Video-Katalog erstellt: `docs/VIDEO_KATALOG.md`

### Aufgabenbank komplett erstellt
- **500 Aufgaben** in 14 Markdown-Dateien (`docs/aufgaben/01-*.md` bis `14-*.md`)
- Verbindliches Format: `docs/aufgaben/FORMAT.md`
- 8 Interaktionstypen: eingabe, auswahl, zuordnung, luecke, reihenfolge, schritt, wahr-falsch, textaufgabe
- 3 Schwierigkeitsgrade: gelb (~30%), grün (~40%), orange (~30%)
- Jede Aufgabe: YAML-Frontmatter + Lösung + Lösungsweg + 3 visuelle Tipps + didaktischer Hinweis
- Tipps speziell für Philippa (visueller Lerntyp, tut sich mit Mathe schwer)

### Aufgaben pro Kapitel
| Kap. | Thema | Aufgaben |
|------|-------|----------|
| 1 | Wiederholung | 50 |
| 2 | Zahlen bis Million | 60 |
| 3 | Addition/Subtraktion | 55 |
| 4 | Geometrie/Fläche | 26 |
| 5 | Multiplikation | 34 |
| 6 | Gewichte/Längen | 31 |
| 7 | Kombinatorik | 24 |
| 8 | Division ⚡ | 49 |
| 9 | Brüche/Hohlmaße | 48 |
| 10 | Kreise/Körper | 28 |
| 11 | Sachrechnen | 16 |
| 12 | Maßstab | 22 |
| 13 | Daten | 27 |
| 14 | Forscherkiste | 30 |

## Entscheidungen
- Experten-Gremium konsultiert für Format, Tipp-Design, Interaktionstypen
- Aufgabenanzahl flexibel nach Buchseitenumfang (Prof. Sommer)
- Fredo-Farbsystem (gelb/grün/orange) für Schwierigkeitsgrade
- Division (Kap. 8) aus Welle B vorgezogen — Philippas aktuelle Schulthemen
- Video-Keyframes dürfen nicht direkt von Agents geladen werden (Bild-Limit)

## Offene Punkte
- **Phase 4 (Code-Integration):** MD-Aufgaben → TypeScript-Generatoren überführen
- **Nachbearbeitung:** Welle-A-Tipps optional mit Video-Erkenntnissen anreichern
- **Philippas Paukthemen:** Division, Kombinatorik, Entfernungen/Geschwindigkeiten priorisieren

## Parallel Sessions (gleicher Tag)
- **Code-Session:** Milestone v0.1 komplett (Phase 1-7), App ist funktionsfähig + installierbar
- **Grafik-Session:** Avatar-Customizer (5 Tiere, 6 Farben, 11 Accessoires)
- **Video-Session:** 140 Videos entschlüsselt + katalogisiert

## Nächster Schritt
Phase 4: Aufgabenbank Code-Integration
- `docs/aufgaben/*.md` → TypeScript-Objekte in `src/stages/*/`
- YAML-Frontmatter → Stage-Generatoren mit Aufgaben-Pool
- Interaktionstyp-Views für die 8 Typen

---
*Handoff erstellt: 2026-04-06*
