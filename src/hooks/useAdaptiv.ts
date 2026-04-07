import { useState, useEffect } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { useLernmodusStore, type Lernmodus } from '@/stores/lernmodusStore';
import { getStufeRepetitionMap, type StufeRepetitionInfo } from '@/db/repository';
import type { Schwierigkeit } from '@/aufgaben/types';

// ── Kompetenz-Berechnung (Pure Functions) ────────────────

const ROST_PRO_TAG = 0.02; // 2% Kompetenzverlust pro Tag ohne Übung
const ROST_MAX = 0.3; // Maximal 30% Verlust durch Rost
const MIN_ANTWORTEN = 3; // Mindestens 3 Antworten bevor Empfehlung

/** Berechnet gewichteten Kompetenzwert (0–1) aus RepetitionInfo. */
function berechneKompetenz(info: StufeRepetitionInfo): number {
  if (info.totalAntworten === 0) return 0;
  // richtigQuote berücksichtigt schon die letzten 10 Antworten
  // tippQuote verringert die effektive Kompetenz
  const basis = info.richtigQuote;
  const tippAbzug = info.tippQuote * 0.5; // Tipps reduzieren Kompetenz um bis zu 50%
  return Math.max(0, Math.min(1, basis - tippAbzug));
}

/** Berechnet Rostfaktor (0–ROST_MAX) basierend auf Tagen seit letzter Übung. */
function berechneRost(letzteUebung: number | null): number {
  if (!letzteUebung) return ROST_MAX;
  const tage = (Date.now() - letzteUebung) / (1000 * 60 * 60 * 24);
  return Math.min(ROST_MAX, tage * ROST_PRO_TAG);
}

// ── Empfehlungen + Schwierigkeitsfilter ──────────────────

export interface AdaptivEmpfehlung {
  stageId: string;
  kompetenz: number;
  rostfaktor: number;
  effKompetenz: number;
}

export interface AdaptivDaten {
  /** Empfohlene Stages, sortiert nach effektiver Kompetenz aufsteigend (schwächste zuerst) */
  empfohleneStages: AdaptivEmpfehlung[];
  /** Default-Schwierigkeitsfilter für eine Stage. null = kein Auto-Filter. */
  schwierigkeitDefault: (stageId: string) => Schwierigkeit | null;
  /** Aktiver Lernmodus */
  lernmodus: Lernmodus;
  /** Kompetenz-Map für alle Stages */
  kompetenzMap: Map<string, number>;
}

/**
 * Adaptives Lernsystem — berechnet Empfehlungen und Auto-Schwierigkeit.
 *
 * - Kompetenz: gewichteter Score aus letzten Antworten + Tipp-Nutzung
 * - Rostfaktor: langsamer Kompetenz-Verfall bei Nicht-Üben
 * - Empfehlungen: schwächste Stages mit ≥3 Antworten
 * - Auto-Filter: niedrige Kompetenz → gelb, hohe → grün
 * - Wenn Lernmodus "frei" → alles deaktiviert
 */
export function useAdaptiv(): AdaptivDaten {
  const profileId = useProfileStore((s) => s.activeProfileId);
  const getLernmodus = useLernmodusStore((s) => s.getLernmodus);
  const lernmodus = profileId != null ? getLernmodus(profileId) : 'frei';

  const [empfohleneStages, setEmpfohlene] = useState<AdaptivEmpfehlung[]>([]);
  const [kompetenzMap, setKompetenzMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (profileId == null || lernmodus === 'frei') {
      setEmpfohlene([]);
      setKompetenzMap(new Map());
      return;
    }

    let cancelled = false;

    getStufeRepetitionMap(profileId).then((repMap) => {
      if (cancelled) return;

      const kMap = new Map<string, number>();
      const alle: AdaptivEmpfehlung[] = [];

      for (const [stageId, info] of repMap) {
        const k = berechneKompetenz(info);
        const r = berechneRost(info.letzteUebung);
        const eff = Math.max(0, k - r);
        kMap.set(stageId, eff);

        // Nur Stages mit genug Daten empfehlen
        if (info.totalAntworten >= MIN_ANTWORTEN) {
          alle.push({ stageId, kompetenz: k, rostfaktor: r, effKompetenz: eff });
        }
      }

      // Sortiert nach effektiver Kompetenz aufsteigend (schwächste zuerst)
      alle.sort((a, b) => a.effKompetenz - b.effKompetenz);

      setKompetenzMap(kMap);
      setEmpfohlene(alle.slice(0, 3));
    });

    return () => { cancelled = true; };
  }, [profileId, lernmodus]);

  function schwierigkeitDefault(stageId: string): Schwierigkeit | null {
    if (lernmodus === 'frei') return null;
    const eff = kompetenzMap.get(stageId);
    if (eff == null) return null; // Noch nie geübt → kein Auto-Filter
    if (eff < 0.4) return 'gelb';
    if (eff > 0.7) return 'grün';
    return null; // Mittlerer Bereich → alle Schwierigkeiten
  }

  return { empfohleneStages, schwierigkeitDefault, lernmodus, kompetenzMap };
}
