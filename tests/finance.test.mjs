import test from 'node:test';
import assert from 'node:assert/strict';
import { seedTransactions, OPENING_BALANCE, TRANSFER_FEE } from '../src/lib/data.ts';
import { parseAmount, recipientAmount, validateTransfer, balanceOf, inPeriod, totalsOf, dailyActivity, suspiciousExpenses, answerQuestion, money } from '../src/lib/finance.ts';
const ledger = seedTransactions();
test('amount parsing preserves exact minor units and rejects invalid/unsafe inputs', () => {
  assert.equal(parseAmount('250000.25'), 25000025);
  assert.equal(parseAmount('0.01'), 1);
  assert.equal(parseAmount(' 100.1 '), 10010);
  for (const value of ['', '0', '-1', '1.001', '1e5', 'abc', '9007199254740999', '1,000']) assert.equal(parseAmount(value), null, value);
});
test('transfer validation includes fee and handles exact available funds', () => {
  assert.equal(validateTransfer('100', 20000).error, '');
  assert.ok(validateTransfer('100.01', 20000).error);
  assert.ok(validateTransfer('0', 20000).error);
  assert.equal(recipientAmount(25000000, 2000), 12500);
  assert.equal(recipientAmount(100, 2000), 0);
});
test('balance and period summaries reconcile with the full ledger', () => {
  const totals = totalsOf(ledger);
  assert.equal(balanceOf(ledger), OPENING_BALANCE + totals.net);
  assert.deepEqual(inPeriod(ledger, 90), ledger);
  assert.ok(inPeriod(ledger, 7).length < inPeriod(ledger, 30).length);
  for (const days of [7, 30, 90]) {
    const activity = dailyActivity(ledger, days);
    const expected = totalsOf(inPeriod(ledger, days));
    assert.equal(activity.reduce((sum, day) => sum + day.revenue, 0), expected.revenue);
    assert.equal(activity.reduce((sum, day) => sum + day.spending, 0), expected.spending);
  }
});
test('a transfer and fee immediately update balance, totals, and AI context', () => {
  const amount = 25000000;
  const next = [{ id: 'new', timestamp: '2026-10-05T12:00:00+01:00', merchant: 'Payment to London', category: 'Transfers', direction: 'outgoing', amountMinor: amount, currency: 'NGN' }, { id: 'fee', timestamp: '2026-10-05T12:00:00+01:00', merchant: 'Fee', category: 'Fees', direction: 'outgoing', amountMinor: TRANSFER_FEE, currency: 'NGN' }, ...ledger];
  assert.equal(balanceOf(next), balanceOf(ledger) - amount - TRANSFER_FEE);
  assert.equal(totalsOf(inPeriod(next, 30)).spending, totalsOf(inPeriod(ledger, 30)).spending + amount + TRANSFER_FEE);
  assert.ok(answerQuestion('cash flow', next, 30).text.includes(money(balanceOf(next))));
});
test('AI flags the seeded category outlier, explains limitations, and handles unsupported questions', () => {
  assert.deepEqual(suspiciousExpenses(ledger).map((t) => t.id), ['campaign-review']);
  assert.ok(answerQuestion('unusual payments', ledger, 30).text.includes('Meta campaign'));
  assert.ok(answerQuestion('largest expense', ledger, 30).text.includes('%'));
  assert.ok(answerQuestion('opportunities', ledger, 30).text.includes('Software'));
  assert.ok(answerQuestion('weather tomorrow', ledger, 30).text.includes('do not connect'));
});
