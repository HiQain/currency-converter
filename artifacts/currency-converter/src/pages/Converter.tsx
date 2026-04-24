import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, MapPin } from "lucide-react";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import RateChart from "@/components/RateChart";
import RateTable from "@/components/RateTable";
import PopularPairings from "@/components/PopularPairings";
import LiveCurrencyCharts from "@/components/LiveCurrencyCharts";
import SiteFooter from "@/components/SiteFooter";
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
      <div className="xe-hero xe-hero--padded">
        <div className="xe-hero__inner">
          <div className="xe-hero__top">
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
            <div className="xe-hero__tagline">
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
              Exchange Rate and Currency Converter Tool
            </h1>
            <p style={{ marginTop: 14, color: "#e0e7ff", fontSize: 17, fontWeight: 400 }}>
              Check live foreign currency exchange rates
            </p>
          </div>
        </div>
      </div>

      {/* Converter card overlay */}
      <div className="xe-converter-wrap" id="converter">
        <div className="xe-card xe-card--converter">
          <div className="xe-converter-grid">
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

          <div style={{ marginTop: 22, textAlign: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "var(--text-dark)" }}>
              {formatAmount(numericAmount)} {from} = {converted !== null ? formatAmount(converted) : "—"} {to}
            </div>
          </div>
        </div>
      </div>

      {/* Rate table */}
      <div className="xe-section">
        <h2 className="xe-section__title">
          {from} to {to} exchange rates today
        </h2>
        {rate !== null && <RateTable from={from} to={to} rate={rate} />}
      </div>

      {/* Chart */}
      <div className="xe-section">
        <div className="xe-card xe-card--chart">
          <RateChart from={from} to={to} />
        </div>
      </div>

      {/* Popular pairings */}
      <PopularPairings base={from} onSelect={(target) => setTo(target)} />

      {/* More live currency charts */}
      <LiveCurrencyCharts base={from} />

      <SiteFooter />
    </div>
  );
}
