import { useEffect, useState } from "react";
import { CURRENCY_MAP } from "@/lib/currencies";
import { fetchAllRates, fetchWeeklyChange } from "@/lib/api";

const TARGETS = ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "ZAR"];

type Row = {
  code: string;
  rate: number | null;
  weekDiff: number | null;
  weekPct: number | null;
};

function FlagBadge({ country, code }: { country: string; code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${country}.png`}
      alt={code}
      width={28}
      height={20}
      style={{
        borderRadius: 4,
        objectFit: "cover",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
  );
}

function formatRate(n: number) {
  if (n >= 100) return n.toFixed(3);
  if (n >= 1) return n.toFixed(5);
  return n.toFixed(6);
}

export default function LiveCurrencyCharts({ base }: { base: string }) {
  const [rows, setRows] = useState<Row[]>(() =>
    TARGETS.map((c) => ({ code: c, rate: null, weekDiff: null, weekPct: null })),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await fetchAllRates(base).catch(() => ({} as Record<string, number>));
      const initial: Row[] = TARGETS.map((c) => {
        const r = all[c.toLowerCase()];
        return {
          code: c,
          rate: typeof r === "number" ? r : null,
          weekDiff: null,
          weekPct: null,
        };
      });
      if (!cancelled) setRows(initial);

      const updates = await Promise.all(
        TARGETS.map((c) => fetchWeeklyChange(base, c).then((w) => ({ c, w }))),
      );
      if (cancelled) return;
      setRows((prev) =>
        prev.map((row) => {
          const u = updates.find((x) => x.c === row.code);
          if (!u || !u.w) return row;
          const diff = u.w.current - u.w.weekAgo;
          const pct = (diff / u.w.weekAgo) * 100;
          return { ...row, weekDiff: diff, weekPct: pct };
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  const baseMeta = CURRENCY_MAP[base];

  return (
    <div style={{ maxWidth: 1100, margin: "80px auto 0", padding: "0 24px" }}>
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 28,
          color: "var(--text-dark)",
        }}
      >
        More live {base} currency charts
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {rows.map((row) => {
          const meta = CURRENCY_MAP[row.code];
          if (!meta) return null;
          const up = row.weekDiff !== null && row.weekDiff >= 0;
          const color = up ? "#16a34a" : "#dc2626";
          return (
            <div
              key={row.code}
              style={{
                background: "#fff",
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 2px 6px rgba(30,27,75,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <FlagBadge country={meta.country} code={row.code} />
                <div style={{ fontWeight: 700, color: "var(--text-dark)" }}>{meta.name}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                1 {base} {baseMeta ? "equals to" : "="}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-dark)" }}>
                {row.rate !== null ? `${formatRate(row.rate)} ${row.code}` : "—"}
              </div>
              <div style={{ fontSize: 12, marginTop: 8, color }}>
                {row.weekDiff !== null && row.weekPct !== null
                  ? `${up ? "+" : ""}${row.weekDiff.toFixed(4)} (${row.weekPct.toFixed(2)}%) Weekly`
                  : "\u00A0"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
