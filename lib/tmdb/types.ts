export type MediaType = "movie" | "tv";

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  media_type?: "movie";
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  media_type?: "tv";
}

export type TMDBMedia = TMDBMovie | TMDBTVShow;

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
}

export interface TMDBTVDetail extends TMDBTVShow {
  genres: TMDBGenre[];
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string;
  homepage: string | null;
  networks: { id: number; name: string; logo_path: string | null }[];
}

export type TMDBMediaDetail = TMDBMovieDetail | TMDBTVDetail;

// Type guards
export function isMovie(
  media: TMDBMedia | TMDBMediaDetail,
): media is TMDBMovie | TMDBMovieDetail {
  return "title" in media;
}

export function isTVShow(
  media: TMDBMedia | TMDBMediaDetail,
): media is TMDBTVShow | TMDBTVDetail {
  return "name" in media;
}

export function getMediaTitle(media: TMDBMedia | TMDBMediaDetail): string {
  return isMovie(media) ? media.title : media.name;
}

export function getMediaDate(media: TMDBMedia | TMDBMediaDetail): string {
  return isMovie(media) ? media.release_date : media.first_air_date;
}
