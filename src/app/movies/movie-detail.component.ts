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
import { MoviesService, TMDBMovieDetail, TMDBMovie, MovieVideo } from '../services/movies.service';
import { MovieCardComponent } from './movie-card.component';

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
  template: `
    <div class="detail-container" *ngIf="!loading">
      <!-- Hero Section con Backdrop -->
      <div class="hero-section" *ngIf="movie?.backdrop_path">
        <div class="backdrop-overlay">
                     <img 
             [src]="'https://image.tmdb.org/t/p/original' + (movie?.backdrop_path || '')" 
             [alt]="movie?.title || ''"
             class="backdrop-image"
           />
          <div class="backdrop-content">
            <div class="hero-info">
              <h1 class="movie-title">{{ movie?.title }}</h1>
                             <p class="movie-tagline" *ngIf="movie?.tagline">{{ movie?.tagline }}</p>
              <div class="movie-meta">
                                 <span class="release-year">{{ getReleaseYear(movie?.release_date) }}</span>
                 <span class="runtime" *ngIf="movie?.runtime">{{ formatRuntime(movie?.runtime || 0) }}</span>
                 <span class="rating">
                   <mat-icon>star</mat-icon>
                   {{ movie?.vote_average?.toFixed(1) }}
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="main-content">
          <!-- Información principal -->
          <mat-card class="info-card">
            <div class="movie-header">
              <div class="poster-section">
                                 <img 
                   *ngIf="movie?.poster_path" 
                   [src]="'https://image.tmdb.org/t/p/w500' + (movie?.poster_path || '')" 
                   [alt]="movie?.title || ''"
                   class="movie-poster"
                 />
                <div *ngIf="!movie?.poster_path" class="no-poster">
                  <mat-icon>movie</mat-icon>
                  <span>Sin imagen</span>
                </div>
              </div>
              
              <div class="movie-details">
                <h2 *ngIf="!movie?.backdrop_path">{{ movie?.title }}</h2>
                
                                 <div class="genres" *ngIf="movie?.genres?.length">
                   <mat-chip *ngFor="let genre of movie?.genres || []" class="genre-chip">
                     {{ genre.name }}
                   </mat-chip>
                 </div>
                
                <div class="overview">
                  <h3>Sinopsis</h3>
                  <p>{{ movie?.overview || 'Sin descripción disponible.' }}</p>
                </div>
                
                <div class="additional-info">
                                     <div class="info-item" *ngIf="movie?.status">
                     <strong>Estado:</strong> {{ movie?.status }}
                   </div>
                   <div class="info-item" *ngIf="movie?.budget">
                     <strong>Presupuesto:</strong> {{ formatCurrency(movie?.budget || 0) }}
                   </div>
                   <div class="info-item" *ngIf="movie?.revenue">
                     <strong>Ingresos:</strong> {{ formatCurrency(movie?.revenue || 0) }}
                   </div>
                   <div class="info-item" *ngIf="movie?.homepage">
                     <strong>Sitio web:</strong>
                     <a [href]="movie?.homepage || '#'" target="_blank" class="homepage-link">
                       Visitar sitio oficial
                     </a>
                   </div>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Tabs para contenido adicional -->
          <mat-card class="tabs-card">
            <mat-tab-group>
              <!-- Trailer -->
              <mat-tab label="Trailer">
                <div class="tab-content">
                  <div *ngIf="trailerUrl; else noTrailer" class="trailer-container">
                    <iframe 
                      [src]="trailerUrl" 
                      frameborder="0" 
                      allowfullscreen
                      class="trailer-iframe">
                    </iframe>
                  </div>
                  <ng-template #noTrailer>
                    <div class="no-content">
                      <mat-icon>video_library</mat-icon>
                      <p>No hay trailers disponibles para esta película.</p>
                    </div>
                  </ng-template>
                </div>
              </mat-tab>

              <!-- Películas similares -->
              <mat-tab label="Películas similares">
                <div class="tab-content">
                  <div *ngIf="similarMovies.length; else noSimilar" class="similar-movies">
                    <div class="movies-grid">
                      <app-movie-card 
                        *ngFor="let movie of similarMovies.slice(0, 6)"
                        [movie]="movie"
                        [isFavorite]="isFavorite(movie)"
                        [isInWatchlist]="isInWatchlist(movie)"
                        (favoriteToggled)="toggleFavorite($event)"
                        (watchlistToggled)="toggleWatchlist($event)">
                      </app-movie-card>
                    </div>
                  </div>
                  <ng-template #noSimilar>
                    <div class="no-content">
                      <mat-icon>movie</mat-icon>
                      <p>No hay películas similares disponibles.</p>
                    </div>
                  </ng-template>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card>
        </div>

        <!-- Sidebar con acciones -->
        <aside class="sidebar">
          <mat-card class="actions-card">
            <div class="action-buttons">
                             <button 
                 mat-flat-button 
                 [color]="movie && isFavorite(movie) ? 'warn' : 'primary'"
                 (click)="movie && toggleFavorite(movie)"
                 class="action-btn">
                 <mat-icon>{{ movie && isFavorite(movie) ? 'favorite' : 'favorite_border' }}</mat-icon>
                 {{ movie && isFavorite(movie) ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
               </button>
               
               <button 
                 mat-stroked-button 
                 [color]="movie && isInWatchlist(movie) ? 'accent' : 'primary'"
                 (click)="movie && toggleWatchlist(movie)"
                 class="action-btn">
                 <mat-icon>{{ movie && isInWatchlist(movie) ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                 {{ movie && isInWatchlist(movie) ? 'Quitar de watchlist' : 'Agregar a watchlist' }}
               </button>
              
              <button 
                mat-stroked-button 
                routerLink="/movies"
                class="action-btn">
                <mat-icon>arrow_back</mat-icon>
                Volver al catálogo
              </button>
            </div>
          </mat-card>
        </aside>
      </div>
    </div>

    <!-- Loading state -->
    <div *ngIf="loading" class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p>Cargando detalles de la película...</p>
    </div>

    <!-- Error state -->
    <div *ngIf="error && !loading" class="error-container">
      <mat-icon class="error-icon">error</mat-icon>
      <h3>Error al cargar la película</h3>
      <p>{{ error }}</p>
      <button mat-flat-button color="primary" routerLink="/movies">
        Volver al catálogo
      </button>
    </div>
  `,
  styles: [`
    .detail-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      height: 400px;
      overflow: hidden;
    }

    .backdrop-overlay {
      position: relative;
      height: 100%;
    }

    .backdrop-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .backdrop-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.3) 0%,
        rgba(0,0,0,0.7) 100%
      );
      display: flex;
      align-items: flex-end;
      padding: 2rem;
    }

    .hero-info {
      color: white;
      max-width: 800px;
    }

    .movie-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .movie-tagline {
      font-size: 1.2rem;
      font-style: italic;
      margin: 0 0 1rem 0;
      opacity: 0.9;
    }

    .movie-meta {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .release-year, .runtime {
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .rating mat-icon {
      color: #ffd700;
    }

    /* Content Wrapper */
    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Cards */
    .info-card, .tabs-card, .actions-card {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .movie-header {
      display: flex;
      gap: 2rem;
      padding: 2rem;
    }

    .poster-section {
      flex-shrink: 0;
    }

    .movie-poster {
      width: 300px;
      height: 450px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .no-poster {
      width: 300px;
      height: 450px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      color: #666;
    }

    .no-poster mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }

    .movie-details {
      flex: 1;
    }

    .movie-details h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #333;
    }

    .genres {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .genre-chip {
      background: #667eea;
      color: white;
    }

    .overview h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #333;
    }

    .overview p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #666;
      margin: 0 0 1.5rem 0;
    }

    .additional-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1rem;
    }

    .info-item strong {
      color: #333;
      min-width: 100px;
    }

    .homepage-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .homepage-link:hover {
      text-decoration: underline;
    }

    /* Tabs */
    .tab-content {
      padding: 2rem;
    }

    .trailer-container {
      display: flex;
      justify-content: center;
    }

    .trailer-iframe {
      width: 100%;
      max-width: 800px;
      height: 450px;
      border-radius: 8px;
    }

    .similar-movies {
      margin-top: 1rem;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .no-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      color: #666;
    }

    .no-content mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      color: #ccc;
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
    }

    .action-btn {
      width: 100%;
      padding: 1rem;
      font-weight: 500;
    }

    /* Loading and Error */
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      text-align: center;
    }

    .loading-container p {
      margin-top: 1rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error-container {
      color: #d32f2f;
    }

    .error-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }

    .error-container h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .error-container p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 300px;
      }

      .movie-title {
        font-size: 2rem;
      }

      .backdrop-content {
        padding: 1rem;
      }

      .content-wrapper {
        padding: 1rem;
      }

      .movie-header {
        flex-direction: column;
        padding: 1.5rem;
      }

      .movie-poster, .no-poster {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }

      .movie-details h2 {
        font-size: 2rem;
      }

      .tab-content {
        padding: 1rem;
      }

      .trailer-iframe {
        height: 250px;
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
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