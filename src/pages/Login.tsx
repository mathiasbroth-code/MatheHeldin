import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '@/sync/syncEngine';
import { useSyncStore } from '@/stores/syncStore';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';

export default function Login() {
  const navigate = useNavigate();
  const userEmail = useSyncStore((s) => s.userEmail);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await loginWithEmail(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  }

  if (userEmail) {
    return (
      <AppShell>
        <Header title="Cloud-Sync" onBack={() => navigate(-1)} />
        <div className="px-4 py-8 text-center space-y-4">
          <div className="text-5xl">☁️</div>
          <p className="text-lg font-medium text-gray-800">
            Sync aktiv
          </p>
          <p className="text-sm text-gray-500">
            Angemeldet als <strong>{userEmail}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Dein Fortschritt wird automatisch zwischen allen Geräten synchronisiert.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-xl font-medium"
          >
            Zurück
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header title="Cloud-Sync" onBack={() => navigate(-1)} />
      <div className="px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl">☁️</div>
          <h2 className="text-lg font-semibold text-gray-800">
            Auf allen Geräten üben
          </h2>
          <p className="text-sm text-gray-500">
            Melde dich mit deiner E-Mail an. Du bekommst einen Link — kein Passwort nötig.
          </p>
        </div>

        {sent ? (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center space-y-2">
            <div className="text-3xl">📬</div>
            <p className="text-sm font-medium text-teal-800">
              Link gesendet!
            </p>
            <p className="text-sm text-teal-600">
              Schau in dein Postfach (<strong>{email}</strong>) und klicke auf den Link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mama@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Wird gesendet...' : 'Magic Link senden'}
            </button>
          </form>
        )}

        <p className="text-xs text-gray-400 text-center">
          Ohne Anmeldung funktioniert die App wie bisher — nur auf diesem Gerät.
        </p>
      </div>
    </AppShell>
  );
}
