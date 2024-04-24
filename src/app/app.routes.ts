import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full',
  },
  {
    path: 'pokedex',
    loadComponent: () =>
      import('./views/poke-general/poke-general.component').then(
        (c) => c.PokeGeneralComponent
      ),
  },
  {
    path: 'pokedex/:name',
    loadComponent: () =>
      import('./views/poke-detail/poke-detail.component').then(
        (c) => c.PokeDetailComponent
      ),
  },
  { path: '**', redirectTo: '/pokedex' },
];
