using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    /// <summary>
    /// Rappresenta una lista paginata di elementi di tipo <typeparamref name="T"/>,
    /// includendo i metadati di paginazione (pagina corrente, dimensione pagina, totale elementi e pagine).
    /// </summary>
    /// <typeparam name="T">Il tipo degli elementi contenuti nella lista.</typeparam>
    public class PagedList<T> : List<T>
    {
        /// <summary>Indice della pagina corrente (1-based).</summary>
        public int CurrentPage { get; private set; }

        /// <summary>Numero totale di pagine disponibili.</summary>
        public int TotalPages  { get; private set; }

        /// <summary>Numero massimo di elementi per pagina.</summary>
        public int PageSize    { get; private set; }

        /// <summary>Numero totale di elementi nella sequenza originale.</summary>
        public int TotalCount  { get; private set; }

        /// <summary>
        /// Costruisce una nuova <see cref="PagedList{T}"/> a partire dagli elementi della pagina e dai relativi metadati.
        /// </summary>
        /// <param name="items">Gli elementi appartenenti alla pagina richiesta.</param>
        /// <param name="count">Il numero totale di elementi nella sorgente.</param>
        /// <param name="pageNumber">Il numero di pagina richiesto (1-based).</param>
        /// <param name="pageSize">La dimensione della pagina (numero elementi per pagina).</param>
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount  = count;
            PageSize    = pageSize;

            // Normalizza il numero di pagina: minimo 1
            CurrentPage = pageNumber < 1 ? 1 : pageNumber;

            // Calcola il totale pagine arrotondando per eccesso
            TotalPages  = pageSize > 0 ? (int)Math.Ceiling(count / (double)pageSize) : 0;

            // Aggiunge gli elementi della pagina corrente a questa lista
            AddRange(items);
        }

        /// <summary>
        /// Crea in modo asincrono una <see cref="PagedList{T}"/> a partire da una query <see cref="IQueryable{T}"/>.
        /// </summary>
        /// <param name="source">La query sorgente su cui applicare la paginazione.</param>
        /// <param name="pageNumber">Il numero di pagina richiesto (valori ≤ 0 diventano 1).</param>
        /// <param name="pageSize">La dimensione della pagina (valori ≤ 0 diventano 10).</param>
        /// <returns>Un'istanza di <see cref="PagedList{T}"/> popolata con gli elementi e i metadati di paginazione.</returns>
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            // Valori di default di sicurezza
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize   <= 0) pageSize   = 10;

            // Conta totale elementi della sorgente
            var count = await source.CountAsync();

            // Estrae gli elementi della pagina richiesta
            var items = await source
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
