using API.Extensions;
using System.ComponentModel.DataAnnotations;


namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }

        [Required] public string UserName { get; set; }
        // [Required
        public byte[] PasswordHash { get; set; } = [];
        //  [Required]
        public byte[] PasswordSalt { get; set; } = [];

        public DateOnly DateOfBirth { get; set; }
        [Required]
        public string KnownAs { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        [Required]
        public string Gender { get; set; }

        public string? Introduction { get; set; }
        public string? Interests { get; set; }
        public string? LookingFor { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public int Age
        {
            get
            {
                return DateOfBirth.CalculateAge();
            }
        }



        // Navigation property
        public List<Photo> Photos { get; set; } = [];


    }
}
