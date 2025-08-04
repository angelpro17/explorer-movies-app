import { Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: '/movies' },
];
