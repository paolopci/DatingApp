Client (Angular) — Guida Rapida

Panoramica

- Client Angular (v20) dell’app Dating. Include filtri, ordinamento e paginazione per la lista membri, caching lato client e gestione HTTPS locale.

Requisiti

- Node.js 18+ (consigliato LTS)
- Angular CLI 20 (npm i -g @angular/cli opzionale)

Installazione

- Esegui nella cartella client:
  - npm install

Avvio in sviluppo

- API di sviluppo: https://localhost:5001/api/ (configurata in src/environments/environment.development.ts).
- Dev server HTTPS: certificati in ssl/localhost.pem e ssl/localhost-key.pem già referenziati.
- Comandi utili:
  - npm start → ng serve (configurato in HTTPS su porta 4200)
  - npm run start:https → serve in HTTPS con i certificati locali
- Apri: https://localhost:4200 (accetta i certificati locali se richiesto).

Build produzione

- npm run build
- L’URL API di produzione è api/ (configurabile in src/environments/environment.ts). In genere è previsto un reverse proxy che instrada /api/ al backend.

Configurazione ambiente

- src/environments/environment.development.ts (dev):
  - apiUrl: https://localhost:5001/api/
- src/environments/environment.ts (prod):
  - apiUrl: api/

Lista membri: filtri, ordinamento e paginazione

- File chiave:
  - src/app/members/member-list/member-list.ts
  - src/app/_services/members.service.ts
- Filtri disponibili:
  - gender (male/female), minAge, maxAge
  - orderBy: created | lastActive
  - orderDirection: asc | desc
- Paginazione: pageNumber, pageSize con controllo tramite NgbPagination.
- Persistenza dei filtri: i parametri sono salvati per-utente in sessionStorage (chiave memberListUserParams:<username>) e ripristinati alla navigazione.
- Reset: il pulsante “Reset” ripristina i valori di default e ricarica i dati.

Caching client

- Lista: cache LRU con TTL 10 minuti, chiave generata dai parametri di filtro/pagina.
- Dettaglio membro: cache con TTL 3 minuti per username.
- Invalidazione: su updateMember, setMainPhoto, deletePhoto viene invalidata la cache lista.

Routing e protezioni

- Le route protette sono sotto guard authGuard in src/app/app.routes.ts.
- Modifica membro (member/edit) usa preventUnsavedChangesGuard per prevenire la perdita di modifiche non salvate.

Polyfills (Angular Localize)

- Non importare @angular/localize/init in src/main.ts.
- È già configurato in angular.json:
  - build.options.polyfills: zone.js, @angular/localize/init
  - test.options.polyfills: zone.js, @angular/localize/init, zone.js/testing
- Motivazione: da Angular 16+ i polyfill vanno configurati nel builder per evitare duplicazioni e warning come:
  - Direct import of '@angular/localize/init' detected. This may lead to undefined behavior.
- Se cambi la configurazione, riavvia il dev server per applicarla.

Test

- npm test esegue i test con Karma.

Problemi comuni

- Certificati non fidati: se il browser segnala certificati non fidati su https://localhost:4200, accetta esplicitamente il certificato oppure rigenera i cert con un’authority locale di fiducia.
- CORS/API non raggiungibile: verifica che il backend risponda su https://localhost:5001 e che environment.development.ts punti all’URL corretto. In prod, assicurati che /api/ sia instradato al backend.