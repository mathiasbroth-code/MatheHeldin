/**
 * MultiplikationZerlegung — Nachbau der Fredo-Tafel „Multiplikation durch Zerlegen" (S. 15).
 * Ersetzt das Buchscan-Bild „s15-multiplikation-zerlegung.webp".
 */

import React from 'react';

interface Zeile {
  a: string;
  op: string;
  b: string;
  ergebnis: string;
  fett?: boolean;
}

interface Beispiel {
  tabs: [string, string];
  platzhalter: string;
  zeilen: Zeile[];
}

const BEISPIELE: Beispiel[] = [
  {
    tabs: ['6 · 81', '6 · 79'],
    platzhalter: '474',
    zeilen: [
      { a: '6', op: '·', b: '80', ergebnis: '480' },
      { a: '6', op: '·', b: '1', ergebnis: '6' },
      { a: '480', op: '−', b: '6', ergebnis: '474', fett: true },
    ],
  },
  {
    tabs: ['7 · 59', '7 · 61'],
    platzhalter: '427',
    zeilen: [
      { a: '7', op: '·', b: '60', ergebnis: '420' },
      { a: '7', op: '·', b: '1', ergebnis: '7' },
      { a: '420', op: '+', b: '7', ergebnis: '427', fett: true },
    ],
  },
];

const BG = 'bg-emerald-900';

function TafelBeispiel({ b }: { b: Beispiel }) {
  return (
    <div className="flex-1 min-w-[150px]">
      {/* Tabs — zentriert, gleiche Farbe, Lücke zur Tafel */}
      <div className="flex justify-center gap-2">
        {b.tabs.map((tab, i) => (
          <span
            key={i}
            className={`${BG} px-3 py-1 text-[13px] font-bold tabular-nums rounded-lg text-white ${
              i === 1 ? 'opacity-60' : ''
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Lücke */}
      <div className="h-1.5" />

      {/* Tafel */}
      <div className={`${BG} rounded-xl px-4 py-3 text-white`}>
        {/* Platzhalter */}
        <div className="flex items-center gap-1 text-emerald-300 text-[13px] mb-2 justify-center">
          <span className="inline-block w-5 h-4 bg-emerald-700 rounded" />
          <span className="px-0.5">·</span>
          <span className="inline-block w-5 h-4 bg-emerald-700 rounded" />
          <span className="px-0.5">=</span>
          <span className="tabular-nums">{b.platzhalter}</span>
        </div>

        {/* Rechnung */}
        <table className="mx-auto tabular-nums" style={{ borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
          <colgroup>
            <col style={{ width: 32 }} />
            <col style={{ width: 14 }} />
            <col style={{ width: 24 }} />
            <col style={{ width: 14 }} />
            <col style={{ width: 32 }} />
          </colgroup>
          <tbody>
            {b.zeilen.map((z, i) => (
              <React.Fragment key={i}>
                {z.fett && (
                  <tr>
                    <td colSpan={5} className="py-0.5">
                      <div className="border-t border-emerald-500" />
                    </td>
                  </tr>
                )}
                <tr style={{ fontSize: 13, lineHeight: '22px' }} className={z.fett ? 'font-bold' : ''}>
                  <td style={{ textAlign: 'right' }}>{z.a}</td>
                  <td style={{ textAlign: 'center' }}>{z.op}</td>
                  <td style={{ textAlign: 'right' }}>{z.b}</td>
                  <td style={{ textAlign: 'center' }}>=</td>
                  <td style={{ textAlign: 'right' }}>{z.ergebnis}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MultiplikationZerlegung() {
  return (
    <div className="flex gap-4">
      {BEISPIELE.map((b) => (
        <TafelBeispiel key={b.tabs[0]} b={b} />
      ))}
    </div>
  );
}
