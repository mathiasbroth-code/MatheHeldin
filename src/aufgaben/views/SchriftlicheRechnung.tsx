import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

export interface SchriftlicheDaten {
  operanden: string[];
  operator: '+' | '−' | '·' | ':';
  typ: 'addition' | 'subtraktion' | 'multiplikation' | 'division';
}

export interface SchriftlicheRechnungProps extends SchriftlicheDaten {
  interaktiv?: boolean;
  onRichtig?: () => void;
  onFalsch?: () => void;
}

/**
 * Erkennt schriftliche Rechenaufgaben anhand stageId und extrahiert
 * Operanden + Operator aus der Einzel-Frage (z.B. "463 + 215").
 */
export function parseSchriftlicheRechnung(
  stageId: string,
  aufgabenstellung: string,
  teilFrage?: string,
): SchriftlicheDaten | null {
  if (!stageId.includes('schriftlich-') || stageId.includes('halbschriftlich-')) {
    return null;
  }

  const quelle = teilFrage ?? aufgabenstellung;

  const rechnungMatch = quelle.match(
    /(\d[\d.]*)\s*([+\-−·*:÷])\s*(\d[\d.]*)(?:\s*[+\-−·*:÷]\s*(\d[\d.]*))?/,
  );
  if (!rechnungMatch) return null;

  const rawOp = rechnungMatch[2];
  let operator: SchriftlicheDaten['operator'];
  let typ: SchriftlicheDaten['typ'];

  if (rawOp === '+') { operator = '+'; typ = 'addition'; }
  else if (rawOp === '-' || rawOp === '−') { operator = '−'; typ = 'subtraktion'; }
  else if (rawOp === '·' || rawOp === '*') { operator = '·'; typ = 'multiplikation'; }
  else if (rawOp === ':' || rawOp === '÷') { operator = ':'; typ = 'division'; }
  else return null;

  const operanden = [rechnungMatch[1], rechnungMatch[3]];
  if (rechnungMatch[4]) operanden.push(rechnungMatch[4]);

  return { operanden, operator, typ };
}

// ── Hilfsfunktionen ──────────────────────────────────────────────

function ohneTPunkte(s: string): string {
  return s.replace(/\./g, '');
}

function mitTPunkten(s: string): string {
  return parseInt(ohneTPunkte(s), 10).toLocaleString('de-DE');
}

/** Berechnet das Ergebnis aus Operanden und Operator */
function berechneErgebnis(operanden: string[], operator: string): number {
  const zahlen = operanden.map((o) => parseInt(ohneTPunkte(o), 10));
  switch (operator) {
    case '+': return zahlen.reduce((a, b) => a + b, 0);
    case '−': return zahlen[0] - (zahlen[1] ?? 0);
    case '·': return zahlen.reduce((a, b) => a * b, 1);
    case ':': return zahlen[1] ? Math.floor(zahlen[0] / zahlen[1]) : 0;
    default: return 0;
  }
}

/** Berechnet Überträge für Addition (pro Spalte von rechts) */
function berechneUebertraege(operanden: string[], ergebnis: string): number[] {
  const rein = operanden.map(ohneTPunkte);
  const maxLen = Math.max(...rein.map((s) => s.length), ergebnis.length);
  const carries: number[] = new Array(maxLen + 1).fill(0);

  let carry = 0;
  for (let col = 0; col < maxLen; col++) {
    let sum = carry;
    for (const r of rein) {
      const idx = r.length - 1 - col;
      sum += idx >= 0 ? parseInt(r[idx], 10) : 0;
    }
    carry = Math.floor(sum / 10);
    carries[col + 1] = carry;
  }
  return carries;
}

// ── Render-Komponente ────────────────────────────────────────────

export function SchriftlicheRechnung(props: SchriftlicheRechnungProps) {
  const { typ, interaktiv } = props;

  if (typ === 'division') {
    return <DivisionsAufstellung {...props} />;
  }
  if (interaktiv) {
    return <InteraktiveAufstellung {...props} />;
  }
  return <StatischeAufstellung {...props} />;
}

// ── Statische Aufstellung (wie bisher) ──────────────────────────

