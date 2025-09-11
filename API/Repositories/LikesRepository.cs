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

            switch (predicate)
            {
                case "liked":
                    return await likes
                        .Where(x => x.SourceUserId == userId)
                        .Select(x => x.TargetUser)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .AsNoTracking()
                        .ToListAsync();

                case "likedBy":
                    return await likes
                        .Where(x => x.TargetUserId == userId)
                        .Select(x => x.SourceUser)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .AsNoTracking()
                        .ToListAsync();

                case "matches":
                    var likeIds = await GetCurrentUserLikeIds(userId);
                    return await likes
                        .Where(x => x.TargetUserId == userId && likeIds.Contains(x.SourceUserId))
                        .Select(x => x.SourceUser)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .AsNoTracking()
                        .ToListAsync();

                default:
                    return new List<MemberDto>();
            }
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
