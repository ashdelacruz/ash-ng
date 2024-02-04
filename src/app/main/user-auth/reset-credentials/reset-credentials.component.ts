import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmEmailErrorStateMatcher, ConfirmPassErrorStateMatcher, ConfirmUnameErrorStateMatcher, SameCurrentAndNewEmailErrorStateMatcher, SameCurrentAndNewUsernameErrorStateMatcher, SameUnameAndPassErrorStateMatcher, passwordFieldErrorText, passwordValidatorPattern, removeSpacesInput, usernameOrEmailFieldErrorText, usernameValidatorPattern } from 'src/app/common/utils';
import { DialogInterface, DialogType } from 'src/app/interfaces/dialog';
import { MobileService } from 'src/app/services/mobile.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { DialogComponent } from '../../shared-components/dialog/dialog.component';


@Component({
  selector: 'app-reset-credentials',
  templateUrl: './reset-credentials.component.html',
  styleUrls: ['./reset-credentials.component.scss']
})
export class ResetCredentialsComponent {

  // @HostListener('window:beforeunload')
  // canDeactivate(): Observable<boolean> | boolean {

  // }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.onCancel();
  }

  //-------Form Vars-------
  resetForm = this.fb.group({
    newEmail: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(254),
      Validators.email]],
    confirmEmail: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(254),
      Validators.email]],
    newUsername: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(usernameValidatorPattern)]],
    confirmUsername: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(usernameValidatorPattern)]],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern(passwordValidatorPattern)]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern(passwordValidatorPattern)]],
    username: ['', [
      Validators.required,
      Validators.maxLength(50)]],
    password: ['', [
      Validators.required,
      Validators.maxLength(50)]]

  });

  confirmEmailValidator: ValidatorFn;
  confirmUnameValidator: ValidatorFn;
  confirmPassValidator: ValidatorFn;
  sameUnameAndPassValidator: ValidatorFn;
  sameCurrentAndNewEmailValidator: ValidatorFn;
  sameCurrentAndNewUsernameValidator: ValidatorFn;

  confirmEmailMatcher = new ConfirmEmailErrorStateMatcher();
  confirmUnameMAtcher = new ConfirmUnameErrorStateMatcher();
  confirmPassMatcher = new ConfirmPassErrorStateMatcher();
  sameUnameAndPassMatcher = new SameUnameAndPassErrorStateMatcher();
  sameCurrentAndNewEmailMatcher = new SameCurrentAndNewEmailErrorStateMatcher();
  sameCurrentAndNewUsernameMatcher = new SameCurrentAndNewUsernameErrorStateMatcher();

  private tokenParam: string;
  changeType: string;
  updateString = 'update';
  resetString = 'reset';
  deleteAccountString = 'delete';


  credentialsType: string;
  emailString = 'email';
  unameString = 'username';
  passString = 'password';
  unameAndPassString = 'username_and_password';


  currentEmail = "";
  currentUsername = "";


  showSpinner: boolean = false;
  isDarkMode: boolean;
  isMobile: boolean;
  isHidePassword: boolean = true;
  isUserAuthenticated: boolean = false;
  logoPath: string;
  darkModeLogoPath: string;

  private dialogTimeoutMS = 3000;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    public dialog: MatDialog,
    private userAuthService: UserAuthService,
    private session: UserSessionService,
    private themeService: ThemeService,
    private mobileService: MobileService,
    private route: ActivatedRoute,
    private _location: Location,
    private userSessionService: UserSessionService,
    private snackBarService: SnackBarService,
    private spinnerService: SpinnerService
  ) {

    this.isUserAuthenticated = this.session.isAuthenticated();

    this.resetForm.reset();


    if (this.isUserAuthenticated) {
      this.currentEmail = this.session.getUser().email;
      this.currentUsername = this.session.getUser().username;
    }

    combineLatest([this.route.url, this.route.queryParams]).subscribe(routeResponses => {

      this.changeType = routeResponses[0][1].path;


      //Updating is for authenticated users, Resetting is for unauthenticated
      // if ((this.changeType === this.updateString || this.changeType === this.deleteAccountString) && !this.isUserAuthenticated) {
      //   this.router.navigate(['/about']);
      // }

      if (this.changeType === this.deleteAccountString) {
        if (!this.session.isAuthenticated()) {
          this.router.navigate(['/about']);


        } else {

          this.f.newEmail.disable();
          this.f.confirmEmail.disable();
          this.f.newUsername.disable();
          this.f.confirmUsername.disable();
          this.f.newPassword.disable();
          this.f.confirmPassword.disable();

          return;
        }

      }

      this.credentialsType = routeResponses[0][2].path;


      if (this.changeType === this.updateString) {
        if (!this.session.isAuthenticated()) {
          this.router.navigate(['/about']);
        } else {
          this.setUpForm();
          return;
        }

      }


      if (this.changeType === this.resetString) {
        this.tokenParam = routeResponses[1]['token'];
        if (this.tokenParam === undefined) {
          this.router.navigate(['/about']);
        } else {
          this.f.password.disable();
          this.setUpForm();
          return;
        }

      }

    });


    this.themeService.logoPathSub$.subscribe(path => {
      this.logoPath = path;
    });

    this.mobileService.isMobileSub$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  setUpForm() {
    //-------Cross Field Validators-------

    this.confirmEmailValidator = (group: AbstractControl): ValidationErrors | null => {
      let newEmail = this.f.newEmail.value;
      let confirmEmail = this.f.confirmEmail.value;
      return newEmail === confirmEmail ? null : { emailNotConfirmed: true }
    }

    this.confirmUnameValidator = (group: AbstractControl): ValidationErrors | null => {
      let newUname = this.f.newUsername.value;
      let confirmUname = this.f.confirmUsername.value;
      return newUname === confirmUname ? null : { unameNotConfirmed: true }
    }

    this.confirmPassValidator = (group: AbstractControl): ValidationErrors | null => {
      let newPass = this.f.newPassword.value;
      let confirmPass = this.f.confirmPassword.value;
      return newPass === confirmPass ? null : { passNotConfirmed: true }
    };

    this.sameUnameAndPassValidator = (group: AbstractControl): ValidationErrors | null => {
      let newUname = this.f.newUsername.value;
      let newPass = this.f.newPassword.value;
      return newUname !== newPass ? null : { sameUnameAndPass: true };
    };

    this.sameCurrentAndNewEmailValidator = (group: AbstractControl): ValidationErrors | null => {
      let newEmail = this.f.newEmail.value;
      return newEmail !== this.currentEmail ? null : { sameCurrentAndNewEmail: true };
    };

    this.sameCurrentAndNewUsernameValidator = (group: AbstractControl): ValidationErrors | null => {
      let newUname = this.f.newUsername.value;
      return newUname !== this.currentUsername ? null : { sameCurrentAndNewUsername: true };
    };

    //-------Form setup-------
    if (this.credentialsType === this.emailString) {
      this.f.newUsername.disable();
      this.f.confirmUsername.disable();
      this.f.newPassword.disable();
      this.f.confirmPassword.disable();
      this.f.username.disable();
      // this.f.password.disable();

      this.resetForm.addValidators([
        this.confirmEmailValidator,
        this.sameCurrentAndNewEmailValidator]);
    } else if (this.credentialsType === this.passString) {
      this.f.newEmail.disable();
      this.f.confirmEmail.disable();
      this.f.newUsername.disable();
      this.f.confirmUsername.disable();
      this.f.username.disable();
      // this.f.password.disable();

      this.resetForm.addValidators([
        this.confirmPassValidator]);
    } else if (this.credentialsType === this.unameString) {
      this.f.newEmail.disable();
      this.f.confirmEmail.disable();
      this.f.newPassword.disable();
      this.f.confirmPassword.disable();
      this.f.username.disable();
      // this.f.password.disable();

      this.resetForm.addValidators([
        this.confirmUnameValidator]);

      if (this.isUserAuthenticated) {
        this.resetForm.addValidators([this.sameCurrentAndNewUsernameValidator]);
      }
    } else if (this.credentialsType === this.unameAndPassString) {
      this.f.newEmail.disable();
      this.f.confirmEmail.disable();
      this.f.username.disable();
      // this.f.password.disable();

      this.resetForm.addValidators([
        this.confirmUnameValidator,
        this.confirmPassValidator,
        this.sameUnameAndPassValidator]);
    } else {
      // this.router.navigate(['/about']);
    }
  }


  //-------Utils-------
  get f() {
    return this.resetForm.controls;
  }

  emailFieldErrorText(field: FormControl) {
    return usernameOrEmailFieldErrorText('Email', field);
  }

  unameFieldErrorText(field: FormControl) {
    return usernameOrEmailFieldErrorText('Username', field);
  }

  passFieldErrorText(field: FormControl) {
    return passwordFieldErrorText(field);
  }

  removeSpacesInput(event: any) {
    removeSpacesInput(event);
  }


  //-------Functionality-------
  onSubmit(): void {

    if (this.changeType === this.deleteAccountString) {
      this.submitDeleteAccount();
    } else if (this.changeType === this.updateString) {
      this.submitUpdateCreds();
    } else {
      this.submitResetCreds();
    }


  }
  submitDeleteAccount() {
    if (this.f.username.value === '') {
      this.f.username.setErrors({ required: true });
      return;
    }

    if (this.f.password.value === '') {
      this.f.password.setErrors({ required: true });
      return;
    }

    if (this.resetForm.valid) {

      let userString: string = this.f.username.value!;
      let passString: string = this.f.password.value!;


      // const dialogObs = this.dialogRef.afterOpened().subscribe(_ => {
      //   setTimeout(() => {
      //      this.dialogRef.close();
      //   }, timeout)
      // })

      this.userAuthService.deleteAccount(userString, passString).subscribe({
        next: resp => {

          this.userSessionService.clean();
          const dialogInterface: DialogInterface = {
            dialogTitle: 'Delete Account',
            dialogText: [
              {
                header: resp.message,
                body: null
              },
            ],
            cancelButtonLabel: 'Close',
            dialogType: DialogType.BASIC,
            dialogTimeoutSeconds: this.dialogTimeoutMS / 1000,
            callbackMethod: () => {
            },
          };
          this.dialogRef = this.dialog.open(DialogComponent, {
            data: dialogInterface,
            disableClose: true
          });

          combineLatest([this.dialogRef.afterOpened(), this.userAuthService.logout()]).subscribe({
            next: responses => {
              setTimeout(() => {
                this.dialogRef.close();
                this.router.navigate(["/about"]);
              }, this.dialogTimeoutMS);

            },
            error: err => {

              console.error("reset-credentials.submitDeleteAccount():: error= ", err);
            }
          })
        },
        error: err => {
          const dialogInterface: DialogInterface = {
            dialogTitle: 'Delete Account Error',
            dialogText: [
              {
                header: 'Error ' + err.status,
                body: "Invalid Credentials"
              },
            ],
            cancelButtonLabel: 'Close',
            dialogType: DialogType.BASIC,
            callbackMethod: () => {
            },
          };
          this.dialog.open(DialogComponent, {
            data: dialogInterface,
          });
        }
      });

    } else {
      console.error('Error - Form invalid: ', this.resetForm.errors);
    }
  }

  submitUpdateCreds() {
    if (this.f.newEmail.value === '') {
      this.f.newEmail.setErrors({ required: true });
      return;
    }

    if (this.f.confirmEmail.value === '') {
      this.f.confirmEmail.setErrors({ required: true });
      return;
    }

    if (this.f.newUsername.value === '') {
      this.f.newUsername.setErrors({ required: true });
      return;
    }

    if (this.f.confirmUsername.value === '') {
      this.f.confirmUsername.setErrors({ required: true });
      return;
    }

    if (this.f.newPassword.value === '') {
      this.f.newPassword.setErrors({ required: true });
      return;
    }

    if (this.f.confirmPassword.value === '') {
      this.f.confirmPassword.setErrors({ required: true });
      return;
    }

    if (this.f.username.value === '') {
      this.f.username.setErrors({ required: true });
      return;
    }

    if (this.f.password.value === '') {
      this.f.password.setErrors({ required: true });
      return;
    }

    if (this.resetForm.valid) {
      this.spinnerService.spin();

      let newEmailValue: string = this.f.newEmail.value!;
      let newUsernameValue: string = this.f.newUsername.value!;
      let newPasswordValue: string = this.f.newPassword.value!;

      let newCreds: object;

      let password: string = this.f.password.value!;

      //Build different request body based on which creds are being reset 
      if (this.credentialsType == this.emailString) {
        newCreds = {
          newEmail: newEmailValue
        }
      } else if (this.credentialsType == this.passString) {
        newCreds = {
          newPassword: newPasswordValue
        }
      } else if (this.credentialsType == this.unameString) {
        newCreds = {
          newUsername: newUsernameValue
        }
      } else if (this.credentialsType == this.unameAndPassString) {
        newCreds = {
          newUsername: newUsernameValue,
          newPassword: newPasswordValue
        }
      } else {
        newCreds = {};
      }

      this.userAuthService
        .updateCredentials(this.session.getUser().id, password, newCreds, this.credentialsType)
        .subscribe({
          next: resp => {
            this.spinnerService.stop();
            if (this.isUserAuthenticated && this.credentialsType !== this.passString) {
              let user = this.session.getUser();
              if (this.credentialsType === this.emailString) {
                user.email = resp;
              } else if (this.credentialsType === this.unameString) {
                user.username = resp;
              }
              this.session.setUser(user);
            }

            this.openResponseDialog(false, resp);

          },
          error: err => {
            this.spinnerService.stop();
            this.openResponseDialog(true, err.error.message);
            console.error("update failed err= ", err);
          }
        });
    } else {
      console.error('Error - Form invalid: ', this.resetForm.errors);
    }
  }

  submitResetCreds() {
    if (this.f.newEmail.value === '') {
      this.f.newEmail.setErrors({ required: true });
      return;
    }

    if (this.f.confirmEmail.value === '') {
      this.f.confirmEmail.setErrors({ required: true });
      return;
    }

    if (this.f.newUsername.value === '') {
      this.f.newUsername.setErrors({ required: true });
      return;
    }

    if (this.f.confirmUsername.value === '') {
      this.f.confirmUsername.setErrors({ required: true });
      return;
    }

    if (this.f.newPassword.value === '') {
      this.f.newPassword.setErrors({ required: true });
      return;
    }

    if (this.f.confirmPassword.value === '') {
      this.f.confirmPassword.setErrors({ required: true });
      return;
    }

    if (this.resetForm.valid) {
      this.spinnerService.spin();

      let newEmailValue: string = this.f.newEmail.value!;
      let newUsernameValue: string = this.f.newUsername.value!;
      let newPasswordValue: string = this.f.newPassword.value!;

      let newCreds: object;

      //Build different request body based on which creds are being reset 
      if (this.credentialsType == this.emailString) {
        newCreds = {
          newEmail: newEmailValue
        }
      } else if (this.credentialsType == this.passString) {
        newCreds = {
          newPassword: newPasswordValue
        }
      } else if (this.credentialsType == this.unameString) {
        newCreds = {
          newUsername: newUsernameValue
        }
      } else if (this.credentialsType == this.unameAndPassString) {
        newCreds = {
          newUsername: newUsernameValue,
          newPassword: newPasswordValue
        }
      } else {
        newCreds = {};
      }

      this.userAuthService
        .resetCredentials(this.tokenParam, newCreds, this.credentialsType,)
        .subscribe({
          next: resp => {
            this.spinnerService.stop();

            //TODO add 3sec timeout snackbar on success
            this.router.navigate(['user-auth/login']);
            this.snackBarService.showInfoSnackbar(resp.message);

          },
          error: err => {
            this.spinnerService.stop();
            this.openResponseDialog(true, err.error.message);
            console.error("reset pass failed err= ", err);
          }
        });
    } else {
      console.error('Error - Form invalid: ', this.resetForm.errors);
    }
  }

  openResponseDialog(isError: boolean, dialogMessage: string) {
    const dialogInterface: DialogInterface = {
      dialogTitle: this.changeType.toUpperCase() + ' ' + this.credentialsType.replaceAll("_", " "),
      dialogText: [
        {
          header: isError ? "Failed" : "Success",
          body: dialogMessage
        },
      ],
      cancelButtonLabel: 'Close',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
        // this.router.navigate([success ? '/user-auth/login' : '/about']);
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    }).afterClosed().subscribe(() => {
      if (!isError) {

        // if(this.isUserAuthenticated) {
        //   this._location.back();
        // }
        this.router.navigate([this.isUserAuthenticated ? "settings" : "user-auth/login"]);
      }
    });
  }

  onCancel() {
    // this._location.back();
    this.router.navigate(['/settings']);

  }
}
