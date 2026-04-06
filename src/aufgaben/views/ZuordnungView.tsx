import { useState, useEffect } from 'react';
import type { AufgabeViewProps } from './AufgabeWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

/**
 * Zuordnung-View: Zwei Spalten, durch Antippen verbinden.
 * Vereinfachte Version: Multiple-Choice pro linkem Element.
 */
export function ZuordnungView({ aufgabe, onRichtig, onFalsch }: AufgabeViewProps) {
  // For v1: fall back to a simpler interaction — show aufgabenstellung and
  // let the user answer via text input (zuordnung content is complex/varied)
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  useEffect(() => {
    setInput('');
    setStatus('idle');
  }, [aufgabe.titel]);

  function check() {
    // Simple check: user's answer matches any part of the solution
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
        <p className="text-sm text-body whitespace-pre-line">{aufgabe.aufgabenstellung}</p>
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
