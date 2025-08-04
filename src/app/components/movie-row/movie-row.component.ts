import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TMDBMovie } from '../../services/movies.service';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="movie-row" *ngIf="movies && movies.length > 0">
      <h2 class="row-title">{{ title }}</h2>
      
      <div class="row-container">
        <button 
          mat-icon-button 
          class="scroll-button scroll-left"
          [class.visible]="canScrollLeft"
          (click)="scrollLeft()"
          aria-label="Scroll izquierda">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        <div 
          class="movies-container" 
          #moviesContainer
          (scroll)="onScroll()">
          <div class="movies-track">
            <div 
              class="movie-item"
              *ngFor="let movie of movies; trackBy: trackByMovieId"
              [routerLink]="['/movie', movie.id]">
              
              <div class="movie-thumbnail">
                <img 
                  *ngIf="movie.poster_path"
                  [src]="getPosterUrl(movie.poster_path)"
                  [alt]="movie.title"
                  class="movie-poster"
                  loading="lazy">
                
                <div *ngIf="!movie.poster_path" class="no-poster">
                  <mat-icon>movie</mat-icon>
                </div>
                
                <!-- Overlay de hover -->
                <div class="movie-overlay">
                  <div class="overlay-content">
                    <div class="movie-info">
                      <h4 class="movie-title">{{ movie.title }}</h4>
                      <div class="movie-meta">
                        <span class="rating">
                          <mat-icon>star</mat-icon>
                          {{ movie.vote_average.toFixed(1) }}
                        </span>
                        <span class="year">{{ getReleaseYear(movie.release_date) }}</span>
                      </div>
                    </div>
                    
                    <div class="movie-actions">
                      <button 
                        mat-icon-button 
                        class="play-btn"
                        (click)="onPlayClick($event, movie)"
                        aria-label="Reproducir">
                        <mat-icon>play_arrow</mat-icon>
                      </button>
                      
                      <button 
                        mat-icon-button 
                        class="favorite-btn"
                        [class.favorited]="isFavorite(movie)"
                        (click)="onFavoriteClick($event, movie)"
                        [attr.aria-label]="isFavorite(movie) ? 'Quitar de favoritos' : 'Agregar a favoritos'">
                        <mat-icon>{{ isFavorite(movie) ? 'favorite' : 'favorite_border' }}</mat-icon>
                      </button>
                      
                      <button 
                        mat-icon-button 
                        class="watchlist-btn"
                        [class.in-watchlist]="isInWatchlist(movie)"
                        (click)="onWatchlistClick($event, movie)"
                        [attr.aria-label]="isInWatchlist(movie) ? 'Quitar de watchlist' : 'Agregar a watchlist'">
                        <mat-icon>{{ isInWatchlist(movie) ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                      </button>
                      
                      <button 
                        mat-icon-button 
                        class="info-btn"
                        (click)="onInfoClick($event, movie)"
                        aria-label="Más información">
                        <mat-icon>info_outline</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          mat-icon-button 
          class="scroll-button scroll-right"
          [class.visible]="canScrollRight"
          (click)="scrollRight()"
          aria-label="Scroll derecha">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./movie-row.component.css']
})
export class MovieRowComponent implements AfterViewInit {
  @ViewChild('moviesContainer') moviesContainer!: ElementRef<HTMLDivElement>;
  
  @Input() title = '';
  @Input() movies: TMDBMovie[] = [];
  @Input() favorites: TMDBMovie[] = [];
  @Input() watchlist: TMDBMovie[] = [];
  
  @Output() favoriteToggled = new EventEmitter<TMDBMovie>();
  @Output() watchlistToggled = new EventEmitter<TMDBMovie>();
  @Output() movieSelected = new EventEmitter<TMDBMovie>();

  canScrollLeft = false;
  canScrollRight = false;
  private imageBase = 'https://image.tmdb.org/t/p/w500';

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateScrollButtons();
    }, 100);
  }

  getPosterUrl(posterPath: string): string {
    return this.imageBase + posterPath;
  }

  getReleaseYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  trackByMovieId(index: number, movie: TMDBMovie): number {
    return movie.id;
  }

  isFavorite(movie: TMDBMovie): boolean {
    return this.favorites.some(fav => fav.id === movie.id);
  }

  isInWatchlist(movie: TMDBMovie): boolean {
    return this.watchlist.some(item => item.id === movie.id);
  }

  scrollLeft(): void {
    const container = this.moviesContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = this.moviesContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  onScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    const container = this.moviesContainer?.nativeElement;
    if (!container) return;

    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 1);
  }

  onPlayClick(event: Event, movie: TMDBMovie): void {
    event.preventDefault();
    event.stopPropagation();
    // Aquí podrías implementar la lógica de reproducción
    this.movieSelected.emit(movie);
  }

  onFavoriteClick(event: Event, movie: TMDBMovie): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggled.emit(movie);
  }

  onWatchlistClick(event: Event, movie: TMDBMovie): void {
    event.preventDefault();
    event.stopPropagation();
    this.watchlistToggled.emit(movie);
  }

  onInfoClick(event: Event, movie: TMDBMovie): void {
    event.preventDefault();
    event.stopPropagation();
    this.movieSelected.emit(movie);
  }
}