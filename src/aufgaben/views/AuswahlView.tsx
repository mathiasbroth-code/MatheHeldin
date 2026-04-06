import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { AuswahlDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';

/**
 * Auswahl-View: Multiple-Choice mit tappbaren Optionen.
 * Liest aufgabe.parsed (AuswahlDaten) — kein eigenes Parsing.
 */
export function AuswahlView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as AuswahlDaten;
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  useEffect(() => {
    setSelected(null);
    setStatus('idle');
  }, [aufgabe.titel]);

  function handleSelect(idx: number) {
    if (status !== 'idle') return;
    setSelected(idx);

    if (idx === daten.richtigeIdx) {
      setStatus('richtig');
      onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <MarkdownText text={daten.frageText} className="text-base text-heading font-semibold leading-relaxed" />
      </Card>

      <div className="grid gap-2">
        {daten.optionen.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === daten.richtigeIdx;
          const showResult = status !== 'idle';

          let bg = 'bg-card border-border hover:border-primary/40';
          if (showResult && isCorrect) bg = 'bg-success-bg border-success/40';
          else if (showResult && isSelected && !isCorrect) bg = 'bg-warning-bg border-warning/40';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={status !== 'idle'}
              className={`w-full text-left p-3 rounded-xl border-2 min-h-[44px] transition-colors cursor-pointer disabled:cursor-default ${bg}`}
            >
              <span className="font-bold text-muted mr-2">
                {opt.label})
              </span>
              <span className="text-body">{opt.text}</span>
            </button>
          );
        })}
      </div>

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      />
    </div>
  );
}
