import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authority, AuthorityTypes, RoleStrings, UserSessionData, getPrimaryAuthority } from '../interfaces/user-session';
import { RestService } from './rest.service';
import { EnvironmentService } from 'src/environments/environment.service';

const USER_KEY: string = 'auth-user';
const AUTH_KEY: string = 'authority-level';
const TEST_PATH: string = '/api/test';



@Injectable({
	providedIn: 'root'
})
export class UserSessionService {

	private TEST_URL = "";

	constructor(
		private restService: RestService,
		private environmentService: EnvironmentService
	) { 
		this.TEST_URL = this.environmentService.backendUrl + TEST_PATH;

	}


	clean(): void {
		window.sessionStorage.clear();
	}

	setUser(user: UserSessionData, token?: string): void {
		window.sessionStorage.removeItem(USER_KEY);
		window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

		window.sessionStorage.removeItem(AUTH_KEY);

		if (user.roleString === RoleStrings.ADMIN) {
			window.sessionStorage.setItem(AUTH_KEY, AuthorityTypes.ROLE_ADMIN);
		} else if (user.roleString === RoleStrings.MODERATOR) {
			window.sessionStorage.setItem(AUTH_KEY, AuthorityTypes.ROLE_MODERATOR);
		} else if (user.roleString === RoleStrings.USER) {
			window.sessionStorage.setItem(AUTH_KEY, AuthorityTypes.ROLE_USER);
		} else if (user.roleString === RoleStrings.GUEST) {
			window.sessionStorage.setItem(AUTH_KEY, AuthorityTypes.ROLE_GUEST);
		}


	}

	getUser(): UserSessionData {
		const user = sessionStorage.getItem(USER_KEY);
		return user ? JSON.parse(user) : {};
	}


	getHighestAuthority(): string {
		const authority = sessionStorage.getItem(AUTH_KEY);
		return authority ? authority : "";
	}

	getAllAuthorities(): Authority[] {
		return this.getUser().authorities;
	}

	getSessionPrimaryRole(): AuthorityTypes {
		return getPrimaryAuthority(this.getUser().authorities);
	}

	isAdminSession(): boolean {
		return this.getHighestAuthority() === AuthorityTypes.ROLE_ADMIN;
	}
	isModSession(): boolean {
		return this.isAdminSession() || this.getHighestAuthority() === AuthorityTypes.ROLE_MODERATOR;
	}
	isUserSession(): boolean {
		return this.isAdminSession() || this.isModSession() || this.getHighestAuthority() === AuthorityTypes.ROLE_USER;
	}
	isGuestSession(): boolean {
		return this.isAdminSession() || this.isModSession() || this.isUserSession() || this.getHighestAuthority() === AuthorityTypes.ROLE_GUEST;
	}

	/* istanbul ignore next */
	isAuthenticated(): boolean {
		const user = sessionStorage.getItem(USER_KEY);
		const authority = sessionStorage.getItem(AUTH_KEY);

		return (user != null && authority != "");
	}


	//For testing API authorizations during development
	/* istanbul ignore next */
	getPublicContent(): Observable<any> {
		return this.restService.get(this.TEST_URL + '/all', {}, {}, 'text');
	}

	/* istanbul ignore next */
	getUserBoard(): Observable<any> {
		return this.restService.get(this.TEST_URL + '/user', {}, {}, 'text');
	}

	/* istanbul ignore next */
	getModeratorBoard(): Observable<any> {
		return this.restService.get(this.TEST_URL + '/mod', {}, {}, 'text');
	}

	/* istanbul ignore next */
	getAdminBoard(): Observable<any> {
		return this.restService.get(this.TEST_URL + '/admin', {}, {}, 'text');
	}

}
