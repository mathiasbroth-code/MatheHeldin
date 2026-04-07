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
import { SchriftlicheDivision } from './SchriftlicheDivision';
import { HalbschriftlicheDivision } from './HalbschriftlicheDivision';
import { MalTabelle, parseMalTabelle } from './MalTabelle';
import { BruchVisualisierung, parseBruchDaten } from './BruchVisualisierung';
import { IsometricGrid } from '@/components/geometrie/IsometricGrid';
import { ParkettMuster } from '@/components/geometrie/ParkettMuster';
import { KoerperNetz } from '@/components/geometrie/KoerperNetz';
import { BalkenDiagramm } from '@/components/daten/BalkenDiagramm';
import { StrichListe } from '@/components/daten/StrichListe';
import { BinaerAnzeige } from '@/components/forscherkiste/BinaerAnzeige';
import { PascalDreieck } from '@/components/forscherkiste/PascalDreieck';
import { FibonacciReihe } from '@/components/forscherkiste/FibonacciReihe';
import { PrimzahlSieb } from '@/components/forscherkiste/PrimzahlSieb';
import { DatenmengenLeiter } from '@/components/daten/DatenmengenLeiter';
import { MassstabVergleich, parseMassstab } from '@/components/geometrie/MassstabVergleich';
import { VielfacheReihe } from '@/components/ui/VielfacheReihe';
import { KombinationenSammler } from '@/components/ui/KombinationenSammler';
import { MarkdownText } from './MarkdownText';
import { BuchstabenChart } from '@/components/daten/BuchstabenChart';

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
  | { typ: 'massstab'; faktor: number; label?: string; emoji?: string; objektName?: string }
  | { typ: 'parkett'; form: 'quadrat' | 'dreieck' | 'sechseck' | 'rechteck' }
  | { typ: 'koerpernetz'; netz: 'wuerfel' | 'quader' };

