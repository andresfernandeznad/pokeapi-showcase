import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private _http: HttpClient) {}

  getPokemonList(offset: number, limit: number): Observable<any> {
    return this._http.get(`${this.apiUrl}?offset=${offset}&limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching pokemon', error);
        return throwError(() => new Error('Something went wrong while fetching the pokemon list. Please try again later.'));
      }))
  }

  getPokemonDetail(name: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/${name}`).pipe(
      catchError(error => {
        console.error(`Error fetching details for pokemon ${name}:`, error);
        return throwError(() => new Error(`Something went wrong while fetching details for ${name}. Please try again later.`));
      }));
  }

  getAllPokemonList(): Observable<any[]> {
    return this._http.get(`${this.apiUrl}?limit=1000`).pipe(
      map((response: any) => response.results)
    );
  }

  searchPokemonByName(pokemonNameSearchQuery: string): Observable<any[]> {
    return this.getAllPokemonList().pipe(
      map((pokemon: any[]) => pokemon.filter(pokemon => pokemon.name.includes(pokemonNameSearchQuery)))
    );
  }
}
