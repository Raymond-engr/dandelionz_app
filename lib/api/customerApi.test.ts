import { describe, it, expect } from 'vitest';
import { hasCompletePayoutDetails } from './customerApi';

const complete = {
  bank_name: 'Access Bank',
  bank_code: '044',
  account_number: '0123456789',
  account_name: 'Jane Doe',
  recipient_code: 'RCP_123',
  has_pin: true,
};

describe('hasCompletePayoutDetails', () => {
  it('returns true when every payout field is present', () => {
    expect(hasCompletePayoutDetails(complete)).toBe(true);
  });

  it('returns false when settings are undefined', () => {
    expect(hasCompletePayoutDetails(undefined)).toBe(false);
  });

  it('returns false when settings are null', () => {
    expect(hasCompletePayoutDetails(null)).toBe(false);
  });

  it('returns false for an empty object', () => {
    expect(hasCompletePayoutDetails({})).toBe(false);
  });

  it('returns false when ONLY bank_code is missing', () => {
    // bank_code matters: without it the backend cannot create a Paystack
    // transfer recipient, so the withdraw form must stay gated.
    expect(hasCompletePayoutDetails({ ...complete, bank_code: '' })).toBe(false);
  });

  it('returns false when bank_name is missing', () => {
    expect(hasCompletePayoutDetails({ ...complete, bank_name: '' })).toBe(false);
  });

  it('returns false when account_number is missing', () => {
    expect(hasCompletePayoutDetails({ ...complete, account_number: '' })).toBe(false);
  });

  it('returns false when account_name is missing', () => {
    expect(hasCompletePayoutDetails({ ...complete, account_name: '' })).toBe(false);
  });

  it('treats whitespace-only values as missing', () => {
    expect(hasCompletePayoutDetails({ ...complete, account_name: '   ' })).toBe(false);
    expect(hasCompletePayoutDetails({ ...complete, bank_code: ' ' })).toBe(false);
  });

  it('ignores recipient_code and has_pin, which are not required to withdraw', () => {
    expect(
      hasCompletePayoutDetails({
        bank_name: 'GTBank',
        bank_code: '058',
        account_number: '9876543210',
        account_name: 'John Doe',
      })
    ).toBe(true);
  });

  it('does not mutate the input', () => {
    const input = { ...complete };
    hasCompletePayoutDetails(input);
    expect(input).toEqual(complete);
  });

  it('returns a boolean, never a truthy string', () => {
    expect(typeof hasCompletePayoutDetails(complete)).toBe('boolean');
    expect(typeof hasCompletePayoutDetails({})).toBe('boolean');
  });
});
