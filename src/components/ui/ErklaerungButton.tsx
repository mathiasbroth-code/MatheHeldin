import { useState } from 'react';
import type { StageErklaerung } from '@/stages/types';
import { Card } from './Card';

interface ErklaerungButtonProps {
  erklaerung?: StageErklaerung;
}

export function ErklaerungButton({ erklaerung }: ErklaerungButtonProps) {
  const [open, setOpen] = useState(false);

  if (!erklaerung) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30 ${
          open
            ? 'bg-primary text-white'
            : 'bg-card border border-border text-muted hover:text-primary hover:border-primary'
        }`}
        aria-label={open ? 'Erklärung schließen' : 'Was lernst du hier?'}
      >
        ?
      </button>

      {open && (
        <Card className="bg-primary-light border-primary/20">
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Was lernst du hier?
          </p>
          <p className="text-sm text-body mt-1">{erklaerung.wasLernstDu}</p>
          <p className="text-xs font-bold text-primary uppercase tracking-wide mt-3">
            So geht's
          </p>
          <p className="text-sm text-body mt-1">{erklaerung.soGehts}</p>
        </Card>
      )}
    </>
  );
}
