import { useState, useRef, useEffect } from 'react';
import type { StageProps } from '@/stages/types';
import type { MitteAufgabe } from './generator';
import { fmt } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

type Status = 'idle' | 'richtig' | 'falsch';

export function MitteView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<MitteAufgabe>) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const startTime = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const gap = aufgabe.high - aufgabe.low;
  const halfGap = gap / 2;

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
    const richtig = n === aufgabe.middle;

    setStatus(richtig ? 'richtig' : 'falsch');
    onAntwort(input, richtig, dauerMs);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && status === 'idle') {
      handlePruefen();
    }
  }

  const revealed = status === 'richtig';

  return (
    <div className="space-y-4 mt-2">
      {/* Zahlenstrahl */}
      <Card>
        <p className="text-sm font-semibold text-primary text-center uppercase tracking-wide">
          Welche Zahl liegt genau in der Mitte?
        </p>

        <div className="relative h-28 mt-6 mx-6">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border rounded" />

          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-0.5 h-3 bg-muted/40 -translate-y-1/2"
              style={{ left: `${i * 10}%` }}
            />
          ))}

          {revealed && (
            <>
              <div className="absolute top-1 left-0 w-1/2 flex items-center justify-center">
                <span className="text-xs font-bold text-success bg-success-bg border border-success/30 rounded px-2 py-0.5">
                  {fmt(halfGap)}
                </span>
              </div>
              <div className="absolute top-1 right-0 w-1/2 flex items-center justify-center">
                <span className="text-xs font-bold text-success bg-success-bg border border-success/30 rounded px-2 py-0.5">
                  {fmt(halfGap)}
                </span>
              </div>
            </>
          )}

          <div
            className="absolute top-1/2 flex flex-col items-center"
            style={{ left: 0, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow" />
            <span className="mt-1 text-sm font-bold text-heading tabular-nums whitespace-nowrap">
              {fmt(aufgabe.low)}
            </span>
          </div>

          <div
            className="absolute top-1/2 flex flex-col items-center"
            style={{ right: 0, transform: 'translate(50%, -50%)' }}
          >
            <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow" />
            <span className="mt-1 text-sm font-bold text-heading tabular-nums whitespace-nowrap">
              {fmt(aufgabe.high)}
            </span>
          </div>

          <div
            className="absolute top-1/2 flex flex-col items-center"
            style={{ left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow transition-colors duration-300 ${
                revealed ? 'bg-success' : 'bg-warning animate-pulse'
              }`}
            />
            <span
              className={`mt-1 text-sm font-bold tabular-nums whitespace-nowrap transition-colors duration-300 ${
                revealed ? 'text-success' : 'text-warning'
              }`}
            >
              {revealed ? fmt(aufgabe.middle) : '?'}
            </span>
          </div>
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
        hinweis="Überlege zuerst: Wie groß ist der Abstand zwischen den beiden Zahlen?"
      >
        {status === 'richtig' && (
          <span className="tabular-nums">
            {fmt(aufgabe.low)} + {fmt(halfGap)} = {fmt(aufgabe.middle)}
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
