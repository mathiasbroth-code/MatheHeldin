import { useState, useEffect } from 'react';
import type { SkizzeProblem } from '../problems';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Phase2Props {
  problem: SkizzeProblem;
  onComplete: () => void;
  onBack: () => void;
}

type Phase2Status = null | 'ok' | 'no';

export function Phase2Strecken({ problem, onComplete, onBack }: Phase2Props) {
  const [distInputs, setDistInputs] = useState<string[]>(() =>
    problem.strecken.map(() => ''),
  );
  const [totalInput, setTotalInput] = useState('');
  const [status, setStatus] = useState<Phase2Status>(null);

  const positions = problem.stationen.map(
    (_, i) => 10 + (i / (problem.stationen.length - 1)) * 80,
  );

  useEffect(() => {
    setDistInputs(problem.strecken.map(() => ''));
    setTotalInput('');
    setStatus(null);
  }, [problem]);

  function updateDistance(i: number, value: string) {
    const next = [...distInputs];
    next[i] = value;
    setDistInputs(next);
    setStatus(null);
  }

  function parseNum(s: string): number {
    return parseFloat(s.replace(',', '.'));
  }

  function checkPhase2() {
    let ok = true;

    for (let i = 0; i < problem.strecken.length; i++) {
      const expected = problem.strecken[i];
      const given = (distInputs[i] || '').trim();

      if (expected === null) {
        // Unknown segment must be left empty
        if (given !== '') ok = false;
      } else {
        const num = parseNum(given);
        if (isNaN(num) || Math.abs(num - expected) > 0.05) ok = false;
      }
    }

    const totNum = parseNum(totalInput);
    if (isNaN(totNum) || Math.abs(totNum - problem.gesamt) > 0.05) ok = false;

    setStatus(ok ? 'ok' : 'no');
    if (ok) setTimeout(onComplete, 700);
  }

  return (
    <>
      <Card className="bg-primary-light border-primary/20 text-center">
        <p className="text-sm font-semibold text-primary">
          Schritt 2: Trage die Strecken ein. Das gesuchte Stück lässt du leer!
        </p>
      </Card>

      <Card className="bg-warning-bg border-warning/20 text-center">
        <p className="text-xs italic text-heading">
          Gesucht: „{problem.frage}"
        </p>
      </Card>

      {/* Zahlenstrahl */}
      <Card>
        <div className="relative h-16">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-border rounded" />
          {problem.stationen.map((name, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${positions[i]}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-4 h-4 bg-success border-2 border-white rounded-full shadow" />
              <span className="mt-1 text-xs font-semibold text-heading bg-white px-1 rounded whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Strecken-Inputs */}
      <Card className="space-y-2">
        {problem.strecken.map((expected, i) => {
          const isUnknown = expected === null;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 text-sm text-heading">
                <span className="font-semibold">{problem.stationen[i]}</span>
                <span className="text-muted mx-1">→</span>
                <span className="font-semibold">{problem.stationen[i + 1]}</span>
              </div>
              <input
                inputMode="decimal"
                value={distInputs[i]}
                onChange={(e) => updateDistance(i, e.target.value)}
                placeholder={isUnknown ? 'leer!' : '?'}
                className="w-20 text-center text-lg font-bold border-2 border-border rounded-lg py-1.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white min-h-[44px]"
              />
              <span className="text-sm text-muted w-6">km</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="flex-1 text-sm font-bold text-heading">
            {problem.hinUndZurueck ? 'Gesamt (hin + zurück)' : 'Gesamtstrecke'}
          </div>
          <input
            inputMode="decimal"
            value={totalInput}
            onChange={(e) => {
              setTotalInput(e.target.value);
              setStatus(null);
            }}
            placeholder="?"
            className="w-20 text-center text-lg font-bold border-2 border-warning/50 rounded-lg py-1.5 focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none bg-white min-h-[44px]"
          />
          <span className="text-sm text-muted w-6">km</span>
        </div>
      </Card>

      {/* Feedback */}
      {status === 'no' && (
        <Card className="bg-warning-bg border-warning/30 text-center">
          <p className="text-sm text-heading">
            Noch nicht alles passt. Prüfe jede Strecke einzeln — und denk dran:{' '}
            <em>ein</em> Stück bleibt leer.
          </p>
        </Card>
      )}
      {status === 'ok' && (
        <Card className="bg-success-bg border-success/30 text-center">
          <p className="text-sm text-success font-semibold">
            Super! Deine Skizze ist komplett.
          </p>
        </Card>
      )}

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack}>
          ← Zurück
        </Button>
        <Button className="flex-1" onClick={checkPhase2}>
          Skizze prüfen
        </Button>
      </div>
    </>
  );
}
