namespace Auth.Services;

using System.Net.Mail;
using Auth.Models;
using Auth.Repositories.Interface;
using Microsoft.AspNetCore.Identity;
using StudyOrganizer.DTOs.Auth;
using StudyOrganizer.Exceptions;
using Subject.Repositories.Interface;

public record AuthResult(ResponseUserDTO User, string Token, DateTime ExpiresAt, bool Persistent);

public class AuthService
{
    private const string InvalidCredentials = "E-mail ou senha inválidos.";

    // Hash fictício verificado quando o e-mail não existe, para que a resposta demore o mesmo
    // que um login real (evita descobrir quais e-mails existem pelo tempo de resposta)
    private static readonly string DummyHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "senha-ficticia");

    private readonly IUserRepository _users;
    private readonly ISubjectRepository _subjects;
    private readonly IPasswordHasher<AppUser> _hasher;
    private readonly TokenService _tokens;
    private readonly JwtSettings _settings;

    public AuthService(
        IUserRepository users,
        ISubjectRepository subjects,
        IPasswordHasher<AppUser> hasher,
        TokenService tokens,
        JwtSettings settings)
    {
        _users = users;
        _subjects = subjects;
        _hasher = hasher;
        _tokens = tokens;
        _settings = settings;
    }

    public async Task<ResponseAuthStatusDTO> GetStatusAsync()
    {
        return new ResponseAuthStatusDTO { RegistrationOpen = !await _users.AnyAsync() };
    }

    // Só a primeira conta pode ser criada; ela "adota" as disciplinas que já existiam sem dono
    public async Task<AuthResult> RegisterAsync(RegisterDTO dto)
    {
        if (await _users.AnyAsync())
            throw new BusinessRuleException("O cadastro está fechado: já existe uma conta neste Study Organizer.");

        var name = ValidateName(dto.Name);
        var email = ValidateEmail(dto.Email);
        ValidatePassword(dto.Password);

        var user = new AppUser { Name = name, Email = email };
        user.PasswordHash = _hasher.HashPassword(user, dto.Password!);

        await _users.AddAsync(user);
        await _subjects.AssignOrphansToUserAsync(user.Id);

        return Issue(user, persistent: false);
    }

    public async Task<AuthResult> LoginAsync(LoginDTO dto)
    {
        var email = NormalizeEmail(dto.Email);
        var password = dto.Password ?? string.Empty;

        if (email.Length == 0 || password.Length == 0)
            throw new UnauthorizedException(InvalidCredentials);

        var user = await _users.GetByEmailAsync(email);

        if (user == null)
        {
            _hasher.VerifyHashedPassword(new AppUser(), DummyHash, password);
            throw new UnauthorizedException(InvalidCredentials);
        }

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedException(InvalidCredentials);

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _hasher.HashPassword(user, password);
            await _users.UpdateAsync(user);
        }

        return Issue(user, dto.RememberMe);
    }

    public async Task<ResponseUserDTO> GetCurrentUserAsync(int? userId)
    {
        var user = userId.HasValue ? await _users.GetByIdAsync(userId.Value) : null;

        if (user == null)
            throw new UnauthorizedException("Sua sessão expirou. Faça login novamente.");

        return ToDto(user);
    }

    private AuthResult Issue(AppUser user, bool persistent)
    {
        var expiresAt = persistent
            ? DateTime.UtcNow.AddDays(_settings.RememberMeDays)
            : DateTime.UtcNow.AddHours(_settings.SessionHours);

        return new AuthResult(ToDto(user), _tokens.CreateToken(user, expiresAt), expiresAt, persistent);
    }

    private static ResponseUserDTO ToDto(AppUser user)
    {
        return new ResponseUserDTO { Id = user.Id, Name = user.Name, Email = user.Email };
    }

    public static string NormalizeEmail(string? email)
    {
        return (email ?? string.Empty).Trim().ToLowerInvariant();
    }

    private static string ValidateName(string? name)
    {
        var trimmed = (name ?? string.Empty).Trim();

        if (trimmed.Length == 0)
            throw new BusinessRuleException("O nome é obrigatório.");

        if (trimmed.Length > 80)
            throw new BusinessRuleException("O nome pode ter no máximo 80 caracteres.");

        return trimmed;
    }

    private static string ValidateEmail(string? email)
    {
        var normalized = NormalizeEmail(email);

        if (normalized.Length == 0)
            throw new BusinessRuleException("O e-mail é obrigatório.");

        if (normalized.Length > 254 || !MailAddress.TryCreate(normalized, out var address) || address.Address != normalized)
            throw new BusinessRuleException("Informe um e-mail válido.");

        return normalized;
    }

    private static void ValidatePassword(string? password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            throw new BusinessRuleException("A senha deve ter pelo menos 8 caracteres.");

        if (password.Length > 128)
            throw new BusinessRuleException("A senha pode ter no máximo 128 caracteres.");

        if (!password.Any(char.IsLetter) || !password.Any(char.IsDigit))
            throw new BusinessRuleException("A senha deve ter letras e números.");
    }
}
