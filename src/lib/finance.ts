import { OPENING_BALANCE, TRANSFER_FEE } from "./data.ts";
import type { Currency, Transaction } from "./data.ts";
export function money(
  amount: number,
  currency: Currency = "NGN",
  decimals = 0,
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount / 100);
}
export function parseAmount(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}
export function recipientAmount(amount: number, rate: number) {
  return Math.round(amount / rate);
}
export function validateTransfer(value: string, balance: number) {
  const amount = parseAmount(value);
  if (amount === null)
    return {
      amount,
      error: "Enter a positive amount with up to two decimal places.",
    };
  if (amount > balance - TRANSFER_FEE)
    return {
      amount,
      error:
        "Your amount plus the ₦100 demo fee exceeds your available balance.",
    };
  return { amount, error: "" };
}
export function balanceOf(ledger: Transaction[]) {
  return ledger.reduce(
    (sum, t) =>
      sum + (t.direction === "incoming" ? t.amountMinor : -t.amountMinor),
    OPENING_BALANCE,
  );
}
export function inPeriod(ledger: Transaction[], days: number) {
  const end = new Date("2026-10-06T00:00:00+01:00").getTime();
  return ledger.filter((t) => {
    const time = new Date(t.timestamp).getTime();
    return time >= end - days * 86_400_000 && time < end;
  });
}
export function totalsOf(ledger: Transaction[]) {
  const revenue = ledger
    .filter((t) => t.direction === "incoming")
    .reduce((sum, t) => sum + t.amountMinor, 0);
  const spending = ledger
    .filter((t) => t.direction === "outgoing")
    .reduce((sum, t) => sum + t.amountMinor, 0);
  return { revenue, spending, net: revenue - spending };
}
export function dailyActivity(ledger: Transaction[], days: number) {
  const end = new Date("2026-10-05T00:00:00+01:00").getTime();
  return Array.from({ length: days }, (_, i) => {
    const start = end - (days - 1 - i) * 86_400_000;
    return {
      date: new Date(start),
      ...totalsOf(
        ledger.filter((t) => {
          const time = new Date(t.timestamp).getTime();
          return time >= start && time < start + 86_400_000;
        }),
      ),
    };
  });
}
export function suspiciousExpenses(ledger: Transaction[]) {
  const expenses = ledger.filter(
    (t) => t.direction === "outgoing" && t.category !== "Fees",
  );
  return expenses.filter((item) => {
    const peers = expenses
      .filter((t) => t.category === item.category && t.id !== item.id)
      .map((t) => t.amountMinor)
      .sort((a, b) => a - b);
    if (peers.length < 2) return false;
    const mid = Math.floor(peers.length / 2);
    const median =
      peers.length % 2 ? peers[mid] : (peers[mid - 1] + peers[mid]) / 2;
    return item.amountMinor > median * 2.5;
  });
}
export type Insight = {
  title: string;
  text: string;
  tone: "positive" | "attention" | "neutral";
};
export function answerQuestion(
  question: string,
  ledger: Transaction[],
  days: number,
): Insight {
  const scoped = inPeriod(ledger, days),
    totals = totalsOf(scoped),
    q = question.toLowerCase(),
    period = `the last ${days} days of this demo`;
  if (/unusual|suspicious|anomal|flag|review|fraud/.test(q)) {
    const flagged = suspiciousExpenses(ledger)
      .filter((t) => scoped.some((s) => s.id === t.id))
      .sort((a, b) => b.amountMinor - a.amountMinor);
    if (!flagged.length)
      return {
        title: "No outliers in this period",
        text: `No expenses exceeded 2.5× the median of other payments in their category during ${period}. This needs at least two peer payments and is not a fraud determination.`,
        tone: "positive",
      };
    const item = flagged[0];
    return {
      title: "A payment deserves a second look",
      text: `${item.merchant} was ${money(item.amountMinor)}. That exceeds 2.5× the median of other ${item.category.toLowerCase()} payments in the full ledger. Check the invoice before treating it as routine. An outlier does not establish fraud.`,
      tone: "attention",
    };
  }
  if (/largest|biggest|expens|spend|pattern|categor/.test(q)) {
    const expenses = scoped.filter((t) => t.direction === "outgoing");
    if (!expenses.length)
      return {
        title: "No spending to analyze yet",
        text: `There are no outgoing transactions in ${period}. Try a wider period.`,
        tone: "neutral",
      };
    const categories = new Map<string, number>();
    expenses.forEach((t) =>
      categories.set(
        t.category,
        (categories.get(t.category) ?? 0) + t.amountMinor,
      ),
    );
    const [category, amount] = [...categories.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0],
      largest = [...expenses].sort((a, b) => b.amountMinor - a.amountMinor)[0];
    return {
      title: `${category} leads your spending`,
      text: `${category} accounts for ${money(amount)}, or ${Math.round((amount / totals.spending) * 100)}% of outgoing funds in ${period}. Your largest individual expense is ${largest.merchant} at ${money(largest.amountMinor)}.`,
      tone: "neutral",
    };
  }
  if (/opportun|sav|improv|next|suggest/.test(q)) {
    const software = scoped
      .filter((t) => t.direction === "outgoing" && t.category === "Software")
      .reduce((sum, t) => sum + t.amountMinor, 0);
    return {
      title: "Make your next move intentional",
      text: `Your available demo balance is ${money(balanceOf(ledger))}. ${software ? `Software costs total ${money(software)} in ${period}; review unused seats before renewing.` : "Widen the reporting period to review recurring software costs."} Compare upcoming obligations before allocating any surplus.`,
      tone: "positive",
    };
  }
  if (/cash|revenue|trend|income|balance|flow|health|summary/.test(q))
    return {
      title:
        totals.net >= 0
          ? "Your cash flow is moving forward"
          : "Spending is ahead of revenue",
      text: `In ${period}, ${money(totals.revenue)} came in and ${money(totals.spending)} went out. Net cash flow is ${money(totals.net)}. Your available balance is ${money(balanceOf(ledger))}. ${totals.net >= 0 ? "Keep upcoming payroll in mind before committing the surplus." : "Review large outgoing payments and upcoming receivables."}`,
      tone: totals.net >= 0 ? "positive" : "attention",
    };
  return {
    title: "Let’s look at your financial activity",
    text: "I can analyze this demo ledger for cash flow, spending patterns, unusual payments, and opportunities. Try “How is my cash flow?” or “Show unusual payments.” I do not connect to a live AI model or external accounts.",
    tone: "neutral",
  };
}
