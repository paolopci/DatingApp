using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "secret text";
        } 
        
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {

            var thing = _context.Users.Find(-1);
            if (thing==null)
            {
                return NotFound();
            }
            return thing;
        } 
        
        [HttpGet("server-error")]
        public ActionResult<AppUser> GetServerError()
        {
            var thing=_context.Users.Find(-1)?? throw new Exception("This is a server error");
            return thing;
        }
        
        [HttpGet("bad-request")]
        public ActionResult<AppUser> GetBadRequest()
        {
           
            return BadRequest("This was not a good request.");
        }

    }
}
