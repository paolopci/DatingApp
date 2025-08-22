# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commonly Used Commands

*   `npm start`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm test`: Runs the unit tests.
*   `npm run watch`: Builds the application and watches for file changes.

## Code Architecture

This is an Angular application. The main application logic is in the `src/app` directory.

*   `src/app/_guards`: Contains route guards.
*   `src/app/_interceptors`: Contains HTTP interceptors.
*   `src/app/_models`: Contains the application's data models.
*   `src/app/_services`: Contains the application's services.
*   `src/app/errors`: Contains components for displaying errors.
*   `src/app/members`: Contains components related to user profiles.
*   `src/app/nav`: Contains the main navigation component.

The application uses Bootstrap for styling and ngx-toastr for notifications.
