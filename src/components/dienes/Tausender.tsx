interface TausenderProps {
  size?: number;
}

export function Tausender({ size = 8 }: TausenderProps) {
  return (
    <svg width={size * 14} height={size * 14} viewBox="0 0 140 140">
      <rect x="10" y="30" width="100" height="100" fill="#f59e0b" stroke="#78350f" strokeWidth="1.8" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`fv${i}`} x1={20 + i * 10} y1="30" x2={20 + i * 10} y2="130" stroke="#78350f" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`fh${i}`} x1="10" y1={40 + i * 10} x2="110" y2={40 + i * 10} stroke="#78350f" strokeWidth="0.6" />
      ))}
      <polygon points="10,30 40,5 140,5 110,30" fill="#fcd34d" stroke="#78350f" strokeWidth="1.8" />
      <polygon points="110,30 140,5 140,105 110,130" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
    </svg>
  );
}
