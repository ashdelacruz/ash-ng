import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { of } from 'rxjs';
import { UserModService, UserModActions } from './user-mod.service';
import { RestService } from './rest.service';
import { SpinnerService } from './spinner.service';
import { UserSessionService } from './user-session.service';
import { AuthorityTypes, RoleStrings } from '../interfaces/user-session';

describe('UserModService', () => {
  let userModService: UserModService;
  let restServiceMock: jasmine.SpyObj<RestService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let spinnerServiceMock: jasmine.SpyObj<SpinnerService>;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    const restSpy = jasmine.createSpyObj('RestService', ['get', 'post', 'put', 'delete']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['spin', 'stop']);
    const userSessionServiceSpy = jasmine.createSpyObj('UserSessionService', ['isModSession', 'isAdminSession']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserModService,
        { provide: RestService, useValue: restSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: UserSessionService, useValue: userSessionServiceSpy },
      ],
    });

    userModService = TestBed.inject(UserModService);
    restServiceMock = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
    dialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    spinnerServiceMock = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
    userSessionServiceMock = TestBed.inject(UserSessionService) as jasmine.SpyObj<UserSessionService>;
  });

  it('should be created', () => {
    expect(userModService).toBeTruthy();
  });

  describe('getAllUsersList', () => {
    it('should return observable with user list for demo mode', () => {
      userSessionServiceMock.isModSession.and.returnValue(false);
      userSessionServiceMock.isAdminSession.and.returnValue(false);
      restServiceMock.get.and.returnValue(of({ status: 200, message: 'request successful', data: { users: [] } }));

      userModService.getAllUsersList().subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('request successful');
        expect(response.data.users).toEqual([]);
      });
    });

    it('should return observable with user list for non-demo mode', () => {
      userSessionServiceMock.isModSession.and.returnValue(true);
      userSessionServiceMock.isAdminSession.and.returnValue(true);
      restServiceMock.get.and.returnValue(of({ status: 200, message: 'request successful', data: { users: [] } }));

      userModService.getAllUsersList().subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('request successful');
        expect(response.data.users).toEqual([]);
      });
    });
  });

  describe('resendAccountActivationLink', () => {
    it('should resend account activation link for demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
      userSessionServiceMock.isModSession.and.returnValue(false);
      userSessionServiceMock.isAdminSession.and.returnValue(false);
      restServiceMock.post.and.returnValue(of({ status: 200, message: 'Successfully resent account activation email', data: { users: userIDs } }));

      userModService.resendAccountActivationLink(userIDs).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Successfully resent account activation email');
        expect(response.data.users).toEqual(userIDs);
      });
    });

    it('should resend account activation link for non-demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
       userSessionServiceMock.isModSession.and.returnValue(true);
      userSessionServiceMock.isAdminSession.and.returnValue(true);
      restServiceMock.post.and.returnValue(of({ status: 200, message: 'Successfully resent account activation email', data: { users: userIDs } }));

      userModService.resendAccountActivationLink(userIDs).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Successfully resent account activation email');
        expect(response.data.users).toEqual(userIDs);
      });
    });
  });

  describe('setUserRole', () => {
    it('should set user role for demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
       const newRole = AuthorityTypes.ROLE_USER;
      userSessionServiceMock.isModSession.and.returnValue(false);
      userSessionServiceMock.isAdminSession.and.returnValue(false);
      restServiceMock.put.and.returnValue(of({ status: 200, message: `Successfully set ${newRole} for user(s)`, data: { users: userIDs } }));

      userModService.setUserRole(userIDs, newRole).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe(`Successfully set ${newRole} for user(s)`);
        expect(response.data.users).toEqual(userIDs);
      });
    });

    it('should set user role for non-demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
      const newRole = AuthorityTypes.ROLE_USER;
      userSessionServiceMock.isModSession.and.returnValue(true);
      userSessionServiceMock.isAdminSession.and.returnValue(true);
      restServiceMock.put.and.returnValue(of({ status: 200, message: `Successfully set ${newRole} for user(s)`, data: { users: userIDs } }));

      userModService.setUserRole(userIDs, newRole).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe(`Successfully set ${newRole} for user(s)`);
        expect(response.data.users).toEqual(userIDs);
      });
    });
  });

  describe('setUserStatus', () => {
    it('should set user status for demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
      const newStatus = 1;
      userSessionServiceMock.isModSession.and.returnValue(false);
      userSessionServiceMock.isAdminSession.and.returnValue(false);
      restServiceMock.put.and.returnValue(of({ status: 200, message: `Successfully activated user(s)`, data: { users: userIDs } }));

      userModService.setUserStatus(userIDs, newStatus).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe(`Successfully activated user(s)`);
        expect(response.data.users).toEqual(userIDs);
      });
    });

    it('should set user status for non-demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
     const newStatus = 0;
      userSessionServiceMock.isModSession.and.returnValue(true);
      userSessionServiceMock.isAdminSession.and.returnValue(true);
      restServiceMock.put.and.returnValue(of({ status: 200, message: `Successfully deactivated user(s)`, data: { users: userIDs } }));

      userModService.setUserStatus(userIDs, newStatus).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe(`Successfully deactivated user(s)`);
        expect(response.data.users).toEqual(userIDs);
      });
    });
  });

  describe('deleteUsers', () => {
    it('should delete users for demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
      userSessionServiceMock.isModSession.and.returnValue(false);
      userSessionServiceMock.isAdminSession.and.returnValue(false);
      restServiceMock.delete.and.returnValue(of({ status: 200, message: 'Successfully deleted user(s)', data: { users: [] } }));

      userModService.deleteUsers(userIDs).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Successfully deleted user(s)');
        expect(response.data.users).toEqual([]);
      });
    });

    it('should delete users for non-demo mode', () => {
      const userIDs = [{ id: '1', username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }, 
      { id: '2', username: 'test2', email: 'test2@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0 }];
      userSessionServiceMock.isModSession.and.returnValue(true);
      userSessionServiceMock.isAdminSession.and.returnValue(true);
      restServiceMock.delete.and.returnValue(of({ status: 200, message: 'Successfully deleted user(s)', data: { users: [] } }));

      userModService.deleteUsers(userIDs).subscribe(response => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Successfully deleted user(s)');
        expect(response.data.users).toEqual([]);
      });
    });
  });

  describe('validateUserModAction', () => {
    it('should validate user mod action with no selected users', () => {
      spyOn(userModService, 'openNoUserDialog');
      userModService.validateUserModAction(UserModActions.APPROVE);
      expect(userModService.openNoUserDialog).toHaveBeenCalled();
    });

    it('should validate user mod action with too many selected users', () => {
      spyOn(userModService, 'openTooManySelectedUsersDialog');
      userModService.selectedUsers = Array.from({ length: 11 }, (_, index) => ({ id: index.toString(), username: 'test1', email: 'test1@email.com', status: 1, roleString: RoleStrings.USER, authorities: [], lastLogin: "yesterday", passwordAttempts: 0  }));
      userModService.validateUserModAction(UserModActions.APPROVE);
      expect(userModService.openTooManySelectedUsersDialog).toHaveBeenCalled();
    });

    // Add more test cases for different scenarios in validateUserModAction

  });



});
