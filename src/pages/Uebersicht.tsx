import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGES } from '@/stages/registry';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { StufeKarte } from '@/components/ui/StufeKarte';
import { Card } from '@/components/ui/Card';
import { useStufenFortschritt } from '@/hooks/useStufenFortschritt';
import { AvatarPreview, parseAvatar } from '@/components/avatar/AvatarPreview';
import { KATEGORIEN } from '@/aufgaben/stageMapping';
import type { Stage } from '@/stages/types';

/** Kategorien-Farben für Abschnitt-Header. */
const FARBE_BG: Record<string, string> = {
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
};

/** Gruppiert Stages nach Kategorie basierend auf der Stage-ID. */
function gruppiereStages(stages: Stage[]) {
  // Original-Stages (die 11 ohne "bank-" Prefix)
  const originals = stages.filter((s) => !s.id.startsWith('bank-'));

  // Bank-Stages nach Kategorie gruppieren
  const bankStages = stages.filter((s) => s.id.startsWith('bank-'));

  // Gruppen: erst Grundübungen, dann nach Fredo-Kapitel
  const gruppen: { titel: string; farbe: string; stages: Stage[] }[] = [];

  if (originals.length > 0) {
    gruppen.push({
      titel: 'Grundübungen',
      farbe: 'sky',
      stages: originals,
    });
  }

  for (const kat of KATEGORIEN) {
    const matching = bankStages.filter((s) => s.sub.includes(kat.titel));
    if (matching.length > 0) {
      gruppen.push({
        titel: kat.titel,
        farbe: kat.farbe,
        stages: matching,
      });
    }
  }

  // Übrige Bank-Stages die keiner Kategorie zugeordnet wurden
  const zugeordnet = new Set(gruppen.flatMap((g) => g.stages.map((s) => s.id)));
  const uebrige = bankStages.filter((s) => !zugeordnet.has(s.id));
  if (uebrige.length > 0) {
    gruppen.push({
      titel: 'Weitere Übungen',
      farbe: 'purple',
      stages: uebrige,
    });
  }

  return gruppen;
}

export function Uebersicht() {
  const navigate = useNavigate();
  const profileId = useProfileStore((s) => s.activeProfileId);
  const profileName = useProfileStore((s) => s.activeProfileName);
  const profileAvatar = useProfileStore((s) => s.activeProfileAvatar);
  const [stagesReady, setStagesReady] = useState(STAGES.length);

  useEffect(() => {
    if (profileId == null) {
      navigate('/', { replace: true });
      return;
    }
    // Re-check STAGES after async loading
    const interval = setInterval(() => {
      if (STAGES.length !== stagesReady) setStagesReady(STAGES.length);
    }, 500);
    return () => clearInterval(interval);
  }, [profileId, navigate, stagesReady]);

  const gruppen = useMemo(() => gruppiereStages(STAGES), [stagesReady]);

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

        {gruppen.length === 0 ? (
          <Card className="text-center mt-8">
            <p className="text-body">Wird geladen...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {gruppen.map((gruppe) => (
              <section key={gruppe.titel}>
                {/* Kategorie-Header */}
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide mb-2 ${FARBE_BG[gruppe.farbe] || FARBE_BG.sky}`}>
                  {gruppe.titel}
                </div>

                <div className="grid gap-2">
                  {gruppe.stages.map((stage) => (
                    <StufeKarteWithProgress
                      key={stage.id}
                      stage={stage}
                      onClick={() => navigate(`/stufe/${stage.id}`)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}

function StufeKarteWithProgress({
  stage,
  onClick,
}: {
  stage: Stage;
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
