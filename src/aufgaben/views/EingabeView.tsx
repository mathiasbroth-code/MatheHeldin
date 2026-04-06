import { useState, useRef, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { EingabeDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';
import { normalizeZahl } from '../parserHelpers';
import { BaumDiagramm, extractElemente } from '@/components/kombinatorik/BaumDiagramm';

/**
 * Eingabe-View: Zahleneingabe mit Teilaufgaben.
 * Liest aufgabe.parsed (EingabeDaten) — kein eigenes Parsing.
 */
export function EingabeView({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeViewProps) {
  const daten = aufgabe.parsed as EingabeDaten;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;

  // Baumdiagramm für Kombinatorik-Aufgaben
  const baumElemente = aufgabe.thema?.includes('Möglichkeiten') || aufgabe.aufgabenstellung?.includes('Reihenfolge')
    ? extractElemente(aufgabe.aufgabenstellung)
    : null;
  const [baumReveal, setBaumReveal] = useState(1);

  useEffect(() => {
    setCurrentIdx(0);
    setInput('');
    setStatus('idle');
    setBaumReveal(1);
  }, [aufgabe.titel]);

  useEffect(() => {
    inputRef.current?.focus();
    onTeilaufgabeChange?.(daten.items[currentIdx]?.label ?? '');
  }, [currentIdx, daten.items, onTeilaufgabeChange]);

  function check() {
    const normalized = normalizeZahl(input);
    const expected = normalizeZahl(current.antwort);

    if (normalized === expected) {
      setStatus('richtig');
      if (isLast) onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  function next() {
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setInput('');
      setStatus('idle');
    }
  }

  return (
    <div className="space-y-3">
      {daten.anweisung && daten.items.length > 1 && (
        <Card>
          <MarkdownText text={daten.anweisung} className="text-sm font-semibold text-heading leading-relaxed" />
        </Card>
      )}
      <Card>
        <MarkdownText text={current.frage} className="text-base text-heading font-semibold leading-relaxed" />
      </Card>

      {/* Baumdiagramm bei Kombinatorik-Aufgaben */}
      {baumElemente && (
        <Card>
          <BaumDiagramm
            elemente={baumElemente}
            revealLevel={status === 'richtig' ? baumElemente.length : baumReveal}
            compact={baumElemente.length >= 4}
            onReveal={status !== 'richtig' ? setBaumReveal : undefined}
          />
        </Card>
      )}

      <Card>
        <Input
          ref={inputRef}
          sizing="xl"
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="Deine Antwort"
          disabled={status === 'richtig'}
        />
      </Card>

      {daten.items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Teilaufgabe {currentIdx + 1} von {daten.items.length}
        </p>
      )}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      >
        {status === 'richtig' && <span>{current.antwort}</span>}
      </FeedbackBanner>

      <div className="flex gap-2">
        {status !== 'richtig' ? (
          <Button className="flex-1" onClick={check}>Prüfen</Button>
        ) : !isLast ? (
          <Button className="flex-1" onClick={next}>Weiter →</Button>
        ) : null}
      </div>
    </div>
  );
}
