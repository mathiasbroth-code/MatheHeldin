import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Aufgabe, StageProps, Stage, StageFarbe } from '@/stages/types';
import type { BankAufgabe, Schwierigkeit } from './types';
import { aufgabenPool } from './pool';
import { AufgabeWrapper } from './views/AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { TippButton, TippInhalte } from '@/components/ui/TippSystem';
import { Zeichenfeld } from '@/components/ui/Zeichenfeld';
import { MerkkastenCard } from '@/components/ui/MerkkastenCard';
import { BruchMerkkasten } from '@/components/ui/BruchKreis';
import { KreisMerkkasten } from '@/components/geometrie/KreisMerkkasten';
import { PascalDreieck } from '@/components/forscherkiste/PascalDreieck';
import { TaschenrechnerTasten } from '@/components/forscherkiste/TaschenrechnerTasten';
import { MillionenWuerfel } from '@/components/dienes/MillionenWuerfel';
import { MultiplikationZerlegung } from '@/components/ui/MultiplikationZerlegung';
import { SkizzeMerkkasten } from '@/components/ui/SkizzeMerkkasten';
import { filterTippForLabel } from './parserHelpers';
import { useDeaktivierteAufgaben } from '@/stores/deaktivierteAufgabenStore';
import { useAdaptiv } from '@/hooks/useAdaptiv';

/** Aufgabe aus der Bank — wraps a BankAufgabe for the Stage system. */
export interface BankStageAufgabe extends Aufgabe {
  readonly bankAufgabe: BankAufgabe;
}

