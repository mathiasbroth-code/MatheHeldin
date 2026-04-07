import { useState, useCallback, useEffect } from 'react';
import type { BankAufgabe } from '../types';
import { Card } from '@/components/ui/Card';
import { EingabeView } from './EingabeView';
import { AuswahlView } from './AuswahlView';
import { ZuordnungView } from './ZuordnungView';
import { LueckeView } from './LueckeView';
import { ReihenfolgeView } from './ReihenfolgeView';
import { SchrittView } from './SchrittView';
import { WahrFalschView } from './WahrFalschView';
import { TextaufgabeView } from './TextaufgabeView';
import { RoutenDiagramm, parseRoutenDaten } from './RoutenDiagramm';
import { EinheitenLeiter, detectEinheitenKette } from './EinheitenLeiter';
import { DivisionsZerlegung, parseDivisionsDaten } from './DivisionsZerlegung';
import { WerteBalken, parseWerteBalken } from './WerteBalken';
import { KreiseDiagramm, parseKreiseDaten } from './KreiseDiagramm';
import { StellenwertTafel, parseStellenwertDaten } from './StellenwertTafel';
import { ZahlenstrahlDiagramm, parseZahlenstrahlDaten } from './ZahlenstrahlDiagramm';
import { SchriftlicheRechnung, parseSchriftlicheRechnung } from './SchriftlicheRechnung';
import { IsometricGrid } from '@/components/geometrie/IsometricGrid';
import { ParkettMuster } from '@/components/geometrie/ParkettMuster';
import { KoerperNetz } from '@/components/geometrie/KoerperNetz';
import { BalkenDiagramm } from '@/components/daten/BalkenDiagramm';
import { StrichListe } from '@/components/daten/StrichListe';

export interface AufgabeViewProps {
  aufgabe: BankAufgabe;
  onRichtig: () => void;
  onFalsch: () => void;
  onTeilaufgabeChange?: (label: string) => void;
}

const VIEW_MAP: Record<string, React.ComponentType<AufgabeViewProps>> = {
  eingabe: EingabeView,
  auswahl: AuswahlView,
  zuordnung: ZuordnungView,
  luecke: LueckeView,
  reihenfolge: ReihenfolgeView,
  schritt: SchrittView,
  'wahr-falsch': WahrFalschView,
  textaufgabe: TextaufgabeView,
};

interface AufgabeWrapperProps {
  aufgabe: BankAufgabe;
  onRichtig: () => void;
  onFalsch: () => void;
  onTeilaufgabeChange?: (label: string) => void;
}

// ── Geometrie-Visualisierung ──────────────────────────────

type GeoViz =
  | { typ: 'isometric'; wuerfel: { x: number; y: number; z: number }[] }
  | { typ: 'parkett'; form: 'quadrat' | 'dreieck' | 'sechseck' | 'rechteck' }
  | { typ: 'koerpernetz'; netz: 'wuerfel' | 'quader' };

function parseGeometrieViz(stageId: string, text: string): GeoViz | null {
  // Schrägbilder + Rauminhalt → Isometrische Würfel
  if (stageId === 'schraegbilder' || stageId === 'rauminhalt') {
    const wuerfel = parseWuerfelFromText(text);
    if (wuerfel.length > 0) return { typ: 'isometric', wuerfel };
  }

  // Parkettierungen → Muster-Anzeige
  if (stageId === 'parkettierungen') {
    const form = detectParkettForm(text);
    return { typ: 'parkett', form };
  }

  // Körpernetze → Netz-Anzeige
  if (stageId === 'koerpernetze') {
    const netz = /[Ww]ürfel/.test(text) ? 'wuerfel' as const : 'quader' as const;
    return { typ: 'koerpernetz', netz };
  }

  return null;
}

