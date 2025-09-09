using System.Security.Claims;


namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            // Prefer the standard Name claim (mapped from unique_name),
            // fall back to NameIdentifier only if present for backward compatibility.
            var username = user.FindFirstValue(ClaimTypes.Name)
                           ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? throw new Exception("Username claim not found in token.");

            return username;
        }
    }
}
