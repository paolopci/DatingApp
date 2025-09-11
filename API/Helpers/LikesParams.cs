using System.ComponentModel.DataAnnotations;


namespace API.Helpers
{
    public class LikesParams : PaginationParams
    {
        public int UserId { get; set; }
        [Required]
        public string Predicate { get; set; } = "liked";
    }
}
