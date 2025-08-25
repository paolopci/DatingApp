using API.Data;
using API.Extensions;
using API.Helpers;
using API.Middleware;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add automapper service
//builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

// Add extensions for application services and identity services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);



var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));


// Aggiungo l'autenticazione e l'autorizzazione prima di mappare i controller
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data (uncomment if needed)
using (var scope = app.Services.CreateScope())// Creo un ambito per i servizi
{
    var services = scope.ServiceProvider;// Ottengo i servizi necessari per il seeding
    try
    {
        var context = services.GetRequiredService<DataContext>();// Ottengo il contesto del database
        await context.Database.MigrateAsync();// Applica le migrazioni pendenti al database
        await Seed.SeedUsers(context); // Esegue il seeding degli utenti
    }
    catch (Exception ex) 
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration");
    }
}

app.Run();
