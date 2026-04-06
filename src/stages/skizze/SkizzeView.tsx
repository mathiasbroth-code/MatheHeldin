import { useState, useRef, useMemo } from 'react';
import type { StageProps } from '@/stages/types';
import type { SkizzeAufgabe } from './generator';
import { PROBLEMS, loesen } from './problems';
import { Card } from '@/components/ui/Card';
import { Phase1Ordnen } from './phases/Phase1Ordnen';
import { Phase2Strecken } from './phases/Phase2Strecken';
import { Phase3Rechnen } from './phases/Phase3Rechnen';

export function SkizzeView({
  aufgabe,
  onAntwort,
  onNaechste,
}: StageProps<SkizzeAufgabe>) {
  const [problemIdx, setProblemIdx] = useState(aufgabe.problemIndex);
  const [phase, setPhase] = useState(1);
  const startTime = useRef(Date.now());

  const problem = PROBLEMS[problemIdx];
  const loesung = useMemo(() => loesen(problem), [problem]);

  function pickProblem(idx: number) {
    setProblemIdx(idx);
    setPhase(1);
    startTime.current = Date.now();
  }

  function handlePhase3Antwort(antwort: string, richtig: boolean, dauerMs: number) {
    onAntwort(antwort, richtig, dauerMs);
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Aufgaben-Wähler */}
      <div className="grid grid-cols-3 gap-2">
        {PROBLEMS.map((prob, i) => (
          <button
            key={i}
            onClick={() => pickProblem(i)}
            className={`rounded-xl p-2 text-left border-2 transition text-xs min-h-[44px] cursor-pointer ${
              problemIdx === i
                ? 'bg-success border-success/40 text-white shadow'
                : 'bg-card border-border hover:border-success/40 text-heading'
            }`}
          >
            <span className="font-bold">Aufgabe {i + 1}</span>
            <span className="block opacity-90 mt-0.5 leading-tight">
              {prob.titel}
            </span>
          </button>
        ))}
      </div>

      {/* Aufgabentext */}
      <Card>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Sachaufgabe
        </p>
        <p className="mt-2 text-body leading-relaxed text-sm">{problem.text}</p>
      </Card>

      {/* Phasen-Indikator */}
      <div className="flex items-center justify-center gap-2 text-xs">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-colors ${
                phase === n
                  ? 'bg-success text-white shadow'
                  : phase > n
                    ? 'bg-success/20 text-success'
                    : 'bg-border text-muted'
              }`}
            >
              {phase > n ? '✓' : n}
            </div>
            {n < 3 && (
              <div
                className={`w-6 h-0.5 ${phase > n ? 'bg-success/40' : 'bg-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Phasen */}
      {phase === 1 && (
        <Phase1Ordnen problem={problem} onComplete={() => setPhase(2)} />
      )}
      {phase === 2 && (
        <Phase2Strecken
          problem={problem}
          onComplete={() => setPhase(3)}
          onBack={() => setPhase(1)}
        />
      )}
      {phase === 3 && (
        <Phase3Rechnen
          problem={problem}
          loesung={loesung}
          onAntwort={handlePhase3Antwort}
          onRestart={onNaechste}
          startTime={startTime.current}
        />
      )}
    </div>
  );
}
