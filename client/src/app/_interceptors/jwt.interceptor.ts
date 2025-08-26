import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const accountService = inject(AccountService);

  if (accountService.currentUser()) {
    // : le richieste HttpRequest in Angular sono immutabili, quindi per aggiungere/modificare header devi clonarle.
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`
      }
    });
    console.log(req);
  }

  //inoltra la (eventualmente) nuova richiesta al prossimo handler. Senza questa chiamata la pipeline si bloccherebbe.
  return next(req);
};
