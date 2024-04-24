import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CARD_TYPES, Pokemon } from '../../models/pokemon.interface';

@Component({
  selector: 'app-pokeapi-showcase-poke-card',
  standalone: true,
  imports: [],
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.scss'
})
export class PokeCardComponent {

  cardTypes = CARD_TYPES;
  @Input() type: CARD_TYPES;
  @Input() pokemon: Pokemon;
  @Output('goToDetail') goToDetailEventEmitter: EventEmitter<Pokemon> = new EventEmitter();

  basicCardClicked() {
    this.goToDetailEventEmitter.emit(this.pokemon);
  }
}
