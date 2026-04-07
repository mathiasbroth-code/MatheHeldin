import { useNavigate } from 'react-router-dom';
import { useSyncStore, type SyncStatus } from '@/stores/syncStore';

const statusConfig: Record<SyncStatus, { icon: string; color: string; label: string }> = {
  offline: { icon: '☁️', color: 'text-gray-400', label: 'Nicht verbunden' },
  syncing: { icon: '🔄', color: 'text-teal-500 animate-spin', label: 'Synchronisiere...' },
  synced: { icon: '☁️', color: 'text-teal-500', label: 'Synchronisiert' },
  error: { icon: '⚠️', color: 'text-amber-500', label: 'Sync-Fehler' },
};

export function SyncIndicator() {
  const navigate = useNavigate();
  const status = useSyncStore((s) => s.status);
  const userEmail = useSyncStore((s) => s.userEmail);
  const config = statusConfig[status];

  return (
    <button
      onClick={() => navigate('/sync')}
      className={`flex items-center gap-1 text-sm ${config.color}`}
      title={userEmail ? `${config.label} (${userEmail})` : config.label}
    >
      <span className={status === 'syncing' ? 'animate-spin' : ''}>{config.icon}</span>
    </button>
  );
}
