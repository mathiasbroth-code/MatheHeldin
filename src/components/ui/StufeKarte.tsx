import { ProgressBar } from './ProgressBar';
import type { StageFarbe } from '@/stages/types';

export type UebungsBadge = 'uebe-mich' | 'neu' | null;

interface StufeKarteProps {
  icon: string;
  titel: string;
  sub: string;
  farbe: StageFarbe;
  fortschritt: { richtig: number; versuche: number };
  zielRichtige: number;
  onClick: () => void;
  badge?: UebungsBadge;
}

const FARBE_ICON: Record<StageFarbe, string> = {
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  purple: 'bg-purple-100 text-purple-700',
};

const BADGE_STYLES: Record<NonNullable<UebungsBadge>, { text: string; className: string }> = {
  'uebe-mich': {
    text: 'Übe mich!',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  'neu': {
    text: 'Neu',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

export function StufeKarte({
  icon,
  titel,
  sub,
  farbe,
  fortschritt,
  zielRichtige,
  onClick,
  badge,
}: StufeKarteProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-card border border-border rounded-2xl p-4 transition-colors duration-200 hover:border-primary/40 cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/20 min-h-[44px]`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${FARBE_ICON[farbe]} overflow-hidden`}
          aria-hidden="true"
        >
          {icon.startsWith('/') || icon.startsWith('data:') || icon.startsWith('http') ? (
            <img src={icon} alt="" className="w-7 h-7" />
          ) : (
            icon
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-heading truncate">{titel}</span>
            {badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${BADGE_STYLES[badge].className}`}
              >
                {BADGE_STYLES[badge].text}
              </span>
            )}
          </div>
          <div className="text-sm text-muted truncate">{sub}</div>
          <ProgressBar
            value={fortschritt.richtig}
            max={zielRichtige}
            className="mt-2"
          />
        </div>
      </div>
    </button>
  );
}
