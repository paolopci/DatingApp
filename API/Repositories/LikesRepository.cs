using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;


namespace API.Repositories
{
    /// <summary>
    /// Repository per la gestione dei "mi piace" (Likes) tra utenti.
    /// Espone metodi per aggiungere/rimuovere un like, verificare l'esistenza
    /// di un like e ottenere elenchi di utenti in base al tipo di relazione
    /// (piaciuti, che hanno messo like, o match reciproci) con supporto alla paginazione.
    /// </summary>
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Crea una nuova istanza del repository dei Like.
        /// </summary>
        /// <param name="context">Il contesto EF Core.</param>
        /// <param name="mapper">L'istanza di AutoMapper per proiezioni DTO.</param>
        public LikesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Restituisce il like (se esiste) tra un utente sorgente e un utente destinazione.
        /// </summary>
        /// <param name="sourceUserId">Id dell'utente che mette il like.</param>
        /// <param name="targetUserId">Id dell'utente che riceve il like.</param>
        /// <returns>L'entità <see cref="UserLike"/> oppure null se non presente.</returns>
        public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        /// <summary>
        /// Restituisce, in modo paginato, l'elenco dei membri in base al predicato richiesto.
        /// </summary>
        /// <param name="likesParams">
        /// Parametri di filtro e paginazione:
        /// - <c>UserId</c>: utente corrente
        /// - <c>Predicate</c>: "liked" | "likedBy" | "matches"
        /// - <c>PageNumber</c>, <c>PageSize</c>
        /// </param>
        /// <returns>Una <see cref="PagedList{T}"/> di <see cref="MemberDto"/>.</returns>
        public async Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams)
        {
            // Query base sulle relazioni di like
            var likes = _context.Likes.AsQueryable();

            // Query di utenti da proiettare in DTO a seconda del predicato
            IQueryable<Entities.AppUser> usersQuery;

            switch ((likesParams.Predicate ?? "liked").ToLowerInvariant())
            {
                case "liked":
                    // Utenti che l'utente corrente ha messo like
                    usersQuery = likes
                        .Where(x => x.SourceUserId == likesParams.UserId)
                        .Select(x => x.TargetUser);
                    break;

                case "likedby":
                    // Utenti che hanno messo like all'utente corrente
                    usersQuery = likes
                        .Where(x => x.TargetUserId == likesParams.UserId)
                        .Select(x => x.SourceUser);
                    break;

                case "matches":
                    // Like reciproci: chi ha messo like a me e che anch'io ho messo like
                    var likeIds = await GetCurrentUserLikeIds(likesParams.UserId);
                    usersQuery = likes
                        .Where(x => x.TargetUserId == likesParams.UserId && likeIds.Contains(x.SourceUserId))
                        .Select(x => x.SourceUser);
                    break;

                default:
                    // Nessun risultato per predicati non riconosciuti
                    usersQuery = _context.Users.Where(_ => false);
                    break;
            }

            // Proietta gli utenti nel DTO e disabilita il tracking per performance
            var projected = usersQuery
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            // Applica la paginazione lato database e restituisce i metadati
            return await PagedList<MemberDto>.CreateAsync(projected, likesParams.PageNumber, likesParams.PageSize);
        }

        /// <summary>
        /// Restituisce gli Id degli utenti a cui l'utente corrente ha messo like.
        /// </summary>
        /// <param name="currentUserId">Id dell'utente corrente.</param>
        /// <returns>Sequenza di Id utente.</returns>
        public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
        {
            return await _context.Likes
                .Where(x => x.SourceUserId == currentUserId)
                .Select(x => x.TargetUserId)
                .ToListAsync();
        }

        /// <summary>
        /// Rimuove un like esistente.
        /// </summary>
        public void DeleteLike(UserLike like)
        {
            _context.Likes.Remove(like);
        }

        /// <summary>
        /// Aggiunge un nuovo like.
        /// </summary>
        public void AddLike(UserLike like)
        {
            _context.Likes.Add(like);
        }

        /// <summary>
        /// Salva le modifiche pendenti sul database.
        /// </summary>
        /// <returns>True se almeno una riga è stata modificata.</returns>
        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
