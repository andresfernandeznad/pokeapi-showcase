import { Component, OnInit } from '@angular/core';
import { CARD_TYPES, Pokemon } from '../../shared/models/pokemon.interface';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokeCardComponent } from '../../shared/components/poke-card/poke-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PokeService } from '../../services/poke.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokeapi-showcase-poke-detail',
  standalone: true,
  imports: [CommonModule, PokeCardComponent, MatIconModule, MatButtonModule],
  templateUrl: './poke-detail.component.html',
  styleUrl: './poke-detail.component.scss',
})
export class PokeDetailComponent implements OnInit {
  cardTypes = CARD_TYPES;
  pokemon$: Observable<Pokemon>;

  constructor(
    private _pokeService: PokeService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pokemon$ = this._route.params.pipe(
      switchMap((params) => this._pokeService.getPokemonDetail(params['name']) ?? of({})),
      map((pokemon) => {
        return {
          imageUrl: pokemon.sprites?.other['official-artwork']?.front_default ?? '',
          ...pokemon,
        };
      })
    );
  }

  goBack() {
    this._router.navigate(['..'], {relativeTo: this._route});
  }
}
