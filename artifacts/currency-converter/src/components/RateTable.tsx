import { CURRENCY_MAP, flagUrl, formatNumber } from "@/lib/currencies";

type Props = {
  from: string;
  to: string;
  rate: number;
};

const STEPS = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

export default function RateTable({ from, to, rate }: Props) {
  if (!rate || from === to) return null;
  const fromMeta = CURRENCY_MAP[from];
  const toMeta = CURRENCY_MAP[to];
  const inverse = 1 / rate;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <Side
        title={`Convert ${fromMeta?.name} to ${toMeta?.name}`}
        from={from}
        to={to}
        fromCountry={fromMeta?.country || ""}
        toCountry={toMeta?.country || ""}
        rate={rate}
      />
      <Side
        title={`Convert ${toMeta?.name} to ${fromMeta?.name}`}
        from={to}
        to={from}
        fromCountry={toMeta?.country || ""}
        toCountry={fromMeta?.country || ""}
        rate={inverse}
      />
    </div>
  );
}

function Side({
  title,
  from,
  to,
  fromCountry,
  toCountry,
  rate,
}: {
  title: string;
  from: string;
  to: string;
  fromCountry: string;
  toCountry: string;
  rate: number;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, marginTop: 0 }}>{title}</h3>
      <table className="xe-rate-table">
        <thead>
          <tr>
            <th>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img className="flag" src={flagUrl(fromCountry)} alt={from} /> {from}
              </div>
            </th>
            <th>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img className="flag" src={flagUrl(toCountry)} alt={to} /> {to}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((s) => (
            <tr key={s}>
              <td>
                <a href="#converter">{s.toLocaleString("en-US")} {from}</a>
              </td>
              <td>{formatNumber(s * rate)} {to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
