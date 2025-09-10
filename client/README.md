Client (Angular) — Notes

- Localize polyfill placement:
  - Do not import `@angular/localize/init` directly in `src/main.ts`.
  - Add it to the Angular builder polyfills instead to avoid undefined behavior during build/serve.

How to configure

- angular.json
  - build.options.polyfills:
    - "zone.js",
    - "@angular/localize/init"
  - test.options.polyfills:
    - "zone.js",
    - "@angular/localize/init",
    - "zone.js/testing"

- src/main.ts
  - Remove the line: `import '@angular/localize/init';`

Why

- From Angular 16+, the recommended way to include polyfills is via the builder configuration. Importing the localize polyfill directly in code may lead to duplicated or mis‑ordered polyfills and warnings like:
  - "Direct import of '@angular/localize/init' detected. This may lead to undefined behavior."

After changes

- Restart the dev server (`ng serve`) to ensure the new polyfill configuration is picked up and the warning disappears.

