using Microsoft.EntityFrameworkCore;
using StudyOrganizer.Data;
using Subject.Repositories.Interface;

namespace Subject.Repositories.Implementations;

using Subject.Models;

public class SubjectRepository : ISubjectRepository
{
    private readonly AppDbContext _context;

    public SubjectRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Subject>> GetAllAsync()
    {
        return await _context.Subject.ToListAsync();
    }

    public async Task <Subject?> GetByIdAsync(int id)
    {
        return await _context.Subject.FindAsync(id);
    }

    public async Task AddAsync(Subject subject)
    {
        await _context.Subject.AddAsync(subject);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Subject subject)
    {
        _context.Subject.Update(subject);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var subject = await _context.Subject.FindAsync(id);

        if(subject != null)
        {
            _context.Subject.Remove(subject);
            await _context.SaveChangesAsync();
        }
    }
}
