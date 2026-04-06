import type { BankAufgabe } from '../types';
import { Card } from '@/components/ui/Card';
import { EingabeView } from './EingabeView';
import { AuswahlView } from './AuswahlView';
import { ZuordnungView } from './ZuordnungView';
import { LueckeView } from './LueckeView';
import { ReihenfolgeView } from './ReihenfolgeView';
import { SchrittView } from './SchrittView';
import { WahrFalschView } from './WahrFalschView';
import { TextaufgabeView } from './TextaufgabeView';
import { RoutenDiagramm, parseRoutenDaten } from './RoutenDiagramm';
import { EinheitenLeiter, detectEinheitenKette } from './EinheitenLeiter';
import { DivisionsZerlegung, parseDivisionsDaten } from './DivisionsZerlegung';
import { WerteBalken, parseWerteBalken } from './WerteBalken';
import { KreiseDiagramm, parseKreiseDaten } from './KreiseDiagramm';

export interface AufgabeViewProps {
  aufgabe: BankAufgabe;
  onRichtig: () => void;
  onFalsch: () => void;
  onTeilaufgabeChange?: (label: string) => void;
}

const VIEW_MAP: Record<string, React.ComponentType<AufgabeViewProps>> = {
  eingabe: EingabeView,
  auswahl: AuswahlView,
  zuordnung: ZuordnungView,
  luecke: LueckeView,
  reihenfolge: ReihenfolgeView,
  schritt: SchrittView,
  'wahr-falsch': WahrFalschView,
  textaufgabe: TextaufgabeView,
};

interface AufgabeWrapperProps {
  aufgabe: BankAufgabe;
  onRichtig: () => void;
  onFalsch: () => void;
  onTeilaufgabeChange?: (label: string) => void;
}

/**
 * View-Dispatcher: waehlt die passende View anhand des Aufgabentyps.
 * Kein eigener State, kein TippSystem — nur Dispatch.
 * Tipps werden ausschliesslich in bankStage.tsx verwaltet.
 */
export function AufgabeWrapper({ aufgabe, onRichtig, onFalsch, onTeilaufgabeChange }: AufgabeWrapperProps) {
  const View = VIEW_MAP[aufgabe.typ];

  if (!View) {
    return (
      <Card className="text-center">
        <p className="text-muted">Aufgabentyp „{aufgabe.typ}" wird noch nicht unterstützt.</p>
      </Card>
    );
  }

  // Kaskadierte Visualisierungs-Erkennung: max. eine pro Aufgabe
  const routenDaten = parseRoutenDaten(aufgabe.aufgabenstellung);
  const einheitenDaten = !routenDaten
    ? detectEinheitenKette(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const divisionsDaten = !routenDaten && !einheitenDaten
    ? parseDivisionsDaten(aufgabe.stageId, aufgabe.aufgabenstellung)
    : null;
  const werteBalkenDaten = !routenDaten && !einheitenDaten && !divisionsDaten
    ? parseWerteBalken(aufgabe.aufgabenstellung)
    : null;
  const kreiseDaten = !routenDaten && !einheitenDaten && !divisionsDaten && !werteBalkenDaten
    ? parseKreiseDaten(aufgabe.aufgabenstellung, aufgabe.loesung)
    : null;

  return (
    <>
      {routenDaten && <RoutenDiagramm {...routenDaten} />}
      {einheitenDaten && <EinheitenLeiter {...einheitenDaten} />}
      {divisionsDaten && <DivisionsZerlegung {...divisionsDaten} />}
      {werteBalkenDaten && <WerteBalken {...werteBalkenDaten} />}
      {kreiseDaten && <KreiseDiagramm {...kreiseDaten} />}
      <View aufgabe={aufgabe} onRichtig={onRichtig} onFalsch={onFalsch} onTeilaufgabeChange={onTeilaufgabeChange} />
    </>
  );
}
