using Microsoft.EntityFrameworkCore;
using StudyOrganizer.Data;
using StudyTopics.Repositories.Interface;

namespace StudyTopics.Repositories.Implementations;

using StudyTopics.Models;

public class StudyTopicsRepository : IStudyTopicsRepository
{
    private readonly AppDbContext _context;

    public StudyTopicsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StudyTopics>> GetAllAsync()
    {
        return await _context.StudyTopic
                        .ToListAsync();
    }

    public async Task<IEnumerable<StudyTopics>> GetBySubjectIdAsync(int id)
    {
        return await _context.StudyTopic
                        .Where(topic => topic.SubjectId == id)
                        .Include(t => t.Subject)
                        .ToListAsync();
    }

    public async Task<IEnumerable<StudyTopics>> GetBySubjectIdAndCompletedAsync(int id)
    {
        return await _context.StudyTopic
                        .Where(topic => topic.SubjectId == id && topic.IsCompleted)
                        .Include(t => t.Subject)
                        .ToListAsync();
    }

    public async Task<StudyTopics?> GetByIdAsync(int id)
    {
        return await _context.StudyTopic.FindAsync(id);
    }

    public async Task AddAsync(StudyTopics topics)
    {
        await _context.StudyTopic.AddAsync(topics);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(StudyTopics topic)
    {
        _context.StudyTopic.Update(topic);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var studyTopics = await _context.StudyTopic.FindAsync(id);

        if(studyTopics != null)
        {
            _context.StudyTopic.Remove(studyTopics);
            await _context.SaveChangesAsync();
        }
    }
}