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
            var query = _context.Users.AsQueryable();

            // Esclude l'utente corrente
            if (!string.IsNullOrWhiteSpace(userParams.CurrentUsername))
            {
                query = query.Where(u => u.UserName != userParams.CurrentUsername);
            }

            // Filtra per genere se specificato
            if (!string.IsNullOrWhiteSpace(userParams.Gender))
            {
                query = query.Where(u => u.Gender == userParams.Gender);
            }

            // Filtra per età inclusiva: Age >= MinAge e Age <= MaxAge
            // Traduzione su DateOfBirth:
            // - Age <= MaxAge => DateOfBirth >= today - MaxAge anni (nati dopo/uguale)
            // - Age >= MinAge => DateOfBirth <= today - MinAge anni (nati prima/uguale)
            if (userParams.MinAge > 0 || userParams.MaxAge > 0)
            {
                var minAge = userParams.MinAge;
                var maxAge = userParams.MaxAge;

                // Normalizza se invertiti
                if (minAge > maxAge)
                {
                    var tmp = minAge; minAge = maxAge; maxAge = tmp;
                }

                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var minDobInclusive = today.AddYears(-maxAge); // più giovane di MaxAge (>=)
                var maxDobInclusive = today.AddYears(-minAge); // più vecchio di MinAge (<=)

                query = query.Where(u => u.DateOfBirth >= minDobInclusive && u.DateOfBirth <= maxDobInclusive);
            }

            // Ordinamento combinando campo e direzione richiesti:
            // - Campo: userParams.OrderBy ("created" | "lastActive")
            // - Direzione: userParams.Sort ("asc" | "desc", default: "desc")
            var orderBy = (userParams.OrderBy ?? string.Empty).Trim().ToLowerInvariant();
            var dir = (userParams.Sort ?? "desc").Trim().ToLowerInvariant();
            var ascending = dir == "asc";

            query = orderBy switch
            {
                "created" => ascending ? query.OrderBy(u => u.Created)
                                        : query.OrderByDescending(u => u.Created),
                _ => ascending ? query.OrderBy(u => u.LastActive)
                                : query.OrderByDescending(u => u.LastActive)
            };

            var projected = query
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(projected, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await _context.Users.Where(x => x.UserName == username)
                                       .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                       .SingleOrDefaultAsync();
        }


    }
}
