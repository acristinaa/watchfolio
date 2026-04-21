import { describe, it, expect } from "vitest";
import {
  isMovie,
  isTVShow,
  getMediaTitle,
  getMediaDate,
  type TMDBMovie,
  type TMDBTVShow,
} from "@/lib/tmdb/types";

const mockMovie: TMDBMovie = {
  id: 1,
  title: "Inception",
  overview: "A thief who steals corporate secrets...",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2010-07-16",
  vote_average: 8.8,
  vote_count: 30000,
  genre_ids: [28, 878],
  popularity: 100,
  adult: false,
};

const mockTV: TMDBTVShow = {
  id: 2,
  name: "Breaking Bad",
  overview: "A chemistry teacher turned drug lord...",
  poster_path: "/poster2.jpg",
  backdrop_path: null,
  first_air_date: "2008-01-20",
  vote_average: 9.5,
  vote_count: 20000,
  genre_ids: [18, 80],
  popularity: 90,
};

describe("isMovie", () => {
  it("returns true for movie objects", () => {
    expect(isMovie(mockMovie)).toBe(true);
  });

  it("returns false for TV show objects", () => {
    expect(isMovie(mockTV)).toBe(false);
  });
});

describe("isTVShow", () => {
  it("returns true for TV show objects", () => {
    expect(isTVShow(mockTV)).toBe(true);
  });
});

describe("getMediaTitle", () => {
  it("returns title for movies", () => {
    expect(getMediaTitle(mockMovie)).toBe("Inception");
  });

  it("returns name for TV shows", () => {
    expect(getMediaTitle(mockTV)).toBe("Breaking Bad");
  });
});

describe("getMediaDate", () => {
  it("returns release_date for movies", () => {
    expect(getMediaDate(mockMovie)).toBe("2010-07-16");
  });

  it("returns first_air_date for TV shows", () => {
    expect(getMediaDate(mockTV)).toBe("2008-01-20");
  });
});
