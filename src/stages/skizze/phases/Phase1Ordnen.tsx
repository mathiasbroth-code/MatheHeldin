import { useState, useEffect } from 'react';
import type { SkizzeProblem } from '../problems';
import { shuffle } from '../problems';
import { Card } from '@/components/ui/Card';

interface Phase1Props {
  problem: SkizzeProblem;
  onComplete: () => void;
}

export function Phase1Ordnen({ problem, onComplete }: Phase1Props) {
  const [shuffled, setShuffled] = useState(() => shuffle(problem.stationen));
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  // Reset when problem changes
  useEffect(() => {
    setShuffled(shuffle(problem.stationen));
    setPlaced([]);
    setShake(false);
  }, [problem]);

  const positions = problem.stationen.map(
    (_, i) => 10 + (i / (problem.stationen.length - 1)) * 80,
  );

  function tapChip(name: string) {
    const expected = problem.stationen[placed.length];
    if (name === expected) {
      const newPlaced = [...placed, name];
      setPlaced(newPlaced);
      setShuffled((prev) => prev.filter((s) => s !== name));
      if (newPlaced.length === problem.stationen.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 1800);
    }
  }

  return (
    <>
      <style>{`
        @keyframes mh-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        .mh-shake { animation: mh-shake 0.45s ease-in-out; }
      `}</style>

      <Card className="bg-primary-light border-primary/20 text-center">
        <p className="text-sm font-semibold text-primary">
          Schritt 1: Tippe die Orte in der richtigen Reihenfolge an.
        </p>
      </Card>

      {/* Zahlenstrahl mit leeren Plätzen */}
      <Card>
        <div className="relative h-24">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-border rounded" />
          {problem.stationen.map((_, i) => {
            const isPlaced = i < placed.length;
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${positions[i]}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    isPlaced
                      ? 'bg-success border-white shadow'
                      : 'bg-white border-border border-dashed'
                  }`}
                />
                <span
                  className={`mt-1 text-xs font-semibold px-1.5 rounded whitespace-nowrap ${
                    isPlaced ? 'text-heading bg-white' : 'text-muted/40'
                  }`}
                >
                  {isPlaced ? placed[i] : '?'}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Chips */}
      <div className={`flex flex-wrap gap-2 justify-center ${shake ? 'mh-shake' : ''}`}>
        {shuffled.map((name) => (
          <button
            key={name}
            onClick={() => tapChip(name)}
            className="px-4 py-3 rounded-xl bg-primary-light hover:bg-primary/15 border-2 border-primary/30 font-bold text-primary shadow-sm transition min-h-[44px] cursor-pointer"
          >
            {name}
          </button>
        ))}
      </div>

      {shake && (
        <p className="text-center text-sm text-warning">
          Hm, der Ort kommt erst später. Lies die Aufgabe nochmal!
        </p>
      )}
    </>
  );
}
