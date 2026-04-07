/**
 * Fibonacci-Folge als horizontale Zahlenreihe mit farbigen Boxen.
 */

const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

export function FibonacciReihe() {
  const maxVal = FIB[FIB.length - 1];

  return (
    <div className="space-y-2">
      {/* Zahlenreihe */}
      <div className="flex items-end justify-center gap-0.5 h-16">
        {FIB.map((val, i) => {
          const height = Math.max(12, (val / maxVal) * 56);
          const opacity = 0.15 + (i / FIB.length) * 0.85;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold text-primary tabular-nums">{val}</span>
              <div
                className="w-6 rounded-t"
                style={{
                  height: `${height}px`,
                  backgroundColor: `rgba(13, 148, 136, ${opacity})`,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Additions-Hinweis */}
      <div className="flex items-center justify-center gap-1 text-[9px] text-muted">
        <span>1</span><span>+</span><span>1</span><span>=</span><span className="font-bold text-primary">2</span>
        <span className="mx-1">|</span>
        <span>1</span><span>+</span><span>2</span><span>=</span><span className="font-bold text-primary">3</span>
        <span className="mx-1">|</span>
        <span>2</span><span>+</span><span>3</span><span>=</span><span className="font-bold text-primary">5</span>
        <span className="mx-1">| ...</span>
      </div>
    </div>
  );
}
