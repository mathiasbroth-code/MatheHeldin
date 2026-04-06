import { useState, useRef, useEffect } from 'react';
import type { StageProps } from '@/stages/types';
import type { BuendelnAufgabe } from './generator';
import { digits } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { Einer } from '@/components/dienes';

type Status = 'idle' | 'richtig' | 'falsch';

export function BuendelnView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<BuendelnAufgabe>) {
  const [inputZ, setInputZ] = useState('');
  const [inputE, setInputE] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const startTime = useRef(Date.now());

  const d = digits(aufgabe.target);

  useEffect(() => {
    setInputZ('');
    setInputE('');
    setStatus('idle');
    startTime.current = Date.now();
  }, [aufgabe.id]);

  function handlePruefen() {
    const z = parseInt(inputZ, 10);
    const e = parseInt(inputE, 10);
    if (isNaN(z) || isNaN(e)) return;

    const dauerMs = Date.now() - startTime.current;
    const richtig = z === d.Z && e === d.E;

    setStatus(richtig ? 'richtig' : 'falsch');
    onAntwort(`${inputZ},${inputE}`, richtig, dauerMs);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && status === 'idle') {
      handlePruefen();
    }
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Einer-Grid */}
      <Card>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Hier sind {aufgabe.target} Einer-Würfel
        </p>
        <div className="mt-3 grid grid-cols-10 gap-1">
          {Array.from({ length: aufgabe.target }, (_, i) => (
            <Einer key={i} />
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Bündel je 10 zu einem Zehner. Wie viele Zehner und wie viele Einer bleiben?
        </p>
      </Card>

      {/* Eingabe */}
      <Card>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-sm font-bold text-muted">Zehner</p>
            <Input
              sizing="xl"
              inputMode="numeric"
              value={inputZ}
              onChange={(e) => {
                setInputZ(e.target.value);
                if (status === 'falsch') setStatus('idle');
              }}
              disabled={status === 'richtig'}
              className="mt-1"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-muted">Einer</p>
            <Input
              sizing="xl"
              inputMode="numeric"
              value={inputE}
              onChange={(e) => {
                setInputE(e.target.value);
                if (status === 'falsch') setStatus('idle');
              }}
              onKeyDown={handleKeyDown}
              disabled={status === 'richtig'}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Feedback */}
      <FeedbackBanner
        typ={status === 'idle' ? null : status === 'richtig' ? 'richtig' : 'falsch'}
        hinweis="Zähl nochmal in 10er-Gruppen."
      >
        {status === 'richtig' && (
          <span className="tabular-nums">
            {aufgabe.target} = {d.Z} Zehner + {d.E} Einer
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
