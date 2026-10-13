using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace StudyOrganizer.Data;

using Subject.Models;
using StudyTopics.Models;
using StudySession.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

public class AppDbContext : DbContext
{
    public DbSet<Subject> Subject { get; set;}
    public DbSet<StudyTopics> StudyTopic { get; set; }
    public DbSet<StudySession> StudySession { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
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