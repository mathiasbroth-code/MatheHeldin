import { useState, useRef, useEffect } from 'react';
import type { Aufgabe, StageProps } from '@/stages/types';
import { fmt, digits } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { BlockDisplay } from '@/components/dienes';

/** Aufgaben-Typ für alle Lesen-Stages. */
export interface LesenAufgabe extends Aufgabe {
  readonly target: number;
}

type Status = 'idle' | 'richtig' | 'falsch';

export function ZahlLesenView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<LesenAufgabe>) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const startTime = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const d = digits(aufgabe.target);

  // Reset on new task
  useEffect(() => {
    setInput('');
    setStatus('idle');
    startTime.current = Date.now();
    inputRef.current?.focus();
  }, [aufgabe.id]);

  function handlePruefen() {
    const n = parseInt(input.replace(/\./g, ''), 10);
    if (isNaN(n)) return;

    const dauerMs = Date.now() - startTime.current;
    const richtig = n === aufgabe.target;

    setStatus(richtig ? 'richtig' : 'falsch');
    onAntwort(input, richtig, dauerMs);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && status === 'idle') {
      handlePruefen();
    }
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Aufgabe: Blöcke anzeigen */}
      <Card>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Welche Zahl ist das?
        </p>
        <div className="mt-3">
          <BlockDisplay T={d.T} H={d.H} Z={d.Z} E={d.E} />
        </div>
      </Card>

      {/* Eingabe */}
      <Card>
        <Input
          ref={inputRef}
          sizing="xl"
          inputMode="numeric"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (status === 'falsch') setStatus('idle');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Deine Antwort"
          disabled={status === 'richtig'}
        />
      </Card>

      {/* Feedback */}
      <FeedbackBanner
        typ={status === 'idle' ? null : status === 'richtig' ? 'richtig' : 'falsch'}
        hinweis="Zähle jede Gruppe einzeln: Tausender, Hunderter, Zehner, Einer."
      >
        {status === 'richtig' && (
          <span className="tabular-nums">
            Die Zahl ist {fmt(aufgabe.target)}.
          </span>
        )}
      </FeedbackBanner>

      {/* Aktionsleiste */}
      <div className="flex gap-2">
        {status !== 'richtig' ? (
          <Button className="flex-1" onClick={handlePruefen}>
            Prüfen
          </Button>
        ) : (
          <Button className="flex-1" onClick={onNaechste}>
            Nächste →
          </Button>
        )}
      </div>
    </div>
  );
}
