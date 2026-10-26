using Microsoft.EntityFrameworkCore;
using StudyOrganizer.Data;
using Auth.Repositories.Interface;

namespace Auth.Repositories.Implementations;

using Auth.Models;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AnyAsync()
    {
        return await _context.Users.AnyAsync();
    }

    public async Task<AppUser?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser?> GetByEmailAsync(string normalizedEmail)
    {
        return await _context.Users.FirstOrDefaultAsync(user => user.Email == normalizedEmail);
    }

    public async Task AddAsync(AppUser user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(AppUser user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}
