import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeGeneralComponent } from './poke-general.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('PokeGeneralComponent', () => {
  let component: PokeGeneralComponent;
  let fixture: ComponentFixture<PokeGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeGeneralComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
