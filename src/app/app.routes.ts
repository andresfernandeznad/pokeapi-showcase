import { Routes } from '@angular/router';
import { PokeGeneralComponent } from './views/poke-general/poke-general.component';
import { PokeDetailComponent } from './views/poke-detail/poke-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full',
  },
  {
    path: 'pokedex',
    component: PokeGeneralComponent,
  },
  {
    path: 'pokedex/:id',
    component: PokeDetailComponent,
  },
  { path: '**', redirectTo: '/pokedex' },
];
