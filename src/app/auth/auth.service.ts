import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private user?: User | null;

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), // fake UID for now
    };
    this.authChange.next(true);
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), // fake UID for now
    };
    this.authChange.next(true);
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
  }

  getUser() {
    return { ...this.user }; // return a copy of user
  }

  isAuth() {
    return this.user != null;
  }
}