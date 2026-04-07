/**
 * Stufenleiter für Datenmengen: Byte → KB → MB → GB → TB
 * Ähnlich wie EinheitenLeiter, angepasst für digitale Größen.
 */

const STUFEN = [
  { kuerzel: 'TB', name: 'Terabyte', faktor: '1.000 GB' },
  { kuerzel: 'GB', name: 'Gigabyte', faktor: '1.000 MB' },
  { kuerzel: 'MB', name: 'Megabyte', faktor: '1.000 KB' },
  { kuerzel: 'KB', name: 'Kilobyte', faktor: '1.000 B' },
  { kuerzel: 'B', name: 'Byte', faktor: '' },
];

export function DatenmengenLeiter() {
  return (
    <div className="flex flex-col items-center gap-0">
      {STUFEN.map((stufe, i) => (
        <div key={stufe.kuerzel} className="flex items-center gap-2">
          {/* Stufe */}
          <div
            className={`w-20 py-1.5 text-center rounded-lg border text-xs font-bold
              ${i === 2 ? 'bg-primary text-white border-primary' : 'bg-card text-heading border-border'}
            `}
          >
            {stufe.kuerzel}
          </div>
          {/* Faktor-Pfeil */}
          {stufe.faktor && (
            <span className="text-[9px] text-muted">
              = {stufe.faktor}
            </span>
          )}
        </div>
      ))}
      {/* Umrechnungspfeile */}
      <div className="flex gap-8 mt-1">
        <span className="text-[9px] text-primary font-semibold">
          ↑ ×1.000
        </span>
        <span className="text-[9px] text-primary font-semibold">
          ↓ :1.000
        </span>
      </div>
    </div>
  );
}
