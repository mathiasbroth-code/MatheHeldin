import { useState, useRef, useEffect } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { useSchwierigkeitStore } from '@/stores/schwierigkeitStore';
import { useLernmodusStore, type Lernmodus } from '@/stores/lernmodusStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getProfiles, getProfileOverview, getProfileStageBreakdown, getLetzteAntworten } from '@/db/repository';
import { berechneSchwierigkeit } from '@/hooks/useSchwierigkeit';
import type { ProfileOverview, StageBreakdown } from '@/db/repository';
import type { Profile } from '@/db/schema';
import { STAGES } from '@/stages/registry';
import { StageIcon } from '@/components/ui/StageIcon';
import { AvatarPreview, parseAvatar } from '@/components/avatar/AvatarPreview';
import { AufgabenPruefer } from './AufgabenPruefer';

export function ElternGate() {
  const elternPin = useProfileStore((s) => s.elternPin);
  const setElternPin = useProfileStore((s) => s.setElternPin);
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return <ElternDashboard />;
  }

  if (!elternPin) {
    return <PinSetup onComplete={setElternPin} />;
  }

  return <PinEntry correctPin={elternPin} onSuccess={() => setUnlocked(true)} />;
}

function PinSetup({ onComplete }: { onComplete: (pin: string) => void }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  function handleSubmit() {
    const pin = digits.join('');
    if (pin.length === 4) {
      onComplete(pin);
    }
  }

  const complete = digits.every((d) => d !== '');

  return (
    <AppShell showTabBar>
      <Header title="Eltern-Bereich" />
      <main className="px-4 pb-8 space-y-4">
        <Card className="text-center">
          <p className="text-lg font-semibold text-heading">PIN erstellen</p>
          <p className="text-sm text-muted mt-1">
            Wähle eine 4-stellige PIN, um den Eltern-Bereich zu schützen.
          </p>

          <div className="flex gap-3 justify-center mt-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-border rounded-xl focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none bg-white"
              />
            ))}
          </div>

          <Button
            className="mt-6"
            onClick={handleSubmit}
            disabled={!complete}
          >
            PIN speichern
          </Button>
        </Card>
      </main>
    </AppShell>
  );
}

function PinEntry({
  correctPin,
  onSuccess,
}: {
  correctPin: string;
  onSuccess: () => void;
}) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    setError(false);
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }

    // Auto-check when all 4 digits entered
    if (value && index === 3) {
      const pin = next.join('');
      if (pin === correctPin) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(['', '', '', '']);
          refs[0].current?.focus();
        }, 800);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  return (
    <AppShell showTabBar>
      <Header title="Eltern-Bereich" />
      <main className="px-4 pb-8 space-y-4">
        <Card className="text-center">
          <p className="text-lg font-semibold text-heading">PIN eingeben</p>
          <p className="text-sm text-muted mt-1">
            Gib deine 4-stellige PIN ein.
          </p>

          <div className="flex gap-3 justify-center mt-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none bg-white transition-colors ${
                  error
                    ? 'border-warning text-warning'
                    : 'border-border focus:border-primary focus:ring-3 focus:ring-primary/20'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-warning font-semibold mt-4">
              Falscher PIN — versuch es nochmal.
            </p>
          )}
        </Card>
      </main>
    </AppShell>
  );
}

function formatRelativeDate(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return new Date(ts).toLocaleDateString('de-DE');
}

