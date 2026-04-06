import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Wahr-Falsch-View: Aussage beurteilen mit zwei großen Buttons.
 */
export function WahrFalschView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const richtig = aufgabe.loesung.toLowerCase().includes('stimmt') &&
    !aufgabe.loesung.toLowerCase().includes('stimmt nicht');
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setAnswered(false);
    setCorrect(false);
  }, [aufgabe.titel]);

  function handleAnswer(wahr: boolean) {
    if (answered) return;
    setAnswered(true);
    const isCorrect = wahr === richtig;
    setCorrect(isCorrect);
    if (isCorrect) onRichtig();
    else onFalsch();
  }

  return (
    <div className="space-y-3">
      <Card>
        <p className="text-sm text-body whitespace-pre-line">{aufgabe.aufgabenstellung}</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className={`p-4 rounded-xl border-2 min-h-[60px] font-bold text-lg transition-colors cursor-pointer disabled:cursor-default ${
            answered && richtig
              ? 'bg-success-bg border-success/40 text-success'
              : answered && !richtig
                ? 'bg-card border-border text-muted'
                : 'bg-card border-border hover:border-success/40 hover:text-success text-heading'
          }`}
        >
          ✓ Stimmt
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className={`p-4 rounded-xl border-2 min-h-[60px] font-bold text-lg transition-colors cursor-pointer disabled:cursor-default ${
            answered && !richtig
              ? 'bg-success-bg border-success/40 text-success'
              : answered && richtig
                ? 'bg-card border-border text-muted'
                : 'bg-card border-border hover:border-warning/40 hover:text-warning text-heading'
          }`}
        >
          ✗ Stimmt nicht
        </button>
      </div>

      <FeedbackBanner
        typ={!answered ? null : correct ? 'richtig' : 'falsch'}
        hinweis={aufgabe.tipps[0]}
      >
        {answered && <span className="text-xs">{aufgabe.loesung.split('\n')[0]}</span>}
      </FeedbackBanner>
    </div>
  );
}
