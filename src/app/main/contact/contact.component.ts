import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { noop } from 'rxjs';
// import { removeSpacesInput, usernameOrEmailFieldErrorText } from 'src/app/common/utils';
// import { DialogType } from 'src/app/interfaces/dialog';
import { MobileService } from 'src/app/services/mobile.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { DialogComponent } from '../shared-components/dialog/dialog.component';

//Removes spaces when text is pasted into a field
export function removeSpacesInput(event: any) {
	event.target.value = event.target.value.replace(/\s/g, '');
}

export function usernameOrEmailFieldErrorText(fieldName: string, field: FormControl) {

	let errorText = fieldName + ' invalid';

	if (field.errors) {
		if (field.errors['required']) {
			errorText = fieldName + ' is required'
		} else if (field.errors['minlength']) {
			errorText = fieldName + ' is too short'
		} else if (field.errors['email']) {
			errorText = fieldName + ' is invalid'
		} else if (field.errors['maxlength']) {
			errorText = fieldName + ' is too long'
		} else if (field.errors['pattern']) {
			errorText = fieldName + ' contains invalid characters'
		}

	}

	return errorText;
}

export enum DialogType {
    LOGIN,
    BASIC, 
    APPROVE_USER,
    CONTACT,
    USER_MOD_ACTION,
    MULTIPLE_USER_MOD_ACTION
  }

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

	contactForm = this.fb.group({
		name: ['', [
			Validators.required,
			Validators.maxLength(50)]],
		email: ['', [
			Validators.required,
			Validators.minLength(6),
			Validators.maxLength(254),
			Validators.email]],
		message: ['', [
			Validators.required]]
	});

	showSpinner: boolean = false;
	isDarkMode: boolean;
	isMobile: boolean;
	isHidePassword: boolean = true;
	logoPath: string;
	darkModeLogoPath: string;
	authUserName: string | null = null;
	authUserEmail: string | null = null;
	testValue: string = "testjubg,,,";

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private userAuthService: UserAuthService,
		private snackbarService: SnackBarService,
		public dialog: MatDialog,
		private themeService: ThemeService,
		private mobileService: MobileService,
		private session: UserSessionService,
		private spinnerService: SpinnerService
	) {
		this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

		this.mobileService.isMobileSub$.subscribe(isMobile => {
			this.isMobile = isMobile;
		});


		if (this.session.isAuthenticated()) {
			this.authUserName = this.session.getUser().username;
			this.f.name.setValue(this.session.getUser().username);
			this.f.name.disable();

			this.authUserEmail = this.session.getUser().email;
			this.f.email.setValue(this.session.getUser().email);
			this.f.email.disable();
		}



	}


	ngOnInit() {
	}


	get f() {
		return this.contactForm.controls;
	}

	unameFieldErrorText(field: FormControl) {
		return usernameOrEmailFieldErrorText('Username', field);
	}

	emailFieldErrorText(field: FormControl) {
		return usernameOrEmailFieldErrorText('Email', field);
	}

	removeSpacesInput(event: any) {
		removeSpacesInput(event);
	}

	onSubmit(): void {
		if (this.contactForm.invalid) {
			this.contactForm.controls.name.markAsDirty();
			this.contactForm.controls.email.markAsDirty();
			this.contactForm.controls.message.markAsDirty();
		} else {
			this.spinnerService.spin();

			if (this.f.name.value && this.f.name.value.length > 50) {
				console.log("Contact name is too long, trimming");
				this.f.name.setValue(this.f.name.value.substring(0, 50));
			}

			if (this.f.email.value && this.f.email.value.length > 254) {
				console.log("Contact email is too long, trimming");
				this.f.email.setValue(this.f.email.value.substring(0, 254));
			}

			let nameString: string = this.f.name.value!;
			let emailString: string = this.f.email.value!;
			let messageString: string = this.f.message.value!;


			this.userAuthService
				.conact(nameString, emailString, messageString)
				.subscribe({
					next: resp => {
						this.spinnerService.stop();
						this.openDialog(resp.message, 'Your message has been received. Thank you.');
					},
					error: err => {
						this.spinnerService.stop();
						console.error("err=", err);

						this.openDialog(undefined, undefined, err);
					}

				});


		}
	}

	openDialog(dialogHeader?: string, dialogBody?: string, err?: any): void {
		this.dialog.open(DialogComponent, {
			data: {
				dialogTitle: 'Contact ' + (err ? 'Error' : 'Success'),
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

	onCancel() {

		// this._location.back();
		this.router.navigate(['/settings']);

	}

}
