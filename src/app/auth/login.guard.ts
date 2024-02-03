import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSessionData } from '../interfaces/user-session';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
	providedIn: 'root'
})
export class LoginGuard  {
	constructor(
		private userSessionService: UserSessionService,
		private router: Router,
		private ngZone: NgZone
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {

		return true;
	}
}
