namespace Auth.Services;

using System.Security.Claims;
using System.Text;
using Auth.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

// Gera os tokens JWT assinados com a chave configurada em "Jwt:Key"
public class TokenService
{
    private readonly JwtSettings _settings;

    public TokenService(JwtSettings settings)
    {
        _settings = settings;
    }

    public string CreateToken(AppUser user, DateTime expiresAt)
    {
        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = _settings.Issuer,
            Audience = _settings.Audience,
            Expires = expiresAt,
            SigningCredentials = new SigningCredentials(_settings.SigningKey, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            })
        };

        return new JsonWebTokenHandler().CreateToken(descriptor);
    }
}

public class JwtSettings
{
    public const string CookieName = "so_token";

    public string Issuer { get; init; } = "StudyOrganizer";
    public string Audience { get; init; } = "StudyOrganizer";
    public int SessionHours { get; init; } = 8;
    public int RememberMeDays { get; init; } = 30;
    public required SymmetricSecurityKey SigningKey { get; init; }

    // A chave vem de "Jwt:Key" (user-secrets em desenvolvimento, variável de ambiente Jwt__Key em produção)
    public static JwtSettings FromConfiguration(IConfiguration configuration)
    {
        var section = configuration.GetSection("Jwt");
        var key = section["Key"];

        if (string.IsNullOrWhiteSpace(key) || Encoding.UTF8.GetByteCount(key) < 32)
        {
            throw new InvalidOperationException(
                "A chave do JWT não foi configurada ou tem menos de 32 bytes. " +
                "Em desenvolvimento, rode na pasta server: dotnet user-secrets set \"Jwt:Key\" \"<chave aleatória longa>\". " +
                "Em produção, defina a variável de ambiente Jwt__Key.");
        }

        return new JwtSettings
        {
            Issuer = section["Issuer"] ?? "StudyOrganizer",
            Audience = section["Audience"] ?? "StudyOrganizer",
            SessionHours = section.GetValue("SessionHours", 8),
            RememberMeDays = section.GetValue("RememberMeDays", 30),
            SigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    }
}
