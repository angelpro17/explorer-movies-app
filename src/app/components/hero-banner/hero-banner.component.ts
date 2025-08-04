import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TMDBMovie } from '../../services/movies.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="hero-banner" *ngIf="featuredMovie">
      <div class="hero-background">
        <img
          *ngIf="featuredMovie.backdrop_path"
          [src]="getBackdropUrl(featuredMovie.backdrop_path)"
          [alt]="featuredMovie.title"
          class="hero-image"
          loading="eager">
        <div class="hero-gradient"></div>
      </div>

      <div class="hero-content">
        <div class="hero-info">
          <h1 class="hero-title">{{ featuredMovie.title }}</h1>

          <div class="hero-meta">
            <span class="hero-rating">
              <mat-icon>star</mat-icon>
              {{ featuredMovie.vote_average.toFixed(1) }}
            </span>
            <span class="hero-year">{{ getReleaseYear(featuredMovie.release_date) }}</span>
            <span class="hero-duration">{{ getDuration() }}</span>
          </div>

          <p class="hero-overview" *ngIf="featuredMovie.overview">
            {{ truncateOverview(featuredMovie.overview) }}
          </p>

          <div class="hero-actions">
            <button
              mat-flat-button
              class="play-button exploreflix-button-primary"
              [routerLink]="['/movie', featuredMovie.id]">
              <mat-icon>play_arrow</mat-icon>
              Reproducir
            </button>

            <button
              mat-flat-button
              class="info-button exploreflix-button-secondary"
              [routerLink]="['/movie', featuredMovie.id]">
              <mat-icon>info_outline</mat-icon>
              Más información
            </button>

            <button
              mat-icon-button
              class="favorite-button"
              [class.favorited]="isFavorite"
              (click)="onToggleFavorite()"
              [attr.aria-label]="isFavorite ? 'Quitar de mi lista' : 'Agregar a mi lista'">
              <mat-icon>{{ isFavorite ? 'check' : 'add' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de volumen (simulado) -->
      <div class="volume-control">
        <button mat-icon-button class="volume-button" (click)="toggleMute()">
          <mat-icon>{{ isMuted ? 'volume_off' : 'volume_up' }}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent {
  @Input() featuredMovie: TMDBMovie | null = null;
  @Input() isFavorite = false;
  @Output() favoriteToggled = new EventEmitter<TMDBMovie>();

  isMuted = true;
  private imageBase = 'https://image.tmdb.org/t/p/original';

  getBackdropUrl(backdropPath: string): string {
    return this.imageBase + backdropPath;
  }

  getReleaseYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  getDuration(): string {
    // Simulamos una duración aleatoria entre 90 y 180 minutos
    const duration = Math.floor(Math.random() * 90) + 90;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }

  truncateOverview(overview: string): string {
    if (!overview) return '';
    return overview.length > 200 ? overview.substring(0, 200) + '...' : overview;
  }

  onToggleFavorite(): void {
    if (this.featuredMovie) {
      this.favoriteToggled.emit(this.featuredMovie);
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }
}
