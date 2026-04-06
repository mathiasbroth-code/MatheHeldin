import { db, type AntwortLog, type Session, type Profile } from './schema';

/** Neues Profil anlegen. */
export async function createProfile(name: string, farbe: string): Promise<number> {
  return db.profiles.add({ name, farbe, erstelltAm: Date.now() });
}

/** Alle Profile laden. */
export async function getProfiles(): Promise<Profile[]> {
  return db.profiles.toArray();
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
