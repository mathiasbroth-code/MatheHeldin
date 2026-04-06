import { useState } from 'react';
import { AvatarDisplay, type AvatarAccessoire, DEFAULT_AVATAR, type AvatarConfig } from './AvatarDisplay';
import { Card } from './Card';
import { Button } from './Button';
import type { MaskottchenTier, MaskottchenFarbe } from './MaskottchenSvg';

const TIERE: { id: MaskottchenTier; label: string; defaultName: string }[] = [
  { id: 'fuchs', label: 'Fuchs', defaultName: 'Mia' },
  { id: 'eule', label: 'Eule', defaultName: 'Hugo' },
  { id: 'katze', label: 'Katze', defaultName: 'Luna' },
  { id: 'hase', label: 'Hase', defaultName: 'Flocke' },
  { id: 'drache', label: 'Drache', defaultName: 'Zap' },
];

const FARBEN: { id: MaskottchenFarbe; label: string; hex: string; textClass?: string }[] = [
  { id: 'teal', label: 'Teal', hex: '#14b8a6' },
  { id: 'rose', label: 'Rose', hex: '#fb7185' },
  { id: 'violet', label: 'Violet', hex: '#a78bfa' },
  { id: 'sky', label: 'Sky', hex: '#38bdf8' },
  { id: 'amber', label: 'Amber', hex: '#fbbf24', textClass: 'text-amber-900' },
  { id: 'emerald', label: 'Emerald', hex: '#34d399' },
];

const ACCESSOIRES: { id: AvatarAccessoire; label: string }[] = [
  { id: 'none', label: 'Keins' },
  { id: 'krone', label: 'Krone' },
  { id: 'brille', label: 'Brille' },
  { id: 'sonnenbrille', label: 'Sonnenbr.' },
  { id: 'schleife', label: 'Schleife' },
  { id: 'blume', label: 'Blume' },
  { id: 'zauberstab', label: 'Zauberstab' },
  { id: 'kopfhoerer', label: 'Kopfhörer' },
  { id: 'muetze', label: 'Mütze' },
  { id: 'piratenhut', label: 'Pirat' },
  { id: 'haarreif', label: 'Haarreif' },
  { id: 'fliege', label: 'Fliege' },
];

const ACCESSOIRE_ICON_IMPORTS = import.meta.glob(
  '/src/assets/maskottchen/accessoire-icons/*.svg',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

function getAccIconUrl(acc: AvatarAccessoire): string | null {
  if (acc === 'none') return null;
  const key = Object.keys(ACCESSOIRE_ICON_IMPORTS).find((k) => k.endsWith(`/${acc}.svg`));
  return key ? ACCESSOIRE_ICON_IMPORTS[key] : null;
}

interface Props {
  initial?: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  onCancel?: () => void;
}

export function AvatarCustomizer({ initial = DEFAULT_AVATAR, onSave, onCancel }: Props) {
  const [config, setConfig] = useState<AvatarConfig>(initial);
  const [nameEdited, setNameEdited] = useState(false);

  const update = (partial: Partial<AvatarConfig>) =>
    setConfig((prev) => ({ ...prev, ...partial }));

  const selectTier = (tier: MaskottchenTier) => {
    const defaultName = TIERE.find((t) => t.id === tier)?.defaultName ?? 'Mia';
    update({ tier, ...(nameEdited ? {} : { name: defaultName }) });
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <Card className="flex flex-col items-center gap-3 py-6">
        <AvatarDisplay config={config} size={140} />
        <input
          type="text"
          value={config.name}
          onChange={(e) => {
            setNameEdited(true);
            update({ name: e.target.value });
          }}
          placeholder="Name eingeben..."
          maxLength={12}
          className="w-40 text-center text-lg font-semibold text-primary border-2 border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-3 focus:ring-primary/15 outline-none"
        />
        <p className="text-sm text-muted">Dein Mathe-Begleiter</p>
      </Card>

      {/* Maskottchen */}
      <Card>
        <SectionLabel>Maskottchen</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {TIERE.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTier(t.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 cursor-pointer transition-all min-w-[68px] ${
                config.tier === t.id
                  ? 'border-primary bg-primary-light'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <AvatarDisplay config={{ ...config, tier: t.id }} size={44} />
              <span className="text-xs font-medium text-muted">{t.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Fellfarbe */}
      <Card>
        <SectionLabel>Fellfarbe</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {FARBEN.map((f) => (
            <button
              key={f.id}
              onClick={() => update({ farbe: f.id })}
              className={`w-11 h-11 rounded-xl border-3 cursor-pointer transition-all flex items-center justify-center text-[0.6rem] font-semibold text-white ${
                config.farbe === f.id
                  ? 'border-heading ring-2 ring-white ring-offset-2'
                  : 'border-transparent hover:scale-110'
              } ${f.textClass ?? ''}`}
              style={{ backgroundColor: f.hex }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Accessoire */}
      <Card>
        <SectionLabel>Accessoire</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {ACCESSOIRES.map((a) => {
            const iconUrl = getAccIconUrl(a.id);
            return (
              <button
                key={a.id}
                onClick={() => update({ accessoire: a.id })}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 cursor-pointer transition-all min-h-[60px] ${
                  config.accessoire === a.id
                    ? 'border-primary bg-primary-light'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                {a.id === 'none' ? (
                  <svg viewBox="0 0 28 28" className="w-7 h-7">
                    <line x1="8" y1="8" x2="20" y2="20" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="20" y1="8" x2="8" y2="20" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : iconUrl ? (
                  <img src={iconUrl} alt="" className="w-7 h-7" />
                ) : (
                  <span className="text-lg">{a.label[0]}</span>
                )}
                <span className="text-[0.55rem] text-muted font-medium leading-none">{a.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
        <Button className="flex-1" onClick={() => onSave(config)}>
          Speichern
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">{children}</p>
  );
}
