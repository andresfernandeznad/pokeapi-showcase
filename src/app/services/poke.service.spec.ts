import { TestBed } from '@angular/core/testing';

import { PokeService } from './poke.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
});
