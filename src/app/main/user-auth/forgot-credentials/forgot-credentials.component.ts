import {
  Component
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { removeSpacesInput, usernameOrEmailFieldErrorText } from 'src/app/common/utils';
import { DialogInterface, DialogType } from 'src/app/interfaces/dialog';
import { MobileService } from 'src/app/services/mobile.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { DialogComponent } from '../../shared-components/dialog/dialog.component';

export interface ExistingSession {
  userId: string;
  storeNumber: string;
}
@Component({
  selector: 'app-forgot-credentials',
  templateUrl: './forgot-credentials.component.html',
  styleUrls: ['./forgot-credentials.component.scss'],
})
export class ForgotCredentialsComponent {

  forgotForm = this.fb.group({
    email: ['', [Validators.required,
    Validators.minLength(6),
    Validators.maxLength(254),
    Validators.email]]
  });


  forgotStrings: string[] = ['password', 'username', 'username and password', 'account activation link'];
  forgotLabel = this.forgotStrings[0];


  showSpinner: boolean = false;
  isDarkMode: boolean;
  isMobile: boolean;
  passwordModel: string = '';
  logoPath: string;
  darkModeLogoPath: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userAuthService: UserAuthService,
    private snackbarService: SnackBarService,
    public dialog: MatDialog,
    private themeService: ThemeService,
    private mobileService: MobileService,
    private spinnerService: SpinnerService

  ) {

    this.themeService.logoPathSub$.subscribe(path => {
      this.logoPath = path;
    })

    this.mobileService.isMobileSub$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }


  //-------Utils-------
  get f() {
    return this.forgotForm.controls;
  }

  emailFieldErrorText(field: FormControl) {
    return usernameOrEmailFieldErrorText('Email', field);
  }

  removeSpacesInput(event: any) {
    removeSpacesInput(event);
  }

  //-------Functionality-------
  requestReset(): void {

    if (this.f.email.value === '') {
			this.f.email.setErrors({required: true});
      return;
    }


    if (this.forgotForm.valid) {
      this.spinnerService.spin();
      let emailString: string = this.f.email.value!;


      this.userAuthService.forgotCredentials(this.forgotLabel.replaceAll(' ', '_'), emailString).subscribe({
        next: resp => {
          this.spinnerService.stop();
          this.openResponseDialog(resp.message);
        },
        error: err => {
          this.spinnerService.stop();
          this.openResponseDialog(err.message);
        }
      })
    } else {
      console.error('Error: Form invalid');
    }
  }

  openResponseDialog(dialogMessage: string) {
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Request ' + this.forgotLabel + ' Reset',
      dialogText: [
        {
          header: dialogMessage,
          body: null
        },
      ],
      cancelButtonLabel: 'Close',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
        this.router.navigate(['/home']);
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    }).afterClosed().subscribe(() => {
      this.router.navigate(["/home"]);
    });
  }

}
