using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;


namespace API.Repositories
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public LikesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
        {
            var likes = _context.Likes.AsQueryable();
            var users = _context.Users.AsQueryable();

            if (predicate == "liked")
            {
                users = likes.Where(l => l.SourceUserId == userId)
                             .Select(l => l.TargetUser);
            }
            else if (predicate == "likedBy")
            {
                users = likes.Where(l => l.TargetUserId == userId)
                             .Select(l => l.SourceUser);
            }
            else
            {
                return new List<MemberDto>();
            }

            return await users
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
        {
            return await _context.Likes.Where(x => x.SourceUserId == currentUserId)
                                       .Select(x => x.TargetUserId)
                                        .ToListAsync();
        }

        public void DeleteLike(UserLike like)
        {
            _context.Likes.Remove(like);
        }

        public void AddLike(UserLike like)
        {
            _context.Likes.Add(like);
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
