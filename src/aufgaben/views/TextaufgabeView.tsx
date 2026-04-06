import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Textaufgabe-View: Kontext-Text oben, Frage(n) unten mit Eingabefeldern.
 * Ähnlich wie Eingabe, aber mit prominentem Textblock.
 */
export function TextaufgabeView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const items = parseTextaufgabe(aufgabe.aufgabenstellung, aufgabe.loesung);
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
    const normalized = input.replace(/\./g, '').replace(',', '.').trim().toLowerCase();
    const expected = current.antwort.replace(/\./g, '').replace(',', '.').trim().toLowerCase();

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
      <Card className="bg-primary-light/50 border-primary/10">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Sachaufgabe</p>
        <p className="text-sm text-body whitespace-pre-line leading-relaxed">{current.kontext}</p>
      </Card>

      {/* Frage */}
      {current.frage && (
        <Card>
          <p className="text-sm font-semibold text-heading">{current.frage}</p>
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

      {items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Frage {currentIdx + 1} von {items.length}
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

function parseTextaufgabe(aufgabenstellung: string, loesung: string) {
  // Split at a)/b)/c) boundaries
  const parts = aufgabenstellung.split(/^[a-z]\)\s*/m);
  const loesungParts = loesung.split(/^[a-z]\)\s*/m);

  if (parts.length > 1) {
    const kontext = parts[0].trim();
    return parts.slice(1).map((f, i) => ({
      kontext,
      frage: `${String.fromCharCode(97 + i)}) ${f.trim()}`,
      antwort: loesungParts[i + 1]?.trim().split('\n')[0] || loesungParts[0]?.trim().split('\n')[0] || '',
    }));
  }

  return [{ kontext: aufgabenstellung, frage: '', antwort: loesung.split('\n')[0].trim() }];
}
