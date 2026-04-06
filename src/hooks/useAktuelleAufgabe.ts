import { useState, useCallback } from 'react';
import type { Aufgabe, Stage } from '@/stages/types';

/**
 * Verwaltet die aktuelle Aufgabe einer Stufe.
 * Generiert beim Mount und bei `naechste()` eine neue Aufgabe.
 * Optionaler `schwierigkeit`-Parameter wird an den Generator durchgereicht.
 */
export function useAktuelleAufgabe<T extends Aufgabe>(
  stage: Stage<T>,
  schwierigkeit?: number,
) {
  const [aufgabe, setAufgabe] = useState<T>(() => stage.generator(schwierigkeit));

  const naechste = useCallback(
    (neuesSchwierigkeit?: number) => {
      setAufgabe(stage.generator(neuesSchwierigkeit ?? schwierigkeit));
    },
    [stage, schwierigkeit],
  );

  return { aufgabe, naechste };
}
