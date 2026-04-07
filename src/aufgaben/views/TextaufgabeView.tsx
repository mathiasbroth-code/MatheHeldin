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

/** Prüft ob ein Text eine Ketten-Vorlage mit Lücken (___/▢) und Pfeilen (→) ist. */
function istKettenVorlage(text: string): boolean {
  return /→/.test(text) && (/___/.test(text) || /▢/.test(text));
}

/** Zählt Ergebnis-Positionen anhand einer Vorlage (= Blank-Positionen). */
function countBlanks(vorlage: string): number {
  const teile = vorlage.split('→').map((s) => s.trim());
  let count = 0;
  for (const teil of teile) {
    if (/▢|___/.test(teil)) count++;
  }
  return count;
}

/** Extrahiert die Lösungskette aus loesung oder loesungsweg. */
function extractLoesungKette(loesung: string | undefined, loesungsweg: string | undefined): string | null {
  // Zuerst in loesung suchen (z.B. "120 → · 3 → 360 → + 240 → 600")
  const loesungMatch = loesung?.match(/(\d[\d.,]*(?:\s*→\s*[^→\n]+){2,})/);
  if (loesungMatch) return loesungMatch[1];
  // Fallback: loesungsweg
  const wegMatch = loesungsweg?.match(/(\d[\d.,]*(?:\s*→\s*[^→\n]+){2,})/);
  return wegMatch ? wegMatch[1] : null;
}

interface RechenketteInfo {
  loesungKette: string;
  vorlage: string;
  /** Bereinigter Kontext-Text (nur gesetzt wenn Kette im Kontext war) */
  kontextOhneKette?: string;
  /** true wenn die Kette im Frage-Feld war (statt im Kontext) */
  istFrageKette: boolean;
  anzahlBlanks: number;
}

/**
 * Erkennt eine Rechenkette mit Lücken — sucht im Kontext UND in der Frage.
 * Funktioniert für Vorwärts- und Rückwärts-Ketten.
 */
function detectRechenkette(
  kontext: string | undefined,
  frage: string | undefined,
  loesung: string | undefined,
  loesungsweg: string | undefined,
): RechenketteInfo | null {
  // 1) Kette im Kontext suchen (z.B. Schulfest: "10 → -2 → ___ → ...")
  if (kontext) {
    const lines = kontext.split('\n');
    const chainLineIdx = lines.findIndex((line) => istKettenVorlage(line.trim()));
    if (chainLineIdx !== -1) {
      const vorlage = lines[chainLineIdx].trim();
      const loesungKette = extractLoesungKette(loesung, loesungsweg);
      if (loesungKette) {
        const kontextOhneKette = lines
          .filter((_, i) => i !== chainLineIdx)
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        return { loesungKette, vorlage, kontextOhneKette, istFrageKette: false, anzahlBlanks: countBlanks(vorlage) };
      }
    }
  }

  // 2) Kette in der Frage suchen (z.B. Rückwärts: "▢ → · 3 → ▢ → + 240 → 600")
  if (frage && istKettenVorlage(frage)) {
    const loesungKette = extractLoesungKette(loesung, loesungsweg);
    if (loesungKette) {
      return { loesungKette, vorlage: frage, istFrageKette: true, anzahlBlanks: countBlanks(frage) };
    }
  }

  return null;
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

  // Rechenkette in Kontext oder Frage erkennen
  const rechenketteInfo = useMemo(
    () => detectRechenkette(daten.kontext, current?.frage, aufgabe.loesung, aufgabe.loesungsweg),
    [daten.kontext, current?.frage, aufgabe.loesung, aufgabe.loesungsweg],
  );

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
      if (next >= rechenketteInfo!.anzahlBlanks) {
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
    const kontextText = rechenketteInfo.kontextOhneKette ?? daten.kontext;
    return (
      <div className="space-y-3">
        {/* Kontext-Text */}
        {kontextText && (
          <Card className="bg-primary-light/50 border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              {rechenketteInfo.istFrageKette ? 'Aufgabe' : 'Sachaufgabe'}
            </p>
            <MarkdownText text={kontextText} />
          </Card>
        )}

        {/* Interaktive Rechenkette */}
        <Card>
          <p className="text-xs font-semibold text-primary mb-2">Rechenkette ausfüllen:</p>
          <RechenketteViz
            kette={rechenketteInfo.loesungKette}
            vorlage={rechenketteInfo.vorlage}
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

    // Exakter Vergleich + Uhrzeiten-Toleranz ("3" → "3:00")
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
