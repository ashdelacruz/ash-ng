import { TestBed } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { RestService } from './rest.service';
import { AuthorityTypes, RoleStrings, UserSessionData } from '../interfaces/user-session';

describe('UserSessionService', () => {
  let service: UserSessionService;
  let restServiceSpy: jasmine.SpyObj<RestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RestService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        UserSessionService,
        { provide: RestService, useValue: spy },
      ],
    });
    service = TestBed.inject(UserSessionService);
    restServiceSpy = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clean', () => {
    it('should clear sessionStorage', () => {
      spyOn(window.sessionStorage, 'clear');

      service.clean();

      expect(window.sessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('setUser', () => {
    it('should set user and authority in sessionStorage', () => {
      spyOn(window.sessionStorage, 'removeItem');
      spyOn(window.sessionStorage, 'setItem');

      const user: UserSessionData = { id: '1', username: 'test', email: 'test@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 };

      service.setUser(user);

      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('auth-user');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('auth-user', JSON.stringify(user));

      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('authority');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('authority', AuthorityTypes.ROLE_USER);
    });
  });

  // Add more test cases for other methods and properties

  // describe('getPublicContent', () => {
  //   it('should call restService.get with the correct URL', () => {
  //     const expectedUrl = 'http://localhost:80/api/test/all';

  //     restServiceSpy.get.and.returnValue({ subscribe: () => {} });

  //     service.getPublicContent();

  //     expect(restServiceSpy.get).toHaveBeenCalledWith(expectedUrl, {}, {}, 'text');
  //   });
  // });

  // Add more test cases for other methods that call restService.get

  // You may want to add tests for methods like getUser, getHighestAuthority, isAuthenticated, etc.

});
