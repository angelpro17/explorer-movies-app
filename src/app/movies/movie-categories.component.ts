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
  template: `
    <div class="categories-container">
      <mat-tab-group 
        (selectedTabChange)="onCategoryChange($event.index)"
        class="categories-tabs"
        backgroundColor="primary">
        
        <mat-tab *ngFor="let category of categories; let i = index" 
                 [label]="category.label"
                 class="category-tab">
          <div class="tab-content">
            <div class="category-header">
              <mat-icon class="category-icon">{{ category.icon }}</mat-icon>
              <div class="category-info">
                <h3>{{ category.label }}</h3>
                <p>{{ category.description }}</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .categories-container {
      margin-bottom: 2rem;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .categories-tabs {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .category-tab {
      background: white;
    }

    .tab-content {
      padding: 1.5rem;
      background: white;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .category-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #667eea;
    }

    .category-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-weight: 600;
    }

    .category-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    ::ng-deep .mat-mdc-tab-group {
      .mat-mdc-tab-header {
        background: rgba(255,255,255,0.1);
      }
      
      .mat-mdc-tab-label {
        color: white;
        font-weight: 500;
      }
      
      .mat-mdc-tab-label-active {
        color: white;
        background: rgba(255,255,255,0.2);
      }
      
      .mat-mdc-ink-bar {
        background-color: white;
      }
    }
  `]
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