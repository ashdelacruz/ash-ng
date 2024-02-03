import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(
    private userSessionService: UserSessionService
  ) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    const user = this.userSessionService.getUser();
    if (user.id) {
      this.userSessionService.setUser(user, token);
    }
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  // public saveUser(user: any): void {
  //   window.sessionStorage.removeItem(USER_KEY);
  //   window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  // }

  // public getUser(): any {
  //   const user = window.sessionStorage.getItem(USER_KEY);
  //   if (user) {
  //     return JSON.parse(user);
  //   }

  //   return {};
  // }
}