using System.Text.Json;
using API.Helpers;


namespace API.Extensions
{
    /// <summary>
    /// Metodi di estensione per <see cref="HttpResponse"/> utili nella gestione delle risposte HTTP.
    /// </summary>
    public static class HttpExtensions
    {
        /// <summary>
        /// Aggiunge un header di paginazione personalizzato ("Pagination") alla risposta HTTP.
        /// </summary>
        /// <typeparam name="T">Tipo degli elementi presenti nella lista paginata.</typeparam>
        /// <param name="response">La risposta HTTP su cui aggiungere l'header.</param>
        /// <param name="data">La lista paginata contenente i metadati di paginazione.</param>
        /// <remarks>
        /// L'header "Pagination" viene serializzato in JSON con notazione camelCase.
        /// Viene inoltre aggiunto l'header "Access-Control-Expose-Headers" per esporre
        /// "Pagination" ai client in contesti CORS.
        /// </remarks>
        public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data)
        {
            // Crea l'oggetto con i metadati di paginazione da inviare al client
            var paginationHeader =
                new PaginationHeader(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);

            // Serializza in JSON usando camelCase per compatibilità con le convenzioni JavaScript
            var jsonOptions = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            // Aggiunge l'header personalizzato con i dati di paginazione
            response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));

            // Espone l'header "Pagination" ai client (necessario per CORS)
            response.Headers.Append("Access-Control-Expose-Headers","Pagination");
        }
    }
}
