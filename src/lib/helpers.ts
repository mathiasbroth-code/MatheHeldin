/** Zufällige ganze Zahl zwischen min und max (inklusive). */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Deutsche Zahlenformatierung: 1.234,5 */
export function fmt(n: number): string {
  return n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
}

/** Zerlegt eine Zahl in Tausender, Hunderter, Zehner, Einer. */
export function digits(n: number) {
  return {
    T: Math.floor(n / 1000),
    H: Math.floor((n % 1000) / 100),
    Z: Math.floor((n % 100) / 10),
    E: n % 10,
  };
}

/** Erzeugt eine stabile Aufgaben-ID aus den gegebenen Parametern. */
export function aufgabeId(...parts: (string | number)[]): string {
  return parts.join('-');
}
