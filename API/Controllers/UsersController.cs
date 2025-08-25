using System.Collections;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;


        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetUsersAsync();
            var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

            return Ok(usersToReturn);
        }


        [HttpGet("{id:int}")] // api/users/5
        public async Task<ActionResult<MemberDto>>  GetUserId(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound();
            }
            
            var userToReturn = _mapper.Map<MemberDto>(user);
            return Ok(userToReturn);

        }
        
        [HttpGet("{username}")] // api/users/5
        public async Task<ActionResult<MemberDto>>  GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
           
            if (user == null)
            {
                return NotFound();
            }

             var userToReturn = _mapper.Map<MemberDto>(user);
            return Ok(userToReturn);

        }


    }
}
