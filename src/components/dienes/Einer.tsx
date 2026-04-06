interface EinerProps {
  size?: number;
}

export function Einer({ size = 20 }: EinerProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <rect x="1" y="1" width="18" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" rx="2" />
    </svg>
  );
}
