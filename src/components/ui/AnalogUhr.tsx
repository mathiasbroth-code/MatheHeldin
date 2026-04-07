/**
 * AnalogUhr — SVG-Visualisierung einer analogen Uhr.
 * Zeigt Zifferblatt mit Stunden-/Minutenzeiger.
 * Stundenzeiger bewegt sich proportional zur Minutenposition.
 */

interface AnalogUhrProps {
  /** Stunde (0-23, wird auf 12h-Format gemappt) */
  stunde: number;
  /** Minute (0-59) */
  minute: number;
  /** 5-Minuten-Zahlen (5, 10, 15…) am Rand anzeigen */
  zeigeMinutenZahlen?: boolean;
  /** Durchmesser in px (default: 220) */
  groesse?: number;
}

export function AnalogUhr({
  stunde,
  minute,
  zeigeMinutenZahlen = false,
  groesse = 220,
}: AnalogUhrProps) {
  const cx = groesse / 2;
  const cy = groesse / 2;
  const radius = groesse / 2 - 8;

  // Stundenzeiger: bewegt sich proportional (z.B. 3:30 → zwischen 3 und 4)
  const stundeNorm = stunde % 12;
  const stundenWinkel = (stundeNorm + minute / 60) * 30; // 360/12 = 30° pro Stunde
  const minutenWinkel = minute * 6; // 360/60 = 6° pro Minute

  const stundenZeigerLaenge = radius * 0.55;
  const minutenZeigerLaenge = radius * 0.78;

  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox={`0 0 ${groesse} ${groesse}`}
      aria-label={`Uhr zeigt ${stundeNorm === 0 ? 12 : stundeNorm}:${String(minute).padStart(2, '0')}`}
      className="mx-auto"
    >
      {/* Äußerer Ring */}
      <circle cx={cx} cy={cy} r={radius} fill="#fefefe" stroke="#d1d5db" strokeWidth={2.5} />

      {/* 60 Minutenstriche */}
      {Array.from({ length: 60 }, (_, i) => {
        const winkel = (i * 6 - 90) * (Math.PI / 180);
        const istStunde = i % 5 === 0;
        const aussen = radius - 3;
        const innen = istStunde ? radius - 14 : radius - 8;
        return (
          <line
            key={`t${i}`}
            x1={cx + innen * Math.cos(winkel)}
            y1={cy + innen * Math.sin(winkel)}
            x2={cx + aussen * Math.cos(winkel)}
            y2={cy + aussen * Math.sin(winkel)}
            stroke={istStunde ? '#374151' : '#9ca3af'}
            strokeWidth={istStunde ? 2.5 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Stundenzahlen 1-12 */}
      {Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        const winkel = (num * 30 - 90) * (Math.PI / 180);
        const r = radius - 26;
        return (
          <text
            key={`h${num}`}
            x={cx + r * Math.cos(winkel)}
            y={cy + r * Math.sin(winkel)}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-gray-800 font-bold select-none"
            style={{ fontSize: groesse * 0.08 }}
          >
            {num}
          </text>
        );
      })}

      {/* Optionale Minutenzahlen (5, 10, 15...) */}
      {zeigeMinutenZahlen &&
        Array.from({ length: 12 }, (_, i) => {
          const minVal = (i + 1) * 5;
          const winkel = (minVal * 6 - 90) * (Math.PI / 180);
          const r = radius - 42;
          return (
            <text
              key={`m${minVal}`}
              x={cx + r * Math.cos(winkel)}
              y={cy + r * Math.sin(winkel)}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-teal-500 select-none"
              style={{ fontSize: groesse * 0.055 }}
            >
              {minVal === 60 ? '00' : minVal}
            </text>
          );
        })}

      {/* Stundenzeiger */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + stundenZeigerLaenge * Math.sin(stundenWinkel * (Math.PI / 180))}
        y2={cy - stundenZeigerLaenge * Math.cos(stundenWinkel * (Math.PI / 180))}
        stroke="#0d9488"
        strokeWidth={groesse * 0.03}
        strokeLinecap="round"
      />

      {/* Minutenzeiger */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + minutenZeigerLaenge * Math.sin(minutenWinkel * (Math.PI / 180))}
        y2={cy - minutenZeigerLaenge * Math.cos(minutenWinkel * (Math.PI / 180))}
        stroke="#374151"
        strokeWidth={groesse * 0.02}
        strokeLinecap="round"
      />

      {/* Mittelpunkt */}
      <circle cx={cx} cy={cy} r={groesse * 0.025} fill="#0d9488" />
      <circle cx={cx} cy={cy} r={groesse * 0.012} fill="#fff" />
    </svg>
  );
}
