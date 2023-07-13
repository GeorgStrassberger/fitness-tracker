import { Injectable, OnDestroy, inject } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  Auth,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private afauth: Auth = inject(Auth);
  authStateSubscription!: Subscription;

  authChange$ = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  email: string = 'tester@testmail.de';
  password: string = 'qweasd';

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListerner(): void {
    this.authStateSubscription = authState(this.afauth).subscribe((aUser) => {
      if (aUser) {
        this.isAuthenticated = true;
        this.authChange$.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscription();
        this.authChange$.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  /**
   * create a new user with valid data.
   * for now with offline dummy data
   * @param authData
   */
  registerUser(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(
      this.afauth,
      authData.email,
      authData.password
    )
      .then((result: UserCredential): void => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, 'OK', 4000);
      });
  }

  /**
   * access for the user with valid data.
   * for now with offline dummy data
   * @param authData
   */
  login(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true);

    signInWithEmailAndPassword(this.afauth, authData.email, authData.password)
      .then((result: UserCredential): void => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, 'OK', 4000);
      });
  }

  /**
   * i need to add a gastLogin to try out this method
   */
  gastLogin(): void {
    signInAnonymously(this.afauth);
  }

  /**
   * logout the current user.
   */
  logout(): void {
    signOut(this.afauth);
  }

  /**
   * user is authenticate or not
   * @returns boolean
   */
  isAuth(): boolean {
    return this.isAuthenticated;
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }
}
