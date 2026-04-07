/**
 * SyncEngine — Dexie ↔ Supabase bidirektional.
 *
 * Strategie: Last-Write-Wins per updatedAt.
 * Push nach jedem lokalen Schreibvorgang, Pull bei App-Start.
 */

import { db, type Profile, type Session, type AntwortLog } from '../db/schema';
import { supabase } from './supabaseClient';
import { useSyncStore } from '../stores/syncStore';
import { useDeaktivierteAufgaben } from '../stores/deaktivierteAufgabenStore';
import { useSchwierigkeitStore } from '../stores/schwierigkeitStore';
import { useLernmodusStore } from '../stores/lernmodusStore';
import { useProfileStore } from '../stores/profileStore';

// ── Helpers ──────────────────────────────────────────────────

function now() {
  return Date.now();
}

function uuid() {
  return crypto.randomUUID();
}

async function getUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ── Dexie-Schema erweitern (syncId + updatedAt) ─────────────
// Diese Felder werden in db/schema.ts Version 5 hinzugefügt.
// Hier typisieren wir sie als optionale Erweiterung.

interface Syncable {
  syncId?: string;
  updatedAt?: number;
}

type SyncProfile = Profile & Syncable;
type SyncSession = Session & Syncable;
type SyncAntwort = AntwortLog & Syncable;

// ── Push: Lokal → Supabase ──────────────────────────────────

async function ensureSyncId<T extends Syncable>(
  table: 'profiles' | 'sessions' | 'antworten',
  record: T & { id?: number },
): Promise<T & { syncId: string; updatedAt: number }> {
  if (!record.syncId) {
    record.syncId = uuid();
    record.updatedAt = record.updatedAt ?? now();
    await db.table(table).update(record.id!, { syncId: record.syncId, updatedAt: record.updatedAt });
  }
  return record as T & { syncId: string; updatedAt: number };
}

async function pushProfiles(userId: string) {
  const profiles = (await db.profiles.toArray()) as SyncProfile[];
  for (const p of profiles) {
    const synced = await ensureSyncId('profiles', p);
    await supabase!.from('profiles').upsert({
      sync_id: synced.syncId,
      user_id: userId,
      local_id: p.id,
      name: p.name,
      avatar: p.avatar,
      avatar_config: p.avatarConfig ?? null,
      farbe: p.farbe,
      erstellt_am: p.erstelltAm,
      updated_at: synced.updatedAt,
    }, { onConflict: 'sync_id' });
  }
}

async function pushSessions(userId: string) {
  const sessions = (await db.sessions.toArray()) as SyncSession[];
  const profiles = (await db.profiles.toArray()) as SyncProfile[];

  for (const s of sessions) {
    const synced = await ensureSyncId('sessions', s);
    const profile = profiles.find((p) => p.id === s.profileId);
    const profileSyncId = profile?.syncId ?? null;

    await supabase!.from('sessions').upsert({
      sync_id: synced.syncId,
      user_id: userId,
      local_id: s.id,
      profile_sync_id: profileSyncId,
      stufe_id: s.stufeId,
      gestartet_am: s.gestartetAm,
      beendet_am: s.beendetAm ?? null,
      updated_at: synced.updatedAt,
    }, { onConflict: 'sync_id' });
  }
}

async function pushAntworten(userId: string) {
  const antworten = (await db.antworten.toArray()) as SyncAntwort[];
  const profiles = (await db.profiles.toArray()) as SyncProfile[];
  const sessions = (await db.sessions.toArray()) as SyncSession[];

  // Batch in Gruppen von 100
  for (let i = 0; i < antworten.length; i += 100) {
    const batch = antworten.slice(i, i + 100);
    const rows = [];
    for (const a of batch) {
      const synced = await ensureSyncId('antworten', a);
      const profile = profiles.find((p) => p.id === a.profileId);
      const session = sessions.find((s) => s.id === a.sessionId);

      rows.push({
        sync_id: synced.syncId,
        user_id: userId,
        local_id: a.id,
        session_sync_id: session?.syncId ?? null,
        profile_sync_id: profile?.syncId ?? null,
        stufe_id: a.stufeId,
        aufgabe_id: a.aufgabeId,
        aufgabe_snapshot: a.aufgabeSnapshot,
        antwort: a.antwort,
        richtig: a.richtig,
        dauer_ms: a.dauerMs,
        tipp_benutzt: a.tippBenutzt,
        tipp_stufe: a.tippStufe,
        erstellt_am: a.erstelltAm,
        updated_at: synced.updatedAt,
      });
    }
    if (rows.length > 0) {
      await supabase!.from('antworten').upsert(rows, { onConflict: 'sync_id' });
    }
  }
}

