import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visual size variant for the input */
  sizing?: 'default' | 'xl';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ sizing = 'default', className = '', ...props }, ref) => {
    const base =
      'w-full border-2 border-border rounded-xl bg-white text-heading font-bold transition-all duration-200 focus:border-primary focus:ring-3 focus:ring-primary/20 focus:outline-none placeholder:text-muted placeholder:font-normal';

    const sizes = {
      default: 'px-4 py-2.5 text-lg min-h-[44px]',
      xl: 'px-4 py-3 text-4xl text-center tabular-nums min-h-[56px]',
    };

    return (
      <input
        ref={ref}
        className={`${base} ${sizes[sizing]} ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
