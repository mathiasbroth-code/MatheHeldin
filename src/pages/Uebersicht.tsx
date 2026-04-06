import { useNavigate } from 'react-router-dom';
import { STAGES } from '@/stages/registry';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { StufeKarte } from '@/components/ui/StufeKarte';
import { Card } from '@/components/ui/Card';

export function Uebersicht() {
  const navigate = useNavigate();
  const profileName = useProfileStore((s) => s.activeProfileName);

  return (
    <AppShell>
      <Header
        title="Mathe-Heldin"
        subtitle={profileName ? `Hallo ${profileName}!` : undefined}
      />

      <main className="px-4 pb-8">
        {STAGES.length === 0 ? (
          <Card className="text-center mt-8">
            <p className="text-body">Noch keine Stufen verfügbar.</p>
            <p className="text-sm text-muted mt-1">
              Stufen werden nach und nach hinzugefügt.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 mt-2">
            {STAGES.map((stage) => (
              <StufeKarte
                key={stage.id}
                icon={stage.icon}
                titel={stage.titel}
                sub={stage.sub}
                farbe={stage.farbe}
                fortschritt={{ richtig: 0, versuche: 0 }}
                zielRichtige={stage.zielRichtige}
                onClick={() => navigate(`/stufe/${stage.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
