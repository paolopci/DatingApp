# PRD

## Obiettivo

Implementare NgRx lato client Angular per lo stato applicativo condiviso, coprendo autenticazione, registrazione, lista membri, dettaglio/modifica profilo e likes.

## Problema/Contesto

Il progetto usa Angular 20 standalone e ha gia NgRx 20 installato e cablato in `app.config.ts`. Oggi pero solo il flusso `Register` usa una feature NgRx dedicata, mentre autenticazione, utente corrente, membri e likes mantengono stato condiviso tramite `signal` nei servizi o subscribe diretti nei componenti.

Questa situazione rende meno prevedibili i side effect, duplica responsabilita tra componenti e servizi, e rende piu difficile testare flussi come login, logout, update della foto principale, filtri membri, paginazione likes e sincronizzazione di `currentUser`.

## Scope

- Creare una feature NgRx `auth` per login, logout, utente corrente, errori, loading e sincronizzazione con `localStorage`.
- Riallineare la feature `register` esistente allo store `auth`, evitando side effect duplicati su `currentUser`.
- Creare una feature NgRx `likes` per `likeIds`, lista paginata, parametri filtro e toggle like.
- Creare una feature NgRx `members` per lista membri, filtri, paginazione, dettaglio membro, aggiornamento profilo e aggiornamento foto principale.
- Aggiornare i componenti Angular che oggi leggono o mutano direttamente stato condiviso nei servizi: `Nav`, `MemberList`, `MemberDetail`, `MemberEditComponent`, `PhotoEditorComponent`, `Lists` e `MemberCardComponent`.
- Aggiornare `authGuard` e `jwt.interceptor` per leggere l'utente corrente dallo store o da un adapter coerente con lo store.
- Mantenere i servizi come layer HTTP e adapter per persistenza locale quando utile, rimuovendo progressivamente lo stato applicativo condiviso dai servizi.
- Aggiungere o aggiornare test Jasmine/Karma mirati per reducer, selector, effects e componenti principali.

## Out of scope

- Modificare API backend, database, DTO server, migrazioni o contratti pubblici.
- Installare nuove librerie, package, SDK, CLI o tool.
- Migrare stato puramente locale dei form Angular dentro NgRx.
- Migrare `Toast`, `BusyService`, spinner globale o stato UI puntuale non condiviso.
- Eliminare file o cartelle senza permesso esplicito.
- Fare refactoring estesi non necessari alla migrazione NgRx dello stato applicativo.
- Archiviare `docs/PRD.md` e `docs/PLAN.md` in `docs/History` finche lo sviluppo non e completato e non viene fornito il nome chat.

## Requisiti funzionali

- Con credenziali valide, il login deve dispatchare un'azione NgRx, salvare l'utente corrente nello store, persisterlo in `localStorage` e navigare a `/members`.
- Con logout, lo store deve svuotare l'utente corrente, rimuovere la persistenza locale pertinente e riportare la navigazione alla home.
- Al bootstrap o quando richiesto, l'app deve poter ripristinare `currentUser` da `localStorage` in modo coerente con guard e interceptor.
- Il flusso register deve continuare a gestire loading ed errori di validazione, ma il successo deve aggiornare anche lo stato `auth`.
- La navbar deve visualizzare stato autenticato, username e foto corrente leggendo da NgRx.
- `authGuard` deve autorizzare o bloccare le route protette in base allo stato autenticato coerente con lo store.
- `jwt.interceptor` deve aggiungere il bearer token usando l'utente corrente gestito dallo store o dal relativo adapter.
- La lista membri deve gestire filtri, ordinamento, paginazione, loading, errori e risultati tramite NgRx.
- Il dettaglio membro e la modifica profilo devono leggere e aggiornare dati tramite actions/selectors, mantenendo locale solo lo stato del form quando necessario.
- Il cambio foto principale deve aggiornare membro, lista membri e `currentUser.photoUrl` in modo coerente.
- La lista likes deve gestire predicato, paginazione, risultati e `likeIds` tramite NgRx.
- Il toggle like da `MemberCardComponent` deve aggiornare lo stato NgRx e riflettere correttamente l'icona del cuore.

## Vincoli tecnici

- Usare Angular 20 standalone, TypeScript strict, RxJS e NgRx 20 gia presenti nel progetto.
- Usare `createActionGroup`, `createFeature`, `createReducer`, selector tipizzati e `createEffect` in coerenza con la feature `register` esistente.
- Registrare le feature con `provideState(...)` e gli effect con `provideEffects(...)`.
- Restare dentro `client/` per tutte le modifiche applicative e documentali.
- Non introdurre breaking change sui contratti backend o sui modelli pubblici esistenti (`User`, `Member`, `LikesParams`, `UserParams`).
- Usare commenti solo dove chiariscono una scelta NgRx o una transizione non ovvia.

## Acceptance criteria

- `npm run build` compila il client Angular.
- I test pertinenti passano con `npx ng test --watch=false` oppure viene documentato il motivo tecnico se l'ambiente non consente l'esecuzione completa.
- `auth.reducer` e `auth.effects` coprono login, login failure, logout, restore utente e update foto corrente.
- `register` continua a dispatchare submit valido e a mostrare errori/loading, aggiornando lo stato auth su successo.
- `likes.reducer` e relativi componenti coprono caricamento ids, caricamento lista, cambio filtro/pagina e toggle like.
- `members.reducer` e relativi componenti coprono caricamento lista, cambio filtri, reset filtri, dettaglio, update profilo e cambio foto principale.
- Navbar, guard e interceptor non leggono piu stato condiviso da un `signal` di `AccountService`.
- I servizi non mantengono piu come fonte primaria lo stato applicativo condiviso migrato a NgRx.

## Rischi

- La migrazione di `currentUser` impatta login, logout, navbar, guard, interceptor, register e photo editor; va eseguita prima delle feature dipendenti.
- `jwt.interceptor` e `authGuard` sono punti sensibili: regressioni qui possono bloccare tutte le route protette o richieste autenticate.
- La cache esistente in `MembersService` va preservata o sostituita gradualmente per evitare regressioni percepite su lista e dettaglio.
- Il cambio foto principale aggiorna piu viste; serve sincronizzare membro, lista e utente corrente.
- I test Karma potrebbero compilare tutti gli spec anche quando si usa `--include`; eventuali errori globali vanno risolti prima di considerare verdi i test mirati.

## Definizione di completamento

Il task e completato quando auth, register, members e likes usano NgRx per lo stato applicativo condiviso, i componenti principali sono riallineati, build e test pertinenti sono stati eseguiti o motivatamente dichiarati non eseguibili, e `docs/PLAN.md` registra esito, verifiche e rischi residui.
