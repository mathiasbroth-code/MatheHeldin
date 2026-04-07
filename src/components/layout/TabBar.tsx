import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSyncStore } from '@/stores/syncStore';

interface Tab {
  path: string;
  label: string;
  icon: (active: boolean) => ReactNode;
}

const tabs: Tab[] = [
  {
    path: '/ueben',
    label: 'Üben',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/fortschritt',
    label: 'Fortschritt',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    path: '/eltern',
    label: 'Eltern',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    path: '/sync',
    label: 'Sync',
    icon: (_active) => <SyncIcon />,
  },
];

function SyncIcon() {
  const status = useSyncStore((s) => s.status);
  const colors: Record<string, string> = {
    offline: '#9CA3AF',
    syncing: '#14B8A6',
    synced: '#14B8A6',
    error: '#F59E0B',
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors[status] ?? '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={status === 'syncing' ? 'animate-spin' : ''}>
      <path d="M4 14a8 8 0 0 1 14-4" />
      <path d="M20 10a8 8 0 0 1-14 4" />
      <polyline points="4 10 4 14 8 14" />
      <polyline points="20 14 20 10 16 10" />
    </svg>
  );
}

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-50">
      <div className="mx-auto max-w-lg flex">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[60px] py-2 transition-colors cursor-pointer ${
                active ? 'text-primary' : 'text-muted hover:text-heading'
              }`}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