/** Heuristik: Würfelpositionen aus Textbeschreibung extrahieren */
function parseWuerfelFromText(text: string): { x: number; y: number; z: number }[] {
  const lower = text.toLowerCase();

  // "X würfel in einer reihe" → Reihe auf x-Achse
  const reiheMatch = lower.match(/(\d+)\s*würfel\s*in\s*einer\s*reihe/);
  const baseLen = reiheMatch ? parseInt(reiheMatch[1]) : 0;

  // Bekannte Formen
  if (/l[- ]?förm/i.test(lower) || /l-form/i.test(lower)) {
    return [
      { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 2 },
    ];
  }
  if (/treppe/i.test(lower) || /stufen/i.test(lower)) {
    return [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 }, { x: 1, y: 0, z: 1 },
      { x: 2, y: 0, z: 0 }, { x: 2, y: 0, z: 1 }, { x: 2, y: 0, z: 2 },
    ];
  }
  if (/turm/i.test(lower)) {
    const h = Math.min(baseLen || 4, 5);
    return Array.from({ length: h }, (_, z) => ({ x: 0, y: 0, z }));
  }
  if (/[ut]-förm/i.test(lower) || /u-form/i.test(lower)) {
    return [
      { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 }, { x: 2, y: 0, z: 1 },
    ];
  }

  // Reihe mit optionaler Aufstockung
  if (baseLen > 0) {
    const cubes: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < baseLen; i++) cubes.push({ x: i, y: 0, z: 0 });

    // "X würfel obendrauf/oben"
    const obenMatch = lower.match(/(\d+)\s*würfel\s*(?:obendr?auf|oben|darauf)/);
    if (obenMatch) {
      const oben = parseInt(obenMatch[1]);
      for (let i = 0; i < Math.min(oben, baseLen); i++) cubes.push({ x: i, y: 0, z: 1 });
    }
    return cubes;
  }

  // Fallback: 2×2×1 Block
  return [
    { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 },
  ];
}

function detectParkettForm(text: string): 'quadrat' | 'dreieck' | 'sechseck' | 'rechteck' {
  const lower = text.toLowerCase();
  if (/dreieck/i.test(lower)) return 'dreieck';
  if (/sechseck|hexagon/i.test(lower)) return 'sechseck';
  if (/rechteck/i.test(lower)) return 'rechteck';
  return 'quadrat';
}

// ── Daten-Visualisierung ──────────────────────────────────

type DatenViz =
  | { typ: 'balken'; balken: { label: string; wert: number }[]; einheit?: string }
  | { typ: 'strichliste'; buchstaben: string[] };

function parseDatenViz(stageId: string, text: string): DatenViz | null {
  if (stageId === 'tabellen-diagramme') {
    const balken = extractTabellenWerte(text);
    if (balken.length > 0) return { typ: 'balken', balken, einheit: 'cm' };
  }

  if (stageId === 'haeufigkeitsanalyse') {
    const buchstaben = detectBuchstaben(text);
    return { typ: 'strichliste', buchstaben };
  }

  return null;
}

/** Extrahiert Name|Wert-Paare aus Markdown-Tabellen im Aufgabentext */
function extractTabellenWerte(text: string): { label: string; wert: number }[] {
  const lines = text.split('\n');
  const result: { label: string; wert: number }[] = [];

  for (const line of lines) {
    if (!line.includes('|') || line.match(/^\|[\s\-:|]+\|$/)) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2) {
      const lastCell = cells[cells.length - 1].replace(/[^\d.,]/g, '');
      const wert = parseInt(lastCell, 10);
      if (!isNaN(wert) && wert > 0 && cells[0].length < 20) {
        result.push({ label: cells[0], wert });
      }
    }
  }

  return result;
}

/** Erkennt welche Buchstaben gezählt werden sollen */
function detectBuchstaben(text: string): string[] {
  const lower = text.toLowerCase();
  if (/vokal/i.test(lower)) return ['A', 'E', 'I', 'O', 'U'];

  // Spezifischer Buchstabe genannt?
  const match = text.match(/[Bb]uchstabe[n]?\s+([A-Z])\b/);
  if (match) return [match[1]];

  return ['A', 'E', 'I', 'O', 'U'];
}

/** Extrahiert die Frage-Text der aktiven Teilaufgabe aus parsed-Daten. */
function findAktiveTeilFrage(aufgabe: BankAufgabe, label: string): string | undefined {
  const parsed = aufgabe.parsed as unknown as Record<string, unknown> | undefined;
  if (!parsed || !label) return undefined;

  // EingabeDaten: items[]
  if (Array.isArray(parsed.items)) {
    const item = (parsed.items as { label: string; frage: string }[]).find((i) => i.label === label);
    if (item) return item.frage;
  }

  // SchrittDaten: teilaufgaben[].schritte[]
  if (Array.isArray(parsed.teilaufgaben)) {
    const teil = (parsed.teilaufgaben as { label: string; schritte: { frage: string }[] }[]).find((t) => t.label === label);
    if (teil?.schritte?.[0]) return teil.schritte[0].frage;
  }

  return undefined;
}

/**
 * View-Dispatcher: waehlt die passende View anhand des Aufgabentyps.
 * Kein eigener State fuer Tipps — nur Dispatch + Teilaufgaben-Tracking.
 * Tipps werden ausschliesslich in bankStage.tsx verwaltet.
 */
