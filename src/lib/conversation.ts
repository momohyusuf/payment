import type { Transaction } from "./data.ts";
import { answerQuestion, inPeriod, totalsOf, money } from "./finance.ts";
import type { Insight } from "./finance.ts";

export type ChatTopic =
  "cashflow" | "spending" | "unusual" | "opportunities" | "help";

export type ChatTurn = {
  id: string;
  question: string;
  answer: Insight;
  topic: ChatTopic;
  days: number;
  transactionCount: number;
  suggestions: string[];
};

export const GUIDED_TOPICS = [
  {
    id: "cashflow",
    label: "Understand cash flow",
    prompt: "How is my cash flow?",
    description: "See what came in, what went out, and what is left.",
  },
  {
    id: "spending",
    label: "Explore my spending",
    prompt: "What is my biggest expense?",
    description: "Find your largest costs and spending patterns.",
  },
  {
    id: "unusual",
    label: "Review unusual payments",
    prompt: "Show unusual payments",
    description: "Spot payments that stand out from typical activity.",
  },
  {
    id: "opportunities",
    label: "Plan my next move",
    prompt: "Where can I save?",
    description: "Look for practical opportunities in your activity.",
  },
] as const;

const followUps: Record<ChatTopic, string[]> = {
  cashflow: [
    "Explain that",
    "What is my biggest expense?",
    "Where can I save?",
  ],
  spending: ["Explain that", "Show unusual payments", "How is my cash flow?"],
  unusual: [
    "How should I review this payment?",
    "What is my biggest expense?",
    "How is my cash flow?",
  ],
  opportunities: [
    "Explain that",
    "Explore my spending",
    "How is my cash flow?",
  ],
  help: ["How is my cash flow?", "Show unusual payments", "Where can I save?"],
};

function detectTopic(question: string): ChatTopic {
  if (/unusual|suspicious|anomal|flag|review|fraud/.test(question))
    return "unusual";
  if (/opportun|sav|improv|next|suggest/.test(question)) return "opportunities";
  if (/largest|biggest|expens|spend|pattern|categor/.test(question))
    return "spending";
  if (/cash|revenue|trend|income|balance|flow|health|summary/.test(question))
    return "cashflow";
  return "help";
}

function explainTopic(
  topic: ChatTopic,
  ledger: Transaction[],
  days: number,
): Insight {
  const totals = totalsOf(inPeriod(ledger, days));
  if (topic === "cashflow")
    return {
      title: "Here is how to read your cash flow",
      text: `For these ${days} days, revenue of ${money(totals.revenue)} minus spending of ${money(totals.spending)} gives net cash flow of ${money(totals.net)}. Your available balance also includes the opening balance and activity outside this period. Transfers and their fees count as outgoing funds; this is a cash movement summary, not a profit statement.`,
      tone: "neutral",
    };
  if (topic === "spending")
    return {
      ...answerQuestion("largest expense", ledger, days),
      title: "Put your largest costs in context",
      text: `${answerQuestion("largest expense", ledger, days).text} Compare each large cost with its invoice and purpose. Recurring payroll may be expected; a one-off campaign may need a closer look. Try “Show unusual payments” to compare expenses with their category peers.`,
    };
  if (topic === "opportunities")
    return {
      title: "Turn the insight into a simple next step",
      text: `${answerQuestion("opportunities", ledger, days).text} Start by listing upcoming payroll, supplier invoices, and renewals. Then check whether each recurring software seat is still used. This demo cannot forecast obligations that are not in the ledger.`,
      tone: "positive",
    };
  if (topic === "unusual")
    return {
      title: "A guided payment review",
      text: "1. Match the payment to an approved invoice and its recipient.\n2. Check the amount, date, and business purpose with the person who authorized it.\n3. Compare it with earlier payments in the same category. NOVA flags amounts above 2.5× the median of at least two other category payments.\n4. Ask for clarification before deciding whether the difference is expected. An outlier is not proof of fraud; this demo cannot verify invoices or contact recipients.",
      tone: "neutral",
    };
  return answerQuestion("help", ledger, days);
}

export function createChatTurn(
  question: string,
  id: string,
  ledger: Transaction[],
  days: number,
  previous?: ChatTurn,
): ChatTurn {
  const text = question.trim().slice(0, 500);
  const normalized = text.toLowerCase();
  const isFollowUp =
    /^(explain( that)?|tell me more|why|what does that mean)[?.!]*$/.test(
      normalized,
    );
  const isReviewGuide =
    /how (should|do|can) i review|review checklist|review steps/.test(
      normalized,
    );
  const topic =
    isFollowUp && previous ? previous.topic : detectTopic(normalized);
  let answer =
    isReviewGuide || (isFollowUp && previous)
      ? explainTopic(isReviewGuide ? "unusual" : topic, ledger, days)
      : answerQuestion(text, ledger, days);
  if (
    /^(help|how do i use (this|nova)|how does this work)[?.!]*$/.test(
      normalized,
    )
  ) {
    answer = {
      title: "A good conversation starts with a question",
      text: "1. Choose a 7-, 30-, or 90-day reporting period.\n2. Pick a guided topic or type a question about cash flow, spending, unusual payments, or opportunities.\n3. Follow the suggested questions, or ask “Explain that” for more context. Answers use the current demo ledger when you ask; earlier messages are snapshots. I cannot send money, verify invoices, or access external accounts.",
      tone: "neutral",
    };
  }
  return {
    id,
    question: text,
    answer,
    topic,
    days,
    transactionCount: inPeriod(ledger, days).length,
    suggestions: followUps[topic],
  };
}
