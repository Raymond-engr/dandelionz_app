'use client';

import AppLayout from '@/components/AppLayout';
import FilterModal from '@/components/FilterModal';
import ProductGrid from '@/components/ProductGrid';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import RecommendationSection from '@/components/RecommendationSection';
import SearchBar from '@/components/SearchBar';
import { CATEGORIES_FOR_NAV } from '@/lib/categories';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { useRecentSearches } from '@/lib/hooks/use-recent-searches';
import { RECOMMENDATION_LIMIT } from '@/lib/recommendations';
import {
  Product,
  useGetProductsQuery,
  useGetRecommendationsQuery,
  useGetSearchSuggestionsQuery,
} from '@/lib/api/publicApi';
import { useInfiniteList, useInfiniteScrollTrigger, selectStandardEnvelope } from '@/lib/hooks/use-infinite-list';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';

// Below this the suggestions endpoint returns nothing anyway, so don't ask.
const MIN_SUGGESTION_LENGTH = 2;

interface FilterState {
  min_price?: number;
  max_price?: number;
  price?: number;
  ordering?: string;
  category?: string;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  // `query` tracks the input; `submitted` tracks what we're actually showing
  // results for. Keeping them separate is what lets suggestions appear while
  // typing without the results grid thrashing underneath.
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const { recent, addRecent, removeRecent, clearRecent } = useRecentSearches();

  const debouncedQuery = useDebouncedValue(query, 300);
  const showSuggestions = query !== submitted;

  const { data: suggestionData } = useGetSearchSuggestionsQuery(debouncedQuery, {
    skip:
      !showSuggestions || debouncedQuery.trim().length < MIN_SUGGESTION_LENGTH,
  });

  const {
    items: products,
    isInitialLoading: isFetching,
    isFetchingMore,
    hasMore,
    loadMore,
  } = useInfiniteList(
    useGetProductsQuery,
    { search: submitted, ...filters },
    selectStandardEnvelope<Product>,
    { skip: !submitted },
  );
  const sentinelRef = useInfiniteScrollTrigger(loadMore, hasMore && !isFetchingMore);

  // A zero-result search is a dead end, so offer trending as a way onward.
  // Only asked for once a search has actually settled on nothing: skipping
  // while `isFetching` keeps this off the wire for the common hit case, and
  // `products` still holds the previous term's results mid-refetch.
  const noResults = Boolean(submitted) && !isFetching && products.length === 0;
  const { data: trendingData } = useGetRecommendationsQuery(
    { type: 'trending', limit: RECOMMENDATION_LIMIT },
    { skip: !noResults },
  );

  // debouncedQuery lags query by 300ms, so suggestionData can still describe the
  // previous term. Treat it as absent until it catches up, otherwise the panel
  // briefly lists results for what the user typed before.
  const suggestionsReady = debouncedQuery.trim() === query.trim();
  const suggestions = suggestionsReady ? suggestionData?.data : undefined;

  const runSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setQuery(trimmed);
      setSubmitted(trimmed);
      addRecent(trimmed);
      // Keep the URL shareable and the back button meaningful.
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [addRecent, router],
  );

  const renderSuggestions = () => {
    // No panel at all beats an empty one flashing while the debounce settles.
    if (!suggestions) {
      return (
        <p className="py-10 text-center text-sm text-gray-400">Searching…</p>
      );
    }

    const hasAny =
      (suggestions.categories?.length ?? 0) + (suggestions.products?.length ?? 0) > 0;

    if (!hasAny) {
      return (
        <p className="py-10 text-center text-sm text-gray-500">
          No suggestions. Press Enter to search for &ldquo;{query.trim()}&rdquo;.
        </p>
      );
    }

    return (
    <div className="divide-y divide-gray-100">
      {suggestions?.categories?.map((category) => (
        <button
          key={`category-${category.slug}`}
          onClick={() => router.push(`/category/${category.slug}`)}
          className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-gray-50"
        >
          <span className="text-sm text-gray-900">{category.name}</span>
          <span className="text-xs text-gray-400">in Categories</span>
        </button>
      ))}

      {suggestions?.products?.map((product) => (
        <button
          key={`product-${product.slug}`}
          onClick={() => router.push(`/product/${product.slug}`)}
          className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-gray-50"
        >
          <span className="truncate text-sm text-gray-900">{product.name}</span>
        </button>
      ))}
    </div>
    );
  };

  const renderRecent = () => {
    if (recent.length === 0) {
      return (
        <p className="py-10 text-center text-sm text-gray-500">
          Search for products by name, brand or category.
        </p>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent searches
          </h2>
          <button
            onClick={clearRecent}
            className="text-xs text-system-blue-light hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recent.map((term) => (
            <div key={term} className="flex items-center gap-3 py-3">
              <button
                onClick={() => runSearch(term)}
                className="flex-1 truncate text-left text-sm text-gray-900"
              >
                {term}
              </button>
              <button
                onClick={() => removeRecent(term)}
                aria-label={`Remove ${term} from recent searches`}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (isFetching) {
      return <ProductGridSkeleton />;
    }

    if (products.length === 0) {
      return (
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">
              No results for &ldquo;{submitted}&rdquo;
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try a different spelling or a more general term.
            </p>
          </div>

          <RecommendationSection
            title="Trending now"
            products={trendingData?.data}
            className="mt-10"
          />
        </div>
      );
    }

    return (
      <div>
        <p className="py-3 text-xs text-gray-500">
          {products.length} {products.length === 1 ? 'result' : 'results'} for
          &ldquo;{submitted}&rdquo;
        </p>
        <ProductGrid products={products} />
        <div ref={sentinelRef} className="h-1" />
        {isFetchingMore && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  };

  const renderBody = () => {
    if (showSuggestions) {
      return query.trim().length >= MIN_SUGGESTION_LENGTH
        ? renderSuggestions()
        : renderRecent();
    }
    return submitted ? renderResults() : renderRecent();
  };

  return (
    <AppLayout>
      <div className="px-4 pb-24 pt-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => runSearch(query)}
          autoFocus={!initialQuery}
          showFilter={Boolean(submitted)}
          onFilterClick={() => setShowFilter(true)}
        />

        {renderBody()}

        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={setFilters}
          categories={CATEGORIES_FOR_NAV.map((cat) => ({
            id: cat.id,
            name: cat.name,
            image: cat.image,
          }))}
          initialFilters={{
            minPrice: filters.min_price ?? 0,
            maxPrice: filters.max_price ?? 500,
            price: filters.price ?? 0,
            sortBy: filters.ordering ?? '',
            category: filters.category ?? '',
          }}
        />
      </div>
    </AppLayout>
  );
}

export default function SearchPage() {
  // useSearchParams needs a Suspense boundary to avoid opting the whole route
  // into client-side rendering at build time.
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}