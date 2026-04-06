import Dexie, { type Table } from 'dexie';

export interface Profile {
  id?: number;
  name: string;
  avatar: string;
  farbe: string;
  erstelltAm: number;
}

export interface Session {
  id?: number;
  profileId: number;
  stufeId: string;
  gestartetAm: number;
  beendetAm?: number;
}

export interface AntwortLog {
  id?: number;
  sessionId: number;
  profileId: number;
  stufeId: string;
  aufgabeId: string;
  aufgabeSnapshot: string;
  antwort: string;
  richtig: boolean;
  dauerMs: number;
  tippBenutzt: boolean;
  tippStufe: number;
  erstelltAm: number;
}

class MatheDB extends Dexie {
  profiles!: Table<Profile>;
  sessions!: Table<Session>;
  antworten!: Table<AntwortLog>;

  constructor() {
    super('matheheldin');
    this.version(1).stores({
      profiles: '++id, name',
      sessions: '++id, profileId, stufeId, gestartetAm',
      antworten: '++id, [profileId+stufeId], sessionId, erstelltAm, richtig',
    });

    this.version(2).stores({
      profiles: '++id, name',
      sessions: '++id, profileId, stufeId, gestartetAm',
      antworten: '++id, [profileId+stufeId], sessionId, erstelltAm, richtig',
    }).upgrade(tx => {
      return tx.table('profiles').toCollection().modify(profile => {
        if (!(profile as Record<string, unknown>).avatar) {
          (profile as Record<string, unknown>).avatar = '🦊';
        }
      });
    });

    this.version(3).stores({
      profiles: '++id, name',
      sessions: '++id, profileId, stufeId, gestartetAm',
      antworten: '++id, [profileId+stufeId], sessionId, erstelltAm, richtig',
    }).upgrade(tx => {
      return tx.table('antworten').toCollection().modify(entry => {
        if ((entry as Record<string, unknown>).tippStufe === undefined) {
          (entry as Record<string, unknown>).tippStufe = 0;
        }
      });
    });
  }
}

export const db = new MatheDB();
