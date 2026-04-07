/**
 * SchriftlicheDivision — Interaktive schriftliche Division auf Kästchenpapier.
 * Kind tippt Ergebnis-Ziffer + Subtraktions-Rest pro Stelle, genau wie im Fredo-Buch.
 *
 * Layout: Blaues Kästchenraster, T/H/Z/E Header, stellengenaue Darstellung.
 */

import { useState, useRef, useEffect } from 'react';

// ── Algorithmus ─────────────────────────────────────────

export interface DivSchritt {
  /** Die Zahl die dividiert wird (z.B. 36, 3, 32) */
  aktuellerWert: number;
  /** Ergebnis-Ziffer für diese Stelle (z.B. 9, 0, 8) */
  ergebnisZiffer: number;
  /** Produkt: ergebnisZiffer × divisor */
  produkt: number;
  /** Rest nach Subtraktion */
  rest: number;
}

export function berechneDivisionSchritte(dividend: number, divisor: number): { schritte: DivSchritt[]; endrest: number } {
  const ziffern = String(dividend).split('').map(Number);
  const schritte: DivSchritt[] = [];
  let uebertrag = 0;

  for (let i = 0; i < ziffern.length; i++) {
    const aktuellerWert = uebertrag * 10 + ziffern[i];
    const ergebnisZiffer = Math.floor(aktuellerWert / divisor);
    const produkt = ergebnisZiffer * divisor;
    const rest = aktuellerWert - produkt;

    schritte.push({ aktuellerWert, ergebnisZiffer, produkt, rest });
    uebertrag = rest;
  }

  return { schritte, endrest: uebertrag };
}

// ── Stellenwert-Labels ──────────────────────────────────

const STELLEN = ['M', 'HT', 'ZT', 'T', 'H', 'Z', 'E'];

function stellenLabels(anzahl: number): string[] {
  return STELLEN.slice(STELLEN.length - anzahl);
}

// ── Kästchen-Komponente ─────────────────────────────────

