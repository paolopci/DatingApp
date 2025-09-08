namespace API.Helpers
{
    public class PaginationHeader
    {
        
        public int CurrentPage { get; set; }
        public int ItemsPerPages { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public PaginationHeader(int currentPage, int itemsPerPages, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPages = itemsPerPages;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

    }
}
