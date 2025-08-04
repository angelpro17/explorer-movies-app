import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

export type MovieCategory = 'popular' | 'top-rated' | 'upcoming' | 'now-playing';

export interface CategoryOption {
  value: MovieCategory;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-movie-categories',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule],
  templateUrl: './movie-categories.component.html',
  styleUrls: ['./movie-categories.component.css']
})
export class MovieCategoriesComponent {
  @Output() categorySelected = new EventEmitter<MovieCategory>();

  categories: CategoryOption[] = [
    {
      value: 'popular',
      label: 'Populares',
      icon: 'trending_up',
      description: 'Las películas más populares del momento'
    },
    {
      value: 'top-rated',
      label: 'Mejor Valoradas',
      icon: 'star',
      description: 'Películas con las mejores calificaciones'
    },
    {
      value: 'upcoming',
      label: 'Próximos Estrenos',
      icon: 'event',
      description: 'Películas que se estrenarán próximamente'
    },
    {
      value: 'now-playing',
      label: 'En Cartelera',
      icon: 'movie',
      description: 'Películas actualmente en los cines'
    }
  ];

  onCategoryChange(index: number) {
    const selectedCategory = this.categories[index];
    this.categorySelected.emit(selectedCategory.value);
  }
}
