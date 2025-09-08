using System.ComponentModel.DataAnnotations;


namespace API.DTOs
{
    public class UserDto
    {
        [Required]
        public string Username { get; set; } 
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Token { get; set; }

        public string? PhotoUrl { get; set; }// potrebbe non avere un immagine
        public string Gender { get; set; }
    }
}
