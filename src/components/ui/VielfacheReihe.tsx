import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

interface VielfacheReiheProps {
  /** Zahlen deren Vielfache notiert werden sollen, z.B. [5, 10] */
  zahlen: number[];
  /** Anzahl Vielfache pro Reihe (default: 10) */
  anzahl?: number;
  /** true = nach dem Ausfüllen gemeinsame Vielfache einkreisen */
  mitEinkreisen?: boolean;
  onRichtig: () => void;
  onFalsch: () => void;
}

/**
 * VielfacheReihe — Interaktive Übung zum Notieren von Vielfachen.
 * Phase 1: 10 Einzelfelder pro Zahlenreihe ausfüllen.
 * Phase 2 (optional): Gemeinsame Vielfache durch Antippen einkreisen.
 */
export function VielfacheReihe({
  zahlen,
  anzahl = 10,
  mitEinkreisen = false,
  onRichtig,
  onFalsch,
}: VielfacheReiheProps) {
  // Phase 1: Felder ausfüllen
  const [werte, setWerte] = useState<Record<number, string[]>>(() => {
    const init: Record<number, string[]> = {};
    for (const z of zahlen) init[z] = Array(anzahl).fill('');
    return init;
  });
  const [phase, setPhase] = useState<'eingabe' | 'einkreisen' | 'fertig'>('eingabe');
  const [fehler, setFehler] = useState<Record<number, boolean[]>>({});
  const [status, setStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  // Phase 2: Einkreisen
  const [eingekreist, setEingekreist] = useState<Set<number>>(new Set());
  const [kreisStatus, setKreisStatus] = useState<'idle' | 'richtig' | 'falsch'>('idle');

  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Erwartete Vielfache berechnen
  const erwartet: Record<number, number[]> = {};
  for (const z of zahlen) {
    erwartet[z] = Array.from({ length: anzahl }, (_, i) => z * (i + 1));
  }

  // Gemeinsame Vielfache berechnen
  const gemeinsame = mitEinkreisen
    ? erwartet[zahlen[0]].filter((v) => zahlen.every((z) => erwartet[z].includes(v)))
    : [];

  function handleChange(zahl: number, idx: number, value: string) {
    // Nur Zahlen erlauben
    if (value && !/^\d*$/.test(value)) return;
    setWerte((prev) => {
      const next = { ...prev };
      next[zahl] = [...prev[zahl]];
      next[zahl][idx] = value;
      return next;
    });
    setStatus('idle');

    // Auto-Focus nächstes Feld
    if (value && value.length >= String(zahl * (idx + 1)).length) {
      const nextKey = `${zahl}-${idx + 1}`;
      const nextInput = inputRefs.current.get(nextKey);
      if (nextInput) {
        setTimeout(() => nextInput.focus(), 50);
      }
    }
  }

  function handleKeyDown(zahl: number, idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !werte[zahl][idx] && idx > 0) {
      const prevKey = `${zahl}-${idx - 1}`;
      inputRefs.current.get(prevKey)?.focus();
    }
    if (e.key === 'Enter') pruefeEingabe();
  }

  function pruefeEingabe() {
    let alleRichtig = true;
    const neueFehler: Record<number, boolean[]> = {};

    for (const z of zahlen) {
      neueFehler[z] = [];
      for (let i = 0; i < anzahl; i++) {
        const eingabe = parseInt(werte[z][i], 10);
        const korrekt = eingabe === erwartet[z][i];
        neueFehler[z].push(!korrekt);
        if (!korrekt) alleRichtig = false;
      }
    }

    setFehler(neueFehler);

    if (alleRichtig) {
      setStatus('richtig');
      if (mitEinkreisen) {
        // Weiter zu Phase 2
        setTimeout(() => setPhase('einkreisen'), 800);
      } else {
        onRichtig();
      }
    } else {
      setStatus('falsch');
      onFalsch();
    }
  }

  function toggleKreis(wert: number) {
    if (kreisStatus === 'richtig') return;
    setEingekreist((prev) => {
      const next = new Set(prev);
      if (next.has(wert)) next.delete(wert);
      else next.add(wert);
      return next;
    });
    setKreisStatus('idle');
  }

  function pruefeKreise() {
    const gewaehlte = [...eingekreist].sort((a, b) => a - b);
    const erw = [...gemeinsame].sort((a, b) => a - b);

    if (gewaehlte.length === erw.length && gewaehlte.every((v, i) => v === erw[i])) {
      setKreisStatus('richtig');
      onRichtig();
    } else {
      setKreisStatus('falsch');
      onFalsch();
    }
  }

  // Auto-Focus erstes Feld
  useEffect(() => {
    const firstKey = `${zahlen[0]}-0`;
    inputRefs.current.get(firstKey)?.focus();
  }, [zahlen]);

  // ── Phase 2: Einkreisen ──
  if (phase === 'einkreisen') {
    return (
      <div className="space-y-3">
        <Card>
          <p className="text-sm font-semibold text-heading">
            Kreise die gemeinsamen Vielfachen ein!
          </p>
          <p className="text-xs text-muted mt-1">
            Tippe auf die Zahlen, die in beiden Reihen vorkommen.
          </p>
        </Card>

        {/* Reihen mit allen Vielfachen */}
        {zahlen.map((z) => (
          <Card key={z} className="overflow-x-auto">
            <p className="text-xs font-bold text-primary mb-2">V{z}:</p>
            <div className="flex gap-1.5 flex-wrap">
              {erwartet[z].map((wert) => {
                const istGemeinsam = gemeinsame.includes(wert);
                const istGekreist = eingekreist.has(wert);
                const istRichtigGekreist = kreisStatus === 'richtig' && istGemeinsam;

                return (
                  <button
                    key={wert}
                    onClick={() => toggleKreis(wert)}
                    disabled={kreisStatus === 'richtig'}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold tabular-nums transition-all cursor-pointer disabled:cursor-default ${
                      istGekreist
                        ? 'ring-3 ring-primary bg-primary/10 text-primary'
                        : istRichtigGekreist
                          ? 'ring-3 ring-success bg-success/10 text-success'
                          : 'bg-card border border-border text-body hover:border-primary/40'
                    }`}
                  >
                    {wert}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        <FeedbackBanner
          typ={kreisStatus === 'idle' ? null : kreisStatus}
          hinweis={`Die gemeinsamen Vielfachen von ${zahlen.join(' und ')} sind die Zahlen, die in BEIDEN Reihen vorkommen.`}
        >
          {kreisStatus === 'richtig' && (
            <span className="text-xs">Gemeinsame Vielfache: {gemeinsame.join(', ')}</span>
          )}
        </FeedbackBanner>

        {kreisStatus !== 'richtig' && (
          <Button className="w-full" onClick={pruefeKreise}>Prüfen</Button>
        )}
      </div>
    );
  }

  // ── Phase 1: Felder ausfüllen ──
  return (
    <div className="space-y-3">
      {zahlen.map((z) => (
        <Card key={z} className="overflow-x-auto">
          <p className="text-xs font-bold text-primary mb-2">
            Vielfache von {z}:
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: anzahl }, (_, i) => {
              const refKey = `${z}-${i}`;
              const hatFehler = fehler[z]?.[i];
              const istRichtig = status === 'richtig';

              return (
                <input
                  key={i}
                  ref={(el) => { if (el) inputRefs.current.set(refKey, el); }}
                  inputMode="numeric"
                  value={werte[z][i]}
                  onChange={(e) => handleChange(z, i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(z, i, e)}
                  disabled={istRichtig}
                  placeholder={`${i + 1}.`}
                  className={`w-11 h-11 text-center text-sm font-bold tabular-nums border-2 rounded-lg focus:outline-none transition-colors ${
                    istRichtig
                      ? 'bg-success-bg border-success/40 text-success'
                      : hatFehler
                        ? 'bg-warning-bg border-warning/40 text-warning'
                        : 'bg-white border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
              );
            })}
          </div>
        </Card>
      ))}

      <FeedbackBanner
        typ={status === 'idle' ? null : status}
        hinweis={`Zähle in ${zahlen[0]}er-Schritten: ${zahlen[0]}, ${zahlen[0] * 2}, ${zahlen[0] * 3}...`}
      />

      {status !== 'richtig' && (
        <Button className="w-full" onClick={pruefeEingabe}>Prüfen</Button>
      )}
    </div>
  );
}
