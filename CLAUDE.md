This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

This solution contains two separate projects: a .NET Web API backend and an Angular frontend client. Instructions for each project are provided in their respective sections below.

---

## API (.NET Backend)

**Location:** `/API`

This is a .NET 8 Web API for a dating application. It uses Entity Framework Core for data access and JWT for authentication.

### Common Commands

**Note:** These commands should be run from the `/API` directory.

*   `dotnet run`: Run the application
*   `dotnet build`: Build the application
*   `dotnet test`: Run tests
*   `dotnet ef migrations add <MigrationName>`: Add a new migration
*   `dotnet ef database update`: Update the database

### Key Directories:

*   `Controllers`: Contains the API controllers that handle incoming HTTP requests.
*   `Data`: Contains the `DataContext`, an Entity Framework Core `DbContext`, and database migrations.
*   `DTOs`: Data Transfer Objects used to shape the data sent to and from the API.
*   `Entities`: Represents the database tables.
*   `Services`: Contains business logic, such as the `TokenService` for handling JWT.
*   `Extensions`: Contains extension methods for configuring services in `Program.cs`.
*   `Interfaces`: Contains the interfaces to implement in the services.
*   `Errors`: Exception handling middleware and custom exceptions.
*   `Middleware`: Exception handling middleware and custom exceptions.
*   `Repositories`: Contains the repository pattern implementation for data access abstraction.
*   `Helpers`: AutoMapper and other helper classes.

---

## Client (Angular Frontend)

**Location:** `/client`

This is an Angular 20.1.0 dating application.

### Common Commands

**Note:** These commands should be run from the `/client` directory.

*   `npm start`: Starts the development server
*   `npm run build`: Builds the application for production
*   `npm run watch`: Builds the application and watches for file changes
*   `npm test`: Runs the unit tests
*   `npm start:https`: Starts development server with HTTPS using local SSL certificates

### Code Architecture

*   **Core Services**: `src/app/_services/` - Account, Members, and Toast services
*   **Models**: `src/app/_models/` - User, Member, Photo, and ToastMessage interfaces
*   `Guards`: `src/app/_guards/` - Auth guard for route protection
*   **Interceptors**: `src/app/_interceptors/` - Error interceptor for HTTP error handling
*   **Feature Modules**:
    *   `members/` - Member cards, lists, and detail views
    *   `messages/` - Messaging functionality
    *   `lists/` - User lists
    *   `errors/` - Error pages (404, server error, test errors)
    *   `register/` - User registration
    *   `nav/` - Navigation component
    *   `toasts/` - Toast notifications

### Key Dependencies

*   **UI Framework**: Bootstrap 5.3.7 with Bootswatch themes
*   **Icons**: FontAwesome Free
*   **HTTP**: Angular HttpClient with RxJS 7.8.0
*   **Testing**: Jasmine with Karma test runner

### Development Notes

*   Uses Angular standalone components architecture
*   Environment configurations in `src/environments/`
*   SSL certificates provided in `ssl/` directory for HTTPS development
*   Prettier configured for Angular HTML templates
