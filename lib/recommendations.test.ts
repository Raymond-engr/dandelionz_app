import { describe, expect, it } from "vitest";
import { shopRecommendationSurface } from "./recommendations";

describe("shopRecommendationSurface", () => {
  it("personalises for a signed-in shopper", () => {
    expect(shopRecommendationSurface(true)).toEqual({
      type: "for-you",
      title: "Recommended for you",
    });
  });

  it("falls back to trending when signed out", () => {
    expect(shopRecommendationSurface(false)).toEqual({
      type: "trending",
      title: "Trending now",
    });
  });

  it("never promises personalisation it cannot deliver", () => {
    // The signed-out heading must not say "for you" — the guard that made us
    // split the two surfaces in the first place.
    expect(shopRecommendationSurface(false).title).not.toMatch(/for you/i);
  });
});
