import { useState, useCallback, useMemo } from 'react';
import type { Aufgabe, Stage } from '@/stages/types';

/**
 * Manages 3-level tip state for a stage exercise.
 * stufe: 0 = no tip, 1 = Denkanstoß, 2 = Methode, 3 = Schritt-für-Schritt
 */
export function useTipp<T extends Aufgabe>(stage: Stage<T>, aufgabe: T) {
  const [stufe, setStufe] = useState(0);

  const hatTipps = stage.tipps != null;

  const texte = useMemo(() => {
    if (!stage.tipps) return null;
    return stage.tipps(aufgabe);
  }, [stage, aufgabe]);

  const advance = useCallback(() => {
    setStufe((prev) => Math.min(prev + 1, 3));
  }, []);

  const reset = useCallback(() => {
    setStufe(0);
  }, []);

  return { stufe, advance, reset, texte, hatTipps };
}
