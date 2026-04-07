import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';

interface KombinationenSammlerProps {
  /** Verfügbare Elemente zum Antippen (z.B. ["2","4","7"] oder ["Ali","Jana","Tobi","Pia"]) */
  elemente: string[];
  /** Feste Elemente am Anfang (z.B. ["6"] bei Code der mit 6 beginnt) */
  prefix?: string[];
  /** Länge einer Kombination (z.B. 4 für Zahlenschloss, 2 für Paare) */
  laenge: number;
  /** true = Reihenfolge egal (Ali+Jana = Jana+Ali), false = Reihenfolge zählt */
  ohneReihenfolge?: boolean;
  /** Erwartete Anzahl Kombinationen */
  erwarteteAnzahl: number;
  /** Trennzeichen zwischen Elementen (default: "") */
  trenner?: string;
  onRichtig: () => void;
  onFalsch: () => void;
}

/**
 * KombinationenSammler — Interaktive Auflistung aller Kombinationen.
 * Kind tippt Elemente an, baut Kombinationen zusammen und sammelt sie in einer Liste.
 */
export function KombinationenSammler({
  elemente,
  prefix = [],
  laenge,
  ohneReihenfolge = false,
  erwarteteAnzahl,
  trenner = '',
  onRichtig,
  onFalsch,
}: KombinationenSammlerProps) {
  const [aktuelleAuswahl, setAktuelleAuswahl] = useState<string[]>([]);
  const [gesammelte, setGesammelte] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'duplikat' | 'falsch' | 'richtig'>('idle');
  const [fertig, setFertig] = useState(false);

  const noetigeElemente = laenge - prefix.length;

  useEffect(() => {
    setAktuelleAuswahl([]);
    setGesammelte([]);
    setFeedback('idle');
    setFertig(false);
  }, [elemente.join(','), prefix.join(','), laenge]);

  function handleElementKlick(element: string) {
    if (fertig) return;
    if (aktuelleAuswahl.length >= noetigeElemente) return;
    // Bei Permutationen: Element darf nicht doppelt vorkommen
    if (aktuelleAuswahl.includes(element)) return;
    setAktuelleAuswahl((prev) => [...prev, element]);
    setFeedback('idle');
  }

  function handleEntfernen(index: number) {
    if (fertig) return;
    setAktuelleAuswahl((prev) => prev.filter((_, i) => i !== index));
  }

  function handleZuruecksetzen() {
    setAktuelleAuswahl([]);
    setFeedback('idle');
  }

  function kombToString(auswahl: string[]): string {
    const voll = [...prefix, ...auswahl];
    return voll.join(trenner || (voll.some((e) => e.length > 2) ? ' + ' : ''));
  }

  function normalisiereKomb(auswahl: string[]): string {
    if (ohneReihenfolge) {
      return [...auswahl].sort().join('|');
    }
    return auswahl.join('|');
  }

  function handleHinzufuegen() {
    if (aktuelleAuswahl.length !== noetigeElemente) return;

    const normalisiert = normalisiereKomb(aktuelleAuswahl);
    const istDuplikat = gesammelte.some((g) => {
      // Aus dem gespeicherten String die Auswahl rekonstruieren
      const teile = g.includes(' + ')
        ? g.replace(prefix.join(''), '').split(' + ').map((s) => s.trim()).filter(Boolean)
        : g.replace(prefix.join(''), '').split('').filter(Boolean);
      return normalisiereKomb(teile) === normalisiert;
    });

    if (istDuplikat) {
      setFeedback('duplikat');
      setTimeout(() => setFeedback('idle'), 1500);
      return;
    }

    const neueKomb = kombToString(aktuelleAuswahl);
    setGesammelte((prev) => [...prev, neueKomb]);
    setAktuelleAuswahl([]);
    setFeedback('idle');
  }

  function handleFertig() {
    if (gesammelte.length === erwarteteAnzahl) {
      setFertig(true);
      setFeedback('richtig');
      onRichtig();
    } else {
      setFeedback('falsch');
      onFalsch();
      setTimeout(() => setFeedback('idle'), 1500);
    }
  }

  return (
    <div className="space-y-3">
      {/* Verfügbare Elemente */}
      <Card>
        <p className="text-xs font-semibold text-muted mb-2">Tippe die Elemente an:</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {elemente.map((el) => {
            const istGewaehlt = aktuelleAuswahl.includes(el);
            return (
              <button
                key={el}
                onClick={() => handleElementKlick(el)}
                disabled={istGewaehlt || fertig || aktuelleAuswahl.length >= noetigeElemente}
                className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-xl border-2 font-bold text-sm tabular-nums transition-all cursor-pointer disabled:cursor-default ${
                  istGewaehlt
                    ? 'bg-primary/10 border-primary/30 text-primary/40'
                    : 'bg-card border-border hover:border-primary hover:bg-primary/5 text-heading'
                }`}
              >
                {el}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Aktuelle Kombination */}
      <Card className="bg-surface">
        <div className="flex items-center gap-1 justify-center min-h-[44px]">
          {/* Prefix (fest) */}
          {prefix.map((p, i) => (
            <span key={`p${i}`} className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-bold text-muted">
              {p}
            </span>
          ))}
          {/* Gewählte Elemente */}
          {aktuelleAuswahl.map((el, i) => (
            <button
              key={`a${i}`}
              onClick={() => handleEntfernen(i)}
              className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-primary/80 transition-colors"
              title="Klicke zum Entfernen"
            >
              {el}
            </button>
          ))}
          {/* Leere Slots */}
          {Array.from({ length: noetigeElemente - aktuelleAuswahl.length }, (_, i) => (
            <span key={`e${i}`} className="w-10 h-10 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted text-sm">
              ?
            </span>
          ))}

          {/* Hinzufügen-Button */}
          {aktuelleAuswahl.length === noetigeElemente && !fertig && (
            <button
              onClick={handleHinzufuegen}
              className="ml-2 w-10 h-10 rounded-full bg-success text-white flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-success/80 transition-colors"
            >
              +
            </button>
          )}
        </div>
        {aktuelleAuswahl.length > 0 && !fertig && (
          <button onClick={handleZuruecksetzen} className="text-[10px] text-muted cursor-pointer hover:underline block mx-auto mt-1">
            zurücksetzen
          </button>
        )}
      </Card>

      {/* Gesammelte Kombinationen */}
      {gesammelte.length > 0 && (
        <Card>
          <p className="text-xs font-semibold text-heading mb-2">
            Gefundene Möglichkeiten ({gesammelte.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gesammelte.map((k, i) => (
              <span
                key={i}
                className={`text-xs font-mono px-2 py-1 rounded-lg tabular-nums ${
                  fertig ? 'bg-success-bg text-success' : 'bg-primary-light text-primary'
                }`}
              >
                {i + 1}. {k}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Feedback */}
      <FeedbackBanner
        typ={feedback === 'idle' ? null : feedback === 'richtig' ? 'richtig' : 'falsch'}
        hinweis={
          feedback === 'duplikat'
            ? 'Diese Kombination hast du schon gefunden!'
            : feedback === 'falsch'
              ? `Du hast ${gesammelte.length} Möglichkeiten gefunden, aber es gibt ${erwarteteAnzahl}. Suche weiter!`
              : undefined
        }
      >
        {feedback === 'richtig' && (
          <span className="text-xs">Alle {erwarteteAnzahl} Möglichkeiten gefunden!</span>
        )}
      </FeedbackBanner>

      {/* Fertig-Button */}
      {!fertig && gesammelte.length > 0 && (
        <Button className="w-full" onClick={handleFertig}>
          Fertig — ich habe alle {gesammelte.length} gefunden
        </Button>
      )}
    </div>
  );
}
