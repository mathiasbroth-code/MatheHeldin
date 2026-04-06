import { MaskottchenSvg, type MaskottchenTier, type MaskottchenFarbe, type MaskottchenEmotion } from './MaskottchenSvg';

export type AvatarAccessoire =
  | 'none' | 'brille' | 'sonnenbrille' | 'schleife' | 'krone'
  | 'blume' | 'zauberstab' | 'kopfhoerer' | 'muetze'
  | 'piratenhut' | 'haarreif' | 'fliege';

export interface AvatarConfig {
  tier: MaskottchenTier;
  farbe: MaskottchenFarbe;
  accessoire: AvatarAccessoire;
  name: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  tier: 'fuchs',
  farbe: 'teal',
  accessoire: 'none',
  name: 'Mia',
};

const ACCESSOIRE_IMPORTS = import.meta.glob(
  '/src/assets/maskottchen/accessoires/*.svg',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

function getAccessoireUrl(acc: AvatarAccessoire): string | null {
  if (acc === 'none') return null;
  const key = Object.keys(ACCESSOIRE_IMPORTS).find((k) => k.endsWith(`/${acc}.svg`));
  return key ? ACCESSOIRE_IMPORTS[key] : null;
}

interface Props {
  config?: AvatarConfig;
  emotion?: MaskottchenEmotion;
  size?: number;
  className?: string;
}

export function AvatarDisplay({
  config = DEFAULT_AVATAR,
  emotion = 'default',
  size = 64,
  className = '',
}: Props) {
  const accUrl = getAccessoireUrl(config.accessoire);

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <MaskottchenSvg
        tier={config.tier}
        farbe={config.farbe}
        emotion={emotion}
        size={size}
      />
      {accUrl && (
        <img
          src={accUrl}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
}
