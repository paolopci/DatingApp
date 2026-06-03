import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth/state/auth.reducer';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(Store);
  const currentUser = store.selectSignal(authFeature.selectCurrentUser);

  if (currentUser()) {
    // : le richieste HttpRequest in Angular sono immutabili, quindi per aggiungere/modificare header devi clonarle.
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser()?.token}`
      }
    });
  }

  //inoltra la (eventualmente) nuova richiesta al prossimo handler. Senza questa chiamata la pipeline si bloccherebbe.
  return next(req);
};
