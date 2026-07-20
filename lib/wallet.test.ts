import { describe, it, expect } from 'vitest';
import {
  MIN_WITHDRAWAL,
  isWithdrawFormValid,
  MIN_DEPOSIT,
  MAX_DEPOSIT,
  isDepositAmountValid,
  isRefundAmountValid,
  planCheckoutSplit,
} from './wallet';

describe('MIN_WITHDRAWAL', () => {
  it('matches the mobile app so the same account sees the same minimum in both', () => {
    // This page used to hardcode 100 while mobile used 500 and the server enforced
    // neither, so a customer could withdraw 100 on web and be refused on mobile.
    expect(MIN_WITHDRAWAL).toBe(500);
  });
});

describe('isWithdrawFormValid', () => {
  const valid = { amount: 1000, pin: '1234', balance: 5000 };

  it('accepts a complete form within balance', () => {
    expect(isWithdrawFormValid(valid)).toBe(true);
  });

  it('rejects an amount below the minimum', () => {
    expect(isWithdrawFormValid({ ...valid, amount: 499 })).toBe(false);
  });

  it('accepts an amount exactly at the minimum', () => {
    expect(isWithdrawFormValid({ ...valid, amount: 500 })).toBe(true);
  });

  it('rejects an amount above the available balance', () => {
    expect(isWithdrawFormValid({ ...valid, amount: 5001 })).toBe(false);
  });

  it('accepts an amount exactly equal to the balance', () => {
    expect(isWithdrawFormValid({ ...valid, amount: 5000 })).toBe(true);
  });

  it('rejects a PIN that is not four digits', () => {
    expect(isWithdrawFormValid({ ...valid, pin: '123' })).toBe(false);
    expect(isWithdrawFormValid({ ...valid, pin: '12345' })).toBe(false);
  });

  it('rejects NaN rather than treating it as a valid amount', () => {
    expect(isWithdrawFormValid({ ...valid, amount: NaN })).toBe(false);
  });

  it('rejects a negative amount', () => {
    expect(isWithdrawFormValid({ ...valid, amount: -1000 })).toBe(false);
  });

  it('rejects any withdrawal when the balance is zero', () => {
    expect(isWithdrawFormValid({ ...valid, balance: 0 })).toBe(false);
  });

  it('honours a server-supplied minimum above the local default', () => {
    expect(
      isWithdrawFormValid({ ...valid, amount: 600, minimum: 1000 }),
    ).toBe(false);
  });

  it('honours a server-supplied minimum below the local default', () => {
    expect(
      isWithdrawFormValid({ ...valid, amount: 200, minimum: 100 }),
    ).toBe(true);
  });
});

describe('deposit bounds', () => {
  it('matches the bounds the server enforces on the deposit endpoint', () => {
    expect(MIN_DEPOSIT).toBe(100);
    expect(MAX_DEPOSIT).toBe(500000);
  });
});

describe('isDepositAmountValid', () => {
  it('rejects an amount below the minimum', () => {
    expect(isDepositAmountValid(99)).toBe(false);
  });

  it('accepts an amount exactly at the minimum', () => {
    expect(isDepositAmountValid(100)).toBe(true);
  });

  it('accepts a normal amount between the bounds', () => {
    expect(isDepositAmountValid(5000)).toBe(true);
  });

  it('accepts an amount exactly at the maximum', () => {
    expect(isDepositAmountValid(500000)).toBe(true);
  });

  it('rejects an amount above the maximum', () => {
    expect(isDepositAmountValid(500001)).toBe(false);
  });

  it('rejects NaN rather than treating an unparseable input as valid', () => {
    // The deposit form parses a text input, so NaN is the shape an empty or
    // junk field arrives in.
    expect(isDepositAmountValid(NaN)).toBe(false);
  });

  it('rejects Infinity', () => {
    expect(isDepositAmountValid(Infinity)).toBe(false);
    expect(isDepositAmountValid(-Infinity)).toBe(false);
  });

  it('rejects a negative amount', () => {
    expect(isDepositAmountValid(-500)).toBe(false);
  });

  it('rejects zero', () => {
    expect(isDepositAmountValid(0)).toBe(false);
  });

  it('honours caller-supplied bounds over the defaults', () => {
    expect(isDepositAmountValid(50, { min: 10 })).toBe(true);
    expect(isDepositAmountValid(5000, { max: 1000 })).toBe(false);
  });
});

