import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MoviesService, Genre } from '../../services/movies.service';

export interface MovieFilters {
  genres: number[];
  minRating: number;
  yearFrom: number;
  yearTo: number;
  sortBy: 'popularity' | 'rating' | 'date' | 'title';
}

@Component({
  selector: 'app-movie-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatInputModule,
    MatOptionModule
  ],
  templateUrl: './movie-filters.component.html',
  styleUrls: ['./movie-filters.component.css']
})
export class MovieFiltersComponent implements OnInit {
  @Input() currentFilters: MovieFilters = {
    genres: [],
    minRating: 0,
    yearFrom: 1900,
    yearTo: new Date().getFullYear(),
    sortBy: 'popularity'
  };

  @Output() filtersChanged = new EventEmitter<MovieFilters>();

  genres: Genre[] = [];
  selectedGenres: number[] = [];
  filters: MovieFilters = { ...this.currentFilters };
  currentYear = new Date().getFullYear();

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.loadGenres();
    this.selectedGenres = [...this.currentFilters.genres];
  }

  loadGenres() {
    this.moviesService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  onFiltersChange() {
    this.filters.genres = [...this.selectedGenres];
    this.filtersChanged.emit({ ...this.filters });
  }

  removeGenre(genreId: number) {
    this.selectedGenres = this.selectedGenres.filter(id => id !== genreId);
    this.onFiltersChange();
  }

  getGenreName(genreId: number): string {
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.name : '';
  }

  clearFilters() {
    this.filters = {
      genres: [],
      minRating: 0,
      yearFrom: 1900,
      yearTo: this.currentYear,
      sortBy: 'popularity'
    };
    this.selectedGenres = [];
    this.onFiltersChange();
  }

  applyFilters() {
    this.filtersChanged.emit({ ...this.filters });
  }
}
