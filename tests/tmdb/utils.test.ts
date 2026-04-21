import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatRuntime,
  formatVoteAverage,
  getTMDBImageUrl,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats a valid date string", () => {
    expect(formatDate("2023-07-15")).toBe("July 15, 2023");
  });

  it("returns 'Unknown date' for empty string", () => {
    expect(formatDate("")).toBe("Unknown date");
  });
});

describe("formatRuntime", () => {
  it("formats minutes into hours and minutes", () => {
    expect(formatRuntime(142)).toBe("2h 22m");
  });

  it("formats under 60 minutes correctly", () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("returns Unknown for null", () => {
    expect(formatRuntime(null)).toBe("Unknown");
  });
});

describe("formatVoteAverage", () => {
  it("returns one decimal place", () => {
    expect(formatVoteAverage(7.456)).toBe("7.5");
  });
});

describe("getTMDBImageUrl", () => {
  it("returns placeholder for null path", () => {
    expect(getTMDBImageUrl(null)).toBe("/placeholder-poster.png");
  });

  it("builds correct image URL", () => {
    const url = getTMDBImageUrl("/abc123.jpg", "w500");
    expect(url).toContain("/w500/abc123.jpg");
  });
});
