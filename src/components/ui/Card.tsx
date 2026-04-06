import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