/** Steuerung der Schwierigkeit pro Stufe (nur für Stufen mit schwierigkeit-Def). */
function SchwierigkeitSteuerung({
  profileId,
  stufeId,
  maxStufe,
  labels,
}: {
  profileId: number;
  stufeId: string;
  maxStufe: number;
  labels: readonly string[];
}) {
  const getOverride = useSchwierigkeitStore((s) => s.getOverride);
  const setOverride = useSchwierigkeitStore((s) => s.setOverride);
  const removeOverride = useSchwierigkeitStore((s) => s.removeOverride);
  const override = getOverride(profileId, stufeId);

  const [autoLevel, setAutoLevel] = useState<number>(0);

  // Lade das vom Algorithmus berechnete Level
  useEffect(() => {
    getLetzteAntworten(profileId, stufeId, 10).then((antworten) => {
      setAutoLevel(berechneSchwierigkeit(antworten, maxStufe - 1));
    });
  }, [profileId, stufeId, maxStufe]);

  const isAdaptiv = !override || override.adaptiv;
  const currentLevel = isAdaptiv ? autoLevel : override.fixedLevel;

  function handleToggle() {
    if (isAdaptiv) {
      // Fixieren auf aktuellem Auto-Level
      setOverride(profileId, stufeId, { adaptiv: false, fixedLevel: autoLevel });
    } else {
      // Zurück auf adaptiv
      removeOverride(profileId, stufeId);
    }
  }

  function handleLevelChange(newLevel: number) {
    const clamped = Math.max(0, Math.min(newLevel, maxStufe - 1));
    setOverride(profileId, stufeId, { adaptiv: false, fixedLevel: clamped });
  }

  return (
    <div className="ml-9 mt-1.5 mb-1 p-2 bg-surface rounded-lg border border-border/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted font-semibold uppercase tracking-wide">
          Schwierigkeit
        </span>
        <button
          onClick={handleToggle}
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
            isAdaptiv
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isAdaptiv ? 'Automatisch' : 'Fixiert'}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-1.5">
        {!isAdaptiv && (
          <button
            onClick={() => handleLevelChange(currentLevel - 1)}
            disabled={currentLevel <= 0}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm font-bold text-muted hover:bg-surface disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            −
          </button>
        )}

        <div className="flex-1 flex items-center gap-1">
          {Array.from({ length: maxStufe }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentLevel ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {!isAdaptiv && (
          <button
            onClick={() => handleLevelChange(currentLevel + 1)}
            disabled={currentLevel >= maxStufe - 1}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm font-bold text-muted hover:bg-surface disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            +
          </button>
        )}
      </div>

      <p className="text-[10px] text-muted mt-1">
        Stufe {currentLevel + 1}/{maxStufe}: {labels[currentLevel] ?? `Level ${currentLevel}`}
      </p>
    </div>
  );
}

type ElternTab = 'dashboard' | 'pruefer';

const LERNMODUS_OPTIONEN: { id: Lernmodus; label: string; desc: string }[] = [
  { id: 'frei', label: 'Frei', desc: 'Alle Themen frei wählbar' },
  { id: 'sanft', label: 'Sanft gelenkt', desc: 'Empfehlungen + angepasste Schwierigkeit' },
  { id: 'gezielt', label: 'Gezielt', desc: 'Schwache Themen werden betont' },
];

function LernmodusRegler({ profileId }: { profileId: number }) {
  const getLernmodus = useLernmodusStore((s) => s.getLernmodus);
  const setLernmodus = useLernmodusStore((s) => s.setLernmodus);
  const aktiv = getLernmodus(profileId);

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-bold text-heading mb-2">Lernmodus</p>
      <div className="flex gap-1.5">
        {LERNMODUS_OPTIONEN.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLernmodus(profileId, opt.id)}
            className={`flex-1 py-2 px-2 rounded-lg text-center transition-colors cursor-pointer border ${
              aktiv === opt.id
                ? 'bg-primary text-white border-primary font-semibold'
                : 'bg-card text-muted border-border hover:border-primary/40'
            }`}
          >
            <span className="text-xs font-semibold block">{opt.label}</span>
            <span className={`text-[9px] block mt-0.5 ${aktiv === opt.id ? 'text-white/80' : 'text-muted'}`}>
              {opt.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ElternDashboard() {
  const clearElternPin = useProfileStore((s) => s.clearElternPin);
  const [tab, setTab] = useState<ElternTab>('dashboard');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [overviews, setOverviews] = useState<Map<number, ProfileOverview>>(new Map());
  const [expanded, setExpanded] = useState<number | null>(null);
  const [breakdowns, setBreakdowns] = useState<Map<number, StageBreakdown[]>>(new Map());

  useEffect(() => {
    getProfiles().then(async (all) => {
      setProfiles(all);
      const ovMap = new Map<number, ProfileOverview>();
      for (const p of all) {
        if (p.id != null) {
          ovMap.set(p.id, await getProfileOverview(p.id));
        }
      }
      setOverviews(ovMap);
    });
  }, []);

  async function toggleExpand(profileId: number) {
    if (expanded === profileId) {
      setExpanded(null);
      return;
    }
    setExpanded(profileId);
    if (!breakdowns.has(profileId)) {
      const bd = await getProfileStageBreakdown(profileId);
      setBreakdowns((prev) => new Map(prev).set(profileId, bd));
    }
  }

  function handleResetPin() {
    if (window.confirm('PIN wirklich zurücksetzen?')) {
      clearElternPin();
    }
  }

  const stageMap = new Map(STAGES.map((s) => [s.id, s]));

  return (
    <AppShell showTabBar>
      <Header title="Eltern-Dashboard" />
      <main className="px-4 pb-8 space-y-4">
        {/* Tab-Leiste */}
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {([
            { id: 'dashboard' as ElternTab, label: 'Fortschritt' },
            { id: 'pruefer' as ElternTab, label: 'Aufgaben prüfen' },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-white text-heading shadow-sm'
                  : 'text-muted hover:text-heading'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Aufgaben-Prüfer Tab */}
        {tab === 'pruefer' && <AufgabenPruefer />}

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (profiles.length === 0 ? (
          <Card className="text-center">
            <p className="text-muted">Noch keine Profile angelegt.</p>
          </Card>
        ) : (
          profiles.map((profile) => {
            const ov = profile.id != null ? overviews.get(profile.id) : null;
            const isExpanded = expanded === profile.id;
            const bd = profile.id != null ? breakdowns.get(profile.id) : undefined;

            return (
              <Card key={profile.id} className="overflow-hidden">
                {/* Profile header — tappable */}
                <button
                  onClick={() => profile.id != null && toggleExpand(profile.id)}
                  className="w-full flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <AvatarPreview config={parseAvatar(profile.avatar)} size={48} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-heading">{profile.name}</p>
                    {ov && ov.totalVersuche > 0 ? (
                      <p className="text-xs text-muted">
                        {ov.totalRichtig}/{ov.totalVersuche} richtig · Tipp-Nutzung {ov.tippQuote}%
                        {ov.letzteUebung && ` · ${formatRelativeDate(ov.letzteUebung)}`}
                      </p>
                    ) : (
                      <p className="text-xs text-muted">Noch keine Übungen</p>
                    )}
                  </div>
                  <span className="text-muted text-sm flex-shrink-0">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {/* Lernmodus-Regler */}
                {isExpanded && profile.id != null && (
                  <LernmodusRegler profileId={profile.id} />
                )}

                {/* Expanded detail */}
                {isExpanded && bd && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {STAGES.map((stage) => {
                      const entry = bd.find((b) => b.stufeId === stage.id);
                      if (!entry) {
                        return (
                          <div key={stage.id} className="flex items-center gap-2 py-1">
                            <span className="w-7 flex items-center justify-center"><StageIcon icon={stage.icon} size={20} /></span>
                            <span className="text-xs text-muted flex-1 truncate">{stage.titel}</span>
                            <span className="text-xs text-muted">—</span>
                          </div>
                        );
                      }

                      const successRate = entry.versuche > 0
                        ? Math.round((entry.richtig / entry.versuche) * 100)
                        : 0;
                      const rateColor =
                        successRate >= 80 ? 'text-success' :
                        successRate >= 50 ? 'text-warning' : 'text-rose-500';

                      return (
                        <div key={stage.id} className="py-1">
                          <div className="flex items-center gap-2">
                            <span className="w-7 flex items-center justify-center"><StageIcon icon={stage.icon} size={20} /></span>
                            <span className="text-xs font-semibold text-heading flex-1 truncate">
                              {stage.titel}
                            </span>
                            <span className={`text-xs font-bold tabular-nums ${rateColor}`}>
                              {successRate}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-9 mt-0.5">
                            <ProgressBar
                              value={entry.richtig}
                              max={stageMap.get(stage.id)?.zielRichtige ?? 5}
                              className="flex-1"
                            />
                            <span className="text-[10px] text-muted tabular-nums whitespace-nowrap">
                              {entry.richtig}/{entry.versuche} · Tipp {entry.tippQuote}%
                            </span>
                          </div>
                          {/* Schwierigkeits-Steuerung (nur für adaptive Stufen) */}
                          {stage.schwierigkeit && profile.id != null && (
                            <SchwierigkeitSteuerung
                              profileId={profile.id}
                              stufeId={stage.id}
                              maxStufe={stage.schwierigkeit.stufen}
                              labels={stage.schwierigkeit.labels}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })
        ))}

        {/* PIN Reset — immer sichtbar */}
        <div className="text-center pt-4">
          <button
            onClick={handleResetPin}
            className="text-xs text-muted hover:text-warning cursor-pointer underline underline-offset-2"
          >
            PIN zurücksetzen
          </button>
        </div>
      </main>
    </AppShell>
  );
}
