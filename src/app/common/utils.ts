import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import _ from 'lodash';
import { UserSessionData } from '../interfaces/user-session';

export function isNotEmptyString(value: String | null | undefined) {
	return value && value.trim().length > 0;
}

export function deepCopy(value: any) {
	return _.cloneDeep(value);
}

export let forEach = _.forEach;

/**
 * Checks if the value is an empty object, collection, map, or set.
 * Objects are considered empty if they have no own enumerable string keyed properties.
 * Collections are considered empty if they have a 0 length.
 * Similarly, maps and sets are considered empty if they have a 0 size.
 */
export function isEmpty(value: any) {
	return _.isEmpty(value);
}


/**
 * 
 * @param status 
 * @returns the User status as a friendly name
 */
export function parseStatus(user: UserSessionData): string {

	if(!user.accountNonLocked) {
		return "Locked";
	}

	if(user.enabled) {
		if(user.lastLogin == null && !isEmpty(user.authorities)) {
		  return "Pending Activation";
		} else {
		  return "Enabled";
		}
	  } else {
		if(isEmpty(user.authorities)) {
		  return "Pending Approval";
		} else {
		  return "Disabled";
		}
	  }
}

export let remove = _.remove;

//-------User Auth Form utils

/**
 * Username Requirements
 * -Between 3 and 50 characters long
 * -Can only contain letters, numbers, or the following special characters
 * 	!?@#$%&^:;.,~"`'*+-_=(){}[]<>/\
 */
export let usernameValidatorPattern = /^[a-zA-Z0-9?!@#$%^&*.`~+=\-\_]*$/;

/**
 * Password Requirements
 * -Between 8 and 50 characters long
 * -At least 1 uppercase letter
 * -At least 1 lowercase letter
 * -At least 1 number
 * -At least one of the following special characters:
 * 	!?@#$%&^:;.,~"`'*+-_=(){}[]<>/\
 */
export let passwordValidatorPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!?@#$%^&*:;"',.+=_\-(){\[}\]|\\<>\/])[A-Za-z\d~`!?@#$%^&*:;"',.+=_\-(){\[}\]|\\<>\/]{8,50}$/;

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

export function passwordFieldErrorText(field: FormControl) {
	let errorText = 'Password invalid';
	if (field.errors) {
		if (field.errors['required']) {
			errorText = 'Password  is required'
		} else if (field.errors['minlength']) {
			errorText = 'Password  is too short'
		} else if (field.errors['email']) {
			errorText = 'Password  is invalid'
		} else if (field.errors['maxlength']) {
			errorText = 'Password  is too long'
		} else if (field.errors['pattern']) {
			errorText = 'Password  requirements not met'
		}

	}
	return errorText;
}

//-------Cross field error state matchers-------
export class ConfirmEmailErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('notSame')));
		return !!(control?.touched && (control?.invalid || form?.hasError('emailNotConfirmed')));
	}
}

export class ConfirmUnameErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('notSame')));
		return !!(control?.touched && (control?.invalid || form?.hasError('unameNotConfirmed')));
	}
}

export class ConfirmPassErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('notSame')));
		return !!(control?.touched && (control?.invalid || form?.hasError('passNotConfirmed')));
	}
}

//Username and Password cannot be the same
export class SameUnameAndPassErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('notSame')));
		return !!(control?.touched && (control?.invalid || form?.hasError('sameUnameAndPass')));
	}
}

//New email cannot be current email
export class SameCurrentAndNewEmailErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('sameCurrentAndNewEmail')));
		return !!(control?.touched && (control?.invalid || form?.hasError('sameCurrentAndNewEmail')));
	}
}

//New username cannot be current username
export class SameCurrentAndNewUsernameErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		// const invalidCtrl = !!(control?.dirty && (control?.invalid || form?.hasError('sameCurrentAndNewEmail')));
		return !!(control?.touched && (control?.invalid || form?.hasError('sameCurrentAndNewUsername')));
	}
}