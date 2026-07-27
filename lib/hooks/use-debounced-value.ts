"use client";

import { useEffect, useState } from "react";

/**
 * Delay propagating a rapidly-changing value.
 *
 * The shop page previously passed raw input straight into a query, so typing
 * "sneakers" fired eight requests and rendered whichever resolved last.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
