import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { TextaufgabeDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';
import { normalizeZahl } from '../parserHelpers';

/**
 * Textaufgabe-View: Kontext-Text oben, Frage(n) unten mit Eingabefeldern.
 * Liest aufgabe.parsed (TextaufgabeDaten) — kein eigenes Parsing.
 */
export function TextaufgabeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as TextaufgabeDaten;
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
    const normalized = normalizeZahl(input).toLowerCase();
    const expected = normalizeZahl(current.antwort).toLowerCase();

    // Check if the answer contains the expected value
    if (normalized === expected || expected.includes(normalized) || normalized.includes(expected)) {
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
      {/* Kontext-Text */}
      {daten.kontext && (
        <Card className="bg-primary-light/50 border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Sachaufgabe</p>
          <MarkdownText text={daten.kontext} />
        </Card>
      )}

      {/* Frage */}
      {current.frage && (
        <Card>
          <MarkdownText text={current.frage} className="text-base font-semibold text-heading leading-relaxed" />
        </Card>
      )}

      <Card>
        <Input
          ref={inputRef}
          sizing="xl"
          inputMode="decimal"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="Deine Antwort"
          disabled={status === 'richtig'}
        />
      </Card>

      {daten.items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Frage {currentIdx + 1} von {daten.items.length}
        </p>
      )}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      >
        {status === 'richtig' && <span className="text-xs">{current.antwort}</span>}
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
