import { useState, useEffect } from 'react';
import type { SkizzeProblem } from '../problems';
import { fmt } from '@/lib/helpers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

interface Phase3Props {
  problem: SkizzeProblem;
  loesung: number;
  onAntwort: (antwort: string, richtig: boolean, dauerMs: number) => void;
  onRestart: () => void;
  startTime: number;
}

type Status = 'idle' | 'richtig' | 'falsch' | 'show';

export function Phase3Rechnen({
  problem,
  loesung,
  onAntwort,
  onRestart,
  startTime,
}: Phase3Props) {
  const [antwort, setAntwort] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setAntwort('');
    setStatus('idle');
  }, [problem]);

  const revealed = status === 'richtig' || status === 'show';

  // Compute final distances for proportional positioning
  const finalDistances = problem.strecken.map((s) =>
    s !== null ? s : revealed ? loesung : null,
  );
  const allKnown = finalDistances.every((s) => s !== null);

  let finalPositions: number[];
  if (allKnown) {
    const total = (finalDistances as number[]).reduce((a, b) => a + b, 0);
    let cum = 0;
    finalPositions = [10];
    for (const s of finalDistances as number[]) {
      cum += s;
      finalPositions.push(10 + (cum / total) * 80);
    }
  } else {
    finalPositions = problem.stationen.map(
      (_, i) => 10 + (i / (problem.stationen.length - 1)) * 80,
    );
  }

  const bekanntSumme = problem.strecken
    .filter((s): s is number => s !== null)
    .reduce((a, b) => a + b, 0);
  const halbe = problem.gesamt / 2;
  const bekannteStrings = problem.strecken
    .filter((s): s is number => s !== null)
    .map(fmt)
    .join(' + ');

  function parseNum(s: string): number {
    return parseFloat(s.replace(',', '.'));
  }

  function checkAnswer() {
    const n = parseNum(antwort);
    if (isNaN(n)) return;

    const dauerMs = Date.now() - startTime;
    const richtig = Math.abs(n - loesung) < 0.05;

    setStatus(richtig ? 'richtig' : 'falsch');
    onAntwort(antwort, richtig, dauerMs);
  }

  function showSolution() {
    setAntwort(fmt(loesung));
    setStatus('show');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (status === 'idle' || status === 'falsch')) {
      checkAnswer();
    }
  }

  return (
    <>
      <Card className="bg-primary-light border-primary/20 text-center">
        <p className="text-sm font-semibold text-primary">
          Schritt 3: Jetzt rechne das gesuchte Stück aus!
        </p>
      </Card>

      {/* Fertige Skizze */}
      <Card>
        <div className="relative h-24">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-border rounded" />

          {/* Strecken-Labels */}
          {problem.strecken.map((s, i) => {
            const mid = (finalPositions[i] + finalPositions[i + 1]) / 2;
            const isUnknown = s === null;
            const shown = isUnknown
              ? revealed
                ? `${fmt(loesung)} km`
                : '?'
              : `${fmt(s)} km`;

            return (
              <div
                key={`s${i}`}
                className={`absolute text-xs font-bold rounded px-2 py-0.5 border whitespace-nowrap ${
                  isUnknown
                    ? revealed
                      ? 'bg-success-bg border-success/40 text-success'
                      : 'bg-warning-bg border-warning/40 text-warning'
                    : 'bg-card border-border text-muted'
                }`}
                style={{
                  left: `${mid}%`,
                  top: '10%',
                  transform: 'translate(-50%, 0)',
                }}
              >
                {shown}
              </div>
            );
          })}

          {/* Stationen */}
          {problem.stationen.map((name, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${finalPositions[i]}%`,
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

        <p className="mt-1 text-center text-sm text-muted">
          {problem.hinUndZurueck ? (
            <>
              Gesamt (hin + zurück): <strong>{fmt(problem.gesamt)} km</strong>
            </>
          ) : (
            <>
              Gesamt: <strong>{fmt(problem.gesamt)} km</strong>
            </>
          )}
        </p>
      </Card>

      {/* Antwort-Eingabe */}
      <Card>
        <p className="text-sm font-semibold text-heading">{problem.frage}</p>
        <div className="flex gap-2 mt-2 items-center">
          <input
            inputMode="decimal"
            value={antwort}
            onChange={(e) => {
              setAntwort(e.target.value);
              if (status === 'falsch') setStatus('idle');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Deine Antwort"
            disabled={status === 'richtig' || status === 'show'}
            className="flex-1 text-2xl font-bold text-center border-2 border-border rounded-xl py-2 focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white min-h-[44px] disabled:opacity-50"
          />
          <span className="text-xl font-bold text-muted">km</span>
        </div>
      </Card>

      {/* Feedback */}
      <FeedbackBanner
        typ={
          status === 'richtig'
            ? 'richtig'
            : status === 'falsch'
              ? 'falsch'
              : null
        }
        hinweis="Zähle die bekannten Strecken zusammen — wie viel fehlt bis zur Gesamtstrecke?"
      >
        {status === 'richtig' && (
          <span className="text-xs tabular-nums">
            {problem.hinUndZurueck ? (
              <>
                {fmt(problem.gesamt)} ÷ 2 = {fmt(halbe)}; {fmt(halbe)} −{' '}
                {bekannteStrings} = <strong>{fmt(loesung)} km</strong>
              </>
            ) : (
              <>
                {fmt(problem.gesamt)} − ({bekannteStrings}) ={' '}
                <strong>{fmt(loesung)} km</strong>
              </>
            )}
          </span>
        )}
      </FeedbackBanner>

      {/* Lösungsweg (bei "Lösung" Button) */}
      {status === 'show' && (
        <Card className="bg-warning-bg border-warning/30">
          <p className="text-xs font-semibold text-heading mb-1">Lösungsweg:</p>
          {problem.hinUndZurueck ? (
            <ol className="text-xs text-body space-y-0.5 list-decimal list-inside">
              <li>Hin- und Rückweg sind gleich lang.</li>
              <li>
                Einfacher Weg: {fmt(problem.gesamt)} ÷ 2 ={' '}
                <strong>{fmt(halbe)} km</strong>
              </li>
              <li>
                Bekannt: {bekannteStrings} = {fmt(bekanntSumme)} km
              </li>
              <li>
                Gesucht: {fmt(halbe)} − {fmt(bekanntSumme)} ={' '}
                <strong>{fmt(loesung)} km</strong>
              </li>
            </ol>
          ) : (
            <ol className="text-xs text-body space-y-0.5 list-decimal list-inside">
              <li>
                Bekannt: {bekannteStrings} = {fmt(bekanntSumme)} km
              </li>
              <li>Gesamt: {fmt(problem.gesamt)} km</li>
              <li>
                Gesucht: {fmt(problem.gesamt)} − {fmt(bekanntSumme)} ={' '}
                <strong>{fmt(loesung)} km</strong>
              </li>
            </ol>
          )}
        </Card>
      )}

      {/* Aktionsleiste */}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onRestart} className="px-3">
          ↺ Neu
        </Button>
        {status !== 'richtig' && status !== 'show' ? (
          <>
            <Button className="flex-1" onClick={checkAnswer}>
              Prüfen
            </Button>
            <Button
              variant="secondary"
              onClick={showSolution}
              className="px-3"
            >
              Lösung
            </Button>
          </>
        ) : (
          <Button className="flex-1" onClick={onRestart}>
            Nächste Aufgabe →
          </Button>
        )}
      </div>
    </>
  );
}
