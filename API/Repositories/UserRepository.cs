using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;


namespace API.Repositories
{
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
    {
        private readonly DataContext _context = context;
        private readonly IMapper _mapper = mapper;

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;// Segna l'entità come modificata
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;// Restituisce true se almeno una riga è stata modificata
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(x => x.Photos).ToListAsync();
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await _context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider);
            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await _context.Users.Where(x => x.UserName == username)
                                       .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                       .SingleOrDefaultAsync();
        }

       
    }
}
