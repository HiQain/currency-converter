// Free, no-key, comprehensive currency API (supports ~200 currencies incl. PKR, AED, etc.)
// Source: fawazahmed0/exchange-api via jsdelivr.

const PRIMARY = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";
const FALLBACK = "https://latest.currency-api.pages.dev";

async function fetchJson(date: string, base: string): Promise<any> {
  const path = `@${date}/v1/currencies/${base.toLowerCase()}.json`;
  try {
    const r = await fetch(`${PRIMARY}${path}`);
    if (r.ok) return await r.json();
    throw new Error("primary failed");
  } catch {
    const r = await fetch(`${FALLBACK}/v1/currencies/${base.toLowerCase()}.json`);
    if (!r.ok) throw new Error("fallback failed");
    return await r.json();
  }
}

export async function fetchLatestRate(base: string, target: string): Promise<number> {
  const j = await fetchJson("latest", base);
  const map = j[base.toLowerCase()];
  const rate = map?.[target.toLowerCase()];
  if (typeof rate !== "number") throw new Error("rate not found");
  return rate;
}

export async function fetchAllRates(base: string): Promise<Record<string, number>> {
  const j = await fetchJson("latest", base);
  return j[base.toLowerCase()] ?? {};
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function fetchWeeklyChange(
  base: string,
  target: string,
): Promise<{ current: number; weekAgo: number } | null> {
  try {
    const [now, week] = await Promise.all([
      fetchJson("latest", base),
      fetchJson(isoDaysAgo(7), base),
    ]);
    const cur = now[base.toLowerCase()]?.[target.toLowerCase()];
    const old = week[base.toLowerCase()]?.[target.toLowerCase()];
    if (typeof cur !== "number" || typeof old !== "number") return null;
    return { current: cur, weekAgo: old };
  } catch {
    return null;
  }
}

// Fetch ~12 historical points evenly spaced over the last year (one per ~month)
export async function fetchYearHistory(
  base: string,
  target: string,
): Promise<{ date: string; rate: number }[]> {
  const now = new Date();
  const dates: string[] = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(now.getMonth() - i);
    // clamp day to the 1st to avoid month-end issues
    d.setDate(1);
    dates.push(d.toISOString().slice(0, 10));
  }

  const results = await Promise.all(
    dates.map(async (date) => {
      try {
        const j = await fetchJson(date, base);
        const map = j[base.toLowerCase()];
        const rate = map?.[target.toLowerCase()];
        return typeof rate === "number" ? { date, rate } : null;
      } catch {
        return null;
      }
    }),
  );

  return results.filter((x): x is { date: string; rate: number } => x !== null);
}
