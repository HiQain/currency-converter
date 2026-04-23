export type CurrencyMeta = { code: string; name: string; symbol: string; country: string };

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", name: "US Dollar", symbol: "$", country: "us" },
  { code: "EUR", name: "Euro", symbol: "€", country: "eu" },
  { code: "GBP", name: "British Pound", symbol: "£", country: "gb" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", country: "jp" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", country: "au" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", country: "ca" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", country: "ch" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", country: "cn" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", country: "hk" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", country: "nz" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", country: "se" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", country: "kr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", country: "sg" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", country: "no" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", country: "mx" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", country: "in" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", country: "ru" },
  { code: "ZAR", name: "South African Rand", symbol: "R", country: "za" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", country: "tr" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", country: "br" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", country: "tw" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", country: "dk" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", country: "pl" },
  { code: "THB", name: "Thai Baht", symbol: "฿", country: "th" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", country: "id" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", country: "hu" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", country: "cz" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", country: "il" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", country: "ph" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", country: "my" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", country: "ro" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", country: "bg" },
  { code: "ISK", name: "Icelandic Krona", symbol: "kr", country: "is" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", country: "pk" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "ae" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", country: "sa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", country: "eg" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", country: "bd" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", country: "vn" },
];

export const CURRENCY_MAP: Record<string, CurrencyMeta> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);

// Country code → currency code (for geolocation lookup)
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", JP: "JPY", AU: "AUD", CA: "CAD", CH: "CHF", CN: "CNY",
  HK: "HKD", NZ: "NZD", SE: "SEK", KR: "KRW", SG: "SGD", NO: "NOK", MX: "MXN",
  IN: "INR", RU: "RUB", ZA: "ZAR", TR: "TRY", BR: "BRL", TW: "TWD", DK: "DKK",
  PL: "PLN", TH: "THB", ID: "IDR", HU: "HUF", CZ: "CZK", IL: "ILS", PH: "PHP",
  MY: "MYR", RO: "RON", BG: "BGN", IS: "ISK", PK: "PKR", AE: "AED", SA: "SAR",
  EG: "EGP", BD: "BDT", VN: "VND",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR",
  PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR", LU: "EUR", SK: "EUR", SI: "EUR",
  EE: "EUR", LV: "EUR", LT: "EUR", MT: "EUR", CY: "EUR", HR: "EUR",
};

export function flagUrl(country: string): string {
  return `https://flagcdn.com/w40/${country.toLowerCase()}.png`;
}

export function formatNumber(n: number, max = 6): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  let digits: number;
  if (abs >= 1000) digits = 2;
  else if (abs >= 1) digits = 4;
  else digits = max;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatAmount(n: number): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}
