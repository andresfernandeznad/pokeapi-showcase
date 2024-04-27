import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeDetailComponent } from './poke-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('PokeDetailComponent', () => {
  let component: PokeDetailComponent;
  let fixture: ComponentFixture<PokeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeDetailComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
