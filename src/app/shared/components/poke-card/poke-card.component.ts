import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CARD_TYPES, Pokemon } from '../../models/pokemon.interface';
import { CommonModule } from '@angular/common';
import { PokeIdPipe } from "../../pipes/id-number.pipe";
import { NameFormatterPipe } from "../../pipes/name-formatter.pipe";
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-pokeapi-showcase-poke-card',
    standalone: true,
    templateUrl: './poke-card.component.html',
    styleUrl: './poke-card.component.scss',
    imports: [CommonModule, PokeIdPipe, NameFormatterPipe, MatIconModule, MatButtonModule]
})
export class PokeCardComponent {

  cardTypes = CARD_TYPES;
  @Input() type: CARD_TYPES;
  @Input() pokemon: any;
  @Output('goToDetail') goToDetailEventEmitter: EventEmitter<Pokemon> =
    new EventEmitter();

  constructor(private _router: Router, private _route: ActivatedRoute) {

  }

  basicCardClicked() {
    this.goToDetailEventEmitter.emit(this.pokemon);
  }

  goBack() {
    this._router.navigate(['..'], {relativeTo: this._route});
  }
}
