using API.Entities;
using Microsoft.EntityFrameworkCore;


namespace API.Data
{
    public class DataContext : DbContext
    {
        public DbSet<AppUser>Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserLike> Likes { get; set; }

        public DataContext(DbContextOptions options):base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserLike: self-referencing many-to-many (User likes User)
            modelBuilder.Entity<UserLike>(entity =>
            {
                entity.HasKey(k => new { k.SourceUserId, k.TargetUserId });

                entity.HasOne(l => l.SourceUser)
                      .WithMany(u => u.LikedUsers)
                      .HasForeignKey(l => l.SourceUserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(l => l.TargetUser)
                      .WithMany(u => u.LikedByUsers)
                      .HasForeignKey(l => l.TargetUserId)
                      .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
