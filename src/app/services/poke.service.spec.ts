import { TestBed } from '@angular/core/testing';

import { PokeService } from './poke.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('PokeService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
  let service: PokeService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.runInInjectionContext(() => {
      service = new PokeService(httpClientSpy, snackbarSpy);
    })
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPokemonList should return a value', () => {
    const mockResponse = { results: ['pokemon1', 'pokemon2'] };
    httpClientSpy.get.and.returnValue(of(mockResponse))
    const offset = 0;
    const limit = 10;

    service.getPokemonList(offset, limit).subscribe(data => {
      expect(data).toEqual(mockResponse.results);
    });
  });

  it('getAllPokemonlist should return a value', (done: DoneFn) => {
    const mockResponse =  {results: ['pokemon1', 'pokemon2']}
    httpClientSpy.get.and.returnValue(of(mockResponse))

    service.getAllPokemonList().subscribe(data => {
      expect(data).toEqual(mockResponse.results);
      done();
    });
  });

  it('getPokemonList should return an empty list when an error comes', () => {
    httpClientSpy.get.and.returnValue(throwError(() => new Error()))
    const offset = 0;
    const limit = 10;

    service.getPokemonList(offset, limit).subscribe(data => {
      expect(data).toEqual([]);
    });
  });

  it('getPokemonDetail should return a value', () => {
    const mockResponse = { name: 'test', image: 'image' };
    httpClientSpy.get.and.returnValue(of(mockResponse))
    const mockName = 'name';

    service.getPokemonDetail(mockName).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('getPokemonDetail should return an empty object when an error comes', () => {
    httpClientSpy.get.and.returnValue(throwError(() => new Error()))
    const mockName = 'name';

    service.getPokemonDetail(mockName).subscribe(data => {
      expect(data).toEqual({});
    });
  });

  it('searchPokemonByName should return a value', () => {
    const mockResponse = [{ name: 'test', image: 'image' }, { name: 'test', image: 'image' }];
    spyOn(service, 'getAllPokemonList').and.returnValue(of(mockResponse));
    const mockName = 'te';

    service.searchPokemonByName(mockName).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('searchPokemonByName should return an empty array when an error comes', () => {
    spyOn(service, 'getAllPokemonList').and.returnValue(throwError(() => new Error()));
    const mockName = 'te';

    service.searchPokemonByName(mockName).subscribe(data => {
      expect(data).toEqual([]);
    });
  });

  it('searchPokemonByName should return an empty array when nothing is found', () => {
    const mockResponse = [{ name: 'test', image: 'image' }, { name: 'test', image: 'image' }];
    spyOn(service, 'getAllPokemonList').and.returnValue(of(mockResponse));
    const mockName = 'aaaa';

    service.searchPokemonByName(mockName).subscribe(data => {
      expect(data).toEqual([]);
    });
  });
});
