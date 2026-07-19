import { describe, it, expect } from 'vitest';
import {
  MIN_WITHDRAWAL,
  isWithdrawFormValid,
  MIN_DEPOSIT,
  MAX_DEPOSIT,
  isDepositAmountValid,
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
