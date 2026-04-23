import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, MapPin } from "lucide-react";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import RateChart from "@/components/RateChart";
import RateTable from "@/components/RateTable";
import {
  COUNTRY_TO_CURRENCY,
  CURRENCY_MAP,
  formatAmount,
} from "@/lib/currencies";
import { getCookie, setCookie } from "@/lib/cookies";
import { fetchLatestRate } from "@/lib/api";

const COOKIE_FROM = "cc_from";
const COOKIE_TO = "cc_to";
const COOKIE_AMOUNT = "cc_amount";

export default function Converter() {
  const [from, setFrom] = useState<string>(() => getCookie(COOKIE_FROM) || "USD");
  const [to, setTo] = useState<string>(() => getCookie(COOKIE_TO) || "EUR");
  const [amount, setAmount] = useState<string>(() => getCookie(COOKIE_AMOUNT) || "100");
  const [rate, setRate] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [locDetected, setLocDetected] = useState<string | null>(null);
  const initRef = useRef(false);

  // Auto-detect location → set "To" currency based on user's country (every page load)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const tryProviders = async () => {
      const providers = [
        async () => {
          const r = await fetch("https://ipapi.co/json/");
          const j = await r.json();
          return { code: j?.country_code as string | undefined, name: j?.country_name as string | undefined };
        },
        async () => {
          const r = await fetch("https://ipwho.is/");
          const j = await r.json();
          return { code: j?.country_code as string | undefined, name: j?.country as string | undefined };
        },
        async () => {
          const r = await fetch("https://get.geojs.io/v1/ip/country.json");
          const j = await r.json();
          return { code: j?.country as string | undefined, name: j?.name as string | undefined };
        },
      ];
      for (const p of providers) {
        try {
          const { code, name } = await p();
          const cur = code ? COUNTRY_TO_CURRENCY[code.toUpperCase()] : null;
          if (cur) {
            setLocDetected(`${name || code} → ${cur}`);
            setTo(cur);
            // If detected location equals From, pick a different From for sensible default
            if (cur === from) setFrom(cur === "USD" ? "EUR" : "USD");
            return;
          }
        } catch {
          // try next provider
        }
      }
    };
    tryProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selections
  useEffect(() => { setCookie(COOKIE_FROM, from); }, [from]);
  useEffect(() => { setCookie(COOKIE_TO, to); }, [to]);
  useEffect(() => { setCookie(COOKIE_AMOUNT, amount); }, [amount]);

  // Fetch rate when pair changes
  useEffect(() => {
    if (from === to) {
      setRate(1);
      const d = new Date();
      setUpdatedAt(
        `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`,
      );
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchLatestRate(from, to)
      .then((r) => {
        if (cancelled) return;
        setRate(r);
        const d = new Date();
        setUpdatedAt(
          `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`,
        );
      })
      .catch(() => !cancelled && setRate(null))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [from, to]);

  const numericAmount = useMemo(() => {
    const n = parseFloat(amount.replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const converted = rate !== null ? numericAmount * rate : null;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromMeta = CURRENCY_MAP[from];
  const toMeta = CURRENCY_MAP[to];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div className="xe-hero" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", color: "#fff", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <div className="brand-mark">
              <span className="brand-mark__badge">
                <img
                  src="/favicon.png"
                  alt="Company logo"
                  className="brand-mark__logo"
                  width={48}
                  height={48}
                />
              </span>
              <span className="brand-mark__text">Currency Converter</span>
            </div>
            <div style={{ color: "#e0e7ff", fontSize: 13, opacity: 0.85 }}>
              Live FX rates · 200+ currencies
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {locDetected && (
              <div className="location-banner">
                <MapPin size={14} /> Your location detected: {locDetected}
              </div>
            )}
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {formatAmount(numericAmount)} {from} = {converted !== null ? formatAmount(converted) : "—"} {to}
            </h1>
            <p style={{ marginTop: 14, color: "#e0e7ff", fontSize: 17, fontWeight: 400 }}>
              Convert {fromMeta?.name} to {toMeta?.name} — fresh mid-market rates
            </p>
          </div>
        </div>
      </div>

      {/* Converter card overlay */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", marginTop: -70, position: "relative", zIndex: 5 }} id="converter">
        <div className="xe-card" style={{ padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "stretch" }}>
            <div className="xe-input-block">
              <label>From</label>
              <div className="row">
                <input
                  className="xe-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d.,]/g, "");
                    setAmount(v);
                  }}
                />
                <CurrencyDropdown value={from} onChange={setFrom} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button className="xe-swap" onClick={swap} aria-label="Swap currencies" type="button">
                <ArrowLeftRight size={18} />
              </button>
            </div>

            <div className="xe-input-block">
              <label>To</label>
              <div className="row">
                <input
                  className="xe-amount readonly"
                  readOnly
                  value={converted !== null ? formatAmount(converted) : "—"}
                />
                <CurrencyDropdown value={to} onChange={setTo} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-dark)" }}>
              1.00 {from} = {rate !== null ? rate.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") : "—"} {to}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              {loading ? "Updating…" : `Mid-market rate at ${updatedAt}`}
            </div>
          </div>
        </div>
      </div>

      {/* Rate table */}
      <div style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 30 }}>
          {from} to {to} exchange rates today
        </h2>
        {rate !== null && <RateTable from={from} to={to} rate={rate} />}
      </div>

      {/* Chart */}
      <div style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 24px" }}>
        <div className="xe-card" style={{ padding: 28 }}>
          <RateChart from={from} to={to} />
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}
