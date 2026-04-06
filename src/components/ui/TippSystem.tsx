import { Card } from './Card';
import { useProfileStore } from '@/stores/profileStore';
import { AvatarDisplay, type AvatarConfig } from './AvatarDisplay';
import type { MaskottchenTier, MaskottchenFarbe } from './MaskottchenSvg';

interface TippSystemProps {
  tipps: [string, string, string] | null;
  stufe: number;
  onAdvance: () => void;
}

const labels = ['💡 Denkanstoß', '🔍 Methode', '📝 Schritt für Schritt'];
const buttonLabels = ['Tipp', 'Mehr Hilfe', 'Lösung zeigen'];

export function TippSystem({ tipps, stufe, onAdvance }: TippSystemProps) {
  const avatarConfig = useProfileStore((s) => s.activeAvatarConfig);

  if (!tipps) return null;

  const config: AvatarConfig = {
    tier: (avatarConfig.tier ?? 'fuchs') as MaskottchenTier,
    farbe: (avatarConfig.farbe ?? 'teal') as MaskottchenFarbe,
    accessoire: avatarConfig.accessoire as AvatarConfig['accessoire'] ?? 'none',
    name: avatarConfig.name ?? 'Mia',
  };

  if (stufe === 0) {
    return (
      <button
        onClick={onAdvance}
        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer select-none focus:outline-none focus:ring-3 focus:ring-primary/30 bg-transparent text-primary border-2 border-primary hover:bg-primary-light"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 1C4.7 1 2 3.7 2 7c0 2 1 3.8 2.5 4.8V13a1 1 0 001 1h5a1 1 0 001-1v-1.2C13 10.8 14 9 14 7c0-3.3-2.7-6-6-6z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Tipp
      </button>
    );
  }

  return (
    <Card className="bg-warning-bg border-warning/20">
      <div className="flex gap-3">
        <AvatarDisplay config={config} emotion="thinking" size={40} className="shrink-0 mt-0.5" />
        <div className="space-y-3 flex-1">
          {tipps.slice(0, stufe).map((text, i) => (
            <div key={i}>
              <p className="text-xs font-bold text-heading">{labels[i]}</p>
              <p className="text-sm text-body mt-0.5">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {stufe < 3 && (
        <button
          onClick={onAdvance}
          className="mt-3 text-xs font-semibold text-primary hover:text-primary-hover cursor-pointer underline underline-offset-2"
        >
          {buttonLabels[stufe]}
        </button>
      )}
    </Card>
  );
}
