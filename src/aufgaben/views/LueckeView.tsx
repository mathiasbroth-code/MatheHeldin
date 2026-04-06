import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Lücke-View: Gleichungen mit ▢-Platzhaltern, Inline-Eingabefelder.
 */
export function LueckeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const items = parseLuecken(aufgabe.aufgabenstellung, aufgabe.loesung);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = items[currentIdx];
  const isLast = currentIdx >= items.length - 1;

  useEffect(() => {
    setCurrentIdx(0);
    setInput('');
    setStatus('idle');
  }, [aufgabe.titel]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIdx]);

  function check() {
    const normalized = input.replace(/\./g, '').replace(',', '.').trim();
    const expected = current.antwort.replace(/\./g, '').replace(',', '.').trim();
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

  // Replace ▢ with visual input indicator
  const displayText = current.frage.replace(/▢/g, '___');

  return (
    <div className="space-y-3">
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

      {items.length > 1 && (
        <p className="text-xs text-muted text-center">Lücke {currentIdx + 1} von {items.length}</p>
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

function parseLuecken(aufgabenstellung: string, loesung: string) {
  const parts = aufgabenstellung.split(/^[a-z]\)\s*/m).filter(Boolean);
  const loesungParts = loesung.split(/^[a-z]\)\s*/m).filter(Boolean);

  if (parts.length > 1) {
    return parts.map((f, i) => ({
      frage: `${String.fromCharCode(97 + i)}) ${f.trim()}`,
      antwort: loesungParts[i]?.trim().split('\n')[0] || '',
    }));
  }

  return [{ frage: aufgabenstellung, antwort: loesung.split('\n')[0].trim() }];
}
