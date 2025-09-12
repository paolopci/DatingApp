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
    /// <summary>
    /// Repository per la gestione dei messaggi tra utenti.
    /// L'interfaccia richiama MemberDto per alcuni metodi; qui forniamo
    /// implementazioni coerenti con le firme attuali.
    /// </summary>
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void  AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message?> GetMessage(int id)
        {
            // Include mittente e destinatario per avere contesto completo del messaggio
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Recipient)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var username = messageParams.Username.ToLower();

            var query = _context.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = (messageParams.Container ?? "Inbox").ToLowerInvariant() switch
            {
                "inbox" => query.Where(m => m.RecipientUsername.ToLower() == username && !m.RecipientDeleted),
                "outbox" => query.Where(m => m.SenderUsername.ToLower() == username && !m.SenderDeleted),
                "unread" => query.Where(m => m.RecipientUsername.ToLower() == username && m.DateRead == null && !m.RecipientDeleted),
                _ => query.Where(m => m.RecipientUsername.ToLower() == username && !m.RecipientDeleted)
            };

            var projected = query
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<MessageDto>.CreateAsync(projected, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesThread(string currentUsername, string recipientUsername)
        {
            var current = currentUsername.ToLower();
            var other = recipientUsername.ToLower();

            var threadQuery = _context.Messages
                .Where(m => (m.SenderUsername.ToLower() == current && m.RecipientUsername.ToLower() == other && !m.SenderDeleted)
                         || (m.SenderUsername.ToLower() == other && m.RecipientUsername.ToLower() == current && !m.RecipientDeleted))
                .OrderBy(m => m.MessageSent)
                .AsQueryable();

            var projected = threadQuery
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await projected.ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
