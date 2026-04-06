import { create } from 'zustand';

interface SessionState {
  activeSessionId: number | null;
  activeStufeId: string | null;
  startSession: (sessionId: number, stufeId: string) => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  activeSessionId: null,
  activeStufeId: null,
  startSession: (sessionId, stufeId) => set({ activeSessionId: sessionId, activeStufeId: stufeId }),
  endSession: () => set({ activeSessionId: null, activeStufeId: null }),
}));
