/**
 * Validation for post-login redirect targets.
 *
 * The `redirect` query param is attacker-controllable, and the login page navigates to it
 * verbatim after a successful sign-in. Without a guard, `/login?redirect=https://evil.com`
 * sends a freshly-authenticated user off-site — a classic open redirect, made more
 * attractive by the fact that it happens right after they typed their password.
 *
 * Only same-origin, path-absolute targets are allowed.
 */

/** Where to send a user when the requested redirect is missing or unsafe. */
export const DEFAULT_REDIRECT = '/';

export function isSafeRedirectTarget(value: string | null | undefined): boolean {
  if (!value) return false;

  // Must be a path on this site, not an absolute URL.
  if (!value.startsWith('/')) return false;

  // "//evil.com" is a protocol-relative URL: browsers treat it as absolute, so it escapes
  // the origin despite starting with a slash.
  if (value.startsWith('//')) return false;

  // Some browsers normalise backslashes to forward slashes, so "/\evil.com" can become
  // "//evil.com" after parsing and slip past the check above.
  if (value.includes('\\')) return false;

  // Whitespace (including tabs and newlines) can be used to smuggle a value past naive
  // checks; a legitimate path never contains raw whitespace.
  if (/\s/.test(value)) return false;

  return true;
}

/**
 * Return `value` when it is a safe same-origin path, otherwise a safe default.
 *
 * Callers can pass the app's role-based landing page as `fallback` so that an absent or
 * rejected redirect still lands somewhere sensible.
 */
export function safeRedirectTarget(
  value: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  return isSafeRedirectTarget(value) ? (value as string) : fallback;
}
