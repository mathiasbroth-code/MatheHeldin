import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Schritt-View: Mehrstufige Rechnung, ein Schritt nach dem anderen.
 * Parst Teilaufgaben aus Aufgabenstellung und Lösung.
 */
export function SchrittView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const items = parseSchritte(aufgabe.aufgabenstellung, aufgabe.loesung);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const [completed, setCompleted] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = items[currentIdx];
  const isLast = currentIdx >= items.length - 1;

  useEffect(() => {
    setCurrentIdx(0);
    setInput('');
    setStatus('idle');
    setCompleted([]);
  }, [aufgabe.titel]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIdx]);

  function check() {
    const normalized = input.replace(/\./g, '').replace(',', '.').trim();
    const expected = current.antwort.replace(/\./g, '').replace(',', '.').trim();

    if (normalized === expected) {
      setStatus('richtig');
      setCompleted((prev) => [...prev, `${current.frage} = ${current.antwort}`]);
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

  return (
    <div className="space-y-3">
      <Card>
        <p className="text-sm text-body whitespace-pre-line">{aufgabe.aufgabenstellung.split(/^[a-z]\)/m)[0].trim()}</p>
      </Card>

      {/* Erledigte Schritte */}
      {completed.length > 0 && (
        <Card className="bg-success-bg/50 border-success/10">
          {completed.map((c, i) => (
            <p key={i} className="text-xs text-success tabular-nums">✓ {c}</p>
          ))}
        </Card>
      )}

      {/* Aktueller Schritt */}
      <Card className="border-primary/20">
        <p className="text-xs font-semibold text-primary mb-1">
          Schritt {currentIdx + 1} von {items.length}
        </p>
        <p className="text-base font-bold text-heading tabular-nums">{current.frage}</p>
      </Card>

      <Card>
        <input
          ref={inputRef}
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="= ?"
          disabled={status === 'richtig'}
          className="w-full text-3xl font-bold tabular-nums text-center border-2 border-border rounded-xl py-3 focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white min-h-[56px] disabled:opacity-50"
        />
      </Card>

      <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]}>
        {status === 'richtig' && <span className="tabular-nums">{current.antwort}</span>}
      </FeedbackBanner>

      <div className="flex gap-2">
        {status !== 'richtig' ? (
          <Button className="flex-1" onClick={check}>Prüfen</Button>
        ) : !isLast ? (
          <Button className="flex-1" onClick={next}>Nächster Schritt →</Button>
        ) : null}
      </div>
    </div>
  );
}

function parseSchritte(aufgabenstellung: string, loesung: string) {
  const parts = aufgabenstellung.split(/^[a-z]\)\s*/m).filter(Boolean);
  const loesungParts = loesung.split(/^[a-z]\)\s*/m).filter(Boolean);

  if (parts.length > 1) {
    return parts.slice(0).map((f, i) => ({
      frage: f.trim().split('\n')[0],
      antwort: loesungParts[i]?.trim().split('\n')[0] || '',
    }));
  }

  // Fallback: single step
  return [{ frage: aufgabenstellung.trim(), antwort: loesung.split('\n')[0].trim() }];
}
