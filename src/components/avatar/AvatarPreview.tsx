/** Avatar types matching the customizer data model. */
export interface AvatarConfig {
  tier: 'fuchs' | 'eule' | 'katze' | 'hase' | 'drache';
  farbe: 'teal' | 'rose' | 'violet' | 'sky' | 'amber' | 'emerald';
  accessoire: string; // 'none' | accessoire name
}

export const DEFAULT_AVATAR: AvatarConfig = {
  tier: 'fuchs',
  farbe: 'teal',
  accessoire: 'none',
};

// Mascot SVG imports
import fuchsTeal from '@/assets/maskottchen/farben/mia-teal.svg';
import fuchsRose from '@/assets/maskottchen/farben/mia-rose.svg';
import fuchsViolet from '@/assets/maskottchen/farben/mia-violet.svg';
import fuchsSky from '@/assets/maskottchen/farben/mia-sky.svg';
import fuchsAmber from '@/assets/maskottchen/farben/mia-amber.svg';
import fuchsEmerald from '@/assets/maskottchen/farben/mia-emerald.svg';
import eule from '@/assets/maskottchen/eule.svg';
import katze from '@/assets/maskottchen/katze.svg';
import hase from '@/assets/maskottchen/hase.svg';
import drache from '@/assets/maskottchen/drache.svg';

// Accessoire SVG imports
import accBrille from '@/assets/maskottchen/accessoires/brille.svg';
import accSonnenbrille from '@/assets/maskottchen/accessoires/sonnenbrille.svg';
import accSchleife from '@/assets/maskottchen/accessoires/schleife.svg';
import accKrone from '@/assets/maskottchen/accessoires/krone.svg';
import accBlume from '@/assets/maskottchen/accessoires/blume.svg';
import accZauberstab from '@/assets/maskottchen/accessoires/zauberstab.svg';
import accKopfhoerer from '@/assets/maskottchen/accessoires/kopfhoerer.svg';
import accMuetze from '@/assets/maskottchen/accessoires/muetze.svg';
import accPiratenhut from '@/assets/maskottchen/accessoires/piratenhut.svg';
import accHaarreif from '@/assets/maskottchen/accessoires/haarreif.svg';
import accFliege from '@/assets/maskottchen/accessoires/fliege.svg';

const tierSvgs: Record<string, string> = {
  'fuchs-teal': fuchsTeal,
  'fuchs-rose': fuchsRose,
  'fuchs-violet': fuchsViolet,
  'fuchs-sky': fuchsSky,
  'fuchs-amber': fuchsAmber,
  'fuchs-emerald': fuchsEmerald,
  eule,
  katze,
  hase,
  drache,
};

const accessoireSvgs: Record<string, string> = {
  brille: accBrille,
  sonnenbrille: accSonnenbrille,
  schleife: accSchleife,
  krone: accKrone,
  blume: accBlume,
  zauberstab: accZauberstab,
  kopfhoerer: accKopfhoerer,
  muetze: accMuetze,
  piratenhut: accPiratenhut,
  haarreif: accHaarreif,
  fliege: accFliege,
};

function getTierSrc(config: AvatarConfig): string {
  if (config.tier === 'fuchs') {
    return tierSvgs[`fuchs-${config.farbe}`] || tierSvgs['fuchs-teal'];
  }
  return tierSvgs[config.tier] || tierSvgs['fuchs-teal'];
}

interface AvatarPreviewProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export function AvatarPreview({ config, size = 80, className = '' }: AvatarPreviewProps) {
  const tierSrc = getTierSrc(config);
  const accSrc = config.accessoire !== 'none' ? accessoireSvgs[config.accessoire] : null;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={tierSrc}
        alt={config.tier}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      {accSrc && (
        <img
          src={accSrc}
          alt={config.accessoire}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 2 }}
        />
      )}
    </div>
  );
}

/** Parse legacy emoji avatar or new AvatarConfig from stored string. */
export function parseAvatar(stored: string | null): AvatarConfig {
  if (!stored) return DEFAULT_AVATAR;
  try {
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && 'tier' in parsed) {
      return parsed as AvatarConfig;
    }
  } catch {
    // Legacy emoji — return default
  }
  return DEFAULT_AVATAR;
}

export function serializeAvatar(config: AvatarConfig): string {
  return JSON.stringify(config);
}
