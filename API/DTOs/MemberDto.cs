using System.ComponentModel.DataAnnotations;


namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
       
        public string? UserName { get; set; }
       
        public int age { get; set; }

        public string? PhotoUrl { get; set; }
        
        public string KnownAs { get; set; }

        public DateTime Created { get; set; } 
        public DateTime LastActive { get; set; } 
        [Required]
        public string? Gender { get; set; }

        public string? Introduction { get; set; }
        public string? Interests { get; set; }
        public string? LookingFor { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Country { get; set; }
        public List<PhotoDto>? Photos { get; set; } = new List<PhotoDto>();
    }
}