/** Schwierigkeits-Filter Buttons. */
function SchwierigkeitsFilter({
  aktiv,
  onChange,
  counts,
}: {
  aktiv: Schwierigkeit | null;
  onChange: (s: Schwierigkeit | null) => void;
  counts: Record<Schwierigkeit, number>;
}) {
  const options: { id: Schwierigkeit | null; label: string; color: string }[] = [
    { id: null, label: 'Alle', color: 'bg-border text-heading' },
    { id: 'gelb', label: `Einfach (${counts.gelb})`, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'grün', label: `Kern (${counts['grün']})`, color: 'bg-emerald-100 text-emerald-800' },
    { id: 'orange', label: `Knifflig (${counts.orange})`, color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.id ?? 'alle'}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[32px] ${
            aktiv === opt.id
              ? `${opt.color} ring-2 ring-primary/30`
              : 'bg-card border border-border text-muted hover:border-primary/30'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** View-Komponente für Bank-Stages. */
function BankStageView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<BankStageAufgabe>) {
  const { schwierigkeitDefault } = useAdaptiv();
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit | null>(() => schwierigkeitDefault(aufgabe.bankAufgabe.stageId));
  const startTime = useRef(Date.now());
  // Aufgabe stabilisieren: bei HMR-Reloads bleibt die gleiche Aufgabe
  const stableAufgabe = useRef(aufgabe.bankAufgabe);
  const [currentAufgabe, setCurrentAufgabeRaw] = useState(stableAufgabe.current);
  const setCurrentAufgabe = useCallback((a: BankAufgabe) => {
    stableAufgabe.current = a;
    setCurrentAufgabeRaw(a);
  }, []);
  const deaktiviert = useDeaktivierteAufgaben((s) => s.deaktiviert);
  const [erklaerungOpen, setErklaerungOpen] = useState(false);
  const [tippStufe, setTippStufe] = useState(0);
  const [zeichenfeldOpen, setZeichenfeldOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const [headerActionsEl, setHeaderActionsEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderActionsEl(document.getElementById('header-actions'));
  }, []);

  // Tipp-Stufe, Zeichenfeld und Label bei neuer Aufgabe zurücksetzen
  useEffect(() => {
    setTippStufe(0);
    setZeichenfeldOpen(false);
    setCurrentLabel('');
  }, [currentAufgabe]);

  const handleTeilaufgabeChange = useCallback((label: string) => {
    setCurrentLabel(label);
  }, []);

  // Tipps fuer aktuelle Teilaufgabe filtern (entfernt Labels anderer Teilaufgaben)
  const filteredTipps = useMemo(() => {
    if (!currentAufgabe.tipps || !currentLabel) return currentAufgabe.tipps;
    return currentAufgabe.tipps.map((t) => filterTippForLabel(t, currentLabel));
  }, [currentAufgabe.tipps, currentLabel]);

  // Counts for filter badges (ohne deaktivierte)
  const stageId = aufgabe.bankAufgabe.stageId;
  const excludeIds = deaktiviert;
  const counts = {
    gelb: aufgabenPool.getCount({ stageId, schwierigkeit: 'gelb', excludeIds }),
    grün: aufgabenPool.getCount({ stageId, schwierigkeit: 'grün', excludeIds }),
    orange: aufgabenPool.getCount({ stageId, schwierigkeit: 'orange', excludeIds }),
  };

  useEffect(() => {
    startTime.current = Date.now();
  }, [currentAufgabe]);

  // Bei Filter-Wechsel sofort passende Aufgabe laden
  function handleFilterChange(s: Schwierigkeit | null) {
    setSchwierigkeit(s);
    const filter = { stageId, excludeIds, ...(s ? { schwierigkeit: s } : {}) };
    const next = aufgabenPool.getRandom(filter);
    if (next) {
      setCurrentAufgabe(next);
    }
  }

  function handleRichtig() {
    const dauerMs = Date.now() - startTime.current;
    onAntwort('richtig', true, dauerMs);
  }

  function handleFalsch() {
    const dauerMs = Date.now() - startTime.current;
    onAntwort('falsch', false, dauerMs);
  }

  // Buch-Original-Stages: sequentielle Reihenfolge statt Zufall
  const isSequential = stageId.endsWith('-original');

  function handleNaechste() {
    const filter = { stageId, excludeIds, ...(schwierigkeit ? { schwierigkeit } : {}) };
    const next = isSequential
      ? aufgabenPool.getNext(filter, currentAufgabe._poolId)
      : aufgabenPool.getRandom(filter);
    if (next && next.titel !== currentAufgabe.titel) {
      setCurrentAufgabe(next);
    } else {
      onNaechste();
    }
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Schwierigkeitsfilter */}
      <SchwierigkeitsFilter aktiv={schwierigkeit} onChange={handleFilterChange} counts={counts} />

      {/* ?-Button + Tipp-Glühbirne via Portal in den Header */}
      {headerActionsEl &&
        createPortal(
          <>
            {(currentAufgabe.didaktischerHinweis || currentAufgabe.erklaerungBild || currentAufgabe.merkkasten) && (
              <button
                onClick={() => setErklaerungOpen(!erklaerungOpen)}
                className={`shrink-0 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30 ${
                  erklaerungOpen
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-muted hover:text-primary hover:border-primary'
                }`}
                aria-label={erklaerungOpen ? 'Erklärung schließen' : 'Was lernst du hier?'}
              >
                ?
              </button>
            )}
            {currentAufgabe.tipps && tippStufe === 0 && (
              <TippButton onAdvance={() => setTippStufe(1)} />
            )}
            <button
              onClick={() => setZeichenfeldOpen(!zeichenfeldOpen)}
              className={`shrink-0 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30 ${
                zeichenfeldOpen
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-muted hover:text-primary hover:border-primary'
              }`}
              aria-label={zeichenfeldOpen ? 'Zeichenfeld schließen' : 'Zeichenfeld öffnen'}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>,
          headerActionsEl,
        )}

      {/* Aufgaben-Titel */}
      <Card className="py-2">
        <p className="text-xs font-semibold text-primary">{currentAufgabe.thema}</p>
        <p className="text-sm font-bold text-heading">{currentAufgabe.titel}</p>
      </Card>

      {/* Erklärung (aufklappbar) */}
      {erklaerungOpen && (currentAufgabe.didaktischerHinweis || currentAufgabe.erklaerungBild || currentAufgabe.merkkasten) && (
        <Card className="bg-primary-light border-primary/20">
          <p className="text-xs font-bold text-primary uppercase tracking-wide">Was lernst du hier?</p>
          {currentAufgabe.merkkasten ? (
            <MerkkastenCard daten={currentAufgabe.merkkasten} className="mt-2" />
          ) : currentAufgabe.erklaerungBild?.includes('merkkasten-brueche') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <BruchMerkkasten />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('merkkasten-kreis-radius') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <KreisMerkkasten />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('pascalsches-dreieck') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <PascalDreieck />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('taschenrechner-tasten') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <TaschenrechnerTasten />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('millionenwuerfel') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <MillionenWuerfel />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('multiplikation-zerlegung') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <MultiplikationZerlegung />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('skizze-intro') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <SkizzeMerkkasten />
            </div>
          ) : currentAufgabe.erklaerungBild ? (
            <img
              src={`/${currentAufgabe.erklaerungBild}`}
              alt="Erklärung aus dem Buch"
              className="mt-2 rounded-lg border border-border max-w-full"
              loading="lazy"
            />
          ) : null}
          {currentAufgabe.didaktischerHinweis && (
            <p className="text-sm text-body mt-2">{currentAufgabe.didaktischerHinweis}</p>
          )}
        </Card>
      )}

      {/* Zeichenfeld (Schmierzettel) */}
      {zeichenfeldOpen && (
        <Zeichenfeld
          key={currentAufgabe.titel}
          onClose={() => setZeichenfeldOpen(false)}
        />
      )}

      {/* Aufgabenbild (direkt sichtbar, z.B. Kreismuster) */}
      {currentAufgabe.themenIntroBild?.includes('merkkasten-kreis-radius') ? (
        <Card className="py-2 px-3">
          <KreisMerkkasten />
        </Card>
      ) : currentAufgabe.themenIntroBild && (
        <Card>
          <img
            src={`/${currentAufgabe.themenIntroBild}`}
            alt="Aufgabenbild"
            className="rounded-lg max-w-[280px] mx-auto"
            loading="lazy"
          />
        </Card>
      )}

      {/* Interaktionstyp-View */}
      <AufgabeWrapper
        aufgabe={currentAufgabe}
        onRichtig={handleRichtig}
        onFalsch={handleFalsch}
        onTeilaufgabeChange={handleTeilaufgabeChange}
      />

      {/* Tipp-Inhalte (unter der Aufgabe, wenn aufgedeckt) — gefiltert fuer aktuelle Teilaufgabe */}
      <TippInhalte
        tipps={filteredTipps ?? null}
        tippBilder={currentAufgabe.tippBilder}
        stufe={tippStufe}
        onAdvance={() => setTippStufe((s) => Math.min(s + 1, 4))}
      />

      {/* Nächste */}
      <button
        onClick={handleNaechste}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold min-h-[44px] cursor-pointer hover:bg-primary-hover transition-colors"
      >
        Nächste Aufgabe →
      </button>
    </div>
  );
}

