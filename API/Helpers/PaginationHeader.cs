namespace API.Helpers
{
    /// <summary>
    /// Modello dati per l'header di paginazione inviato al client.
    /// Contiene le informazioni minime necessarie per navigare tra le pagine.
    /// </summary>
    public class PaginationHeader
    {
        /// <summary>Indice della pagina corrente (1-based).</summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// Numero di elementi per pagina.
        /// Nota: il nome della proprietà è "ItemsPerPages" per compatibilità col codice esistente.
        /// </summary>
        public int ItemsPerPages { get; set; }

        /// <summary>Numero totale di elementi complessivi.</summary>
        public int TotalItems { get; set; }

        /// <summary>Numero totale di pagine disponibili.</summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// Crea una nuova istanza di <see cref="PaginationHeader"/> con i metadati forniti.
        /// </summary>
        /// <param name="currentPage">Pagina corrente (1-based).</param>
        /// <param name="itemsPerPages">Elementi per pagina.</param>
        /// <param name="totalItems">Totale elementi.</param>
        /// <param name="totalPages">Totale pagine.</param>
        public PaginationHeader(int currentPage, int itemsPerPages, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPages = itemsPerPages;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

    }
}

