import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeDetailComponent } from './poke-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PokeService } from '../../services/poke.service';

describe('PokeDetailComponent', () => {
  let component: PokeDetailComponent;
  let fixture: ComponentFixture<PokeDetailComponent>;
  let pokeServiceSpy = jasmine.createSpyObj('PokeService', [
    'getPokemonDetail',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeDetailComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ name: 'test' }),
          },
        },
        { provide: PokeService, useValue: pokeServiceSpy },
      ],
    }).compileComponents();

    pokeServiceSpy = TestBed.inject(PokeService) as jasmine.SpyObj<PokeService>;
    fixture = TestBed.createComponent(PokeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit with default data for pokemon detail', (done: DoneFn) => {
    const mockResponse = {
      id: 1,
      name: 'test',
      image: 'image',
      sprites: {
        other: { ['official-artwork']: { front_default: 'image' } },
      },
    };
    pokeServiceSpy.getPokemonDetail.and.returnValue(of(mockResponse));
    fixture.detectChanges();
    component.pokemon$.subscribe((pokemon) => {
      expect(pokemon.name).toBe(mockResponse.name);
      done();
    });
  });
});
