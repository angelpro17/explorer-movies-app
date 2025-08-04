import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-exploreflix-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    MatDivider
  ],
  template: `
    <header class="exploreflix-header">
      <div class="header-container">
        <!-- Logo y navegación principal -->
        <div class="header-left">
          <div class="exploreflix-logo">
            <mat-icon class="logo-icon">movie</mat-icon>
            <span class="logo-text">ExploreFlix</span>
          </div>

          <nav class="main-nav" [class.mobile-hidden]="!showMobileMenu">
            <button
              mat-button
              class="nav-item"
              [class.active]="currentView === 'all'"
              (click)="onViewChange('all')">
              Inicio
            </button>
            <button
              mat-button
              class="nav-item"
              [class.active]="currentView === 'favorites'"
              (click)="onViewChange('favorites')">
              Mi lista
            </button>
            <button
              mat-button
              class="nav-item"
              [class.active]="currentView === 'watchlist'"
              (click)="onViewChange('watchlist')">
              Watchlist
            </button>
          </nav>
        </div>

        <!-- Búsqueda y perfil -->
        <div class="header-right">
          <div class="search-container" [class.expanded]="searchExpanded">
            <button
              mat-icon-button
              class="search-toggle"
              (click)="toggleSearch()"
              *ngIf="!searchExpanded">
              <mat-icon>search</mat-icon>
            </button>

            <div class="search-input-container" *ngIf="searchExpanded">
              <mat-icon class="search-icon">search</mat-icon>
              <input
                #searchInput
                class="search-input"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
                (blur)="onSearchBlur()"
                placeholder="Títulos, personas, géneros..."
                autocomplete="off">
              <button
                mat-icon-button
                class="search-close"
                (click)="closeSearch()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Menú móvil -->
          <button
            mat-icon-button
            class="mobile-menu-toggle hide-desktop"
            (click)="toggleMobileMenu()">
            <mat-icon>{{ showMobileMenu ? 'close' : 'menu' }}</mat-icon>
          </button>

          <!-- Notificaciones y perfil -->
          <button mat-icon-button class="notification-btn hide-mobile">
            <mat-icon>notifications</mat-icon>
          </button>

          <button
            mat-button
            class="profile-btn hide-mobile"
            [matMenuTriggerFor]="profileMenu">
            <div class="profile-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
          </button>

          <mat-menu #profileMenu="matMenu" class="profile-menu">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Perfil</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Configuración</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item>
              <mat-icon>logout</mat-icon>
              <span>Cerrar sesión</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Navegación móvil -->
      <div class="mobile-nav" *ngIf="showMobileMenu">
        <button
          mat-button
          class="mobile-nav-item"
          [class.active]="currentView === 'all'"
          (click)="onViewChange('all'); toggleMobileMenu()">
          <mat-icon>home</mat-icon>
          Inicio
        </button>
        <button
          mat-button
          class="mobile-nav-item"
          [class.active]="currentView === 'favorites'"
          (click)="onViewChange('favorites'); toggleMobileMenu()">
          <mat-icon>favorite</mat-icon>
          Mi lista ({{ favoritesCount }})
        </button>
        <button
          mat-button
          class="mobile-nav-item"
          [class.active]="currentView === 'watchlist'"
          (click)="onViewChange('watchlist'); toggleMobileMenu()">
          <mat-icon>bookmark</mat-icon>
          Watchlist ({{ watchlistCount }})
        </button>
      </div>
    </header>
  `,
  styleUrls: ['./exploreflix-header.component.css']
})
export class exploreflixHeaderComponent {
  @Input() currentView: 'all' | 'favorites' | 'watchlist' = 'all';
  @Input() favoritesCount = 0;
  @Input() watchlistCount = 0;
  @Input() searchTerm = '';

  @Output() viewChanged = new EventEmitter<'all' | 'favorites' | 'watchlist'>();
  @Output() searchChanged = new EventEmitter<string>();

  searchExpanded = false;
  showMobileMenu = false;

  onViewChange(view: 'all' | 'favorites' | 'watchlist') {
    this.viewChanged.emit(view);
  }

  onSearchChange(term: string) {
    this.searchChanged.emit(term);
  }

  toggleSearch() {
    this.searchExpanded = true;
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      input?.focus();
    }, 100);
  }

  closeSearch() {
    this.searchExpanded = false;
    this.searchTerm = '';
    this.onSearchChange('');
  }

  onSearchBlur() {
    if (!this.searchTerm) {
      setTimeout(() => {
        this.searchExpanded = false;
      }, 150);
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
