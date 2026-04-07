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
import { useAdaptiv } from '@/hooks/useAdaptiv';
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
  const { empfohleneStages, lernmodus } = useAdaptiv();
  const [stagesReady, setStagesReady] = useState(STAGES.length);
  const [openId, setOpenId] = useState<string | null>('grund');
  const [suche, setSuche] = useState('');

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

  const gefilterteGruppen = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (!q) return gruppen;
    return gruppen
      .map((g) => ({
        ...g,
        stages: g.stages.filter(
          (s) =>
            s.titel.toLowerCase().includes(q) ||
            s.sub.toLowerCase().includes(q) ||
            g.titel.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.stages.length > 0);
  }, [gruppen, suche]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  if (profileId == null) return null;

  const istSuche = suche.trim().length > 0;

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

        {/* Suchleiste */}
        <div className="relative mb-3">
          <svg
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={suche}
            onChange={(e) => {
              setSuche(e.target.value);
              if (e.target.value.trim()) setOpenId(null);
            }}
            placeholder="Aufgabentyp suchen..."
            className="w-full pl-10 pr-9 py-2.5 min-h-[44px] text-sm border-2 border-border rounded-xl bg-card placeholder:text-muted focus:border-primary focus:ring-3 focus:ring-primary/20 outline-none transition-colors"
          />
          {suche && (
            <button
              onClick={() => setSuche('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-heading hover:bg-border/50 cursor-pointer transition-colors"
              aria-label="Suche leeren"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Vorgeschlagen für dich (nur bei sanft/gezielt + Empfehlungen vorhanden + keine Suche) */}
        {!istSuche && lernmodus !== 'frei' && empfohleneStages.length > 0 && (
          <div className={`mb-4 rounded-xl p-3 ${lernmodus === 'gezielt' ? 'bg-primary/5 border-2 border-primary/20' : 'bg-card border border-border'}`}>
            <p className="text-xs font-bold text-primary mb-2">
              {lernmodus === 'gezielt' ? 'Diese Themen brauchen Übung:' : 'Vorgeschlagen für dich'}
            </p>
            <div className="space-y-1.5">
              {empfohleneStages.map((emp) => {
                const stage = STAGES.find((s) => s.id === `bank-${emp.stageId}`) || STAGES.find((s) => s.id === emp.stageId);
                if (!stage) return null;
                return (
                  <StufeKarteCompact
                    key={stage.id}
                    stage={stage}
                    onClick={() => navigate(`/stufe/${stage.id}`)}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {gefilterteGruppen.map((gruppe) => (
            <AkkordeonSection
              key={gruppe.id}
              gruppe={gruppe}
              isOpen={istSuche || openId === gruppe.id}
              onToggle={() => toggle(gruppe.id)}
              onStageClick={(id) => navigate(`/stufe/${id}`)}
            />
          ))}
          {istSuche && gefilterteGruppen.length === 0 && (
            <p className="text-center text-muted text-sm py-8">
              Kein Aufgabentyp gefunden für „{suche}"
            </p>
          )}
        </div>

        {/* Lexikon-Link */}
        {!istSuche && (
          <button
            onClick={() => navigate('/lexikon')}
            className="w-full mt-4 p-4 bg-card border border-border rounded-2xl flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors text-left"
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="text-sm font-bold text-heading">Mathe-Lexikon</p>
              <p className="text-xs text-muted">Begriffe nachschlagen und verstehen</p>
            </div>
          </button>
        )}
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