function parseGeometrieViz(stageId: string, text: string): GeoViz | null {
  // Schrägbilder + Rauminhalt → Isometrische Würfel
  if (stageId === 'schraegbilder' || stageId === 'rauminhalt' || stageId === 'ansichten-grundriss') {
    const wuerfel = parseWuerfelFromText(text);
    if (wuerfel.length > 0) return { typ: 'isometric', wuerfel };
  }

  // Maßstab → Vergrößerungs-/Verkleinerungs-Vergleich
  if (stageId === 'massstab') {
    const ms = parseMassstab(text);
    if (ms) return { typ: 'massstab' as const, ...ms };
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

// ── Forscherkiste-Visualisierung ──────────────────────────

type ForscherViz = 'binaer' | 'pascal' | 'fibonacci' | 'primsieb' | 'datenmengen';

function parseForscherViz(stageId: string): ForscherViz | null {
  switch (stageId) {
    case 'binaersystem': return 'binaer';
    case 'pascalsches-dreieck': return 'pascal';
    case 'fibonacci': return 'fibonacci';
    case 'zahlenforscher': return 'primsieb';
    case 'datenmengen': return 'datenmengen';
    default: return null;
  }
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

// ── Interaktive Division erkennen ────────────────────────

interface DivisionInteraktivDaten {
  typ: 'schriftlich' | 'halbschriftlich';
  dividend: number;
  divisor: number;
  vielfacheAuswahl?: number[];
  ersteZahlAuswahl?: number[];
}

function parseDivisionInteraktiv(stageId: string, text: string): DivisionInteraktivDaten | null {
  // Nur für Division-Stages
  const istSchriftlich = stageId.includes('schriftlich-dividieren') && !stageId.includes('halbschriftlich');
  const istHalbschriftlich = stageId.includes('halbschriftlich-dividieren') || stageId.includes('halbschriftlich-div');
  if (!istSchriftlich && !istHalbschriftlich) return null;

  // Dividend : Divisor extrahieren
  const match = text.match(/(\d[\d.]*)\s*:\s*(\d+)/);
  if (!match) return null;

  const dividend = parseInt(match[1].replace(/\./g, ''), 10);
  const divisor = parseInt(match[2], 10);
  if (isNaN(dividend) || isNaN(divisor) || divisor === 0) return null;

  // Vielfache-Auswahl erkennen (z.B. "Vielfache von 8: 80, 160, 240, ...")
  let vielfacheAuswahl: number[] | undefined;
  let ersteZahlAuswahl: number[] | undefined;

  const vielfacheMatch = text.match(/Vielfache[^:]*:\s*([\d,\s.]+)/i);
  if (vielfacheMatch && istHalbschriftlich) {
    vielfacheAuswahl = vielfacheMatch[1].split(/[,\s]+/).map((s) => parseInt(s.replace(/\./g, ''), 10)).filter((n) => !isNaN(n) && n > 0);
  }

  // Erste-Zahl-Auswahl für schriftlich (z.B. "40 45 50" über der Aufgabe)
  const ersteZahlMatch = text.match(/(\d+)\s+(\d+)\s+(\d+)\s*\n/);
  if (ersteZahlMatch && istSchriftlich && text.toLowerCase().includes('welche zahl')) {
    ersteZahlAuswahl = [parseInt(ersteZahlMatch[1]), parseInt(ersteZahlMatch[2]), parseInt(ersteZahlMatch[3])];
  }

  return {
    typ: istHalbschriftlich ? 'halbschriftlich' : 'schriftlich',
    dividend,
    divisor,
    vielfacheAuswahl,
    ersteZahlAuswahl,
  };
}

/** Sturmglocken-Skizze: Zwei Glocken an einer 4km-Strecke, je 3km Reichweite, 2km Überlappung. */
function SturmglockenSkizze() {
  const w = 320;
  const h = 90;
  const y = 35;
  const left = 30;
  const right = 290;
  const kmPx = (right - left) / 4; // 1 km in px

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="max-w-full">
      {/* Strecke */}
      <line x1={left} y1={y} x2={right} y2={y} stroke="#334155" strokeWidth={2} />

      {/* km-Markierungen */}
      {[0, 1, 2, 3, 4].map((km) => (
        <g key={km}>
          <line x1={left + km * kmPx} y1={y - 4} x2={left + km * kmPx} y2={y + 4} stroke="#334155" strokeWidth={1.5} />
          <text x={left + km * kmPx} y={y + 16} textAnchor="middle" fontSize={9} fill="#64748b">{km} km</text>
        </g>
      ))}

      {/* Glocke Konstanz: 0-3 km (blau) */}
      <rect x={left} y={y - 14} width={3 * kmPx} height={10} rx={3} fill="#93c5fd" opacity={0.5} stroke="#3b82f6" strokeWidth={1} />
      <text x={left + 1.5 * kmPx} y={y - 7} textAnchor="middle" fontSize={8} fill="#1d4ed8">Glocke K (3 km)</text>

      {/* Glocke Meersburg: 1-4 km (orange) */}
      <rect x={left + 1 * kmPx} y={y - 26} width={3 * kmPx} height={10} rx={3} fill="#fed7aa" opacity={0.5} stroke="#f97316" strokeWidth={1} />
      <text x={left + 2.5 * kmPx} y={y - 19} textAnchor="middle" fontSize={8} fill="#c2410c">Glocke M (3 km)</text>

      {/* Überlappung: 1-3 km (grün) */}
      <rect x={left + 1 * kmPx} y={y + 22} width={2 * kmPx} height={8} rx={3} fill="#86efac" stroke="#16a34a" strokeWidth={1} />
      <text x={left + 2 * kmPx} y={y + 40} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#15803d">Beide: 2 km</text>

      {/* Orte */}
      <text x={left} y={y + 55} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#334155">Konstanz</text>
      <text x={right} y={y + 55} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#334155">Meersburg</text>

      {/* Gesamtstrecke */}
      <text x={(left + right) / 2} y={y + 55} textAnchor="middle" fontSize={9} fill="#64748b">4 km</text>
    </svg>
  );
}

/**
 * View-Dispatcher: waehlt die passende View anhand des Aufgabentyps.
 * Kein eigener State fuer Tipps — nur Dispatch + Teilaufgaben-Tracking.
 * Tipps werden ausschliesslich in bankStage.tsx verwaltet.
 */
export function AufgabeWrapper({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeWrapperProps) {
  const View = VIEW_MAP[aufgabe.typ];
  const [activeLabel, setActiveLabel] = useState('');
  const [answered, setAnswered] = useState(false);

  useEffect(() => { setActiveLabel(''); setAnswered(false); }, [aufgabe.titel]);

  const handleTeilaufgabeChange = useCallback((label: string) => {
    setActiveLabel(label);
    onTeilaufgabeChange?.(label);
  }, [onTeilaufgabeChange]);

  const handleRichtig = useCallback(() => {
    setAnswered(true);
    onRichtig();
  }, [onRichtig]);

  if (!View) {
    return (
      <Card className="text-center">
        <p className="text-muted">Aufgabentyp „{aufgabe.typ}" wird noch nicht unterstützt.</p>
      </Card>
    );
  }

  // Vielfache-Interaktion: [vielfache:5,10] oder [vielfache:4,8:einkreisen]
  const vielfacheMatch = aufgabe.aufgabenstellung.match(/\[vielfache:([\d,]+)(?::einkreisen)?\]/);
  const vielfacheDaten = vielfacheMatch ? {
    zahlen: vielfacheMatch[1].split(',').map(Number),
    mitEinkreisen: aufgabe.aufgabenstellung.includes(':einkreisen]'),
  } : null;

  if (vielfacheDaten) {
    // Aufgabentext ohne den [vielfache:...] Tag anzeigen
    const vielfacheText = aufgabe.aufgabenstellung
      .replace(/\[vielfache:[^\]]+\]/g, '')
      .trim();
    return (
      <>
        {vielfacheText && (
          <Card>
            <p className="text-sm font-semibold text-heading leading-relaxed">{vielfacheText}</p>
          </Card>
        )}
        <VielfacheReihe
          zahlen={vielfacheDaten.zahlen}
          mitEinkreisen={vielfacheDaten.mitEinkreisen}
          onRichtig={handleRichtig}
          onFalsch={onFalsch}
        />
      </>
    );
  }

  // Kombinationen-Sammler: [kombinationen:elemente:prefix:laenge:anzahl:modus]
  // z.B. [kombinationen:2,4,7:6:4:6:permutation] oder [kombinationen:Ali,Jana,Tobi,Pia::2:6:kombination]
  const kombMatch = aufgabe.aufgabenstellung.match(
    /\[kombinationen:([^:]+):([^:]*):(\d+):(\d+):(\w+)\]/,
  );
  if (kombMatch) {
    const elemente = kombMatch[1].split(',');
    const prefix = kombMatch[2] ? kombMatch[2].split(',') : [];
    const laenge = parseInt(kombMatch[3], 10);
    const anzahl = parseInt(kombMatch[4], 10);
    const ohneReihenfolge = kombMatch[5] === 'kombination';
    const kombText = aufgabe.aufgabenstellung.replace(/\[kombinationen:[^\]]+\]/g, '').trim();

    return (
      <>
        {kombText && (
          <Card>
            <MarkdownText text={kombText} className="text-sm font-semibold text-heading leading-relaxed" />
          </Card>
        )}
        <KombinationenSammler
          elemente={elemente}
          prefix={prefix}
          laenge={laenge}
          ohneReihenfolge={ohneReihenfolge}
          erwarteteAnzahl={anzahl}
          onRichtig={handleRichtig}
          onFalsch={onFalsch}
        />
      </>
    );
  }

  // Interaktive Division (VOR der allgemeinen Kaskade)
  const aktiveTeilFrageDiv = findAktiveTeilFrage(aufgabe, activeLabel);
  const divInteraktiv = parseDivisionInteraktiv(
    aufgabe.stageId,
    aktiveTeilFrageDiv ?? aufgabe.aufgabenstellung,
  );

  // Maltabelle für halbschriftliches Multiplizieren
  const malTabelleDaten = !divInteraktiv
    ? parseMalTabelle(aufgabe.stageId, aktiveTeilFrageDiv ?? aufgabe.aufgabenstellung)
    : null;
  const malTabelleInteraktiv = !!(malTabelleDaten && (aufgabe.typ === 'schritt' || aufgabe.typ === 'eingabe'));

  // Kaskadierte Visualisierungs-Erkennung: max. eine pro Aufgabe
  const routenDaten = !divInteraktiv && !malTabelleInteraktiv ? parseRoutenDaten(aufgabe.aufgabenstellung) : null;
  const einheitenDaten = !divInteraktiv && !routenDaten
    ? detectEinheitenKette(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const divisionsDaten = !divInteraktiv && !routenDaten && !einheitenDaten
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
  const bruchDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten
    ? parseBruchDaten(aufgabe.stageId, aufgabe.aufgabenstellung, aktiveTeilFrage)
    : null;
  const geoDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !bruchDaten
    ? parseGeometrieViz(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const datenDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !bruchDaten && !geoDaten
    ? parseDatenViz(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const forscherViz = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !bruchDaten && !geoDaten && !datenDaten
    ? parseForscherViz(aufgabe.stageId)
    : null;
  const kreiseDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten && !stellenwertDaten && !zahlenstrahlDaten && !schriftlichDaten && !bruchDaten && !geoDaten && !datenDaten && !forscherViz
    ? parseKreiseDaten(aufgabe.aufgabenstellung, aufgabe.loesung)
    : null;

  // Division interaktiv ersetzt die normale View
  const divInteraktivKomponente = divInteraktiv && (aufgabe.typ === 'schritt' || aufgabe.typ === 'eingabe');

  return (
    <>
      {/* Aufgabenspezifische Skizzen */}
      {/Sturmwarnglocke/i.test(aufgabe.aufgabenstellung) && (
        <Card className="py-2 px-3">
          <SturmglockenSkizze />
        </Card>
      )}
      {/* Buchstabenhäufigkeits-Diagramm für Diagramm-Aufgaben */}
      {/\[buchstaben-chart\]/.test(aufgabe.aufgabenstellung) && (
        <Card className="py-2 px-3">
          <BuchstabenChart />
        </Card>
      )}
      {/* Interaktive Maltabelle */}
      {malTabelleInteraktiv && malTabelleDaten && (
        <Card className="py-3 px-2">
          <MalTabelle
            faktor1={malTabelleDaten.faktor1}
            faktor2={malTabelleDaten.faktor2}
            onRichtig={onRichtig}
            onFalsch={onFalsch}
          />
        </Card>
      )}
      {/* Interaktive Division */}
      {divInteraktivKomponente && divInteraktiv.typ === 'schriftlich' && (
        <Card className="py-2 px-3">
          <SchriftlicheDivision
            dividend={divInteraktiv.dividend}
            divisor={divInteraktiv.divisor}
            ersteZahlAuswahl={divInteraktiv.ersteZahlAuswahl}
            mitProbe={/probe|kontrolliere/i.test(aufgabe.aufgabenstellung)}
            onRichtig={onRichtig}
            onFalsch={onFalsch}
          />
        </Card>
      )}
      {divInteraktivKomponente && divInteraktiv.typ === 'halbschriftlich' && (
        <Card className="py-3 px-3">
          <HalbschriftlicheDivision
            dividend={divInteraktiv.dividend}
            divisor={divInteraktiv.divisor}
            vielfacheAuswahl={divInteraktiv.vielfacheAuswahl}
            onRichtig={onRichtig}
            onFalsch={onFalsch}
          />
        </Card>
      )}
      {routenDaten && <RoutenDiagramm {...routenDaten} />}
      {einheitenDaten && <EinheitenLeiter {...einheitenDaten} />}
      {divisionsDaten && !divInteraktivKomponente && <DivisionsZerlegung {...divisionsDaten} />}
      {werteBalkenDaten && <WerteBalken {...werteBalkenDaten} />}
      {stellenwertDaten && <StellenwertTafel {...stellenwertDaten} />}
      {zahlenstrahlDaten && <ZahlenstrahlDiagramm {...zahlenstrahlDaten} />}
      {schriftlichDaten && (
        <SchriftlicheRechnung
          {...schriftlichDaten}
          interaktiv={schriftlichInteraktiv}
          onRichtig={schriftlichInteraktiv ? handleRichtig : undefined}
          onFalsch={schriftlichInteraktiv ? onFalsch : undefined}
        />
      )}
      {bruchDaten && <BruchVisualisierung {...bruchDaten} />}
      {geoDaten?.typ === 'isometric' && (
        <Card className="py-2 px-3">
          <IsometricGrid wuerfel={geoDaten.wuerfel} />
        </Card>
      )}
      {geoDaten?.typ === 'massstab' && answered && (
        <Card className="py-2 px-3">
          <MassstabVergleich faktor={geoDaten.faktor} label={geoDaten.label} emoji={geoDaten.emoji} objektName={geoDaten.objektName} />
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
      {forscherViz === 'binaer' && (
        <Card className="py-2 px-3"><BinaerAnzeige /></Card>
      )}
      {forscherViz === 'pascal' && (
        <Card className="py-2 px-3"><PascalDreieck /></Card>
      )}
      {forscherViz === 'fibonacci' && (
        <Card className="py-2 px-3"><FibonacciReihe /></Card>
      )}
      {forscherViz === 'primsieb' && (
        <Card className="py-2 px-3"><PrimzahlSieb /></Card>
      )}
      {forscherViz === 'datenmengen' && (
        <Card className="py-2 px-3"><DatenmengenLeiter /></Card>
      )}
      {kreiseDaten && <KreiseDiagramm {...kreiseDaten} />}
      {!schriftlichInteraktiv && !divInteraktivKomponente && !malTabelleInteraktiv && (
        <View aufgabe={aufgabe} onRichtig={handleRichtig} onFalsch={onFalsch} onTeilaufgabeChange={handleTeilaufgabeChange} />
      )}
    </>
  );
}
