using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;

        public LikesController(ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
        }

        [HttpPost("{targetUserId:int}")]
        public async Task<ActionResult> ToggleLike(int targetUserId)
        {
            var sourceUserId = User.GetUserId();
            if (sourceUserId == targetUserId) return BadRequest("You cannot like yourself");


            var existingLike = await _likesRepository.GetUserLike(sourceUserId, targetUserId);

            if (existingLike == null)
            {
                var like = new UserLike
                {
                    SourceUserId = sourceUserId,
                    TargetUserId = targetUserId
                };

                _likesRepository.AddLike(like);
            }
            else
            {
                _likesRepository.DeleteLike(existingLike);
            }

            if (await _likesRepository.SaveChanges() )
            {
                return Ok();
            }

            return BadRequest("Failed to update like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
        {
            return Ok(await _likesRepository.GetCurrentUserLikeIds(User.GetUserId()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes(string predicate)
        {
            var users = await _likesRepository.GetUserLikes(predicate, User.GetUserId());
            
            
            
            return Ok(users);
        }
    }
}
