import { useCallback } from 'react';
import { recordAntwort } from '@/db/repository';
import { useProfileStore } from '@/stores/profileStore';
import { useSessionStore } from '@/stores/sessionStore';
import type { Aufgabe } from '@/stages/types';

/**
 * Zentraler Hook zum Loggen jeder Antwort in Dexie.
 * Gibt eine `logAntwort`-Funktion zurück, die in jeder Stufen-View aufgerufen wird.
 */
export function useAntwortRecorder(stufeId: string) {
  const profileId = useProfileStore((s) => s.activeProfileId);
  const sessionId = useSessionStore((s) => s.activeSessionId);

  const logAntwort = useCallback(
    async (
      aufgabe: Aufgabe,
      antwort: string,
      richtig: boolean,
      dauerMs: number,
      tippBenutzt = false,
      tippStufe = 0,
    ) => {
      if (profileId == null || sessionId == null) return;

      await recordAntwort({
        sessionId,
        profileId,
        stufeId,
        aufgabeId: aufgabe.id,
        aufgabeSnapshot: JSON.stringify(aufgabe),
        antwort,
        richtig,
        dauerMs,
        tippBenutzt,
        tippStufe,
        erstelltAm: Date.now(),
      });
    },
    [profileId, sessionId, stufeId],
  );

  return { logAntwort };
}
