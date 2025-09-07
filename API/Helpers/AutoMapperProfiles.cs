using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,
                           opt => 
                               opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain)! .Url));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>()
                .ForMember(d => d.DateOfBirth, opt => opt.Ignore())
                .ForMember(d => d.PasswordHash, opt => opt.Ignore())
                .ForMember(d => d.PasswordSalt, opt => opt.Ignore())
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.Username!.ToLower()));
            CreateMap<AppUser, UserDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain) != null 
                        ? src.Photos.FirstOrDefault(x => x.IsMain)!.Url 
                        : null))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));
        }
    }
}
