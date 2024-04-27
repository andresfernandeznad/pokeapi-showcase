import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CARD_TYPES, Pokemon } from '../../models/pokemon.interface';
import { CommonModule } from '@angular/common';
import { PokeIdPipe } from "../../pipes/id-number.pipe";
import { NameFormatterPipe } from "../../pipes/name-formatter.pipe";

@Component({
    selector: 'app-pokeapi-showcase-poke-card',
    standalone: true,
    templateUrl: './poke-card.component.html',
    styleUrl: './poke-card.component.scss',
    imports: [CommonModule, PokeIdPipe, NameFormatterPipe]
})
export class PokeCardComponent {

  cardTypes = CARD_TYPES;
  @Input() type: CARD_TYPES;
  @Input() pokemon: any;
  @Output('goToDetail') goToDetailEventEmitter: EventEmitter<Pokemon> =
    new EventEmitter();

  basicCardClicked() {
    this.goToDetailEventEmitter.emit(this.pokemon);
  }
}
