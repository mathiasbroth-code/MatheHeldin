import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

interface Begriff {
  wort: string;
  erklaerung: string;
  beispiel: string;
  kategorie: 'zahlen' | 'rechnen' | 'geometrie' | 'groessen' | 'daten';
}

const KATEGORIE_FARBE: Record<string, string> = {
  zahlen: 'bg-sky-100 text-sky-700',
  rechnen: 'bg-amber-100 text-amber-700',
  geometrie: 'bg-indigo-100 text-indigo-700',
  groessen: 'bg-emerald-100 text-emerald-700',
  daten: 'bg-purple-100 text-purple-700',
};

const KATEGORIE_LABEL: Record<string, string> = {
  zahlen: 'Zahlen',
  rechnen: 'Rechnen',
  geometrie: 'Geometrie',
  groessen: 'Größen',
  daten: 'Daten',
};

const BEGRIFFE: Begriff[] = [
  // ── Zahlen ──
  { wort: 'Stellenwert', erklaerung: 'Der Wert einer Ziffer hängt von ihrer Position ab. In 345 hat die 3 den Stellenwert Hunderter.', beispiel: '4.567 = 4T + 5H + 6Z + 7E', kategorie: 'zahlen' },
  { wort: 'Nachbarzahlen', erklaerung: 'Die Zahlen direkt vor und nach einer Zahl. Bei Zehner-Nachbarn sind es die nächsten vollen Zehner.', beispiel: 'Nachbar-Zehner von 34: 30 und 40', kategorie: 'zahlen' },
  { wort: 'Runden', erklaerung: 'Eine Zahl vereinfachen. Ab 5 aufrunden, unter 5 abrunden.', beispiel: '347 ≈ 350 (auf Zehner)', kategorie: 'zahlen' },
  { wort: 'Römische Zahlen', erklaerung: 'Zahlzeichen der alten Römer: I=1, V=5, X=10, L=50, C=100, D=500, M=1.000.', beispiel: 'XIV = 14, MCMXCIX = 1.999', kategorie: 'zahlen' },
  { wort: 'Primzahl', erklaerung: 'Eine Zahl, die nur durch 1 und sich selbst teilbar ist.', beispiel: '2, 3, 5, 7, 11, 13, 17, 19, 23 ...', kategorie: 'zahlen' },
  { wort: 'Fibonacci-Folge', erklaerung: 'Jede Zahl ist die Summe der beiden vorherigen. Startet mit 1, 1.', beispiel: '1, 1, 2, 3, 5, 8, 13, 21, 34 ...', kategorie: 'zahlen' },
  { wort: 'Pascalsches Dreieck', erklaerung: 'Ein Zahlendreieck: Jede Zahl ist die Summe der zwei darüber.', beispiel: '1 / 1 1 / 1 2 1 / 1 3 3 1', kategorie: 'zahlen' },
  { wort: 'Binärsystem', erklaerung: 'Zahlensystem mit nur 0 und 1. Computer rechnen so.', beispiel: '5 = 101, 10 = 1010', kategorie: 'zahlen' },

  // ── Rechnen ──
  { wort: 'Summe', erklaerung: 'Das Ergebnis einer Addition.', beispiel: '3 + 4 = 7 (7 ist die Summe)', kategorie: 'rechnen' },
  { wort: 'Differenz', erklaerung: 'Das Ergebnis einer Subtraktion.', beispiel: '9 − 4 = 5 (5 ist die Differenz)', kategorie: 'rechnen' },
  { wort: 'Produkt', erklaerung: 'Das Ergebnis einer Multiplikation.', beispiel: '3 · 4 = 12 (12 ist das Produkt)', kategorie: 'rechnen' },
  { wort: 'Quotient', erklaerung: 'Das Ergebnis einer Division.', beispiel: '12 : 4 = 3 (3 ist der Quotient)', kategorie: 'rechnen' },
  { wort: 'Dividend', erklaerung: 'Die Zahl, die geteilt wird.', beispiel: '12 : 4 = 3 (12 ist der Dividend)', kategorie: 'rechnen' },
  { wort: 'Divisor', erklaerung: 'Die Zahl, durch die geteilt wird.', beispiel: '12 : 4 = 3 (4 ist der Divisor)', kategorie: 'rechnen' },
  { wort: 'Übertrag', erklaerung: 'Wenn eine Stelle mehr als 9 ergibt, wird 1 zur nächsten Stelle übertragen.', beispiel: '7 + 8 = 15 → 5 hinschreiben, 1 Übertrag', kategorie: 'rechnen' },
  { wort: 'Teiler', erklaerung: 'Eine Zahl, die ohne Rest in eine andere passt.', beispiel: 'Teiler von 12: 1, 2, 3, 4, 6, 12', kategorie: 'rechnen' },
  { wort: 'Vielfaches', erklaerung: 'Entsteht durch Multiplikation mit einer ganzen Zahl.', beispiel: 'Vielfache von 3: 3, 6, 9, 12, 15 ...', kategorie: 'rechnen' },
  { wort: 'Überschlag', erklaerung: 'Schnelles Schätzen durch Runden. Hilft zu prüfen, ob das Ergebnis stimmen kann.', beispiel: '298 + 412 ≈ 300 + 400 = 700', kategorie: 'rechnen' },
  { wort: 'Gleichung', erklaerung: 'Zwei Seiten, die gleich viel wert sind, verbunden mit =.', beispiel: '▢ + 5 = 12 → ▢ = 7', kategorie: 'rechnen' },

  // ── Geometrie ──
  { wort: 'Achsensymmetrie', erklaerung: 'Eine Figur ist achsensymmetrisch, wenn sie an einer Linie gespiegelt auf sich selbst fällt.', beispiel: 'Ein Schmetterling ist achsensymmetrisch', kategorie: 'geometrie' },
  { wort: 'Umfang', erklaerung: 'Die Länge des Randes einer Figur. Wie weit eine Ameise um die Figur laufen müsste.', beispiel: 'Rechteck 4×3: U = 2·4 + 2·3 = 14 cm', kategorie: 'geometrie' },
  { wort: 'Flächeninhalt', erklaerung: 'Wie viel Platz eine Figur einnimmt. Wird in cm² gemessen.', beispiel: 'Rechteck 4×3: A = 4·3 = 12 cm²', kategorie: 'geometrie' },
  { wort: 'Rauminhalt', erklaerung: 'Wie viel Platz ein Körper einnimmt. Wird in cm³ gemessen.', beispiel: 'Würfel 3×3×3: V = 27 cm³', kategorie: 'geometrie' },
  { wort: 'Parkettierung', erklaerung: 'Formen so anordnen, dass keine Lücken und keine Überlappungen entstehen.', beispiel: 'Quadrate, Dreiecke und Sechsecke können parkettieren', kategorie: 'geometrie' },
  { wort: 'Körpernetz', erklaerung: 'Wenn man einen 3D-Körper aufklappt, entsteht ein flaches Netz.', beispiel: 'Ein Würfelnetz hat 6 Quadrate in Kreuzform', kategorie: 'geometrie' },
  { wort: 'Maßstab', erklaerung: 'Verhältnis zwischen Zeichnung und Wirklichkeit.', beispiel: '1:100 bedeutet: 1 cm auf der Karte = 100 cm in echt', kategorie: 'geometrie' },
  { wort: 'Parallel', erklaerung: 'Zwei Linien, die immer gleich weit auseinander sind und sich nie treffen.', beispiel: 'Eisenbahnschienen sind parallel', kategorie: 'geometrie' },
  { wort: 'Senkrecht', erklaerung: 'Zwei Linien, die einen rechten Winkel (90°) bilden.', beispiel: 'Wand und Fußboden sind senkrecht', kategorie: 'geometrie' },

  // ── Größen ──
  { wort: 'Tonne', erklaerung: 'Maßeinheit für schwere Dinge. 1 Tonne = 1.000 Kilogramm.', beispiel: 'Ein Auto wiegt etwa 1,5 t', kategorie: 'groessen' },
  { wort: 'Kilogramm', erklaerung: 'Maßeinheit für Gewicht. 1 kg = 1.000 Gramm.', beispiel: 'Eine Packung Zucker wiegt 1 kg', kategorie: 'groessen' },
  { wort: 'Liter', erklaerung: 'Maßeinheit für Flüssigkeiten. 1 Liter = 1.000 Milliliter.', beispiel: 'Eine Wasserflasche hat 1,5 l', kategorie: 'groessen' },
  { wort: 'Bruch', erklaerung: 'Ein Teil eines Ganzen. Oben der Zähler (wie viele Teile), unten der Nenner (in wie viele Teile geteilt).', beispiel: '3/4 = drei Viertel', kategorie: 'groessen' },

  // ── Daten ──
  { wort: 'Diagramm', erklaerung: 'Eine Zeichnung, die Zahlen als Bild zeigt. Zum Beispiel Balken oder Kreise.', beispiel: 'Balkendiagramm zeigt Lieblingsfarben der Klasse', kategorie: 'daten' },
  { wort: 'Strichliste', erklaerung: 'Zählen mit Strichen. Jeder fünfte Strich geht quer durch die vier davor.', beispiel: '𝍸 𝍸 || = 12', kategorie: 'daten' },
  { wort: 'Häufigkeit', erklaerung: 'Wie oft etwas vorkommt.', beispiel: 'E kommt im Deutschen am häufigsten vor', kategorie: 'daten' },
  { wort: 'Wahrscheinlichkeit', erklaerung: 'Wie sicher etwas passiert. Sicher, möglich oder unmöglich.', beispiel: 'Würfel: 6 werfen ist möglich (1 von 6)', kategorie: 'daten' },
  { wort: 'Kombinatorik', erklaerung: 'Zählen von Möglichkeiten. Wie viele Kombinationen gibt es?', beispiel: '3 T-Shirts, 2 Hosen → 6 Outfits', kategorie: 'daten' },
  { wort: 'Datenmengen', erklaerung: 'Wie viel Speicher digitale Daten brauchen: Byte, KB, MB, GB.', beispiel: '1 GB = 1.000 MB = 1.000.000 KB', kategorie: 'daten' },
];

