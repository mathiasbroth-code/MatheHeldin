import { useState, useEffect } from 'react';
import { getStufeStats } from '@/db/repository';
import { useProfileStore } from '@/stores/profileStore';

/**
 * Reaktiver Hook: lädt den Fortschritt für eine Stufe aus Dexie.
 * Re-fetcht bei jedem Render (lightweight, da indexed).
 */
export function useStufenFortschritt(stufeId: string) {
  const profileId = useProfileStore((s) => s.activeProfileId);
  const [fortschritt, setFortschritt] = useState({ richtig: 0, versuche: 0 });

  useEffect(() => {
    if (profileId == null) return;
    let cancelled = false;

    getStufeStats(profileId, stufeId).then((stats) => {
      if (!cancelled) setFortschritt(stats);
    });

    return () => {
      cancelled = true;
    };
  }, [profileId, stufeId]);

  return fortschritt;
}
