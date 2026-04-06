import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '@/db/repository';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  AvatarPreview,
  serializeAvatar,
  DEFAULT_AVATAR,
  type AvatarConfig,
} from '@/components/avatar/AvatarPreview';

const TIERE: { id: AvatarConfig['tier']; label: string; defaultName: string }[] = [
  { id: 'fuchs', label: 'Fuchs', defaultName: 'Mia' },
  { id: 'eule', label: 'Eule', defaultName: 'Hugo' },
  { id: 'katze', label: 'Katze', defaultName: 'Luna' },
  { id: 'hase', label: 'Hase', defaultName: 'Flocke' },
  { id: 'drache', label: 'Drache', defaultName: 'Zap' },
];

const FARBEN: { id: AvatarConfig['farbe']; label: string; hex: string }[] = [
  { id: 'teal', label: 'Teal', hex: '#14b8a6' },
  { id: 'rose', label: 'Rose', hex: '#fb7185' },
  { id: 'violet', label: 'Lila', hex: '#a78bfa' },
  { id: 'sky', label: 'Blau', hex: '#38bdf8' },
  { id: 'amber', label: 'Gold', hex: '#fbbf24' },
  { id: 'emerald', label: 'Grün', hex: '#34d399' },
];

const ACCESSOIRES: { id: string; emoji: string; label: string }[] = [
  { id: 'none', emoji: '✕', label: 'Keins' },
  { id: 'krone', emoji: '👑', label: 'Krone' },
  { id: 'brille', emoji: '👓', label: 'Brille' },
  { id: 'sonnenbrille', emoji: '😎', label: 'Sonnenbr.' },
  { id: 'schleife', emoji: '🎀', label: 'Schleife' },
  { id: 'blume', emoji: '🌸', label: 'Blume' },
  { id: 'zauberstab', emoji: '✨', label: 'Zauberstab' },
  { id: 'kopfhoerer', emoji: '🎧', label: 'Kopfhörer' },
  { id: 'muetze', emoji: '🧢', label: 'Mütze' },
  { id: 'piratenhut', emoji: '☠️', label: 'Pirat' },
  { id: 'haarreif', emoji: '⭐', label: 'Haarreif' },
  { id: 'fliege', emoji: '🍽', label: 'Fliege' },
];

export function ProfilErstellen() {
  const navigate = useNavigate();
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);
  const [name, setName] = useState('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ ...DEFAULT_AVATAR });

  function updateAvatar(partial: Partial<AvatarConfig>) {
    setAvatarConfig((prev) => ({ ...prev, ...partial }));
  }

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const avatarStr = serializeAvatar(avatarConfig);
    const id = await createProfile(trimmed, 'emerald', avatarStr);
    setActiveProfile(id, trimmed, avatarStr);
    navigate('/ueben');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && name.trim()) {
      handleSubmit();
    }
  }

  return (
    <AppShell>
      <Header title="Neues Profil" onBack={() => navigate('/')} />

      <main className="px-4 pb-8 space-y-4">
        {/* Vorschau */}
        <div className="flex flex-col items-center py-4">
          <AvatarPreview config={avatarConfig} size={120} />
          <p className="text-sm font-semibold text-heading mt-2">
            {name.trim() || '...'}
          </p>
        </div>

        {/* Tier-Auswahl */}
        <Card>
          <p className="text-sm font-semibold text-heading mb-3">Dein Tier</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {TIERE.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  updateAvatar({ tier: t.id });
                  if (!name.trim()) setName(t.defaultName);
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                  avatarConfig.tier === t.id
                    ? 'bg-primary-light border-2 border-primary'
                    : 'border-2 border-border hover:border-primary/40'
                }`}
              >
                <AvatarPreview config={{ ...avatarConfig, tier: t.id }} size={40} />
                <span className="text-[10px] font-semibold text-muted">{t.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Fellfarbe (nur für Fuchs) */}
        {avatarConfig.tier === 'fuchs' && (
          <Card>
            <p className="text-sm font-semibold text-heading mb-3">Fellfarbe</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {FARBEN.map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateAvatar({ farbe: f.id })}
                  className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                    avatarConfig.farbe === f.id
                      ? 'ring-3 ring-primary/30 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: f.hex }}
                  aria-label={f.label}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Accessoire */}
        <Card>
          <p className="text-sm font-semibold text-heading mb-3">Accessoire</p>
          <div className="grid grid-cols-4 gap-2">
            {ACCESSOIRES.map((a) => (
              <button
                key={a.id}
                onClick={() => updateAvatar({ accessoire: a.id })}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all cursor-pointer min-h-[52px] ${
                  avatarConfig.accessoire === a.id
                    ? 'bg-primary-light border-2 border-primary'
                    : 'border-2 border-border hover:border-primary/40'
                }`}
              >
                <span className="text-lg">{a.emoji}</span>
                <span className="text-[9px] font-semibold text-muted leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Name */}
        <Card>
          <p className="text-sm font-semibold text-heading mb-2">Dein Name</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Wie heißt du?"
          />
        </Card>

        {/* Submit */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Los geht's!
        </Button>
      </main>
    </AppShell>
  );
}
