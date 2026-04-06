import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { LueckeDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { normalizeZahl } from '../parserHelpers';

/**
 * Luecke-View: Gleichungen mit Platzhaltern, Inline-Eingabefelder.
 * Liest aufgabe.parsed (LueckeDaten) — kein eigenes Parsing.
 */
export function LueckeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as LueckeDaten;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;

  useEffect(() => {
    setCurrentIdx(0);
    setInput('');
    setStatus('idle');
  }, [aufgabe.titel]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIdx]);

  function check() {
    const normalized = normalizeZahl(input);
    const expected = normalizeZahl(current.antwort);
    if (normalized === expected) {
      setStatus('richtig');
      if (isLast) onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  function next() {
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setInput('');
      setStatus('idle');
    }
  }

  // Replace special placeholders with visual underscores
  const displayText = current.frage.replace(/▢/g, '___');

  return (
    <div className="space-y-3">
      {daten.anweisung && daten.items.length > 1 && (
        <Card>
          <p className="text-sm font-semibold text-heading leading-relaxed">{daten.anweisung}</p>
        </Card>
      )}
      <Card>
        <p className="text-lg font-bold text-heading tabular-nums whitespace-pre-line">{displayText}</p>
      </Card>

      <Card>
        <p className="text-xs text-muted mb-1">Welche Zahl fehlt?</p>
        <input
          ref={inputRef}
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="▢ = ?"
          disabled={status === 'richtig'}
          className="w-full text-3xl font-bold tabular-nums text-center border-2 border-border rounded-xl py-3 focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white min-h-[56px] disabled:opacity-50"
        />
      </Card>

      {daten.items.length > 1 && (
        <p className="text-xs text-muted text-center">Lücke {currentIdx + 1} von {daten.items.length}</p>
      )}

      <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]}>
        {status === 'richtig' && <span className="tabular-nums">{current.antwort}</span>}
      </FeedbackBanner>

      <div className="flex gap-2">
        {status !== 'richtig' ? (
          <Button className="flex-1" onClick={check}>Prüfen</Button>
        ) : !isLast ? (
          <Button className="flex-1" onClick={next}>Weiter →</Button>
        ) : null}
      </div>
    </div>
  );
}
