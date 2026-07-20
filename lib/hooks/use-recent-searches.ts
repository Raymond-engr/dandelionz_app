"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Exported so logout can clear it; history is per-browser, not per-account. */
export const RECENT_SEARCHES_KEY = "recentSearches";
const STORAGE_KEY = RECENT_SEARCHES_KEY;
export const MAX_RECENT = 8;

/**
 * Read a stored history blob, tolerating anything that isn't a string array.
 *
 * Exported for tests: the hook itself is thin glue around this and `addTerm`.
 */
export function parseStoredRecents(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** Newest first, case-insensitively deduped, capped at MAX_RECENT. */
export function addTerm(current: string[], term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return current;

  const withoutDuplicate = current.filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase(),
  );
  return [trimmed, ...withoutDuplicate].slice(0, MAX_RECENT);
}

// ---------------------------
// localStorage as an external store
// ---------------------------
// useSyncExternalStore is the supported way to read mutable browser state:
// it renders the server snapshot during SSR and swaps to the real value on
// hydration, without a setState-in-effect cascade.

const EMPTY: string[] = [];

// getSnapshot must return a stable reference or React re-renders forever, so
// cache the parsed value and only reparse when the raw string actually changes.
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 'storage' only fires for *other* tabs, which is exactly the case our own
  // writes don't cover.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private-browsing modes can throw on access; no history is fine.
    return EMPTY;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseStoredRecents(raw);
  }
  return cachedValue;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage being unavailable must not break searching.
  }
  emit();
}

/**
 * Recently submitted search terms, persisted in the browser.
 *
 * Deliberately local-only: search history is not worth a round trip, and
 * keeping it off the server avoids storing query history against an account.
 */
export function useRecentSearches() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addRecent = useCallback((term: string) => {
    write(addTerm(getSnapshot(), term));
  }, []);

  const removeRecent = useCallback((term: string) => {
    write(getSnapshot().filter((item) => item !== term));
  }, []);

  const clearRecent = useCallback(() => write([]), []);

  return { recent, addRecent, removeRecent, clearRecent };
}
