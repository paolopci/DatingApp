using System.ComponentModel.DataAnnotations;


namespace API.DTOs
{
    public class UserDto
    {
        [Required]
        public string Username { get; set; } = string.Empty; 
        [Required]
        public string KnownAs { get; set; } = string.Empty;
        [Required]
        public string Token { get; set; } = string.Empty;

        public string? PhotoUrl { get; set; }// potrebbe non avere un immagine
        public string Gender { get; set; } = string.Empty;
    }
}
