import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { ReihenfolgeDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';

/**
 * Reihenfolge-View: Items durch Antippen in die richtige Reihenfolge bringen.
 * Liest aufgabe.parsed (ReihenfolgeDaten) — kein eigenes Parsing.
 */
export function ReihenfolgeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as ReihenfolgeDaten;
  const [currentSubIdx, setCurrentSubIdx] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  const currentTask = daten.teilaufgaben[currentSubIdx];
  const isLastSub = currentSubIdx >= daten.teilaufgaben.length - 1;

  useEffect(() => {
    setCurrentSubIdx(0);
    setPlaced([]);
    setRemaining(shuffle(daten.teilaufgaben[0].items));
    setStatus('idle');
  }, [aufgabe.titel]);

  useEffect(() => {
    setPlaced([]);
    setRemaining(shuffle(currentTask.items));
    setStatus('idle');
  }, [currentSubIdx]);

  function handleTap(item: string) {
    if (status !== 'idle') return;

    const newPlaced = [...placed, item];
    setPlaced(newPlaced);
    setRemaining((prev) => prev.filter((r) => r !== item));

    // Check when all placed
    if (newPlaced.length === currentTask.items.length) {
      const isCorrect = newPlaced.every((p, i) => p === currentTask.richtigeReihenfolge[i]);
      setStatus(isCorrect ? 'richtig' : 'falsch');
      if (isCorrect && isLastSub) onRichtig();
      else if (!isCorrect) onFalsch();
    }
  }

  function reset() {
    setPlaced([]);
    setRemaining(shuffle(currentTask.items));
    setStatus('idle');
  }

  function nextSub() {
    if (!isLastSub) {
      setCurrentSubIdx((i) => i + 1);
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <MarkdownText text={daten.anweisung} />
      </Card>

      {/* Platzierte Items */}
      {placed.length > 0 && (
        <Card className="bg-primary-light/30 border-primary/10">
          <p className="text-xs font-semibold text-primary mb-2">Deine Reihenfolge:</p>
          <div className="flex flex-wrap gap-2">
            {placed.map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-sm font-bold text-primary tabular-nums">
                {i + 1}. {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Verbleibende Items */}
      {remaining.length > 0 && status === 'idle' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {remaining.map((item) => (
            <button
              key={item}
              onClick={() => handleTap(item)}
              className="px-4 py-3 rounded-xl bg-card border-2 border-border hover:border-primary/40 font-bold text-heading tabular-nums min-h-[44px] cursor-pointer transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {daten.teilaufgaben.length > 1 && (
        <p className="text-xs text-muted text-center">
          Teilaufgabe {currentSubIdx + 1} von {daten.teilaufgaben.length}
        </p>
      )}

      <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]}>
        {status === 'richtig' && <span className="text-xs">{currentTask.richtigeReihenfolge.join(' → ')}</span>}
      </FeedbackBanner>

      {status === 'falsch' && (
        <Button variant="secondary" className="w-full" onClick={reset}>
          Nochmal versuchen
        </Button>
      )}

      {status === 'richtig' && !isLastSub && (
        <Button className="w-full" onClick={nextSub}>Weiter →</Button>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
