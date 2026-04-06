import { useState, useEffect } from 'react';
import { getLetzteAntworten } from '@/db/repository';
import { useProfileStore } from '@/stores/profileStore';
import { useSchwierigkeitStore } from '@/stores/schwierigkeitStore';
import type { AntwortLog } from '@/db/schema';

const WINDOW_SIZE = 10;
const MIN_ANTWORTEN = 5;

// Schwellwerte für Auf-/Abstieg
const AUFSTIEG_RICHTIG = 0.8;
const AUFSTIEG_MAX_TIPP = 0.3;
const ABSTIEG_RICHTIG = 0.5;
const ABSTIEG_TIPP = 0.6;

/**
 * Berechnet die Schwierigkeitsstufe aus den letzten Antworten.
 * Pure Funktion — kein State, kein DB-Zugriff.
 */
export function berechneSchwierigkeit(
  letzteAntworten: AntwortLog[],
  maxStufe: number,
): number {
  if (letzteAntworten.length < MIN_ANTWORTEN) return 0;

  // Aktuelles Level aus dem letzten aufgabeSnapshot extrahieren
  let aktuellesStufe = 0;
  try {
    const snapshot = JSON.parse(letzteAntworten[0].aufgabeSnapshot);
    if (typeof snapshot.schwierigkeit === 'number') {
      aktuellesStufe = snapshot.schwierigkeit;
    }
  } catch {
    // Fallback: Level 0
  }

  const richtigQuote = letzteAntworten.filter((a) => a.richtig).length / letzteAntworten.length;
  const tippQuote = letzteAntworten.filter((a) => a.tippStufe > 0).length / letzteAntworten.length;

  // Aufsteigen: >80% richtig UND <30% mit Tipp
  if (richtigQuote > AUFSTIEG_RICHTIG && tippQuote < AUFSTIEG_MAX_TIPP) {
    return Math.min(aktuellesStufe + 1, maxStufe);
  }

  // Absteigen: <50% richtig ODER >60% mit Tipp
  if (richtigQuote < ABSTIEG_RICHTIG || tippQuote > ABSTIEG_TIPP) {
    return Math.max(aktuellesStufe - 1, 0);
  }

  // Halten
  return aktuellesStufe;
}

/**
 * Reaktiver Hook: gibt die aktuelle Schwierigkeitsstufe für eine Stage zurück.
 * Respektiert Eltern-Overrides: wenn fixiert, wird der fixierte Wert zurückgegeben.
 * Ohne SchwierigkeitsDef gibt er immer undefined zurück (= keine Adaptivität).
 */
export function useSchwierigkeit(
  stufeId: string,
  maxStufe: number | undefined,
): number | undefined {
  const profileId = useProfileStore((s) => s.activeProfileId);
  const getOverride = useSchwierigkeitStore((s) => s.getOverride);
  const [level, setLevel] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (profileId == null || maxStufe == null) {
      setLevel(undefined);
      return;
    }

    // Prüfe Eltern-Override
    const override = getOverride(profileId, stufeId);
    if (override && !override.adaptiv) {
      setLevel(Math.min(override.fixedLevel, maxStufe - 1));
      return;
    }

    let cancelled = false;
    getLetzteAntworten(profileId, stufeId, WINDOW_SIZE).then((antworten) => {
      if (!cancelled) {
        setLevel(berechneSchwierigkeit(antworten, maxStufe - 1));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [profileId, stufeId, maxStufe, getOverride]);

  return level;
}

/**
 * Re-Evaluierung der Schwierigkeit nach einer neuen Antwort.
 * Gibt eine Funktion zurück die das Level nach jeder Antwort neu berechnet.
 * Respektiert Eltern-Overrides.
 */
export function useRefreshSchwierigkeit(
  stufeId: string,
  maxStufe: number | undefined,
  setLevel: (level: number | undefined) => void,
) {
  const profileId = useProfileStore((s) => s.activeProfileId);
  const getOverride = useSchwierigkeitStore((s) => s.getOverride);

  return async () => {
    if (profileId == null || maxStufe == null) return;

    // Prüfe Eltern-Override
    const override = getOverride(profileId, stufeId);
    if (override && !override.adaptiv) {
      setLevel(Math.min(override.fixedLevel, maxStufe - 1));
      return;
    }

    const antworten = await getLetzteAntworten(profileId, stufeId, WINDOW_SIZE);
    setLevel(berechneSchwierigkeit(antworten, maxStufe - 1));
  };
}
