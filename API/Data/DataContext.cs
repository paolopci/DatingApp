using API.Entities;
using Microsoft.EntityFrameworkCore;


namespace API.Data
{
    // DataContext è il punto di accesso a EF Core per questo progetto.
    // Definisce i DbSet (tabelle) e configura le relazioni tra le entità.
    public class DataContext : DbContext
    {
        /// <summary>
        /// Utenti dell'applicazione (tabella principale per autenticazione/profilo).
        /// </summary>
        public DbSet<AppUser> Users { get; set; }

        /// <summary>
        /// Foto caricate dagli utenti (relazione 1-N con AppUser).
        /// </summary>
        public DbSet<Photo> Photos { get; set; }

        /// <summary>
        /// Likes tra utenti (relazione molti-a-molti self-referencing tra AppUser).
        /// </summary>
        public DbSet<UserLike> Likes { get; set; }

        /// <summary>
        /// Messaggi scambiati tra utenti (relazione 1-N dal mittente e dal destinatario).
        /// </summary>
        public DbSet<Message> Messages { get; set; }

        /// <summary>
        /// Il costruttore riceve le opzioni dal container (connessione, provider, ecc.).
        /// </summary>
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        /// <summary>
        /// Configura il modello EF Core: chiavi, relazioni e comportamenti di eliminazione.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserLike: molti-a-molti self-referencing (un utente mette like ad un altro utente)
            modelBuilder.Entity<UserLike>(entity =>
            {
                // Chiave primaria composta: (SourceUserId, TargetUserId) garantisce unicità del like
                entity.HasKey(k => new { k.SourceUserId, k.TargetUserId });

                // Un utente (SourceUser) può mettere like a molti altri (LikedUsers)
                entity.HasOne(l => l.SourceUser)
                      .WithMany(u => u.LikedUsers)
                      .HasForeignKey(l => l.SourceUserId)
                      // Se elimino l'utente sorgente, cascata sui like emessi da lui
                      .OnDelete(DeleteBehavior.Cascade);

                // Un utente (TargetUser) può essere piaciuto da molti (LikedByUsers)
                entity.HasOne(l => l.TargetUser)
                      .WithMany(u => u.LikedByUsers)
                      .HasForeignKey(l => l.TargetUserId)
                      // NoAction per evitare cicli o eliminazioni a catena indesiderate
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // Message: ogni messaggio ha un mittente (Sender) e un destinatario (Recipient)
            modelBuilder.Entity<Message>(entity =>
            {
                // Evitiamo cascade delete su messaggi per non perdere cronologia
                entity.HasOne(x => x.Recipient)
                      .WithMany(x => x.MessagesReceived)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Sender)
                      .WithMany(x => x.MessagesSent)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
