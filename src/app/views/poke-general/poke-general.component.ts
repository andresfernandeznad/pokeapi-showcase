import { Component, HostListener, OnInit } from '@angular/core';
import { PokeService } from '../../services/poke.service';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  map,
  scan,
  forkJoin,
  catchError,
  of,
  throwError,
  debounceTime,
  distinctUntilChanged,
  filter,
  combineLatest,
  tap,
  isEmpty,
  skipWhile,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
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
  pokemonList$: Observable<Pokemon[]>;
  pokemonFilteredList$: Observable<Pokemon[]>;
  loading = false;
  isDynamicLoad = false;
  isInfiniteScrollActivated = true;
  pokemonSearchValue = '';

  constructor(
    private _pokeService: PokeService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pokemonFilteredList$ = this._onSearchPokemon.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((queryName) => {
        if (queryName.trim() === '') {
          return of([]);
        }
        return this._pokeService.searchPokemonByName(queryName);
      })
    );

    const pokemonInfiniteScrollList$ = this._offset.pipe(
      switchMap((offset) => {
        this.loading = true;
        return this._pokeService
          .getPokemonList(offset, 20)
          .pipe(map((data: any) => data.results));
      }),
      scan<any, any[]>((acc, value) => {
        this.loading = false;
        return [...acc, ...value];
      }, []),
      catchError((error) => {
        this._snackBar.open(error.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
        return throwError(() => error);
      })
    );

    this.pokemonList$ = combineLatest([
      pokemonInfiniteScrollList$,
      pokemonFilteredList$,
    ]).pipe(
      map(([pokemonInfiniteScrollList, pokemonFilteredList]) => {
        return this._onSearchPokemon.value.trim() === ''
          ? pokemonInfiniteScrollList
          : pokemonFilteredList;
      }),
      switchMap((pokemonList: any[]) => {
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
      })
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

  changeTheLoadingListManagement(event: MatSlideToggleChange) {
    this.isDynamicLoad = event.checked;
  }

  goToDetail(pokemon: Pokemon) {
    this._router.navigate([`${pokemon.name}`], { relativeTo: this._route });
  }

  pokemonSearchValueChange(searchValue: string) {
    this._onSearchPokemon.next(searchValue);
    this.isInfiniteScrollActivated = searchValue.length === 0;
  }

  resetPokemonInputValue() {
    this.pokemonSearchValue = '';
    this._onSearchPokemon.next('');
    this.isInfiniteScrollActivated = true;
  }
}
