# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start development server**: `npm start` or `ng serve`
- **Start development server with SSL**: `npm run start:https`
- **Build**: `npm run build` or `ng build`
- **Watch for changes**: `npm run watch`
- **Run unit tests**: `npm test` or `ng test`
- **Generate a new component**: `ng generate component component-name`

## Architecture

This is an Angular application with a standard project structure.

- **Routing**: The main application routes are defined in `src/app/app.routes.ts`. Key routes include `/members`, `/lists`, and `/messages`.
- **Components**: The application is divided into several feature components located in `src/app/`, such as `home`, `members`, `lists`, `messages`, `nav`, and `register`.
- **Services**: Services are in the `src/app/_services/` directory.
  - `account.ts`: Manages user authentication (login, logout, register) and stores the current user's state. It interacts with a backend API at `https://localhost:5001/api/`.
- **Models**: Data models like `User` are located in `src/app/_models/`.
- **Styling**: Global styles are in `src/styles.css`. The project uses Bootstrap and Font Awesome.
