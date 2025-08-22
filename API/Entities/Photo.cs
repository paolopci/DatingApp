using System.ComponentModel.DataAnnotations;


namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    [Required]
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }

    // Navigation properties
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

}
