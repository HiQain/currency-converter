import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES, CURRENCY_MAP, flagUrl } from "@/lib/currencies";

type Props = {
  value: string;
  onChange: (code: string) => void;
};

export default function CurrencyDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const meta = CURRENCY_MAP[value];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="xe-cur-btn" onClick={() => setOpen((o) => !o)} type="button">
        {meta && <img className="flag" src={flagUrl(meta.country)} alt={meta.code} />}
        <span>{value}</span>
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
          – {meta?.name}
        </span>
        <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ right: 0 }}>
          <div className="dropdown-search">
            <input
              autoFocus
              placeholder="Search currency..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="dropdown-list">
            {filtered.map((c) => (
              <div
                key={c.code}
                className="dropdown-item"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <img className="flag" src={flagUrl(c.country)} alt={c.code} />
                <span className="code">{c.code}</span>
                <span className="name">{c.name}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 14, color: "var(--text-muted)", fontSize: 14 }}>
                No matches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
