import type { ReactNode } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { AvatarDisplay, type AvatarConfig } from './AvatarDisplay';
import type { MaskottchenTier, MaskottchenFarbe } from './MaskottchenSvg';

interface FeedbackBannerProps {
  typ: 'richtig' | 'falsch' | null;
  children?: ReactNode;
  hinweis?: string;
}

export function FeedbackBanner({ typ, children, hinweis }: FeedbackBannerProps) {
  const avatarConfig = useProfileStore((s) => s.activeAvatarConfig);

  if (!typ) return null;

  const config: AvatarConfig = {
    tier: (avatarConfig.tier ?? 'fuchs') as MaskottchenTier,
    farbe: (avatarConfig.farbe ?? 'teal') as MaskottchenFarbe,
    accessoire: avatarConfig.accessoire as AvatarConfig['accessoire'] ?? 'none',
    name: avatarConfig.name ?? 'Mia',
  };

  if (typ === 'richtig') {
    return (
      <div className="bg-success-bg border border-success/30 rounded-2xl p-4 flex items-center gap-3">
        <AvatarDisplay config={config} emotion="happy" size={48} className="shrink-0" />
        <div>
          <div className="text-lg font-semibold text-success">
            Super gemacht!
          </div>
          {children && (
            <div className="text-sm text-success/80 mt-0.5">{children}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warning-bg border border-warning/30 rounded-2xl p-4 flex items-center gap-3">
      <AvatarDisplay config={config} emotion="encouraging" size={48} className="shrink-0" />
      <div>
        <div className="text-base font-semibold text-warning">
          Noch nicht ganz.
        </div>
        {hinweis && (
          <div className="text-sm text-body mt-0.5">{hinweis}</div>
        )}
        {children && <div className="text-sm text-body mt-0.5">{children}</div>}
      </div>
    </div>
  );
}
