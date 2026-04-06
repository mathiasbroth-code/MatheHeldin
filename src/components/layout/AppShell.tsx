import type { ReactNode } from 'react';
import { TabBar } from './TabBar';

interface AppShellProps {
  children: ReactNode;
  showTabBar?: boolean;
}

export function AppShell({ children, showTabBar = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className={`mx-auto max-w-lg ${showTabBar ? 'pb-[80px]' : ''}`}>
        {children}
      </div>
      {showTabBar && <TabBar />}
    </div>
  );
}
