import { Component, HostListener, OnInit } from '@angular/core';
import { PokeService } from '../../services/poke.service';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  map,
  scan,
  forkJoin,
  of,
  debounceTime,
  distinctUntilChanged,
  combineLatest,
  tap,
  pipe,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { PokeCardComponent } from '../../shared/components/poke-card/poke-card.component';
import { CARD_TYPES, Pokemon } from '../../shared/models/pokemon.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokeapi-showcase-poke-general',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    PokeCardComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './poke-general.component.html',
  styleUrl: './poke-general.component.scss',
})
export class PokeGeneralComponent implements OnInit {
  cardTypes = CARD_TYPES;
  private _offset = new BehaviorSubject<number>(0);
  private _onSearchPokemon = new BehaviorSubject<string>('');
  pokemonList$: Observable<Pokemon[]> = of([]);
  pokemonFilteredList$: Observable<Pokemon[]>;
  loading = false;
  isDynamicLoad = false;
  isInfiniteScrollActivated = true;
  pokemonSearchValue = '';

  constructor(
    private _pokeService: PokeService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pokemonFilteredList$ = this._onSearchPokemon.pipe(
      tap(() => this.loading = true),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((queryName) => {
        if (!queryName || queryName.trim() === '') {
          return of([]);
        }
        return this._pokeService.searchPokemonByName(queryName);
      })
    );

    const pokemonInfiniteScrollList$ = this._offset.pipe(
      switchMap((offset) => {
        this.loading = true;
        return this._pokeService
          .getPokemonList(offset, 20) ?? of([])
      }),
      scan<any, any[]>((acc, value) => {
        return [...acc, ...value];
      }, [])
    );

    this.pokemonList$ = combineLatest([
      pokemonInfiniteScrollList$,
      pokemonFilteredList$,
    ]).pipe(
      map(([pokemonInfiniteScrollList, pokemonFilteredList]) => {
        return this._onSearchPokemon.value.trim() === ''
        ? pokemonInfiniteScrollList
        : pokemonFilteredList
      }),
      switchMap((pokemonList: any[]) => {
        if (!pokemonList.length) return of([])
        const pokemonDetails$ = pokemonList.map((pokemon) =>
          this._pokeService.getPokemonDetail(pokemon.name)
        );
        return forkJoin(pokemonDetails$).pipe(
          map((pokemonDetails: any[]) =>
            pokemonDetails.map((pokemonDetail) => ({
              imageUrl:
                pokemonDetail.sprites.other['official-artwork'].front_default,
                ...pokemonDetail
            }))
          )
        );
      }),
      tap(() => this.loading = false)
    );
  }

  loadMore() {
    if (this.isInfiniteScrollActivated)
      this._offset.next(this._offset.value + 20);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;

    if (!this.loading && scrollPosition > documentHeight - 10) {
      this.loadMore();
    }
  }

  goToDetail(pokemon: Pokemon) {
    this._router.navigate([`${pokemon.name}`], { relativeTo: this._route });
  }

  pokemonSearchValueChange(searchValue: string) {
    this._onSearchPokemon.next(searchValue);
    this.isInfiniteScrollActivated = searchValue.length === 0;
  }

  /**
   * Reset the pokemon search input and switch to infinite scroll load
   */
  resetPokemonInputValue() {
    this.pokemonSearchValue = '';
    this._onSearchPokemon.next('');
    this.isInfiniteScrollActivated = true;
  }
}
