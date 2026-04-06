import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGES } from '@/stages/registry';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { StufeKarte } from '@/components/ui/StufeKarte';
import { Card } from '@/components/ui/Card';
import { useStufenFortschritt } from '@/hooks/useStufenFortschritt';
import { AvatarPreview, parseAvatar } from '@/components/avatar/AvatarPreview';

export function Uebersicht() {
  const navigate = useNavigate();
  const profileId = useProfileStore((s) => s.activeProfileId);
  const profileName = useProfileStore((s) => s.activeProfileName);
  const profileAvatar = useProfileStore((s) => s.activeProfileAvatar);

  // Redirect to profile selection if no active profile
  useEffect(() => {
    if (profileId == null) {
      navigate('/', { replace: true });
    }
  }, [profileId, navigate]);

  if (profileId == null) return null;

  return (
    <AppShell showTabBar>
      <Header
        title={profileName ? `Hallo ${profileName}!` : 'Mathe-Heldin'}
        subtitle="Was möchtest du üben?"
      />

      <main className="px-4 pb-8">
        {/* Profil-Wechsel */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[36px]"
            aria-label="Profil wechseln"
          >
            <AvatarPreview config={parseAvatar(profileAvatar)} size={24} />
            <span className="text-xs">Wechseln</span>
          </button>
        </div>

        {STAGES.length === 0 ? (
          <Card className="text-center mt-8">
            <p className="text-body">Noch keine Stufen verfügbar.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {STAGES.map((stage) => (
              <StufeKarteWithProgress
                key={stage.id}
                stage={stage}
                onClick={() => navigate(`/stufe/${stage.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}

/** Wrapper that loads live progress from Dexie for each stage card. */
function StufeKarteWithProgress({
  stage,
  onClick,
}: {
  stage: (typeof STAGES)[number];
  onClick: () => void;
}) {
  const fortschritt = useStufenFortschritt(stage.id);

  return (
    <StufeKarte
      icon={stage.icon}
      titel={stage.titel}
      sub={stage.sub}
      farbe={stage.farbe}
      fortschritt={fortschritt}
      zielRichtige={stage.zielRichtige}
      onClick={onClick}
    />
  );
}
