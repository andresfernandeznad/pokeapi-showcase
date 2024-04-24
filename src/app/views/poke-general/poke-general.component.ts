import { Component, HostListener } from '@angular/core';
import { PokeService } from '../../services/poke.service';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  map,
  scan,
  forkJoin,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-pokeapi-showcase-poke-general',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './poke-general.component.html',
  styleUrl: './poke-general.component.scss',
})
export class PokeGeneralComponent {
  private offset = new BehaviorSubject<number>(0);
  pokemon$: Observable<any[]>;
  loading = false;
  isInfiniteLoadAvailable = false;

  constructor(private _pokeService: PokeService) {
    this.pokemon$ = this.offset.pipe(
      switchMap((offset) => {
        this.loading = true;
        return this._pokeService.getPokemonList(offset, 50).pipe(
          map((data: any) => data.results),
          switchMap((pokemons: any[]) => {
            const pokemonDetailsRequests = pokemons.map((pokemon) =>
              this._pokeService.getPokemonDetail(pokemon.name)
            );
            return forkJoin(pokemonDetailsRequests).pipe(
              map((details: any[]) =>
                details.map((detail) => ({
                  name: detail.name,
                  imageUrl: detail.sprites.front_default,
                }))
              )
            );
          })
        );
      }),
      scan<any, any[]>((acc, value, index) => {
        this.loading = false;
        return [...acc, ...value];
      }, [])
    );
  }

  loadMore() {
    this.offset.next(this.offset.value + 20);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;
    if (this.isInfiniteLoadAvailable && scrollPosition === documentHeight) {
      this.loadMore();
    }
  }

  changeTheLoadingListManagement(event: MatSlideToggleChange) {
    this.isInfiniteLoadAvailable = event.checked;
  }
}
