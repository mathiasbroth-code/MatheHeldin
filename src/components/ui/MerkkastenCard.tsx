import type { MerkkastenDaten } from '@/aufgaben/types';
import { Card } from './Card';

interface MerkkastenCardProps {
  daten: MerkkastenDaten;
  className?: string;
}

/**
 * Rendert einen Merkkasten aus dem Fredo-Buch als gestylte Karte.
 * Ersetzt die bisherigen Buch-Screenshot-Bilder durch scharfen, nativen Text.
 *
 * Zwei Varianten:
 * - begriffe: Vokabelliste mit optionalen Abkürzungen (HT, ZT, T, H, Z, E)
 * - regel: Merksatz in rotem Rahmen
 */
export function MerkkastenCard({ daten, className = '' }: MerkkastenCardProps) {
  if (daten.typ === 'regel' && daten.text) {
    return (
      <Card className={`border-red-300 bg-red-50 ${className}`}>
        <div className="flex gap-2 items-start">
          <span className="text-red-500 text-lg shrink-0">❗</span>
          <p className="text-sm text-heading font-medium leading-relaxed whitespace-pre-line">
            {daten.text}
          </p>
        </div>
      </Card>
    );
  }

  if (daten.typ === 'begriffe' && daten.begriffe) {
    return (
      <Card className={`border-gray-300 bg-gray-50 ${className}`}>
        <div className="flex gap-2 items-start">
          <span className="text-gray-400 text-lg shrink-0">💬</span>
          <div className="space-y-0.5">
            {daten.begriffe.map((b, i) => (
              <p key={i} className="text-sm leading-relaxed">
                <span className="text-muted">{b.term.split(' ').slice(0, -1).join(' ')} </span>
                <span className="font-bold text-heading">{b.term.split(' ').pop()}</span>
                {b.abbrev && (
                  <span className="ml-1.5 text-primary font-bold">{b.abbrev}</span>
                )}
              </p>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
