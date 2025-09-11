using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Controller per la gestione dei like tra utenti.
    /// Espone endpoint per creare/rimuovere un like e per ottenere liste paginate
    /// di utenti in base al tipo di relazione (liked, likedBy, matches).
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;

        /// <summary>
        /// Crea una nuova istanza del controller dei Like.
        /// </summary>
        /// <param name="likesRepository">Repository dei like iniettato via DI.</param>
        public LikesController(ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
        }

        /// <summary>
        /// Crea o rimuove un like tra l'utente corrente e l'utente target.
        /// Se il like non esiste, lo crea; se esiste, lo rimuove (toggle).
        /// </summary>
        /// <param name="targetUserId">Id dell'utente destinatario del like.</param>
        /// <returns>200 OK in caso di successo, 400 in caso di errore.</returns>
        [HttpPost("{targetUserId:int}")]
        public async Task<ActionResult> ToggleLike(int targetUserId)
        {
            // Recupera l'Id dell'utente autenticato dai claim
            var sourceUserId = User.GetUserId();
            if (sourceUserId == targetUserId) return BadRequest("You cannot like yourself");


            var existingLike = await _likesRepository.GetUserLike(sourceUserId, targetUserId);

            if (existingLike == null)
            {
                // Crea un nuovo like
                var like = new UserLike
                {
                    SourceUserId = sourceUserId,
                    TargetUserId = targetUserId
                };

                _likesRepository.AddLike(like);
            }
            else
            {
                // Rimuove il like esistente
                _likesRepository.DeleteLike(existingLike);
            }

            if (await _likesRepository.SaveChanges() )
            {
                return Ok();
            }

            return BadRequest("Failed to update like");
        }

        /// <summary>
        /// Restituisce la lista (non paginata) degli Id utente a cui l'utente corrente ha messo like.
        /// Utile per scenari client in cui si vogliono evidenziare le card già "likate".
        /// </summary>
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
        {
            return Ok(await _likesRepository.GetCurrentUserLikeIds(User.GetUserId()));
        }

        /// <summary>
        /// Restituisce una lista paginata di utenti in base al predicato richiesto:
        /// - liked: utenti che ho messo like
        /// - likedBy: utenti che mi hanno messo like
        /// - matches: like reciproci
        /// Include gli header di paginazione nella risposta.
        /// </summary>
        /// <param name="likesParams">Parametri di filtro e paginazione.</param>
        /// <returns>Lista paginata di <see cref="MemberDto"/>.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            // Collega l'utente corrente ai parametri (sicurezza lato server)
            likesParams.UserId = User.GetUserId();

            var result = await _likesRepository.GetUserLikes(likesParams);

            // Aggiunge gli header di paginazione per il client
            Response.AddPaginationHeader(result);

            return Ok(result);
        }
    }
}
