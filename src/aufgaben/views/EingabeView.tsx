import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Eingabe-View: Aufgabenstellung anzeigen, Zahleneingabe.
 * Parst Teilaufgaben (a, b, c, ...) aus der Aufgabenstellung.
 */
export function EingabeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const items = parseItems(aufgabe.aufgabenstellung, aufgabe.loesung);
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

  return (
    <div className="space-y-3">
      <Card>
        <p className="text-sm text-body whitespace-pre-line">{current.frage}</p>
      </Card>

      <Card>
        <Input
          ref={inputRef}
          sizing="xl"
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="Deine Antwort"
          disabled={status === 'richtig'}
        />
      </Card>

      {items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Teilaufgabe {currentIdx + 1} von {items.length}
        </p>
      )}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      >
        {status === 'richtig' && <span>{current.antwort}</span>}
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

function parseItems(aufgabenstellung: string, loesung: string): { frage: string; antwort: string }[] {
  const fragenParts = aufgabenstellung.split(/^[a-z]\)\s*/m).filter(Boolean);
  const loesungParts = loesung.split(/^[a-z]\)\s*/m).filter(Boolean);

  if (fragenParts.length > 1 && loesungParts.length >= fragenParts.length) {
    return fragenParts.map((f, i) => ({
      frage: `${String.fromCharCode(97 + i)}) ${f.trim()}`,
      antwort: loesungParts[i]?.trim().split('\n')[0] || '',
    }));
  }

  // Fallback: single item
  return [{ frage: aufgabenstellung, antwort: loesung.split('\n')[0].trim() }];
}
