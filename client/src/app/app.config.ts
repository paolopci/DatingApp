import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './_interceptors/error.interceptor';

import { routes } from './app.routes';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // ORDINE IMPORTANTE: vedi nota sotto
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))

  ]
};
`
Gli interceptor vengono applicati alle richieste nell’ordine in cui li registri (sopra: prima jwt, poi myNew)
e le risposte tornano in ordine inverso (myNew poi jwt).
Di solito:

JWT/Auth va messo per primo (così ogni richiesta ha già il token).

Error handler e logger vanno dopo.
`