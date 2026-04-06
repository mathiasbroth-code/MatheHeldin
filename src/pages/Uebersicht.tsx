import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGES } from '@/stages/registry';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { StufeKarte } from '@/components/ui/StufeKarte';
import { useStufenFortschritt } from '@/hooks/useStufenFortschritt';
import { AvatarPreview, parseAvatar } from '@/components/avatar/AvatarPreview';
import { KATEGORIEN } from '@/aufgaben/stageMapping';
import type { Stage, StageFarbe } from '@/stages/types';

const FARBE_HEADER: Record<StageFarbe, string> = {
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface Gruppe {
  id: string;
  titel: string;
  farbe: StageFarbe;
  stages: Stage[];
}

function gruppiereStages(stages: Stage[]): Gruppe[] {
  const originals = stages.filter((s) => !s.id.startsWith('bank-'));
  const bankStages = stages.filter((s) => s.id.startsWith('bank-'));
  const gruppen: Gruppe[] = [];

  if (originals.length > 0) {
    gruppen.push({ id: 'grund', titel: 'Grundübungen', farbe: 'sky', stages: originals });
  }

  for (const kat of KATEGORIEN) {
    const matching = bankStages.filter((s) => s.sub.includes(kat.titel));
    if (matching.length > 0) {
      gruppen.push({ id: kat.id, titel: kat.titel, farbe: kat.farbe, stages: matching });
    }
  }

  const zugeordnet = new Set(gruppen.flatMap((g) => g.stages.map((s) => s.id)));
  const uebrige = bankStages.filter((s) => !zugeordnet.has(s.id));
  if (uebrige.length > 0) {
    gruppen.push({ id: 'weitere', titel: 'Weitere Übungen', farbe: 'purple', stages: uebrige });
  }

  return gruppen;
}

export function Uebersicht() {
  const navigate = useNavigate();
  const profileId = useProfileStore((s) => s.activeProfileId);
  const profileName = useProfileStore((s) => s.activeProfileName);
  const profileAvatar = useProfileStore((s) => s.activeProfileAvatar);
  const [stagesReady, setStagesReady] = useState(STAGES.length);
  const [openId, setOpenId] = useState<string | null>('grund');

  useEffect(() => {
    if (profileId == null) {
      navigate('/', { replace: true });
      return;
    }
    const interval = setInterval(() => {
      if (STAGES.length !== stagesReady) setStagesReady(STAGES.length);
    }, 500);
    return () => clearInterval(interval);
  }, [profileId, navigate, stagesReady]);

  const gruppen = useMemo(() => gruppiereStages(STAGES), [stagesReady]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  if (profileId == null) return null;

  return (
    <AppShell showTabBar>
      <Header
        title={profileName ? `Hallo ${profileName}!` : 'Mathe-Heldin'}
        subtitle="Was möchtest du üben?"
      />

      <main className="px-4 pb-8">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[36px]"
            aria-label="Profil wechseln"
          >
            <AvatarPreview config={parseAvatar(profileAvatar)} size={24} />
            <span className="text-xs">Wechseln</span>
          </button>
        </div>

        <div className="space-y-2">
          {gruppen.map((gruppe) => (
            <AkkordeonSection
              key={gruppe.id}
              gruppe={gruppe}
              isOpen={openId === gruppe.id}
              onToggle={() => toggle(gruppe.id)}
              onStageClick={(id) => navigate(`/stufe/${id}`)}
            />
          ))}
        </div>
      </main>
    </AppShell>
  );
}

function AkkordeonSection({
  gruppe,
  isOpen,
  onToggle,
  onStageClick,
}: {
  gruppe: Gruppe;
  isOpen: boolean;
  onToggle: () => void;
  onStageClick: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 min-h-[52px] cursor-pointer transition-colors ${
          isOpen ? FARBE_HEADER[gruppe.farbe] : 'bg-card hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${isOpen ? '' : 'text-heading'}`}>
            {gruppe.titel}
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            isOpen ? 'bg-white/60' : 'bg-border text-muted'
          }`}>
            {gruppe.stages.length}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-2 space-y-2">
          {gruppe.stages.map((stage) => (
            <StufeKarteCompact key={stage.id} stage={stage} onClick={() => onStageClick(stage.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StufeKarteCompact({ stage, onClick }: { stage: Stage; onClick: () => void }) {
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
