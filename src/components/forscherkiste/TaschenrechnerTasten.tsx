/**
 * TaschenrechnerTasten — Nachbau des Fredo-Bilds „Taschenrechner-Tasten" (S. 134).
 * Zeigt einen stilisierten Schulrechner (links) mit Tastenlegende (rechts).
 * Layout exakt wie im Original: 5 Spalten, Operatoren rechts.
 */

// ── Tasten-Layout: 5 Spalten × 5 Zeilen ────────────────
// Jede Zelle: [label, stil]
// Stile: 'on'|'off'|'ce'|'num'|'op'|'eq'|'fn'|''

type TastenStil = 'on' | 'off' | 'ce' | 'num' | 'op' | 'eq' | 'fn' | '';

const LAYOUT: [string, TastenStil][][] = [
  [['ON', 'on'], ['OFF', 'off'], ['', ''], ['', ''], ['', '']],
  [['√', 'fn'], ['7', 'num'], ['8', 'num'], ['9', 'num'], ['+', 'op']],
  [[',', 'fn'], ['4', 'num'], ['5', 'num'], ['6', 'num'], ['−', 'op']],
  [['CE', 'ce'], ['1', 'num'], ['2', 'num'], ['3', 'num'], ['×', 'op']],
  [['', ''], ['', ''], ['0', 'num'], ['=', 'eq'], ['÷', 'op']],
];

const STIL_KLASSEN: Record<TastenStil, string> = {
  on: 'bg-emerald-200 text-emerald-800 border-emerald-300',
  off: 'bg-red-200 text-red-800 border-red-300',
  ce: 'bg-amber-200 text-amber-800 border-amber-300',
  num: 'bg-white text-gray-800 border-gray-300',
  op: 'bg-blue-100 text-blue-800 border-blue-200',
  eq: 'bg-teal-100 text-teal-800 border-teal-200',
  fn: 'bg-gray-200 text-gray-700 border-gray-300',
  '': '',
};

// ── Legende (rechts neben dem Rechner) ──────────────────

const LEGENDE_LINKS: { taste: string; label: string; stil: TastenStil }[] = [
  { taste: 'ON', label: 'einschalten', stil: 'on' },
  { taste: 'OFF', label: 'ausschalten', stil: 'off' },
  { taste: 'CE', label: 'löschen\n(clear/empty)', stil: 'ce' },
  { taste: ',', label: 'Komma', stil: 'fn' },
];

const LEGENDE_RECHTS: { taste: string; label: string; stil: TastenStil }[] = [
  { taste: '+', label: 'addieren', stil: 'op' },
  { taste: '−', label: 'subtrahieren', stil: 'op' },
  { taste: '×', label: 'multiplizieren', stil: 'op' },
  { taste: '÷', label: 'dividieren', stil: 'op' },
  { taste: '=', label: 'Gleichheitszeichen', stil: 'eq' },
];

// ── Komponente ──────────────────────────────────────────

export function TaschenrechnerTasten() {
  return (
    <div className="flex gap-5 items-start justify-center flex-wrap">
      {/* Rechner */}
      <div className="bg-gray-100 rounded-2xl p-3 pb-4 border border-gray-300 w-[160px] shrink-0 shadow-sm">
        {/* Solarpanel */}
        <div className="flex gap-0.5 justify-center mb-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-6 h-2.5 bg-gradient-to-b from-gray-600 to-gray-400 rounded-sm" />
          ))}
        </div>

        {/* Display */}
        <div className="bg-emerald-50 border-2 border-gray-400 rounded-md px-2 py-2 mb-3 text-right font-mono text-lg text-gray-800">
          0
        </div>

        {/* Tasten-Grid: 5 Spalten */}
        <div className="grid grid-cols-5 gap-1">
          {LAYOUT.flat().map(([label, stil], i) => {
            if (!label) return <div key={i} />;
            return (
              <div
                key={i}
                className={`flex items-center justify-center rounded-md text-[11px] font-bold h-[26px] border shadow-sm ${STIL_KLASSEN[stil]}`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legende — zwei Spalten wie im Original */}
      <div className="flex gap-4 pt-1">
        {/* Linke Spalte: ON, OFF, CE, Komma */}
        <div className="space-y-2">
          {LEGENDE_LINKS.map(({ taste, label, stil }) => (
            <div key={taste} className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-8 h-6 rounded-md text-[11px] font-bold border shadow-sm shrink-0 ${STIL_KLASSEN[stil]}`}>
                {taste}
              </span>
              <span className="text-xs text-body whitespace-pre-line leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Rechte Spalte: +, −, ×, ÷, = */}
        <div className="space-y-2">
          {LEGENDE_RECHTS.map(({ taste, label, stil }) => (
            <div key={taste} className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-8 h-6 rounded-md text-[11px] font-bold border shadow-sm shrink-0 ${STIL_KLASSEN[stil]}`}>
                {taste}
              </span>
              <span className="text-xs text-body">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
