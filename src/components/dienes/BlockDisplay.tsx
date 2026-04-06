import { Einer } from './Einer';
import { Zehner } from './Zehner';
import { Hunderter } from './Hunderter';
import { Tausender } from './Tausender';

interface BlockDisplayProps {
  T?: number;
  H?: number;
  Z?: number;
  E?: number;
}

export function BlockDisplay({ T = 0, H = 0, Z = 0, E = 0 }: BlockDisplayProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 min-h-[110px]">
      {Array.from({ length: T }, (_, i) => (
        <Tausender key={`t${i}`} />
      ))}
      {H > 0 && (
        <div className="flex flex-wrap gap-2 items-end">
          {Array.from({ length: H }, (_, i) => (
            <Hunderter key={`h${i}`} />
          ))}
        </div>
      )}
      {Z > 0 && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: Z }, (_, i) => (
            <Zehner key={`z${i}`} />
          ))}
        </div>
      )}
      {E > 0 && (
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: E }, (_, i) => (
            <Einer key={`e${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
