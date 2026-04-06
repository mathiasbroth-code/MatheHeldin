import type { ReactNode } from 'react';

interface FeedbackBannerProps {
  typ: 'richtig' | 'falsch' | null;
  children?: ReactNode;
  hinweis?: string;
}

export function FeedbackBanner({ typ, children, hinweis }: FeedbackBannerProps) {
  if (!typ) return null;

  if (typ === 'richtig') {
    return (
      <div className="bg-success-bg border border-success/30 rounded-2xl p-4 text-center">
        <div className="text-lg font-semibold text-success">
          Super gemacht!
        </div>
        {children && (
          <div className="text-sm text-success/80 mt-1">{children}</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-warning-bg border border-warning/30 rounded-2xl p-4 text-center">
      <div className="text-base font-semibold text-warning">
        Noch nicht ganz.
      </div>
      {hinweis && (
        <div className="text-sm text-body mt-1">{hinweis}</div>
      )}
      {children && <div className="text-sm text-body mt-1">{children}</div>}
    </div>
  );
}
