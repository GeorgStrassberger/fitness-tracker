import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange$ = new Subject<boolean>();
  private user: User | null = null;

  constructor(private router: Router) {}

  /**
   * create a new user with valid data.
   * for now with offline dummy data
   * @param authData
   */
  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), // fake UID for now
    };
    this.authSuccesfully();
  }

  /**
   * access for the user with valid data.
   * for now with offline dummy data
   * @param authData
   */
  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), // fake UID for now
    };
    this.authSuccesfully();
  }

  /**
   * logout the current user.
   * set it to null,
   * change the authenticate status,
   * navigate back to login
   */
  logout(): void {
    this.user = null;
    this.authChange$.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * get a copy of the current user
   * @returns
   */
  getUser() {
    return { ...this.user };
  }

  /**
   * user is authenticate or not
   * @returns boolean
   */
  isAuth(): boolean {
    return this.user != null;
  }

  /**
   * Outsource code duplication
   * change the authenticate status,
   * navigate to training
   */
  private authSuccesfully(): void {
    this.authChange$.next(true);
    this.router.navigate(['/training']);
  }
}
