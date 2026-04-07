import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { SchrittDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';
import { normalizeZahl } from '../parserHelpers';
import { RechenketteViz } from '@/components/ui/RechenketteViz';

/**
 * Schritt-View: Mehrstufige Rechnung, ein Schritt nach dem anderen.
 * Liest aufgabe.parsed (SchrittDaten) — kein eigenes Parsing.
 *
 * Unterstuetzt:
 * - Mehrere Teilaufgaben (a/b/c) mit je mehreren Schritten
 * - Strichlisten-Schritte (5 Felder fuer 5 Teilrechnungen)
 * - Maltabelle, Rechenkette, Ueberschlag+genau
 */
export function SchrittView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as SchrittDaten;
  const [teilIdx, setTeilIdx] = useState(0);
  const [schrittIdx, setSchrittIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const [completed, setCompleted] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTeil = daten.teilaufgaben[teilIdx];
  const currentSchritt = currentTeil.schritte[schrittIdx];
  const isLastSchritt = schrittIdx >= currentTeil.schritte.length - 1;
  const isLastTeil = teilIdx >= daten.teilaufgaben.length - 1;
  const isVeryLast = isLastSchritt && isLastTeil;

  // Total steps across all Teilaufgaben for display
  const totalSchritte = currentTeil.schritte.length;

  // Rechenkette detection: if lösung contains → chain notation
  const ketteMatch = aufgabe.loesung?.match(/[\d.,]+(?:\s*→\s*[^→]+){2,}/);
  const rechenkette = ketteMatch ? ketteMatch[0] : null;

  useEffect(() => {
    setTeilIdx(0);
    setSchrittIdx(0);
    setInput('');
    setStatus('idle');
    setCompleted([]);
  }, [aufgabe.titel]);

  useEffect(() => {
    if (!rechenkette) inputRef.current?.focus();
  }, [teilIdx, schrittIdx, rechenkette]);

  function check() {
    const normalized = normalizeZahl(input);
    const expected = normalizeZahl(currentSchritt.antwort);

    if (normalized === expected) {
      setStatus('richtig');
      setCompleted((prev) => [...prev, `${currentSchritt.frage} ${currentSchritt.antwort}`]);
      if (isVeryLast) onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  function nextSchritt() {
    if (!isLastSchritt) {
      setSchrittIdx((i) => i + 1);
      setInput('');
      setStatus('idle');
    } else if (!isLastTeil) {
      setTeilIdx((i) => i + 1);
      setSchrittIdx(0);
      setInput('');
      setStatus('idle');
      setCompleted([]);
    }
  }

  // Rechenkette interaktiv: Antwort direkt in der Kette
  function handleKetteAntwort(_index: number, richtig: boolean) {
    if (richtig) {
      setCompleted((prev) => [...prev, `${currentSchritt.frage} ${currentSchritt.antwort}`]);
      if (isVeryLast) {
        onRichtig();
      } else if (!isLastSchritt) {
        setSchrittIdx((i) => i + 1);
      } else if (!isLastTeil) {
        setTeilIdx((i) => i + 1);
        setSchrittIdx(0);
        setCompleted([]);
      }
    } else {
      onFalsch();
    }
  }

  return (
    <div className="space-y-3">
      {/* Anweisung (Intro-Text) */}
      {daten.anweisung && (
        <Card>
          <MarkdownText text={daten.anweisung} className="text-sm text-body leading-relaxed" />
        </Card>
      )}

      {/* Teilaufgaben-Label wenn mehrere */}
      {daten.teilaufgaben.length > 1 && (
        <p className="text-xs font-semibold text-primary text-center">
          Teilaufgabe {currentTeil.label}) — {teilIdx + 1} von {daten.teilaufgaben.length}
        </p>
      )}

      {/* Rechenkette interaktiv: Eingabe direkt in der Kette */}
      {rechenkette && (
        <Card>
          <RechenketteViz
            kette={rechenkette}
            geloestBis={schrittIdx}
            aktiverSchritt={schrittIdx}
            interaktiv
            onAntwort={handleKetteAntwort}
          />
        </Card>
      )}

      {/* Erledigte Schritte (nur bei Nicht-Rechenketten) */}
      {!rechenkette && completed.length > 0 && (
        <Card className="bg-success-bg/50 border-success/10">
          {completed.map((c, i) => (
            <p key={i} className="text-xs text-success tabular-nums">✓ {c}</p>
          ))}
        </Card>
      )}

      {/* Aktueller Schritt + Eingabefeld (nur ohne Rechenkette) */}
      {!rechenkette && (
        <>
          <Card className="border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">
              Schritt {schrittIdx + 1} von {totalSchritte}
            </p>
            <MarkdownText text={currentSchritt.frage} className="text-sm font-semibold text-heading leading-relaxed tabular-nums" />
          </Card>

          <Card>
            <input
              ref={inputRef}
              inputMode="numeric"
              value={input}
              onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
              placeholder="= ?"
              disabled={status === 'richtig'}
              className="w-full text-lg font-bold tabular-nums text-center border-2 border-border rounded-xl py-3 focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white min-h-[48px] disabled:opacity-50"
            />
          </Card>

          <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]}>
            {status === 'richtig' && <span className="tabular-nums">{currentSchritt.antwort}</span>}
          </FeedbackBanner>

          <div className="flex gap-2">
            {status !== 'richtig' ? (
              <Button className="flex-1" onClick={check}>Prüfen</Button>
            ) : !isVeryLast ? (
              <Button className="flex-1" onClick={nextSchritt}>
                {isLastSchritt ? 'Nächste Teilaufgabe →' : 'Nächster Schritt →'}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
