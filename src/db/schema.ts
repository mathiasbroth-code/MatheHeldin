import Dexie, { type Table } from 'dexie';

export interface Profile {
  id?: number;
  name: string;
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
  }
}

export const db = new MatheDB();