export function Lexikon() {
  const navigate = useNavigate();
  const [suche, setSuche] = useState('');

  const gefiltert = useMemo(() => {
    const q = suche.toLowerCase();
    return BEGRIFFE
      .filter((b) => !q || b.wort.toLowerCase().includes(q) || b.erklaerung.toLowerCase().includes(q))
      .sort((a, b) => a.wort.localeCompare(b.wort, 'de'));
  }, [suche]);

  return (
    <AppShell>
      <Header
        title="Mathe-Lexikon"
        onBack={() => navigate('/ueben')}
      />

      <div className="px-4 pb-6 space-y-3">
        {/* Suchfeld */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Begriff suchen ..."
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl text-sm
              focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white"
          />
        </div>

        <p className="text-xs text-muted text-center">
          {gefiltert.length} {gefiltert.length === 1 ? 'Begriff' : 'Begriffe'}
        </p>

        {/* Begriffe */}
        {gefiltert.map((b) => (
          <Card key={b.wort} className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-heading flex-1">{b.wort}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${KATEGORIE_FARBE[b.kategorie]}`}>
                {KATEGORIE_LABEL[b.kategorie] ?? b.kategorie}
              </span>
            </div>
            <p className="text-xs text-body leading-relaxed">{b.erklaerung}</p>
            <p className="text-xs text-primary font-mono tabular-nums">{b.beispiel}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
