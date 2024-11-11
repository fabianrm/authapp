import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.authStatus() === AuthStatus.authenticated) return true;

  // const url = state.url;
  // localStorage.setItem('url', url);

  router.navigateByUrl('/auth/login');

  // console.log('isAuthenticatedGuard');
  // console.log({ route, state });

  return false;
};
