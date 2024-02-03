import { TestBed } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { RestService } from '../services/rest.service';

describe('LoginGuard', () => {
  let guard: LoginGuard;

  const spy = jasmine.createSpyObj('RestService', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: RestService, useValue: spy },
      ],
    });
    guard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
