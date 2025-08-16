using System.Security.Cryptography;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{

    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {

            using (var hmac = new HMACSHA512())
            {
                if (await UserExists(registerDto.Username))
                {
                    return BadRequest("Username is taken");
                }
                var user = new AppUser
                {
                    UserName = registerDto.Username.ToLower(),
                    PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return user;
            }

        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == login.Username.ToLower());

            if (user == null)
            {
                return Unauthorized("Invalid username");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(login.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Invalid password");
                }
            }

            return user;
        }



        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower()); // Bob==bob
        }
    }
}