function Kaestchen({ children, aktiv, className = '' }: { children: React.ReactNode; aktiv?: boolean; className?: string }) {
  return (
    <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold border border-sky-200 ${
      aktiv ? 'bg-white ring-2 ring-primary' : 'bg-sky-50/30'
    } ${className}`}>
      {children}
    </div>
  );
}

function KaestchenInput({ value, onChange, onSubmit, aktiv }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  aktiv: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aktiv) requestAnimationFrame(() => ref.current?.focus());
  }, [aktiv]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, '').slice(-2);
        onChange(v);
      }}
      onKeyDown={(e) => e.key === 'Enter' && value && onSubmit()}
      inputMode="numeric"
      className="w-8 h-8 text-sm font-bold text-center border-2 border-primary bg-white rounded-none outline-none ring-2 ring-primary/30 tabular-nums"
      style={{ caretColor: 'transparent' }}
    />
  );
}

// ── Haupt-Komponente ────────────────────────────────────

interface SchriftlicheDivisionProps {
  dividend: number;
  divisor: number;
  /** Optional: MC-Auswahl für den ersten Rechenschritt */
  ersteZahlAuswahl?: number[];
  /** Probe nach Abschluss: Kind berechnet Ergebnis × Divisor (+ Rest) */
  mitProbe?: boolean;
  onRichtig: () => void;
  onFalsch: () => void;
}

type Phase = 'ergebnis' | 'rest';

export function SchriftlicheDivision({ dividend, divisor, ersteZahlAuswahl, mitProbe, onRichtig, onFalsch }: SchriftlicheDivisionProps) {
  const { schritte, endrest } = berechneDivisionSchritte(dividend, divisor);
  const dividendStr = String(dividend);
  const labels = stellenLabels(dividendStr.length);
  const ergebnisLabels = stellenLabels(dividendStr.length);

  const [schritt, setSchritt] = useState(0);
  const [phase, setPhase] = useState<Phase>('ergebnis');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'richtig' | 'falsch'>('idle');
  const [mcDone, setMcDone] = useState(!ersteZahlAuswahl);
  const [fertig, setFertig] = useState(false);
  const [probePhase, setProbePhase] = useState(false);
  const [probeInput, setProbeInput] = useState('');
  const ergebnis = schritte.reduce((acc, s, i) => acc + s.ergebnisZiffer * Math.pow(10, schritte.length - 1 - i), 0);

  // Reset bei neuer Aufgabe
  useEffect(() => {
    setSchritt(0);
    setPhase('ergebnis');
    setInput('');
    setFeedback('idle');
    setMcDone(!ersteZahlAuswahl);
    setFertig(false);
  }, [dividend, divisor, ersteZahlAuswahl]);

  function pruefen() {
    const current = schritte[schritt];
    const eingabe = parseInt(input, 10);

    if (phase === 'ergebnis') {
      if (eingabe === current.ergebnisZiffer) {
        setFeedback('richtig');
        setTimeout(() => {
          setPhase('rest');
          setInput('');
          setFeedback('idle');
        }, 300);
      } else {
        setFeedback('falsch');
        onFalsch();
        setTimeout(() => { setInput(''); setFeedback('idle'); }, 500);
      }
    } else {
      // Phase 'rest'
      if (eingabe === current.rest) {
        setFeedback('richtig');
        setTimeout(() => {
          if (schritt < schritte.length - 1) {
            setSchritt((s) => s + 1);
            setPhase('ergebnis');
            setInput('');
            setFeedback('idle');
          } else {
            setFertig(true);
            if (mitProbe) {
              setProbePhase(true);
              setInput('');
            } else {
              onRichtig();
            }
          }
        }, 300);
      } else {
        setFeedback('falsch');
        onFalsch();
        setTimeout(() => { setInput(''); setFeedback('idle'); }, 500);
      }
    }
  }

  function handleMcWahl(wert: number) {
    const ersteZiffer = Math.floor(wert / divisor);
    if (schritte[0] && ersteZiffer === schritte[0].ergebnisZiffer) {
      setMcDone(true);
      // Ersten Schritt auto-ausfüllen
      setSchritt(0);
      setPhase('rest');
    } else {
      onFalsch();
    }
  }

  // ── MC-Auswahl für ersten Schritt ────────────────────
  if (!mcDone && ersteZahlAuswahl) {
    return (
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm font-bold text-heading tabular-nums">
            {dividendStr} : {divisor} = ?
          </p>
          <p className="text-xs text-muted mt-1">Welche Zahl wählst du für den ersten Rechenschritt?</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {ersteZahlAuswahl.map((w) => (
            <button
              key={w}
              onClick={() => handleMcWahl(w)}
              className="px-3 py-1.5 rounded-lg border-2 border-border bg-white text-sm font-bold tabular-nums hover:border-primary cursor-pointer min-w-[44px] min-h-[36px]"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Kästchenpapier-Raster ─────────────────────────────
  return (
    <div className="space-y-2">
      {/* Header + Aufgabe */}
      <div className="flex items-end gap-1 justify-center">
        {/* Stellenwert-Header + Dividend */}
        <div>
          <div className="flex">
            {labels.map((l, i) => (
              <Kaestchen key={`h${i}`} className="text-[9px] text-sky-500 font-semibold border-sky-300 bg-sky-100/50">{l}</Kaestchen>
            ))}
          </div>
          <div className="flex">
            {dividendStr.split('').map((z, i) => (
              <Kaestchen key={`d${i}`}>{z}</Kaestchen>
            ))}
          </div>
        </div>

        {/* : Divisor = */}
        <div className="flex items-center gap-1 h-8 px-1">
          <span className="text-sm font-bold text-primary">:</span>
          <span className="text-sm font-bold tabular-nums">{divisor}</span>
          <span className="text-sm font-bold text-primary">=</span>
        </div>

        {/* Ergebnis-Kästchen */}
        <div>
          <div className="flex">
            {ergebnisLabels.map((l, i) => (
              <Kaestchen key={`eh${i}`} className="text-[9px] text-sky-500 font-semibold border-sky-300 bg-sky-100/50">{l}</Kaestchen>
            ))}
          </div>
          <div className="flex">
            {schritte.map((s, i) => {
              const geloest = i < schritt || (i === schritt && phase === 'rest') || fertig;
              const istAktiv = i === schritt && phase === 'ergebnis' && !fertig;
              return (
                <Kaestchen key={`e${i}`} aktiv={istAktiv}>
                  {geloest ? <span className="text-primary">{s.ergebnisZiffer}</span> : ''}
                </Kaestchen>
              );
            })}
            {/* Rest-Anzeige */}
            {fertig && endrest > 0 && (
              <div className="flex items-center h-8 ml-1">
                <span className="text-sm font-bold text-red-500">R {endrest}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rechenschritte (unterhalb des Dividenden) */}
      <div className="flex justify-center">
        <div className="space-y-0.5">
          {schritte.map((s, i) => {
            const sichtbar = i < schritt || (i === schritt && (phase === 'rest' || fertig));
            const restSichtbar = i < schritt || (i === schritt && fertig) || (i < schritt);
            const istRestAktiv = i === schritt && phase === 'rest' && !fertig;

            if (i > schritt && !fertig) return null;

            return (
              <div key={i} className="space-y-0.5">
                {/* Minus + Produkt */}
                {sichtbar && (
                  <div className="flex items-center">
                    <span className="w-4 text-right text-xs text-muted">−</span>
                    <span className="text-sm font-bold tabular-nums ml-1">{s.produkt}</span>
                  </div>
                )}
                {/* Trennlinie */}
                {sichtbar && (
                  <div className="ml-4 border-t border-gray-400 w-12" />
                )}
                {/* Rest (eingeben oder anzeigen) */}
                {(sichtbar || istRestAktiv) && (
                  <div className="flex items-center ml-4">
                    {istRestAktiv ? (
                      <KaestchenInput
                        value={input}
                        onChange={setInput}
                        onSubmit={pruefen}
                        aktiv
                      />
                    ) : restSichtbar ? (
                      <span className="text-sm font-bold tabular-nums">
                        {s.rest}
                        {/* Runtergeholt: nächste Ziffer */}
                        {i < schritte.length - 1 && (
                          <span className="text-muted">{dividendStr[i + 1]}</span>
                        )}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eingabe für Ergebnis-Ziffer (wenn Phase = ergebnis) */}
      {!fertig && phase === 'ergebnis' && (
        <div className="flex justify-center items-center gap-2">
          <span className="text-xs text-muted">
            {schritte[schritt].aktuellerWert} : {divisor} =
          </span>
          <KaestchenInput
            value={input}
            onChange={setInput}
            onSubmit={pruefen}
            aktiv
          />
          <button
            onClick={pruefen}
            disabled={!input}
            className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg disabled:opacity-40 cursor-pointer min-h-[32px]"
          >
            OK
          </button>
        </div>
      )}

      {/* Eingabe für Rest (Button) */}
      {!fertig && phase === 'rest' && (
        <div className="flex justify-center items-center gap-2">
          <span className="text-xs text-muted">
            {schritte[schritt].aktuellerWert} − {schritte[schritt].produkt} =
          </span>
          <button
            onClick={pruefen}
            disabled={!input}
            className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg disabled:opacity-40 cursor-pointer min-h-[32px]"
          >
            OK
          </button>
        </div>
      )}

      {/* Probe */}
      {probePhase && (
        <div className="mt-3 p-3 border-2 border-amber-300 rounded-xl bg-amber-50 space-y-2">
          <p className="text-xs font-bold text-amber-700">Probe: Ergebnis × Divisor {endrest > 0 ? '+ Rest ' : ''}= Dividend?</p>
          <div className="flex items-center gap-1 justify-center text-sm tabular-nums">
            <span className="font-bold">{ergebnis} × {divisor}</span>
            {endrest > 0 && <span className="font-bold"> + {endrest}</span>}
            <span className="text-muted">=</span>
            <input
              value={probeInput}
              onChange={(e) => setProbeInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && probeInput) {
                  const eingabe = parseInt(probeInput, 10);
                  if (eingabe === dividend) {
                    onRichtig();
                  } else {
                    onFalsch();
                    setProbeInput('');
                  }
                }
              }}
              inputMode="numeric"
              placeholder="?"
              className="w-20 text-center text-sm font-bold border-2 border-primary rounded-lg py-1 outline-none"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback === 'falsch' && (
        <p className="text-center text-xs text-red-500 font-semibold">Noch nicht ganz — versuch es nochmal!</p>
      )}
    </div>
  );
}
