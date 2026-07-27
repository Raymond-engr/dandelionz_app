import type { RecommendationType } from "./api/publicApi";

/**
 * How many products a recommendation row asks for.
 *
 * Eight fills the widest grid (3 columns) without a ragged trailing row, and
 * matches the limit the mobile app sends so both clients cache-hit the same
 * backend slice.
 */
export const RECOMMENDATION_LIMIT = 8;

export type RecommendationSurface = {
  type: RecommendationType;
  title: string;
};

/**
 * Which recommendation row the shop page shows, and what to call it.
 *
 * A signed-out visitor has no interaction history to personalise from, so
 * asking for `for-you` would just return the trending list under a heading
 * that promises something we can't deliver. Ask for what we'll actually get.
 *
 * These titles are duplicated in the mobile app by agreement — change both.
 */
export function shopRecommendationSurface(
  isAuthenticated: boolean,
): RecommendationSurface {
  return isAuthenticated
    ? { type: "for-you", title: "Recommended for you" }
    : { type: "trending", title: "Trending now" };
}
