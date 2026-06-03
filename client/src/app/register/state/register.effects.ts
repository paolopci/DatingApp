import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AccountService } from '../../_services/account';
import { authActions } from '../../auth/state/auth.actions';
import { registerActions } from './register.actions';

@Injectable()
export class RegisterEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerActions.registerSubmitted),
      // switchMap evita richieste concorrenti obsolete se l'utente invia piu volte il form.
      switchMap(({ request }) =>
        this.accountService.register(request).pipe(
          map(user => registerActions.registerSucceeded({ user })),
          catchError(error => of(registerActions.registerFailed({
            validationErrors: normalizeRegisterErrors(error)
          })))
        )
      )
    );
  });

  navigateAfterRegister$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(registerActions.registerSucceeded),
        tap(() => this.router.navigateByUrl('/members'))
      );
    },
    { dispatch: false }
  );

  syncAuthAfterRegister$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerActions.registerSucceeded),
      map(({ user }) => authActions.loginSucceeded({ user }))
    );
  });
}

export function normalizeRegisterErrors(error: unknown): string[] {
  if (Array.isArray(error)) {
    return error.map(item => String(item));
  }

  if (typeof error === 'string') {
    return [error];
  }

  if (error && typeof error === 'object') {
    const maybeError = error as {
      error?: unknown;
      message?: unknown;
    };

    if (Array.isArray(maybeError.error)) {
      return maybeError.error.map(item => String(item));
    }

    if (typeof maybeError.error === 'string') {
      return [maybeError.error];
    }

    if (maybeError.error && typeof maybeError.error === 'object') {
      const body = maybeError.error as {
        errors?: Record<string, unknown>;
        title?: unknown;
        message?: unknown;
      };

      if (body.errors) {
        return Object.values(body.errors).flatMap(value =>
          Array.isArray(value) ? value.map(item => String(item)) : [String(value)]
        );
      }

      if (typeof body.title === 'string') {
        return [body.title];
      }

      if (typeof body.message === 'string') {
        return [body.message];
      }
    }

    if (typeof maybeError.message === 'string') {
      return [maybeError.message];
    }
  }

  return ['Errore imprevisto durante la registrazione.'];
}
