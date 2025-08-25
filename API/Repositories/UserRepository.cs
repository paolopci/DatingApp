using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

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
            return await _context.Users.Include(x=>x.Photos).ToListAsync();
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
           return await _context.Users.FindAsync(id);
        }

        public async  Task<AppUser?> GetUserByUsernameAsync(string username)
        {
           return await _context.Users.Include(x=>x.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }
    }
}
