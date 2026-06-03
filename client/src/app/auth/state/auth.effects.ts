import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AccountService } from '../../_services/account';
import { likesActions } from '../../likes/state/likes.actions';
import { authActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSubmitted),
      switchMap(({ credentials }) =>
        this.accountService.login(credentials).pipe(
          map(user => authActions.loginSucceeded({ user })),
          catchError(error => of(authActions.loginFailed({ error: normalizeAuthError(error) })))
        )
      )
    );
  });

  persistAuthenticatedUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSucceeded, authActions.currentUserRestored),
      tap(({ user }) => this.accountService.persistCurrentUser(user)),
      mergeMap(() => [
        likesActions.loadLikeIds(),
        likesActions.loadLikes()
      ])
    );
  });

  navigateAfterLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSucceeded),
        tap(() => this.router.navigateByUrl('/members'))
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logoutRequested),
        tap(() => {
          this.accountService.clearPersistedUser();
          this.router.navigateByUrl('/');
        })
      );
    },
    { dispatch: false }
  );

  persistPhotoUpdate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.currentUserPhotoUpdated),
        tap(({ photoUrl }) => this.accountService.updatePersistedCurrentUser({ photoUrl }))
      );
    },
    { dispatch: false }
  );
}

export function normalizeAuthError(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const maybeError = error as { error?: unknown; message?: unknown };

    if (typeof maybeError.error === 'string') return maybeError.error;

    if (maybeError.error && typeof maybeError.error === 'object') {
      const body = maybeError.error as { title?: unknown; message?: unknown };
      if (typeof body.message === 'string') return body.message;
      if (typeof body.title === 'string') return body.title;
    }

    if (typeof maybeError.message === 'string') return maybeError.message;
  }

  return 'Login non riuscito.';
}
