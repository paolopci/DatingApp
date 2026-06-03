# PLAN

## Checklist Generale

- [x] Analizzare richiesta, repository e vincoli locali.
- [x] Aggiornare `docs/PRD.md`.
- [x] Aggiornare `docs/PLAN.md`.
- [x] Completare Fase 1 - Auth store.
- [x] Completare Fase 2 - Register collegato ad Auth.
- [x] Completare Fase 3 - Likes store.
- [x] Completare Fase 4 - Members store.
- [x] Completare Fase 5 - Integrazione componenti e bootstrap.
- [x] Completare Fase 6 - Validazione finale.
- [ ] Archiviare PRD/PLAN in `docs/History` a sviluppo complessivo concluso e dopo indicazione del nome chat.

## Fase 1 - Auth store

Stato: completed
Scope finale: in
Tipo fase: implementazione
Obiettivo: Centralizzare in NgRx login, logout, utente corrente, restore da `localStorage`, loading ed errori auth.
Attivita:
- [x] Creare `src/app/auth/state/auth.models.ts` con stato auth e payload login tipizzati.
- [x] Creare `src/app/auth/state/auth.actions.ts` con azioni per login, success, failure, logout, restore utente e update foto corrente.
- [x] Creare `src/app/auth/state/auth.reducer.ts` con `createFeature`, stato iniziale e selector generati.
- [x] Creare `src/app/auth/state/auth.effects.ts` per chiamate HTTP login, persistenza `localStorage`, navigazione e caricamento `likeIds` post-login.
- [x] Aggiornare `AccountService` per esporre metodi HTTP/persistenza senza mantenere `currentUser` come fonte primaria dello stato.
- [x] Aggiornare `Nav`, `authGuard` e `jwt.interceptor` per usare lo stato auth coerente con NgRx.
- [x] Aggiungere test reducer mirati e mantenere verdi i test component/register esistenti.
File o aree coinvolte: `src/app/auth/state/`, `src/app/_services/account.ts`, `src/app/nav/`, `src/app/_guards/auth-guard.ts`, `src/app/_interceptors/jwt.interceptor.ts`
Backend impact: no
Frontend impact: si
Dipendenze: documentazione approvata e nessuna installazione aggiuntiva.
Validazioni: `npx ng test --watch=false` completato con 23 spec success; `npm run build` completato con warning budget initial bundle.
Definition of done: login/logout/currentUser funzionano tramite NgRx; navbar, guard e interceptor non dipendono da `AccountService.currentUser` come stato condiviso.
Tracer Bullet: obbligatoria
Sub-agent: proponibile, ma non attivo senza nuova autorizzazione operativa.
Sub-task delegabili: reducer/effects auth, migrazione navbar/guard/interceptor, test auth.
Rischi: regressioni su route protette e header JWT; questa fase va completata prima di likes e members.

## Fase 2 - Register collegato ad Auth

Stato: completed
Scope finale: in
Tipo fase: implementazione
Obiettivo: Mantenere lo stato di submit register esistente, ma aggiornare `auth` su registrazione riuscita.
Attivita:
- [x] Aggiornare `RegisterEffects` per dispatchare una action auth di successo o una action di sync utente dopo `registerSucceeded`.
- [x] Rimuovere duplicazioni di persistenza utente tra `AccountService.register()` e feature auth.
- [x] Verificare che loading/errori register restino nella feature `register`.
- [x] Aggiornare test esistenti di `register.reducer`, `register.spec` e aggiungere test effect se necessario.
File o aree coinvolte: `src/app/register/state/`, `src/app/register/`, `src/app/_services/account.ts`
Backend impact: no
Frontend impact: si
Dipendenze: Fase 1 completed.
Validazioni: `npx ng test --watch=false` completato con 23 spec success; `npm run build` completato.
Definition of done: registrazione valida aggiorna lo stato auth e naviga a `/members`; errori di validazione restano visibili nel template register.
Tracer Bullet: obbligatoria
Sub-agent: vietato se lavora sugli stessi file auth della Fase 1 non ancora stabilizzati.
Sub-task delegabili: nessuno durante la transizione auth/register.
Rischi: doppio salvataggio utente o mancato sync con navbar/interceptor.

## Fase 3 - Likes store

Stato: completed
Scope finale: in
Tipo fase: implementazione
Obiettivo: Gestire `likeIds`, lista likes, predicato, paginazione e toggle like tramite NgRx.
Attivita:
- [x] Creare `src/app/likes/state/likes.models.ts`, actions, reducer, selectors/effects.
- [x] Spostare caricamento `likeIds` e lista paginata da `LikesService` agli effects.
- [x] Mantenere `LikesService` come adapter HTTP senza stato applicativo condiviso.
- [x] Aggiornare `Lists` per dispatchare cambio predicato, cambio pagina, cambio page size e load.
- [x] Aggiornare `MemberCardComponent` per leggere `hasLiked` da selector e dispatchare toggle.
- [x] Aggiungere test reducer mirati e validare i componenti tramite build/test suite esistente.
File o aree coinvolte: `src/app/likes/state/`, `src/app/_services/likes.service.ts`, `src/app/lists/`, `src/app/members/member-card/`
Backend impact: no
Frontend impact: si
Dipendenze: Fase 1 completed, per caricamento ids dopo login.
Validazioni: test RED verificato su moduli mancanti; `npx ng test --watch=false` completato con 23 spec success; `npm run build` completato.
Definition of done: likes e liked ids sono gestiti da NgRx; la UI riflette toggle e paginazione senza mutare signal nel servizio.
Tracer Bullet: obbligatoria
Sub-agent: possibile se Fase 1 e stabile.
Sub-task delegabili: store likes, migrazione componenti likes/card, test likes.
Rischi: toggle like richiede coerenza tra richiesta API, stato optimistic e stato finale.

