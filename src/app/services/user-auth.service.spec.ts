import { TestBed } from '@angular/core/testing';
import { UserAuthService } from './user-auth.service';
import { RestService } from './rest.service';
import { Observable, of } from 'rxjs';
import { UserSessionData } from '../interfaces/user-session';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let restServiceSpy: jasmine.SpyObj<RestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RestService', ['post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        UserAuthService,
        { provide: RestService, useValue: spy },
      ],
    });
    service = TestBed.inject(UserAuthService);
    restServiceSpy = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('conact', () => {
    it('should call restService.post with the correct URL and body', () => {
      const expectedUrl = 'http://localhost:80/api/auth/contact';
      const expectedBody = {
        names: ['John'],
        emails: ['john@example.com'],
        message: 'Hello',
      };

      restServiceSpy.post.and.returnValue(of({})); // Mock the response

      service.conact('John', 'john@example.com', 'Hello');

      expect(restServiceSpy.post).toHaveBeenCalledWith(expectedUrl, expectedBody, { 'Content-Type': 'application/json' });
    });
  });

  // Add more test cases for other methods and properties

  describe('login', () => {
    it('should call restService.post with the correct URL and body', () => {
      const expectedUrl = 'http://localhost:80/api/auth/login';
      const expectedBody = {
        username: 'john',
        password: 'password',
      };

      restServiceSpy.post.and.returnValue(of({})); // Mock the response

      service.login('john', 'password');

      expect(restServiceSpy.post).toHaveBeenCalledWith(expectedUrl, expectedBody, { 'Content-Type': 'application/json' });
    });

    it('should include token in body if provided', () => {
      const expectedUrl = 'http://localhost:80/api/auth/login';
      const expectedBodyWithToken = {
        username: 'john',
        password: 'password',
        token: 'token123',
      };

      restServiceSpy.post.and.returnValue(of({})); // Mock the response

      service.login('john', 'password', 'token123');

      expect(restServiceSpy.post).toHaveBeenCalledWith(expectedUrl, expectedBodyWithToken, { 'Content-Type': 'application/json' });
    });
  });

  // Add more test cases for other methods that call restService.post

  // You may want to add tests for methods like logout, forgotCredentials, updateCredentials, etc.

});
