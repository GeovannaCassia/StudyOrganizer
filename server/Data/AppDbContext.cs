using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace StudyOrganizer.Data;

using Subject.Models;
using StudyTopics.Models;
using StudySession.Models;
using Auth.Models;
using Auth.Services;

public class AppDbContext : DbContext
{
    private readonly ICurrentUserService _currentUser;

    public DbSet<Subject> Subject { get; set;}
    public DbSet<StudyTopics> StudyTopic { get; set; }
    public DbSet<StudySession> StudySession { get; set; }
    public DbSet<AppUser> Users { get; set; }

    // Usado pelos filtros abaixo; o EF avalia a cada consulta, não só na criação do modelo
    private int? CurrentUserId => _currentUser.UserId;

    public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUser)
        : base(options)
    {
        _currentUser = currentUser;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(user =>
        {
            user.HasIndex(u => u.Email).IsUnique();
            user.Property(u => u.Name).HasMaxLength(80);
            user.Property(u => u.Email).HasMaxLength(254);
        });

        modelBuilder.Entity<Subject>()
            .HasOne(subject => subject.User)
            .WithMany()
            .HasForeignKey(subject => subject.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Cada usuário só enxerga os próprios dados: toda consulta (inclusive FindAsync)
        // passa por estes filtros, então nenhum repositório precisa lembrar de filtrar
        modelBuilder.Entity<Subject>().HasQueryFilter(subject => subject.UserId == CurrentUserId);
        modelBuilder.Entity<StudyTopics>().HasQueryFilter(topic => topic.Subject.UserId == CurrentUserId);
        modelBuilder.Entity<StudySession>().HasQueryFilter(session => session.Subject.UserId == CurrentUserId);
    }

    // O SQLite não guarda o fuso das datas: todas são gravadas e lidas como UTC,
    // para que a API devolva as datas com "Z" e o frontend converta para o horário local
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
    }

    private class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter()
            : base(
                value => value.Kind == DateTimeKind.Local ? value.ToUniversalTime() : value,
                value => DateTime.SpecifyKind(value, DateTimeKind.Utc))
        {
        }
    }
}