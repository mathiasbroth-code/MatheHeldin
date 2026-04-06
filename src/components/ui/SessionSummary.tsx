import { Card } from './Card';
import { Button } from './Button';

interface SessionSummaryProps {
  richtig: number;
  versuche: number;
  zielRichtige: number;
  onWeiter: () => void;
  onZurueck: () => void;
}

export function SessionSummary({
  richtig,
  versuche,
  onWeiter,
  onZurueck,
}: SessionSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <Card className="bg-success-bg border-success/30 max-w-sm w-full text-center">
        <p className="text-4xl">🎉</p>
        <p className="text-xl font-bold text-heading mt-3">Super gemacht!</p>
        <p className="text-sm text-body mt-2">
          Du hast <strong>{richtig}</strong> von <strong>{versuche}</strong> Aufgaben
          richtig gelöst!
        </p>

        <div className="flex gap-2 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onZurueck}>
            Zur Übersicht
          </Button>
          <Button className="flex-1" onClick={onWeiter}>
            Weiter üben
          </Button>
        </div>
      </Card>
    </div>
  );
}
