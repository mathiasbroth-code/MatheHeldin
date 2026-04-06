interface HunderterProps {
  size?: number;
}

export function Hunderter({ size = 9 }: HunderterProps) {
  return (
    <svg width={size * 10} height={size * 10} viewBox="0 0 100 100">
      <rect x="1" y="1" width="98" height="98" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" rx="2" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={10 + i * 10} y1="1" x2={10 + i * 10} y2="99" stroke="#92400e" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="1" y1={10 + i * 10} x2="99" y2={10 + i * 10} stroke="#92400e" strokeWidth="0.6" />
      ))}
    </svg>
  );
}
