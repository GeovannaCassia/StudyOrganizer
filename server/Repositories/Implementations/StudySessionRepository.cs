using Microsoft.EntityFrameworkCore;
using StudyOrganizer.Data;
using StudySession.Repositories.Interface;

namespace StudySession.Repositories.Implementations;

using System.Runtime.CompilerServices;
using StudySession.Models;

public class StudySessionRepository : IStudySessionRepository
{
    private readonly AppDbContext _context;

    public StudySessionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StudySession>> GetAllAsync()
    {
        return await _context.StudySession.ToListAsync();
    } 

    public async Task <TimeSpan> GetTotalStudyTimeAsync()
    {
        var sessions = await _context.StudySession.ToListAsync();

        TimeSpan totalTime = TimeSpan.Zero;

        foreach (var session in sessions)
        {
            totalTime += session.EndTime - session.StartTime;
        }
        
        return totalTime;
    }

    public async Task<IEnumerable<StudySession?>> GetBySubjectAsync(int id)
    {
        return await _context.StudySession
                        .Where(session => session.SubjectId == id)
                        .ToListAsync();
    }

    public async Task<TimeSpan> GetTotalStudyTimeBySubjectAsync (int id)
    {
        var sessions = await _context.StudySession
                        .Where(session => session.SubjectId == id)
                        .ToListAsync();
        
        TimeSpan totalTime = TimeSpan.Zero;

        foreach (var session in sessions)
        {
            totalTime += session.EndTime - session.StartTime;
        }
        
        return totalTime;
    }

    public async Task AddAsync(StudySession session)
    {
        await _context.StudySession.AddAsync(session);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var session = await _context.StudySession.FindAsync(id);

        if(session != null)
        {
            _context.StudySession.Remove(session);
            await _context.SaveChangesAsync();
        }
    }
}
