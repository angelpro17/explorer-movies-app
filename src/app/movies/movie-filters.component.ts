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
import { MoviesService, Genre } from '../services/movies.service';

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
  template: `
    <mat-expansion-panel class="filters-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>filter_list</mat-icon>
          Filtros Avanzados
        </mat-panel-title>
      </mat-expansion-panel-header>

      <div class="filters-content">
        <!-- Géneros -->
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Géneros</mat-label>
          <mat-select [(ngModel)]="selectedGenres" multiple (selectionChange)="onFiltersChange()">
            <mat-option *ngFor="let genre of genres" [value]="genre.id">
              {{ genre.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Géneros seleccionados -->
        <div class="selected-chips" *ngIf="selectedGenres.length > 0">
          <mat-chip *ngFor="let genreId of selectedGenres" 
                   (removed)="removeGenre(genreId)" 
                   removable>
            {{ getGenreName(genreId) }}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
        </div>

        <!-- Calificación mínima -->
        <div class="rating-filter">
          <label>Calificación mínima: {{ filters.minRating }}/10</label>
          <mat-slider [(ngModel)]="filters.minRating" 
                     [min]="0" 
                     [max]="10" 
                     [step]="0.5"
                     (valueChange)="onFiltersChange()">
          </mat-slider>
        </div>

        <!-- Rango de años -->
        <div class="year-range">
          <mat-form-field appearance="outline" class="year-field">
            <mat-label>Desde</mat-label>
            <input matInput type="number" 
                   [(ngModel)]="filters.yearFrom" 
                   [min]="1900" 
                   [max]="currentYear"
                   (ngModelChange)="onFiltersChange()">
          </mat-form-field>

          <mat-form-field appearance="outline" class="year-field">
            <mat-label>Hasta</mat-label>
            <input matInput type="number" 
                   [(ngModel)]="filters.yearTo" 
                   [min]="1900" 
                   [max]="currentYear + 5"
                   (ngModelChange)="onFiltersChange()">
          </mat-form-field>
        </div>

        <!-- Ordenamiento -->
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Ordenar por</mat-label>
          <mat-select [(ngModel)]="filters.sortBy" (selectionChange)="onFiltersChange()">
            <mat-option value="popularity">Popularidad</mat-option>
            <mat-option value="rating">Calificación</mat-option>
            <mat-option value="date">Fecha de lanzamiento</mat-option>
            <mat-option value="title">Título</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Botones de acción -->
        <div class="filter-actions">
          <button mat-stroked-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Limpiar filtros
          </button>
          <button mat-flat-button color="primary" (click)="applyFilters()">
            <mat-icon>search</mat-icon>
            Aplicar filtros
          </button>
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: [`
    .filters-panel {
      margin-bottom: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .filters-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .filter-field {
      width: 100%;
    }

    .selected-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .rating-filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .rating-filter label {
      font-weight: 500;
      color: #333;
    }

    .year-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .year-field {
      width: 100%;
    }

    .filter-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    mat-expansion-panel-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    mat-expansion-panel-header mat-icon {
      margin-right: 0.5rem;
    }
  `]
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