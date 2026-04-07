import { useState, useRef, useEffect, useMemo } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { TextaufgabeDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';
import { normalizeZahl } from '../parserHelpers';
import { RechenketteViz } from '@/components/ui/RechenketteViz';

/** Zählt Ergebnis-Positionen in einer Rechenkette (Zahlen nach der Startzahl). */
function countKetteErgebnisse(kette: string): number {
  const teile = kette.split('→').map((s) => s.trim());
  let count = 0;
  for (let i = 1; i < teile.length; i++) {
    if (!/^[+\-−·:×÷]/.test(teile[i])) count++;
  }
  return count;
}

/**
 * Erkennt eine Vorwärts-Rechenkette mit Lücken im Kontext-Text.
 * Gibt die Lösungskette und den bereinigten Kontext zurück.
 */
function detectRechenkette(
  kontext: string | undefined,
  loesungsweg: string | undefined,
): { loesungKette: string; kontextOhneKette: string } | null {
  if (!kontext) return null;

  const lines = kontext.split('\n');
  const chainLineIdx = lines.findIndex((line) => {
    const t = line.trim();
    // Muss → enthalten, Lücken haben (___/▢) und mit einer Zahl starten (= Vorwärts)
    return /→/.test(t) && (/___/.test(t) || /▢/.test(t)) && /^\d/.test(t);
  });
  if (chainLineIdx === -1) return null;

  // Lösungskette aus loesungsweg extrahieren
  const solMatch = loesungsweg?.match(/(\d[\d.,]*(?:\s*→\s*[^→\n]+){2,})/);
  if (!solMatch) return null;

  // Kontext ohne die Ketten-Zeile
  const kontextOhneKette = lines
    .filter((_, i) => i !== chainLineIdx)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { loesungKette: solMatch[1], kontextOhneKette };
}

/**
 * Textaufgabe-View: Kontext-Text oben, Frage(n) unten mit Eingabefeldern.
 * Liest aufgabe.parsed (TextaufgabeDaten) — kein eigenes Parsing.
 *
 * Wenn der Kontext eine Vorwärts-Rechenkette enthält, wird sie
 * als interaktive Kette dargestellt — das Kind füllt jeden Schritt aus.
 */
export function TextaufgabeView({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeViewProps) {
  const daten = aufgabe.parsed as TextaufgabeDaten;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const [ketteSchritt, setKetteSchritt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;

  // Rechenkette im Kontext erkennen
  const rechenketteInfo = useMemo(
    () => detectRechenkette(daten.kontext, aufgabe.loesungsweg),
    [daten.kontext, aufgabe.loesungsweg],
  );
  const ketteTotal = rechenketteInfo ? countKetteErgebnisse(rechenketteInfo.loesungKette) : 0;

  useEffect(() => {
    setCurrentIdx(0);
    setInput('');
    setStatus('idle');
    setKetteSchritt(0);
  }, [aufgabe.titel]);

  useEffect(() => {
    if (!rechenketteInfo) inputRef.current?.focus();
  }, [currentIdx, rechenketteInfo]);

  useEffect(() => {
    onTeilaufgabeChange?.(daten.items[currentIdx]?.label ?? '');
  }, [currentIdx, daten.items, onTeilaufgabeChange]);

  // ── Rechenkette interaktiv ──────────────────────────────

  function handleKetteAntwort(_index: number, richtig: boolean) {
    if (richtig) {
      const next = ketteSchritt + 1;
      if (next >= ketteTotal) {
        // Kette vollständig → Aufgabe gelöst
        onRichtig();
      } else {
        setKetteSchritt(next);
      }
    } else {
      onFalsch();
    }
  }

  // Interaktive Rechenkette ersetzt den normalen Input-Flow
  if (rechenketteInfo) {
    return (
      <div className="space-y-3">
        {/* Kontext ohne Kettenzeile */}
        <Card className="bg-primary-light/50 border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Sachaufgabe</p>
          <MarkdownText text={rechenketteInfo.kontextOhneKette} />
        </Card>

        {/* Interaktive Rechenkette */}
        <Card>
          <p className="text-xs font-semibold text-primary mb-2">Rechenkette ausfüllen:</p>
          <RechenketteViz
            kette={rechenketteInfo.loesungKette}
            geloestBis={ketteSchritt}
            aktiverSchritt={ketteSchritt}
            interaktiv
            onAntwort={handleKetteAntwort}
          />
        </Card>
      </div>
    );
  }

  // ── Normaler Textaufgabe-Flow ───────────────────────────

  const isListAnswer = current.antwort.includes(',') && current.antwort.split(',').length > 2;

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

    const normalized = normalizeZahl(input).toLowerCase();
    const expected = normalizeZahl(current.antwort).toLowerCase();

    if (normalized === expected || expected.includes(normalized) || normalized.includes(expected)) {
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
      {/* Kontext-Text */}
      {daten.kontext && (
        <Card className="bg-primary-light/50 border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Sachaufgabe</p>
          <MarkdownText text={daten.kontext} />
        </Card>
      )}

      {/* Frage */}
      {current.frage && (
        <Card>
          <MarkdownText text={current.frage} className="text-sm font-semibold text-heading leading-relaxed" />
        </Card>
      )}

      <Card>
        <Input
          ref={inputRef}
          sizing="xl"
          inputMode={isListAnswer ? 'text' : 'decimal'}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && check()}
          placeholder="Deine Antwort"
          disabled={status === 'richtig'}
        />
      </Card>

      {daten.items.length > 1 && (
        <p className="text-xs text-muted text-center">
          Frage {currentIdx + 1} von {daten.items.length}
        </p>
      )}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={aufgabe.tipps[0]}
      >
        {status === 'richtig' && <span className="text-xs">{current.antwort}</span>}
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
