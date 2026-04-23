import { ChevronRight } from "lucide-react";
import { CURRENCY_MAP } from "@/lib/currencies";

const POPULAR_TARGETS = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];

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

export default function PopularPairings({
  base,
  onSelect,
}: {
  base: string;
  onSelect: (target: string) => void;
}) {
  const baseMeta = CURRENCY_MAP[base];
  const targets = POPULAR_TARGETS;

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
        Popular {baseMeta?.name} ({base}) pairings
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {targets.map((t) => {
          const tMeta = CURRENCY_MAP[t];
          if (!tMeta || !baseMeta) return null;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                padding: "16px 18px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(30,27,75,0.04)",
                transition: "transform .15s, box-shadow .15s, border-color .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,27,75,0.10)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(30,27,75,0.04)";
                e.currentTarget.style.borderColor = "var(--border-soft)";
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {base} to {t}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FlagBadge country={baseMeta.country} code={base} />
                  <span style={{ color: "var(--text-muted)", fontSize: 14 }}>→</span>
                  <FlagBadge country={tMeta.country} code={t} />
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
