import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Exponer al mundo exterior
  currentUser = computed(() => this._currentUser());
  authStatus = computed(() => this._authStatus());

  constructor() { }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true
    
  }

  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email: email, password: password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        tap(({ user, token }) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
          // console.log({ user, token });
        }),
        map(() => true),
        catchError(err => {
          console.log(err);
          return throwError(() => err.error.message);
        })
      )

  }

  checkAuthStatus(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) return of(false)

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ token, user }) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
          return true;
        }),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      )

    // return of(true);

  }




}
