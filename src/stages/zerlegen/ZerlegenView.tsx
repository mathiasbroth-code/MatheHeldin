import { useState, useRef, useEffect } from 'react';
import type { StageProps } from '@/stages/types';
import type { ZerlegenAufgabe } from './generator';
import { fmt, digits } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

type PlaceKey = 'T' | 'H' | 'Z' | 'E';
type Status = 'idle' | 'richtig' | 'falsch';

const placeKeys: PlaceKey[] = ['T', 'H', 'Z', 'E'];

export function ZerlegenView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<ZerlegenAufgabe>) {
  const [inputs, setInputs] = useState<Record<PlaceKey, string>>({ T: '', H: '', Z: '', E: '' });
  const [status, setStatus] = useState<Status>('idle');
  const startTime = useRef(Date.now());

  const d = digits(aufgabe.target);

  useEffect(() => {
    setInputs({ T: '', H: '', Z: '', E: '' });
    setStatus('idle');
    startTime.current = Date.now();
  }, [aufgabe.id]);

  function updateInput(k: PlaceKey, value: string) {
    setInputs((prev) => ({ ...prev, [k]: value }));
    if (status === 'falsch') setStatus('idle');
  }

  function handlePruefen() {
    const richtig =
      Number(inputs.T || 0) === d.T &&
      Number(inputs.H || 0) === d.H &&
      Number(inputs.Z || 0) === d.Z &&
      Number(inputs.E || 0) === d.E;

    const dauerMs = Date.now() - startTime.current;
    setStatus(richtig ? 'richtig' : 'falsch');
    onAntwort(`${inputs.T},${inputs.H},${inputs.Z},${inputs.E}`, richtig, dauerMs);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && status === 'idle') {
      handlePruefen();
    }
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Zielzahl */}
      <Card>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Zerlege die Zahl
        </p>
        <p className="text-5xl font-bold text-heading tabular-nums mt-1">
          {fmt(aufgabe.target)}
        </p>
      </Card>

      {/* T/H/Z/E Inputs */}
      <Card>
        <div className="grid grid-cols-4 gap-2 text-center">
          {placeKeys.map((k) => (
            <div key={k}>
              <p className="text-sm font-bold text-muted">{k}</p>
              <Input
                inputMode="numeric"
                value={inputs[k]}
                onChange={(e) => updateInput(k, e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === 'richtig'}
                className="mt-1 text-center text-2xl"
              />
            </div>
          ))}
        </div>
        <p className="text-center mt-3 text-xs text-muted">
          T = Tausender · H = Hunderter · Z = Zehner · E = Einer
        </p>
      </Card>

      {/* Feedback */}
      <FeedbackBanner
        typ={status === 'idle' ? null : status === 'richtig' ? 'richtig' : 'falsch'}
        hinweis="Schau Ziffer für Ziffer: die erste Ziffer sind die Tausender, dann Hunderter, Zehner, Einer."
      >
        {status === 'richtig' && (
          <span className="tabular-nums">
            {fmt(aufgabe.target)} = {d.T} T + {d.H} H + {d.Z} Z + {d.E} E
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
