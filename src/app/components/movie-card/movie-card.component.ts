import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TMDBMovie } from '../../services/movies.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: TMDBMovie;
  @Input() isFavorite = false;
  @Input() isInWatchlist = false;
  @Output() favoriteToggled = new EventEmitter<TMDBMovie>();
  @Output() watchlistToggled = new EventEmitter<TMDBMovie>();

  imageBase = 'https://image.tmdb.org/t/p/w500';

  getReleaseYear(date: string): string {
    return date ? date.split('-')[0] : 'N/A';
  }

  truncateOverview(overview: string): string {
    return overview.length > 100 ? overview.substring(0, 100) + '...' : overview;
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit(this.movie);
  }

  toggleWatchlist(event: Event) {
    event.stopPropagation();
    this.watchlistToggled.emit(this.movie);
  }
}
