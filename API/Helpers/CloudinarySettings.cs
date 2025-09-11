using System.ComponentModel.DataAnnotations;


namespace API.Helpers
{
    public class CloudinarySettings
    {
        [Required]
        public string CloudName { get; set; } = string.Empty;
        [Required]
        public string ApiKey { get; set; } = string.Empty;
        [Required]
        public string ApiSecret { get; set; } = string.Empty;
    }
}
