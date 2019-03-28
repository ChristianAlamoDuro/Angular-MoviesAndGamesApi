// importar modulos del router de angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// importar componentes
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { MoviesComponent } from './components/movies/movies.component';
import { WebMapComponent } from './components/web-map/web-map.component';

// Rutas
const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'searchResults/:title', component: SearchResultsComponent },
  { path: 'more-info/:title', component: MoreInfoComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'web-map', component: WebMapComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }
];
export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
