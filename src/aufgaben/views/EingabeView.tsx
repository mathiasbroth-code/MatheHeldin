import { useState, useRef, useEffect, useCallback } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { EingabeDaten, TeilItem } from '../types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';
import { normalizeZahl } from '../parserHelpers';
import { BaumDiagramm, extractElemente } from '@/components/kombinatorik/BaumDiagramm';

// ── Multi-Eingabe: N einzelne Felder für Teiler/Vielfache ────

function MultiFelder({
  item,
  status,
  onCheck,
  disabled,
}: {
  item: TeilItem;
  status: 'idle' | 'richtig' | 'falsch';
  onCheck: (values: string[]) => void;
  disabled: boolean;
}) {
  const anzahl = item.felder ?? item.antwort.split(',').length;
  const expected = item.antwort.split(',').map((s) => normalizeZahl(s.trim()));
  const [values, setValues] = useState<string[]>(() => Array(anzahl).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Felder-Status: grün wenn Wert korrekt, rot wenn falsch und geprüft
  const feldStatus = values.map((v) => {
    if (!v.trim()) return 'empty';
    const norm = normalizeZahl(v.trim());
    if (expected.includes(norm)) return 'richtig';
    return status === 'falsch' ? 'falsch' : 'pending';
  });

  useEffect(() => {
    setValues(Array(anzahl).fill(''));
  }, [anzahl, item.frage]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, [item.frage]);

  function handleChange(idx: number, val: string) {
    const next = [...values];
    next[idx] = val;
    setValues(next);
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      // Springe zum nächsten leeren Feld oder prüfe
      const nextEmpty = values.findIndex((v, i) => i > idx && !v.trim());
      if (nextEmpty >= 0) {
        refs.current[nextEmpty]?.focus();
      } else {
        onCheck(values);
      }
    } else if (e.key === 'Tab' && !e.shiftKey && idx < anzahl - 1) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 justify-center">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            className={`w-16 h-12 text-center text-lg font-semibold rounded-xl border-2 outline-none transition-colors ${
              feldStatus[i] === 'richtig'
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : feldStatus[i] === 'falsch'
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-200 bg-white text-heading focus:border-teal-400'
            }`}
            placeholder="?"
          />
        ))}
      </div>
      <p className="text-xs text-muted text-center">{anzahl} Zahlen gesucht — Reihenfolge egal</p>
    </div>
  );
}

// ── Hauptkomponente ─────────────────────────────────────────

/**
 * Eingabe-View: Zahleneingabe mit Teilaufgaben.
 * Unterstützt Multi-Felder-Modus für Teiler/Vielfache (wenn item.felder gesetzt).
 */
export function EingabeView({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeViewProps) {
  const daten = aufgabe.parsed as EingabeDaten;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;
  const isMulti = (current.felder ?? 0) > 0;

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
    if (!isMulti) inputRef.current?.focus();
    onTeilaufgabeChange?.(daten.items[currentIdx]?.label ?? '');
  }, [currentIdx, daten.items, onTeilaufgabeChange, isMulti]);

  // Ist die erwartete Antwort eine Komma-Liste (z.B. "5139, 5193, 5319, ...")?
  const isListAnswer = !isMulti && current.antwort.includes(',') && current.antwort.split(',').length > 2;

  const checkMulti = useCallback((values: string[]) => {
    const expectedParts = current.antwort.split(',').map((s) => normalizeZahl(s.trim())).filter(Boolean).sort();
    const inputParts = values.map((s) => normalizeZahl(s.trim())).filter(Boolean).sort();
    if (expectedParts.length === inputParts.length && expectedParts.every((v, i) => v === inputParts[i])) {
      setStatus('richtig');
      if (isLast) onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }, [current.antwort, isLast, onRichtig, onFalsch]);

  function check() {
    if (isListAnswer) {
      const expectedParts = current.antwort.split(',').map(s => normalizeZahl(s.trim())).filter(Boolean).sort();
      const inputParts = input.split(/[,\s]+/).map(s => normalizeZahl(s.trim())).filter(Boolean).sort();
      if (expectedParts.length === inputParts.length && expectedParts.every((v, i) => v === inputParts[i])) {
        setStatus('richtig');
        if (isLast) onRichtig();
      } else {
        setStatus('falsch');
        onFalsch();
      }
      return;
    }

    const normalized = normalizeZahl(input);
    const expected = normalizeZahl(current.antwort);

    const isMatch = normalized === expected
      || (expected.match(/^\d{1,2}:00$/) && `${normalized}:00` === expected);

    if (isMatch) {
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
          <MarkdownText text={daten.anweisung} className="text-sm text-body leading-relaxed" />
        </Card>
      )}
      {daten.kontext && (
        <Card>
          <MarkdownText text={daten.kontext} className="text-sm text-body leading-relaxed" />
        </Card>
      )}
      <Card>
        <MarkdownText text={current.frage} className="text-sm font-semibold text-heading leading-relaxed" />
      </Card>

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
        {isMulti ? (
          <MultiFelder
            item={current}
            status={status}
            onCheck={checkMulti}
            disabled={status === 'richtig'}
          />
        ) : (
          <Input
            ref={inputRef}
            sizing="xl"
            inputMode={isListAnswer ? 'text' : 'numeric'}
            value={input}
            onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
            onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
            placeholder="Deine Antwort"
            disabled={status === 'richtig'}
          />
        )}
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
          <Button className="flex-1" onClick={isMulti ? () => checkMulti([]) : check}>
            Prüfen
          </Button>
        ) : !isLast ? (
          <Button className="flex-1" onClick={next}>Weiter →</Button>
        ) : null}
      </div>
    </div>
  );
}
