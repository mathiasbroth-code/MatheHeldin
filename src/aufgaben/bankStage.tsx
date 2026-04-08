import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Aufgabe, StageProps, Stage, StageFarbe } from '@/stages/types';
import type { BankAufgabe } from './types';
import { aufgabenPool } from './pool';
import { AufgabeWrapper } from './views/AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { TippInhalte } from '@/components/ui/TippSystem';
import { Zeichenfeld } from '@/components/ui/Zeichenfeld';
import { MerkkastenCard } from '@/components/ui/MerkkastenCard';
import { BruchMerkkasten } from '@/components/ui/BruchKreis';
import { KreisMerkkasten } from '@/components/geometrie/KreisMerkkasten';
import { PascalDreieck } from '@/components/forscherkiste/PascalDreieck';
import { TaschenrechnerTasten } from '@/components/forscherkiste/TaschenrechnerTasten';
import { MillionenWuerfel } from '@/components/dienes/MillionenWuerfel';
import { MultiplikationZerlegung } from '@/components/ui/MultiplikationZerlegung';
import { SkizzeMerkkasten } from '@/components/ui/SkizzeMerkkasten';
import { TeilbarkeitMerkkasten4, QuersummeMerkkasten9, TeilbarkeitMerkkasten3 } from '@/components/teilbarkeit/TeilbarkeitMerkkasten';
import { filterTippForLabel } from './parserHelpers';
import { useDeaktivierteAufgaben } from '@/stores/deaktivierteAufgabenStore';
import { useAdaptiv } from '@/hooks/useAdaptiv';

/** Aufgabe aus der Bank — wraps a BankAufgabe for the Stage system. */
export interface BankStageAufgabe extends Aufgabe {
  readonly bankAufgabe: BankAufgabe;
}


/** View-Komponente für Bank-Stages. */
function BankStageView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<BankStageAufgabe>) {
  const { schwierigkeitDefault } = useAdaptiv();
  const schwierigkeit = schwierigkeitDefault(aufgabe.bankAufgabe.stageId);
  const startTime = useRef(Date.now());
  // Aufgabe stabilisieren: bei HMR-Reloads bleibt die gleiche Aufgabe (via sessionStorage)
  const hmrKey = `hmr-aufgabe-${aufgabe.bankAufgabe.stageId}`;
  const [currentAufgabe, setCurrentAufgabeRaw] = useState<BankAufgabe>(() => {
    try {
      const saved = sessionStorage.getItem(hmrKey);
      if (saved) {
        const poolId = JSON.parse(saved) as string;
        const found = aufgabenPool.getAll({ stageId: aufgabe.bankAufgabe.stageId }).find((a) => a._poolId === poolId);
        if (found) return found;
      }
    } catch { /* ignore */ }
    // Nix gespeichert → Default speichern
    try { sessionStorage.setItem(hmrKey, JSON.stringify(aufgabe.bankAufgabe._poolId)); } catch { /* ignore */ }
    return aufgabe.bankAufgabe;
  });
  const setCurrentAufgabe = useCallback((a: BankAufgabe) => {
    try { sessionStorage.setItem(hmrKey, JSON.stringify(a._poolId)); } catch { /* ignore */ }
    setCurrentAufgabeRaw(a);
  }, [hmrKey]);
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
  useEffect(() => {
    startTime.current = Date.now();
  }, [currentAufgabe]);

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
      {/* Schwierigkeits-Indikator (farbiger Punkt statt Filter-Buttons) — wird nicht bei Buch-Original-Stages angezeigt */}

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
            {currentAufgabe.tipps && (
              <button
                onClick={() => tippStufe === 0 ? setTippStufe(1) : setTippStufe((s) => Math.min(s + 1, 4))}
                className={`shrink-0 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30 ${
                  currentAufgabe.schwierigkeit === 'gelb' ? 'bg-yellow-200 text-yellow-700 border-2 border-yellow-300'
                  : currentAufgabe.schwierigkeit === 'grün' ? 'bg-emerald-200 text-emerald-700 border-2 border-emerald-300'
                  : currentAufgabe.schwierigkeit === 'orange' ? 'bg-orange-200 text-orange-700 border-2 border-orange-300'
                  : 'bg-card text-primary border-2 border-primary'
                }`}
                aria-label="Tipp anzeigen"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C4.7 1 2 3.7 2 7c0 2 1 3.8 2.5 4.8V13a1 1 0 001 1h5a1 1 0 001-1v-1.2C13 10.8 14 9 14 7c0-3.3-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
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
          ) : currentAufgabe.erklaerungBild?.includes('merkkasten-teilbar-4') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <TeilbarkeitMerkkasten4 />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('merkkasten-quersumme-9') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <QuersummeMerkkasten9 />
            </div>
          ) : currentAufgabe.erklaerungBild?.includes('merkkasten-teilbar-3') ? (
            <div className="mt-2 p-3 rounded-lg border border-border bg-card">
              <TeilbarkeitMerkkasten3 />
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
