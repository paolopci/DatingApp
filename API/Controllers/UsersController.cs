using System.Collections;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;


        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;

        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetUsersAsync();

            return Ok(users);
        }


        [HttpGet("{id:int}")] // api/users/5
        public async Task<ActionResult<AppUser>>  GetUserId(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);

        }
        
        [HttpGet("{username}")] // api/users/5
        public async Task<ActionResult<AppUser>>  GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
           
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);

        }


    }
}
