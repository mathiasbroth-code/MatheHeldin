/**
 * HalbschriftlicheDivision — Interaktive halbschriftliche Division.
 * Kind zerlegt den Dividenden in gut teilbare Teile und rechnet schrittweise.
 * Akzeptiert verschiedene korrekte Zerlegungen.
 *
 * Optional: Multiple-Choice Vielfache-Auswahl für den ersten Schritt.
 */

import { useState, useRef, useEffect } from 'react';
import { normalizeZahl } from '@/aufgaben/parserHelpers';

interface Zeile {
  teilDividend: number;
  teilErgebnis: number;
}

interface HalbschriftlicheProps {
  dividend: number;
  divisor: number;
  /** Optional: Vielfache zur Auswahl für den ersten Schritt */
  vielfacheAuswahl?: number[];
  onRichtig: () => void;
  onFalsch: () => void;
}

type InputPhase = 'teilzahl' | 'ergebnis';

export function HalbschriftlicheDivision({ dividend, divisor, vielfacheAuswahl, onRichtig, onFalsch }: HalbschriftlicheProps) {
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [restDividend, setRestDividend] = useState(dividend);
  const [inputPhase, setInputPhase] = useState<InputPhase>('teilzahl');
  const [teilzahlInput, setTeilzahlInput] = useState('');
  const [ergebnisInput, setErgebnisInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'falsch'>('idle');
  const [fertig, setFertig] = useState(false);
  const [mcDone, setMcDone] = useState(!vielfacheAuswahl);
  const [aktiveTeilzahl, setAktiveTeilzahl] = useState<number | null>(null);
  const teilzahlRef = useRef<HTMLInputElement>(null);
  const ergebnisRef = useRef<HTMLInputElement>(null);

  const gesamtErgebnis = zeilen.reduce((sum, z) => sum + z.teilErgebnis, 0);
  const hatRest = fertig && restDividend > 0 && restDividend < divisor;

  useEffect(() => {
    setZeilen([]);
    setRestDividend(dividend);
    setInputPhase('teilzahl');
    setTeilzahlInput('');
    setErgebnisInput('');
    setFeedback('idle');
    setFertig(false);
    setMcDone(!vielfacheAuswahl);
    setAktiveTeilzahl(null);
  }, [dividend, divisor, vielfacheAuswahl]);

  useEffect(() => {
    if (inputPhase === 'teilzahl' && mcDone) teilzahlRef.current?.focus();
    if (inputPhase === 'ergebnis') ergebnisRef.current?.focus();
  }, [inputPhase, mcDone, zeilen.length]);

  function handleMcWahl(wert: number) {
    if (wert > restDividend) {
      onFalsch();
      return;
    }
    if (wert % divisor !== 0) {
      onFalsch();
      return;
    }
    setAktiveTeilzahl(wert);
    setTeilzahlInput(String(wert));
    setInputPhase('ergebnis');
    setMcDone(true);
  }

  function pruefeTeilzahl() {
    const wert = parseInt(normalizeZahl(teilzahlInput), 10);
    if (isNaN(wert) || wert <= 0) {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => setFeedback('idle'), 500);
      return;
    }
    if (wert > restDividend) {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => setFeedback('idle'), 500);
      return;
    }
    if (wert % divisor !== 0) {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => setFeedback('idle'), 500);
      return;
    }
    setAktiveTeilzahl(wert);
    setInputPhase('ergebnis');
  }

  function pruefeErgebnis() {
    if (aktiveTeilzahl == null) return;
    const eingabe = parseInt(normalizeZahl(ergebnisInput), 10);
    const erwartet = aktiveTeilzahl / divisor;

    if (eingabe === erwartet) {
      const neueZeile: Zeile = { teilDividend: aktiveTeilzahl, teilErgebnis: erwartet };
      const neuerRest = restDividend - aktiveTeilzahl;

      setZeilen((prev) => [...prev, neueZeile]);
      setRestDividend(neuerRest);
      setAktiveTeilzahl(null);
      setTeilzahlInput('');
      setErgebnisInput('');

      if (neuerRest === 0 || neuerRest < divisor) {
        setFertig(true);
        onRichtig();
      } else {
        setInputPhase('teilzahl');
      }
    } else {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => { setErgebnisInput(''); setFeedback('idle'); }, 500);
    }
  }

  // ── MC-Auswahl ────────────────────────────────────────
  if (!mcDone && vielfacheAuswahl) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-bold text-heading text-center tabular-nums">
          {dividend} : {divisor} = ?
        </p>
        <p className="text-xs text-muted text-center">Welches Vielfache wählst du für den ersten Rechenschritt?</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {vielfacheAuswahl.map((w) => (
            <button
              key={w}
              onClick={() => handleMcWahl(w)}
              className="px-2.5 py-1.5 rounded-lg border-2 border-border bg-white text-xs font-bold tabular-nums hover:border-primary cursor-pointer min-h-[36px]"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Haupt-Layout ──────────────────────────────────────
  return (
    <div className="space-y-2">
      {/* Aufgabe oben */}
      <div className="text-center">
        <span className="text-sm font-bold tabular-nums text-heading">
          {dividend} : {divisor} ={' '}
          {fertig ? (
            <>
              <span className="text-primary">{gesamtErgebnis}</span>
              {hatRest && <span className="text-red-500 ml-1">R {restDividend}</span>}
            </>
          ) : (
            <span className="text-muted">___</span>
          )}
        </span>
      </div>

      {/* Abgeschlossene Zeilen */}
      {zeilen.map((z, i) => (
        <div key={i} className="flex items-center justify-center gap-1 text-sm tabular-nums">
          <span className="font-bold text-heading min-w-[48px] text-right">{z.teilDividend}</span>
          <span className="text-muted">:</span>
          <span className="text-muted">{divisor}</span>
          <span className="text-muted">=</span>
          <span className="font-bold text-primary min-w-[36px]">{z.teilErgebnis}</span>
        </div>
      ))}

      {/* Aktive Eingabe-Zeile */}
      {!fertig && (
        <div className="flex items-center justify-center gap-1 text-sm">
          {inputPhase === 'teilzahl' ? (
            <>
              <input
                ref={teilzahlRef}
                value={teilzahlInput}
                onChange={(e) => { setTeilzahlInput(e.target.value); if (feedback === 'falsch') setFeedback('idle'); }}
                onKeyDown={(e) => e.key === 'Enter' && teilzahlInput && pruefeTeilzahl()}
                inputMode="numeric"
                placeholder={String(restDividend)}
                className={`w-16 text-center text-sm font-bold border-2 rounded-lg py-1 tabular-nums outline-none ${
                  feedback === 'falsch' ? 'border-red-400 bg-red-50' : 'border-primary bg-white'
                }`}
              />
              <span className="text-muted">: {divisor} =</span>
              <span className="text-muted">___</span>
            </>
          ) : (
            <>
              <span className="font-bold text-heading min-w-[48px] text-right">{aktiveTeilzahl}</span>
              <span className="text-muted">: {divisor} =</span>
              <input
                ref={ergebnisRef}
                value={ergebnisInput}
                onChange={(e) => { setErgebnisInput(e.target.value); if (feedback === 'falsch') setFeedback('idle'); }}
                onKeyDown={(e) => e.key === 'Enter' && ergebnisInput && pruefeErgebnis()}
                inputMode="numeric"
                placeholder="?"
                className={`w-12 text-center text-sm font-bold border-2 rounded-lg py-1 tabular-nums outline-none ${
                  feedback === 'falsch' ? 'border-red-400 bg-red-50' : 'border-primary bg-white'
                }`}
              />
            </>
          )}
        </div>
      )}

      {/* Rest-Info */}
      {!fertig && zeilen.length > 0 && (
        <p className="text-[10px] text-muted text-center">
          Verbleibend: {restDividend}
        </p>
      )}

      {/* Summen-Zeile bei Abschluss */}
      {fertig && zeilen.length > 1 && (
        <div className="flex items-center justify-center gap-1 text-xs text-muted border-t border-border pt-1">
          <span>{zeilen.map((z) => z.teilErgebnis).join(' + ')}</span>
          <span>=</span>
          <span className="font-bold text-primary">{gesamtErgebnis}</span>
        </div>
      )}

      {/* Feedback */}
      {feedback === 'falsch' && (
        <p className="text-center text-xs text-red-500 font-semibold">Nicht ganz — versuch es nochmal!</p>
      )}

      {/* OK-Button */}
      {!fertig && (
        <div className="flex justify-center">
          <button
            onClick={inputPhase === 'teilzahl' ? pruefeTeilzahl : pruefeErgebnis}
            disabled={inputPhase === 'teilzahl' ? !teilzahlInput : !ergebnisInput}
            className="px-4 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg disabled:opacity-40 cursor-pointer min-h-[32px]"
          >
            Prüfen
          </button>
        </div>
      )}
    </div>
  );
}
