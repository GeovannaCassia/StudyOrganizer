namespace Auth.Models;

public class AppUser
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Sempre gravado em minúsculas e sem espaços nas pontas (ver AuthService.NormalizeEmail)
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
