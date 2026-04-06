# Matheheldin — Projekt-Kontext für Claude Code

Visuelles Mathe-Lernprogramm für Philippa (9 Jahre, 3. Klasse Grundschule, visuelle Lernerin).
Gebaut als PWA für iPad/iPhone, offline-fähig, lokal persistiert.

## Tech Stack (nicht verhandeln ohne Rücksprache)

- **Vite + React 18 + TypeScript** (strict mode)
- **Tailwind CSS** — Core-Utility-Klassen, keine dynamischen Klassennamen
- **Zustand** (mit `persist`-Middleware) für App-State
- **Dexie.js** für persistenten Log von Profilen, Sessions und Antworten
- **React Router v6** für Navigation
- **vite-plugin-pwa** für Installability und Offline-Caching

**Bewusst NICHT benutzt:**
- kein Next.js (SSR nicht nötig)
- kein Redux (zu viel Boilerplate)
- kein Context für Domain-State (Zustand ist besser für diesen Anwendungsfall)
- keine UI-Bibliothek (shadcn, MUI, etc.) — wir bauen die wenigen Primitives selbst
- kein Testing-Framework in v1 (kommt später)

## Architektur-Prinzipien

1. **Stage-Pattern ist heilig.** Jede Übungsart ist ein self-contained Modul in `src/stages/<id>/` mit `meta.ts`, `generator.ts`, `View.tsx`. Neue Stufen werden hinzugefügt, indem ein neuer Ordner angelegt und im `registry.ts` importiert wird — niemals durch Änderungen an der Shell.

2. **Antworten werden immer persistent geloggt.** Jeder Antwortversuch läuft durch `useAntwortRecorder` und landet in der Dexie-`antworten`-Tabelle. Aggregate (Prozent, Fälligkeit) werden live aus dem Log berechnet, nicht denormalisiert.

3. **Touch-first UI.** Mindesttap-Target 44×44 px. Keine Hover-only-Interaktionen. Keine Drag&Drop-Mechaniken ohne Touch-Fallback. Die Skizze-Module müssen auf einem iPad genauso gut funktionieren wie im Desktop-Browser.

4. **Offline by default.** Keine Netzwerkabhängigkeit zur Laufzeit. Wenn später Cloud-Sync kommt, wird das als optionales Layer oben drauf gesetzt — nicht als Voraussetzung.

5. **Kein Stufen-Lock.** Alle Stufen sind von Anfang an für das Kind zugänglich. Fortschritt wird angezeigt, aber nie verwendet, um Inhalt zu sperren. Das ist eine bewusste didaktische Entscheidung.

6. **Single-file components bevorzugen**, außer bei komplexen Stufen (z.B. Skizze mit 3 Phasen), die in `phases/` aufgeteilt werden dürfen.

## Folder Structure

```
src/
├── main.tsx
├── App.tsx                     # Router-Root
├── pages/
│   ├── Uebersicht.tsx          # Stufen-Liste + Stats-Karten
│   ├── StufeView.tsx           # rendert dynamisch <stage.View>
│   └── Statistik.tsx           # später
├── stages/
│   ├── types.ts                # Stage<T>, StageProps<T>, Aufgabe
│   ├── registry.ts             # STAGES: Stage[], findStage(id)
│   └── <stufeId>/
│       ├── meta.ts             # export default Stage<XxxAufgabe>
│       ├── generator.ts        # () => XxxAufgabe
│       ├── XxxView.tsx
│       └── index.ts
├── components/
│   ├── dienes/                 # Einer, Zehner, Hunderter, Tausender, BlockDisplay
│   ├── zahlenstrahl/           # wiederverwendbare Number-Line-Primitives
│   ├── ui/                     # Button, Card, Input, Phasenindikator
│   └── layout/
├── stores/
│   ├── profileStore.ts         # Zustand — aktives Profil
│   └── sessionStore.ts         # Zustand — aktuelle Session
├── db/
│   ├── schema.ts               # Dexie tables + MatheDB class
│   ├── repository.ts           # typisierte queries
│   └── migrations.ts
├── hooks/
│   ├── useAntwortRecorder.ts   # central answer logging
│   ├── useStufenFortschritt.ts # reaktive Stats pro Stufe
│   └── useAktuelleAufgabe.ts
└── styles/
    └── globals.css
```

## Stage-Interface (Vertrag für alle Übungen)

```ts
// src/stages/types.ts
export interface Aufgabe {
  readonly id: string;        // stable hash, zur Wiedererkennung bei Replay/Statistik
  readonly erzeugtAm: number;
}

export interface StageProps<T extends Aufgabe> {
  aufgabe: T;
  onAntwort: (antwort: string, richtig: boolean, dauerMs: number) => void;
  onNaechste: () => void;
  fortschritt: { richtig: number; versuche: number };
}

export interface Stage<T extends Aufgabe = Aufgabe> {
  id: string;
  titel: string;
  sub: string;
  icon: string;              // Emoji oder Pfad zu SVG
  farbe: 'sky' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'purple';
  zielRichtige: number;      // default 5 — bestimmt, wann die Stufe als "fertig" gilt
  generator: () => T;
  validator: (aufgabe: T, antwort: string) => boolean;
  View: React.ComponentType<StageProps<T>>;
}
```

