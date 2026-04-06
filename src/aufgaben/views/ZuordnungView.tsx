import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import type { ZuordnungDaten } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { MarkdownText } from './MarkdownText';

/**
 * Zuordnung-View: Interaktive Zuordnung per Button-Tap.
 * Liest aufgabe.parsed (ZuordnungDaten) — kein eigenes Parsing.
 * Fallback auf Freitext wenn keine Items/Choices/Antworten erkannt.
 */
export function ZuordnungView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const daten = aufgabe.parsed as ZuordnungDaten;

  // Fallback if parsing yielded no usable data
  if (daten.items.length === 0 || daten.choices.length === 0 || Object.keys(daten.antworten).length === 0) {
    return <ZuordnungFallback aufgabe={aufgabe} onRichtig={onRichtig} onFalsch={onFalsch} />;
  }

  return (
    <ZuordnungInteraktiv
      aufgabe={aufgabe}
      daten={daten}
      onRichtig={onRichtig}
      onFalsch={onFalsch}
    />
  );
}

function ZuordnungInteraktiv({
  aufgabe,
  daten,
  onRichtig,
  onFalsch,
}: AufgabeViewProps & { daten: ZuordnungDaten }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const [completed, setCompleted] = useState<{ item: string; choice: string; correct: boolean }[]>([]);
  const [usedChoices, setUsedChoices] = useState<Set<string>>(new Set());

  const current = daten.items[currentIdx];
  const isLast = currentIdx >= daten.items.length - 1;

  useEffect(() => {
    setCurrentIdx(0);
    setSelected(null);
    setStatus('idle');
    setCompleted([]);
    setUsedChoices(new Set());
  }, [aufgabe.titel]);

  function check() {
    if (!selected || !current) return;
    const expected = daten.antworten[current.label];
    const isCorrect = selected === expected;

    setCompleted((prev) => [
      ...prev,
      { item: `${current.label} ${current.text}`, choice: selected, correct: isCorrect },
    ]);
    setUsedChoices((prev) => new Set([...prev, selected]));

    if (isCorrect) {
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
      setSelected(null);
      setStatus('idle');
    }
  }

  const availableChoices = daten.choices.filter((c) => !usedChoices.has(c.label));

  return (
    <div className="space-y-3">
      {daten.anweisung && (
        <Card>
          <MarkdownText text={daten.anweisung} className="text-base text-heading font-semibold leading-relaxed" />
        </Card>
      )}

      {/* Erledigte Zuordnungen */}
      {completed.length > 0 && (
        <Card className="bg-success-bg/50 border-success/10">
          {completed.map((c, i) => (
            <p key={i} className={`text-xs ${c.correct ? 'text-success' : 'text-error'}`}>
              {c.correct ? '✓' : '✗'} {c.item} → {c.choice}
            </p>
          ))}
        </Card>
      )}

      {/* Aktuelles Item */}
      {current && (
        <Card className="border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">
            Zuordnung {currentIdx + 1} von {daten.items.length}
          </p>
          <p className="text-base font-bold text-heading">
            {current.label}) {current.text}
          </p>
        </Card>
      )}

      {/* Auswahl-Buttons */}
      {status !== 'richtig' && (
        <div className="grid gap-2">
          {availableChoices.map((choice) => (
            <button
              key={choice.label}
              onClick={() => setSelected(choice.label)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-colors min-h-[44px] ${
                selected === choice.label
                  ? 'border-primary bg-primary/5 text-heading font-semibold'
                  : 'border-border bg-white text-body hover:border-primary/40'
              }`}
            >
              <span className="font-bold text-primary mr-2">{choice.label})</span>
              {choice.text}
            </button>
          ))}
        </div>
      )}

      <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]} />

      <div className="flex gap-2">
        {status === 'idle' && selected && (
          <Button className="flex-1" onClick={check}>Prüfen</Button>
        )}
        {status === 'richtig' && !isLast && (
          <Button className="flex-1" onClick={next}>Nächste Zuordnung →</Button>
        )}
      </div>
    </div>
  );
}

/** Fallback: Freitext wenn interaktives Parsing nicht klappt */
function ZuordnungFallback({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  useEffect(() => {
    setInput('');
    setStatus('idle');
  }, [aufgabe.titel]);

  function check() {
    const normalized = input.trim().toLowerCase();
    const expected = aufgabe.loesung.toLowerCase();
    if (normalized && expected.includes(normalized)) {
      setStatus('richtig');
      onRichtig();
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <MarkdownText text={aufgabe.aufgabenstellung} />
      </Card>
      <Card>
        <p className="text-xs text-muted mb-1">Deine Zuordnung</p>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status === 'falsch') setStatus('idle'); }}
          placeholder="Schreibe deine Zuordnung..."
          disabled={status === 'richtig'}
          rows={3}
          className="w-full border-2 border-border rounded-xl p-3 text-sm focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white resize-none disabled:opacity-50"
        />
      </Card>
      {status === 'richtig' && (
        <Card className="bg-success-bg/50 border-success/10">
          <p className="text-xs font-semibold text-success mb-1">Lösung:</p>
          <p className="text-xs text-body whitespace-pre-line">{aufgabe.loesung}</p>
        </Card>
      )}
      <FeedbackBanner typ={status === 'idle' ? null : status} hinweis={aufgabe.tipps[0]} />
      {status !== 'richtig' && (
        <Button className="w-full" onClick={check}>Prüfen</Button>
      )}
    </div>
  );
}
