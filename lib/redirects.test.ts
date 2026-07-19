import { describe, it, expect } from 'vitest';
import {
  DEFAULT_REDIRECT,
  isSafeRedirectTarget,
  safeRedirectTarget,
} from './redirects';

describe('isSafeRedirectTarget', () => {
  it('accepts a plain same-origin path', () => {
    expect(isSafeRedirectTarget('/account/wallet')).toBe(true);
  });

  it('accepts a path that carries its own query string', () => {
    // The case this whole fix exists for: a Paystack return whose reference must survive
    // an expired session.
    expect(
      isSafeRedirectTarget('/account/wallet/deposit/callback?reference=DEP-ABC123'),
    ).toBe(true);
  });

  it('rejects an absolute URL to another origin', () => {
    expect(isSafeRedirectTarget('https://evil.com')).toBe(false);
  });

  it('rejects a protocol-relative URL that would escape the origin', () => {
    // "//evil.com" starts with a slash but browsers treat it as absolute.
    expect(isSafeRedirectTarget('//evil.com')).toBe(false);
  });

  it('rejects a backslash-prefixed path that some browsers normalise to protocol-relative', () => {
    expect(isSafeRedirectTarget('/\\evil.com')).toBe(false);
  });

  it('rejects a backslash anywhere in the path', () => {
    expect(isSafeRedirectTarget('/account\\..\\evil')).toBe(false);
  });

  it('rejects a value containing whitespace', () => {
    expect(isSafeRedirectTarget('/account /wallet')).toBe(false);
    expect(isSafeRedirectTarget('/account\n/wallet')).toBe(false);
  });

  it('rejects a scheme-relative javascript URL', () => {
    expect(isSafeRedirectTarget('javascript:alert(1)')).toBe(false);
  });

  it('rejects empty, null and undefined', () => {
    expect(isSafeRedirectTarget('')).toBe(false);
    expect(isSafeRedirectTarget(null)).toBe(false);
    expect(isSafeRedirectTarget(undefined)).toBe(false);
  });
});

describe('safeRedirectTarget', () => {
  it('returns the target when it is safe', () => {
    expect(safeRedirectTarget('/orders/42')).toBe('/orders/42');
  });

  it('falls back to the default when the target is unsafe', () => {
    expect(safeRedirectTarget('https://evil.com')).toBe(DEFAULT_REDIRECT);
  });

  it('falls back to the default when the target is missing', () => {
    expect(safeRedirectTarget(null)).toBe(DEFAULT_REDIRECT);
  });

  it('honours a caller-supplied fallback', () => {
    expect(safeRedirectTarget(null, '/admin')).toBe('/admin');
  });
});
