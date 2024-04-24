import { Component, OnInit } from '@angular/core';
import { CARD_TYPES, Pokemon } from '../../shared/models/pokemon.interface';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokeCardComponent } from '../../shared/components/poke-card/poke-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { PokeService } from '../../services/poke.service';

@Component({
  selector: 'app-pokeapi-showcase-poke-detail',
  standalone: true,
  imports: [CommonModule, PokeCardComponent],
  templateUrl: './poke-detail.component.html',
  styleUrl: './poke-detail.component.scss',
})
export class PokeDetailComponent implements OnInit {
  cardTypes = CARD_TYPES;
  pokemon$: Observable<Pokemon>;

  constructor(
    private _pokeService: PokeService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pokemon$ = this._route.params.pipe(
      switchMap((params) => this._pokeService.getPokemonDetail(params['name'])),
      map((pokemon) => {
        return {
          imageUrl: pokemon.sprites.other.dream_world.front_default,
          ...pokemon,
        };
      }),catchError((error) => {
        this._snackBar.open(error.message, 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
        return throwError(() => error);
      })
    );
  }
}
