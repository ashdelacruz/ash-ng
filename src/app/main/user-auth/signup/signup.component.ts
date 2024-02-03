import {
	Component
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { noop } from 'rxjs';
import { SameUnameAndPassErrorStateMatcher, passwordFieldErrorText, passwordValidatorPattern, removeSpacesInput, usernameOrEmailFieldErrorText, usernameValidatorPattern } from 'src/app/common/utils';
import { DialogType } from 'src/app/interfaces/dialog';
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
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
	signupForm = this.fb.group({
		email: ['', [
			Validators.required,
			Validators.minLength(6),
			Validators.maxLength(254),
			Validators.email]],
		username: ['', [
			Validators.required,
			Validators.minLength(3),
			Validators.maxLength(50),
			Validators.pattern(usernameValidatorPattern)]],
		password: ['', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(50),
			Validators.pattern(passwordValidatorPattern)]]
	});
	sameUnameAndPassValidator: ValidatorFn;
	sameUnameAndPassMatcher = new SameUnameAndPassErrorStateMatcher();

	showSpinner: boolean = false;
	isDarkMode: boolean;
	isMobile: boolean;
	isHidePassword: boolean = true;
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
		//-------Form setup-------
		this.sameUnameAndPassValidator = (group: AbstractControl): ValidationErrors | null => {
			let uname = this.f.username.value;
			let pass = this.f.password.value;
			return uname === pass ? { sameUnameAndPass: true } : null;
		};
		this.signupForm.addValidators(this.sameUnameAndPassValidator);


		this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

		this.mobileService.isMobileSub$.subscribe(isMobile => {
			this.isMobile = isMobile;
		});
	}



	//-------Utils-------
	get f() {
		return this.signupForm.controls;
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
		if (this.signupForm.invalid) {
			this.signupForm.controls.username.markAsDirty();
			this.signupForm.controls.email.markAsDirty();
			this.signupForm.controls.password.markAsDirty();
		} else {
			// if(!this.spinnerService.isSpinning) {
			// 	this.spinnerService.spin();
			// }
			this.spinnerService.spin();

			let userString: string = this.f.username.value!;
			let emailString: string = this.f.email.value!;
			let passString: string = this.f.password.value!;

			this.userAuthService
				.signup(userString, emailString, passString)
				.subscribe({
					next: resp => {
						// if(this.spinnerService.isSpinning) {
						// 	this.spinnerService.stop();
						// }
						this.spinnerService.stop();
						this.openDialog(resp.message, 'You will receive an email when your account request has been approved');
					},
					error: err => {
						this.spinnerService.stop();

						console.log("err=", err);

						this.openDialog(undefined, undefined, err);
					}

				});


		}
	}

	/**
	 * If Request Account Failed, stay on /signup page
	 * Else if Request Account Success, navigate to /about page
	 * @param dialogHeader 
	 * @param dialogBody 
	 * @param err 
	 */
	openDialog(dialogHeader?: string, dialogBody?: string, err?: any): void {
		this.dialog.open(DialogComponent, {
			data: {
				dialogTitle: 'Request Account ' + (err ? 'Error' : 'Success'),
				dialogText: [
					{
						header: dialogHeader ?? 'Error ' + err.status,
						body: dialogBody ?? err.error.message,
					},
				],
				cancelButtonLabel: 'Close',
				dialogType: DialogType.BASIC,
				callbackMethod: () => { },
			},
		}).afterClosed().subscribe(() => {
			err === undefined ? this.router.navigate(["about"]) : noop();
		});
	}

}
