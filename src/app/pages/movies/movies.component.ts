import { Component, OnInit } from '@angular/core';
import { MoviesService, TMDBMovie, TMDBMovieDetail, SearchResponse } from '../../services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import {forkJoin, Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { exploreflixHeaderComponent } from '../../components/exploreflix-header/exploreflix-header.component';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { MovieRowComponent } from '../../components/movie-row/movie-row.component';

interface MovieCategory {
  title: string;
  movies: TMDBMovie[];
  category: 'popular' | 'top-rated' | 'upcoming' | 'now-playing';
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule,
    exploreflixHeaderComponent,
    HeroBannerComponent,
    MovieRowComponent
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  searchTerm = '';
  movies: TMDBMovie[] = [];
  favorites: TMDBMovie[] = [];
  watchlist: TMDBMovie[] = [];
  featuredMovie: TMDBMovie | null = null;
  loading = false;
  error = '';
  currentView: 'all' | 'favorites' | 'watchlist' = 'all';

  // Movie categories for exploreflix-style rows
  movieCategories: MovieCategory[] = [
    { title: 'Populares', movies: [], category: 'popular' },
    { title: 'Mejor Valoradas', movies: [], category: 'top-rated' },
    { title: 'Próximos Estrenos', movies: [], category: 'upcoming' },
    { title: 'En Cartelera', movies: [], category: 'now-playing' }
  ];

  page = 1;
  totalPages = 1;
  imageBase = 'https://image.tmdb.org/t/p/w500';
  private search$ = new Subject<string>();

  constructor(private svc: MoviesService) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadWatchlist();
    this.loadAllCategories();

    this.search$.pipe(debounceTime(300)).subscribe(term => {
      if (term) {
        this.searchMovies(term, 1);
      } else {
        this.loadAllCategories();
      }
    });
  }

  onViewChange(view: 'all' | 'favorites' | 'watchlist') {
    this.currentView = view;
    this.searchTerm = '';
    if (view === 'all') {
      this.loadAllCategories();
    }
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.page = 1;
    this.search$.next(term);
  }

  loadAllCategories() {
    this.loading = true;
    this.error = '';

    forkJoin({
      popular: this.svc.getPopular(1),
      topRated: this.svc.getTopRated(1),
      upcoming: this.svc.getUpcoming(1),
      nowPlaying: this.svc.getNowPlaying(1),
    }).subscribe({
      next: ({ popular, topRated, upcoming, nowPlaying }) => {
        this.movieCategories[0].movies = popular.results.slice(0, 20);
        this.movieCategories[1].movies = topRated.results.slice(0, 20);
        this.movieCategories[2].movies = upcoming.results.slice(0, 20);
        this.movieCategories[3].movies = nowPlaying.results.slice(0, 20);

        if (popular.results.length > 0) {
          this.featuredMovie = popular.results[0];
        }

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las películas';
        this.loading = false;
        console.error('Error loading categories:', error);
      }
    });
  }
  searchMovies(term: string, page: number) {
    this.loading = true;
    this.error = '';

    this.svc.searchMovies(term, page).subscribe({
      next: (res: SearchResponse) => {
        this.movies = res.results;
        this.page = res.page;
        this.totalPages = res.total_pages;
        this.loading = false;
      },
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
      }
    });
  }

  toggleFavorite(movie: TMDBMovie) {
    const exists = this.favorites.find(f => f.id === movie.id);
    if (exists) {
      this.favorites = this.favorites.filter(f => f.id !== movie.id);
    } else {
      this.favorites.unshift(movie);
    }
    localStorage.setItem('fav-movies-tmdb', JSON.stringify(this.favorites));
  }

  toggleWatchlist(movie: TMDBMovie) {
    const exists = this.watchlist.find(w => w.id === movie.id);
    if (exists) {
      this.watchlist = this.watchlist.filter(w => w.id !== movie.id);
    } else {
      this.watchlist.unshift(movie);
    }
    localStorage.setItem('watchlist-movies-tmdb', JSON.stringify(this.watchlist));
  }

  removeFavorite(event: Event, movie: TMDBMovie) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite(movie);
  }

  removeWatchlist(event: Event, movie: TMDBMovie) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleWatchlist(movie);
  }

  isFavorite(movie: TMDBMovie): boolean {
    return !!this.favorites.find(f => f.id === movie.id);
  }

  isInWatchlist(movie: TMDBMovie): boolean {
    return !!this.watchlist.find(w => w.id === movie.id);
  }

  loadFavorites() {
    const stored = localStorage.getItem('fav-movies-tmdb');
    this.favorites = stored ? JSON.parse(stored) : [];
  }

  loadWatchlist() {
    const stored = localStorage.getItem('watchlist-movies-tmdb');
    this.watchlist = stored ? JSON.parse(stored) : [];
  }

  onMovieSelected(movie: TMDBMovie) {
    // Navigate to movie detail or handle movie selection
    console.log('Movie selected:', movie);
  }

  getReleaseYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  truncateOverview(overview: string, maxLength = 200): string {
    if (!overview) return '';
    return overview.length > maxLength ? overview.substring(0, maxLength) + '...' : overview;
  }

  prevPage() {
    if (this.page > 1) {
      this.searchMovies(this.searchTerm, this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.searchMovies(this.searchTerm, this.page + 1);
    }
  }

  retry() {
    if (this.searchTerm) {
      this.searchMovies(this.searchTerm, this.page);
    } else {
      this.loadAllCategories();
    }
  }
}
