/**
 * Rechenketten-Visualisierung: Zeigt eine Rechenkette als Pfeildiagramm.
 * Beispiel: 120 → +180 → [300] → :5 → [60]
 *
 * Gelöste Schritte zeigen das Ergebnis, offene zeigen ▢.
 * Der aktuelle Schritt wird hervorgehoben.
 *
 * Im interaktiven Modus kann das Kind die Ergebnisse direkt
 * in der Kette eintippen — jedes ▢ wird zum Eingabefeld.
 */

import { useState, useRef, useEffect } from 'react';
import { normalizeZahl } from '@/aufgaben/parserHelpers';

interface RechenketteVizProps {
  /** Komplette Kette als String: "120 → + 180 → 300 → : 5 → 60" */
  kette: string;
  /** Optional: Template mit Lücken — bestimmt welche Positionen Blanks sind.
   *  Beispiel: "▢ → · 3 → ▢ → + 240 → 600" (Rückwärts-Kette).
   *  Ohne vorlage: Position 0 = gegeben, alle anderen Zahlen = Ergebnis. */
  vorlage?: string;
  /** Wie viele Ergebnis-Felder bereits gelöst (0 = keins) */
  geloestBis: number;
  /** Index des aktuell aktiven Ergebnis-Feldes (0-basiert) */
  aktiverSchritt: number;
  /** Interaktiver Modus: Eingabefelder direkt in der Kette */
  interaktiv?: boolean;
  /** Callback bei Antwort im interaktiven Modus */
  onAntwort?: (index: number, richtig: boolean) => void;
}

interface KettenElement {
  typ: 'zahl' | 'operation';
  text: string;
  istErgebnis: boolean; // true = muss vom Kind ausgefüllt werden
  index: number; // Index unter den Ergebnis-Feldern
}

function parseKette(kette: string, vorlage?: string): KettenElement[] {
  const teile = kette.split('→').map((s) => s.trim());
  const vorlageteile = vorlage?.split('→').map((s) => s.trim());
  const elemente: KettenElement[] = [];
  let ergebnisIdx = 0;

  for (let i = 0; i < teile.length; i++) {
    const teil = teile[i];
    const istOperation = /^[+\-−·:×÷]/.test(teil);

    if (istOperation) {
      elemente.push({ typ: 'operation', text: teil, istErgebnis: false, index: -1 });
    } else {
      // Mit Vorlage: Blank-Positionen aus Template bestimmen
      // Ohne Vorlage: Position 0 = gegeben, Rest = Ergebnis
      const istBlank = vorlageteile
        ? /▢|___/.test(vorlageteile[i] ?? '')
        : i > 0;

      if (istBlank) {
        elemente.push({ typ: 'zahl', text: teil, istErgebnis: true, index: ergebnisIdx++ });
      } else {
        elemente.push({ typ: 'zahl', text: teil, istErgebnis: false, index: -1 });
      }
    }
  }

  return elemente;
}

export function RechenketteViz({ kette, vorlage, geloestBis, aktiverSchritt, interaktiv, onAntwort }: RechenketteVizProps) {
  const elemente = parseKette(kette, vorlage);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus & reset bei neuem Schritt
  useEffect(() => {
    if (interaktiv) {
      setInput('');
      setFeedback('idle');
      // Delay focus to ensure DOM is updated
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [aktiverSchritt, interaktiv]);

  function handleCheck(expected: string) {
    const norm = normalizeZahl(input);
    const exp = normalizeZahl(expected);
    if (norm === exp) {
      setFeedback('richtig');
      setTimeout(() => {
        onAntwort?.(aktiverSchritt, true);
        setInput('');
        setFeedback('idle');
      }, 350);
    } else {
      setFeedback('falsch');
      onAntwort?.(aktiverSchritt, false);
      setTimeout(() => setFeedback('idle'), 600);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 justify-center py-2">
      {elemente.map((el, i) => {
        if (el.typ === 'operation') {
          return (
            <div key={i} className="flex items-center gap-1">
              <span className="text-muted text-lg">→</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-sm font-bold text-heading tabular-nums">
                {el.text}
              </span>
              <span className="text-muted text-lg">→</span>
            </div>
          );
        }

        // Zahl (Start oder Ergebnis)
        if (!el.istErgebnis) {
          // Startzahl — immer sichtbar
          return (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-sm font-bold text-primary tabular-nums">
              {el.text}
            </span>
          );
        }

        // Ergebnis-Feld
        const istGeloest = el.index < geloestBis;
        const istAktiv = el.index === aktiverSchritt;

        // Interaktiver Modus: Eingabefeld statt ▢
        if (interaktiv && istAktiv && !istGeloest) {
          return (
            <input
              key={i}
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); if (feedback === 'falsch') setFeedback('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && feedback === 'idle' && input.trim() && handleCheck(el.text)}
              inputMode="numeric"
              placeholder="?"
              className={`w-[72px] px-2 py-1.5 rounded-lg text-sm font-bold tabular-nums text-center border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                feedback === 'richtig'
                  ? 'border-success bg-success/10 text-success'
                  : feedback === 'falsch'
                    ? 'border-error bg-error/10 text-error'
                    : 'border-primary bg-white text-heading'
              }`}
            />
          );
        }

        return (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold tabular-nums min-w-[48px] text-center transition-all ${
              istGeloest
                ? 'bg-success/10 text-success border-2 border-success/30'
                : istAktiv
                  ? 'bg-primary/10 text-primary border-2 border-primary animate-pulse'
                  : 'bg-gray-100 text-muted border-2 border-border'
            }`}
          >
            {istGeloest ? el.text : '▢'}
          </span>
        );
      })}
    </div>
  );
}
