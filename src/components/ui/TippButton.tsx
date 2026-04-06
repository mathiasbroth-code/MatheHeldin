interface TippButtonProps {
  onClick: () => void;
  aktiv: boolean;
  className?: string;
}

export function TippButton({ onClick, aktiv, className = '' }: TippButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer select-none focus:outline-none focus:ring-3 focus:ring-primary/30 ${
        aktiv
          ? 'bg-warning/10 text-warning border-2 border-warning/40'
          : 'bg-transparent text-primary border-2 border-primary hover:bg-primary-light'
      } ${className}`}
      aria-label={aktiv ? 'Tipp ausblenden' : 'Tipp anzeigen'}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1C4.7 1 2 3.7 2 7c0 2 1 3.8 2.5 4.8V13a1 1 0 001 1h5a1 1 0 001-1v-1.2C13 10.8 14 9 14 7c0-3.3-2.7-6-6-6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {aktiv ? 'Tipp aus' : 'Tipp'}
    </button>
  );
}