function StatischeAufstellung({ operanden, operator }: SchriftlicheRechnungProps) {
  const rein = operanden.map(ohneTPunkte);
  const maxLen = Math.max(...rein.map((s) => s.length));
  const padded = rein.map((s) => s.padStart(maxLen, ' '));

  return (
    <Card className="py-2 px-3">
      <div className="flex justify-center">
        <div className="inline-flex flex-col items-end font-mono tabular-nums text-lg font-bold text-heading">
          {padded.map((zeile, zIdx) => (
            <div key={zIdx} className="flex items-center">
              <span className="w-6 text-center text-primary shrink-0">
                {zIdx === padded.length - 1 ? operator : ''}
              </span>
              <div className="flex">
                {zeile.split('').map((ch, cIdx) => (
                  <span key={cIdx} className="w-7 text-center">
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center">
            <span className="w-6 shrink-0" />
            <div className="border-t-2 border-heading" style={{ width: `${maxLen * 1.75}rem` }} />
          </div>
          <div className="flex items-center">
            <span className="w-6 text-center text-muted shrink-0">=</span>
            <div className="flex">
              {Array.from({ length: maxLen }).map((_, i) => (
                <span key={i} className="w-7 text-center text-muted/40">?</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted text-center mt-1">
        {operanden.map(mitTPunkten).join(` ${operator} `)}
      </p>
    </Card>
  );
}

// ── Interaktive Aufstellung ─────────────────────────────────────

function InteraktiveAufstellung({ operanden, operator, onRichtig, onFalsch }: SchriftlicheRechnungProps) {
  const ergebnis = berechneErgebnis(operanden, operator);
  const ergebnisStr = String(Math.abs(ergebnis));

  const rein = operanden.map(ohneTPunkte);
  const maxLen = Math.max(...rein.map((s) => s.length));
  const resultLen = Math.max(ergebnisStr.length, maxLen);
  const padded = rein.map((s) => s.padStart(resultLen, ' '));
  const ergebnisPadded = ergebnisStr.padStart(resultLen, ' ');

  // Überträge nur bei Addition
  const uebertraege = operator === '+' ? berechneUebertraege(operanden, ergebnisStr) : [];

  const [digits, setDigits] = useState<string[]>(new Array(resultLen).fill(''));
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset bei neuen Operanden
  useEffect(() => {
    setDigits(new Array(resultLen).fill(''));
    setStatus('idle');
    // Focus auf rechteste Box (Einer)
    setTimeout(() => inputRefs.current[resultLen - 1]?.focus(), 100);
  }, [operanden.join(','), resultLen]);

  const handleDigitChange = useCallback((idx: number, value: string) => {
    if (status === 'richtig') return;
    if (status === 'falsch') setStatus('idle');

    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;

      // Auto-focus: nach links (nächsthöhere Stelle)
      if (digit && idx > 0) {
        // Finde nächste leere oder die nächste Box links
        const nextIdx = idx - 1;
        setTimeout(() => inputRefs.current[nextIdx]?.focus(), 50);
      }

      // Prüfe ob alle relevanten Ziffern gefüllt
      const allFilled = next.every((d, i) => d !== '' || ergebnisPadded[i] === ' ');
      if (allFilled) {
        const eingabe = next.map((d, i) => d || (ergebnisPadded[i] === ' ' ? '' : '?')).join('');
        const expected = ergebnisPadded.replace(/ /g, '');
        const actual = eingabe.replace(/ /g, '');
        if (actual === expected) {
          setStatus('richtig');
          onRichtig?.();
        } else {
          setStatus('falsch');
          onFalsch?.();
          // Reset nach Verzögerung
          setTimeout(() => {
            setDigits(new Array(resultLen).fill(''));
            setStatus('idle');
            inputRefs.current[resultLen - 1]?.focus();
          }, 1500);
        }
      }
      return next;
    });
  }, [ergebnisPadded, resultLen, status, onRichtig, onFalsch]);

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx < resultLen - 1) {
      // Leere Box + Backspace → nach rechts
      inputRefs.current[idx + 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && idx < resultLen - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }, [digits, resultLen]);

  // Welche Übertrag-Spalten sichtbar? Nur wenn die Ziffer rechts davon schon eingegeben
  const sichtbareUebertraege = uebertraege.map((carry, colFromRight) => {
    if (carry === 0) return 0;
    // Spalte colFromRight → Index von rechts
    const digitIdx = resultLen - 1 - (colFromRight - 1);
    if (digitIdx >= 0 && digitIdx < resultLen && digits[digitIdx]) return carry;
    return 0;
  });

  return (
    <Card className="py-3 px-3">
      <div className="flex justify-center">
        <div className="inline-flex flex-col items-end font-mono tabular-nums text-lg font-bold text-heading">
          {/* Übertrag-Zeile */}
          {uebertraege.length > 0 && (
            <div className="flex items-center">
              <span className="w-6 shrink-0" />
              <div className="flex">
                {Array.from({ length: resultLen }).map((_, i) => {
                  const colFromRight = resultLen - 1 - i;
                  const carry = sichtbareUebertraege[colFromRight + 1] ?? 0;
                  return (
                    <span key={i} className="w-7 text-center text-[10px] text-primary/60 font-normal h-4">
                      {carry > 0 ? carry : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Operanden */}
          {padded.map((zeile, zIdx) => (
            <div key={zIdx} className="flex items-center">
              <span className="w-6 text-center text-primary shrink-0">
                {zIdx === padded.length - 1 ? operator : ''}
              </span>
              <div className="flex">
                {zeile.split('').map((ch, cIdx) => (
                  <span key={cIdx} className="w-7 text-center">
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Linie */}
          <div className="flex items-center">
            <span className="w-6 shrink-0" />
            <div className="border-t-2 border-heading" style={{ width: `${resultLen * 1.75}rem` }} />
          </div>

          {/* Interaktive Ergebnis-Zeile */}
          <div className="flex items-center">
            <span className="w-6 text-center text-muted shrink-0">=</span>
            <div className="flex">
              {Array.from({ length: resultLen }).map((_, i) => {
                const isLeerstelle = ergebnisPadded[i] === ' ';
                if (isLeerstelle) {
                  return <span key={i} className="w-7 text-center">{'\u00A0'}</span>;
                }
                const isCorrect = status === 'richtig';
                return (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isCorrect}
                    className={`w-7 h-8 text-center text-lg font-bold border rounded
                      focus:outline-none focus:ring-2 transition-colors
                      ${isCorrect
                        ? 'bg-success-bg border-success text-success'
                        : status === 'falsch'
                          ? 'border-warning bg-warning/10'
                          : 'border-border focus:border-primary focus:ring-primary/20'
                      }
                      ${digits[i] ? 'bg-white' : 'bg-card'}
                    `}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis="Rechne Stelle für Stelle von rechts nach links. Vergiss den Übertrag nicht!"
      >
        {status === 'richtig' && (
          <span className="tabular-nums">{mitTPunkten(ergebnisStr)}</span>
        )}
      </FeedbackBanner>

      <p className="text-[10px] text-muted text-center mt-1">
        {operanden.map(mitTPunkten).join(` ${operator} `)} = ?
      </p>
    </Card>
  );
}

// ── Division (bleibt statisch) ──────────────────────────────────

function DivisionsAufstellung({ operanden }: SchriftlicheRechnungProps) {
  const dividend = operanden[0];
  const divisor = operanden[1];

  return (
    <Card className="py-2 px-3">
      <div className="flex justify-center">
        <div className="inline-flex items-baseline gap-2 font-mono tabular-nums text-lg font-bold text-heading">
          <span>{mitTPunkten(ohneTPunkte(dividend))}</span>
          <span className="text-primary">:</span>
          <span>{mitTPunkten(ohneTPunkte(divisor))}</span>
          <span className="text-primary">=</span>
          <span className="text-muted/40">?</span>
        </div>
      </div>
      <p className="text-[10px] text-muted text-center mt-1">
        Dividiere Stelle fuer Stelle von links nach rechts
      </p>
    </Card>
  );
}
