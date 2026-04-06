import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { WahrFalschDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';

/**
 * Wahr-Falsch-View: Aussage beurteilen mit zwei grossen Buttons.
 * Liest aufgabe.parsed (WahrFalschDaten) — kein eigenes Parsing.
 */
export function WahrFalschView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as WahrFalschDaten;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;

  useEffect(() => {
    setCurrentIdx(0);
    setStatus('idle');
  }, [aufgabe.titel]);

  function handleAnswer(wahr: boolean) {
    if (status !== 'idle') return;
    const isCorrect = wahr === current.richtig;
    setStatus(isCorrect ? 'richtig' : 'falsch');
    if (isCorrect && isLast) onRichtig();
    else if (!isCorrect) onFalsch();
  }

  function next() {
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setStatus('idle');
    }
  }

  return (
    <div className="space-y-3">
      {daten.anweisung && daten.items.length > 1 && (
        <Card>
          <MarkdownText text={daten.anweisung} className="text-sm font-semibold text-heading leading-relaxed" />
        </Card>
      )}

      <Card>
        <MarkdownText text={current.aussage} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAnswer(true)}
          disabled={status !== 'idle'}
          className={`p-4 rounded-xl border-2 min-h-[60px] font-bold text-lg transition-colors cursor-pointer disabled:cursor-default ${
            status !== 'idle' && current.richtig
              ? 'bg-success-bg border-success/40 text-success'
              : status !== 'idle' && !current.richtig
                ? 'bg-card border-border text-muted'
                : 'bg-card border-border hover:border-success/40 hover:text-success text-heading'
          }`}
        >
          ✓ Stimmt
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={status !== 'idle'}
          className={`p-4 rounded-xl border-2 min-h-[60px] font-bold text-lg transition-colors cursor-pointer disabled:cursor-default ${
            status !== 'idle' && !current.richtig
              ? 'bg-success-bg border-success/40 text-success'
              : status !== 'idle' && current.richtig
                ? 'bg-card border-border text-muted'
                : 'bg-card border-border hover:border-warning/40 hover:text-warning text-heading'
          }`}
        >
          ✗ Stimmt nicht
        </button>
      </div>

      {daten.items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Teilaufgabe {currentIdx + 1} von {daten.items.length}
        </p>
      )}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      >
        {status !== 'idle' && <span className="text-xs">{current.erklaerung}</span>}
      </FeedbackBanner>

      {status === 'richtig' && !isLast && (
        <Button className="w-full" onClick={next}>Weiter →</Button>
      )}
    </div>
  );
}
