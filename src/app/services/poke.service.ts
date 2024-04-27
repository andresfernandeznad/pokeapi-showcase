import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  errorNotificationMessage = signal<{message: string, timestamp: number}>({
    message: '',
    timestamp: Date.now()
  });

  addErrorNotificationMessage(errorMessage: string) {
    this.errorNotificationMessage.set({message: errorMessage, timestamp: Date.now()});
  }

  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) {
    effect(() => {
      if (this.errorNotificationMessage().message)
        this._snackBar.open(this.errorNotificationMessage().message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
    });
  }

  getPokemonList(offset: number, limit: number): Observable<any> {
    return this._http
      .get(`${this.apiUrl}?offset=${offset}&limit=${limit}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching pokemon', error);
          this.addErrorNotificationMessage('Something went wrong while fetching the pokemon list. Please try again later.');
          return of([]);
        })
      );
  }

  getPokemonDetail(name: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/${name}`).pipe(
      catchError((error) => {
        console.error(
          `Error fetching pokemon detail for ${name}:`,
          error
        );
        this.addErrorNotificationMessage(`Something went wrong while fetching details for ${name}. Please try again later.`);
        return of({});
      })
    );
  }

  getAllPokemonList(): Observable<any[]> {
    return this._http.get(`${this.apiUrl}?limit=1000`).pipe(
      map((response: any) => response.results)
    );
  }

  searchPokemonByName(pokemonNameSearchQuery: string): Observable<any[]> {
    return this.getAllPokemonList().pipe(
      map((pokemon: any[]) =>
        pokemon.filter((pokemon) =>
          pokemon.name.startsWith(pokemonNameSearchQuery)
        )
      ),
      catchError((error) => {
        console.error(
          `Error fetching pokemon ${pokemonNameSearchQuery}:`,
          error
        );
        this.addErrorNotificationMessage(`Something went wrong while fetching a pokemon list for ${pokemonNameSearchQuery}. Please try again later.`);
        return of([]);
      })
    );
  }
}
