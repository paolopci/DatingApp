namespace API.Helpers
{
    /// <summary>
    /// Parametri utente comuni per la paginazione lato API.
    /// Controlla il numero di pagina e la dimensione massima consentita.
    /// </summary>
    public class UserParams
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

        public string? Gender { get; set; }
        public string? CurrentUsername { get; set; }
        public int MinAge { get; set; } = 18; // imposto 18 come valore min iniziale
        public int MaxAge { get; set; } = 100; // imposto 100 come valore max iniziale

        /// <summary>
        /// Campo per cui ordinare i risultati. Valori attesi: "created" o "lastActive".
        /// Se non specificato, verrà applicato l'ordinamento predefinito su LastActive.
        /// </summary>
        public string? OrderBy { get; set; }

        /// <summary>
        /// Direzione di ordinamento: "asc" o "desc". Default: "desc".
        /// </summary>
        public string? Sort { get; set; }

    }
}