describe('isRefundAmountValid', () => {
  it('accepts an amount within the refundable total', () => {
    expect(isRefundAmountValid(500, { refundable: 2000 }).valid).toBe(true);
  });

  it('accepts refunding the whole refundable balance', () => {
    expect(isRefundAmountValid(2000, { refundable: 2000 }).valid).toBe(true);
  });

  it('rejects more than can be sent back to source', () => {
    const check = isRefundAmountValid(2500, { refundable: 2000 });
    expect(check.valid).toBe(false);
    expect(check.reason).toContain('2,000');
  });

  it('caps on the refundable amount, not the spendable balance', () => {
    // A top-up with no recorded Paystack transaction id counts towards the balance but
    // cannot go back to a card, so the two numbers legitimately differ. Gating on the
    // balance would let the user submit a refund the server is bound to reject.
    expect(isRefundAmountValid(5000, { refundable: 1200 }).valid).toBe(false);
  });

  it('rejects zero and negative amounts', () => {
    expect(isRefundAmountValid(0, { refundable: 2000 }).valid).toBe(false);
    expect(isRefundAmountValid(-100, { refundable: 2000 }).valid).toBe(false);
  });

  it('explains an empty or unparsed input rather than showing a bounds error', () => {
    const check = isRefundAmountValid(NaN, { refundable: 2000 });
    expect(check.valid).toBe(false);
    expect(check.reason).toBe('Enter an amount.');
  });

  it('says there is nothing to refund when no deposits remain', () => {
    const check = isRefundAmountValid(100, { refundable: 0 });
    expect(check.valid).toBe(false);
    expect(check.reason).toContain('no deposited funds');
  });

  it('agrees with the mobile implementation on every boundary', () => {
    // The two clients ship the same rules; drift between them is what the shared-minimum
    // bug was, so the boundaries are pinned identically in both suites.
    expect(isRefundAmountValid(1, { refundable: 1 }).valid).toBe(true);
    expect(isRefundAmountValid(1.01, { refundable: 1 }).valid).toBe(false);
  });
});

describe('planCheckoutSplit', () => {
  it('puts the whole order on the card when the wallet is empty', () => {
    expect(planCheckoutSplit(5000, 0)).toEqual({ wallet: 0, card: 5000 });
  });

  it('covers the whole order when the wallet is large enough', () => {
    expect(planCheckoutSplit(1000, 5000)).toEqual({ wallet: 1000, card: 0 });
  });

  it('splits when the wallet covers only part', () => {
    expect(planCheckoutSplit(5000, 2000)).toEqual({ wallet: 2000, card: 3000 });
  });

  it('never returns a negative card leg', () => {
    expect(planCheckoutSplit(100, 999999).card).toBe(0);
  });

  it('always sums back to the order total', () => {
    for (const [total, balance] of [[5000, 2000], [1000, 5000], [750.5, 250.25]]) {
      const { wallet, card } = planCheckoutSplit(total, balance);
      expect(wallet + card).toBeCloseTo(total, 2);
    }
  });

  it('treats a zero or negative total as nothing to pay', () => {
    expect(planCheckoutSplit(0, 5000)).toEqual({ wallet: 0, card: 0 });
    expect(planCheckoutSplit(-100, 5000)).toEqual({ wallet: 0, card: 0 });
  });

  it('agrees with the mobile implementation and the server on the boundaries', () => {
    // Same cases asserted in PlanSplitTests on the backend and in the mobile suite.
    expect(planCheckoutSplit(1000, 5000)).toEqual({ wallet: 1000, card: 0 });
    expect(planCheckoutSplit(5000, 2000)).toEqual({ wallet: 2000, card: 3000 });
    expect(planCheckoutSplit(5000, 0)).toEqual({ wallet: 0, card: 5000 });
  });
});
