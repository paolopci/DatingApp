using System.ComponentModel.DataAnnotations;


namespace API.Helpers
{
    public class CloudinarySettings
    {
        [Required]
        public string CloudName { get; set; }
        [Required]
        public string ApiKey { get; set; }
        [Required]
        public string ApiSecret { get; set; }
    }
}
