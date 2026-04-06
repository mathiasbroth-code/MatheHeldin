import { useState, useMemo, useEffect } from "react";

/* =========================================================================
   MATHE-HELDIN v3 — Alle Stufen direkt offen
   ========================================================================= */

/* ---------- Dienes-Blöcke als SVG ---------- */

const Einer = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <rect x="1" y="1" width="18" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" rx="2" />
  </svg>
);

const Zehner = ({ size = 20 }) => (
  <svg width={size * 5} height={size} viewBox="0 0 100 20">
    <rect x="1" y="1" width="98" height="18" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" rx="2" />
    {[...Array(9)].map((_, i) => (
      <line key={i} x1={10 + i * 10} y1="1" x2={10 + i * 10} y2="19" stroke="#b45309" strokeWidth="0.8" />
    ))}
  </svg>
);

const Hunderter = ({ size = 9 }) => (
  <svg width={size * 10} height={size * 10} viewBox="0 0 100 100">
    <rect x="1" y="1" width="98" height="98" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" rx="2" />
    {[...Array(9)].map((_, i) => (
      <line key={"v" + i} x1={10 + i * 10} y1="1" x2={10 + i * 10} y2="99" stroke="#92400e" strokeWidth="0.6" />
    ))}
    {[...Array(9)].map((_, i) => (
      <line key={"h" + i} x1="1" y1={10 + i * 10} x2="99" y2={10 + i * 10} stroke="#92400e" strokeWidth="0.6" />
    ))}
  </svg>
);

const Tausender = ({ size = 8 }) => (
  <svg width={size * 14} height={size * 14} viewBox="0 0 140 140">
    <rect x="10" y="30" width="100" height="100" fill="#f59e0b" stroke="#78350f" strokeWidth="1.8" />
    {[...Array(9)].map((_, i) => (
      <line key={"fv" + i} x1={20 + i * 10} y1="30" x2={20 + i * 10} y2="130" stroke="#78350f" strokeWidth="0.6" />
    ))}
    {[...Array(9)].map((_, i) => (
      <line key={"fh" + i} x1="10" y1={40 + i * 10} x2="110" y2={40 + i * 10} stroke="#78350f" strokeWidth="0.6" />
    ))}
    <polygon points="10,30 40,5 140,5 110,30" fill="#fcd34d" stroke="#78350f" strokeWidth="1.8" />
    <polygon points="110,30 140,5 140,105 110,130" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
  </svg>
);

