import { StageIcon } from '../ui/StageIcon';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  onBack?: () => void;
}

export function Header({ title = 'Mathe-Heldin', subtitle, icon, onBack }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 safe-area-top">
      {onBack && (
        <button
          onClick={onBack}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-primary hover:bg-primary-light transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-3 focus:ring-primary/30"
          aria-label="Zurück"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {icon && <StageIcon icon={icon} size={32} />}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-semibold text-heading truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted truncate">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
