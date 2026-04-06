import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findStage } from '@/stages/registry';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TippSystem } from '@/components/ui/TippSystem';
import { ErklaerungButton } from '@/components/ui/ErklaerungButton';
import { SessionSummary } from '@/components/ui/SessionSummary';
import { useAktuelleAufgabe } from '@/hooks/useAktuelleAufgabe';
import { useAntwortRecorder } from '@/hooks/useAntwortRecorder';
import { useStufenFortschritt } from '@/hooks/useStufenFortschritt';
import { useSchwierigkeit, useRefreshSchwierigkeit } from '@/hooks/useSchwierigkeit';
import { useTipp } from '@/hooks/useTipp';
import { useProfileStore } from '@/stores/profileStore';
import { useSessionStore } from '@/stores/sessionStore';
import { startSession, endSession } from '@/db/repository';

export function StufeView() {
  const { stufeId } = useParams<{ stufeId: string }>();
  const navigate = useNavigate();
  const stage = stufeId ? findStage(stufeId) : undefined;

  const profileId = useProfileStore((s) => s.activeProfileId);
  const sessionStart = useSessionStore((s) => s.startSession);
  const sessionEnd = useSessionStore((s) => s.endSession);
  const sessionId = useSessionStore((s) => s.activeSessionId);

  const sessionRef = useRef<number | null>(null);

  useEffect(() => {
    if (profileId == null) {
      navigate('/', { replace: true });
    }
  }, [profileId, navigate]);

  useEffect(() => {
    if (profileId == null || !stufeId) return;

    let cancelled = false;
    startSession(profileId, stufeId).then((id) => {
      if (!cancelled) {
        sessionRef.current = id;
        sessionStart(id, stufeId);
      }
    });

    return () => {
      cancelled = true;
      if (sessionRef.current != null) {
        endSession(sessionRef.current);
        sessionEnd();
        sessionRef.current = null;
      }
    };
  }, [profileId, stufeId, sessionStart, sessionEnd]);

  if (!stage) {
    return (
      <AppShell>
        <Header title="Nicht gefunden" onBack={() => navigate('/ueben')} />
        <main className="px-4">
          <Card className="text-center mt-8">
            <p className="text-body">Stufe nicht gefunden.</p>
          </Card>
        </main>
      </AppShell>
    );
  }

  if (profileId == null || sessionId == null) {
    return (
      <AppShell>
        <Header title={stage.titel} onBack={() => navigate('/ueben')} />
        <main className="px-4">
          <Card className="text-center mt-8">
            <p className="text-muted">Wird geladen...</p>
          </Card>
        </main>
      </AppShell>
    );
  }

  return <StufeRunner stage={stage} onBack={() => navigate('/ueben')} />;
}

function StufeRunner({
  stage,
  onBack,
}: {
  stage: ReturnType<typeof findStage> & {};
  onBack: () => void;
}) {
  const navigate = useNavigate();

  // Adaptive Schwierigkeit: Level kommt aus den letzten 10 Antworten
  const maxStufe = stage.schwierigkeit?.stufen;
  const initialLevel = useSchwierigkeit(stage.id, maxStufe);
  const [level, setLevel] = useState<number | undefined>(initialLevel);
  const refreshLevel = useRefreshSchwierigkeit(stage.id, maxStufe, setLevel);

  // Sync initial level when it loads from DB
  useEffect(() => {
    if (initialLevel !== undefined && level === undefined) {
      setLevel(initialLevel);
    }
  }, [initialLevel, level]);

  const { aufgabe, naechste } = useAktuelleAufgabe(stage, level);
  const { logAntwort } = useAntwortRecorder(stage.id);
  const [fortschritt, setFortschritt] = useState({ richtig: 0, versuche: 0 });
  const fortschrittFromDb = useStufenFortschritt(stage.id);
  const tipp = useTipp(stage, aufgabe);
  const [showSummary, setShowSummary] = useState(false);
  const summaryShownRef = useRef(false);

  useEffect(() => {
    setFortschritt(fortschrittFromDb);
  }, [fortschrittFromDb]);

  // Reset tip on new aufgabe
  useEffect(() => {
    tipp.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aufgabe.id]);

  const handleAntwort = useCallback(
    async (antwort: string, richtig: boolean, dauerMs: number) => {
      await logAntwort(aufgabe, antwort, richtig, dauerMs, tipp.stufe > 0, tipp.stufe);
      // Re-evaluate difficulty after logging the answer
      await refreshLevel();
      setFortschritt((prev) => {
        const next = {
          richtig: prev.richtig + (richtig ? 1 : 0),
          versuche: prev.versuche + 1,
        };
        // Show summary when reaching goal (only once per session)
        if (richtig && next.richtig >= stage.zielRichtige && !summaryShownRef.current) {
          summaryShownRef.current = true;
          setTimeout(() => setShowSummary(true), 800);
        }
        return next;
      });
    },
    [aufgabe, logAntwort, tipp.stufe, stage.zielRichtige, refreshLevel],
  );

  const handleNaechste = useCallback(() => {
    naechste(level);
  }, [naechste, level]);

  const StageView = stage.View;

  return (
    <AppShell>
      <Header
        title={stage.titel}
        subtitle={stage.sub}
        icon={stage.icon}
        onBack={onBack}
      />
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <ProgressBar value={fortschritt.richtig} max={stage.zielRichtige} />
          <span className="text-xs text-muted tabular-nums whitespace-nowrap">
            {fortschritt.richtig}/{stage.zielRichtige}
          </span>
          <ErklaerungButton erklaerung={stage.erklaerung} />
        </div>
      </div>

      <main className="px-4 pb-8 space-y-4">
        <StageView
          aufgabe={aufgabe}
          onAntwort={handleAntwort}
          onNaechste={handleNaechste}
          fortschritt={fortschritt}
        />

        {/* Tipp-System (below stage content) */}
        <TippSystem
          tipps={tipp.texte}
          stufe={tipp.stufe}
          onAdvance={tipp.advance}
        />
      </main>

      {showSummary && (
        <SessionSummary
          richtig={fortschritt.richtig}
          versuche={fortschritt.versuche}
          zielRichtige={stage.zielRichtige}
          onWeiter={() => setShowSummary(false)}
          onZurueck={() => navigate('/ueben')}
        />
      )}
    </AppShell>
  );
}
