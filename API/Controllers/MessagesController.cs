using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public MessagesController(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // GET: api/messages?container=Inbox|Outbox|Unread&pageNumber=&pageSize=
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>>  GetMessages([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages);

            return Ok(messages);
        }

        // GET: api/messages/thread/{username}
        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            var thread = await _messageRepository.GetMessagesThread(currentUsername, username);

            return Ok(thread);
        }

        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage([FromBody] CreateMessageDto createDto)
        {
            // Normalize usernames to ensure case-insensitive lookups
            var currentUsername = User.GetUsername();

            if (currentUsername.Equals(createDto.RecipientUsername, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("You cannot send messages to yourself");
            }

            var sender = await _userRepository.GetUserByUsernameAsync(currentUsername.ToLower());
            var recipient = await _userRepository.GetUserByUsernameAsync(createDto.RecipientUsername.ToLower());

            if (sender == null || recipient == null)
            {
                return NotFound("Sender or recipient not found");
            }

            var message = new Entities.Message
            {
                Sender = sender,
              //  SenderId = sender.Id,
                SenderUsername = sender.UserName,
                Recipient = recipient,
              //  RecipientId = recipient.Id,
                RecipientUsername = recipient.UserName,
                Content = createDto.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                var dto = _mapper.Map<MessageDto>(message);
                return Ok(dto);
            }

            return BadRequest("Failed to save message");
        }
    }
}
