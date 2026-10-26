namespace Auth.Repositories.Interface;

using Auth.Models;

public interface IUserRepository
{
    Task<bool> AnyAsync();
    Task<AppUser?> GetByIdAsync(int id);
    Task<AppUser?> GetByEmailAsync(string normalizedEmail);
    Task AddAsync(AppUser user);
    Task UpdateAsync(AppUser user);
}
