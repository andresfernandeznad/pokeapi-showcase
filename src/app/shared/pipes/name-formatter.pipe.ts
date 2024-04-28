import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: true,
  name: 'nameFormatter'
})
export class NameFormatterPipe implements PipeTransform {
  transform(name: string): string {
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    } return ''
  }
}