// ── Pull: Supabase → Lokal ──────────────────────────────────

async function pullProfiles(userId: string) {
  const { data: remote } = await supabase!
    .from('profiles')
    .select('*')
    .eq('user_id', userId);

  if (!remote) return;

  const local = (await db.profiles.toArray()) as SyncProfile[];
  const localBySyncId = new Map(local.filter((p) => p.syncId).map((p) => [p.syncId, p]));

  for (const r of remote) {
    const existing = localBySyncId.get(r.sync_id);
    if (existing) {
      // Last-write-wins
      if (r.updated_at > (existing.updatedAt ?? 0)) {
        await db.profiles.update(existing.id!, {
          name: r.name,
          avatar: r.avatar,
          avatarConfig: r.avatar_config,
          farbe: r.farbe,
          updatedAt: r.updated_at,
        });
      }
    } else {
      // Neues Profil von anderem Gerät
      await db.profiles.add({
        name: r.name,
        avatar: r.avatar,
        avatarConfig: r.avatar_config,
        farbe: r.farbe,
        erstelltAm: r.erstellt_am,
        syncId: r.sync_id,
        updatedAt: r.updated_at,
      } as SyncProfile);
    }
  }
}

async function pullSessions(userId: string) {
  const { data: remote } = await supabase!
    .from('sessions')
    .select('*')
    .eq('user_id', userId);

  if (!remote) return;

  const local = (await db.sessions.toArray()) as SyncSession[];
  const localBySyncId = new Map(local.filter((s) => s.syncId).map((s) => [s.syncId, s]));
  const profiles = (await db.profiles.toArray()) as SyncProfile[];
  const profileBySync = new Map(profiles.filter((p) => p.syncId).map((p) => [p.syncId, p]));

  for (const r of remote) {
    const existing = localBySyncId.get(r.sync_id);
    if (existing) {
      if (r.updated_at > (existing.updatedAt ?? 0)) {
        await db.sessions.update(existing.id!, {
          beendetAm: r.beendet_am,
          updatedAt: r.updated_at,
        });
      }
    } else {
      const profile = profileBySync.get(r.profile_sync_id);
      if (!profile) continue; // Zugehöriges Profil fehlt lokal
      await db.sessions.add({
        profileId: profile.id!,
        stufeId: r.stufe_id,
        gestartetAm: r.gestartet_am,
        beendetAm: r.beendet_am,
        syncId: r.sync_id,
        updatedAt: r.updated_at,
      } as SyncSession);
    }
  }
}

async function pullAntworten(userId: string) {
  const lastSync = useSyncStore.getState().lastSyncAt ?? 0;
  const { data: remote } = await supabase!
    .from('antworten')
    .select('*')
    .eq('user_id', userId)
    .gt('updated_at', lastSync)
    .order('erstellt_am', { ascending: true });

  if (!remote || remote.length === 0) return;

  const local = (await db.antworten.toArray()) as SyncAntwort[];
  const localBySyncId = new Set(local.filter((a) => a.syncId).map((a) => a.syncId));
  const profiles = (await db.profiles.toArray()) as SyncProfile[];
  const profileBySync = new Map(profiles.filter((p) => p.syncId).map((p) => [p.syncId, p]));
  const sessions = (await db.sessions.toArray()) as SyncSession[];
  const sessionBySync = new Map(sessions.filter((s) => s.syncId).map((s) => [s.syncId, s]));

  for (const r of remote) {
    if (localBySyncId.has(r.sync_id)) continue; // Bereits lokal vorhanden

    const profile = profileBySync.get(r.profile_sync_id);
    const session = sessionBySync.get(r.session_sync_id);
    if (!profile) continue;

    await db.antworten.add({
      sessionId: session?.id ?? 0,
      profileId: profile.id!,
      stufeId: r.stufe_id,
      aufgabeId: r.aufgabe_id,
      aufgabeSnapshot: r.aufgabe_snapshot ?? '',
      antwort: r.antwort,
      richtig: r.richtig,
      dauerMs: r.dauer_ms,
      tippBenutzt: r.tipp_benutzt,
      tippStufe: r.tipp_stufe,
      erstelltAm: r.erstellt_am,
      syncId: r.sync_id,
      updatedAt: r.updated_at,
    } as SyncAntwort);
  }
}

// ── Einstellungen (Zustand-Stores ↔ Supabase JSON-Blob) ─────

