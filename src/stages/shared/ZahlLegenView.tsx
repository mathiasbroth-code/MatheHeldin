import { useState, useRef, useEffect } from 'react';
import type { Aufgabe, StageProps } from '@/stages/types';
import { fmt } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { BlockDisplay } from '@/components/dienes';

/** Aufgaben-Typ für alle Legen-Stages. */
export interface LegenAufgabe extends Aufgabe {
  readonly target: number;
}

type PlaceKey = 'T' | 'H' | 'Z' | 'E';

const labels: Record<PlaceKey, string> = {
  T: 'Tausender',
  H: 'Hunderter',
  Z: 'Zehner',
  E: 'Einer',
};

const plusColors: Record<PlaceKey, string> = {
  T: 'bg-amber-500 text-amber-900',
  H: 'bg-amber-400 text-amber-900',
  Z: 'bg-yellow-300 text-yellow-900',
  E: 'bg-yellow-200 text-yellow-900',
};

export function ZahlLegenView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<LegenAufgabe>) {
  const [counts, setCounts] = useState<Record<PlaceKey, number>>({ T: 0, H: 0, Z: 0, E: 0 });
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());

  const current = counts.T * 1000 + counts.H * 100 + counts.Z * 10 + counts.E;

  // Determine which columns to show based on target range
  const useT = aufgabe.target >= 1000;
  const useH = aufgabe.target >= 100;
  const keys: PlaceKey[] = (['T', 'H', 'Z', 'E'] as PlaceKey[]).filter(
    (k) => (k === 'T' ? useT : k === 'H' ? useH : true),
  );

  // Reset on new task
  useEffect(() => {
    setCounts({ T: 0, H: 0, Z: 0, E: 0 });
    setDone(false);
    startTime.current = Date.now();
  }, [aufgabe.id]);

  // Auto-check when correct
  useEffect(() => {
    if (current === aufgabe.target && !done) {
      setDone(true);
      const dauerMs = Date.now() - startTime.current;
      onAntwort(String(current), true, dauerMs);
    }
  }, [current, aufgabe.target, done, onAntwort]);

  function add(k: PlaceKey) {
    if (!done) setCounts((c) => ({ ...c, [k]: c[k] + 1 }));
  }

  function sub(k: PlaceKey) {
    if (!done) setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] - 1) }));
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Zielzahl */}
      <Card>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Lege die Zahl
        </p>
        <p className="text-5xl font-bold text-heading tabular-nums mt-1">
          {fmt(aufgabe.target)}
        </p>
      </Card>

      {/* +/- Counters */}
      <Card>
        <div
          className="grid gap-2 text-center"
          style={{ gridTemplateColumns: `repeat(${keys.length}, 1fr)` }}
        >
          {keys.map((k) => (
            <div key={k}>
              <p className="text-xs font-bold text-muted">{labels[k]}</p>
              <div className="bg-card border border-border rounded-lg py-3 text-3xl font-bold tabular-nums text-heading mt-1">
                {counts[k]}
              </div>
              <div className="flex gap-1 mt-2 justify-center">
                <button
                  onClick={() => sub(k)}
                  disabled={done}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-border hover:bg-border/80 text-lg font-bold text-heading transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label={`${labels[k]} minus`}
                >
                  −
                </button>
                <button
                  onClick={() => add(k)}
                  disabled={done}
                  className={`min-w-[44px] min-h-[44px] rounded-lg ${plusColors[k]} hover:brightness-95 text-lg font-bold transition-colors disabled:opacity-40 cursor-pointer`}
                  aria-label={`${labels[k]} plus`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-3 text-xl font-bold tabular-nums text-muted">
          = {fmt(current)}
        </p>
      </Card>

      {/* Live BlockDisplay */}
      <Card>
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          Deine Blöcke
        </p>
        <BlockDisplay T={counts.T} H={counts.H} Z={counts.Z} E={counts.E} />
      </Card>

      {/* Feedback */}
      <FeedbackBanner typ={done ? 'richtig' : null}>
        Geschafft!
      </FeedbackBanner>

      {/* Nächste */}
      <Button className="w-full" onClick={onNaechste}>
        Nächste Aufgabe →
      </Button>
    </div>
  );
}
