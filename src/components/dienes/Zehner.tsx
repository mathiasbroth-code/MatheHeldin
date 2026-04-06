interface ZehnerProps {
  size?: number;
}

export function Zehner({ size = 20 }: ZehnerProps) {
  return (
    <svg width={size * 5} height={size} viewBox="0 0 100 20">
      <rect x="1" y="1" width="98" height="18" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" rx="2" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={10 + i * 10} y1="1" x2={10 + i * 10} y2="19" stroke="#b45309" strokeWidth="0.8" />
      ))}
    </svg>
  );
}
