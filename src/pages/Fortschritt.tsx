import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGES } from '@/stages/registry';
import { useProfileStore } from '@/stores/profileStore';
import { useStufenFortschritt } from '@/hooks/useStufenFortschritt';
import { getProfileOverview, type ProfileOverview } from '@/db/repository';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StageIcon } from '@/components/ui/StageIcon';

function formatRelativeDate(ts: number): string {
  const now = Date.now();
  const diffMs = now - ts;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return new Date(ts).toLocaleDateString('de-DE');
}

export function Fortschritt() {
  const navigate = useNavigate();
  const profileId = useProfileStore((s) => s.activeProfileId);
  useEffect(() => {
    if (profileId == null) navigate('/', { replace: true });
  }, [profileId, navigate]);

  if (profileId == null) return null;

  return (
    <AppShell showTabBar>
      <Header
        title="Dein Fortschritt"
      />

      <main className="px-4 pb-8 space-y-4">
        <OverviewCard profileId={profileId} />

        <div className="space-y-2">
          {STAGES.map((stage) => (
            <StageProgressRow key={stage.id} stage={stage} />
          ))}
        </div>
      </main>
    </AppShell>
  );
}

function OverviewCard({ profileId }: { profileId: number }) {
  const [overview, setOverview] = useState<ProfileOverview | null>(null);

  useEffect(() => {
    getProfileOverview(profileId).then(setOverview);
  }, [profileId]);

  const completedCount = STAGES.reduce((count, stage) => {
    return count + (useCompletionCheck(stage.id, stage.zielRichtige) ? 1 : 0);
  }, 0);

  return (
    <Card className="text-center">
      <p className="text-3xl font-bold text-heading">
        {completedCount} von {STAGES.length}
      </p>
      <p className="text-sm text-muted mt-1">
        {completedCount === 0
          ? 'Fang gleich an zu üben!'
          : completedCount === STAGES.length
            ? 'Alle Stufen geschafft! Super!'
            : 'Stufen geschafft — weiter so!'}
      </p>

      {overview && overview.totalVersuche > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-body">
            Du hast schon <strong>{overview.totalVersuche}</strong> Aufgaben bearbeitet,{' '}
            <strong className="text-success">{overview.totalRichtig}</strong> davon richtig!
          </p>
          {overview.letzteUebung && (
            <p className="text-xs text-muted mt-1">
              Letzte Übung: {formatRelativeDate(overview.letzteUebung)}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function useCompletionCheck(stufeId: string, zielRichtige: number): boolean {
  const f = useStufenFortschritt(stufeId);
  return f.richtig >= zielRichtige;
}

function StageProgressRow({ stage }: { stage: (typeof STAGES)[number] }) {
  const fortschritt = useStufenFortschritt(stage.id);
  const percent =
    stage.zielRichtige > 0
      ? Math.min(100, Math.round((fortschritt.richtig / stage.zielRichtige) * 100))
      : 0;
  const completed = fortschritt.richtig >= stage.zielRichtige;

  return (
    <Card className="flex items-center gap-3 py-3">
      <div className="w-9 flex-shrink-0 flex items-center justify-center">
        <StageIcon icon={stage.icon} size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-heading truncate">{stage.titel}</p>
          {completed && (
            <span className="text-xs text-success font-bold flex-shrink-0">✓</span>
          )}
        </div>
        {fortschritt.versuche === 0 ? (
          <p className="text-xs text-muted mt-0.5">Noch nicht geübt</p>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <ProgressBar
              value={fortschritt.richtig}
              max={stage.zielRichtige}
              className="flex-1"
            />
            <span className="text-xs text-muted tabular-nums w-8 text-right">
              {percent}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
