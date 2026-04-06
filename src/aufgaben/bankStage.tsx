import { useState, useEffect, useRef } from 'react';
import type { Aufgabe, StageProps, Stage, StageFarbe } from '@/stages/types';
import type { BankAufgabe, Schwierigkeit } from './types';
import { aufgabenPool } from './pool';
import { AufgabeWrapper } from './views/AufgabeWrapper';
import { Card } from '@/components/ui/Card';

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
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit | null>(null);
  const startTime = useRef(Date.now());
  const [currentAufgabe, setCurrentAufgabe] = useState(aufgabe.bankAufgabe);

  // Counts for filter badges
  const stageId = aufgabe.bankAufgabe.stageId;
  const counts = {
    gelb: aufgabenPool.getCount({ stageId, schwierigkeit: 'gelb' }),
    grün: aufgabenPool.getCount({ stageId, schwierigkeit: 'grün' }),
    orange: aufgabenPool.getCount({ stageId, schwierigkeit: 'orange' }),
  };

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

  function handleNaechste() {
    // Get next aufgabe from pool with current filter
    const filter = { stageId, ...(schwierigkeit ? { schwierigkeit } : {}) };
    const next = aufgabenPool.getRandom(filter);
    if (next && next.titel !== currentAufgabe.titel) {
      setCurrentAufgabe(next);
    } else {
      onNaechste();
    }
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Schwierigkeitsfilter */}
      <SchwierigkeitsFilter aktiv={schwierigkeit} onChange={setSchwierigkeit} counts={counts} />

      {/* Aufgaben-Titel */}
      <Card className="py-2">
        <p className="text-xs font-semibold text-primary">{currentAufgabe.thema}</p>
        <p className="text-sm font-bold text-heading">{currentAufgabe.titel}</p>
      </Card>

      {/* Interaktionstyp-View */}
      <AufgabeWrapper
        aufgabe={currentAufgabe}
        onRichtig={handleRichtig}
        onFalsch={handleFalsch}
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
      const bankAufgabe = aufgabenPool.getRandom({ stageId });
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
