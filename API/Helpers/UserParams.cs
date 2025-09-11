namespace API.Helpers
{
    /// <summary>
    /// Parametri utente comuni per la paginazione lato API.
    /// Controlla il numero di pagina e la dimensione massima consentita.
    /// </summary>
    public class UserParams : PaginationParams
    {
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


