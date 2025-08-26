# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commonly Used Commands

*   `npm start`: Starts the development server
*   `npm run build`: Builds the application for production
*   `npm run watch`: Builds the application and watches for file changes
*   `npm test`: Runs the unit tests
*   `npm start:https`: Starts development server with HTTPS using local SSL certificates

## Code Architecture

This is an Angular 20.1.0 dating application with the following structure:

*   **Core Services**: `src/app/_services/` - Account, Members, and Toast services
*   **Models**: `src/app/_models/` - User, Member, Photo, and ToastMessage interfaces
*   **Guards**: `src/app/_guards/` - Auth guard for route protection
*   **Interceptors**: `src/app/_interceptors/` - Error interceptor for HTTP error handling
*   **Feature Modules**:
    *   `members/` - Member cards, lists, and detail views
    *   `messages/` - Messaging functionality
    *   `lists/` - User lists
    *   `errors/` - Error pages (404, server error, test errors)
    *   `register/` - User registration
    *   `nav/` - Navigation component
    *   `toasts/` - Toast notifications

## Key Dependencies

*   **UI Framework**: Bootstrap 5.3.7 with Bootswatch themes
*   **Icons**: FontAwesome Free
*   **HTTP**: Angular HttpClient with RxJS 7.8.0
*   **Testing**: Jasmine with Karma test runner

## Development Notes

*   Uses Angular standalone components architecture
*   Environment configurations in `src/environments/`
*   SSL certificates provided in `ssl/` directory for HTTPS development
*   Prettier configured for Angular HTML templates