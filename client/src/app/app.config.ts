import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { loadingInterceptor } from './_interceptors/loading-interceptor';

import { routes } from './app.routes';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';

/**
 * Configuration object for the Angular application.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configura i listener di errore globali del browser.
    provideBrowserGlobalErrorListeners(),
    // Fornisce l'HttpClient per le richieste HTTP.
    provideHttpClient(),

    // Configura il rilevamento delle modifiche di Angular.
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Configura il router dell'applicazione con le rotte definite.
    provideRouter(routes),

    // Registra gli interceptor HTTP. L'ordine è FONDAMENTALE.
    // Le richieste vengono processate nell'ordine: jwt -> loading -> error.
    // Le risposte vengono processate in ordine inverso: error -> loading -> jwt.
    provideHttpClient(withInterceptors([
      jwtInterceptor,       // 1. Aggiunge il token JWT di autenticazione a quasi tutte le richieste in uscita.
      loadingInterceptor,   // 2. Mostra uno spinner di caricamento prima dell'invio di una richiesta e lo nasconde alla ricezione della risposta.
      errorInterceptor      // 3. Gestisce centralmente gli errori HTTP (es. 400, 401, 404, 500).
    ]))
  ]
};
