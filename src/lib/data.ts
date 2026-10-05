export type Currency = "NGN" | "GBP" | "GHS" | "KES";
export type Transaction = {
  id: string;
  timestamp: string;
  merchant: string;
  category: string;
  direction: "incoming" | "outgoing";
  amountMinor: number;
  currency: "NGN";
  route?: string;
};
export type Route = {
  id: string;
  city: string;
  country: string;
  currency: Currency;
  rate: number;
  arrival: string;
  x: number;
  y: number;
  flag: string;
};
export const DEMO_DATE = "2026-10-05";
export const OPENING_BALANCE = 485_000_000;
export const TRANSFER_FEE = 10_000;
export const ROUTES: Route[] = [
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    rate: 2000,
    arrival: "~30 seconds",
    x: 444,
    y: 112,
    flag: "GB",
  },
  {
    id: "accra",
    city: "Accra",
    country: "Ghana",
    currency: "GHS",
    rate: 150,
    arrival: "~15 seconds",
    x: 362,
    y: 326,
    flag: "GH",
  },
  {
    id: "abuja",
    city: "Abuja",
    country: "Nigeria",
    currency: "NGN",
    rate: 1,
    arrival: "Instant",
    x: 440,
    y: 294,
    flag: "NG",
  },
  {
    id: "nairobi",
    city: "Nairobi",
    country: "Kenya",
    currency: "KES",
    rate: 12,
    arrival: "~20 seconds",
    x: 608,
    y: 379,
    flag: "KE",
  },
];
export const LAGOS = { x: 406, y: 316 };
const merchants = [
  ["MainOne connectivity", "Operations", 18_200_000],
  ["Team payroll", "Payroll", 96_000_000],
  ["Meta campaign", "Marketing", 6_400_000],
  ["GIG Logistics", "Logistics", 8_500_000],
  ["Notion workspace", "Software", 3_200_000],
  ["Google Workspace", "Software", 2_400_000],
] as const;
const clients = [
  "Paystack settlement",
  "Kora Studio · invoice",
  "Adebayo & Co.",
  "Flutterwave settlement",
];
export function seedTransactions(): Transaction[] {
  const ledger: Transaction[] = [];
  for (let day = 0; day < 90; day++) {
    const date = new Date(Date.UTC(2026, 6, 8 + day, 9, 30));
    if (day % 7 === 0 || day === 89)
      ledger.push({
        id: `income-${day}`,
        timestamp: date.toISOString(),
        merchant: clients[Math.floor(day / 7) % clients.length],
        category: "Revenue",
        direction: "incoming",
        amountMinor: 125_000_000 + (day % 5) * 8_200_000,
        currency: "NGN",
      });
    if (day % 3 === 0 || day === 88) {
      const [merchant, category, amount] =
        merchants[Math.floor(day / 3) % merchants.length];
      ledger.push({
        id: `expense-${day}`,
        timestamp: new Date(date.getTime() + 3_600_000).toISOString(),
        merchant,
        category,
        direction: "outgoing",
        amountMinor: amount + (day % 3) * 100_000,
        currency: "NGN",
      });
    }
  }
  ledger.push({
    id: "campaign-review",
    timestamp: "2026-10-02T14:20:00+01:00",
    merchant: "Meta campaign · launch",
    category: "Marketing",
    direction: "outgoing",
    amountMinor: 85_000_000,
    currency: "NGN",
  });
  return ledger.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}
