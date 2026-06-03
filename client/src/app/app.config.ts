import {
  ApplicationConfig,
  isDevMode,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { loadingInterceptor } from './_interceptors/loading-interceptor';

import { routes } from './app.routes';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { registerFeature } from './register/state/register.reducer';
import { RegisterEffects } from './register/state/register.effects';
import { authFeature } from './auth/state/auth.reducer';
import { AuthEffects } from './auth/state/auth.effects';
import { likesFeature } from './likes/state/likes.reducer';
import { LikesEffects } from './likes/state/likes.effects';
import { membersFeature } from './members/state/members.reducer';
import { MembersEffects } from './members/state/members.effects';

/**
 * Configuration object for the Angular application.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Locale italiano per pipe di data/numero.
    { provide: LOCALE_ID, useValue: 'it-IT' },
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
    provideHttpClient(
      withInterceptors([
        jwtInterceptor, // 1. Aggiunge il token JWT di autenticazione a quasi tutte le richieste in uscita.
        loadingInterceptor, // 2. Mostra uno spinner di caricamento prima dell'invio di una richiesta e lo nasconde alla ricezione della risposta.
        errorInterceptor, // 3. Gestisce centralmente gli errori HTTP (es. 400, 401, 404, 500).
      ]),
    ),
    provideStore(),
    provideState(authFeature),
    provideState(registerFeature),
    provideState(likesFeature),
    provideState(membersFeature),
    provideEffects([
      AuthEffects,
      RegisterEffects,
      LikesEffects,
      MembersEffects,
    ]),
    provideStoreDevtools({
      // Mantiene nello storico DevTools gli ultimi 25 stati dello store.
      maxAge: 25,
      // In produzione abilita solo la lettura/log, evitando modifiche allo stato dai DevTools.
      logOnly: !isDevMode(),
      // Sospende la registrazione quando la finestra Redux DevTools non è aperta.
      autoPause: true,
      // Esegue la connessione ai DevTools dentro la zona Angular.
      connectInZone: true,
      // Disabilita la raccolta dello stack trace per ogni action, riducendo overhead e rumore.
      trace: false,
      // Numero massimo di frame dello stack trace da conservare se trace viene abilitato.
      traceLimit: 75,
    }),
  ],
};

// Registra i dati di localizzazione per l'italiano
registerLocaleData(localeIt);
