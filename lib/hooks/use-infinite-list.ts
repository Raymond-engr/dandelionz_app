import { useCallback, useEffect, useRef, useState } from "react";

type PageInfo<T> = {
  results: T[];
  next: string | null;
};

type QueryResult<TData> = {
  data?: TData;
  isLoading: boolean;
  isFetching: boolean;
  error?: unknown;
  refetch?: () => void;
};

// Most paginated endpoints in this app wrap DRF's paginated response in
// {success, data: {count, next, previous, results}}. AdminUserListView is
// the one exception - its paginated branch returns the DRF envelope
// directly with no outer wrapper (see lib/api/adminApi.ts getAllUsers).
// selectPage lets each call site describe its own shape instead of this
// hook assuming one.
export function selectStandardEnvelope<T>(
  data: { data?: { results: T[]; next: string | null } } | undefined,
): PageInfo<T> {
  return { results: data?.data?.results ?? [], next: data?.data?.next ?? null };
}

export function selectBareEnvelope<T>(
  data: { results: T[]; next: string | null } | undefined,
): PageInfo<T> {
  return { results: data?.results ?? [], next: data?.next ?? null };
}

// A third shape: AdminFinanceViewSet.list_refunds keeps its historical flat
// response ({success, data: T[], count, pending_count}) rather than the
// nested envelope, since pending_count sits alongside data rather than
// inside it. `next`/`previous` were added at this same top level.
export function selectFlatEnvelope<T>(
  data: { data?: T[]; next?: string | null } | undefined,
): PageInfo<T> {
  return { results: data?.data ?? [], next: data?.next ?? null };
}

/**
 * Drives infinite-scroll over any RTK Query endpoint that returns pages of
 * results and is configured with the serializeQueryArgs/merge pattern (see
 * getProducts, getAllUsers, getVendorOrdersList) so successive pages
 * accumulate into one growing cached list instead of being cached as
 * separate results.
 *
 * This is the web counterpart of the mobile app's identically-named hook -
 * same page-tracking/merge logic, but pair it with useInfiniteScrollTrigger
 * below (an IntersectionObserver sentinel) instead of FlatList's
 * onEndReached, since there's no FlatList on web.
 *
 * `filterArgs` should NOT include `page` - this hook owns paging. Pass an
 * object identity that only changes when the filters themselves change
 * (e.g. category, search, status) so the page resets to 1 automatically
 * when the user changes a filter rather than continuing to append to a
 * now-stale list.
 *
 * useQueryHook/filterArgs are intentionally loosely typed (not constrained
 * to an idealized function shape): RTK Query's generated hook type here
 * doesn't structurally match a plain (args, options?) => QueryResult
 * signature closely enough for TS to unify it through this generic, even
 * though the actual runtime shape is exactly that. `T` (the item type) is
 * still fully typed via selectPage's return type, which is what consumers
 * actually see.
 */
export function useInfiniteList<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQueryHook: (args: any, options?: { skip?: boolean }) => QueryResult<any>,
  filterArgs: Record<string, unknown>,
  selectPage: (data: any) => PageInfo<T>, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: { skip?: boolean },
) {
  const [page, setPage] = useState(1);
  const skip = options?.skip ?? false;

  const filterKey = JSON.stringify(filterArgs);
  const prevFilterKey = useRef(filterKey);
  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey;
      setPage(1);
    }
  }, [filterKey]);

  const result = useQueryHook({ ...filterArgs, page }, { skip });
  const { results: items, next } = selectPage(result.data);

  const hasMore = !!next;
  const isFetchingMore = result.isFetching && page > 1;
  const isInitialLoading = result.isLoading && page === 1;

  const loadMore = useCallback(() => {
    if (hasMore && !result.isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, result.isFetching]);

  const refresh = useCallback(async () => {
    setPage(1);
    await result.refetch?.();
  }, [result]);

  return {
    items,
    rawData: result.data,
    hasMore,
    isFetchingMore,
    isInitialLoading,
    loadMore,
    refresh,
    error: result.error,
  };
}

/**
 * Fires `onIntersect` (pass loadMore from useInfiniteList) when a sentinel
 * element scrolls into view. Attach the returned ref to an empty div placed
 * after the last rendered item - this is web's equivalent of FlatList's
 * onEndReached, since there's no FlatList/virtualized list primitive here.
 */
export function useInfiniteScrollTrigger(
  onIntersect: () => void,
  enabled: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