## Dexie-Schema

```ts
// src/db/schema.ts
import Dexie, { Table } from 'dexie';

export interface Profile {
  id?: number;
  name: string;
  farbe: string;
  erstelltAm: number;
}

export interface Session {
  id?: number;
  profileId: number;
  stufeId: string;
  gestartetAm: number;
  beendetAm?: number;
}

export interface AntwortLog {
  id?: number;
  sessionId: number;
  profileId: number;
  stufeId: string;
  aufgabeId: string;
  aufgabeSnapshot: string;    // JSON.stringify der Aufgabe
  antwort: string;
  richtig: boolean;
  dauerMs: number;
  tippBenutzt: boolean;
  erstelltAm: number;
}

class MatheDB extends Dexie {
  profiles!: Table<Profile>;
  sessions!: Table<Session>;
  antworten!: Table<AntwortLog>;

  constructor() {
    super('matheheldin');
    this.version(1).stores({
      profiles: '++id, name',
      sessions: '++id, profileId, stufeId, gestartetAm',
      antworten: '++id, [profileId+stufeId], sessionId, erstelltAm, richtig',
    });
  }
}

export const db = new MatheDB();
```

## Geplante Stufen (v1 – aus dem Artifact zu portieren)

| id | Titel | Typ |
|----|-------|-----|
| `mengen` | Mengen bis 20 | Blöcke zählen |
| `buendeln` | Zehner bündeln | 10er-Gruppen erkennen |
| `bis100lesen` | Zahlen bis 100 lesen | Blöcke → Zahl |
| `bis100legen` | Zahlen bis 100 legen | Zahl → Blöcke |
| `bis1000lesen` | Zahlen bis 1 000 lesen | mit Hundertern |
| `bis1000legen` | Zahlen bis 1 000 legen | mit Hundertern |
| `bis10000lesen` | Zahlen bis 10 000 lesen | mit Tausendern |
| `bis10000legen` | Zahlen bis 10 000 legen | mit Tausendern |
| `zerlegen` | Zahlen zerlegen | T H Z E getrennt |
| `mitte` | Zahl in der Mitte | Mittelwert auf Zahlenstrahl |
| `skizze` | Sachaufgaben mit Skizze | 3-Phasen-Flow |

## Didaktische Regeln (nicht ohne Rücksprache ändern)

- **Deutsche Zahlenformatierung überall:** `1.234,5` — niemals `1,234.5`. Nutze `Intl.NumberFormat('de-DE')`.
- **Dienes-Material Farbcodes:** Einer hellgelb, Zehner gelb, Hunderter kräftig gelb, Tausender orange. Farben sind bewusst, nicht dekorativ — Kinder lernen die Farbe als Größenhinweis.
- **Skizze-Modul ist drei-phasig:** Orte ordnen → Strecken eintragen → rechnen. Nicht zusammenfassen.
- **Feedback ist nie verletzend.** Statt „falsch" heißt es „🤔 Noch nicht ganz" mit konkretem Hilfetipp.
- **Tipp-Button scafft, lockt nicht.** Wenn er benutzt wurde, wird das im AntwortLog (`tippBenutzt: true`) festgehalten — für spätere Auswertung.

## Build / Entwicklung

```bash
pnpm install
pnpm dev                  # lokal auf http://localhost:5173
pnpm build                # production build
pnpm preview              # preview des production builds
```

## Deployment

- Ziel: Cloudflare Pages oder Vercel via GitHub
- Custom Domain optional (z.B. matheheldin.roth.cloud)
- PWA Icons müssen VOR dem ersten Deploy in `public/icons/` liegen, sonst kein „Zum Homebildschirm"

## Referenz-Code

Unter `_reference/matheheldin_artifact.jsx` liegt die v3-Implementierung aus dem Claude-Artifact. Sie enthält die vollständige Logik aller Stufen inklusive Skizze-Flow und Dienes-SVGs. Bei neuen Features immer zuerst schauen, ob eine Komponente dort schon existiert — dann portieren statt neu schreiben.

## Arbeitsweise mit Claude Code

- **Klein anfangen.** Neue Features als einzelne Dateien, nicht als Pull-Requests-Monolith.
- **Stage-Pattern nicht umgehen.** Wenn eine neue Übung nicht ins Stage-Interface passt, ist die Übung falsch strukturiert, nicht das Interface.
- **Vor jeder Änderung an Dexie-Schema:** Migration überlegen. `db.version(2).stores(…).upgrade(tx => …)`.
- **State in Zustand, nicht in Komponenten-State**, außer bei rein lokalen UI-Zuständen (Input-Werte, Open/Closed-Toggles).
- **Deutsche UI-Texte, englische Code-Identifier** — keine Vermischung.
