/**
 * MalTabelle — Interaktive Maltabelle für halbschriftliches Multiplizieren.
 * Zeigt ein Grid: Zeilen = Stellenwerte von Faktor 1, Spalten = Stellenwerte von Faktor 2.
 * Kind füllt die Teilprodukte aus, System berechnet Summen.
 *
 * Beispiel: 58 · 12
 *   ·  | 10 |  2 | 12
 *  50  |[__]|[__]|
 *   8  |[__]|[__]|
 *  58  |    |    |[__]
 */

import { useState, useRef, useEffect } from 'react';
import { normalizeZahl } from '@/aufgaben/parserHelpers';

interface MalTabelleProps {
  faktor1: number;
  faktor2: number;
  onRichtig: () => void;
  onFalsch: () => void;
}

/** Zerlegt eine Zahl in Stellenwerte: 58 → [50, 8], 123 → [100, 20, 3] */
function zerlege(n: number): number[] {
  const s = String(n);
  const teile: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const ziffer = parseInt(s[i], 10);
    if (ziffer > 0) {
      teile.push(ziffer * Math.pow(10, s.length - 1 - i));
    }
  }
  return teile.length > 0 ? teile : [0];
}

export function MalTabelle({ faktor1, faktor2, onRichtig, onFalsch }: MalTabelleProps) {
  const zeilen = zerlege(faktor1); // z.B. [50, 8]
  const spalten = zerlege(faktor2); // z.B. [10, 2]
  const totalFelder = zeilen.length * spalten.length;
  const erwartet = zeilen.flatMap((z) => spalten.map((s) => z * s));
  const gesamtErgebnis = faktor1 * faktor2;

  const [eingaben, setEingaben] = useState<(number | null)[]>(() => Array(totalFelder).fill(null));
  const [aktuellerIdx, setAktuellerIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'falsch'>('idle');
  const [fertig, setFertig] = useState(false);
  const [summePhase, setSummePhase] = useState(false);
  const [summeInput, setSummeInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEingaben(Array(totalFelder).fill(null));
    setAktuellerIdx(0);
    setInput('');
    setFeedback('idle');
    setFertig(false);
    setSummePhase(false);
    setSummeInput('');
  }, [faktor1, faktor2, totalFelder]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [aktuellerIdx, summePhase]);

  function pruefen() {
    const eingabe = parseInt(normalizeZahl(input), 10);
    if (eingabe === erwartet[aktuellerIdx]) {
      const neu = [...eingaben];
      neu[aktuellerIdx] = eingabe;
      setEingaben(neu);
      setInput('');
      setFeedback('idle');

      if (aktuellerIdx < totalFelder - 1) {
        setAktuellerIdx((i) => i + 1);
      } else {
        // Alle Felder ausgefüllt → Summe abfragen
        setSummePhase(true);
      }
    } else {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => { setInput(''); setFeedback('idle'); }, 500);
    }
  }

  function pruefeSumme() {
    const eingabe = parseInt(normalizeZahl(summeInput), 10);
    if (eingabe === gesamtErgebnis) {
      setFertig(true);
      onRichtig();
    } else {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => { setSummeInput(''); setFeedback('idle'); }, 500);
    }
  }

  // ── Render ────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Aufgabe */}
      <p className="text-center text-sm font-bold tabular-nums text-heading">
        {faktor1} · {faktor2} = {fertig ? <span className="text-primary">{gesamtErgebnis}</span> : '___'}
      </p>

      {/* Maltabelle */}
      <div className="flex justify-center">
        <table className="border-collapse tabular-nums text-sm">
          <thead>
            <tr>
              <th className="w-10 h-8 text-center text-xs text-muted border border-sky-200 bg-sky-50">·</th>
              {spalten.map((s) => (
                <th key={s} className="w-14 h-8 text-center font-bold border border-sky-200 bg-sky-50">{s}</th>
              ))}
              <th className="w-14 h-8 text-center font-bold border border-sky-200 bg-sky-100">{faktor2}</th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((z, zi) => {
              const zeilenSumme = spalten.reduce((sum, s) => sum + z * s, 0);
              return (
                <tr key={z}>
                  <td className="w-10 h-8 text-center font-bold border border-sky-200 bg-sky-50">{z}</td>
                  {spalten.map((s, si) => {
                    const idx = zi * spalten.length + si;
                    const wert = eingaben[idx];
                    const istAktiv = idx === aktuellerIdx && !summePhase && !fertig;

                    return (
                      <td key={`${z}-${s}`} className={`w-14 h-8 text-center border border-sky-200 ${istAktiv ? 'bg-white' : 'bg-sky-50/30'}`}>
                        {wert != null ? (
                          <span className="font-bold text-primary">{wert}</span>
                        ) : istAktiv ? (
                          <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); if (feedback === 'falsch') setFeedback('idle'); }}
                            onKeyDown={(e) => e.key === 'Enter' && input && pruefen()}
                            inputMode="numeric"
                            className={`w-full h-full text-center font-bold outline-none bg-transparent ${
                              feedback === 'falsch' ? 'text-red-500' : 'text-heading'
                            }`}
                          />
                        ) : null}
                      </td>
                    );
                  })}
                  {/* Zeilen-Summe */}
                  <td className="w-14 h-8 text-center border border-sky-200 bg-sky-100/50">
                    {eingaben.slice(zi * spalten.length, (zi + 1) * spalten.length).every((e) => e != null)
                      ? <span className="font-bold text-muted">{zeilenSumme}</span>
                      : null}
                  </td>
                </tr>
              );
            })}
            {/* Summen-Zeile */}
            <tr>
              <td className="w-10 h-8 text-center font-bold border border-sky-200 bg-sky-100">{faktor1}</td>
              {spalten.map((s, si) => {
                const spaltenSumme = zeilen.reduce((sum, z) => sum + z * s, 0);
                const alleFertig = zeilen.every((_, zi) => eingaben[zi * spalten.length + si] != null);
                return (
                  <td key={`sum-${s}`} className="w-14 h-8 text-center border border-sky-200 bg-sky-100/50">
                    {alleFertig ? <span className="font-bold text-muted">{spaltenSumme}</span> : null}
                  </td>
                );
              })}
              {/* Gesamtergebnis */}
              <td className="w-14 h-8 text-center border-2 border-sky-300 bg-sky-100 font-bold">
                {fertig ? (
                  <span className="text-primary">{gesamtErgebnis}</span>
                ) : summePhase ? (
                  <input
                    ref={inputRef}
                    value={summeInput}
                    onChange={(e) => { setSummeInput(e.target.value); if (feedback === 'falsch') setFeedback('idle'); }}
                    onKeyDown={(e) => e.key === 'Enter' && summeInput && pruefeSumme()}
                    inputMode="numeric"
                    className={`w-full h-full text-center font-bold outline-none bg-transparent ${
                      feedback === 'falsch' ? 'text-red-500' : 'text-heading'
                    }`}
                  />
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hinweis welches Feld aktiv ist */}
      {!fertig && !summePhase && aktuellerIdx < totalFelder && (
        <p className="text-center text-xs text-muted">
          {zeilen[Math.floor(aktuellerIdx / spalten.length)]} · {spalten[aktuellerIdx % spalten.length]} = ?
        </p>
      )}
      {summePhase && !fertig && (
        <p className="text-center text-xs text-muted">
          Addiere alle Teilprodukte: Was ist {faktor1} · {faktor2}?
        </p>
      )}

      {/* Feedback */}
      {feedback === 'falsch' && (
        <p className="text-center text-xs text-red-500 font-semibold">Noch nicht ganz — versuch es nochmal!</p>
      )}
    </div>
  );
}

// ── Erkennung ───────────────────────────────────────────

export function parseMalTabelle(stageId: string, text: string): { faktor1: number; faktor2: number } | null {
  if (!stageId.includes('halbschriftlich-multiplizieren')) return null;
  // "58 · 12" oder "47 · 32" im Text
  const match = text.match(/(\d+)\s*[·×]\s*(\d+)/);
  if (!match) return null;
  const f1 = parseInt(match[1], 10);
  const f2 = parseInt(match[2], 10);
  // Nur zweistellig × zweistellig (typisch für Maltabelle)
  if (f1 < 10 || f2 < 10) return null;
  return { faktor1: f1, faktor2: f2 };
}
