import { Card } from './Card';
import { useProfileStore } from '@/stores/profileStore';
import { AvatarDisplay, type AvatarConfig } from './AvatarDisplay';
import type { MaskottchenTier, MaskottchenFarbe } from './MaskottchenSvg';
import { MarkdownText } from '@/aufgaben/views/MarkdownText';
import { UngleichungenMerkkasten } from './UngleichungenMerkkasten';
import { BruchMerkkasten } from './BruchKreis';

/** SVG-Ersatz für bestimmte tippBilder. Gibt JSX oder null zurück. */
function TippBildErsatz({ src }: { src: string }): React.ReactNode {
  if (src.includes('regel-ungleichungen')) return <UngleichungenMerkkasten />;
  if (src.includes('merkkasten-brueche')) return <BruchMerkkasten />;
  return null;
}

interface TippSystemProps {
  tipps: string[] | null;
  tippBilder?: (string | undefined)[];
  stufe: number;
  onAdvance: () => void;
}

const labels = ['💡 Denkanstoß', '🔍 Methode', '📝 Schritt für Schritt', '✅ Lösungsweg'];
const buttonLabels = ['Mehr Hilfe', 'Noch mehr Hilfe', 'Lösung zeigen'];

function useAvatarForTipp(): AvatarConfig {
  const avatarConfig = useProfileStore((s) => s.activeAvatarConfig);
  return {
    tier: (avatarConfig.tier ?? 'fuchs') as MaskottchenTier,
    farbe: (avatarConfig.farbe ?? 'teal') as MaskottchenFarbe,
    accessoire: avatarConfig.accessoire as AvatarConfig['accessoire'] ?? 'none',
    name: avatarConfig.name ?? 'Mia',
  };
}

/** Kleiner Glühbirnen-Button — platzierbar z.B. oben rechts in einer Card. */
export function TippButton({
  onAdvance,
  disabled = false,
}: {
  onAdvance: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onAdvance}
      disabled={disabled}
      className="shrink-0 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30 bg-transparent text-primary border-2 border-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Tipp anzeigen"
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1C4.7 1 2 3.7 2 7c0 2 1 3.8 2.5 4.8V13a1 1 0 001 1h5a1 1 0 001-1v-1.2C13 10.8 14 9 14 7c0-3.3-2.7-6-6-6z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Tipp-Inhalte — zeigt die aufgedeckten Tipps + "Mehr Hilfe"-Link. */
export function TippInhalte({ tipps, tippBilder, stufe, onAdvance }: TippSystemProps) {
  const config = useAvatarForTipp();

  if (!tipps || stufe === 0) return null;

  return (
    <Card className="bg-warning-bg border-warning/20">
      <div className="flex gap-3">
        <AvatarDisplay config={config} emotion="thinking" size={40} className="shrink-0 mt-0.5" />
        <div className="space-y-3 flex-1">
          {tipps.slice(0, stufe).map((text, i) => (
            <div key={i}>
              <p className="text-xs font-bold text-heading">{labels[i]}</p>
              <MarkdownText text={text} className="text-sm text-body mt-0.5" />
              {tippBilder?.[i] && (
                TippBildErsatz({ src: tippBilder[i]! }) || (
                  <img
                    src={`/${tippBilder[i]}`}
                    alt={labels[i]}
                    className="mt-2 rounded-lg border border-border max-w-full"
                    loading="lazy"
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {tipps && stufe < tipps.length && (
        <button
          onClick={onAdvance}
          className="mt-3 text-xs font-semibold text-primary hover:text-primary-hover cursor-pointer underline underline-offset-2"
        >
          {buttonLabels[stufe - 1]}
        </button>
      )}
    </Card>
  );
}

/**
 * Kombinierte Variante (Abwärtskompatibilität).
 * Zeigt Button wenn stufe===0, danach die Inhalte.
 */
export function TippSystem({ tipps, stufe, onAdvance }: TippSystemProps) {
  if (!tipps) return null;

  if (stufe === 0) {
    return <TippButton onAdvance={onAdvance} />;
  }

  return <TippInhalte tipps={tipps} stufe={stufe} onAdvance={onAdvance} />;
}
