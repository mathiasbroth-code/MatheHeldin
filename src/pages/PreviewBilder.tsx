import { BruchMerkkasten } from '@/components/ui/BruchKreis';
import { KreisMerkkasten } from '@/components/geometrie/KreisMerkkasten';
import { PascalDreieck } from '@/components/forscherkiste/PascalDreieck';
import { TaschenrechnerTasten } from '@/components/forscherkiste/TaschenrechnerTasten';
import { MillionenWuerfel } from '@/components/dienes/MillionenWuerfel';
import { MultiplikationZerlegung } from '@/components/ui/MultiplikationZerlegung';
import { SkizzeMerkkasten } from '@/components/ui/SkizzeMerkkasten';
import { UngleichungenMerkkasten } from '@/components/ui/UngleichungenMerkkasten';

/**
 * Preview-Seite: Zeigt alle erklaerungsBilder mit SVG-Ersatz nebeneinander.
 * Nur für Entwicklung — nicht für Endnutzer.
 */
export default function PreviewBilder() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-xl font-bold text-heading">Erklärungsbilder — Original vs. SVG</h1>

      {/* ── DONE ─────────────────────────────────────────── */}
      <Section titel="Bereits ersetzt" badge="done">
        <Vergleich
          name="s92-merkkasten-brueche.webp"
          info="8× (Kap. 09 Alltagsbrüche)"
          bild="/assets/erklaerungen/s92-merkkasten-brueche.webp"
        >
          <BruchMerkkasten />
        </Vergleich>

        <Vergleich
          name="s104-merkkasten-kreis-radius.webp"
          info="8× (Kap. 10 Kreise)"
          bild="/assets/erklaerungen/s104-merkkasten-kreis-radius.webp"
        >
          <KreisMerkkasten />
        </Vergleich>

        <Vergleich
          name="s138-pascalsches-dreieck.webp"
          info="6× (Kap. 14 Forscherkiste)"
          bild="/assets/erklaerungen/s138-pascalsches-dreieck.webp"
        >
          <PascalDreieck />
        </Vergleich>

        <Vergleich
          name="s20-millionenwuerfel-intro.webp"
          info="7× (Kap. 02 Zahlen bis Million)"
          bild="/assets/erklaerungen/s20-millionenwuerfel-intro.webp"
        >
          <MillionenWuerfel />
        </Vergleich>

        <Vergleich
          name="s134-taschenrechner-tasten.webp"
          info="1× (Kap. 14 Forscherkiste)"
          bild="/assets/erklaerungen/s134-taschenrechner-tasten.webp"
        >
          <TaschenrechnerTasten />
        </Vergleich>

        <Vergleich
          name="s15-multiplikation-zerlegung.webp"
          info="7× (Kap. 01 Wiederholung)"
          bild="/assets/erklaerungen/s15-multiplikation-zerlegung.webp"
        >
          <MultiplikationZerlegung />
        </Vergleich>

        <Vergleich
          name="s70-skizze-intro.webp"
          info="7× (Kap. 06 Skizzen)"
          bild="/assets/erklaerungen/s70-skizze-intro.webp"
        >
          <SkizzeMerkkasten />
        </Vergleich>

        <Vergleich
          name="s47-regel-ungleichungen.webp"
          info="8× tippBilder (Kap. 03 Ungleichungen)"
          bild="/assets/erklaerungen/s47-regel-ungleichungen.webp"
        >
          <UngleichungenMerkkasten />
        </Vergleich>
      </Section>

      {/* ── Entfernt ──────────────────────────────────────── */}
      <Section titel="Entfernt (nicht mehr genutzt)" badge="no">
        <NurBild
          name="s16-waldhotel.webp"
          info="7× (Kap. 01) — Referenz entfernt"
          bild="/assets/erklaerungen/s16-waldhotel.webp"
        />
      </Section>
    </div>
  );
}

// ── Hilfskomponenten ──────────────────────────────────

function Section({ titel, badge, children }: { titel: string; badge: 'done' | 'no'; children: React.ReactNode }) {
  const colors = {
    done: 'bg-emerald-100 text-emerald-800',
    no: 'bg-gray-100 text-gray-600',
  };
  return (
    <div>
      <h2 className="text-sm font-bold text-muted border-b border-border pb-1 mb-3 flex items-center gap-2">
        {titel}
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[badge]}`}>
          {badge === 'done' ? 'DONE' : 'SKIP'}
        </span>
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Vergleich({ name, info, bild, children }: { name: string; info: string; bild: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm font-bold text-heading">{name}</p>
      <p className="text-xs text-muted mb-3">{info}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Original (Bitmap)</p>
          <img src={bild} alt={name} className="rounded-lg border border-border w-full" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">SVG-Ersatz</p>
          <div className="border border-primary/20 rounded-lg p-3 bg-primary-light/30 min-h-[100px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function NurBild({ name, info, bild }: { name: string; info: string; bild: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm font-bold text-heading">{name}</p>
      <p className="text-xs text-muted mb-2">{info}</p>
      <img src={bild} alt={name} className="rounded-lg border border-border max-w-full" />
    </div>
  );
}
