import {
	Component,
	Input
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordFieldErrorText, removeSpacesInput, usernameOrEmailFieldErrorText } from 'src/app/common/utils';
import { DialogInterface, DialogType } from 'src/app/interfaces/dialog';
import { MobileService } from 'src/app/services/mobile.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TokenService } from 'src/app/services/token.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserModService } from 'src/app/services/user-mod.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { DialogComponent } from '../../shared-components/dialog/dialog.component';
import { EnvironmentService } from 'src/environments/environment.service';

export interface ExistingSession {
	userId: string;
	storeNumber: string;
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

	@Input() isSessionExpiredLogin: boolean = false;

	loginForm = this.fb.group({
		username: ['', [
			Validators.required,
			Validators.maxLength(50)]],
		password: ['', [
			Validators.required,
			Validators.maxLength(50)]]
	});

	isDarkMode: boolean;
	isMobile: boolean;
	isHidePassword: boolean = true;
	logoPath: string;
	darkModeLogoPath: string;
	token: string;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		// public dialogRef: MatDialogRef<LoginComponent>,
		public dialog: MatDialog,
		private userSessionService: UserSessionService,
		private userAuthService: UserAuthService,
		private snackbarService: SnackBarService,
		private themeService: ThemeService,
		private mobileService: MobileService,
		private tokenService: TokenService,
		private userModService: UserModService,
		private spinnerService: SpinnerService,
		private environmentService: EnvironmentService
	) {

		this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});
		
		this.mobileService.isMobileSub$.subscribe(isMobile => {
			this.isMobile = isMobile;
		});

		this.route.queryParams.subscribe(param => {
			this.token = param['token'];
		});
	}


	//-------Utils-------
	get f() {
		return this.loginForm.controls;
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

		if (this.f.username.value === '') {
			this.f.username.setErrors({required: true});
			return;
		}

		if (this.f.password.value === '') {
			this.f.password.setErrors({required: true});
			return;
		}

		if (this.loginForm.valid) {
			this.spinnerService.spin();

			let userString: string = this.f.username.value!;
			let passString: string = this.f.password.value!;

			this.userAuthService
				.login(userString, passString, this.token)
				.subscribe({
					next: (resp: any) => {
						this.spinnerService.stop();

				
						this.userSessionService.setUser(resp);
						this.tokenService.saveToken(resp.accessToken);
						this.tokenService.saveRefreshToken(resp.refreshToken);
						this.userSessionService.setUser(resp, resp);
						this.userModService.isDemoMode = resp.authorities.length < 3;

						this.router.navigate(["settings"]);
					},
					error: err => {
						this.spinnerService.stop();
						this.f.username.reset();
						this.f.password.reset();

						const dialogInterface: DialogInterface = {
							dialogTitle: 'Login Error',
							dialogText: [
								{
									header: 'Error ' + err.status + ' - ' + err.error.error,
									body: err.error.message
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
			console.error('Error: Form invalid');
		}
	}

}
