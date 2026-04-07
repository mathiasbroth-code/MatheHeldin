import { useState, useMemo, useEffect } from 'react';
import { aufgabenPool } from '@/aufgaben/pool';
import { STAGE_MAPPING, KATEGORIEN, getStageMeta } from '@/aufgaben/stageMapping';
import { AufgabeWrapper } from '@/aufgaben/views/AufgabeWrapper';
import { MarkdownText } from '@/aufgaben/views/MarkdownText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDeaktivierteAufgaben } from '@/stores/deaktivierteAufgabenStore';
import type { BankAufgabe, Schwierigkeit } from '@/aufgaben/types';

const SCHWIERIGKEITS_BADGE: Record<Schwierigkeit, string> = {
  gelb: 'bg-yellow-100 text-yellow-800',
  grün: 'bg-emerald-100 text-emerald-800',
  orange: 'bg-orange-100 text-orange-800',
};

/**
 * Aufgaben-Prüfer: Eltern können alle Aufgaben durchklicken,
 * prüfen und problematische markieren.
 */
export function AufgabenPruefer() {
  const [markierte, setMarkierte] = useState<Set<string>>(new Set());
  const [aktiveAufgabe, setAktiveAufgabe] = useState<BankAufgabe | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [showLoesung, setShowLoesung] = useState(false);
  const [copied, setCopied] = useState(false);
  const deaktiviert = useDeaktivierteAufgaben((s) => s.deaktiviert);
  const deaktiviereMehrere = useDeaktivierteAufgaben((s) => s.deaktiviereMehrere);
  const aktiviereMehrere = useDeaktivierteAufgaben((s) => s.aktiviereMehrere);
  const toggleDeaktiviert = useDeaktivierteAufgaben((s) => s.toggle);

  // Alle Aufgaben nach Stage gruppiert, in Mapping-Reihenfolge
  const stagesWithAufgaben = useMemo(() => {
    const result: { stageId: string; titel: string; kategorie: string; aufgaben: BankAufgabe[] }[] = [];
    for (const mapping of STAGE_MAPPING) {
      const aufgaben = aufgabenPool.getAll({ stageId: mapping.stageId });
      if (aufgaben.length === 0) continue;
      const katMeta = KATEGORIEN.find((k) => k.id === mapping.kategorie);
      result.push({
        stageId: mapping.stageId,
        titel: mapping.titel,
        kategorie: katMeta?.titel ?? mapping.kategorie,
        aufgaben,
      });
    }
    return result;
  }, []);

  // Alle Aufgaben flach für Navigation
  const alleAufgaben = useMemo(
    () => stagesWithAufgaben.flatMap((s) => s.aufgaben),
    [stagesWithAufgaben],
  );

  const aktiveIdx = aktiveAufgabe
    ? alleAufgaben.findIndex((a) => a._poolId === aktiveAufgabe._poolId)
    : -1;

  function toggleMarkierung(poolId: string) {
    setMarkierte((prev) => {
      const next = new Set(prev);
      if (next.has(poolId)) next.delete(poolId);
      else next.add(poolId);
      return next;
    });
  }

  function navigiere(delta: number) {
    const nextIdx = aktiveIdx + delta;
    if (nextIdx >= 0 && nextIdx < alleAufgaben.length) {
      setAktiveAufgabe(alleAufgaben[nextIdx]);
      setShowLoesung(false);
    }
  }

  async function kopiereMarkierte() {
    const ids = [...markierte].sort();
    const text = ids.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Pfeiltasten-Navigation (links/rechts)
  useEffect(() => {
    if (!aktiveAufgabe) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') navigiere(-1);
      if (e.key === 'ArrowRight') navigiere(1);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // ── Aufgaben-Vorschau (Vollbild-artig) ──
  if (aktiveAufgabe) {
    const stageMeta = getStageMeta(aktiveAufgabe.stageId);
    const istMarkiert = markierte.has(aktiveAufgabe._poolId);
    const istDeaktiviert = deaktiviert.includes(aktiveAufgabe._poolId);

    return (
      <div className="space-y-3">
        {/* Header mit Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAktiveAufgabe(null); setShowLoesung(false); }}
            className="text-sm text-primary font-semibold cursor-pointer hover:underline"
          >
            ← Zurück
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted tabular-nums">
            {aktiveIdx + 1} / {alleAufgaben.length}
          </span>
        </div>

        {/* ID + Metadaten */}
        <Card className="bg-surface">
          <div className="flex items-start gap-2">
            <button
              onClick={() => toggleMarkierung(aktiveAufgabe._poolId)}
              className={`mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                istMarkiert
                  ? 'bg-warning border-warning text-white'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {istMarkiert && '✓'}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-primary font-bold">{aktiveAufgabe._poolId}</p>
              <p className="text-sm font-semibold text-heading mt-0.5">{aktiveAufgabe.titel}</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${SCHWIERIGKEITS_BADGE[aktiveAufgabe.schwierigkeit]}`}>
                  {aktiveAufgabe.schwierigkeit}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                  {aktiveAufgabe.typ}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {stageMeta?.titel ?? aktiveAufgabe.stageId}
                </span>
                {istDeaktiviert && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                    deaktiviert
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleDeaktiviert(aktiveAufgabe._poolId)}
                className={`mt-1 text-xs font-semibold px-3 py-1 rounded-lg border cursor-pointer transition-colors ${
                  istDeaktiviert
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                {istDeaktiviert ? 'Wieder aktivieren' : 'Deaktivieren'}
              </button>
            </div>
          </div>
        </Card>

        {/* Aufgabe wie das Kind sie sieht */}
        <AufgabeWrapper
          aufgabe={aktiveAufgabe}
          onRichtig={() => {}}
          onFalsch={() => {}}
        />

        {/* Lösung + Tipps (Toggle) */}
        <button
          onClick={() => setShowLoesung(!showLoesung)}
          className="text-xs text-primary font-semibold cursor-pointer hover:underline w-full text-left"
        >
          {showLoesung ? '▲ Lösung & Tipps ausblenden' : '▼ Lösung & Tipps anzeigen'}
        </button>
        {showLoesung && (
          <Card className="bg-emerald-50/50 border-emerald-200/50 space-y-2">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Lösung</p>
              <MarkdownText text={aktiveAufgabe.loesung} className="text-xs text-body" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Lösungsweg</p>
              <MarkdownText text={aktiveAufgabe.loesungsweg} className="text-xs text-body" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Tipps</p>
              {aktiveAufgabe.tipps.map((t, i) => (
                <p key={i} className="text-xs text-body ml-2">
                  <span className="text-muted">{i + 1}.</span> {t}
                </p>
              ))}
            </div>
            {aktiveAufgabe.didaktischerHinweis && (
              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Didaktischer Hinweis</p>
                <p className="text-xs text-muted italic">{aktiveAufgabe.didaktischerHinweis}</p>
              </div>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => navigiere(-1)}
            disabled={aktiveIdx <= 0}
          >
            ← Vorherige
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigiere(1)}
            disabled={aktiveIdx >= alleAufgaben.length - 1}
          >
            Nächste →
          </Button>
        </div>
      </div>
    );
  }

  // ── Stage-Liste mit Aufgaben ──
  return (
    <div className="space-y-3">
      <Card className="bg-surface">
        <p className="text-sm text-heading font-semibold">Aufgaben-Prüfer</p>
        <p className="text-xs text-muted mt-0.5">
          Klicke auf eine Aufgabe um sie so zu sehen, wie das Kind sie sieht.
          Markiere fehlerhafte Aufgaben per Checkbox.
        </p>
        <p className="text-xs text-muted mt-0.5">
          {alleAufgaben.length} Aufgaben in {stagesWithAufgaben.length} Stages
        </p>
      </Card>

      {/* Deaktivierte Aufgaben */}
      {deaktiviert.length > 0 && (
        <Card className="bg-rose-50/50 border-rose-200/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-rose-600">{deaktiviert.length}</span>
            <span className="text-xs text-body flex-1">Aufgabe{deaktiviert.length > 1 ? 'n' : ''} deaktiviert</span>
            <button
              onClick={() => aktiviereMehrere(deaktiviert)}
              className="text-[10px] text-rose-600 font-semibold cursor-pointer hover:underline"
            >
              Alle aktivieren
            </button>
          </div>
        </Card>
      )}

      {/* Markierte-Leiste */}
      {markierte.size > 0 && (
        <Card className="bg-warning/10 border-warning/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-warning">{markierte.size}</span>
            <span className="text-xs text-body flex-1">markiert</span>
            <Button onClick={() => { deaktiviereMehrere([...markierte]); setMarkierte(new Set()); }} className="text-xs !py-1 !px-3 !bg-rose-500 hover:!bg-rose-600">
              Deaktivieren
            </Button>
            <Button onClick={kopiereMarkierte} className="text-xs !py-1 !px-3">
              {copied ? '✓ Kopiert!' : 'IDs kopieren'}
            </Button>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {[...markierte].sort().map((id) => (
              <span key={id} className="text-[10px] font-mono bg-warning/20 text-warning px-1.5 py-0.5 rounded">
                {id}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Stage-Accordion */}
      {stagesWithAufgaben.map(({ stageId, titel, kategorie, aufgaben }) => {
        const isExpanded = expandedStage === stageId;
        const markCount = aufgaben.filter((a) => markierte.has(a._poolId)).length;

        return (
          <Card key={stageId} className="overflow-hidden !p-0">
            <button
              onClick={() => setExpandedStage(isExpanded ? null : stageId)}
              className="w-full flex items-center gap-2 p-3 text-left cursor-pointer hover:bg-surface/50"
            >
              <span className="text-sm font-semibold text-heading flex-1 truncate">
                {titel}
              </span>
              <span className="text-[10px] text-muted">{kategorie}</span>
              <span className="text-xs text-muted tabular-nums">{aufgaben.length}</span>
              {markCount > 0 && (
                <span className="text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                  {markCount}
                </span>
              )}
              <span className="text-muted text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-border">
                {aufgaben.map((aufgabe) => {
                  const istMarkiert = markierte.has(aufgabe._poolId);
                  const istDeaktiviert = deaktiviert.includes(aufgabe._poolId);
                  return (
                    <div
                      key={aufgabe._poolId}
                      className={`flex items-center gap-2 px-3 py-2 border-b border-border/50 last:border-b-0 ${
                        istDeaktiviert ? 'bg-rose-50/50 opacity-60' : istMarkiert ? 'bg-warning/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleMarkierung(aufgabe._poolId)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer text-xs transition-colors ${
                          istMarkiert
                            ? 'bg-warning border-warning text-white'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        {istMarkiert && '✓'}
                      </button>

                      {/* Aufgabe anklicken → Vorschau */}
                      <button
                        onClick={() => { setAktiveAufgabe(aufgabe); setShowLoesung(false); }}
                        className="flex-1 text-left min-w-0 cursor-pointer hover:text-primary"
                      >
                        <p className={`text-xs truncate ${istDeaktiviert ? 'line-through text-muted' : 'text-body'}`}>{aufgabe.titel}</p>
                        <p className="text-[10px] font-mono text-muted">{aufgabe._poolId}</p>
                      </button>

                      {/* Badges */}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${SCHWIERIGKEITS_BADGE[aufgabe.schwierigkeit]}`}>
                        {aufgabe.schwierigkeit}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                        {aufgabe.typ}
                      </span>
                      {istDeaktiviert && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 font-bold flex-shrink-0">
                          aus
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