function BlockDisplay({ T = 0, H = 0, Z = 0, E = 0 }) {
  return (
    <div className="flex flex-wrap items-end gap-3 min-h-[110px]">
      {[...Array(T)].map((_, i) => (
        <Tausender key={"t" + i} />
      ))}
      {H > 0 && (
        <div className="flex flex-wrap gap-2 items-end">
          {[...Array(H)].map((_, i) => (
            <Hunderter key={"h" + i} />
          ))}
        </div>
      )}
      {Z > 0 && (
        <div className="flex flex-col gap-1">
          {[...Array(Z)].map((_, i) => (
            <Zehner key={"z" + i} />
          ))}
        </div>
      )}
      {E > 0 && (
        <div className="grid grid-cols-5 gap-1">
          {[...Array(E)].map((_, i) => (
            <Einer key={"e" + i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helper ---------- */

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmt = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
const digits = (n) => ({
  T: Math.floor(n / 1000),
  H: Math.floor((n % 1000) / 100),
  Z: Math.floor((n % 100) / 10),
  E: n % 10,
});

/* ---------- Stufen-Definitionen ---------- */

const STUFEN = [
  { id: "mengen20", titel: "Mengen bis 20", sub: "Zähle die Blöcke", icon: "🔢", type: "lesen", min: 3, max: 20 },
  { id: "buendeln", titel: "Zehner bündeln", sub: "Wie viele Zehner und Einer?", icon: "🧩", type: "buendeln" },
  { id: "bis100lesen", titel: "Zahlen bis 100 lesen", sub: "Welche Zahl ist das?", icon: "💯", type: "lesen", min: 11, max: 99 },
  { id: "bis100legen", titel: "Zahlen bis 100 legen", sub: "Baue die Zahl", icon: "🏗️", type: "legen", min: 11, max: 99 },
  { id: "bis1000lesen", titel: "Zahlen bis 1 000 lesen", sub: "Mit Hundertern", icon: "📖", type: "lesen", min: 101, max: 999 },
  { id: "bis1000legen", titel: "Zahlen bis 1 000 legen", sub: "Mit Hundertern", icon: "🧱", type: "legen", min: 101, max: 999 },
  { id: "bis10000lesen", titel: "Zahlen bis 10 000 lesen", sub: "Mit Tausendern", icon: "📚", type: "lesen", min: 1001, max: 9999 },
  { id: "bis10000legen", titel: "Zahlen bis 10 000 legen", sub: "Mit Tausendern", icon: "🏛️", type: "legen", min: 1001, max: 9999 },
  { id: "zerlegen", titel: "Zahlen zerlegen", sub: "1 T, 3 H, 4 Z, 5 E = ?", icon: "✂️", type: "zerlegen" },
  { id: "mitte", titel: "Zahl in der Mitte", sub: "Zwischen zwei Zahlen", icon: "🎯", type: "mitte" },
  { id: "skizze", titel: "Sachaufgaben mit Skizze", sub: "Strecken mit km", icon: "🗺️", type: "skizze" },
];

const ZIEL_PRO_STUFE = 5; // 5 richtige Antworten = 100%

/* ---------- Übung 1: Zahl lesen ---------- */

function ZahlLesenUebung({ stufe, onCorrect, onWrong }) {
  const [target, setTarget] = useState(() => randInt(stufe.min, stufe.max));
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);

  const d = digits(target);

  const check = () => {
    const n = parseInt(input, 10);
    if (isNaN(n)) return;
    if (n === target) {
      setStatus("ok");
      onCorrect();
    } else {
      setStatus("no");
      onWrong();
    }
  };

  const next = () => {
    setTarget(randInt(stufe.min, stufe.max));
    setInput("");
    setStatus(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-sky-200">
        <div className="text-sm uppercase tracking-wide text-sky-700 font-semibold">Welche Zahl ist das?</div>
        <div className="mt-3">
          <BlockDisplay T={d.T} H={d.H} Z={d.Z} E={d.E} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md">
        <input
          type="number"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (status === "no") setStatus(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="deine Antwort"
          className="w-full text-5xl font-bold tabular-nums text-center border-2 border-sky-200 rounded-lg py-3 focus:border-sky-500 focus:outline-none"
        />
      </div>

      {status === "ok" && (
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-2xl">🎉 Richtig!</div>
          <div className="text-sm text-emerald-900 mt-1">Die Zahl ist {fmt(target)}.</div>
        </div>
      )}
      {status === "no" && (
        <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-4 text-center">
          <div className="text-xl">🤔 Noch nicht ganz</div>
          <div className="text-sm text-rose-800 mt-1">Zähle jede Gruppe einzeln: Tausender, Hunderter, Zehner, Einer.</div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={check} className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 font-semibold text-white shadow">
          Prüfen
        </button>
        <button onClick={next} className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700">
          Nächste →
        </button>
      </div>
    </div>
  );
}

/* ---------- Übung 2: Zahl legen ---------- */

function ZahlLegenUebung({ stufe, onCorrect, onWrong }) {
  const [target, setTarget] = useState(() => randInt(stufe.min, stufe.max));
  const [counts, setCounts] = useState({ T: 0, H: 0, Z: 0, E: 0 });
  const [done, setDone] = useState(false);

  const current = counts.T * 1000 + counts.H * 100 + counts.Z * 10 + counts.E;

  const add = (k) => !done && setCounts((c) => ({ ...c, [k]: c[k] + 1 }));
  const sub = (k) => !done && setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] - 1) }));

  useEffect(() => {
    if (current === target && !done) {
      setDone(true);
      onCorrect();
    }
  }, [current, target, done, onCorrect]);

  const next = () => {
    setTarget(randInt(stufe.min, stufe.max));
    setCounts({ T: 0, H: 0, Z: 0, E: 0 });
    setDone(false);
  };

  const useT = stufe.max >= 1000;
  const useH = stufe.max >= 100;
  const keys = ["T", "H", "Z", "E"].filter((k) => (k === "T" ? useT : k === "H" ? useH : true));
  const labels = { T: "Tausender", H: "Hunderter", Z: "Zehner", E: "Einer" };
  const bg = { T: "bg-amber-500", H: "bg-amber-400", Z: "bg-yellow-300", E: "bg-yellow-200" };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-amber-200">
        <div className="text-sm uppercase tracking-wide text-amber-700 font-semibold">Lege die Zahl</div>
        <div className="text-6xl font-bold text-amber-900 tabular-nums mt-1">{fmt(target)}</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className={`grid gap-2 text-center`} style={{ gridTemplateColumns: `repeat(${keys.length}, 1fr)` }}>
          {keys.map((k) => (
            <div key={k}>
              <div className="text-xs font-bold text-slate-500">{labels[k]}</div>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg py-3 text-4xl font-bold tabular-nums text-slate-800 mt-1">
                {counts[k]}
              </div>
              <div className="flex gap-1 mt-2 justify-center">
                <button onClick={() => sub(k)} className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 text-lg font-bold">
                  −
                </button>
                <button onClick={() => add(k)} className={`w-9 h-9 rounded-lg ${bg[k]} hover:brightness-95 text-lg font-bold text-amber-900`}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3 text-2xl font-bold tabular-nums text-slate-700">= {fmt(current)}</div>
      </div>

      <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-4 shadow-md">
        <div className="text-xs uppercase tracking-wide text-amber-700 font-semibold mb-2">Deine Blöcke</div>
        <BlockDisplay T={counts.T} H={counts.H} Z={counts.Z} E={counts.E} />
      </div>

      {done && (
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-2xl">🎉 Geschafft!</div>
        </div>
      )}

      <button onClick={next} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-white shadow">
        Nächste Aufgabe →
      </button>
    </div>
  );
}

/* ---------- Übung 3: Bündeln ---------- */

function BuendelnUebung({ onCorrect, onWrong }) {
  const [target, setTarget] = useState(() => randInt(13, 59));
  const [inputZ, setInputZ] = useState("");
  const [inputE, setInputE] = useState("");
  const [status, setStatus] = useState(null);

  const d = digits(target);

  const check = () => {
    const z = parseInt(inputZ, 10);
    const e = parseInt(inputE, 10);
    if (isNaN(z) || isNaN(e)) return;
    if (z === d.Z && e === d.E) {
      setStatus("ok");
      onCorrect();
    } else {
      setStatus("no");
      onWrong();
    }
  };

  const next = () => {
    setTarget(randInt(13, 59));
    setInputZ("");
    setInputE("");
    setStatus(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-purple-200">
        <div className="text-sm uppercase tracking-wide text-purple-700 font-semibold">Hier sind {target} Einer-Würfel</div>
        <div className="mt-3 grid grid-cols-10 gap-1">
          {[...Array(target)].map((_, i) => (
            <Einer key={i} />
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-600">Bündel je 10 zu einem Zehner. Wie viele Zehner und wie viele Einer bleiben?</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-slate-500">Zehner</div>
            <input
              type="number"
              value={inputZ}
              onChange={(e) => {
                setInputZ(e.target.value);
                if (status === "no") setStatus(null);
              }}
              className="w-full mt-1 text-4xl font-bold tabular-nums text-center border-2 border-purple-200 rounded-lg py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">Einer</div>
            <input
              type="number"
              value={inputE}
              onChange={(e) => {
                setInputE(e.target.value);
                if (status === "no") setStatus(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              className="w-full mt-1 text-4xl font-bold tabular-nums text-center border-2 border-purple-200 rounded-lg py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {status === "ok" && (
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-2xl">🎉 Richtig!</div>
          <div className="text-sm text-emerald-900 mt-1">
            {target} = {d.Z} Zehner + {d.E} Einer
          </div>
        </div>
      )}
      {status === "no" && (
        <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-4 text-center">
          <div className="text-xl">🤔 Zähl nochmal in 10er-Gruppen</div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={check} className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 font-semibold text-white shadow">
          Prüfen
        </button>
        <button onClick={next} className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700">
          Nächste →
        </button>
      </div>
    </div>
  );
}

/* ---------- Übung 4: Zerlegen ---------- */

function ZerlegenUebung({ onCorrect, onWrong }) {
  const [target, setTarget] = useState(() => randInt(1011, 9999));
  const [input, setInput] = useState({ T: "", H: "", Z: "", E: "" });
  const [status, setStatus] = useState(null);

  const d = digits(target);

  const check = () => {
    const ok =
      Number(input.T || 0) === d.T &&
      Number(input.H || 0) === d.H &&
      Number(input.Z || 0) === d.Z &&
      Number(input.E || 0) === d.E;
    if (ok) {
      setStatus("ok");
      onCorrect();
    } else {
      setStatus("no");
      onWrong();
    }
  };

  const next = () => {
    setTarget(randInt(1011, 9999));
    setInput({ T: "", H: "", Z: "", E: "" });
    setStatus(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-rose-200">
        <div className="text-sm uppercase tracking-wide text-rose-700 font-semibold">Zerlege die Zahl</div>
        <div className="text-6xl font-bold text-rose-900 tabular-nums mt-1">{fmt(target)}</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-4 gap-2 text-center">
          {["T", "H", "Z", "E"].map((k) => (
            <div key={k}>
              <div className="text-sm font-bold text-slate-500">{k}</div>
              <input
                type="number"
                value={input[k]}
                onChange={(e) => {
                  setInput({ ...input, [k]: e.target.value });
                  if (status === "no") setStatus(null);
                }}
                className="w-full mt-1 text-3xl font-bold tabular-nums text-center border-2 border-rose-200 rounded-lg py-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-3 text-sm text-slate-500">T = Tausender · H = Hunderter · Z = Zehner · E = Einer</div>
      </div>

      {status === "ok" && (
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-2xl">🎉 Richtig!</div>
          <div className="text-sm text-emerald-900 mt-1">
            {fmt(target)} = {d.T} T + {d.H} H + {d.Z} Z + {d.E} E
          </div>
        </div>
      )}
      {status === "no" && (
        <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-4 text-center">
          <div className="text-xl">🤔 Schau Ziffer für Ziffer</div>
          <div className="text-sm text-rose-800 mt-1">Die erste Ziffer sind die Tausender, dann Hunderter, Zehner, Einer.</div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={check} className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 font-semibold text-white shadow">
          Prüfen
        </button>
        <button onClick={next} className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700">
          Nächste →
        </button>
      </div>
    </div>
  );
}

/* ---------- Übung 5: Zahl in der Mitte ---------- */

function generateMittelAufgabe() {
  const patterns = [
    // 3-4 digit, gap 100
    () => {
      const base = randInt(30, 98) * 100;
      return { low: base, high: base + 100 };
    },
    // 3-4 digit, gap 200
    () => {
      const base = randInt(20, 97) * 100;
      return { low: base, high: base + 200 };
    },
    // 4 digit, gap 1000
    () => {
      const base = randInt(2, 8) * 1000 + randInt(0, 9) * 100;
      return { low: base, high: base + 1000 };
    },
    // 4 digit, gap 2000
    () => {
      const base = randInt(2, 7) * 1000;
      return { low: base, high: base + 2000 };
    },
    // 5 digit, gap 1000
    () => {
      const t = randInt(10, 95) * 1000;
      return { low: t, high: t + 1000 };
    },
    // 5 digit, gap 200 (harder: same thousands)
    () => {
      const base = randInt(100, 997) * 100;
      return { low: base, high: base + 200 };
    },
  ];
  const { low, high } = patterns[randInt(0, patterns.length - 1)]();
  return { low, high, middle: (low + high) / 2 };
}

function MittelUebung({ onCorrect, onWrong }) {
  const [puzzle, setPuzzle] = useState(() => generateMittelAufgabe());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const gap = puzzle.high - puzzle.low;
  const halfGap = gap / 2;

  const check = () => {
    const n = parseInt((input || "").replace(/\./g, ""), 10);
    if (isNaN(n)) return;
    if (n === puzzle.middle) {
      setStatus("ok");
      onCorrect();
    } else {
      setStatus("no");
      onWrong();
    }
  };

  const next = () => {
    setPuzzle(generateMittelAufgabe());
    setInput("");
    setStatus(null);
    setShowHint(false);
  };

  const revealed = status === "ok";

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-indigo-200">
        <div className="text-sm uppercase tracking-wide text-indigo-700 font-semibold text-center">
          Welche Zahl liegt genau in der Mitte?
        </div>

        {/* Visueller Zahlenstrahl */}
        <div className="relative h-28 mt-6 mx-6">
          {/* Hauptlinie */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 rounded" />

          {/* Tick marks – 11 kleine Striche für visuelle Orientierung */}
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-0.5 h-3 bg-slate-400 -translate-y-1/2"
              style={{ left: `${i * 10}%` }}
            />
          ))}

          {/* Gap-Pfeile (nur wenn gelöst) */}
          {revealed && (
            <>
              <div className="absolute top-2 left-0 w-1/2 flex items-center justify-center">
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded px-2 py-0.5">
                  ← {fmt(halfGap)} →
                </div>
              </div>
              <div className="absolute top-2 right-0 w-1/2 flex items-center justify-center">
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded px-2 py-0.5">
                  ← {fmt(halfGap)} →
                </div>
              </div>
            </>
          )}

          {/* Linker Endpunkt */}
          <div className="absolute left-0 top-1/2 flex flex-col items-center -translate-y-1/2" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="w-5 h-5 bg-indigo-500 rounded-full border-2 border-white shadow" />
            <div className="mt-1 text-base font-bold text-indigo-900 tabular-nums whitespace-nowrap">
              {fmt(puzzle.low)}
            </div>
          </div>

          {/* Rechter Endpunkt */}
          <div className="absolute right-0 top-1/2 flex flex-col items-center" style={{ transform: "translate(50%, -50%)" }}>
            <div className="w-5 h-5 bg-indigo-500 rounded-full border-2 border-white shadow" />
            <div className="mt-1 text-base font-bold text-indigo-900 tabular-nums whitespace-nowrap">
              {fmt(puzzle.high)}
            </div>
          </div>

          {/* Mitte */}
          <div className="absolute left-1/2 top-1/2 flex flex-col items-center" style={{ transform: "translate(-50%, -50%)" }}>
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow ${
                revealed ? "bg-emerald-500" : "bg-rose-400 animate-pulse"
              }`}
            />
            <div
              className={`mt-1 text-base font-bold tabular-nums whitespace-nowrap ${
                revealed ? "text-emerald-900" : "text-rose-700"
              }`}
            >
              {revealed ? fmt(puzzle.middle) : "?"}
            </div>
          </div>
        </div>
      </div>

      {/* Eingabe */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <input
          type="number"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (status === "no") setStatus(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="deine Antwort"
          className="w-full text-4xl font-bold tabular-nums text-center border-2 border-indigo-200 rounded-lg py-3 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Tipp */}
      {showHint && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
          <div className="text-xs font-semibold text-amber-900 mb-2">So findest du die Mitte in 3 Schritten:</div>
          <ol className="text-sm text-amber-900 space-y-1.5 list-decimal list-inside">
            <li>
              <strong>Abstand</strong> zwischen den Zahlen:<br />
              <span className="ml-5 tabular-nums">{fmt(puzzle.high)} − {fmt(puzzle.low)} = <strong>{fmt(gap)}</strong></span>
            </li>
            <li>
              <strong>Hälfte</strong> vom Abstand:<br />
              <span className="ml-5 tabular-nums">{fmt(gap)} ÷ 2 = <strong>{fmt(halfGap)}</strong></span>
            </li>
            <li>
              Zur kleineren Zahl <strong>dazuzählen</strong>:<br />
              <span className="ml-5 tabular-nums">{fmt(puzzle.low)} + {fmt(halfGap)} = <strong>{fmt(puzzle.middle)}</strong></span>
            </li>
          </ol>
        </div>
      )}

      {status === "ok" && (
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-3 text-center">
          <div className="text-2xl">🎉 Richtig!</div>
          <div className="text-xs text-emerald-900 mt-1 tabular-nums">
            {fmt(puzzle.low)} + {fmt(halfGap)} = <strong>{fmt(puzzle.middle)}</strong>
          </div>
        </div>
      )}
      {status === "no" && (
        <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-3 text-center text-sm text-rose-800">
          Noch nicht ganz. Überlege zuerst: <em>wie groß ist der Abstand</em> zwischen den Zahlen?
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-3 py-3 rounded-xl bg-amber-200 hover:bg-amber-300 font-semibold text-amber-900 text-sm"
        >
          💡 {showHint ? "aus" : "Tipp"}
        </button>
        <button
          onClick={check}
          className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-white shadow"
        >
          Prüfen
        </button>
        <button
          onClick={next}
          className="px-3 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-sm"
        >
          Nächste →
        </button>
      </div>
    </div>
  );
}

/* ---------- Übung 6: Skizze / Sachaufgaben ---------- */

const PROBLEMS = [
  {
    titel: "Jette – Radtour zum See",
    text: "Jette macht mit ihrer Familie eine Radtour. Zuerst radeln sie 3 km zum Spielplatz. Von dort geht es 4 km weiter zur Eisdiele und dann zum See. Sie sind bis dahin insgesamt 15 km geradelt. Wie weit ist der See von der Eisdiele entfernt?",
    stationen: ["Start", "Spielplatz", "Eisdiele", "See"],
    strecken: [3, 4, null],
    gesamt: 15,
    hinUndZurueck: false,
    frage: "Wie weit ist der See von der Eisdiele entfernt?",
  },
  {
    titel: "Ali – Ausflug zum Grillplatz",
    text: "Ali und seine Familie machen einen Ausflug mit dem Rad. Zuerst radeln sie zum See, der 4,3 km entfernt ist. Von dort fahren sie weiter zum Grillplatz im Wäldchen. Nach dem Grillen besuchen sie noch die Eisdiele, die 2,8 km entfernt ist. Danach radeln sie denselben Weg wieder zurück. Insgesamt legen sie 16,6 km zurück. Wie weit ist der Grillplatz vom See entfernt?",
    stationen: ["Start", "See", "Grillplatz", "Eisdiele"],
    strecken: [4.3, null, 2.8],
    gesamt: 16.6,
    hinUndZurueck: true,
    frage: "Wie weit ist der Grillplatz vom See entfernt?",
  },
  {
    titel: "Tim, Lena & Olli – zum See",
    text: "Tim, Lena und Olli wollen zum See fahren. Tim wohnt 10,6 km vom See entfernt. Auf dem Weg zum See kommt er an Lena vorbei, die 2,8 km von ihm entfernt wohnt. Zusammen fahren sie weiter zu Olli. Von dort aus radeln sie gemeinsam die 5,2 km zum See. Wie weit wohnt Olli von Lena entfernt?",
    stationen: ["Tim", "Lena", "Olli", "See"],
    strecken: [2.8, null, 5.2],
    gesamt: 10.6,
    hinUndZurueck: false,
    frage: "Wie weit wohnt Olli von Lena entfernt?",
  },
];

function loesen(p) {
  const bekannt = p.strecken.filter((s) => s !== null).reduce((a, b) => a + b, 0);
  const mult = p.hinUndZurueck ? 2 : 1;
  return Math.round((p.gesamt / mult - bekannt) * 100) / 100;
}

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function SkizzeUebung({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const p = PROBLEMS[idx];
  const loesung = useMemo(() => loesen(p), [p]);

  const [phase, setPhase] = useState(1);
  const [shuffled, setShuffled] = useState(() => shuffle(p.stationen));
  const [placed, setPlaced] = useState([]);
  const [shake, setShake] = useState(false);
  const [distInputs, setDistInputs] = useState(() => p.strecken.map(() => ""));
  const [totalInput, setTotalInput] = useState("");
  const [phase2Status, setPhase2Status] = useState(null);
  const [antwort, setAntwort] = useState("");
  const [status, setStatus] = useState(null);

  const resetForProblem = (problem) => {
    setPhase(1);
    setShuffled(shuffle(problem.stationen));
    setPlaced([]);
    setShake(false);
    setDistInputs(problem.strecken.map(() => ""));
    setTotalInput("");
    setPhase2Status(null);
    setAntwort("");
    setStatus(null);
  };

  const pickProblem = (newIdx) => {
    setIdx(newIdx);
    resetForProblem(PROBLEMS[newIdx]);
  };

  const restart = () => resetForProblem(p);

  /* ---- Phase 1: Orte in Reihenfolge tippen ---- */
  const tapChip = (name) => {
    const expected = p.stationen[placed.length];
    if (name === expected) {
      const newPlaced = [...placed, name];
      setPlaced(newPlaced);
      setShuffled(shuffled.filter((s) => s !== name));
      if (newPlaced.length === p.stationen.length) {
        setTimeout(() => setPhase(2), 600);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  /* ---- Phase 2: Strecken eintragen ---- */
  const updateDistance = (i, v) => {
    const next = [...distInputs];
    next[i] = v;
    setDistInputs(next);
    setPhase2Status(null);
  };

  const checkPhase2 = () => {
    let ok = true;
    const errors = [];
    for (let i = 0; i < p.strecken.length; i++) {
      const expected = p.strecken[i];
      const given = (distInputs[i] || "").trim();
      if (expected === null) {
        if (given !== "") {
          ok = false;
          errors.push(i);
        }
      } else {
        const num = parseFloat(given.replace(",", "."));
        if (isNaN(num) || Math.abs(num - expected) > 0.05) {
          ok = false;
          errors.push(i);
        }
      }
    }
    const totNum = parseFloat((totalInput || "").replace(",", "."));
    const totalOk = !isNaN(totNum) && Math.abs(totNum - p.gesamt) < 0.05;
    if (!totalOk) ok = false;

    setPhase2Status(ok ? "ok" : "no");
    if (ok) setTimeout(() => setPhase(3), 700);
  };

  /* ---- Phase 3: Lösung ---- */
  const checkAnswer = () => {
    const n = parseFloat((antwort || "").replace(",", "."));
    if (isNaN(n)) return;
    if (Math.abs(n - loesung) < 0.05) {
      setStatus("ok");
      onCorrect();
    } else {
      setStatus("no");
      onWrong();
    }
  };

  const showSolution = () => {
    setAntwort(fmt(loesung));
    setStatus("show");
  };

  /* ---- Positionen ---- */
  const nSeg = p.stationen.length - 1;
  const positions = p.stationen.map((_, i) => 10 + (i / nSeg) * 80);

  /* Für Phase 3: proportional, wenn gelöst */
  const revealed = status === "ok" || status === "show";
  const finalDistances = p.strecken.map((s) => (s !== null ? s : revealed ? loesung : null));
  const allKnown = finalDistances.every((s) => s !== null);
  let finalPositions = positions;
  if (allKnown && phase === 3) {
    const total = finalDistances.reduce((a, b) => a + b, 0);
    let cum = 0;
    finalPositions = [10];
    for (const s of finalDistances) {
      cum += s;
      finalPositions.push(10 + (cum / total) * 80);
    }
  }

  const bekanntSumme = p.strecken.filter((s) => s !== null).reduce((a, b) => a + b, 0);
  const halbe = p.hinUndZurueck ? p.gesamt / 2 : p.gesamt;
  const bekannteStrings = p.strecken.filter((s) => s !== null).map(fmt).join(" + ");

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes mh-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        .mh-shake { animation: mh-shake 0.45s ease-in-out; }
      `}</style>

      {/* Aufgaben-Wähler */}
      <div className="grid grid-cols-3 gap-2">
        {PROBLEMS.map((prob, i) => (
          <button
            key={i}
            onClick={() => pickProblem(i)}
            className={`rounded-xl p-2 text-left border-2 transition text-xs ${
              idx === i
                ? "bg-emerald-500 border-emerald-600 text-white shadow"
                : "bg-white border-slate-200 hover:border-emerald-300 text-slate-700"
            }`}
          >
            <div className="font-bold">Aufgabe {i + 1}</div>
            <div className="opacity-90 mt-0.5 leading-tight">{prob.titel}</div>
          </button>
        ))}
      </div>

      {/* Aufgabentext */}
      <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-emerald-200">
        <div className="text-sm uppercase tracking-wide text-emerald-700 font-semibold">Sachaufgabe</div>
        <p className="mt-2 text-slate-800 leading-relaxed text-sm">{p.text}</p>
      </div>

      {/* Phasen-Indikator */}
      <div className="flex items-center justify-center gap-2 text-xs">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                phase === n
                  ? "bg-emerald-500 text-white shadow"
                  : phase > n
                  ? "bg-emerald-200 text-emerald-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {phase > n ? "✓" : n}
            </div>
            {n < 3 && <div className={`w-6 h-0.5 ${phase > n ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {/* =============== PHASE 1 =============== */}
      {phase === 1 && (
        <>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center text-sm text-sky-800 font-semibold">
            Schritt 1: Tippe die Orte in der richtigen Reihenfolge an.
          </div>

          {/* Zahlenstrahl mit leeren Plätzen */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="relative h-24">
              <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-slate-300 rounded" />
              {p.stationen.map((_, i) => {
                const isPlaced = i < placed.length;
                return (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${positions[i]}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        isPlaced
                          ? "bg-emerald-500 border-white shadow"
                          : "bg-white border-slate-300 border-dashed"
                      }`}
                    />
                    <div
                      className={`mt-1 text-xs font-semibold px-1.5 rounded whitespace-nowrap ${
                        isPlaced ? "text-slate-700 bg-white" : "text-slate-300"
                      }`}
                    >
                      {isPlaced ? placed[i] : "?"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gemischte Chips */}
          <div className={`flex flex-wrap gap-2 justify-center ${shake ? "mh-shake" : ""}`}>
            {shuffled.map((name) => (
              <button
                key={name}
                onClick={() => tapChip(name)}
                className="px-4 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 font-bold text-sky-800 shadow-sm transition"
              >
                {name}
              </button>
            ))}
          </div>

          {shake && (
            <div className="text-center text-sm text-rose-600">
              Hm, der Ort kommt erst später. Lies die Aufgabe nochmal!
            </div>
          )}
        </>
      )}

      {/* =============== PHASE 2 =============== */}
      {phase === 2 && (
        <>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center text-sm text-sky-800 font-semibold">
            Schritt 2: Trage die Strecken ein. Das gesuchte Stück lässt du leer!
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center text-xs italic text-amber-900">
            Gesucht: „{p.frage}"
          </div>

          {/* Line mit Stationen */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="relative h-16">
              <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-slate-300 rounded" />
              {p.stationen.map((name, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${positions[i]}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                >
                  <div className="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow" />
                  <div className="mt-1 text-xs font-semibold text-slate-700 bg-white px-1 rounded whitespace-nowrap">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strecken-Inputs */}
          <div className="bg-white rounded-2xl p-4 shadow-md space-y-2">
            {p.strecken.map((expected, i) => {
              const isUnknown = expected === null;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 text-sm text-slate-700">
                    <span className="font-semibold">{p.stationen[i]}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="font-semibold">{p.stationen[i + 1]}</span>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={distInputs[i]}
                    onChange={(e) => updateDistance(i, e.target.value)}
                    placeholder={isUnknown ? "leer!" : "?"}
                    className="w-20 text-center text-lg font-bold border-2 border-emerald-200 rounded-lg py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-sm text-slate-500 w-6">km</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <div className="flex-1 text-sm font-bold text-slate-700">
                {p.hinUndZurueck ? "Gesamt (hin + zurück)" : "Gesamtstrecke"}
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={totalInput}
                onChange={(e) => {
                  setTotalInput(e.target.value);
                  setPhase2Status(null);
                }}
                placeholder="?"
                className="w-20 text-center text-lg font-bold border-2 border-amber-300 rounded-lg py-1.5 focus:border-amber-500 focus:outline-none"
              />
              <span className="text-sm text-slate-500 w-6">km</span>
            </div>
          </div>

          {phase2Status === "no" && (
            <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-3 text-center text-sm text-rose-800">
              Noch nicht alles passt. Prüfe jede Strecke einzeln – und denk dran: <em>ein</em> Stück bleibt leer.
            </div>
          )}
          {phase2Status === "ok" && (
            <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-3 text-center text-sm text-emerald-800">
              Super! Deine Skizze ist komplett. ✨
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setPhase(1)}
              className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700"
            >
              ← Zurück
            </button>
            <button
              onClick={checkPhase2}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white shadow"
            >
              Skizze prüfen
            </button>
          </div>
        </>
      )}

      {/* =============== PHASE 3 =============== */}
      {phase === 3 && (
        <>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center text-sm text-sky-800 font-semibold">
            Schritt 3: Jetzt rechne das gesuchte Stück aus!
          </div>

          {/* Fertige Skizze */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="relative h-24">
              <div className="absolute top-1/2 left-[8%] right-[8%] h-1 bg-slate-300 rounded" />
              {p.strecken.map((s, i) => {
                const mid = (finalPositions[i] + finalPositions[i + 1]) / 2;
                const isUnknown = s === null;
                const shown = isUnknown ? (revealed ? `${fmt(loesung)} km` : "?") : `${fmt(s)} km`;
                return (
                  <div
                    key={"s" + i}
                    className={`absolute text-xs font-bold rounded px-2 py-0.5 border whitespace-nowrap ${
                      isUnknown
                        ? revealed
                          ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                          : "bg-rose-50 border-rose-300 text-rose-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                    style={{ left: `${mid}%`, top: "10%", transform: "translate(-50%, 0)" }}
                  >
                    {shown}
                  </div>
                );
              })}
              {p.stationen.map((name, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${finalPositions[i]}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                >
                  <div className="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow" />
                  <div className="mt-1 text-xs font-semibold text-slate-700 bg-white px-1 rounded whitespace-nowrap">
                    {name}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1 text-center text-sm text-slate-600">
              {p.hinUndZurueck ? (
                <>
                  Gesamt (hin + zurück): <strong>{fmt(p.gesamt)} km</strong>
                </>
              ) : (
                <>
                  Gesamt: <strong>{fmt(p.gesamt)} km</strong>
                </>
              )}
            </div>
          </div>

          {/* Antwort */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="text-sm font-semibold text-slate-700">{p.frage}</div>
            <div className="flex gap-2 mt-2 items-center">
              <input
                type="text"
                inputMode="decimal"
                value={antwort}
                onChange={(e) => {
                  setAntwort(e.target.value);
                  if (status === "no") setStatus(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="deine Antwort"
                className="flex-1 text-2xl font-bold text-center border-2 border-emerald-200 rounded-lg py-2 focus:border-emerald-500 focus:outline-none"
              />
              <div className="text-xl font-bold text-slate-500">km</div>
            </div>
          </div>

          {status === "ok" && (
            <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-3 text-center">
              <div className="text-xl">🎉 Richtig!</div>
              <div className="text-xs text-emerald-900 mt-1">
                {p.hinUndZurueck ? (
                  <>
                    {fmt(p.gesamt)} ÷ 2 = {fmt(halbe)}; {fmt(halbe)} − {bekannteStrings} = <strong>{fmt(loesung)} km</strong>
                  </>
                ) : (
                  <>
                    {fmt(p.gesamt)} − ({bekannteStrings}) = <strong>{fmt(loesung)} km</strong>
                  </>
                )}
              </div>
            </div>
          )}
          {status === "no" && (
            <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-3 text-center text-sm text-rose-800">
              Zähle die bekannten Strecken zusammen – wie viel fehlt bis zur Gesamtstrecke?
            </div>
          )}
          {status === "show" && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3">
              <div className="text-xs font-semibold text-amber-900 mb-1">Lösungsweg:</div>
              {p.hinUndZurueck ? (
                <ol className="text-xs text-amber-900 space-y-0.5 list-decimal list-inside">
                  <li>Hin- und Rückweg sind gleich lang.</li>
                  <li>Einfacher Weg: {fmt(p.gesamt)} ÷ 2 = <strong>{fmt(halbe)} km</strong></li>
                  <li>Bekannt: {bekannteStrings} = {fmt(bekanntSumme)} km</li>
                  <li>Gesucht: {fmt(halbe)} − {fmt(bekanntSumme)} = <strong>{fmt(loesung)} km</strong></li>
                </ol>
              ) : (
                <ol className="text-xs text-amber-900 space-y-0.5 list-decimal list-inside">
                  <li>Bekannt: {bekannteStrings} = {fmt(bekanntSumme)} km</li>
                  <li>Gesamt: {fmt(p.gesamt)} km</li>
                  <li>Gesucht: {fmt(p.gesamt)} − {fmt(bekanntSumme)} = <strong>{fmt(loesung)} km</strong></li>
                </ol>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={restart}
              className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700"
            >
              ↺ Neu
            </button>
            <button
              onClick={checkAnswer}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white shadow"
            >
              Prüfen
            </button>
            <button
              onClick={showSolution}
              className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 font-semibold text-amber-900 shadow"
            >
              Lösung
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Stufen-View (eine einzelne Stufe üben) ---------- */

function StufenView({ stufe, onBack, onCorrect, onWrong, richtig }) {
  const prozent = Math.min(100, Math.round((richtig / ZIEL_PRO_STUFE) * 100));

  const Uebung = () => {
    switch (stufe.type) {
      case "lesen":
        return <ZahlLesenUebung stufe={stufe} onCorrect={onCorrect} onWrong={onWrong} />;
      case "legen":
        return <ZahlLegenUebung stufe={stufe} onCorrect={onCorrect} onWrong={onWrong} />;
      case "buendeln":
        return <BuendelnUebung onCorrect={onCorrect} onWrong={onWrong} />;
      case "zerlegen":
        return <ZerlegenUebung onCorrect={onCorrect} onWrong={onWrong} />;
      case "mitte":
        return <MittelUebung onCorrect={onCorrect} onWrong={onWrong} />;
      case "skizze":
        return <SkizzeUebung onCorrect={onCorrect} onWrong={onWrong} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow hover:bg-slate-50 flex items-center justify-center text-lg">
          ←
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stufe.icon}</span>
            <div>
              <div className="font-bold text-slate-800">{stufe.titel}</div>
              <div className="text-xs text-slate-500">{stufe.sub}</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${prozent}%` }} />
          </div>
          <div className="text-xs text-slate-500 mt-1">{richtig} / {ZIEL_PRO_STUFE} richtig · {prozent}%</div>
        </div>
      </div>
      <Uebung />
    </div>
  );
}

/* ---------- Übersicht (Stufen-Liste) ---------- */

function Uebersicht({ progress, onStart, runden, treffer, faellig }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-md text-center">
        <div className="text-3xl">✨</div>
        <div className="text-3xl font-bold text-slate-800 mt-1">Mathe-Heldin</div>
        <div className="text-sm text-slate-500">Üben mit Bildern und Blöcken</div>
      </div>

      {/* Statistik-Karten wie im Screenshot */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-slate-800">{runden}</div>
          <div className="text-xs text-slate-500">Runden</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-emerald-600">{treffer}%</div>
          <div className="text-xs text-slate-500">Treffer</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-amber-600">{faellig}</div>
          <div className="text-xs text-slate-500">Fällig</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">Deine Stufen</div>
        <div className="space-y-2">
          {STUFEN.map((stufe) => {
            const richtig = progress[stufe.id]?.richtig || 0;
            const prozent = Math.min(100, Math.round((richtig / ZIEL_PRO_STUFE) * 100));
            return (
              <button
                key={stufe.id}
                onClick={() => onStart(stufe.id)}
                className="w-full text-left bg-white hover:bg-emerald-50 border-2 border-slate-100 hover:border-emerald-300 rounded-xl p-3 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center text-xl shrink-0">
                    {stufe.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-sm">{stufe.titel}</div>
                    <div className="text-xs text-slate-500 truncate">{stufe.sub}</div>
                  </div>
                  <div className="text-sm font-bold text-slate-600 tabular-nums">{prozent}%</div>
                </div>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${prozent}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pb-4">
        Alle Stufen sind offen – wähle, wo du üben möchtest.
      </div>
    </div>
  );
}

/* ---------- Haupt-App ---------- */

export default function App() {
  const [progress, setProgress] = useState({}); // { stufeId: { richtig, versuche } }
  const [aktiveStufe, setAktiveStufe] = useState(null);

  const gesamtRichtig = Object.values(progress).reduce((a, p) => a + (p.richtig || 0), 0);
  const gesamtVersuche = Object.values(progress).reduce((a, p) => a + (p.versuche || 0), 0);
  const treffer = gesamtVersuche > 0 ? Math.round((gesamtRichtig / gesamtVersuche) * 100) : 0;
  const faellig = STUFEN.filter((s) => (progress[s.id]?.richtig || 0) < ZIEL_PRO_STUFE).length;
  const runden = Object.keys(progress).length;

  const handleCorrect = () => {
    if (!aktiveStufe) return;
    setProgress((p) => {
      const prev = p[aktiveStufe] || { richtig: 0, versuche: 0 };
      return { ...p, [aktiveStufe]: { richtig: prev.richtig + 1, versuche: prev.versuche + 1 } };
    });
  };

  const handleWrong = () => {
    if (!aktiveStufe) return;
    setProgress((p) => {
      const prev = p[aktiveStufe] || { richtig: 0, versuche: 0 };
      return { ...p, [aktiveStufe]: { richtig: prev.richtig, versuche: prev.versuche + 1 } };
    });
  };

  const stufe = aktiveStufe ? STUFEN.find((s) => s.id === aktiveStufe) : null;
  const aktivProgress = aktiveStufe ? progress[aktiveStufe]?.richtig || 0 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 p-4">
      <div className="max-w-2xl mx-auto">
        {stufe ? (
          <StufenView
            stufe={stufe}
            onBack={() => setAktiveStufe(null)}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            richtig={aktivProgress}
          />
        ) : (
          <Uebersicht
            progress={progress}
            onStart={setAktiveStufe}
            runden={runden}
            treffer={treffer}
            faellig={faellig}
          />
        )}
      </div>
    </div>
  );
}
