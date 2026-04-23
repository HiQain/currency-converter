import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { fetchYearHistory } from "@/lib/api";

type Props = { from: string; to: string };
type Point = { date: string; rate: number };

export default function RateChart({ from, to }: Props) {
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (from === to) {
      setData([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErr(null);

    fetchYearHistory(from, to)
      .then((points) => {
        if (cancelled) return;
        if (points.length === 0) {
          setErr("Chart data not available for this pair.");
          setData([]);
        } else {
          setData(points);
        }
      })
      .catch(() => !cancelled && setErr("Failed to load chart."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const first = data[0]?.rate;
  const last = data[data.length - 1]?.rate;
  const change = first && last ? ((last - first) / first) * 100 : 0;
  const changeColor = change >= 0 ? "#16a34a" : "#dc2626";

  if (from === to) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        Select two different currencies to see the chart.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          {from} to {to} – 1-Year Trend
        </h3>
        {!loading && data.length > 0 && (
          <div style={{ color: changeColor, fontWeight: 700, fontSize: 16 }}>
            {change >= 0 ? "▲ +" : "▼ "}
            {change.toFixed(2)}% <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13 }}>(1Y)</span>
          </div>
        )}
      </div>
      <div style={{ width: "100%", height: 320 }}>
        {loading && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Loading chart...
          </div>
        )}
        {err && (
          <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{err}</div>
        )}
        {!loading && !err && data.length > 0 && (
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickFormatter={(d) => {
                  const dt = new Date(d);
                  return dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
                }}
                minTickGap={30}
                stroke="#cbd5e1"
              />
              <YAxis
                domain={["dataMin", "dataMax"]}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickFormatter={(v) => Number(v).toFixed(4)}
                stroke="#cbd5e1"
                width={70}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }}
                formatter={(v: number) => [`${Number(v).toFixed(6)} ${to}`, `1 ${from}`]}
                labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#14b8a6"
                strokeWidth={2.5}
                fill="url(#rateGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
