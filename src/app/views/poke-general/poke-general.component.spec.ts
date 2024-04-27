import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeGeneralComponent } from './poke-general.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PokeService } from '../../services/poke.service';
import { of } from 'rxjs';

describe('PokeGeneralComponent', () => {
  let component: PokeGeneralComponent;
  let fixture: ComponentFixture<PokeGeneralComponent>;
  let pokeServiceSpy = jasmine.createSpyObj('PokeService', [
    'getPokemonList',
    'searchPokemonByName',
    'getPokemonDetail',
  ]);

  let httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeGeneralComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
        { provide: PokeService, useValue: pokeServiceSpy },
      ],
    }).compileComponents();

    pokeServiceSpy = TestBed.inject(PokeService) as jasmine.SpyObj<PokeService>;
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    fixture = TestBed.createComponent(PokeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit with default data for pokemonList', (done: DoneFn) => {
    const mockNotMapped = {
      results: [
        {
          name: 'test',
          image: 'image',
          sprites: {
            other: { ['official-artwork']: { front_default: 'image' } },
          },
        },
        {
          name: 'test',
          image: 'image',
          sprites: {
            other: { ['official-artwork']: { front_default: 'image' } },
          },
        },
      ],
    };
    const mockResponse = [
      {
        name: 'test',
        image: 'image',
        sprites: {
          other: { ['official-artwork']: { front_default: 'image' } },
        },
      },
      {
        name: 'test',
        image: 'image',
        sprites: {
          other: { ['official-artwork']: { front_default: 'image' } },
        },
      },
    ];
    pokeServiceSpy.searchPokemonByName.and.returnValue(of([]));
    pokeServiceSpy.getPokemonList.and.returnValue(of(mockResponse));
    pokeServiceSpy.getPokemonDetail.and.returnValue(of(mockResponse[0]));
    fixture.detectChanges(); // onInit()

    component.pokemonList$?.subscribe((pokemonList) => {
      expect(pokemonList.length > 0).toBe(true);
      done();
    });
  });

  it('pokemon search value changed', () => {
    const mockResponse = [
      { name: 'test', image: 'image' },
      { name: 'test', image: 'image' },
    ];
    pokeServiceSpy.searchPokemonByName.and.returnValue(of(mockResponse));
    component.pokemonSearchValueChange('test');
    expect(component.isInfiniteScrollActivated).toBe(false);
  });

  it('reset pokemon input value', () => {
    component.pokemonSearchValue = 'test data';
    expect(component.pokemonSearchValue).not.toBe('');
    component.resetPokemonInputValue();
    expect(component.pokemonSearchValue).toBe('');
    expect(component.isInfiniteScrollActivated).toBe(true);
  });
});
