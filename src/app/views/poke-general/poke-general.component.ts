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
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
  ],
  templateUrl: './poke-general.component.html',
  styleUrl: './poke-general.component.scss',
})
export class PokeGeneralComponent implements OnInit {
  cardTypes = CARD_TYPES;
  private offset = new BehaviorSubject<number>(0);
  pokemonList$: Observable<Pokemon[]>;
  loading = false;
  isDynamicLoad = false;

  constructor(
    private _pokeService: PokeService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pokemonList$ = this.offset.pipe(
      switchMap((offset) => {
        this.loading = true;
        return this._pokeService.getPokemonList(offset, 20).pipe(
          map((data: any) => data.results),
          switchMap((pokemonList: any[]) => {
            const pokemonDetails$ = pokemonList.map((pokemon) =>
              this._pokeService.getPokemonDetail(pokemon.name)
            );
            return forkJoin(pokemonDetails$).pipe(
              map((pokemonDetails: any[]) =>
                pokemonDetails.map((pokemonDetail) => ({
                  id: pokemonDetail.id,
                  name: pokemonDetail.name,
                  imageUrl: pokemonDetail.sprites.other.dream_world.front_default,
                }))
              )
            );
          })
        );
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
  }

  loadMore() {
    this.offset.next(this.offset.value + 20);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;

    if (
      this.isDynamicLoad &&
      !this.loading &&
      scrollPosition > documentHeight - 10
    ) {
      this.loadMore();
    }
  }

  changeTheLoadingListManagement(event: MatSlideToggleChange) {
    this.isDynamicLoad = event.checked;
  }

  goToDetail(pokemon: Pokemon) {
    this._router.navigate([`${pokemon.name}`], { relativeTo: this._route });
  }
}
