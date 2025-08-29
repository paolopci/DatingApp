import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

/**
 * Interceptor to automatically handle the application's busy state for HTTP requests.
 * It shows a spinner when requests start and hides it when they complete.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Iniettiamo il BusyService per poter interagire con lo stato di "occupato" dell'applicazione.
  const busyService = inject(BusyService);

  // Prima che la richiesta parta, segnaliamo all'applicazione di entrare in stato "busy".
  // Questo farà apparire lo spinner.
  busyService.busy();

  // Passiamo la richiesta al gestore successivo nella catena degli interceptor.
  // Usiamo .pipe() per poter eseguire azioni quando la richiesta è completata.
  return next(req).pipe(
    // per testare l'applicazione inserisco un ritardo
    //delay(1000),
    // `finalize` viene eseguito sia in caso di successo che di errore della richiesta.
    // È il posto perfetto per assicurarci di nascondere lo spinner in ogni caso.
    finalize(() => {
      // Segnaliamo all'applicazione di uscire dallo stato "busy".
      // Lo spinner verrà nascosto solo se non ci sono altre richieste in corso.
      busyService.idle();
    })
  );
};
