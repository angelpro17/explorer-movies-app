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
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MovieFiltersComponent, MovieFilters } from '../../components/movie-filters/movie-filters.component';
import { MovieCategoriesComponent, MovieCategory } from '../../components/movie-categories/movie-categories.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

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
    MovieFiltersComponent,
    MovieCategoriesComponent,
    MovieCardComponent
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  searchTerm = '';
  movies: TMDBMovie[] = [];
  favorites: TMDBMovie[] = [];
  watchlist: TMDBMovie[] = [];
  selected: TMDBMovieDetail | null = null;
  loading = false;
  error = '';
  currentView: 'all' | 'favorites' | 'watchlist' = 'all';
  currentCategory: MovieCategory = 'popular';
  currentFilters: MovieFilters = {
    genres: [],
    minRating: 0,
    yearFrom: 1900,
    yearTo: new Date().getFullYear(),
    sortBy: 'popularity'
  };

  page = 1;
  totalPages = 1;
  imageBase = 'https://image.tmdb.org/t/p/w500';
  private search$ = new Subject<string>();

  constructor(private svc: MoviesService) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadWatchlist();
    this.loadMoviesByCategory(this.currentCategory);
    
    this.search$.pipe(debounceTime(300)).subscribe(term => {
      if (term) this.fetch(term, 1);
      else this.loadMoviesByCategory(this.currentCategory, 1);
    });
  }

  onSearchChange(v: string) {
    this.page = 1;
    this.search$.next(v);
  }

  onCategoryChange(category: MovieCategory) {
    this.currentCategory = category;
    this.searchTerm = '';
    this.page = 1;
    this.loadMoviesByCategory(category, 1);
  }

  onFiltersChange(filters: MovieFilters) {
    this.currentFilters = filters;
    this.applyFilters();
  }

  loadMoviesByCategory(category: MovieCategory, page = 1) {
    this.loading = true;
    this.error = '';
    
    const requests = {
      'popular': () => this.svc.getPopular(page),
      'top-rated': () => this.svc.getTopRated(page),
      'upcoming': () => this.svc.getUpcoming(page),
      'now-playing': () => this.svc.getNowPlaying(page)
    };

    const request = requests[category];
    if (request) {
      request().subscribe({
        next: (res: SearchResponse) => {
          this.movies = this.filterMovies(res.results);
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
  }

  fetch(term: string, p: number) {
    this.loading = true;
    this.error = '';
    this.svc.searchMovies(term, p).subscribe({
      next: (res: SearchResponse) => {
        this.movies = this.filterMovies(res.results);
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

  filterMovies(movies: TMDBMovie[]): TMDBMovie[] {
    return movies.filter(movie => {
      // Filtro por calificación mínima
      if (movie.vote_average < this.currentFilters.minRating) {
        return false;
      }

      // Filtro por año
      const movieYear = parseInt(movie.release_date.split('-')[0]);
      if (movieYear < this.currentFilters.yearFrom || movieYear > this.currentFilters.yearTo) {
        return false;
      }

      // Filtro por géneros
      if (this.currentFilters.genres.length > 0 && movie.genre_ids) {
        const hasMatchingGenre = this.currentFilters.genres.some(genreId => 
          movie.genre_ids!.includes(genreId)
        );
        if (!hasMatchingGenre) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Ordenamiento
      switch (this.currentFilters.sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default: // popularity
          return 0; // TMDB ya ordena por popularidad
      }
    });
  }

  applyFilters() {
    if (this.searchTerm) {
      this.fetch(this.searchTerm, 1);
    } else {
      this.loadMoviesByCategory(this.currentCategory, 1);
    }
  }

  prevPage() {
    if (this.page > 1) {
      if (this.searchTerm) this.fetch(this.searchTerm, this.page - 1);
      else this.loadMoviesByCategory(this.currentCategory, this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      if (this.searchTerm) this.fetch(this.searchTerm, this.page + 1);
      else this.loadMoviesByCategory(this.currentCategory, this.page + 1);
    }
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

  getCurrentMovies(): TMDBMovie[] {
    switch (this.currentView) {
      case 'favorites':
        return this.favorites;
      case 'watchlist':
        return this.watchlist;
      default:
        return this.movies;
    }
  }

  getCurrentTitle(): string {
    switch (this.currentView) {
      case 'favorites':
        return 'Mis Favoritas';
      case 'watchlist':
        return 'Mi Watchlist';
      default:
        return this.searchTerm ? `Búsqueda: "${this.searchTerm}"` : 'Catálogo de Películas';
    }
  }
}
