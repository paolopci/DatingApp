using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repositories;
using API.Services;
using Microsoft.EntityFrameworkCore;


namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllers();
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            
            // Setting per Cloudinary
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

             
            return services;
        }
    }
}
