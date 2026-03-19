using Microsoft.EntityFrameworkCore;

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
}