export function AufgabeWrapper({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeWrapperProps) {
  const View = VIEW_MAP[aufgabe.typ];
  const [activeLabel, setActiveLabel] = useState('');

  useEffect(() => setActiveLabel(''), [aufgabe.titel]);

  const handleTeilaufgabeChange = useCallback((label: string) => {
    setActiveLabel(label);
    onTeilaufgabeChange?.(label);
  }, [onTeilaufgabeChange]);

  if (!View) {
    return (
      <Card className="text-center">
        <p className="text-muted">Aufgabentyp „{aufgabe.typ}" wird noch nicht unterstützt.</p>
      </Card>
    );
  }

  // Kaskadierte Visualisierungs-Erkennung: max. eine pro Aufgabe
  const routenDaten = parseRoutenDaten(aufgabe.aufgabenstellung);
  const einheitenDaten = !routenDaten
    ? detectEinheitenKette(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const divisionsDaten = !routenDaten && !einheitenDaten
    ? parseDivisionsDaten(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const werteBalkenDaten = !routenDaten && !einheitenDaten && !divisionsDaten
    ? parseWerteBalken(aufgabe.aufgabenstellung)
    : null;
  const stellenwertDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten
    ? parseStellenwertDaten(aufgabe.aufgabenstellung)
    : null;
  const zahlenstrahlDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten
    ? parseZahlenstrahlDaten(aufgabe.aufgabenstellung)
    : null;
  const aktiveTeilFrage = findAktiveTeilFrage(aufgabe, activeLabel);
  const schriftlichDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten
    ? parseSchriftlicheRechnung(aufgabe.stageId, aufgabe.aufgabenstellung, aktiveTeilFrage)
    : null;
  // Interaktiv bei Add/Sub/Mul mit eingabe/schritt-Typ (nicht wahr-falsch, textaufgabe etc.)
  const schriftlichInteraktiv = !!(schriftlichDaten && schriftlichDaten.typ !== 'division'
    && (aufgabe.typ === 'eingabe' || aufgabe.typ === 'schritt'));
  const geoDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten
    ? parseGeometrieViz(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const datenDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !geoDaten
    ? parseDatenViz(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const kreiseDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !geoDaten && !datenDaten
    ? parseKreiseDaten(aufgabe.aufgabenstellung, aufgabe.loesung)
    : null;

  return (
    <>
      {routenDaten && <RoutenDiagramm {...routenDaten} />}
      {einheitenDaten && <EinheitenLeiter {...einheitenDaten} />}
      {divisionsDaten && <DivisionsZerlegung {...divisionsDaten} />}
      {werteBalkenDaten && <WerteBalken {...werteBalkenDaten} />}
      {stellenwertDaten && <StellenwertTafel {...stellenwertDaten} />}
      {zahlenstrahlDaten && <ZahlenstrahlDiagramm {...zahlenstrahlDaten} />}
      {schriftlichDaten && (
        <SchriftlicheRechnung
          {...schriftlichDaten}
          interaktiv={schriftlichInteraktiv}
          onRichtig={schriftlichInteraktiv ? onRichtig : undefined}
          onFalsch={schriftlichInteraktiv ? onFalsch : undefined}
        />
      )}
      {geoDaten?.typ === 'isometric' && (
        <Card className="py-2 px-3">
          <IsometricGrid wuerfel={geoDaten.wuerfel} />
        </Card>
      )}
      {geoDaten?.typ === 'parkett' && (
        <Card className="py-2 px-3">
          <p className="text-[10px] text-muted text-center mb-1">Parkettierung</p>
          <ParkettMuster form={geoDaten.form} />
        </Card>
      )}
      {geoDaten?.typ === 'koerpernetz' && (
        <Card className="py-2 px-3">
          <p className="text-[10px] text-muted text-center mb-1">Körpernetz</p>
          <KoerperNetz typ={geoDaten.netz} />
        </Card>
      )}
      {datenDaten?.typ === 'balken' && (
        <Card className="py-2 px-3">
          <BalkenDiagramm balken={datenDaten.balken} einheit={datenDaten.einheit} />
        </Card>
      )}
      {datenDaten?.typ === 'strichliste' && (
        <Card className="py-2 px-3">
          <StrichListe buchstaben={datenDaten.buchstaben} />
        </Card>
      )}
      {kreiseDaten && <KreiseDiagramm {...kreiseDaten} />}
      {!schriftlichInteraktiv && (
        <View aufgabe={aufgabe} onRichtig={onRichtig} onFalsch={onFalsch} onTeilaufgabeChange={handleTeilaufgabeChange} />
      )}
    </>
  );
}