function collectEinstellungen(): Record<string, unknown> {
  return {
    deaktivierteAufgaben: useDeaktivierteAufgaben.getState().deaktiviert,
    schwierigkeitOverrides: useSchwierigkeitStore.getState().overrides,
    lernmodus: useLernmodusStore.getState().modi,
    elternPin: useProfileStore.getState().elternPin,
  };
}

function applyEinstellungen(data: Record<string, unknown>) {
  if (Array.isArray(data.deaktivierteAufgaben)) {
    const store = useDeaktivierteAufgaben.getState();
    // Merge: Remote-Deaktivierungen hinzufügen (union)
    const merged = [...new Set([...store.deaktiviert, ...data.deaktivierteAufgaben as string[]])];
    if (merged.length !== store.deaktiviert.length) {
      useDeaktivierteAufgaben.setState({ deaktiviert: merged });
    }
  }

  if (data.schwierigkeitOverrides && typeof data.schwierigkeitOverrides === 'object') {
    const current = useSchwierigkeitStore.getState().overrides;
    const remote = data.schwierigkeitOverrides as Record<string, { adaptiv: boolean; fixedLevel: number }>;
    // Remote-Overrides übernehmen (falls lokal nicht gesetzt)
    const merged = { ...remote, ...current };
    useSchwierigkeitStore.setState({ overrides: merged });
  }

  if (data.lernmodus && typeof data.lernmodus === 'object') {
    const current = useLernmodusStore.getState().modi;
    const remote = data.lernmodus as Record<string, string>;
    const merged = { ...remote, ...current };
    useLernmodusStore.setState({ modi: merged as Record<string, 'frei' | 'sanft' | 'gezielt'> });
  }

  if (typeof data.elternPin === 'string' && !useProfileStore.getState().elternPin) {
    useProfileStore.getState().setElternPin(data.elternPin);
  }
}

async function pushEinstellungen(userId: string) {
  const data = collectEinstellungen();
  await supabase!.from('einstellungen').upsert({
    user_id: userId,
    data,
    updated_at: now(),
  }, { onConflict: 'user_id' });
}

async function pullEinstellungen(userId: string) {
  const { data: row } = await supabase!
    .from('einstellungen')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (row?.data && typeof row.data === 'object') {
    applyEinstellungen(row.data as Record<string, unknown>);
  }
}

// ── Öffentliche API ─────────────────────────────────────────

export async function fullSync(): Promise<void> {
  if (!supabase) return;

  const userId = await getUserId();
  if (!userId) return;

  const store = useSyncStore.getState();
  store.setStatus('syncing');

  try {
    // Pull zuerst (fremde Geräte-Daten holen)
    await pullProfiles(userId);
    await pullSessions(userId);
    await pullAntworten(userId);
    await pullEinstellungen(userId);

    // Dann Push (lokale Daten hochladen)
    await pushProfiles(userId);
    await pushSessions(userId);
    await pushAntworten(userId);
    await pushEinstellungen(userId);

    store.setLastSync(now());
    store.setStatus('synced');
  } catch (err) {
    console.error('[Sync] Fehler:', err);
    store.setError(err instanceof Error ? err.message : 'Sync fehlgeschlagen');
  }
}

export async function pushAfterWrite(): Promise<void> {
  if (!supabase) return;
  const userId = await getUserId();
  if (!userId) return;

  try {
    await pushProfiles(userId);
    await pushSessions(userId);
    await pushAntworten(userId);
    await pushEinstellungen(userId);
    useSyncStore.getState().setLastSync(now());
  } catch (err) {
    console.error('[Sync] Push fehlgeschlagen:', err);
  }
}

// ── Auth ─────────────────────────────────────────────────────

export async function loginWithEmail(email: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase nicht konfiguriert' };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) return { error: error.message };
  return {};
}

export async function logout(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
  useSyncStore.getState().clearUser();
}

export function initAuthListener(): () => void {
  if (!supabase) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    const store = useSyncStore.getState();
    if (session?.user) {
      store.setUser(session.user.email ?? '', session.user.id);
      // Sync nach Login
      fullSync();
    } else {
      store.clearUser();
    }
  });

  // Initiale Session prüfen
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      const store = useSyncStore.getState();
      store.setUser(session.user.email ?? '', session.user.id);
      fullSync();
    }
  });

  return () => subscription.unsubscribe();
}

// ── Periodischer Sync (alle 60s) ────────────────────────────

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startPeriodicSync() {
  if (syncInterval) return;
  syncInterval = setInterval(() => {
    const { userId } = useSyncStore.getState();
    if (userId) fullSync();
  }, 60_000);
}

export function stopPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}
