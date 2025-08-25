# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a .NET 8 Web API for a dating application. It uses Entity Framework Core for data access and JWT for authentication.

### Key Directories:

*   `Controllers`: Contains the API controllers that handle incoming HTTP requests.
*   `Data`: Contains the `DataContext` an Entity Framework Core `DbContext` and database migrations.
*   `DTOs`: Data Transfer Objects used to shape the data sent to and from the API.
*   `Entities`: Represents the database tables.
*   `Services`: Contains business logic, such as the `TokenService` for handling JWT.
*   `Extensions`: Contains extension methods for configuring services in `Program.cs`
*   `Interfaces`: Contains the interfaces to implement in the services. 
*   `Errors`: Exception handling middleware and custom exceptions. 
*   `Middleware`: Excpetion handling middleware and custom exceptions. 
*   `Repositories` : Contains the repository pattern implementation for data access abstraction.
*   `Helpers` : AutoMapper and other helper classes.

## Common Commands

*   **Run the application:** `dotnet run`
*   **Build the application:** `dotnet build`
*   **Run tests:** `dotnet test`
*   **Add a new migration:** `dotnet ef migrations add <MigrationName>`
*   **Update the database:** `dotnet ef database update`
