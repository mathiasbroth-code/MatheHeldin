import { db, type AntwortLog, type Session, type Profile } from './schema';

/** Neues Profil anlegen. */
export async function createProfile(name: string, farbe: string, avatar: string = '🦊'): Promise<number> {
  return db.profiles.add({ name, avatar, farbe, erstelltAm: Date.now() });
}

/** Alle Profile laden. */
export async function getProfiles(): Promise<Profile[]> {
  return db.profiles.toArray();
}

/** Einzelnes Profil laden. */
export async function getProfile(id: number): Promise<Profile | undefined> {
  return db.profiles.get(id);
}

/** Profil löschen (inkl. Sessions und Antworten). */
export async function deleteProfile(id: number): Promise<void> {
  await db.transaction('rw', [db.profiles, db.sessions, db.antworten], async () => {
    await db.antworten.where('sessionId').anyOf(
      (await db.sessions.where('profileId').equals(id).primaryKeys()),
    ).delete();
    await db.sessions.where('profileId').equals(id).delete();
    await db.profiles.delete(id);
  });
}

/** Neue Übungs-Session starten. */
export async function startSession(profileId: number, stufeId: string): Promise<number> {
  return db.sessions.add({ profileId, stufeId, gestartetAm: Date.now() });
}

/** Session beenden. */
export async function endSession(sessionId: number): Promise<void> {
  await db.sessions.update(sessionId, { beendetAm: Date.now() });
}

/** Antwort loggen. */
export async function recordAntwort(entry: Omit<AntwortLog, 'id'>): Promise<number> {
  return db.antworten.add(entry as AntwortLog);
}

/** Fortschritt für eine Stufe abfragen (Anzahl richtig / Versuche). */
export async function getStufeStats(
  profileId: number,
  stufeId: string,
): Promise<{ richtig: number; versuche: number }> {
  const entries = await db.antworten
    .where('[profileId+stufeId]')
    .equals([profileId, stufeId])
    .toArray();

  return {
    richtig: entries.filter((e) => e.richtig).length,
    versuche: entries.length,
  };
}

/** Alle Sessions eines Profils laden. */
export async function getSessionsByProfile(profileId: number): Promise<Session[]> {
  return db.sessions.where('profileId').equals(profileId).toArray();
}

/** Gesamtübersicht für ein Profil (für Fortschritt + Eltern-Dashboard). */
export interface ProfileOverview {
  totalRichtig: number;
  totalVersuche: number;
  tippQuote: number;
  letzteUebung: number | null;
}

export async function getProfileOverview(profileId: number): Promise<ProfileOverview> {
  const entries = await db.antworten
    .filter((e) => e.profileId === profileId)
    .toArray();

  if (entries.length === 0) {
    return { totalRichtig: 0, totalVersuche: 0, tippQuote: 0, letzteUebung: null };
  }

  const totalRichtig = entries.filter((e) => e.richtig).length;
  const mitTipp = entries.filter((e) => e.tippStufe > 0).length;

  return {
    totalRichtig,
    totalVersuche: entries.length,
    tippQuote: Math.round((mitTipp / entries.length) * 100),
    letzteUebung: Math.max(...entries.map((e) => e.erstelltAm)),
  };
}

/** Per-Stage Breakdown für ein Profil (Eltern-Dashboard Detail). */
export interface StageBreakdown {
  stufeId: string;
  richtig: number;
  versuche: number;
  fehlerQuote: number;
  tippQuote: number;
}

export async function getProfileStageBreakdown(profileId: number): Promise<StageBreakdown[]> {
  const entries = await db.antworten
    .filter((e) => e.profileId === profileId)
    .toArray();

  const byStage = new Map<string, AntwortLog[]>();
  for (const e of entries) {
    const list = byStage.get(e.stufeId) || [];
    list.push(e);
    byStage.set(e.stufeId, list);
  }

  const result: StageBreakdown[] = [];
  for (const [stufeId, logs] of byStage) {
    const richtig = logs.filter((e) => e.richtig).length;
    const mitTipp = logs.filter((e) => e.tippStufe > 0).length;
    result.push({
      stufeId,
      richtig,
      versuche: logs.length,
      fehlerQuote: logs.length > 0 ? Math.round(((logs.length - richtig) / logs.length) * 100) : 0,
      tippQuote: logs.length > 0 ? Math.round((mitTipp / logs.length) * 100) : 0,
    });
  }

  return result;
}
