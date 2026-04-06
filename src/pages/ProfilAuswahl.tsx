import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles, deleteProfile } from '@/db/repository';
import { useProfileStore } from '@/stores/profileStore';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AvatarPreview, parseAvatar } from '@/components/avatar/AvatarPreview';
import type { Profile } from '@/db/schema';

export function ProfilAuswahl() {
  const navigate = useNavigate();
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const all = await getProfiles();
    setProfiles(all);
    setLoading(false);
  }

  function selectProfile(p: Profile) {
    if (p.id == null) return;
    setActiveProfile(p.id, p.name, p.avatar);
    navigate('/ueben');
  }

  async function handleDelete(p: Profile) {
    if (p.id == null) return;
    const confirmed = window.confirm(`"${p.name}" wirklich löschen? Alle Daten gehen verloren.`);
    if (!confirmed) return;
    await deleteProfile(p.id);
    await loadProfiles();
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted">Wird geladen...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center px-4 py-8 min-h-[70vh]">
        {/* Titel */}
        <h1 className="text-3xl font-bold text-heading">Mathe-Heldin</h1>
        <p className="text-sm text-muted mt-1">Üben mit Bildern und Blöcken</p>

        {profiles.length === 0 ? (
          /* Leerer Zustand */
          <div className="mt-12 text-center">
            <p className="text-6xl">✨</p>
            <p className="text-lg text-heading font-semibold mt-4">
              Willkommen!
            </p>
            <p className="text-sm text-muted mt-1">
              Erstelle dein Profil, um loszulegen.
            </p>
            <Button
              size="lg"
              className="mt-6"
              onClick={() => navigate('/profil/neu')}
            >
              Profil erstellen
            </Button>
          </div>
        ) : (
          /* Profile-Grid */
          <>
            <p className="text-sm text-muted mt-6">Wer übt heute?</p>
            <div className="flex flex-wrap gap-6 justify-center mt-6">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProfile(p)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleDelete(p);
                  }}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <div className="w-20 h-20 rounded-full bg-primary-light border-2 border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary group-focus:ring-3 group-focus:ring-primary/30">
                    <AvatarPreview config={parseAvatar(p.avatar)} size={72} />
                  </div>
                  <span className="text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    {p.name}
                  </span>
                </button>
              ))}

              {/* Neues Profil */}
              <button
                onClick={() => navigate('/profil/neu')}
                className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center text-2xl text-muted transition-all group-hover:border-primary group-hover:text-primary group-focus:ring-3 group-focus:ring-primary/30">
                  +
                </div>
                <span className="text-sm font-semibold text-muted group-hover:text-primary transition-colors">
                  Neu
                </span>
              </button>
            </div>

            {/* Lösch-Hinweis */}
            <p className="text-xs text-muted/60 mt-8">
              Rechtsklick auf ein Profil zum Löschen
            </p>
          </>
        )}

        {/* Eltern-Bereich (Platzhalter) */}
        <p className="text-xs text-muted/40 mt-auto pt-12">
          Eltern-Bereich (kommt bald)
        </p>
      </div>
    </AppShell>
  );
}
