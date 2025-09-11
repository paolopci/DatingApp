namespace API.Helpers
{
    public class PaginationParams
    {
        /// <summary>Dimensione massima consentita per ogni pagina.</summary>
        private const int MaxPageSize = 50;

        /// <summary>Numero di pagina richiesto (default: 1).</summary>
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;

        /// <summary>
        /// Dimensione della pagina richiesta. Se supera <see cref="MaxPageSize"/>,
        /// viene automaticamente limitata a tale valore massimo.
        /// </summary>
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}
