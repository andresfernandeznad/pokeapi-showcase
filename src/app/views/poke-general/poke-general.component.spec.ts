import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeGeneralComponent } from './poke-general.component';

describe('PokeGeneralComponent', () => {
  let component: PokeGeneralComponent;
  let fixture: ComponentFixture<PokeGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeGeneralComponent]
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
