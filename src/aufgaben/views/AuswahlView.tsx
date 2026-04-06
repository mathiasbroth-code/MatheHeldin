import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Auswahl-View: Multiple-Choice mit tappbaren Optionen.
 * Parst Optionen (A/B/C/D) aus der Aufgabenstellung.
 */
export function AuswahlView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const { frageText, optionen, richtigeIdx } = parseAuswahl(aufgabe.aufgabenstellung, aufgabe.loesung);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  useEffect(() => {
    setSelected(null);
    setStatus('idle');
  }, [aufgabe.titel]);

  function handleSelect(idx: number) {
    if (status !== 'idle') return;
    setSelected(idx);

    if (idx === richtigeIdx) {
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
        <p className="text-sm text-body whitespace-pre-line">{frageText}</p>
      </Card>

      <div className="grid gap-2">
        {optionen.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === richtigeIdx;
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
                {String.fromCharCode(65 + i)})
              </span>
              <span className="text-body">{opt}</span>
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

function parseAuswahl(aufgabenstellung: string, loesung: string) {
  // Extract options: lines starting with A) B) C) D)
  const optionMatches = aufgabenstellung.match(/^[A-D]\)\s*.+$/gm) || [];
  const optionen = optionMatches.map((m) => m.replace(/^[A-D]\)\s*/, '').trim());

  // Text before options
  const frageText = aufgabenstellung.split(/^[A-D]\)/m)[0].trim();

  // Find correct answer from loesung (look for A/B/C/D)
  const answerMatch = loesung.match(/^([A-D])\b/m);
  const richtigeIdx = answerMatch ? answerMatch[1].charCodeAt(0) - 65 : 0;

  // Fallback: if no A/B/C options found, split by newlines
  if (optionen.length < 2) {
    const lines = aufgabenstellung.split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      frageText: lines[0] || aufgabenstellung,
      optionen: lines.slice(1).length >= 2 ? lines.slice(1) : ['Ja', 'Nein'],
      richtigeIdx: 0,
    };
  }

  return { frageText, optionen, richtigeIdx };
}