## Fase 4 - Members store

Stato: completed
Scope finale: in
Tipo fase: implementazione
Obiettivo: Gestire lista membri, filtri, paginazione, dettaglio, update profilo e cambio foto principale tramite NgRx.
Attivita:
- [x] Creare `src/app/members/state/members.models.ts`, actions, reducer, selectors/effects.
- [x] Migrare `UserParams`, lista paginata e filtri da `MembersService` allo store.
- [x] Migrare dettaglio membro e cache minima coerente con lista/detail.
- [x] Aggiornare `MemberList`, `MemberDetail` e `MemberEditComponent` per usare actions/selectors.
- [x] Aggiornare `PhotoEditorComponent` per dispatchare update foto principale e sincronizzare membro/lista/auth.
- [x] Mantenere `MembersService` come adapter HTTP e cache locale solo se documentata come dettaglio tecnico non fonte primaria.
- [x] Aggiungere test reducer mirati e validare i componenti tramite build/test suite esistente.
File o aree coinvolte: `src/app/members/state/`, `src/app/_services/members.service.ts`, `src/app/members/`
Backend impact: no
Frontend impact: si
Dipendenze: Fase 1 completed; Fase 3 utile per interazione card likes.
Validazioni: test RED verificato su moduli mancanti; `npx ng test --watch=false` completato con 23 spec success; `npm run build` completato.
Definition of done: membri, filtri e paginazione sono gestiti da NgRx; update profilo e foto principale aggiornano tutte le viste coerenti.
Tracer Bullet: obbligatoria
Sub-agent: possibile dopo stabilizzazione auth e likes.
Sub-task delegabili: store members, migrazione lista/dettaglio/edit, migrazione photo editor, test members.
Rischi: cache, filtri persistiti e aggiornamento foto principale possono generare stato incoerente tra lista e dettaglio.

## Fase 5 - Integrazione componenti e bootstrap

Stato: completed
Scope finale: in
Tipo fase: integrazione
Obiettivo: Registrare tutte le feature NgRx, consolidare dipendenze e rimuovere accessi residui allo stato condiviso nei servizi.
Attivita:
- [x] Aggiornare `src/app/app.config.ts` con `provideState` e `provideEffects` per `auth`, `register`, `likes` e `members`.
- [x] Cercare accessi residui a `currentUser()`, `members()`, `paginatedResult()`, `likeIds()` e params signal nei servizi/componenti.
- [x] Rimuovere subscribe manuali dai componenti quando sostituiti da selector/effects.
- [x] Verificare che form state e stato UI locale restino locali dove previsto.
- [x] Aggiornare eventuali test rotti per il nuovo provider store.
File o aree coinvolte: `src/app/app.config.ts`, componenti e servizi migrati.
Backend impact: no
Frontend impact: si
Dipendenze: Fasi 1-4 completed.
Validazioni: `rg` mirati completati; residui `currentUser()` sono selector locali, non `AccountService.currentUser`; test/build completati.
Definition of done: bootstrap registra tutte le feature; non restano fonti primarie duplicate di stato applicativo condiviso.
Tracer Bullet: vietata
Sub-agent: vietato su file condivisi di integrazione finale.
Sub-task delegabili: nessuno.
Rischi: conflitti su `app.config.ts` e test setup con store providers.

## Fase 6 - Validazione finale

Stato: completed
Scope finale: in
Tipo fase: verifica
Obiettivo: Verificare build, test e flussi principali dopo la migrazione NgRx.
Attivita:
- [x] Eseguire `npx ng test --watch=false`.
- [x] Eseguire `npm run build`.
- [x] Verificare staticamente login, register, logout, members, likes, edit profile e main photo.
- [x] Aggiornare `docs/PLAN.md` con esito test, warning residui e rischi.
- [x] Segnalare eventuale mancata archiviazione in `docs/History` se manca il nome chat.
File o aree coinvolte: `docs/PLAN.md`, test/build client.
Backend impact: no
Frontend impact: si
Dipendenze: Fasi 1-5 completed.
Validazioni: `npx ng test --watch=false` completato con 23 spec success; `npm run build` completato con warning non bloccante su bundle initial `960.15 kB` oltre budget `500.00 kB`.
Definition of done: test e build sono passati o i blocchi sono documentati; il piano registra lo stato finale reale.
Tracer Bullet: vietata
Sub-agent: possibile solo come explorer di review se autorizzato.
Sub-task delegabili: review statica finale.
Rischi: warning bundle gia presente resta non bloccante; la migrazione ha aumentato lievemente il bundle initial rispetto al valore documentato precedente.

## Regole di stop e permessi

- Fermarsi prima di eliminare file o cartelle.
- Fermarsi prima di installare librerie, package o tool.
- Fermarsi prima di lavorare fuori da `client/`, salvo sola lettura delle istruzioni condivise gia richiesta.
- Fermarsi se una modifica implica breaking change su API/backend o contratti pubblici.
- Fermarsi se guard/interceptor/auth non compilano, perche bloccano l'intero frontend.
- Non archiviare `PRD.md` e `PLAN.md` senza nome chat esplicito.

## Impatti

- API/database: nessun impatto previsto.
- Frontend: impatto significativo su stato applicativo e componenti auth/members/likes.
- Configurazione: nessuna modifica sensibile prevista.
- Migrazioni: nessuna.
- Sicurezza: migliorare coerenza token/currentUser; evitare esposizione di dettagli sensibili negli errori UI.
