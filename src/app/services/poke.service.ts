import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private _http: HttpClient) {}

  getPokemonList(offset: number, limit: number): Observable<any> {
    return this._http.get(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemonDetail(name: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/${name}`);
  }
}
