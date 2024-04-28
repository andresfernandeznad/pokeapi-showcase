import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: true,
  name: 'pokeId'
})
export class PokeIdPipe implements PipeTransform {
  transform(value: number): string {
    if (value) return value.toString().padStart(4, '0');
    return ''
  }
}
