import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../../shared-components/dialog/dialog.component';
import { ThemeService } from 'src/app/services/theme.service';
import { MobileService } from 'src/app/services/mobile.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SameUnameAndPassErrorStateMatcher } from 'src/app/common/utils';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserAuthService: jasmine.SpyObj<UserAuthService>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockMobileService: jasmine.SpyObj<MobileService>;
  let mockSnackBarService: jasmine.SpyObj<SnackBarService>;  // Added mock service


  beforeEach(waitForAsync(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserAuthService = jasmine.createSpyObj('UserAuthService', ['signup']);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['spin', 'stop']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockThemeService = jasmine.createSpyObj('ThemeService', ['logoPathSub$']);
    mockMobileService = jasmine.createSpyObj('MobileService', ['isMobileSub$']);
    mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);  // Added mock service


    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserAuthService, useValue: mockUserAuthService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: MobileService, useValue: mockMobileService },
        { provide: SnackBarService, useValue: mockSnackBarService },  // Added provider
        FormGroupDirective,  // Add this provider for template-driven form validation
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission when the form is valid', () => {
    // Arrange
    component.signupForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
    });

    mockUserAuthService.signup.and.returnValue(of({ status: 200, message: 'Account created successfully', data: {token: "token123"} }));

    // Act
    component.onSubmit();

    // Assert
    expect(mockSpinnerService.spin).toHaveBeenCalled();
    expect(mockUserAuthService.signup).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpassword');
    expect(mockSpinnerService.stop).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['about']);
  });

  it('should handle form submission when the form is invalid', () => {
    // Arrange
    component.signupForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: '', // Invalid password
    });

    // Act
    component.onSubmit();

    // Assert
    expect(mockSpinnerService.spin).not.toHaveBeenCalled();
    expect(mockUserAuthService.signup).not.toHaveBeenCalled();
    expect(mockSpinnerService.stop).not.toHaveBeenCalled();
    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should open dialog with error information when signup fails', () => {
    // Arrange
    component.signupForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
    });

    const errorResponse = {
      status: 500,
      error: { message: 'Internal Server Error' },
    };

    mockUserAuthService.signup.and.returnValue(throwError(errorResponse));

    // Act
    component.onSubmit();

    // Assert
    expect(mockSpinnerService.spin).toHaveBeenCalled();
    expect(mockUserAuthService.signup).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpassword');
    expect(mockSpinnerService.stop).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Navigation should not happen on failure
  });

  // Add more test cases for other functionalities and edge cases

});
