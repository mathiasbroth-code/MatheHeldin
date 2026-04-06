import { useState, useCallback } from 'react';
import type { Aufgabe, Stage } from '@/stages/types';

/**
 * Verwaltet die aktuelle Aufgabe einer Stufe.
 * Generiert beim Mount und bei `naechste()` eine neue Aufgabe.
 */
export function useAktuelleAufgabe<T extends Aufgabe>(stage: Stage<T>) {
  const [aufgabe, setAufgabe] = useState<T>(() => stage.generator());

  const naechste = useCallback(() => {
    setAufgabe(stage.generator());
  }, [stage]);

  return { aufgabe, naechste };
}
