namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        // Username corrente (richiesto per filtrare i messaggi)
        public string Username { get; set; } = string.Empty;

        // "Inbox" | "Outbox" | "Unread"
        public string Container { get; set; } = "Inbox";
    }
}

