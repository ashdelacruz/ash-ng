import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSessionData } from '../interfaces/user-session';
import { RestService } from './rest.service';
import { EnvironmentService } from 'src/environments/environment.service';

const AUTH_PATH: string = '/api/auth';

export interface UserAuthRequestBody {
	username?: string;
	email?: string;
	password?: string;

	token?: string;
}

export interface UserAuthResponseBody {
	status: number;
	message: string;
	data: { token: string };
}


@Injectable({
	providedIn: 'root'
})
export class UserAuthService {

	private AUTH_URL = "";

	constructor(
		private restService: RestService,
		private environmentService: EnvironmentService
	) { 
		this.AUTH_URL = this.environmentService.backendUrl + AUTH_PATH;
	}

	conact(name: string, email: string, message: string): Observable<UserAuthResponseBody> {
		return this.restService.post(this.AUTH_URL + '/contact', {
			names: [name],
			emails: [email],
			message: message
		},
			{ 'Content-Type': 'application/json' });
	}

	signup(user: string, email: string, pass: string): Observable<UserAuthResponseBody> {
		return this.restService.post(this.AUTH_URL + '/signup', {
			username: user,
			email: email,
			password: pass
		},
			{ 'Content-Type': 'application/json' });
	}

	login(user: string, pass: string, token?: string): Observable<UserSessionData> {
		let body = token === undefined ? {
			username: user,
			password: pass
		} : 
		{
			username: user,
			password: pass,
			token: token
		};

		return this.restService.post(this.AUTH_URL + "/login", body,
			{ 'Content-Type': 'application/json' }
		);
	}

	logout(): Observable<string> {
		return this.restService.post(this.AUTH_URL + "/logout", {}, {}, {}, 'text');
	}

	forgotCredentials(type: string, email: string): Observable<UserAuthResponseBody> {
		return this.restService.post(this.AUTH_URL + '/forgot/' + type, {
			'email': email
		},
			{ 'Content-Type': 'application/json' },
			{});
	}
	 
	updateCredentials(
		id: string,
		password: string,
		newCreds: any,
		credentialsType: string): Observable<string> {


		return this.restService.put(this.AUTH_URL + "/update/" + credentialsType, {
			id: id,
			password: password,
			...newCreds
		},
			{ 'Content-Type': 'application/json' }
		);
	}

	resetCredentials(token: string,
		newCreds: any,
		credentialsType: string
	): Observable<UserAuthResponseBody> {
		return this.restService.put(this.AUTH_URL + "/reset/" + credentialsType, {
			token: token,
			...newCreds
		},
			{ 'Content-Type': 'application/json' }
		);
	}

	deleteAccount(user: string, pass: string): Observable<UserAuthResponseBody> {
		return this.restService.delete(this.AUTH_URL + "/delete", {
			username: user,
			password: pass
		},
			{ 'Content-Type': 'application/json' }
		);
	}


}
