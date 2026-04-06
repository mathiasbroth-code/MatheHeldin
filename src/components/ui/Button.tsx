import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-200 cursor-pointer select-none focus:outline-none focus:ring-3 focus:ring-primary/30';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-transparent text-primary border-2 border-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizes = {
    default: 'min-h-[44px] px-5 py-2.5 text-base',
    lg: 'min-h-[52px] px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
