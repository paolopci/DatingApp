using System.ComponentModel.DataAnnotations;


namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }
        [Required]
        public string SenderUsername { get; set; }
        [Required]
        public string RecipientUsername { get; set; }
        [Required]
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }

        // navigation properties
        public int SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;
        public int RecipientId { get; set; }
        public AppUser Recipient { get; set; } = null!;
    }
}
