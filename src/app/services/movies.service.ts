import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {environment} from '../environments/environment';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  homepage: string;
  backdrop_path: string | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
}

export interface SearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface MovieVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieVideosResponse {
  results: MovieVideo[];
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private base = environment.tmdbBaseUrl;
  private apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('query', query)
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/search/movie`, { params })
      .pipe(catchError(this.handleError));
  }

  getPopular(page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/movie/popular`, { params })
      .pipe(catchError(this.handleError));
  }

  getTopRated(page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/movie/top_rated`, { params })
      .pipe(catchError(this.handleError));
  }

  getUpcoming(page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/movie/upcoming`, { params })
      .pipe(catchError(this.handleError));
  }

  getNowPlaying(page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/movie/now_playing`, { params })
      .pipe(catchError(this.handleError));
  }

  getMoviesByGenre(genreId: number, page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('with_genres', String(genreId))
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/discover/movie`, { params })
      .pipe(catchError(this.handleError));
  }

  getGenres() {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES');

    return this.http
      .get<GenresResponse>(`${this.base}/genre/movie/list`, { params })
      .pipe(catchError(this.handleError));
  }

  getMovieDetail(id: number) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES');

    return this.http
      .get<TMDBMovieDetail>(`${this.base}/movie/${id}`, { params })
      .pipe(catchError(this.handleError));
  }

  getMovieVideos(id: number) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES');

    return this.http
      .get<MovieVideosResponse>(`${this.base}/movie/${id}/videos`, { params })
      .pipe(catchError(this.handleError));
  }

  getSimilarMovies(id: number, page = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES')
      .set('page', String(page));

    return this.http
      .get<SearchResponse>(`${this.base}/movie/${id}/similar`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    console.error('TMDB API error', err);
    const msg = err.error?.status_message || 'Error al comunicarse con TMDB';
    return throwError(() => new Error(msg));
  }
}
