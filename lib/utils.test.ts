import { describe, it, expect } from "vitest";
import { apiError } from "./utils";

describe("apiError", () => {
  it("returns a network error message for FETCH_ERROR without leaking the raw TypeError string", () => {
    const result = apiError({
      status: "FETCH_ERROR",
      error: "TypeError: Network request failed",
    });
    expect(result).toBe("Network error. Check your connection and try again.");
  });

  it("returns a timeout message for TIMEOUT_ERROR", () => {
    const result = apiError({ status: "TIMEOUT_ERROR" });
    expect(result).toBe("The request timed out. Please try again.");
  });

  it("flattens a dict-shaped field error into 'Field: message'", () => {
    const result = apiError({
      status: 400,
      data: { error: { name: ["category with this name already exists."] } },
    });
    expect(result).toBe("Name: category with this name already exists.");
  });

  it("does not prefix non_field_errors with a label", () => {
    const result = apiError({
      status: 400,
      data: { error: { non_field_errors: ["Invalid combination."] } },
    });
    expect(result).toBe("Invalid combination.");
  });

  it("joins multiple messages for a single field with a space", () => {
    const result = apiError({
      status: 400,
      data: { error: { field: ["a", "b"] } },
    });
    expect(result).toBe("Field: a b");
  });

  it("never throws and always returns a string fallback for undefined input", () => {
    const result = apiError(undefined);
    expect(typeof result).toBe("string");
    expect(result).toBe("Something went wrong");
  });

  it("returns an image-size message for 413 responses", () => {
    const result = apiError({ status: 413 });
    expect(result).toBe("Your images are too large. Try fewer or smaller photos.");
  });

  it("prefers err.data.error over err.data.message when both are present", () => {
    const result = apiError({
      status: 400,
      data: { error: "from error", message: "from message" },
    });
    expect(result).toBe("from error");
  });

  it("falls back to err.data.message when err.data.error is absent", () => {
    const result = apiError({
      status: 400,
      data: { message: "from message" },
    });
    expect(result).toBe("from message");
  });

  it("returns a custom fallback when nothing else matches", () => {
    const result = apiError({}, "Custom fallback");
    expect(result).toBe("Custom fallback");
  });
});