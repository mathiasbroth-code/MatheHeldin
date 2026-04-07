import type { BankAufgabe, AufgabenFilter } from './types';
import { randInt } from '@/lib/helpers';

/**
 * Aufgaben-Pool: hält alle geladenen Aufgaben und bietet gefilterte Abfragen.
 */
class AufgabenPool {
  private aufgaben: BankAufgabe[] = [];

  /** Zähler pro stageId für stabile ID-Vergabe. */
  private idCounters = new Map<string, number>();

  /** Fügt Aufgaben zum Pool hinzu und vergibt stabile _poolId. */
  load(aufgaben: BankAufgabe[]): void {
    for (const a of aufgaben) {
      const count = (this.idCounters.get(a.stageId) ?? 0) + 1;
      this.idCounters.set(a.stageId, count);
      a._poolId = `${a.stageId}#${count}`;
    }
    this.aufgaben.push(...aufgaben);
  }

  /** Anzahl Aufgaben im Pool (optional gefiltert). */
  getCount(filter?: AufgabenFilter): number {
    return this.applyFilter(filter).length;
  }

  /** Alle Aufgaben die zum Filter passen. */
  getAll(filter?: AufgabenFilter): BankAufgabe[] {
    return this.applyFilter(filter);
  }

  /** Zufällige Aufgabe die zum Filter passt (oder null). */
  getRandom(filter?: AufgabenFilter): BankAufgabe | null {
    const matching = this.applyFilter(filter);
    if (matching.length === 0) return null;
    return matching[randInt(0, matching.length - 1)];
  }

  /** Nächste Aufgabe in Ladereihenfolge (für sequentielle Stages). */
  getNext(filter?: AufgabenFilter, afterPoolId?: string): BankAufgabe | null {
    const matching = this.applyFilter(filter);
    if (matching.length === 0) return null;
    if (!afterPoolId) return matching[0];
    const idx = matching.findIndex((a) => a._poolId === afterPoolId);
    if (idx === -1 || idx >= matching.length - 1) return matching[0]; // wrap around
    return matching[idx + 1];
  }

  /** Alle eindeutigen Stage-IDs im Pool. */
  getStageIds(): string[] {
    return [...new Set(this.aufgaben.map((a) => a.stageId))].filter(Boolean);
  }

  /** Alle eindeutigen Kapitel im Pool. */
  getKapitel(): string[] {
    return [...new Set(this.aufgaben.map((a) => a.kapitel))].filter(Boolean);
  }

  private applyFilter(filter?: AufgabenFilter): BankAufgabe[] {
    if (!filter) return this.aufgaben.filter((a) => a.digital !== 'platzhalter');

    return this.aufgaben.filter((a) => {
      // Platzhalter ausschließen (außer explizit angefragt)
      if (a.digital === 'platzhalter' && filter.digital !== 'platzhalter') return false;
      if (filter.stageId && a.stageId !== filter.stageId) return false;
      if (filter.schwierigkeit && a.schwierigkeit !== filter.schwierigkeit) return false;
      if (filter.typ && a.typ !== filter.typ) return false;
      if (filter.kapitel && a.kapitel !== filter.kapitel) return false;
      if (filter.digital && a.digital !== filter.digital) return false;
      if (filter.excludeIds && filter.excludeIds.includes(a._poolId)) return false;
      return true;
    });
  }
}

/** Singleton-Instanz des Aufgaben-Pools. */
export const aufgabenPool = new AufgabenPool();
