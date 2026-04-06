import { useParams, useNavigate } from 'react-router-dom';
import { findStage } from '@/stages/registry';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export function StufeView() {
  const { stufeId } = useParams<{ stufeId: string }>();
  const navigate = useNavigate();
  const stage = stufeId ? findStage(stufeId) : undefined;

  if (!stage) {
    return (
      <AppShell>
        <Header title="Nicht gefunden" onBack={() => navigate('/')} />
        <main className="px-4">
          <Card className="text-center mt-8">
            <p className="text-body">Stufe nicht gefunden.</p>
          </Card>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header
        title={`${stage.icon} ${stage.titel}`}
        subtitle={stage.sub}
        onBack={() => navigate('/')}
      />
      <main className="px-4 pb-8">
        <Card className="text-center mt-4">
          <p className="text-muted">Stufe wird geladen...</p>
        </Card>
      </main>
    </AppShell>
  );
}
