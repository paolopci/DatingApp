# Template README — .NET 8 API + Angular 20 (Signals)

Questo README è precompilato e adattato al progetto attuale (API .NET 8 + client Angular 20 con Signals). Rimane riutilizzabile come base per altri progetti con Codex CLI.

—

## Indice

- Profilo progetto attuale
- Prerequisiti
- Avvio rapido (locale)
- Configurazione ambienti e variabili
- Front-end (Angular 20 + Signals)
- Formato data (dd/MM/yyyy)
- Back-end (.NET 8 API)
- Qualità, test e CI/CD
- Sicurezza e osservabilità
- Troubleshooting
- Note per Codex

## Profilo progetto attuale

Struttura cartelle:

```
/ (root)
  API/                   # ASP.NET Core 8 Web API
  client/                # Angular 20 SPA (SSL dev)
  DatingSolution.sln
```

Porte e URL:
- API: `http://localhost:5000` e `https://localhost:5001`
- Web: `https://localhost:4200`
- Base URL FE→API: `https://localhost:5001/api/` (vedi `client/src/environments/environment.development.ts`)

Database e connessione:
- SQL Server (localdb/SQLEXPRESS). Connection string in `API/appsettings.Development.json` -> `ConnectionStrings:DefaultConnection`.

JWT/Token:
- La chiave `TokenKey` è richiesta e deve essere lunga ≥ 64 caratteri. Impostarla con User Secrets in dev.

## Prerequisiti

- .NET SDK 8.0.x (`dotnet --version`)
- Node.js 20.x LTS + NPM (`node -v`, `npm -v`)
- Angular CLI 20 (`npm i -g @angular/cli@20`)
- SQL Server (locale o container)
- Certificati dev: `dotnet dev-certs https --trust`

Opzionale (SQL Server via Docker):
```
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Your_password123" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

## Avvio rapido (locale)

1) Ripristino dipendenze
```
dotnet restore
cd client && npm ci && cd ..
```

2) Configurazione segreti e HTTPS
```
dotnet dev-certs https --trust
dotnet user-secrets init --project API/API.csproj
dotnet user-secrets set "TokenKey" "<metti-una-chiave-di-almeno-64-caratteri>" --project API/API.csproj
```

3) Avvio API
```
dotnet run --project API/API.csproj
```

4) Avvio client Angular (SSL)
```
cd client
npm run start:https
# apre https://localhost:4200 (cert in client/ssl)
```

## Configurazione ambienti e variabili

Backend (`API/appsettings.Development.json`):
- `ConnectionStrings:DefaultConnection` -> aggiorna a seconda della tua istanza SQL Server.
- `TokenKey` -> non salvare in file; usa User Secrets o variabili d’ambiente.

Frontend (`client/src/environments/`):
- `environment.development.ts` -> `apiUrl: 'https://localhost:5001/api/'` (default già impostato)

CORS (backend):
- Impostato per `http://localhost:4200` e `https://localhost:4200` in `API/Program.cs`.

## Front-end (Angular 20 + Signals)

Linee guida:
- Standalone components e routing modulare; preferisci Signals per stato locale e componi con RxJS per flussi.
- Interceptor JWT (già presente) per Authorization header e gestione errori.
- Avvio con certificati locali inclusi in `client/ssl/`.

Comandi:
```
cd client
npm run start         # HTTP (vedi angular.json)
npm run start:https   # HTTPS con cert locali
npm run build         # build prod
npm test              # unit test (Karma)
```

## Formato data (dd/MM/yyyy)

- Front-end: il campo data di nascita nel componente `register` usa ng-bootstrap Datepicker con un `NgbDateParserFormatter` personalizzato per accettare e mostrare SOLO `dd/MM/yyyy` con zeri iniziali.
  - File: `client/src/app/register/ddmmyyyy-ngb-date-parser-formatter.ts`
  - Validazione input testo nel componente: `onDobInput()` in `client/src/app/register/register.ts` aggiunge un errore `dateFormat` se il testo non rispetta il formato.
- Back-end: l'azione `Register` in `API/Controllers/AccountController.cs` analizza `DateOfBirth` con `DateOnly.TryParseExact(..., "dd/MM/yyyy", ...)` e rifiuta il formato non valido (400 BadRequest).
- AutoMapper: la mappa `RegisterDto -> AppUser` ignora `DateOfBirth` perché viene impostata dopo il parsing esplicito; vedi `API/Helpers/AutoMapperProfiles.cs`.

Per cambiare formato, aggiornare sia il formatter/regex nel front-end sia il parsing in controller e la documentazione.

## Back-end (.NET 8 API)

Punti chiave:
- EF Core + migrazioni; seeding utenti in `API/Data/Seed.cs`.
- Autenticazione JWT con chiave simmetrica `TokenKey` (User Secrets in dev).
- CORS per dev già configurato; controller mappati in `Program.cs`.

Migrazioni EF:
```
# dall a root del repo
dotnet ef migrations add <NomeMigrazione> --project API/API.csproj --startup-project API/API.csproj
dotnet ef database update --project API/API.csproj --startup-project API/API.csproj
```

## Qualità, test e CI/CD

- Lint/format: `dotnet format` (API), Prettier/ESLint per Angular.
- Test FE: `npm test`. (Nessun progetto di test .NET presente attualmente.)
- CI (idea base GitHub Actions): restore, build API e build FE.

## Sicurezza e osservabilità

- Tenere `TokenKey` fuori dal controllo versione (User Secrets/ENV). Lunghezza ≥ 64.
- HTTPS attivo in dev; aggiornare trust certificati se necessario.
- Log strutturati e gestione errori via `ExceptionMiddleware` già inclusa.

## Troubleshooting

- Porte 5000/5001 occupate: modifica `API/Properties/launchSettings.json`.
- Cert SSL FE non fidato: riavvia browser o rigenera certificati in `client/ssl`.
- Stringa di connessione SQL errata: aggiornare `appsettings.Development.json` o usare ENV.
- 401/403 dal client: verifica `TokenKey` e CORS in `Program.cs`.

## Note per Codex

- Task suggeriti: aggiungere test e2e con Playwright, pipeline CI, Dockerfile e compose dev.
- Mantieni in `README.md` i comandi rapidi del team per onboarding.
