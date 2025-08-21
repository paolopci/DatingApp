import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Toast } from '../_services/toast'; // ⬅️ aggiorna il path se diverso

// Tipi per payload d’errore (es. backend .NET)
type ModelState = Record<string, string[] | string>;
interface ApiErrorPayload {
  errors?: ModelState;
  title?: string;
  detail?: string;
  message?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(Toast);

  const notify = (msg: string | string[]) => {
    const text = Array.isArray(msg) ? msg.join('\n') : msg;
    toast.show(text);            // ⬅️ usa la tua firma attuale: solo testo
  };

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const status = err?.status;
      const payload = (err?.error ?? {}) as ApiErrorPayload;

      switch (status) {
        case 400: {
          // Errori di validazione (ModelState)
          if (payload?.errors && typeof payload.errors === 'object') {
            const modelStateErrors: string[] = [];
            for (const key in payload.errors) {
              const entry = payload.errors[key];
              if (Array.isArray(entry)) modelStateErrors.push(...entry);
              else if (typeof entry === 'string') modelStateErrors.push(entry);
            }
            if (modelStateErrors.length) notify(modelStateErrors);
            return throwError(() => modelStateErrors); // ⬅️ restituisce un Observable di errore
          }

          // 400 generico
          const msg =
            payload?.message ??
            payload?.detail ??
            payload?.title ??
            (typeof err?.error === 'string' ? err.error : 'Richiesta non valida');
          notify(msg);
          return throwError(() => err);
        }

        case 401:
          notify('Non autorizzato');
          return throwError(() => err);

        case 404:
          notify('Risorsa non trovata');
          return throwError(() => err);

        case 500:
          notify('Errore interno del server');
          return throwError(() => err);

        default:
          notify('Errore imprevisto');
          return throwError(() => err);
      }
    })
  );
};
