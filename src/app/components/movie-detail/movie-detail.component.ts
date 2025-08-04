import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoviesService, TMDBMovieDetail, TMDBMovie, MovieVideo } from '../../services/movies.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule,
    MatTooltipModule,
    MovieCardComponent
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: TMDBMovieDetail | null = null;
  similarMovies: TMDBMovie[] = [];
  trailerUrl: SafeResourceUrl | null = null;
  loading = true;
  error = '';
  favorites: TMDBMovie[] = [];
  watchlist: TMDBMovie[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadWatchlist();

    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieDetail(parseInt(movieId));
    }
  }

  loadMovieDetail(id: number) {
    this.loading = true;
    this.error = '';

    this.moviesService.getMovieDetail(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loadTrailer(id);
        this.loadSimilarMovies(id);
        this.loading = false;
      },
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
      }
    });
  }

  loadTrailer(movieId: number) {
    this.moviesService.getMovieVideos(movieId).subscribe({
      next: (response) => {
        const trailer = response.results.find(video =>
          video.site === 'YouTube' &&
          video.type === 'Trailer' &&
          video.official
        ) || response.results.find(video =>
          video.site === 'YouTube' &&
          video.type === 'Trailer'
        );

        if (trailer) {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${trailer.key}`
          );
        }
      },
      error: (error) => {
        console.error('Error loading trailer:', error);
      }
    });
  }

  loadSimilarMovies(movieId: number) {
    this.moviesService.getSimilarMovies(movieId).subscribe({
      next: (response) => {
        this.similarMovies = response.results;
      },
      error: (error) => {
        console.error('Error loading similar movies:', error);
      }
    });
  }

  getReleaseYear(date: string | undefined): string {
    return date ? date.split('-')[0] : 'N/A';
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'No disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
}
