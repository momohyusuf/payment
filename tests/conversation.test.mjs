import test from "node:test";
import assert from "node:assert/strict";
import { createChatTurn, GUIDED_TOPICS } from "../src/lib/conversation.ts";
import { seedTransactions } from "../src/lib/data.ts";
import { balanceOf, inPeriod, money } from "../src/lib/finance.ts";

const ledger = seedTransactions();

test("guided topics return relevant ledger analysis and next questions", () => {
  for (const topic of GUIDED_TOPICS) {
    const turn = createChatTurn(topic.prompt, topic.id, ledger, 30);
    assert.equal(turn.topic, topic.id);
    assert.equal(turn.transactionCount, inPeriod(ledger, 30).length);
    assert.ok(turn.answer.text);
    assert.ok(turn.suggestions.length > 0);
  }
});

test("Explain that retains topic context and explains the cash-flow calculation", () => {
  const first = createChatTurn("How is my cash flow?", "first", ledger, 30);
  const followUp = createChatTurn("Explain that", "next", ledger, 30, first);
  assert.equal(followUp.topic, "cashflow");
  assert.ok(followUp.answer.text.includes("revenue of"));
  assert.ok(followUp.answer.text.includes("not a profit statement"));
  assert.notEqual(first.answer.text, followUp.answer.text);
});

test("payment-review follow-up offers steps and clarifies demo limits", () => {
  const first = createChatTurn("Show unusual payments", "first", ledger, 30);
  const review = createChatTurn(
    "How should I review this payment?",
    "next",
    ledger,
    30,
    first,
  );
  assert.equal(review.topic, "unusual");
  assert.ok(review.answer.text.includes("1. Match the payment"));
  assert.ok(review.answer.text.includes("cannot verify invoices"));
});

test("new answers reflect changed ledger and period; previous replies remain snapshots", () => {
  const earlier = createChatTurn("cash flow", "old", ledger, 30);
  const nextLedger = [
    {
      id: "transfer",
      timestamp: "2026-10-05T12:00:00+01:00",
      merchant: "Payment to London",
      category: "Transfers",
      direction: "outgoing",
      amountMinor: 25010000,
      currency: "NGN",
    },
    ...ledger,
  ];
  const latest = createChatTurn("cash flow", "new", nextLedger, 7, earlier);
  assert.equal(earlier.days, 30);
  assert.equal(latest.days, 7);
  assert.ok(earlier.answer.text.includes(money(balanceOf(ledger))));
  assert.ok(latest.answer.text.includes(money(balanceOf(nextLedger))));
  assert.equal(earlier.transactionCount, inPeriod(ledger, 30).length);
});

test("help guides the user, unsupported requests stay honest, and questions are bounded", () => {
  assert.ok(
    createChatTurn("help", "help", ledger, 30).answer.text.includes(
      "Choose a 7-, 30-, or 90-day",
    ),
  );
  assert.ok(
    createChatTurn(
      "weather tomorrow",
      "unsupported",
      ledger,
      30,
    ).answer.text.includes("do not connect to a live AI"),
  );
  assert.equal(
    createChatTurn("a".repeat(600), "bounded", ledger, 30).question.length,
    500,
  );
});