/** Kapitel-Farben-Mapping. */
const kapitelFarben: Record<string, StageFarbe> = {
  '01': 'sky', '02': 'sky', '03': 'amber', '04': 'indigo',
  '05': 'amber', '06': 'emerald', '07': 'purple', '08': 'amber',
  '09': 'emerald', '10': 'indigo', '11': 'emerald', '12': 'indigo',
  '13': 'purple', '14': 'rose',
};

/**
 * Factory: erstellt eine Stage<BankStageAufgabe> aus Pool-Filtern.
 * Wird dynamisch aufgerufen nachdem der Pool geladen ist.
 */
export function createBankStage(
  stageId: string,
  titel: string,
  sub: string,
  icon: string,
  kapitel: string,
): Stage<BankStageAufgabe> {
  const kap = kapitel.split('-')[0] || '01';
  const farbe = kapitelFarben[kap] || 'sky';
  const count = aufgabenPool.getCount({ stageId });

  return {
    id: `bank-${stageId}`,
    titel,
    sub: `${sub} (${count} Aufgaben)`,
    icon,
    farbe,
    zielRichtige: Math.min(5, count),
    generator: () => {
      // Original-Stages (sequentiell) starten bei der ersten Aufgabe
      const isSeq = stageId.endsWith('-original');
      const bankAufgabe = isSeq
        ? aufgabenPool.getAll({ stageId })[0] ?? null
        : aufgabenPool.getRandom({ stageId });
      if (!bankAufgabe) {
        throw new Error(`Keine Aufgaben für stageId: ${stageId}`);
      }
      return {
        id: `bank-${stageId}-${Date.now()}`,
        erzeugtAm: Date.now(),
        bankAufgabe,
      };
    },
    validator: () => true, // Validation happens in the View
    View: BankStageView,
  } as Stage<BankStageAufgabe>;
}
